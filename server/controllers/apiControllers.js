const { WorkspaceApi } = require('../models/workspace');
const { ConnectionApi } = require('../models/connection');
const { mongoose } = require('mongoose');
const apiServices = require('../services/db/api');
const uuid = require('uuid');
const redisClient = require('../services/redis');

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
        const workspaces = apiServices.getApiWorkspacesService({ user: req.user.username });
        res.status(200).json({
            error: false,
            workspaces
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};

// function getWorkspaceByName(name) - service needed = getApiWorkspacesService

const getWorkspaceByName = async (req, res) => {
    try {

        const workspace = await apiServices.getApiWorkspacesService({ name: req.params.name, user: req.user.username });

        // if length is 0, workspace does not exist
        if (workspace.length === 0) {
            return res.status(400).json({
                error: true,
                message: "Workspace does not exist"
            });
        }

        res.status(200).json({
            error: false,
            workspace: workspace[0]
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};

// function createWorkspace(name) - service needed = createApiWorkspaceService

const createWorkspace = async (req, res) => {
    try {
        const workspace = {
            name: req.body.name,
            user: req.user.username
        }
        const newWorkspace = await apiServices.createApiWorkspaceService(workspace);
        if (!newWorkspace.created) {
            return res.status(400).json({
                error: true,
                message: "Workspace already exists"
            });
        }
        res.status(201).json({
            error: false,
            workspace: newWorkspace.workspace
        });

    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }
};

// connection controllers

// function getConnections(workspace) - service needed = getApiConnectionsService

const getConnections = async (req, res) => {
    // path params
    try {

        const workspaceParam = { name: req.params.workspace };

        const connections = await apiServices.getApiConnectionsService(workspaceParam);

        if (!connections.found) {
            return res.status(400).json({
                error: true,
                message: connections.error
            });
        }

        res.status(200).json(connections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// function to populate connection - service needed = populateApiConnectionService

const populateConnection = async (req, res) => {
    try {
        console.log(req.params.name);
        // get uniqueId from params
        const uniqueId = req.params.name;
        // get data from redis 
        const data = await redisClient.get(uniqueId);
        // if data is null, connection does not exist
        if (!data) {
            return res.status(400).json({
                error: true,
                message: "Connection does not exist"
            });
        }
        // parse data
        const parsedData = JSON.parse(data);
        // return data
        res.status(200).json({
            error: false,
            data: parsedData
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
}

// function createConnection(workspace, url, method, threshold, numOfTimes) - service needed = createApiConnectionService

const createConnection = async (req, res) => {
    try {
        // take care of %20 in workspace name

        // create unique id

        const uniqueId = uuid.v4();

        var params = { 
            workspace: req.params.workspace, 
            uniqueId: uniqueId,
            connection: req.body, 
            user: req.user.username 
        };
        const connection = await apiServices.createApiConnectionService(params);

        if (!connection.created) {
            return res.status(400).json({
                error: true,
                message: connection.error
            });
        }

        res.status(201).json({
            error: false,
            connection: connection.connection
        });
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }
};

// function deleteConnection(workspace, url, method) - service needed = deleteApiConnectionService

const deleteConnection = async (req, res) => {


    try {
        const params = { workspace: req.params.workspace, user: req.user.username, url: req.query.url, requestType: req.query.method };
        const connection = await apiServices.deleteApiConnectionService(params);

        if (!connection.deleted) {
            return res.status(400).json({
                error: true,
                message: connection.error
            });
        }

        res.status(200).json({
            error: false,
            message: "Connection deleted"
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};

// function deleteWorkspace(workspace) - service needed = deleteApiWorkspaceService

const deleteWorkspace = async (req, res) => {
    try {
        const params = { workspace: req.params.workspace, user: req.user.username };
        const workspace = await apiServices.deleteApiWorkspaceService(params);

        if (!workspace.deleted) {
            return res.status(400).json({
                error: true,
                message: workspace.error
            });
        }

        res.status(200).json({
            error: false,
            message: "Workspace deleted"
        });
    } catch (err) {

        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};



module.exports = {
    getWorkspaces,
    getWorkspaceByName,
    createWorkspace,
    getConnections,
    createConnection,
    deleteConnection,
    deleteWorkspace,
    populateConnection
}
