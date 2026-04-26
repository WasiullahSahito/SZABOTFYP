const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    filename: String,
    fileType: { type: String, enum: ['timetable', 'exam', 'other'], default: 'other' },
    content: String,
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', docSchema);
