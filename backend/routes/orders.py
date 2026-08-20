from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
import uuid
from schemas import (
    OrderResponse, OrderProgressUpdate, ChangeRequestCreate, 
    ChangeRequestUpdate, PaymentRecordCreate
)
from database import db, serialize_doc, serialize_docs
from auth import get_current_admin

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/payments/all")
async def list_all_payments(admin: str = Depends(get_current_admin)):
    orders = await db.db["orders"].find({"payments": {"$exists": True, "$not": {"$size": 0}}}).to_list(1000)
    flat_payments = []
    for order in orders:
        for p in order.get("payments", []):
            flat_payments.append({
                "order_id": order["id"],
                "student_name": order["student_name"],
                "student_email": order.get("student_email", ""),
                "amount": p["amount"],
                "phase": p["phase"],
                "recorded_at": p["recorded_at"],
                "notes": p.get("notes", ""),
                "status": p.get("status", "Completed"),
                "id": p.get("id", "")
            })
    flat_payments.sort(key=lambda x: str(x["recorded_at"]), reverse=True)
    return flat_payments

@router.get("/customers/list")
async def list_customers(admin: str = Depends(get_current_admin)):
    enqs = await db.db["enquiries"].find({}).to_list(1000)
    enq_map = {}
    for e in enqs:
        email = e.get("email", "").lower().strip() if e.get("email") else ""
        if email:
            enq_map[email] = e.get("college_name", "N/A")
            
    orders = await db.db["orders"].find({}).to_list(1000)
    customers_map = {}
    for o in orders:
        email = o.get("student_email", "").lower().strip() if o.get("student_email") else ""
        if not email:
            continue
        total_spent = sum(p["amount"] for p in o.get("payments", []))
        if email not in customers_map:
            customers_map[email] = {
                "name": o["student_name"],
                "email": o["student_email"],
                "whatsapp": o["student_whatsapp"],
                "college": enq_map.get(email, "N/A"),
                "orders_count": 1,
                "total_spent": total_spent
            }
        else:
            customers_map[email]["orders_count"] += 1
            customers_map[email]["total_spent"] += total_spent
            
    for e in enqs:
        email = e.get("email", "").lower().strip() if e.get("email") else ""
        if not email or email in customers_map:
            continue
        customers_map[email] = {
            "name": e["full_name"],
            "email": e["email"],
            "whatsapp": e["whatsapp_number"],
            "college": e.get("college_name", "N/A"),
            "orders_count": 0,
            "total_spent": 0.0
        }
    return list(customers_map.values())

@router.get("", response_model=List[OrderResponse])
async def list_orders(admin: str = Depends(get_current_admin)):
    cursor = db.db["orders"].find().sort("created_at", -1)
    orders = await cursor.to_list(length=100)
    return serialize_docs(orders)

@router.get("/{id}", response_model=OrderResponse)
async def get_order(id: str):
    # Public page for customer progress checks via unique token/id URL
    order = await db.db["orders"].find_one({"_id": id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_doc(order)

@router.put("/{id}/progress", response_model=OrderResponse)
async def update_order_progress(
    id: str,
    progress_data: OrderProgressUpdate,
    admin: str = Depends(get_current_admin)
):
    order = await db.db["orders"].find_one({"_id": id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    update_dict = {
        "order_status": progress_data.order_status,
        "progress_percent": progress_data.progress_percent,
        "milestones": [m.model_dump() for m in progress_data.milestones]
    }
    
    if progress_data.revision_count_used is not None:
        update_dict["revision_count_used"] = progress_data.revision_count_used

    updated_order = await db.db["orders"].find_one_and_update(
        {"_id": id},
        {"$set": update_dict},
        return_document=True
    )
    return serialize_doc(updated_order)

@router.post("/{id}/payment", response_model=OrderResponse)
async def record_payment(
    id: str,
    payment_data: PaymentRecordCreate,
    admin: str = Depends(get_current_admin)
):
    order = await db.db["orders"].find_one({"_id": id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Generate a unique payment record ID
    payment_record = {
        "id": f"PAY-{uuid.uuid4().hex[:6].upper()}",
        "amount": payment_data.amount,
        "phase": payment_data.phase,  # Advance, Milestone, Final, Change Request
        "status": "Paid",
        "recorded_at": datetime.utcnow(),
        "notes": payment_data.notes
    }

    # Update states depending on phase
    updates = {}
    
    if payment_data.phase.lower() == "advance":
        updates["advance_paid"] = True
        updates["payment_status"] = "Advance Paid"
        updates["scope_status"] = "LOCKED"
        updates["order_status"] = "Scope Locked"
        
        # Mark Milestone "Advance Payment Received" as Completed
        milestones = order.get("milestones", [])
        for m in milestones:
            if "advance" in m["name"].lower():
                m["status"] = "Completed"
        updates["milestones"] = milestones
        
    elif payment_data.phase.lower() == "milestone":
        updates["payment_status"] = "Milestone Paid"
        milestones = order.get("milestones", [])
        for m in milestones:
            if "milestone" in m["name"].lower():
                m["status"] = "Completed"
        updates["milestones"] = milestones
        
    elif payment_data.phase.lower() == "final":
        updates["payment_status"] = "Fully Paid"
        milestones = order.get("milestones", [])
        for m in milestones:
            if "final" in m["name"].lower():
                m["status"] = "Completed"
        updates["milestones"] = milestones

    # Record the payment and update the state
    updated_order = await db.db["orders"].find_one_and_update(
        {"_id": id},
        {
            "$push": {"payments": payment_record},
            "$set": updates
        },
        return_document=True
    )
    
    # Audit log entry added to order notes
    log_text = f"Payment of ₹{payment_data.amount} recorded for {payment_data.phase} phase on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}"
    await db.db["orders"].update_one(
        {"_id": id},
        {"$push": {"notes": log_text}}
    )
    
    # Retrieve updated influencer referral data if fully paid to log payout revenue
    if payment_data.phase.lower() == "final" and order.get("referral_code"):
        ref_code = order["referral_code"]
        referral = await db.db["referrals"].find_one({"code": ref_code})
        if referral:
            # Shift from pending_commission to actual commission payable or note order completed
            await db.db["referrals"].update_one(
                {"code": ref_code},
                {
                    "$inc": {
                        "pending_commission": -(referral["commission_percentage"] / 100.0 * order["price"]),
                        "paid_commission": (referral["commission_percentage"] / 100.0 * order["price"])
                    }
                }
            )

    return serialize_doc(updated_order)

# -----------------
# Change Requests (CRUD)
# -----------------
@router.post("/{id}/change-requests", response_model=OrderResponse)
async def create_change_request(
    id: str,
    cr_data: ChangeRequestCreate
):
    # Public endpoint allowed for students accessing status view
    order = await db.db["orders"].find_one({"_id": id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # Generate unique change request short ID
    cr_count = len(order.get("change_requests", []))
    cr_id = f"CR-{cr_count + 1}"
    
    change_request = {
        "id": cr_id,
        "description": cr_data.description,
        "reason": cr_data.reason,
        "priority": cr_data.priority,
        "additional_cost": 0.0,
        "additional_timeline": "",
        "status": "Requested",
        "created_at": datetime.utcnow()
    }
    
    updated_order = await db.db["orders"].find_one_and_update(
        {"_id": id},
        {"$push": {"change_requests": change_request}},
        return_document=True
    )
    return serialize_doc(updated_order)

@router.put("/{id}/change-requests/{cr_id}", response_model=OrderResponse)
async def admin_update_change_request(
    id: str,
    cr_id: str,
    cr_update: ChangeRequestUpdate,
    admin: str = Depends(get_current_admin)
):
    order = await db.db["orders"].find_one({"_id": id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    change_requests = order.get("change_requests", [])
    found = False
    
    for cr in change_requests:
        if cr["id"] == cr_id:
            cr["status"] = cr_update.status
            cr["additional_cost"] = cr_update.additional_cost
            cr["additional_timeline"] = cr_update.additional_timeline
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Change request not found")
        
    # If the admin sets status to Approved, update the Order price and scope additions
    updates = {"change_requests": change_requests}
    if cr_update.status.lower() == "approved":
        # Add to total price
        updates["price"] = order["price"] + cr_update.additional_cost
        
    updated_order = await db.db["orders"].find_one_and_update(
        {"_id": id},
        {"$set": updates},
        return_document=True
    )
    return serialize_doc(updated_order)

@router.post("/{id}/change-requests/{cr_id}/accept", response_model=OrderResponse)
async def student_accept_change_request_quote(
    id: str,
    cr_id: str
):
    # Student accepts the additional price quoted for change request
    order = await db.db["orders"].find_one({"_id": id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    change_requests = order.get("change_requests", [])
    found = False
    quoted_cost = 0.0
    quoted_desc = ""
    
    for cr in change_requests:
        if cr["id"] == cr_id and cr["status"] == "Quote Sent":
            cr["status"] = "Approved"
            quoted_cost = cr["additional_cost"]
            quoted_desc = cr["description"]
            found = True
            break
            
    if not found:
        raise HTTPException(
            status_code=400, 
            detail="Change request is not quoted, or already approved/rejected."
        )
        
    # Lock the change request features into the main order features scope
    new_features = order.get("features", [])
    new_features.append(f"[Change Request Add-On] {quoted_desc}")
    
    updated_order = await db.db["orders"].find_one_and_update(
        {"_id": id},
        {
            "$set": {
                "change_requests": change_requests,
                "price": order["price"] + quoted_cost,
                "features": new_features
            }
        },
        return_document=True
    )
    return serialize_doc(updated_order)
