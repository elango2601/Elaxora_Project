from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import JSONResponse
from schemas import UserLogin, Token
from auth import verify_password, get_password_hash, create_access_token, get_current_admin
from config import settings
from database import db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(response: Response, user_data: UserLogin):
    # Check by email in database
    admin_user = await db.db["users"].find_one({"email": user_data.email})
    if not admin_user:
        # Fallback search by username if they input username
        admin_user = await db.db["users"].find_one({"username": user_data.email})
        
    is_valid = False
    if admin_user:
        is_valid = verify_password(user_data.password, admin_user["password_hash"])
    else:
        # Fallback to configuration settings
        if user_data.email == settings.ADMIN_EMAIL and user_data.password == settings.ADMIN_PASSWORD:
            is_valid = True
            
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Check role
    user_role = admin_user.get("role") if admin_user else "admin"
    if user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access the admin portal."
        )
        
    subject = admin_user.get("email") if admin_user else settings.ADMIN_EMAIL
    access_token = create_access_token(
        data={"sub": subject, "role": "admin"}
    )
    
    # Set HttpOnly Cookie for modern frontend consumption
    response.set_cookie(
        key="admin_token",
        value=access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,  # Set to True in production
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("admin_token")
    return {"message": "Logged out successfully"}

@router.get("/me")
async def me(current_user: str = Depends(get_current_admin)):
    return {"username": current_user, "role": "admin"}
