const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' }
}));

const fix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔌 Connected to DB...");

        // 1. Delete existing admin to be safe
        await User.deleteOne({ username: "admin" });

        // 2. Re-create Admin with known password
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const newAdmin = new User({
            username: "admin",
            password: hashedPassword,
            role: "admin"
        });

        await newAdmin.save();

        console.log("✅ SUCCESS: Admin user recreated.");
        console.log("👉 Username: admin");
        console.log("👉 Password: admin123");

        process.exit();
    } catch (e) {
        console.error("❌ Error:", e);
        process.exit(1);
    }
};

fix();