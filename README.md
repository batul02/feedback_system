# Employee Feedback Management System

A full-stack web application for managing employee feedback in organizations.  
Managers can give feedback to employees, and employees can view and acknowledge feedback.

## 🚀 Features

- **Role-based access:** Employees and managers have different dashboards and permissions
- **Authentication:** Secure login and registration
- **Team management:** Managers can view their team and give feedback
- **Feedback tracking:** Employees can view, acknowledge, and comment on feedback
- **Modern UI:** Clean, responsive design (React + CSS Modules)
- **REST API backend:** FastAPI (Python)
- **Easy deployment:** Netlify (frontend), Render/Heroku/Vercel (backend)

## 🖥️ Tech Stack

- **Frontend:** React, React Router, Axios, CSS Modules
- **Backend:** FastAPI (Python), SQLAlchemy, JWT Auth
- **Database:** PostgreSQL
- **Deployment:** Vercel (frontend), Renderl (backend)

## 📦 Project Structure

```
employee-feedback-manage/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── api/
│   │   └── ...
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── _redirects
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md   <-- (this file)
```

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/employee-feedback-manage.git
cd employee-feedback-manage
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

- **Configure environment variables** (if needed):  
  Create a `.env` file for DB URL, secret key, etc.

- **Run the backend:**
  ```bash
  uvicorn app.main:app --reload
  ```
  The API will be available at [http://localhost:8000](http://localhost:8000)

### 3. Frontend Setup (React)

```bash
cd ../frontend
npm install
```

- **Configure API base URL:**  
  Edit `src/api/api.js` and set your backend API URL if needed (e.g., `http://localhost:8000`).

- **Run the frontend:**
  ```bash
  npm start
  ```
  The app will be available at [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Frontend (Vercel)

1. **Ensure `public/_redirects` exists** in `frontend/`:
   ```
   /*    /index.html    200
   ```
2. **Build the app:**
   ```bash
   npm run build
   ```
3. **Deploy:**
   - **Manual:** Drag and drop `build/` to Netlify
   - **GitHub Integration:** Connect your repo on Netlify for auto-deploys

### Backend (Render)

- **Render:** Create a new web service, connect your GitHub repo, set build/start commands:
  - Build: `pip install -r requirements.txt`
  - Start: `uvicorn app.main:app --host 0.0.0.0 --port 10000`

## 👤 Roles

- **Manager:** View team, give feedback to employees
- **Employee:** View and acknowledge feedback, comment on feedback

## 📝 Customization

- **Styling:** All styles are in `frontend/src/styles/` as CSS Modules
- **API:** Update `frontend/src/api/api.js` to point to your backend
- **Database:** Configure DB in `backend/.env` or `app/main.py`
