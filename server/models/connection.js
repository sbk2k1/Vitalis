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

// Define Connection schema for SQL

const ConnectionSqlSchema = new mongoose.Schema({
    // SQL connection fields
    host: {
        type: String,
        required: true,
    },
    port: {
        type: Number,
        default: 3306,
    },
    user: {
        type: String,
        required: true,
    },
    password: String,
    database: {
        type: String,
        required: true,
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
    },
    query: {
        type: String,
        required: true,
    },
    threshold: Number,
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

module.exports = {
    ConnectionApi: mongoose.model('ConnectionApi', ConnectionApiSchema),
    ConnectionSql: mongoose.model('ConnectionSql', ConnectionSqlSchema),
};
