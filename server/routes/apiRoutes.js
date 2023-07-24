const Router = require('express').Router;
const router = Router();

const apiControllers = require('../controllers/apiControllers');

const {auth} = require('../middlewares/auth');

// worspace routes
// create workspace
// get all workspaces
// get workspace by name

// connection routes
// create connection
// get all connections


// workspace routes
router.get('/workspaces', auth,  apiControllers.getWorkspaces);
router.get('/workspaces/:name', auth,  apiControllers.getWorkspaceByName);
router.post('/workspaces', auth,  apiControllers.createWorkspace);
router.delete('/workspaces/:name', auth,  apiControllers.deleteWorkspace);

// connection routes
router.get('/connections/:workspace', auth,  apiControllers.getConnections);
router.get('/connections/populate/:name', auth, apiControllers.populateConnection)
router.post('/connections/:workspace', auth,  apiControllers.createConnection);
router.delete('/connections/:workspace', auth,  apiControllers.deleteConnection);

module.exports = router;