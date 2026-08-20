from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# -----------------
# Auth Schemas
# -----------------
class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# -----------------
# Project Schemas
# -----------------
class ModuleSchema(BaseModel):
    name: str
    description: str

class OptionalServiceSchema(BaseModel):
    name: str
    price: float

class FaqSchema(BaseModel):
    question: str
    answer: str

class ProjectBase(BaseModel):
    title: str
    slug: str
    category: str
    department: str
    difficulty: str
    starting_price: float
    technology: List[str]
    short_description: str
    description: str
    problem_statement: str
    proposed_solution: str
    features: List[str]
    architecture: str
    modules: List[ModuleSchema]
    workflow: List[str]
    whats_included: List[str]
    optional_services: List[OptionalServiceSchema]
    faq: List[FaqSchema]
    demo_video_url: Optional[str] = ""
    demo_screenshots: List[str] = []
    git_link: Optional[str] = ""
    seo_title: str
    seo_meta_description: str
    active: bool = True

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    difficulty: Optional[str] = None
    starting_price: Optional[float] = None
    technology: Optional[List[str]] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    proposed_solution: Optional[str] = None
    features: Optional[List[str]] = None
    architecture: Optional[str] = None
    modules: Optional[List[ModuleSchema]] = None
    workflow: Optional[List[str]] = None
    whats_included: Optional[List[str]] = None
    optional_services: Optional[List[OptionalServiceSchema]] = None
    faq: Optional[List[FaqSchema]] = None
    demo_video_url: Optional[str] = None
    demo_screenshots: Optional[List[str]] = None
    git_link: Optional[str] = None
    seo_title: Optional[str] = None
    seo_meta_description: Optional[str] = None
    active: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: str

# -----------------
# Enquiry Schemas
# -----------------
class EnquiryBase(BaseModel):
    full_name: str
    email: EmailStr
    whatsapp_number: str
    college_name: str
    department: str
    year: str
    project_id: str
    preferred_technology: str
    budget_range: str
    required_deadline: str
    deployment_required: bool = False
    demo_video_required: bool = False
    additional_requirements: Optional[str] = ""
    referral_code: Optional[str] = ""
    message: Optional[str] = ""

class EnquiryCreate(EnquiryBase):
    pass

class EnquiryUpdate(BaseModel):
    status: str
    notes: Optional[List[str]] = None

class EnquiryResponse(EnquiryBase):
    id: str
    status: str
    notes: List[str] = []
    created_at: datetime

# -----------------
# Quote Schemas
# -----------------
class QuoteMilestone(BaseModel):
    name: str
    percentage: float
    amount: float
    status: str = "Pending"  # Pending, Paid

class QuoteBase(BaseModel):
    enquiry_id: str
    base_price: float
    customization_cost: float = 0.0
    additional_feature_cost: float = 0.0
    deployment_cost: float = 0.0
    documentation_cost: float = 0.0
    other_charges: float = 0.0
    referral_discount: float = 0.0
    final_price: float
    advance_percentage: float
    advance_amount: float
    remaining_amount: float
    estimated_delivery: str
    milestones: List[QuoteMilestone]
    scope_of_work: str
    terms: str

class QuoteCreate(QuoteBase):
    pass

class QuoteUpdate(BaseModel):
    status: str

class QuoteResponse(QuoteBase):
    id: str
    status: str  # Draft, Sent, Accepted, Change Requested, Expired
    created_at: datetime

# -----------------
# Order Schemas
# -----------------
class OrderMilestone(BaseModel):
    name: str
    status: str  # Pending, Completed
    due_date: Optional[str] = ""

class ChangeRequestSchema(BaseModel):
    id: str
    description: str
    reason: str
    priority: str  # Low, Medium, High
    additional_cost: float = 0.0
    additional_timeline: Optional[str] = ""
    status: str  # Requested, Under Review, Quote Sent, Approved, Paid, Development, Completed, Rejected
    created_at: datetime

class PaymentSchema(BaseModel):
    id: str
    amount: float
    phase: str  # Advance, Milestone, Final, Change Request
    status: str  # Pending, Paid, Refunded
    recorded_at: datetime
    notes: Optional[str] = ""

class OrderResponse(BaseModel):
    id: str
    enquiry_id: str
    quote_id: str
    student_name: str
    student_email: str
    student_whatsapp: str
    project_title: str
    scope_status: str  # LOCKED, PENDING_LOCK
    features: List[str]
    technology: List[str]
    deliverables: List[str]
    price: float
    advance_paid: bool
    payment_status: str  # Pending, Advance Paid, Milestone Paid, Fully Paid, Refunded
    order_status: str  # Advance Pending, Advance Paid, Scope Locked, Development, Demo Ready, Revision, Final Payment Pending, Completed, Cancelled
    progress_percent: int
    milestones: List[OrderMilestone]
    payments: List[PaymentSchema] = []
    revision_count_limit: int
    revision_count_used: int
    revisions: List[Dict[str, Any]] = []
    change_requests: List[ChangeRequestSchema] = []
    referral_code: Optional[str] = ""
    created_at: datetime

class OrderProgressUpdate(BaseModel):
    order_status: str
    progress_percent: int
    milestones: List[OrderMilestone]
    revision_count_used: Optional[int] = None

class ChangeRequestCreate(BaseModel):
    description: str
    reason: str
    priority: str

class ChangeRequestUpdate(BaseModel):
    status: str
    additional_cost: float
    additional_timeline: str

class PaymentRecordCreate(BaseModel):
    amount: float
    phase: str
    notes: Optional[str] = ""

# -----------------
# Referral Schemas
# -----------------
class ReferralBase(BaseModel):
    code: str
    type: str  # Influencer, Ambassador
    name: str
    college: Optional[str] = ""
    contact: str
    discount_percentage: float
    commission_percentage: float
    active: bool = True

class ReferralCreate(ReferralBase):
    pass

class ReferralResponse(ReferralBase):
    id: str
    total_clicks: int = 0
    total_enquiries: int = 0
    total_orders: int = 0
    total_revenue: float = 0.0
    total_commission: float = 0.0
    paid_commission: float = 0.0
    pending_commission: float = 0.0
