const Router = require('express').Router;
const router = Router();

const sqlControllers = require('../controllers/sqlControllers');

const {auth} = require('../middlewares/auth');

// worspace routes
// create workspace
// get all workspaces
// get workspace by name

// connection routes
// create connection
// get all connections

// workspace routes
router.get('/workspaces', auth, sqlControllers.getWorkspaces);
router.get('/workspaces/:name', auth, sqlControllers.getWorkspaceByName);
router.post('/workspaces', auth, sqlControllers.createWorkspace);
router.delete('/workspaces/:name', auth,  sqlControllers.deleteWorkspace);

// connection routes
router.get('/connections/:workspace', auth, sqlControllers.getConnections);
router.post('/connections/:workspace', auth, sqlControllers.createConnection);
router.delete('/connections/:workspace', auth, sqlControllers.deleteConnection);

module.exports = router;