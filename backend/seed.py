from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "elaxorasolutions")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@elaxorasolutions.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "ForgeAdmin2026!")

def seed_database():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    
    # 1. Admin seeding
    db["users"].delete_many({"email": ADMIN_EMAIL})
    db["users"].delete_many({"username": "admin"})
    password_hash = bcrypt.hashpw(ADMIN_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db["users"].insert_one({
        "email": ADMIN_EMAIL,
        "username": "admin",
        "password_hash": password_hash,
        "role": "admin"
    })
    print("Admin user seeded.")
    
    # 2. Projects seeding
    db["projects"].delete_many({})
    
    projects = [
        {
            "title": "AI Resume Analyzer",
            "slug": "ai-resume-analyzer",
            "category": "AI/ML",
            "department": "CSE",
            "difficulty": "Advanced",
            "starting_price": 5999.0,
            "technology": ["Python", "FastAPI", "MongoDB", "NLP", "Next.js"],
            "short_description": "Analyze and score student resumes against job descriptions, identifying key skill gaps.",
            "description": "An advanced AI-powered Resume Parser and Analyzer that leverages Natural Language Processing (NLP) to extract skills, qualifications, and experience from PDF/Word resumes. It maps candidates against specific job roles, calculates match percentages, and details actionable feedback on skills development and visual formatting improvements.",
            "problem_statement": "Students face immense competition in job markets and are often rejected by automated applicant tracking systems (ATS) because their resumes do not match standard keywords or structure.",
            "proposed_solution": "Develop an easy-to-use analysis portal where a student uploads their resume, selects a targeted job description, and receives instantaneous, high-fidelity metrics showing keyword discrepancies, skill gaps, and styling tips.",
            "features": [
                "Resume upload (PDF/Word parser)",
                "Text & entities extraction",
                "Advanced skills and tool recognition",
                "Job role match percentage",
                "Visual feedback checklist",
                "Detailed recommendations reporting",
                "Secure Admin Dashboard for system metrics"
            ],
            "architecture": "Next.js SPA frontend interacts with FastAPI backend endpoints. Celery workers parse documents via Spacy/NLTK pipeline. Relational data points are saved in MongoDB.",
            "modules": [
                {"name": "Frontend Parser Interface", "description": "Interactive drag-and-drop page using React hooks."},
                {"name": "FastAPI Parsing Handler", "description": "Handles API ingestion, validates files, and sanitizes input text."},
                {"name": "NLP Matching Core", "description": "Leverages TF-IDF vectorization and custom NER parsing pipeline."}
            ],
            "workflow": [
                "User logs in and navigates to upload portal",
                "Uploads PDF format resume",
                "System extracts raw text and runs skill matching regex and NLP models",
                "Returns scores and visualizations immediately"
            ],
            "whats_included": [
                "Fully working web application code",
                "Custom trained SpaCy parsing model source",
                "MongoDB schema configurations",
                "Detailed developer installation setup guide",
                "Technical system explanation (1-hour support)"
            ],
            "optional_services": [
                {"name": "Production VPS / Cloud deployment", "price": 1499.0},
                {"name": "Custom database migration support", "price": 999.0},
                {"name": "Full Project Report (.docx format)", "price": 1999.0}
            ],
            "faq": [
                {"question": "Can this parse scanned images?", "answer": "By default, this parses text-based PDFs. OCR image scanning can be added as an optional customization."},
                {"question": "Which NLP library is used?", "answer": "This project leverages the SpaCy English library along with NLTK."}
            ],
            "demo_video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "demo_screenshots": [
                "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=500&auto=format&fit=crop"
            ],
            "git_link": "https://github.com/elaxorasolutions/ai-resume-analyzer",
            "seo_title": "AI Resume Analyzer - Final Year CSE Project",
            "seo_meta_description": "Get a professional AI Resume Analyzer project for final year computer science students. Built on Next.js, FastAPI, and MongoDB.",
            "active": True
        },
        {
            "title": "Smart Lost & Found",
            "slug": "smart-lost-found",
            "category": "Full Stack",
            "department": "IT",
            "difficulty": "Advanced",
            "starting_price": 5999.0,
            "technology": ["Next.js", "FastAPI", "MongoDB", "Python", "AI"],
            "short_description": "Smart lost and found portal with automatic visual image match recognition.",
            "description": "An interactive campus portal connecting students who lost items with finders. Features advanced visual recognition where images of found items are cross-matched with text reports of lost items to alert potential owners.",
            "problem_statement": "Items lost on university campuses rarely find their way back to owners due to fragmented communication, manual spreadsheets, and delay in matching matches.",
            "proposed_solution": "A central real-time portal where lost and found reports are matched automatically via description parameters and machine learning image similarity models.",
            "features": [
                "Lost item posting and reporting form",
                "Found item posting and image upload",
                "Automatic match recommendation scoring",
                "Real-time notifications dashboard",
                "Moderator dashboard to approve or block posts",
                "Activity tracking analytics"
            ],
            "architecture": "FastAPI triggers similarity index calculations, storage is handled in MongoDB, images are stored locally or via Cloudinary/AWS S3.",
            "modules": [
                {"name": "Authentication module", "description": "Enables college email domain validation."},
                {"name": "Reporting interface", "description": "Form page for uploading images and tagging location metadata."},
                {"name": "Similarity search server", "description": "Python module using visual embeddings comparison."}
            ],
            "workflow": [
                "Student submits lost keys with description",
                "Another student uploads image of found keys",
                "Matching algorithm flags correlation, emailing both students",
                "Admin closes status upon successful return"
            ],
            "whats_included": [
                "Complete source code repository",
                "Local environment startup scripts",
                "Pre-configured database indexes",
                "Project flow diagrams and walkthrough files",
                "Viva support checklist"
            ],
            "optional_services": [
                {"name": "Host on Vercel and Railway Cloud", "price": 999.0},
                {"name": "Email SMTP notification integration", "price": 499.0},
                {"name": "Custom campus map layout", "price": 1499.0}
            ],
            "faq": [
                {"question": "How are images compared?", "answer": "We compute image similarity using PyTorch ResNet feature extractors."}
            ],
            "demo_video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "demo_screenshots": [
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop"
            ],
            "git_link": "https://github.com/elaxorasolutions/smart-lost-found",
            "seo_title": "Smart Lost and Found Portal - IT Project",
            "seo_meta_description": "High fidelity college smart lost & found project utilizing AI matching, Next.js, and MongoDB.",
            "active": True
        },
        {
            "title": "Student Performance Prediction",
            "slug": "student-performance-prediction",
            "category": "Data Science",
            "department": "BCA",
            "difficulty": "Intermediate",
            "starting_price": 3499.0,
            "technology": ["Python", "Machine Learning", "FastAPI", "MongoDB", "Next.js"],
            "short_description": "Predict student failure or academic scores based on demographic and historical metrics.",
            "description": "A predictive analytics web dashboard allowing instructors to input historical performance data and demographics to classify students at risk of failing. Displays insights graphs to suggest tutoring resources.",
            "problem_statement": "Academic advisors are often reactive, identifying failing students only after final grades are recorded, leading to high drop-out rates.",
            "proposed_solution": "Establish early predictive pipelines analyzing mid-semester scores, attendance logs, and study hour estimates using classification machine learning models.",
            "features": [
                "CSV Student data uploader",
                "Parameter input forms for single prediction queries",
                "Dashboard graphics using Chart.js",
                "Performance prediction metrics export (.pdf)",
                "Action item generator for teachers"
            ],
            "architecture": "FastAPI coordinates scikit-learn models. Next.js handles chart outputs. MongoDB stores training datasets and results.",
            "modules": [
                {"name": "Data ingestion", "description": "Converts CSV records into internal pandas dataframes."},
                {"name": "ML Inference", "description": "Loads trained Random Forest classifier models."}
            ],
            "workflow": [
                "Teacher logs in",
                "Enters student metrics (Study hours: 5, Attendance: 80%)",
                "Model outputs risk level (High/Medium/Low) along with predictive confidence"
            ],
            "whats_included": [
                "Web code codebase",
                "Trained machine learning models (.pkl)",
                "Sample dataset (1000 academic rows)",
                "Detailed readme and setup guide",
                "Project presentation PPT presentation template"
            ],
            "optional_services": [
                {"name": "Add automated email warning system", "price": 799.0},
                {"name": "One-on-one video mentoring walkthrough", "price": 999.0}
            ],
            "faq": [
                {"question": "What algorithms are supported?", "answer": "Random Forest, Decision Trees, and Logistic Regression models."}
            ],
            "demo_video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "demo_screenshots": [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop"
            ],
            "git_link": "https://github.com/elaxorasolutions/student-performance-prediction",
            "seo_title": "Student Performance Prediction ML Project",
            "seo_meta_description": "Academic analytics dashboard for predicting student outcomes using Machine Learning.",
            "active": True
        }
    ]
    
    db["projects"].insert_many(projects)
    print(f"{len(projects)} projects seeded successfully.")
    
    # 3. Referrals Seeding
    db["referrals"].delete_many({})
    referrals = [
        {
            "code": "ARUN10",
            "type": "Influencer",
            "name": "TechArun",
            "contact": "arun@youtube.com",
            "discount_percentage": 10.0,
            "commission_percentage": 10.0,
            "active": True,
            "total_clicks": 142,
            "total_enquiries": 12,
            "total_orders": 2,
            "total_revenue": 11998.0,
            "total_commission": 1199.8,
            "paid_commission": 0.0,
            "pending_commission": 1199.8
        },
        {
            "code": "AMBASSADOR2026",
            "type": "Ambassador",
            "name": "Rahul Sharma",
            "college": "IIT Delhi",
            "contact": "rahul@college.edu",
            "discount_percentage": 5.0,
            "commission_percentage": 15.0,
            "active": True,
            "total_clicks": 32,
            "total_enquiries": 4,
            "total_orders": 0,
            "total_revenue": 0.0,
            "total_commission": 0.0,
            "paid_commission": 0.0,
            "pending_commission": 0.0
        }
    ]
    db["referrals"].insert_many(referrals)
    print("Referrals / Campus Ambassadors seeded.")
    
    client.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
