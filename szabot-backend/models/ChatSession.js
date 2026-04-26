const mongoose = require('mongoose');

const csSchema = new mongoose.Schema({
    userId: String,
    username: String,
    title: { type: String, default: 'New Chat' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatSession', csSchema);
