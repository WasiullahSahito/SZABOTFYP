const mongoose = require('mongoose');

const ttSchema = new mongoose.Schema({
    day: String,
    floor: String,
    venue: String,
    timeSlot: String,
    classInfo: String,
    filename: String
}, { timestamps: true });

module.exports = mongoose.model('TimetableEntry', ttSchema);
