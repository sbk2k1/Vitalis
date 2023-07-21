const { WorkspaceSql } = require('../models/workspace');
const { ConnectionSql } = require('../models/connection');
const mongoose = require('mongoose');

// Add SQL endpoint routes here

// workspace routes
// get all workspaces
// get workspace by name
// create workspace

// connection routes
// get all connections

// workspace routes

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkspaceSql.find({ user: req.user.username });
        res.status(200).json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getWorkspaceByName = async (req, res) => {
    try {
        const workspace = await WorkspaceSql.findOne({ name: req.params.name, user: req.user.username });
        res.status(200).json(workspace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createWorkspace = async (req, res) => {
    try {
        const workspace = new WorkspaceSql({
            name: req.body.name,
            user: req.user.username
        });
        const newWorkspace = await workspace.save();
        res.status(201).json(newWorkspace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// connection routes

const getConnections = async (req, res) => {

    // no existing sql connection with same server, db, table, and query

    try {
        var workspace = await WorkspaceSql.findOne({ name: req.params.workspace });
        var workspaceId = workspace._id;
        const connections = await ConnectionSql.find({ workspace: workspaceId });
        res.status(200).json(connections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createConnection = async (req, res) => {
    try {
        var workspace = req.params.workspace;
        var workspaceId = await WorkspaceSql.findOne({ name: workspace });

        const exists = await ConnectionSql.findOne({
            workspace: new mongoose.Types.ObjectId(workspaceId),
            host: req.body.host,
            database: req.body.database,
            query: req.body.query
        });

        if (exists) {
            return res.status(400).json({ message: "Connection already exists" });
        }

        const connection = new ConnectionSql({
            host: req.body.host,
            user: req.body.user,
            password: req.body.password,
            database: req.body.database,
            workspace: workspaceId,
            threshold: Number(req.body.threshold),
            numOfTimes: Number(req.body.numOfTimes),
            query: req.body.query
        });
        const newConnection = await connection.save();
        res.status(201).json(newConnection);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteWorkspace = async (req, res) => {
    try {
        var workspace = await WorkspaceSql.findOne({ name: req.params.name });
        workspace = workspace._id;

        // if there are connections in the workspace donot delete

        const connections = await ConnectionSql.find({ workspace: workspace });

        if (connections.length > 0) {
            return res.status(400).json({ message: "Workspace has connections" });
        }

        await WorkspaceSql.deleteOne({ _id: workspace });

        res.status(200).json({ message: "Workspace deleted" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteConnection = async (req, res) => {
    try {
        const workspace = await WorkspaceSql.findOne({ name: req.params.workspace });
        const workspaceId = workspace._id;

        const connection = await ConnectionSql.findOne({
            workspace: new mongoose.Types.ObjectId(workspaceId),
            host: req.query.host,
            database: req.query.database,
            query: req.query.query
        });

        if (!connection) {
            return res.status(400).json({ message: "Connection does not exist" });
        }

        await connection.deleteOne();

        res.status(200).json({ message: "Connection deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getWorkspaces,
    getWorkspaceByName,
    createWorkspace,
    getConnections,
    createConnection,
    deleteWorkspace,
    deleteConnection
};
