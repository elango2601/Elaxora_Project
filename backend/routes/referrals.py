from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from schemas import ReferralCreate, ReferralResponse
from database import db, serialize_doc, serialize_docs
from auth import get_current_admin

router = APIRouter(prefix="/referrals", tags=["Referrals"])

@router.get("/validate/{code}")
async def validate_referral_code(code: str):
    code_upper = code.strip().upper()
    referral = await db.db["referrals"].find_one({"code": code_upper, "active": True})
    
    if not referral:
        return {"valid": False, "discount_percentage": 0.0, "message": "Invalid or inactive referral code"}
        
    # Increment total clicks
    await db.db["referrals"].update_one(
        {"code": code_upper},
        {"$inc": {"total_clicks": 1}}
    )
    
    return {
        "valid": True,
        "discount_percentage": referral["discount_percentage"],
        "code": code_upper,
        "type": referral["type"],
        "name": referral["name"]
    }

# -----------------
# Admin Routes
# -----------------
@router.get("", response_model=List[ReferralResponse])
async def list_referrals(
    type_filter: Optional[str] = None,
    admin: str = Depends(get_current_admin)
):
    query = {}
    if type_filter:
        query["type"] = type_filter
        
    cursor = db.db["referrals"].find(query).sort("code", 1)
    referrals_list = await cursor.to_list(length=100)
    return serialize_docs(referrals_list)

@router.post("", response_model=ReferralResponse, status_code=201)
async def create_referral(
    referral_data: ReferralCreate,
    admin: str = Depends(get_current_admin)
):
    code_upper = referral_data.code.strip().upper()
    
    # Check if referral code already exists
    existing = await db.db["referrals"].find_one({"code": code_upper})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Referral code '{code_upper}' already exists."
        )
        
    ref_dict = referral_data.model_dump()
    ref_dict["code"] = code_upper
    
    # Initialize statistics
    ref_dict["total_clicks"] = 0
    ref_dict["total_enquiries"] = 0
    ref_dict["total_orders"] = 0
    ref_dict["total_revenue"] = 0.0
    ref_dict["total_commission"] = 0.0
    ref_dict["paid_commission"] = 0.0
    ref_dict["pending_commission"] = 0.0
    
    result = await db.db["referrals"].insert_one(ref_dict)
    ref_dict["_id"] = result.inserted_id
    
    return serialize_doc(ref_dict)

@router.put("/{id}", response_model=ReferralResponse)
async def update_referral(
    id: str,
    update_data: dict,  # Simple dictionary for flexibility
    admin: str = Depends(get_current_admin)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid referral ID format")
        
    # Prevent editing code or type directly (for tracking integrity)
    for field in ["code", "type", "id", "_id"]:
        if field in update_data:
            del update_data[field]
            
    result = await db.db["referrals"].find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Referral not found")
        
    return serialize_doc(result)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_referral(
    id: str,
    admin: str = Depends(get_current_admin)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid referral ID format")
        
    result = await db.db["referrals"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Referral not found")
    return None
