const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    course: String,
    section: String, // canonical e.g., BSCS7A
    date: String,
    day: String,
    time: String,
    slot: String,
    filename: String
}, { timestamps: true });

module.exports = mongoose.model('ExamEntry', examSchema);
