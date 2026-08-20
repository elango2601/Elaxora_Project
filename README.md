# Elaxora Solutions

> **Build. Customize. Understand. Present.**  
> *Affordable Final-Year Projects Built Around Your Requirements.*

Elaxora Solutions is a modern, production-ready full-stack web application designed for a solo freelancer who provides customizable academic project development, technical mentoring, database configuration assistance, deployment, and viva defense preparation for college students.

---

## System Architecture

The application is structured into two main packages:
- **`backend/`**: FastAPI REST API server built with Python and MongoDB (Motor async driver).
- **`frontend/`**: Next.js App Router application styled with Tailwind CSS, utilizing TypeScript and React Client Components for state management.

```
Next.js (Port 3000) ──> FastAPI (Port 8000) ──> MongoDB (Port 27017)
```

---

## 1. Prerequisites

Make sure the following are installed on your host system:
- **Python**: Version `3.10` or higher
- **Node.js**: Version `18` or higher
- **MongoDB**: Active community server running locally on standard port `27017`

---

## 2. Environment Configurations

Both frontend and backend utilize `.env` files for configuration. Make sure these are created before running the applications.

### Backend Configurations (`backend/.env`)
Create a file named `.env` in the `backend` folder:
```ini
PORT=8000
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=elaxorasolutions
JWT_SECRET=supersecretkeyforelaxorasolutionsadminlogin
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Default Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ForgeAdmin2026!
```

---

## 3. Backend Setup (FastAPI)

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Seed the database with default projects, referral codes, and admin accounts:
   ```bash
   python seed.py
   ```

5. Launch the FastAPI server locally:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The API server will be live at: [http://localhost:8000](http://localhost:8000)  
   Interactive Swagger documentation is available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 4. Frontend Setup (Next.js)

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Build the Next.js assets to verify compile checks:
   ```bash
   npm run build -- --webpack
   ```

4. Start the Next.js frontend development server locally:
   ```bash
   npx next dev --webpack
   ```
   The frontend application will be active at: [http://localhost:3000](http://localhost:3000)

---

## 5. Verification & Testing

To run automated end-to-end integration tests validating the student flow, quotes generator, and change request lock triggers, run the following in the `backend` directory (make sure both servers are active):
```bash
cd backend
source venv/bin/activate
python verify_apis.py
```

---

## 6. Deployment Guidelines

### Production Database (MongoDB)
For production deployments, migrate from a local MongoDB community instance to a fully managed **MongoDB Atlas** database cluster. Update `MONGO_URI` and `DATABASE_NAME` in your production environments accordingly.

### Server Deployment (FastAPI)
Host the FastAPI server on platforms like **Railway**, **Render**, or a standalone VPS (DigitalOcean/Linode):
- Use **Gunicorn** with **Uvicorn workers** for production process clustering:
  ```bash
  gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
  ```
- Make sure CORS origins in `main.py` are updated to match your production frontend URL domain.

### Frontend Deployment (Next.js)
Host the frontend on **Vercel** or **Netlify**:
- Configure environmental variables for production endpoints pointing to the hosted FastAPI backend.
