const { WorkspaceApi } = require('../models/workspace');
const { ConnectionApi } = require('../models/connection');
const { mongoose } = require('mongoose');

// Add API Controllers here

// workspace controllers
// get all workspaces
// get workspace by name
// create workspace

// connection controllers
// get all connections
// create connection


// function getWorkspaces()  - service needed  = getApiWorkspacesService

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkspaceApi.find({ user: req.user.username });
        res.status(200).json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// function getWorkspaceByName(name) - service needed = getApiWorkspacesService

const getWorkspaceByName = async (req, res) => {
    try {
        const workspace = await WorkspaceApi.findOne({ name: req.params.name, user: req.user.username });
        res.status(200).json(workspace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// function createWorkspace(name) - service needed = createApiWorkspaceService

const createWorkspace = async (req, res) => {
    try {
        const workspace = new WorkspaceApi({
            name: req.body.name,
            user: req.user.username
        });
        const newWorkspace = await workspace.save();
        res.status(201).json(newWorkspace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// connection controllers

// function getConnections(workspace) - service needed = getApiConnectionsService

const getConnections = async (req, res) => {
    // path params
    try {
        var workspace = await WorkspaceApi.findOne({ name: req.params.workspace });
        var workspaceId = workspace._id;
        const connections = await ConnectionApi.find({ workspace: workspaceId });
        res.status(200).json(connections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// function createConnection(workspace, url, method, threshold, numOfTimes) - service needed = createApiConnectionService

const createConnection = async (req, res) => {
    try {

        

        // take care of %20 in workspace name
        var workspace = req.params.workspace;

        workspace = await WorkspaceApi.findOne({ name: workspace });
        var workspaceId = workspace._id;

        const exists = await ConnectionApi.findOne({
            workspace: new mongoose.Types.ObjectId(workspaceId),
            url: req.body.url,
            requestType: req.body.requestType,
        });

        if (exists) {
            return res.status(400).json({ message: "Connection already exists" });
        }

        const connection = new ConnectionApi({
            url: req.body.url,
            requestType: req.body.requestType,
            workspace: workspaceId,
            threshold: Number(req.body.threshold),
            numOfTimes: Number(req.body.numOfTimes),
        });
        const newConnection = await connection.save();
        res.status(201).json(newConnection);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// function deleteConnection(workspace, url, method) - service needed = deleteApiConnectionService

const deleteConnection = async (req, res) => {

    console.log("here");

    try {
        const workspace = await WorkspaceApi.findOne({ name: req.params.workspace });
        const workspaceId = workspace._id;

        const connection = await ConnectionApi.findOne({
            workspace: new mongoose.Types.ObjectId(workspaceId),
            url: req.query.url,
            requestType: req.query.method,
        });

        if (!connection) {
            return res.status(400).json({ message: "Connection does not exist" });
        }

        await connection.deleteOne();

        res.status(200).json({ message: "Connection deleted" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// function deleteWorkspace(workspace) - service needed = deleteApiWorkspaceService

const deleteWorkspace = async (req, res) => {
    try {
        var workspace = await WorkspaceApi.findOne({ name: req.params.name });
        workspace = workspace._id;

        // if there are connections in the workspace donot delete

        const connections = await ConnectionApi.find({ workspace: workspace });

        if (connections.length > 0) {
            return res.status(400).json({ message: "Workspace has connections" });
        }

        await WorkspaceApi.deleteOne({ _id: workspace });

        res.status(200).json({ message: "Workspace deleted" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    getWorkspaces,
    getWorkspaceByName,
    createWorkspace,
    getConnections,
    createConnection,
    deleteConnection,
    deleteWorkspace
}
