// controllers/configController.js
const redisPubSubService = require('../services/redisPubSubService');
const app = require('../index');

const stages=['production','developing','release'];
const microservices=['segmentation','transcription'/*,'qualityGates', 'Google translation detector', 'File Format Conversion', 'Storage'*/];

const triggeredPipelineController = {
    
    notifyCommitChange: async (req, res) => {
        console.log("repo changed");
        res.status(200).json({ message: 'Pipeline will be triggered automatically' });
    }

}

module.exports = triggeredPipelineController;