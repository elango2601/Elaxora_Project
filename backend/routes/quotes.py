from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from schemas import QuoteCreate, QuoteUpdate, QuoteResponse
from database import db, serialize_doc, serialize_docs
from auth import get_current_admin
import os
import resend

router = APIRouter(prefix="/quotes", tags=["Quotations"])

resend.api_key = os.environ.get("RESEND_API_KEY", "re_Gg4ugo82_AVgM7wbvEhDYn8dJK3HDjrd7")

def send_quote_email(student_name: str, student_email: str, quote_id: str):
    quote_url = f"http://localhost:3000/quote/{quote_id}"
    
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Elaxora Solutions</h2>
        <p>Hello <strong>{student_name}</strong>,</p>
        <p>Your custom project quotation has been generated. You can review the pricing breakdown, scope of work, and milestones by clicking the link below:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{quote_url}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Quotation</a>
        </div>
        <p>If you're happy with the scope, you can accept the quote directly on that page to secure your slot.</p>
        <p>Best regards,<br>The Elaxora Team</p>
    </div>
    """
    
    try:
        r = resend.Emails.send({
            "from": "Elaxora Solutions <quotes@elaxorasolutions.com>",
            "to": [student_email],
            "subject": "Your Custom Project Quotation",
            "html": html_content
        })
        print(f"Resend email dispatched: {r}")
    except Exception as e:
        print(f"Resend API error (Add real API key to environment): {e}")


@router.get("", response_model=List[QuoteResponse])
async def list_quotes(admin: str = Depends(get_current_admin)):
    quotes = await db.db["quotes"].find({}).sort("created_at", -1).to_list(1000)
    return serialize_docs(quotes)

@router.post("", response_model=QuoteResponse, status_code=201)
async def create_quote(
    quote_data: QuoteCreate,
    admin: str = Depends(get_current_admin)
):
    # Verify enquiry exists
    enquiry = await db.db["enquiries"].find_one({"_id": quote_data.enquiry_id})
    if not enquiry:
        raise HTTPException(status_code=400, detail="Enquiry not found")

    # Generate sequential Quote ID
    count = await db.db["quotes"].count_documents({})
    quote_short_id = f"PF-QT-{1000 + count + 1}"
    
    quote_dict = quote_data.model_dump()
    quote_dict["id"] = quote_short_id
    quote_dict["_id"] = quote_short_id
    quote_dict["status"] = "Sent"  # Automatically set to Sent when created by admin
    quote_dict["created_at"] = datetime.utcnow()
    
    await db.db["quotes"].insert_one(quote_dict)
    
    # Update Enquiry status
    await db.db["enquiries"].update_one(
        {"_id": quote_data.enquiry_id},
        {"$set": {"status": "Quote Sent"}}
    )
    
    # Send automated email via Resend
    send_quote_email(
        student_name=enquiry.get("full_name", "Student"),
        student_email=enquiry.get("email"),
        quote_id=quote_short_id
    )
    
    return serialize_doc(quote_dict)

@router.get("/{id}", response_model=QuoteResponse)
async def get_quote(id: str):
    # Public route so students can view their quote page using the quote link
    quote = await db.db["quotes"].find_one({"_id": id})
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return serialize_doc(quote)

@router.post("/{id}/accept", response_model=QuoteResponse)
async def accept_quote(id: str):
    quote = await db.db["quotes"].find_one({"_id": id})
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
        
    if quote["status"] == "Accepted":
        return serialize_doc(quote)
        
    # Update quote status
    updated_quote = await db.db["quotes"].find_one_and_update(
        {"_id": id},
        {"$set": {"status": "Accepted"}},
        return_document=True
    )
    
    # Retrieve matching enquiry
    enquiry = await db.db["enquiries"].find_one({"_id": quote["enquiry_id"]})
    
    # Create matching order in DB
    order_id = f"PF-ORD-{id.split('-')[-1]}" # E.g. PF-ORD-1001 if quote was PF-QT-1001
    
    # Check if order already exists
    existing_order = await db.db["orders"].find_one({"_id": order_id})
    if not existing_order:
        # Determine milestones based on project price
        price = quote["final_price"]
        order_milestones = []
        
        # Structure milestones visual display
        if price < 5000:
            # 50% advance + 50% final
            order_milestones = [
                {"name": "Requirements Confirmed", "status": "Completed", "due_date": ""},
                {"name": "Advance Payment Received", "status": "Pending", "due_date": ""},
                {"name": "Architecture Setup", "status": "Pending", "due_date": ""},
                {"name": "Core Development", "status": "Pending", "due_date": ""},
                {"name": "Demo Ready", "status": "Pending", "due_date": ""},
                {"name": "Final Payment Received", "status": "Pending", "due_date": ""},
                {"name": "Project Delivery", "status": "Pending", "due_date": ""}
            ]
        else:
            # 40% advance + 30% milestone + 30% final
            order_milestones = [
                {"name": "Requirements Confirmed", "status": "Completed", "due_date": ""},
                {"name": "Advance Payment Received", "status": "Pending", "due_date": ""},
                {"name": "Architecture Setup", "status": "Pending", "due_date": ""},
                {"name": "Core Development", "status": "Pending", "due_date": ""},
                {"name": "Milestone Payment Received", "status": "Pending", "due_date": ""},
                {"name": "Integration & Testing", "status": "Pending", "due_date": ""},
                {"name": "Demo Ready", "status": "Pending", "due_date": ""},
                {"name": "Final Payment Received", "status": "Pending", "due_date": ""},
                {"name": "Project Delivery", "status": "Pending", "due_date": ""}
            ]
            
        order_dict = {
            "id": order_id,
            "_id": order_id,
            "enquiry_id": quote["enquiry_id"],
            "quote_id": id,
            "student_name": enquiry["full_name"] if enquiry else "Student",
            "student_email": enquiry["email"] if enquiry else "",
            "student_whatsapp": enquiry["whatsapp_number"] if enquiry else "",
            "project_title": enquiry["message"].split('\n')[0][:50] if enquiry and enquiry.get("message") else "Custom Project Development",
            "scope_status": "PENDING_LOCK",
            "features": [f.strip() for f in quote["scope_of_work"].split('\n') if f.strip()],
            "technology": enquiry["preferred_technology"].split(',') if enquiry else [],
            "deliverables": ["Source Code", "Database configuration", "Local installation guide"],
            "price": price,
            "advance_paid": False,
            "payment_status": "Pending",
            "order_status": "Advance Pending",
            "progress_percent": 15,
            "milestones": order_milestones,
            "payments": [],
            "revision_count_limit": 2, # Default
            "revision_count_used": 0,
            "revisions": [],
            "change_requests": [],
            "referral_code": enquiry["referral_code"] if enquiry else "",
            "created_at": datetime.utcnow()
        }
        await db.db["orders"].insert_one(order_dict)
        
        # If referral code was used, register a pending conversion
        if order_dict["referral_code"]:
            ref_code = order_dict["referral_code"]
            referral = await db.db["referrals"].find_one({"code": ref_code, "active": True})
            if referral:
                commission_amt = price * (referral["commission_percentage"] / 100.0)
                await db.db["referrals"].update_one(
                    {"code": ref_code},
                    {
                        "$inc": {
                            "total_orders": 1,
                            "total_revenue": price,
                            "pending_commission": commission_amt,
                            "total_commission": commission_amt
                        }
                    }
                )
                
    # Update Enquiry status to Converted
    if enquiry:
        await db.db["enquiries"].update_one(
            {"_id": quote["enquiry_id"]},
            {"$set": {"status": "Converted"}}
        )
        
    return serialize_doc(updated_quote)

@router.post("/{id}/reject", response_model=QuoteResponse)
async def reject_quote(id: str, feedback: Optional[dict] = None):
    # Mark quote status as Change Requested
    quote = await db.db["quotes"].find_one({"_id": id})
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
        
    change_msg = feedback.get("feedback", "Student requested changes.") if feedback else "Student requested changes."
    
    updated_quote = await db.db["quotes"].find_one_and_update(
        {"_id": id},
        {"$set": {"status": "Change Requested"}},
        return_document=True
    )
    
    # Log note in enquiry
    await db.db["enquiries"].update_one(
        {"_id": quote["enquiry_id"]},
        {
            "$set": {"status": "Negotiating"},
            "$push": {"notes": f"Quotation PF-QT-{id.split('-')[-1]} Change Requested: {change_msg}"}
        }
    )
    
    return serialize_doc(updated_quote)
