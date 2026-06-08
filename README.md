<<<<<<< HEAD

=======
>>>>>>> 44dbee7 (Excel data added and further README.md details added)
# SZABOT 🤖
**The Intelligent AI Assistant for SZABIST Hyderabad Campus**

SZABOT is a specialized AI-powered web assistant designed to solve the problem of fragmented information at SZABIST Hyderabad. It uses a **Retrieval-Augmented Generation (RAG)** architecture to provide students and staff with real-time, accurate answers regarding class schedules, exam timetables, university events, and academic roadmaps.

---

## 🚀 Key Features

<<<<<<< HEAD
*   **Automated Document Parsing:** Custom Python engine to extract structured data from "messy" University Excel schedules and PDF exam timetables.
*   **Contextual Intelligence:** Distinguishes between Exam, Class, and Event queries to provide highly specific data.
*   **RAG Architecture:** Combines the reasoning power of **Google Gemini 1.5 Flash** with verified campus data to prevent AI "hallucinations."
*   **Admin Dashboard:** A secure interface for university staff to upload new timetables, view user chat logs, and monitor system stats.
*   **Interactive Feedback:** Integrated survey system to gather user feedback for continuous improvement.
*   **Responsive Design:** Modern UI built with React and Tailwind CSS, optimized for both desktop and mobile.
=======
- **Automated Document Parsing:** Custom Python engine to extract structured data from "messy" University Excel schedules and PDF exam timetables.
- **Contextual Intelligence:** Distinguishes between Exam, Class, and Event queries to provide highly specific data.
- **RAG Architecture:** Combines the reasoning power of **Google Gemini 2.5 Flash** with verified campus data to prevent AI "hallucinations."
- **Admin Dashboard:** A secure interface for university staff to upload new timetables, view user chat logs, and monitor system stats.
- **Interactive Feedback:** Integrated survey system to gather user feedback for continuous improvement.
- **Responsive Design:** Modern UI built with React and Vite, optimized for both desktop and mobile.
>>>>>>> 44dbee7 (Excel data added and further README.md details added)

---

## 🛠️ Tech Stack

### Frontend
<<<<<<< HEAD
*   **Framework:** React.js
*   **Styling:** CSS
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
=======
- **Framework:** React.js (Vite)
- **Styling:** CSS
- **State Management:** React Hooks & Context API

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt.js
- **File Handling:** Multer (for document uploads)

### AI & Data Processing
- **LLM:** Google Generative AI (Gemini 2.5 Flash)
- **Data Extraction:** Python (Pandas, Pdfplumber)
- **Integration:** Node.js `child_process` (to bridge JS and Python)
>>>>>>> 44dbee7 (Excel data added and further README.md details added)

---

## 🏗️ System Architecture

<<<<<<< HEAD
1.  **Data Ingestion:** Admin uploads an Excel/PDF schedule.
2.  **Parsing:** The Python script (`parser.py`) cleans and structures the data into "Schedule Lines."
3.  **Querying:** User asks a question (e.g., "When is my OS class?").
4.  **Intent Detection:** The system identifies if the user is asking about an Exam, Class, or Event.
5.  **Retrieval:** The backend searches the database for lines matching the user's batch and subject.
6.  **Augmentation:** Relevant data is sent to the Gemini AI as context.
7.  **Response:** Gemini generates a human-like, accurate reply.
=======
1. **Data Ingestion:** Admin uploads an Excel/PDF schedule.
2. **Parsing:** The Python script (`parser.py`) cleans and structures the data into "Schedule Lines."
3. **Querying:** User asks a question (e.g., "When is my OS class?").
4. **Intent Detection:** The system identifies if the user is asking about an Exam, Class, or Event.
5. **Retrieval:** The backend searches the database for lines matching the user's batch and subject.
6. **Augmentation:** Relevant data is sent to the Gemini AI as context.
7. **Response:** Gemini generates a human-like, accurate reply.
>>>>>>> 44dbee7 (Excel data added and further README.md details added)

---

## 📂 Project Structure

```text
<<<<<<< HEAD
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
=======
SZABOT-FYP/
├── szabot-backend/
│   ├── uploads/            # Temporary storage for parsed files
│   ├── index.js            # Main Express server & AI logic
│   ├── seed.js             # Database seeder (users + knowledge base)
│   ├── fix_admin.js        # Utility to reset admin credentials
│   ├── parser.py           # Python script for Excel/PDF extraction
│   ├── .env                # Environment variables (API Keys, Mongo URI)
│   └── package.json
├── szabot-frontend/
│   ├── src/
│   │   ├── components/     # UI Components (Chat, Admin, Navbar)
│   │   └── App.jsx         # Main Application logic
│   ├── index.html
│   └── package.json
└── README.md
>>>>>>> 44dbee7 (Excel data added and further README.md details added)
```

---

<<<<<<< HEAD
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
=======
## ⚙️ Prerequisites

Make sure the following are installed before you begin:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v16+ | https://nodejs.org |
| Python | 3.8+ | https://www.python.org |
| pip | (bundled with Python) | — |
| Git | Any | https://git-scm.com |

You will also need a **MongoDB** database (choose one option below) and a **Google Gemini API Key**:

| MongoDB Option | Best For | Download |
|----------------|----------|----------|
| **MongoDB Atlas** (cloud, recommended) | No local install needed, free 512 MB cluster | https://www.mongodb.com/atlas |
| **MongoDB Community Server** (local) | Fully offline / no internet required | https://www.mongodb.com/try/download/community |
| **MongoDB Compass** (GUI for local) | Visual database browser (use alongside Community Server) | https://www.mongodb.com/try/download/compass |

- A **Google Gemini API Key** — https://aistudio.google.com/app/apikey

---

## 🛠️ Setup & Installation

### Step 1 — Clone the Repository

```bash
git clone https://github.com/WasiullahSahito/SZABOT-FYP.git
cd SZABOT-FYP
```

---

### Step 2 — Install Python Dependencies

The backend calls a Python script (`parser.py`) to parse uploaded Excel and PDF files. Install the required libraries globally:

```bash
pip install pandas pdfplumber openpyxl
```

---

### Step 3 — Backend Setup

#### 3a. Navigate to the backend folder

```bash
cd szabot-backend
```

#### 3b. Install Node.js dependencies

```bash
npm install
```

#### 3c. Set up your MongoDB database

Choose **one** of the three options below. All three produce a `MONGO_URI` string you will paste into your `.env` file in the next step.

---

**Option A — MongoDB Atlas (Cloud, Recommended)**

No local installation required. Works from anywhere.

1. Go to https://www.mongodb.com/atlas and create a free account.
2. Create a **free M0 cluster** (choose any region).
3. Under **Security → Database Access**, create a database user with a username and password.
4. Under **Security → Network Access**, click **Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`).
5. Go to your cluster → **Connect** → **Drivers** → select **Node.js**.
6. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with the credentials you created in step 3.

Your `MONGO_URI` = the string above (with credentials filled in).

---

**Option B — MongoDB Community Server (Local)**

Runs entirely on your own machine. No internet required after install.

1. Download from https://www.mongodb.com/try/download/community and install it.
2. During installation, check **"Install MongoDB as a Service"** so it starts automatically.
3. Once installed, MongoDB runs on your machine at `localhost:27017`.

Your `MONGO_URI` = `mongodb://localhost:27017/szabot`

> **Optional:** Install **MongoDB Compass** (see Option C) to visually browse your local database.

---

**Option C — MongoDB Compass (GUI Tool)**

Compass is a graphical interface for MongoDB. It does **not** replace Atlas or Community Server — install it alongside **Option B** to view and manage your local data visually.

1. Download from https://www.mongodb.com/try/download/compass and install it.
2. Open Compass and connect using: `mongodb://localhost:27017`
3. You can browse collections, view documents, and verify that seeding worked correctly.

Your `MONGO_URI` is still: `mongodb://localhost:27017/szabot` (same as Option B).

---

#### 3d. Generate a JWT Secret

The `JWT_SECRET` is used to sign and verify login tokens. Run this command in your terminal to generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output — it will look like a long string of random characters:

```
a3f8c2e1d7b94f0a6e2c8d1b3f7a9e4c2d8b1f6a3e9c7d2b4f8a1e3c6d9b2f5...
```

Use that as your `JWT_SECRET`.

---

#### 3e. Create the environment file

Create a file named `.env` inside the `szabot-backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_secret_here
GOOGLE_API_KEY=your_gemini_api_key_here
```

**Example `.env` using MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://wasiullah:mypassword123@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=a3f8c2e1d7b94f0a6e2c8d1b3f7a9e4c2d8b1f6a3e9c7d2b4f8a1e3c6d9b2f5
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Example `.env` using MongoDB Community Server (local):**
```env
MONGO_URI=mongodb://localhost:27017/szabot
JWT_SECRET=a3f8c2e1d7b94f0a6e2c8d1b3f7a9e4c2d8b1f6a3e9c7d2b4f8a1e3c6d9b2f5
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> **How to get GOOGLE_API_KEY:** Go to https://aistudio.google.com/app/apikey, sign in with a Google account, and click **Create API Key**.

#### 3f. Seed the database

This command populates the database with default users and the BSCS knowledge base (course info, fee structure, faculty, etc.). **Run this once before starting the server for the first time.**

```bash
node seed.js
```

You should see output like:

```
⏳ Connecting to MongoDB...
✅ Connected!
🧹 Clearing old data...
👤 Creating Users...
📚 Seeding Knowledge Base (Formatted)...
✅ SEEDING COMPLETE! User: student/123456
```

> **Default credentials created by the seed:**
> | Role | Username | Password |
> |------|----------|----------|
> | Student | `student` | `123456` |
> | Admin | `admin` | `123456` |

#### 3g. Start the backend server

>>>>>>> 44dbee7 (Excel data added and further README.md details added)
```bash
node index.js
```

<<<<<<< HEAD
### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

=======
Or, if you have **nodemon** installed (recommended for development):

```bash
npm run dev
```

The server will start on **http://localhost:5000**. You should see:

```
✅ MongoDB Connected
🚀 Server running on 5000
```

> **Keep this terminal open.** The backend must be running for the app to work.

---

### Step 4 — Frontend Setup

Open a **new terminal** (keep the backend terminal running) and navigate to the frontend folder:

```bash
cd szabot-frontend
```

#### 4a. Install Node.js dependencies

```bash
npm install
```

#### 4b. Start the frontend development server

```bash
npm run dev
```

Vite will start and show a URL like:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser to use SZABOT.

---

## 🔑 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Student | `student` | `123456` |
| Admin | `admin` | `123456` |

> These are created by the `node seed.js` command in Step 3f.

---

## 🛠️ Utility Scripts

### Reset Admin Password

If you need to reset the admin credentials separately (e.g., if you forgot the password), run:

```bash
cd szabot-backend
node fix_admin.js
```

This resets the admin account to:
- **Username:** `admin`
- **Password:** `admin123`

### Re-seed the Database

To wipe all data and re-seed from scratch (useful during development):

```bash
cd szabot-backend
node seed.js
```

> **Warning:** This clears all existing users, knowledge base entries, and uploaded documents.

---

## 📥 Step 5 — Upload Timetable Files (Teaching the AI)

Once the app is running, the AI knows nothing about class or exam schedules until an admin uploads the files. Follow these steps to give the AI its knowledge.

### 5a. Log in as Admin

1. Open **http://localhost:5173** in your browser.
2. Log in with username `admin` and password `123456`.
3. Click **Admin Panel** in the navigation.

### 5b. Go to the Upload Section

Inside the Admin Panel, locate the **Upload Timetable** section. You will see a file input and an **Upload** button.

### 5c. Upload a Class Schedule Excel File

The parser auto-detects class schedules vs. exam timetables. For a class schedule Excel file to be parsed correctly, the file **must** follow this structure:

| Requirement | Detail |
|-------------|--------|
| File format | `.xlsx` or `.xls` |
| Day name | The day (e.g. `MONDAY`) must appear in the first 1–3 rows of the sheet |
| Room/Venue column | A column header must contain the word `Venue` or `Room` |
| Time slot columns | Column headers must contain one of: `8:15`, `11:30`, `11:00`, `2:45`, or `6:00` |
| Cell content | Each time-slot cell should contain: `Subject Name  BatchCode  TeacherName` |

> **One file per day.** Upload a separate `.xlsx` for Monday, Tuesday, Wednesday, etc. The parser reads the day name from inside the file.

**Steps:**
1. Click **Choose File** and select your class schedule `.xlsx`.
2. Click **Upload**.
3. The backend calls `parser.py` automatically. You will see a success message when done.
4. Repeat for each day's schedule file.

**After upload the AI can answer questions like:**
- *"When is BSCS-5C Operating Systems class?"*
- *"What room is BSCS-7A Professional Practices on Monday?"*

---

### 5d. Upload an Exam Timetable Excel File

For an exam timetable Excel, the file **must** follow this structure:

| Requirement | Detail |
|-------------|--------|
| File format | `.xlsx` or `.xls` |
| Date column | Must have a column header literally named `Date` |
| Day names | The sheet must contain day names like `Monday`, `Tuesday`, etc. |
| Time slot columns | Column headers must contain: `8:15`, `11:30`, or `2:45` |
| Floor column | Optional — column header containing `Floor` |
| Venue column | Optional — column header containing `Venue`, `Room`, or `Lab` |

**Steps:**
1. Click **Choose File** and select the exam timetable `.xlsx`.
2. Click **Upload**.
3. After the success message, the AI immediately knows all exam dates, times, and venues.

**After upload the AI can answer questions like:**
- *"When is my Software Construction exam?"*
- *"What is the exam time for BSCS-5C Database Systems?"*

---

### 5e. Upload an Exam Timetable PDF File

The parser also supports PDF exam timetables. The PDF **must** have:

| Requirement | Detail |
|-------------|--------|
| File format | `.pdf` |
| Tables | The PDF must contain actual tables (not scanned images) |
| Day headers | A row in each table must contain: `Monday`, `Tuesday`, `Wednesday`, etc. |
| Time slot rows | Rows must start with `08:30` / `Slot 01`, `11:30` / `Slot 02`, or `02:30` / `Slot 03` |

> **Important:** Scanned/image-based PDFs will not work. The PDF must have selectable text and extractable tables.

**Steps:**
1. Click **Choose File** and select the exam timetable `.pdf`.
2. Click **Upload**.
3. Wait for the success message. The AI now knows the exam schedule.

---

### 5f. Verify Uploaded Documents

In the Admin Panel, scroll to the **Uploaded Documents** section. All successfully parsed files are listed here with their filename and upload date. You can delete any document from this list to remove it from the AI's knowledge.

---

## 🎉 Step 6 — Adding University Events

University events are stored as structured text in the backend code (`szabot-backend/index.js`). The AI reads event data from the `UNIVERSITY_EVENTS` array — it does **not** process image files directly. To teach the AI about a new event from an event poster image, follow these steps:

### 6a. Read the event poster image

Look at the event poster (JPG, PNG, WhatsApp image, printed flyer, etc.) and note down:
- Event name
- Date (e.g. *Wednesday, 26 November 2025*)
- Time (e.g. *8:15 AM to 10:45 AM*)
- Venue (e.g. *Activity Area, 8th Floor*)
- Organizer (e.g. *SZABIST Microsoft Learn Student Ambassador*)
- Any special details or eligibility notes

### 6b. Open the backend events file

Open [szabot-backend/index.js](szabot-backend/index.js) and find the `UNIVERSITY_EVENTS` array (around line 73). It looks like this:

```js
const UNIVERSITY_EVENTS = [
    {
        name: "DSA Project Exhibition",
        date: "Wednesday, 26 November 2025",
        time: "8:15 AM to 10:45 AM",
        venue: "Activity Area, 8th Floor",
        organizer: "SZABIST Microsoft Learn Student Ambassador",
        description: "Data Structures & Algorithms (DSA) Project Exhibition showcasing student projects."
    },
    // ... more events
];
```

### 6c. Add the new event

Copy one of the existing event blocks and paste it as a new entry at the end of the array (before the closing `]`). Fill in the details from the poster:

```js
    {
        name: "Your Event Name Here",
        date: "Day, DD Month YYYY",
        time: "Start Time to End Time",
        venue: "Room/Hall Name, Floor",
        organizer: "Organizing Society or Department",
        description: "Full details from the poster, including eligibility or deadlines."
    }
```

### 6d. Add the event keyword to the search function

Find the `searchEvents` function (around line 101) and add a keyword trigger for your event so the AI can find it:

```js
function searchEvents(message) {
    const lowerMsg = message.toLowerCase();
    return UNIVERSITY_EVENTS.filter(ev =>
        // ... existing entries ...
        (lowerMsg.includes('your keyword') && ev.name.toLowerCase().includes('your keyword')) ||
        lowerMsg.includes('event')
    );
}
```

### 6e. Restart the backend server

Save the file and restart the server so changes take effect:

```bash
# Stop the running server with Ctrl+C, then:
node index.js
```

**After restart the AI can answer questions like:**
- *"Tell me about [Your Event Name]."*
- *"When is [your keyword] event?"*

>>>>>>> 44dbee7 (Excel data added and further README.md details added)
---

## 📝 Usage

### For Students
<<<<<<< HEAD
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
=======
1. Open http://localhost:5173 and log in with `student` / `123456`.
2. Ask questions in the chat, for example:
   - *"When is my Software Construction exam?"*
   - *"What is the room for BSCS-5C Operating Systems?"*
   - *"Tell me about the DSA Project Exhibition."*
   - *"What are the prerequisites for AI?"*
3. Type `survey` to leave feedback.

### For Admins
1. Log in with `admin` / `123456` and open the **Admin Panel**.
2. **Upload timetables:** Follow Step 5 above to upload `.xlsx` or `.pdf` schedule files so the AI learns class and exam data.
3. **Add events:** Follow Step 6 above to add new university events from poster images into the AI's knowledge.
4. **Monitor:** View the **Chat Logs** section to see what students are asking and verify the bot is answering correctly.
5. **Manage documents:** Delete outdated timetable files from the **Uploaded Documents** list to keep the AI's data current.

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongooseError: connect ECONNREFUSED` | **Atlas:** Check your `MONGO_URI` and whitelist your IP in Network Access. **Local:** Make sure MongoDB Community Server is running as a service (`mongod`). |
| `Error: GOOGLE_API_KEY not found` | Make sure the `.env` file exists in `szabot-backend/` and the key is correctly set. |
| `Python not found` or parser errors | Ensure Python 3.8+ is installed and `pandas`, `pdfplumber`, `openpyxl` are installed via `pip install`. |
| Frontend shows blank / cannot connect | Confirm the backend is running on port 5000 before starting the frontend. |
| Login fails after fresh install | Run `node seed.js` in `szabot-backend/` to create the default users. |
| Admin password forgotten | Run `node fix_admin.js` in `szabot-backend/` to reset it to `admin123`. |
>>>>>>> 44dbee7 (Excel data added and further README.md details added)

---

## 🎓 Contributors
<<<<<<< HEAD
*   **Aliza Senharo (2212142)** - UI/UX Design & Frontend Development.
*   **Wasiullah Sahito (2212164)** - Backend Development, AI Integration & Database Management.

---
*Developed for SZABIST Hyderabad - Final Year Project (2024-2025)*
=======

- **Aliza Senharo (2212142)** — UI/UX Design & Frontend Development
- **Wasiullah Sahito (2212164)** — Backend Development, AI Integration & Database Management

---

*Developed for SZABIST Hyderabad — Final Year Project (2025–2026)*
>>>>>>> 44dbee7 (Excel data added and further README.md details added)
