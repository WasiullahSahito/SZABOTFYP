const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    sessionId: String,
    userId: String,
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', msgSchema);
