const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// --- MODELS ---
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
}));

const KnowledgeBase = mongoose.model('KnowledgeBase', new mongoose.Schema({
    category: String,
    content: String
}));

// Document Model (For Uploaded Timetables) - We verify it exists here
const Document = mongoose.model('Document', new mongoose.Schema({
    filename: String,
    content: String,
    uploadedAt: { type: Date, default: Date.now }
}));

// --- SEED LOGIC ---
const seed = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected!");

        console.log("🧹 Clearing old data...");
        await KnowledgeBase.deleteMany({});
        await User.deleteMany({});
        await Document.deleteMany({});
        console.log("👤 Creating Users...");
        const hashedPass = await bcrypt.hash("123456", 10);
        await User.insertMany([
            { username: "student", password: hashedPass, role: "student" },
            { username: "admin", password: hashedPass, role: "admin" }
        ]);

        console.log("📚 Seeding Knowledge Base (Formatted)...");
        const seedData = [

            // --- 1. ACRONYMS (Helps AI understand abbreviations) ---
            {
                category: "Acronyms",
                content: `
                • OOP = Object Oriented Programming
                • FOP = Fundamentals of Programming
                • DSA = Data Structures & Algorithms
                • DLD = Digital Logic Design
                • DB = Database Systems
                • OS = Operating Systems
                • AI = Artificial Intelligence
                • FYP = Final Year Project
                • COAL = Computer Organization and Assembly Language
                • PDC = Parallel and Distributed Computing
                • CNDC = Computer Networks and Data Communication
                • HCI = Human Computer Interaction
                • SE = Software Engineering
                
                `
                
            },

            // --- 2. MASTER PREREQUISITE LIST (Direct Answers) ---
            {
                category: "CS Prerequisites Master List",
                content: `
                To be offered a course, you must pass its prerequisite:
                1. For **Object Oriented Programming (OOP)**, you must pass **Fundamentals of Programming (PF)**.
                2. For **Data Structures (DSA)**, you must pass **Object Oriented Programming (OOP)**.
                3. For **Digital Logic Design (DLD)**, you must pass **Applied Physics**.
                4. For **Computer Org & Assembly (COAL)**, you must pass **Digital Logic Design (DLD)**.
                5. For **Database Systems (DB)**, you must pass **Data Structures (DSA)**.
                6. For **Operating Systems (OS)**, you must pass **Data Structures (DSA)**.
                7. For **Design & Analysis of Algo**, you must pass **Data Structures (DSA)**.
                8. For **Compiler Construction**, you must pass **Finite Automata Theory**.
                9. For **Artificial Intelligence**, you must pass **Discrete Math Structures**.
                10. For **Parallel Computing**, you must pass **Operating Systems**.
                11. For **FYP-II**, you must pass **FYP-I**.`
            },
            {
                category: "Why Choose SZABIST",
                content: `Why Choose SZABIST University?
1. **Excellence:** Our motto is "We just Don't Work Hard, We Work Smart".
2. **Recognition:** HEC recognized and Chartered by the Sindh Assembly (Act XIX of 2023).
3. **Facilities:** State-of-the-art Computer Labs (Robotics, AI), 24/7 Digital Library, and Air-conditioned classrooms.
4. **Employability:** Strong industry linkages, Office of Research Innovation & Commercialization (ORIC), and Entrepreneurial Nest (ZEN) for startups.
5. **Location:** Prime location at State Life Building, Thandi Sarak, Hyderabad.
6. **Student Life:** Vibrant student societies and active scholarship programs.`
            },
            
            // --- BSCS SEMESTER 1 ---
            {
                category: "BSCS Semester 1",
                content: "• CSC 1101: Calculus & Analytical Geometry (3 cr)\n• CSC 1102: English Composition (3 cr)\n• CSC 1103: Fundamentals of Programming (3+1 cr)\n• CSC 1107: Applied Physics (2+1 cr)\n• CSC 1108: Intro to Computer Science (2+1 cr)\n• CSC 1109: Pakistan Studies (2 cr)"
            },
            // --- BSCS SEMESTER 2 ---
            {
                category: "BSCS Semester 2",
                content: "• CSC 1208: Object Oriented Programming (3+1 cr) | Pre-req: CSC 1103 Fundamentals of Programming\n• CSC 2101: Communication Skills (3 cr) | Pre-req: CSC 1102 English Composition\n• CSC 2103: Digital Logic Design (3+1 cr) | Pre-req: CSC 1107 Applied Physics\n• CSC 1206: Probability and Statistics (3 cr)\n• CSC 1209: Islamic Studies (2 cr)"
            },
            // --- BSCS SEMESTER 3 ---
            {
                category: "BSCS Semester 3",
                content: "• CSC 1201: Discrete Math Structures (3 cr)\n• CSC 2102: Data Structures & Algo (DSA) (3+1 cr) | Pre-req: CSC 1208 Object Oriented Programming (OOP)\n• CSC 2201: Computer Org & Assembly (COAL) (3+1 cr) | Pre-req: CSC 2103 Digital Logic Design (DLD)\n• Elective: University Elective-1\n• Support: CS Supporting-1"
            },
            // --- BSCS SEMESTER 4 ---
            {
                category: "BSCS Semester 4",
                content: "• CSC 2203: Database Systems (3+1 cr) | Pre-req: CSC 2102 Data Structures (DSA)\n• CSC 2204: Finite Automata Theory (3 cr)\n• CSC 2206: Linear Algebra (3 cr)\n• CSC 3202: Design & Analysis of Algo (3 cr) | Pre-req: CSC 2102 Data Structures (DSA)\n• Elective: University Elective-2"
            },
            // --- BSCS SEMESTER 5 ---
            {
                category: "BSCS Semester 5",
                content: "• CSC 2205: Operating Systems (3+1 cr) | Pre-req: CSC 2102 Data Structures (DSA)\n• CSC 3109: Software Engineering (3 cr)\n• CSC 3201: Compiler Construction (3 cr) | Pre-req: CSC 2204 Finite Automata Theory\n• Support: CS Supporting-2\n• Support: CS Supporting-3"
            },
            // --- BSCS SEMESTER 6 ---
            {
                category: "BSCS Semester 6",
                content: "• CSC 1205: Technical Writing (3 cr) | Pre-req: CSC 2101 Communication Skills\n• CSC 3205: Computer Networks (3+1 cr)\n• CSC 4101: Artificial Intelligence (3+1 cr) | Pre-req: CSC 1201 Discrete Structures\n• Elective: CS Elective-1\n• Elective: CS Elective-2"
            },
            // --- BSCS SEMESTER 7 ---
            {
                category: "BSCS Semester 7",
                content: "• CSC 4105: Final Year Project-I (3 cr)\n• CSC 4106: Parallel Computing (3 cr) | Pre-req: CSC 2205 Operating Systems\n• CSC 4102: Professional Practices (3 cr)\n• Elective: CS Elective-3\n• Elective: University Elective-3"
            },
            // --- BSCS SEMESTER 8 ---
            {
                category: "BSCS Semester 8",
                content: "• CSC 4201: Information Security (3 cr)\n• CSC 4205: Final Year Project-II (3 cr) | Pre-req: CSC 4105 Final Year Project-I\n• Elective: CS Elective-4\n• Elective: CS Elective-5\n• Elective: University Elective-4"
            },
            // --- FACULTY DATA ---
            {
                category: "CS Faculty",
                content: `Computer Science Faculty List:
1. **DR. AMIR HASSAN** (Professor) - amir.pathan@hyd.szabist.edu.pk
2. **DR. SYED RAZA HUSSAIN SHAH** (Professor) - raza.shah@hyd.szabist.edu.pk
3. **DR. AIJAZ AHMED SIDDIQUI** (Asst. Professor) - dr.aijaz@hyd.szabist.edu.pk
4. **DR. UM-E-HABIBA ALVI** (Asst. Professor) - ume.habiba@hyd.szabist.edu.pk

IMPORTANT: For the complete list and more details, visit the official link: 
https://hyd.szabist.edu.pk/academics.html#faculty`
            },
            // --- FEE STRUCTURE ---
            {
                category: "CS Fee Structure",
                content: `Fee Structure for Computer Science (BSCS, BSSE, BSAI):
• Admission Fee: PKR 25,000 (One time)
• Security Deposit: PKR 15,000 (Refundable)
• Tuition Fee: PKR 7,200 per Credit Hour
• Approx Semester Fee: PKR 110,000 - 135,000

IMPORTANT: For the latest fee schedule, visit the official link: 
https://hyd.szabist.edu.pk/admission.html#feeStructure`
            },
            // --- ZABDESK ---
            {
                category: "ZABDESK",
                content: "• Link: https://fallzabdeskhyd.szabist.edu.pk/index.asp\n• Issues: Report login errors via Survey."
            }
        ];

        await KnowledgeBase.insertMany(seedData);
        console.log("✅ SEEDING COMPLETE! User: student/123456");
        process.exit();
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

seed();