const mongoose = require('mongoose');

// Define Connection schema for API

const ConnectionApiSchema = new mongoose.Schema({
    // API connection fields
    url: {
        type: String,
        required: true,
    },
    requestType: {
        type: String,
        required: true,
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
    },
    threshold: {
        type: Number,
        required: true,
    },
    status: String,
    times: String,
    statusCode: String,
    responseSize: String,
    lastChecked: String,
    numOfTimes: {
        type: Number,
        default: 1440,
    },
});

// Export both API and SQL connection models

module.exports = ConnectionApi: mongoose.model('ConnectionApi', ConnectionApiSchema);