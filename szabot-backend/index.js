const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { spawn } = require('child_process'); // For Python Parser
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- UPLOAD CONFIG ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ MongoDB Connected'));

// --- MODELS ---
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' }
}));

const KnowledgeBase = mongoose.model('KnowledgeBase', new mongoose.Schema({
    category: String,
    content: String
}));

// Stores PARSED text from Python script
const Document = mongoose.model('Document', new mongoose.Schema({
    filename: String,
    content: String,
    uploadedAt: { type: Date, default: Date.now }
}));

const ChatSession = mongoose.model('ChatSession', new mongoose.Schema({
    userId: String,
    username: String,
    title: { type: String, default: 'New Chat' },
    updatedAt: { type: Date, default: Date.now }
}));

const Message = mongoose.model('Message', new mongoose.Schema({
    sessionId: String,
    userId: String,
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
}));

const Survey = mongoose.model('Survey', new mongoose.Schema({
    username: String,
    answers: [String],
    submittedAt: { type: Date, default: Date.now }
}));

const chatStates = {};
const SURVEY_QUESTIONS = ["Was the info accurate?", "Feature suggestions?", "Rating (1-5)?"];

// --- UNIVERSITY EVENTS (extracted from official event posters) ---
const UNIVERSITY_EVENTS = [
    {
        name: "DSA Project Exhibition",
        date: "Wednesday, 26 November 2025",
        time: "8:15 AM to 10:45 AM",
        venue: "Activity Area, 8th Floor",
        organizer: "SZABIST Microsoft Learn Student Ambassador",
        description: "Data Structures & Algorithms (DSA) Project Exhibition showcasing student projects."
    },
    {
        name: "Farewell Dinner & Alumni Reunion",
        date: "Thursday, 27 November 2025",
        time: "Evening",
        venue: "SZABIST University, Hyderabad Campus",
        organizer: "SZABIST Student Council",
        description: "For final-semester students ONLY. Students in open semester are NOT eligible. Registration Deadline: Monday, 17th November 2025."
    },
    {
        name: "Ignite 2026 - Campus Connect",
        date: "Tuesday, 10 February 2026",
        time: "2:00 PM",
        venue: "Seminar Hall, 8th Floor",
        organizer: "SZABIST Performing Arts Society & SZABIST Student Council",
        description: "Annual cultural campus connect event by the Performing Arts Society."
    }
];

// --- HELPER: Match events from message ---
function searchEvents(message) {
    const lowerMsg = message.toLowerCase();
    return UNIVERSITY_EVENTS.filter(ev =>
        (lowerMsg.includes('dsa') && ev.name.toLowerCase().includes('dsa')) ||
        (lowerMsg.includes('ignite') && ev.name.toLowerCase().includes('ignite')) ||
        (lowerMsg.includes('farewell') && ev.name.toLowerCase().includes('farewell')) ||
        (lowerMsg.includes('alumni') && ev.name.toLowerCase().includes('alumni')) ||
        (lowerMsg.includes('exhibition') && ev.name.toLowerCase().includes('exhibition')) ||
        (lowerMsg.includes('campus connect') && ev.name.toLowerCase().includes('campus')) ||
        (lowerMsg.includes('dinner') && ev.name.toLowerCase().includes('dinner')) ||
        lowerMsg.includes('event')
    );
}

// --- HELPER: Smart keyword scoring for schedule lines ---
// Searches BOTH [CLASS SCHEDULE] and [EXAM SCHEDULE] tagged lines.
// Requires score >= 2 so a single shared word (e.g. "Professional")
// cannot cause a false match from a different batch/subject.
function searchSchedule(documents, message) {
    const keywords = message
        .split(/[\s,?.!()]+/)
        .filter(w => w.length > 2)
        .map(w => w.toLowerCase());

    const grouped = {};

    documents.forEach(doc => {
        const scheduleLines = doc.content
            .split('\n')
            .filter(l => l.includes('[EXAM SCHEDULE]') || l.includes('[CLASS SCHEDULE]'));

        const matches = scheduleLines
            .map(line => ({
                line,
                score: keywords.filter(k => line.toLowerCase().includes(k)).length
            }))
            .filter(({ score }) => score >= 2)   // ← must match at least 2 keywords
            .sort((a, b) => b.score - a.score)
            .map(({ line }) => line);

        if (matches.length > 0) grouped[doc.filename] = matches;
    });

    return grouped;
}

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("Token required");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) { res.status(401).send("Invalid Token"); }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).send("Admin Only");
    next();
};

// --- ROUTES ---

// Auth
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username, role: user.role });
    } else { res.status(400).json({ error: "Invalid Credentials" }); }
});

// Register (Helper)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: "Registered" });
    } catch (e) { res.status(400).json({ error: "Username taken" }); }
});

// Admin: Upload & Call Python
app.post('/api/admin/upload', authenticate, isAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    const filePath = req.file.path;
    console.log(`📂 Processing ${req.file.originalname} using Python parser...`);

    const pythonProcess = spawn('python', ['parser.py', filePath]);
    let dataString = '';

    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => console.error(`Python Err: ${data}`));

    pythonProcess.on('close', async (code) => {
        fs.unlink(filePath, () => { });

        if (code !== 0) return res.status(500).send("Parsing Failed");

        await new Document({
            filename: req.file.originalname,
            content: dataString
        }).save();

        console.log("✅ Parsed & Saved.");
        res.json({ message: "File Processed Successfully" });
    });
});

app.get('/api/admin/documents', authenticate, isAdmin, async (req, res) => {
    const docs = await Document.find({}, 'filename uploadedAt');
    res.json(docs);
});

app.delete('/api/admin/documents/:id', authenticate, isAdmin, async (req, res) => {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Stats & Logs
app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
    const u = await User.countDocuments();
    const d = await Document.countDocuments();
    const s = await ChatSession.countDocuments();
    res.json({ users: u, docs: d, sessions: s });
});

app.get('/api/admin/logs', authenticate, isAdmin, async (req, res) => {
    const sessions = await ChatSession.find().sort({ updatedAt: -1 }).limit(20);
    const logs = await Promise.all(sessions.map(async (s) => {
        const msgs = await Message.find({ sessionId: s._id }).sort({ timestamp: 1 });
        return { id: s._id, username: s.username, title: s.title, messages: msgs };
    }));
    res.json(logs);
});

// Chat Sessions
app.get('/api/sessions', authenticate, async (req, res) => {
    const sessions = await ChatSession.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(sessions);
});

app.post('/api/sessions', authenticate, async (req, res) => {
    const session = new ChatSession({ userId: req.user.id, username: req.user.username, title: "New Chat" });
    await session.save();
    res.json(session);
});

app.delete('/api/sessions/:id', authenticate, async (req, res) => {
    await ChatSession.deleteOne({ _id: req.params.id, userId: req.user.id });
    await Message.deleteMany({ sessionId: req.params.id });
    res.json({ message: "Deleted" });
});

app.get('/api/history/:sessionId', authenticate, async (req, res) => {
    const msgs = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
    res.json(msgs);
});

// --- AI CHAT LOGIC ---
app.post('/api/chat', authenticate, async (req, res) => {
    const { message, sessionId } = req.body;
    const userId = req.user.id;
    const lowerMsg = message.toLowerCase();

    if (!sessionId) return res.status(400).send("Session ID Required");

    await new Message({ sessionId, userId, sender: 'user', text: message }).save();

    // Auto Title
    const session = await ChatSession.findById(sessionId);
    if (session && session.title === 'New Chat') {
        session.title = message.substring(0, 30) + '...';
        await session.save();
    }

    let botReply = "";

    // 1. GREETING LOGIC (Highest Priority)
    if (['hi', 'hello', 'hey'].includes(lowerMsg) || lowerMsg.startsWith('hi ') || lowerMsg.startsWith('hello ')) {
        botReply = "Hi! I am SZABOT 👋. I can help you with:\n• 📅 Exam schedules & timetables\n• 🎉 University events (DSA Exhibition, Ignite, Farewell)\n• 🏫 Faculty & fee information\n\nHow can I assist you today?";
    }
    // 2. SURVEY IN PROGRESS
    else if (chatStates[sessionId]) {
        const state = chatStates[sessionId];
        state.answers.push(message);
        state.step++;
        if (state.step < SURVEY_QUESTIONS.length) {
            botReply = SURVEY_QUESTIONS[state.step];
        } else {
            await new Survey({ username: req.user.username, answers: state.answers }).save();
            delete chatStates[sessionId];
            botReply = "✅ Survey saved! Thank you for your feedback.";
        }
    }
    // 3. TRIGGER SURVEY
    else if (lowerMsg.includes('survey') || lowerMsg.includes('feedback')) {
        chatStates[sessionId] = { step: 0, answers: [] };
        botReply = `📋 **Feedback Survey**\n\n${SURVEY_QUESTIONS[0]}`;
    }
    // 4. AI LOGIC — Intent Detection
    else {
        const kbDocs = await KnowledgeBase.find({});
        let contextData = kbDocs.map(d => `[${d.category}]: ${d.content}`).join("\n");

        // ── INTENT DETECTION ──────────────────────────────────────────────
        const isExamQuery = /\bexam\b|\btest\b|\bpaper\b|\bmid\b|\bfinal\b/.test(lowerMsg);
        const isClassQuery = !isExamQuery && /\bclass\b|\blecture\b|\blab\b|\bschedule\b|\btimetable\b|\broom\b|\bslot\b|\bwhen is (my|the)? ?(class|lecture)\b/.test(lowerMsg);
        const isEventQuery = /\bevent\b|\bexhibition\b|\bdsa\b|\bignite\b|\bfarewell\b|\balumni\b|\bdinner\b|\bcampus connect\b|\bperforming arts\b|\bactivity\b|\bprogramme\b/.test(lowerMsg);
        const hasBatchCode = /bs[a-z]{2}-?\d[a-z]/i.test(message);

        // ── EVENT CONTEXT ─────────────────────────────────────────────────
        if (isEventQuery) {
            const matched = searchEvents(message);
            const eventList = matched.length > 0 ? matched : UNIVERSITY_EVENTS;
            let eventCtx = "\n\n=== 🎉 UNIVERSITY EVENTS DATA ===\n";
            eventList.forEach(ev => {
                eventCtx += `\nEvent: ${ev.name}\nDate: ${ev.date}\nTime: ${ev.time}\nVenue: ${ev.venue}\nOrganizer: ${ev.organizer}\nDetails: ${ev.description}\n---`;
            });
            eventCtx += "\n=================================\n";
            contextData += eventCtx;
        }

        // ── SCHEDULE CONTEXT (exam or class) ──────────────────────────────
        if (isExamQuery || isClassQuery || hasBatchCode) {
            const documents = await Document.find({});
            const scheduleMatches = searchSchedule(documents, message);

            if (Object.keys(scheduleMatches).length > 0) {
                const tag = isExamQuery ? "📅 EXAM TIMETABLE DATA" : "🏫 CLASS SCHEDULE DATA";
                let schedCtx = `\n\n=== ${tag} ===\n`;
                for (const [filename, lines] of Object.entries(scheduleMatches)) {
                    schedCtx += `\n--- From: ${filename} ---\n${lines.join('\n')}\n`;
                }
                schedCtx += "\n==============================\n";
                contextData += schedCtx;
            } else {
                // Fallback: send all docs so AI can still reason
                let allDocs = "\n\n=== ALL SCHEDULE DATA ===\n";
                documents.forEach(doc => { allDocs += `\n--- ${doc.filename} ---\n${doc.content}\n`; });
                allDocs += "\n=========================\n";
                contextData += allDocs;
            }
        }

        // ── BUILD PROMPT ──────────────────────────────────────────────────
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are SZABOT, the official AI assistant for SZABIST University Hyderabad Campus.
Use ONLY the CONTEXT below to answer. Never mix up exam schedules, class schedules, and events.

CONTEXT:
${contextData}

=== STRICT RESPONSE RULES BY QUERY TYPE ===

━━━ TYPE 1: EXAM SCHEDULE QUERY ━━━
Triggered when student asks: "when is my exam", "exam of [subject]", "exam date", "paper of [batch]", etc.
Data tag in context: [EXAM SCHEDULE]
Format: Date: <DAY DATE> | Time: <SLOT> | Venue: <ROOM> | Floor: <FLOOR> | Info: <SUBJECT (BATCH) TEACHER>
➤ Always reply with ALL of: Subject name, Batch, Exam Date, Exam Time, Venue, Floor, Teacher name.
➤ Reply format:
   "📋 **EXAM SCHEDULE**
   📚 Subject: [Subject Name]
   👥 Batch: [BSCS-5C / BSSE etc.]
   🗓️ Date: [Day, DD/MM/YY]
   ⏰ Time: [Start – End]
   📍 Venue: [Room], [Floor]
   👨‍🏫 Teacher: [Name]"
➤ If multiple exams match, list each one separately.
➤ If no match found, say: "I couldn't find an exam for [subject/batch] in the uploaded timetable."

━━━ TYPE 2: CLASS SCHEDULE QUERY ━━━
Triggered when student asks: "when is my class", "class schedule", "what room is [subject]", "lecture time", etc.
Data tag in context: [CLASS SCHEDULE]
Format: Day: <DAY> | Time: <SLOT> | Room: <ROOM> | Class: <SUBJECT BATCH TEACHER>

➤ CRITICAL MATCHING RULES — read carefully:
   - The "Class" field contains: Subject Name + Batch Code + Teacher Name all in one string.
   - You MUST match BOTH the subject name AND the batch code from the student's question.
   - Example: "Professional Practices BSCS-7A" and "Professional Development BBA-6B" are
     COMPLETELY DIFFERENT subjects for DIFFERENT batches. NEVER confuse them.
   - NEVER return a result where only one word partially matches (e.g. "Professional" alone).
   - If a student says "BSCS-5C Operating Systems", only return lines that contain
     BOTH "BSCS-5C" AND "Operating Systems" in the Class field.
   - Return ALL matching days (Monday, Tuesday, Wednesday, Thursday, Friday) for that subject+batch.

➤ Always reply with ALL of: Subject, Batch, Day, Time, Room, Teacher.
➤ Reply format (repeat block for each day the class occurs):
   "🏫 **CLASS SCHEDULE**
   📚 Subject: [Subject Name & Code]
   👥 Batch: [Batch]
   🗓️ Day: [Day Name]
   ⏰ Time: [Slot]
   📍 Room: [Room]
   👨‍🏫 Teacher: [Teacher Name]"

➤ NEVER mix class schedule data into an exam answer or vice versa.

━━━ TYPE 3: EVENT QUERY ━━━
Triggered when student asks about: DSA exhibition, Ignite, Farewell, Alumni, Campus Connect, or any event/activity.
Data tag in context: UNIVERSITY EVENTS DATA
➤ Always reply with ALL of: Event name, Date, Time, Venue, Organizer, and any special notes.
➤ Reply format:
   "🎉 **[Event Name]**
   🗓️ Date: [Date]
   ⏰ Time: [Time]
   📍 Venue: [Venue]
   🏢 Organizer: [Organizer]
   ℹ️ Note: [Any important details]"
➤ NEVER use exam or class data to answer event questions.

━━━ TYPE 4: GENERAL / FACULTY / FEES ━━━
Use knowledge base info. Be concise and friendly.

=== IMPORTANT ===
- NEVER confuse an exam date with a class schedule or event date.
- NEVER confuse subjects with similar names:
  "Professional Practices" (CSC4102, BSCS-7A) ≠ "Professional Development" (BBA elective).
  They are different subjects for different batches.
- A subject that appears on multiple days must show ALL days, not just one.
- If the student's question is ambiguous (e.g. just "when is Software Construction?"), ask:
  "Are you asking about the 📅 exam date or 🏫 class schedule for Software Construction?"
- Always be friendly and reply in the same language the student used.

Student Question: ${message}`;

        try {
            const result = await model.generateContent(prompt);
            botReply = result.response.text();
        } catch (e) {
            console.error("Gemini Error:", e);
            botReply = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
        }
    }

    await new Message({ sessionId, userId, sender: 'bot', text: botReply }).save();
    res.json({ reply: botReply });
});

app.listen(5000, () => console.log('🚀 Server running on 5000'));