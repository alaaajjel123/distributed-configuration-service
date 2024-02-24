// routes/configRoutes.js
const express = require('express');
const router = express.Router();
const configValuesController = require('../controllers/configController');
const communConfigValuesController = require('../controllers/communConfigController');
const archiveConfigValuesController = require('../controllers/archiveConfigController');
const triggeredPipelineController = require('../controllers/triggeredPipelineController');
const app = require('../index')

/*as old*/
router.get('/config/:microservice/', configValuesController.getConfigValues);
router.post('/config/:microservice/', configValuesController.addConfigValue);
router.put('/config/:microservice/', configValuesController.updateConfigValue);
router.delete('/config/:microservice/', configValuesController.deleteConfigValue);
/*as old*/
 

/*new to commun*/
router.get('/commonconfigs/', communConfigValuesController.getCommunConfigValues);
router.post('/commonconfigs/', communConfigValuesController.addCommunConfigValue);
router.put('/commonconfigs/', communConfigValuesController.updateCommunConfigValue);
router.delete('/commonconfigs/', communConfigValuesController.deleteCommunConfigValue);
/*new to commun*/



/*to get archived file*/
router.get('/archivedConfigs/', archiveConfigValuesController.getArchiveConfigValues);
/*to get archived file*/


/*when triggering a pipeline */
router.post('/triggeredPipeline/', triggeredPipelineController.notifyCommitChange);
/*when triggering a pipeline */

module.exports = router;