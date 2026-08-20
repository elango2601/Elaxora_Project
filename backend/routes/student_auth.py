from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import random
import os
from datetime import datetime, timedelta
from database import db, serialize_doc, serialize_docs
from auth import create_access_token, get_current_student
import resend

router = APIRouter(prefix="/student", tags=["Student Portal"])

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str

def generate_otp():
    return str(random.randint(100000, 999999))

@router.post("/request-otp")
async def request_otp(req: OTPRequest):
    email = req.email.strip().lower()
    
    # Check if this email exists in enquiries
    enquiry = await db.db["enquiries"].find_one({"email": email})
    if not enquiry:
        raise HTTPException(status_code=404, detail="Email not found in our system. Have you submitted an enquiry?")
        
    # Generate OTP
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Save OTP to DB
    await db.db["student_otps"].update_one(
        {"email": email},
        {"$set": {"otp": otp, "expires_at": expires_at}},
        upsert=True
    )
    
    # Send OTP via Resend
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Elaxora Solutions Portal</h2>
        <p>Hello,</p>
        <p>Your one-time password (OTP) to access your student portal is:</p>
        <h1 style="text-align: center; letter-spacing: 5px; color: #1e293b;">{otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>Best regards,<br>The Elaxora Team</p>
    </div>
    """
    
    try:
        resend.Emails.send({
            "from": "Elaxora Solutions <quotes@elaxorasolutions.com>",
            "to": [email],
            "subject": "Your Student Portal Login Code",
            "html": html_content
        })
    except Exception as e:
        print(f"Failed to send OTP via Resend: {e}")
        
    return {"message": "OTP sent to email successfully."}

@router.post("/verify-otp")
async def verify_otp(req: OTPVerify):
    email = req.email.strip().lower()
    
    record = await db.db["student_otps"].find_one({"email": email})
    if not record:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")
        
    if record["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code.")
        
    if datetime.utcnow() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
        
    # Clean up used OTP
    await db.db["student_otps"].delete_one({"email": email})
    
    # Issue JWT token
    access_token_expires = timedelta(days=7)
    access_token = create_access_token(
        data={"sub": email, "role": "student"},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/dashboard")
async def get_student_dashboard(email: str = Depends(get_current_student)):
    # Find all enquiries by this email
    enquiries = await db.db["enquiries"].find({"email": email}).to_list(None)
    enquiry_ids = [str(e["_id"]) for e in enquiries]
    
    # Find quotes and orders tied to these enquiries
    quotes = await db.db["quotes"].find({"enquiry_id": {"$in": enquiry_ids}}).sort("created_at", -1).to_list(None)
    orders = await db.db["orders"].find({"student_email": email}).sort("created_at", -1).to_list(None)
    
    return {
        "profile": {
            "name": enquiries[0]["full_name"] if enquiries else "Student",
            "email": email,
            "college": enquiries[0]["college_name"] if enquiries else ""
        },
        "enquiries": serialize_docs(enquiries),
        "quotes": serialize_docs(quotes),
        "orders": serialize_docs(orders)
    }
