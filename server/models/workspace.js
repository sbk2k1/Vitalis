const mongoose = require('mongoose');

// Define Workspace schema for API

const WorkspaceApiSchema = new mongoose.Schema({
    // API workspace fields
    name: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: String,
        required: true
    }
});

// Export both API and SQL workspace models

module.exports = mongoose.model('WorkspaceApi', WorkspaceApiSchema);
