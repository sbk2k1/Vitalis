const WorkspaceApi = require('../models/workspace');
const ConnectionApi = require('../models/connection');
const { mongoose } = require('mongoose');

// services

// getApiWorkspacesService
// getApiConnectionsService
// createApiWorkspaceService
// createApiConnectionService
// deleteApiConnectionService
// deleteApiWorkspaceService

const getApiWorkspacesService = async (params) => {
    try {
        const workspaces = await WorkspaceApi.find({ user: params });
        return {
            found: true,
            workspaces
        };
    } catch (err) {
        return {
            found: false,
            error: err.message
        }
    }
}

const getApiConnectionsService = async (params) => {
    try {
        // get workspace from params
        const workspace = await WorkspaceApi.findOne(params)
        // if workspace does not exist, return error
        if (!workspace) {
            return {
                found: false,
                error: "Workspace does not exist"
            }
        }
        // if workspace exists, get connections
        const connections = await ConnectionApi.find({ workspace: workspace._id });
        return {
            found: true,
            connections
        };
    } catch (err) {
        return {
            found: false,
            error: err.message
        };
    }
}

const createApiWorkspaceService = async (params) => {
    try {
        const workspace = new WorkspaceApi(params);
        const newWorkspace = await workspace.save();

        return {
            created: true,
            workspace: newWorkspace
        };
    } catch (err) {
        return {
            created: false,
            error: err.message
        };
    }
}

const createApiConnectionService = async (params) => {
    try {
        // first get workspace from params

        const workspace = await WorkspaceApi.findOne({name: params.workspace, user: params.user});

        // if workspace does not exist, return error

        if (!workspace) {
            return {
                created: false,
                error: "Workspace does not exist"
            }
        }

        // if workspace exists, create connection

        const connectionBody = params.connection;

        const connection = new ConnectionApi({
            url: connectionBody.url,
            requestType: connectionBody.requestType,
            workspace: workspace._id,
            threshold: connectionBody.threshold,
            status: connectionBody.status,
            times: connectionBody.times,
            statusCode: connectionBody.statusCode,
            responseSize: connectionBody.responseSize,
            lastChecked: connectionBody.lastChecked,
            numOfTimes: connectionBody.numOfTimes
        });

        const newConnection = await connection.save();

        return {
            created: true,
            connection: newConnection
        };
    } catch (err) {
        return {
            created: false,
            error: err.message
        };
    }
}

const deleteApiConnectionService = async (params) => {
    try {
        // first get workspace from params
        const workspace = await WorkspaceApi.findOne({name: params.workspace, user: params.user});
        // if workspace does not exist, return error
        if (!workspace) {
            return {
                deleted: false,
                error: "Workspace does not exist"
            }
        }
        // check if connection exists
        const connection = await ConnectionApi.findOne({
            workspace: new mongoose.Types.ObjectID(workspace._id), 
            url: params.url, requestType: 
            params.requestType
        });
        // if connection does not exist, return error
        if (!connection) {
            return {
                deleted: false,
                error: "Connection does not exist"
            }
        }
        // if connection exists, delete connection
        await connection.deleteOne();
        return {
            deleted: true,
            connection
        };
    } catch (err) {
        return {
            deleted: false,
            error: err.message
        };
    }
}

const deleteApiWorkspaceService = async (params) => {
    try {
        // first get workspace from params
        const workspace = await WorkspaceApi.findOne({name: params.workspace, user: params.user});
        // get connections related to workspace
        const connections = await ConnectionApi.find({workspace: workspace._id});
        // if connections exist return not deleted
        if (connections.length > 0) {
            return {
                deleted: false,
                error: "Workspace has existing connections"
            }
        }
        // if connections do not exist, delete workspace
        await workspace.deleteOne();
        return {
            deleted: true,
            workspace
        };
    } catch (err) {
        return {
            deleted: false,
            error: err.message
        };
    }
}

module.exports = {
    getApiWorkspacesService,
    getApiConnectionsService,
    createApiWorkspaceService,
    createApiConnectionService,
    deleteApiConnectionService,
    deleteApiWorkspaceService
}