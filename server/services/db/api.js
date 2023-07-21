const WorkspaceApi  = require('../models/workspace');
const ConnectionApi = require('../models/connection');
const {mongoose}      = require('mongoose');

// services

// getApiWorkspacesService
// getApiConnectionsService
// createApiWorkspaceService
// createApiConnectionService
// deleteApiConnectionService
// deleteApiWorkspaceService

const getApiWorkspacesService = async (params) => {
    try {
        const workspaces = await WorkspaceApi.find({user: params});
        return workspaces;
    } catch (err) {
        return err;
    }
}

const getApiConnectionsService = async (params) => {
    try {
        const connections = await ConnectionApi.find(params);
        return connections;
    } catch (err) {
        return err;
    }
}

const createApiWorkspaceService = async (params) => {
    try {
        const workspace = new WorkspaceApi(params);
        const newWorkspace = await workspace.save();
        return newWorkspace;
    } catch (err) {
        return err;
    }
}

const createApiConnectionService = async (params) => {
    try {
        const connection = new ConnectionApi(params);
        const newConnection = await connection.save();
        return newConnection;
    } catch (err) {
        return err;
    }
}

const deleteApiConnectionService = async (params) => {
    try {
        const connection = await ConnectionApi.deleteOne(params);
        return connection;
    } catch (err) {
        return err;
    }
}

const deleteApiWorkspaceService = async (params) => {
    try {
        const workspace = await WorkspaceApi.deleteOne(params);
        return workspace;
    } catch (err) {
        return err;
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