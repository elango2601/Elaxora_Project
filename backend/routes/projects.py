from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from bson import ObjectId
from schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from database import db, serialize_doc, serialize_docs
from auth import get_current_admin

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    budget: Optional[str] = Query(None),
    active_only: bool = Query(True)
):
    query = {}
    
    if active_only:
        query["active"] = True
        
    if department:
        query["department"] = department
        
    if category:
        query["category"] = category
        
    if difficulty:
        query["difficulty"] = difficulty
        
    if search:
        # Case insensitive search on title, category, description, and technology array
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"short_description": {"$regex": search, "$options": "i"}},
            {"technology": {"$regex": search, "$options": "i"}}
        ]
        
    if budget:
        if budget == "Under ₹2,000":
            query["starting_price"] = {"$lt": 2000}
        elif budget == "₹2,000–₹5,000":
            query["starting_price"] = {"$gte": 2000, "$lte": 5000}
        elif budget == "₹5,000–₹10,000":
            query["starting_price"] = {"$gte": 5000, "$lte": 10000}
        elif budget == "₹10,000+":
            query["starting_price"] = {"$gte": 10000}

    cursor = db.db["projects"].find(query)
    # Sort by starting_price ascending
    cursor = cursor.sort("starting_price", 1)
    projects_list = await cursor.to_list(length=100)
    return serialize_docs(projects_list)

@router.get("/{slug_or_id}", response_model=ProjectResponse)
async def get_project(slug_or_id: str):
    # Try finding by slug first, then by ObjectId if valid
    project = await db.db["projects"].find_one({"slug": slug_or_id})
    if not project and ObjectId.is_valid(slug_or_id):
        project = await db.db["projects"].find_one({"_id": ObjectId(slug_or_id)})
        
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_doc(project)

# -----------------
# Admin CRUD Routes
# -----------------
@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    project_data: ProjectCreate,
    admin: str = Depends(get_current_admin)
):
    # Check if slug already exists
    existing = await db.db["projects"].find_one({"slug": project_data.slug})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Project with slug '{project_data.slug}' already exists."
        )
        
    project_dict = project_data.model_dump()
    result = await db.db["projects"].insert_one(project_dict)
    project_dict["_id"] = result.inserted_id
    return serialize_doc(project_dict)

@router.put("/{id}", response_model=ProjectResponse)
async def update_project(
    id: str,
    project_data: ProjectUpdate,
    admin: str = Depends(get_current_admin)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid project ID format")
        
    update_dict = {k: v for k, v in project_data.model_dump().items() if v is not None}
    
    if not update_dict:
        # Get existing project
        project = await db.db["projects"].find_one({"_id": ObjectId(id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return serialize_doc(project)
        
    result = await db.db["projects"].find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_dict},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_doc(result)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    id: str,
    admin: str = Depends(get_current_admin)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid project ID format")
        
    result = await db.db["projects"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
