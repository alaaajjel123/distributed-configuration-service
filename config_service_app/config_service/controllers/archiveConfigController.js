// controllers/communConfigController.js
const archiveConfigValuesService = require('../services/archiveConfigService');
const app = require('../index');

const archiveConfigValuesController = {
    getArchiveConfigValues: async (req, res) => {
        const day = req.query.day;
        const month = req.query.month;
        const year = req.query.year;

        //test if the microservice parameter is null or does not exist
        caseError= archiveConfigValuesService.testParameters(day, month,year,res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'day month and year are required params' });
        }

        //check if the intended file exists
        /*
        caseError= archiveConfigValuesService.checkFileExists(day,month,year, res);
        if(caseError==1)
        {
            return res.status(404).json({ error: 'The required archive file not found' });
        }*/

        //get config values
        configValues = archiveConfigValuesService.readConfigFile(day, month,year, res);
        if(configValues==1)
        {
            return res.status(404).json({ error: 'The required archived config values file not found' });
        }

        //retrun config values
        return res.status(200).json(configValues);

    }

}

module.exports = archiveConfigValuesController;