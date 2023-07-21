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

// Define Workspace schema for SQL

const WorkspaceSqlSchema = new mongoose.Schema({
    // SQL workspace fields
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

module.exports = {
    WorkspaceApi: mongoose.model('WorkspaceApi', WorkspaceApiSchema),
    WorkspaceSql: mongoose.model('WorkspaceSql', WorkspaceSqlSchema),
};
