const mongoose = require('mongoose');

const kbSchema = new mongoose.Schema({
    category: String,
    content: String
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeBase', kbSchema);
