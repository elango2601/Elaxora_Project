from fastapi import APIRouter, Depends
from database import db
from auth import get_current_admin

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
async def get_dashboard_summary(admin: str = Depends(get_current_admin)):
    # 1. Projects count
    total_projects = await db.db["projects"].count_documents({})
    
    # 2. Enquiry counts
    total_enquiries = await db.db["enquiries"].count_documents({})
    new_enquiries = await db.db["enquiries"].count_documents({"status": "New"})
    
    # 3. Quotation counts
    total_quotations = await db.db["quotes"].count_documents({})
    pending_quotes = await db.db["quotes"].count_documents({"status": {"$in": ["Draft", "Sent"]}})
    
    # 3. Order status breakdowns
    active_orders = await db.db["orders"].count_documents({
        "order_status": {"$in": ["Advance Paid", "Scope Locked", "Development", "Demo Ready", "Revision", "Final Payment Pending"]}
    })
    completed_orders = await db.db["orders"].count_documents({"order_status": "Completed"})
    total_orders = await db.db["orders"].count_documents({})
    
    # 4. Total revenue (sum of payments embedded in orders)
    rev_pipeline = [
        {"$unwind": "$payments"},
        {"$group": {"_id": None, "total": {"$sum": "$payments.amount"}}}
    ]
    rev_cursor = db.db["orders"].aggregate(rev_pipeline)
    rev_res = await rev_cursor.to_list(1)
    total_revenue = rev_res[0]["total"] if rev_res else 0.0
    
    # 5. Pending payments (Total order price - Payments recorded)
    price_pipeline = [
        {"$group": {"_id": None, "total_price": {"$sum": "$price"}}}
    ]
    price_cursor = db.db["orders"].aggregate(price_pipeline)
    price_res = await price_cursor.to_list(1)
    total_value = price_res[0]["total_price"] if price_res else 0.0
    pending_payments = max(0.0, total_value - total_revenue)
    
    # 6. Referral commissions
    ref_pipeline = [
        {"$group": {
            "_id": None, 
            "total_commission": {"$sum": "$total_commission"},
            "paid_commission": {"$sum": "$paid_commission"},
            "pending_commission": {"$sum": "$pending_commission"}
        }}
    ]
    ref_cursor = db.db["referrals"].aggregate(ref_pipeline)
    ref_res = await ref_cursor.to_list(1)
    total_comm = ref_res[0]["total_commission"] if ref_res else 0.0
    pending_comm = ref_res[0]["pending_commission"] if ref_res else 0.0
    
    # 7. Conversion Rate (Converted orders / Total enquiries)
    conversion_rate = 0.0
    if total_enquiries > 0:
        conversion_rate = round((total_orders / total_enquiries) * 100, 1)

    # 8. Department counts for projects catalog popularity (simple counter)
    dept_pipeline = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}}
    ]
    dept_cursor = db.db["enquiries"].aggregate(dept_pipeline)
    dept_res = await dept_cursor.to_list(100)
    dept_breakdown = {item["_id"]: item["count"] for item in dept_res if item["_id"]}

    # Return standard analytics format
    return {
        "kpis": {
            "total_projects": total_projects,
            "new_enquiries": new_enquiries,
            "pending_quotes": pending_quotes,
            "active_orders": active_orders,
            "completed_orders": completed_orders,
            "total_revenue": total_revenue,
            "pending_payments": pending_payments,
            "referral_commissions": total_comm,
            "conversion_rate": f"{conversion_rate}%"
        },
        "breakdowns": {
            "departments": dept_breakdown
        }
    }
