
# SZABOT 🤖
**The Intelligent AI Assistant for SZABIST Hyderabad Campus**

SZABOT is a specialized AI-powered web assistant designed to solve the problem of fragmented information at SZABIST Hyderabad. It uses a **Retrieval-Augmented Generation (RAG)** architecture to provide students and staff with real-time, accurate answers regarding class schedules, exam timetables, university events, and academic roadmaps.

---

## 🚀 Key Features

*   **Automated Document Parsing:** Custom Python engine to extract structured data from "messy" University Excel schedules and PDF exam timetables.
*   **Contextual Intelligence:** Distinguishes between Exam, Class, and Event queries to provide highly specific data.
*   **RAG Architecture:** Combines the reasoning power of **Google Gemini 1.5 Flash** with verified campus data to prevent AI "hallucinations."
*   **Admin Dashboard:** A secure interface for university staff to upload new timetables, view user chat logs, and monitor system stats.
*   **Interactive Feedback:** Integrated survey system to gather user feedback for continuous improvement.
*   **Responsive Design:** Modern UI built with React and Tailwind CSS, optimized for both desktop and mobile.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React.js
*   **Styling:** Tailwind CSS
*   **State Management:** React Hooks & Context API

### Backend
*   **Runtime:** Node.js & Express.js
*   **Database:** MongoDB (Mongoose)
*   **Authentication:** JWT (JSON Web Tokens) & Bcrypt.js
*   **File Handling:** Multer (for document uploads)

### AI & Data Processing
*   **LLM:** Google Generative AI (Gemini 2.5 Flash)
*   **Data Extraction:** Python (Pandas, Pdfplumber)
*   **Integration:** Node.js `child_process` (to bridge JS and Python)

---

## 🏗️ System Architecture

1.  **Data Ingestion:** Admin uploads an Excel/PDF schedule.
2.  **Parsing:** The Python script (`parser.py`) cleans and structures the data into "Schedule Lines."
3.  **Querying:** User asks a question (e.g., "When is my OS class?").
4.  **Intent Detection:** The system identifies if the user is asking about an Exam, Class, or Event.
5.  **Retrieval:** The backend searches the database for lines matching the user's batch and subject.
6.  **Augmentation:** Relevant data is sent to the Gemini AI as context.
7.  **Response:** Gemini generates a human-like, accurate reply.

---

## 📂 Project Structure

```text
SZABOT/
├── backend/
│   ├── uploads/            # Temporary storage for parsing
│   ├── index.js            # Main Express server & AI Logic
│   ├── parser.py           # Python script for Excel/PDF extraction
│   ├── .env                # Environment variables (API Keys, Mongo URI)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components (Chat, Admin, Navbar)
│   │   └── App.js          # Main Application logic
│   └── tailwind.config.js
└── data/
    └── cs_data.json        # Static knowledge base (Roadmaps, Fees)
```

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v16+)
*   Python 3.8+
*   MongoDB Atlas account
*   Google Gemini API Key

### 1. Backend Setup
```bash
cd backend
npm install
# Install Python dependencies
pip install pandas pdfplumber openpyxl
```
Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GOOGLE_API_KEY=your_gemini_api_key
```
Start the server:
```bash
node index.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📝 Usage

### For Students
1.  **Login:** Use your student credentials.
2.  **Chat:** Ask questions like:
    *   *"When is my Software Construction exam?"*
    *   *"What is the room for BSCS-5C Operating Systems?"*
    *   *"Tell me about the DSA Project Exhibition."*
3.  **Feedback:** Use the `survey` command to leave a review.

### For Admins
1.  Access the **Admin Panel**.
2.  **Upload:** Drop a new `.xlsx` or `.pdf` timetable to update the bot's knowledge.
3.  **Monitor:** View chat logs to see what students are asking and ensure the bot is answering correctly.

---

## 🎓 Contributors
*   **Aliza Senharo (2212142)** - UI/UX Design & Frontend Development.
*   **Wasiullah Sahito (2212164)** - Backend Development, AI Integration & Database Management.

---
*Developed for SZABIST Hyderabad - Final Year Project (2024-2025)*
