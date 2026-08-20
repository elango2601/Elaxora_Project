from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from schemas import EnquiryCreate, EnquiryUpdate, EnquiryResponse
from database import db, serialize_doc, serialize_docs
from auth import get_current_admin

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])

@router.post("", response_model=EnquiryResponse, status_code=201)
async def create_enquiry(enquiry_data: EnquiryCreate):
    # Verify project exists
    project_id = enquiry_data.project_id
    project = None
    if ObjectId.is_valid(project_id):
        project = await db.db["projects"].find_one({"_id": ObjectId(project_id)})
    if not project:
        project = await db.db["projects"].find_one({"slug": project_id})
        
    if not project:
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID. Selected project does not exist."
        )

    # Generate sequential Enquiry ID
    count = await db.db["enquiries"].count_documents({})
    enq_short_id = f"PF-ENQ-{1000 + count + 1}"
    
    # Process referral code if provided
    ref_code = enquiry_data.referral_code.strip().upper() if enquiry_data.referral_code else ""
    if ref_code:
        referral = await db.db["referrals"].find_one({"code": ref_code, "active": True})
        if referral:
            # Valid referral code, update statistics
            await db.db["referrals"].update_one(
                {"code": ref_code},
                {"$inc": {"total_enquiries": 1, "total_clicks": 1}}
            )
        else:
            # Code is invalid, clear it so it isn't tracked falsely
            ref_code = ""

    enquiry_dict = enquiry_data.model_dump()
    enquiry_dict["id"] = enq_short_id
    enquiry_dict["_id"] = enq_short_id  # Use as MongoDB primary key
    enquiry_dict["referral_code"] = ref_code
    enquiry_dict["status"] = "New"
    enquiry_dict["notes"] = []
    enquiry_dict["created_at"] = datetime.utcnow()
    
    await db.db["enquiries"].insert_one(enquiry_dict)
    return serialize_doc(enquiry_dict)

# -----------------
# Admin Routes
# -----------------
@router.get("", response_model=List[EnquiryResponse])
async def list_enquiries(
    status_filter: Optional[str] = None,
    admin: str = Depends(get_current_admin)
):
    query = {}
    if status_filter:
        query["status"] = status_filter
        
    cursor = db.db["enquiries"].find(query).sort("created_at", -1)
    enquiries_list = await cursor.to_list(length=100)
    return serialize_docs(enquiries_list)

@router.get("/{id}", response_model=EnquiryResponse)
async def get_enquiry(
    id: str,
    admin: str = Depends(get_current_admin)
):
    enquiry = await db.db["enquiries"].find_one({"_id": id})
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return serialize_doc(enquiry)

@router.put("/{id}", response_model=EnquiryResponse)
async def update_enquiry(
    id: str,
    enquiry_update: EnquiryUpdate,
    admin: str = Depends(get_current_admin)
):
    enquiry = await db.db["enquiries"].find_one({"_id": id})
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
        
    update_dict = {"status": enquiry_update.status}
    if enquiry_update.notes is not None:
        update_dict["notes"] = enquiry_update.notes
        
    result = await db.db["enquiries"].find_one_and_update(
        {"_id": id},
        {"$set": update_dict},
        return_document=True
    )
    return serialize_doc(result)
