const fs = require('fs');
// controllers/communConfigController.js
const communConfigValuesService = require('../services/communConfigService');
const configValuesService = require('../services/configService');
const redisPubSubService = require('../services/redisPubSubService');
const app = require('../index');

/*
const stages=['production','developing','release'];
const microservices=['segmentation','transcription'/*,'qualityGates', 'Google translation detector', 'File Format Conversion', 'Storage'];*/
let microservices =[]
let stages=[]
const filePath = `./services.map.json`;
const microservices_stages_parsed = fs.readFileSync(filePath);
const microservices_stages = JSON.parse(microservices_stages_parsed);
for(elt in microservices_stages)
{
    microservices.push(elt)
}

for(elt in microservices_stages['segmentation'])
{
    stages.push(microservices_stages['segmentation'][elt])
}
//console.log(microservices)
//console.log(stages)


const communConfigValuesController = {
    getCommunConfigValues: async (req, res) => {
        const stage = req.query.stage;
        //const { microservice, stage } = req.params;
        //const microservice = req.params.microservice;
    
        //test if the microservice parameter is null or does not exist
        //caseError= configValuesService.testReqParams(microservice, microservices,stage,stages, res);
        //if(caseError==1)
        //{
        //    return res.status(400).json({ error: 'Microservice and stage are required parameters' });
        //}

        //test if the stage param exist
        caseError= communConfigValuesService.testParameter(stage, res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'stage parameter ' });
        }
    
        //check if the intended file exists
        caseError= communConfigValuesService.checkCommunFileExists(stage);
        if(caseError==1)
        {
            return res.status(404).json({ error: 'Commun file not found' });
        }
    
        //get config values
        communConfigValues = communConfigValuesService.readCommunConfigFile(stage);
        if(communConfigValues==1)
        {
            return res.status(404).json({ error: 'Config values not found' });
        }
    
        //retrun config values
        return res.status(200).json(communConfigValues); 
    
    },   
       
    addCommunConfigValue: async (req, res) => {
        const stage = req.query.stage;
        const new_config_value = req.body;
        const new_config_value_name = new_config_value['config_value_name'];
        const new_config_value_value = new_config_value['config_value_value'];
        let caseError;
        let communConfigValues;


        //test if the stage param exist
        caseError= communConfigValuesService.testParameter(stage, res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'stage parameter ' });
        }

        //test if the body params exist
        caseError= communConfigValuesService.testBodyParams(new_config_value_name, new_config_value_value, res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'Body parameters are required parameters' });
        }


        //check if the intended file exists
        caseError= communConfigValuesService.checkCommunFileExists(stage);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'Non existing file' });
        }

        //get config values
        communConfigValues = communConfigValuesService.readCommunConfigFile(stage);
        if(communConfigValues==1)
        {
            return res.status(404).json({ error: 'The required file not found' });
        }


        //check if the new config value does not exist
        caseError= communConfigValuesService.checkNonExistingCommunConfigValue(new_config_value_name ,communConfigValues , res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'config value already exists' });
        }

        //add the new config value to commun file
        caseError= communConfigValuesService.addConfigValueCommunFile( stage, new_config_value_name, new_config_value_value, communConfigValues, res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'config value not added to file' });
        }

        for(microservice in microservices)
        {

                //get config values for this specific file
                configValues = configValuesService.readConfigFile(microservices[microservice], stage, res);
                if(configValues==1)
                {
                    return res.status(404).json({ error: `The required file config_values.${microservices[microservice]}.${stage} not found` });
                }

                if(new_config_value_name in configValues)
                {
                    configValuesService.updateConfigValueFile(microservices[microservice], stage,configValues, new_config_value_name, new_config_value_value, res);
                    redisPubSubService.updateConfigValueRedis(microservices[microservice], stage, new_config_value_name, new_config_value_value, res);
                }
        }

        //notify subscribed microservices
        redisPubSubService.sendNotificationPubSubCommon(stage);

        //create archive file or add configs to existing config file if exists
        communConfigValuesService.create_archive_file_common(stage);

        res.status(200).json({ message: 'Configuration value added successfully' });


    },

    updateCommunConfigValue: async (req, res) => {

        const stage = req.query.stage;
        const new_config_value = req.body;
        const new_config_value_name = new_config_value['config_value_name'];
        const new_config_value_value = new_config_value['config_value_value'];
        let caseError;
        let configValues;

        //test if the stage param exist
        caseError= communConfigValuesService.testParameter(stage, res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'stage parameter ' });
        }

        //test if the body params exist
        caseError= communConfigValuesService.testBodyParams(new_config_value_name, new_config_value_value, res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'Body parameters are required parameters' });
        }

        //check if the intended file exists
        caseError= communConfigValuesService.checkCommunFileExists(stage);   
        if(caseError==1)
        {
            return res.status(400).json({ error: 'Non existing file' });
        }

        //get config values
        configValues = communConfigValuesService.readCommunConfigFile(stage);
        if(configValues==1)
        {
            return res.status(404).json({ error: 'The required file not found' });
        }

        //check if the new config value does exist
        caseError= communConfigValuesService.checkExistingCommunConfigValue(new_config_value_name ,configValues , res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'config value already exists' });
        }

        //update the config value to local file
        caseError = communConfigValuesService.updateCommunConfigValueFile(stage, configValues, new_config_value_name, new_config_value_value, res);
        if(caseError==1)
        {
        res.status(500).json({ error: 'Internal Server Error:  config value not updated in files' });
        }

        for(microservice in microservices)
        {
                //get config values
                configValues = configValuesService.readConfigFile(microservices[microservice], stage, res);
                if(configValues==1)
                {
                    return res.status(404).json({ error: `The required file config_values.${microservices[microservice]}.${stage} not found` });
                }

                if(new_config_value_name in configValues)
                {
                    configValuesService.updateConfigValueFile(microservices[microservice], stage,configValues, new_config_value_name, new_config_value_value, res);
                    redisPubSubService.updateConfigValueRedis(microservices[microservice], stage, new_config_value_name, new_config_value_value, res);
                }
        }

        //notify subscribed microservices
        redisPubSubService.sendNotificationPubSubCommon(stage);

        //create archive file or add configs to existing config file if exists
        communConfigValuesService.create_archive_file_common(stage);

        res.status(200).json({ message: 'Configuration value updated successfully' });

    },


    deleteCommunConfigValue: async (req, res) => {

        const stage = req.query.stage;
        const new_config_value = req.body;
        const new_config_value_name = new_config_value['config_value_name'];

        //test if the body params exist
        caseError= configValuesService.testBodyParam(new_config_value_name, res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'Body parameters are required parameters' });
        }

        //check if the intended file exists
        caseError= communConfigValuesService.checkCommunFileExists(stage);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'Non existing file' });
        }

        //get config values
        communConfigValues = communConfigValuesService.readCommunConfigFile(stage);
        if(communConfigValues==1)
        {
            return res.status(404).json({ error: 'Commun config values not found' });
        }

        //check if the new config value does exist
        caseError= communConfigValuesService.checkExistingCommunConfigValue(new_config_value_name ,communConfigValues , res);
        if(caseError==1)
        {
            return res.status(400).json({ error: 'config value already exists' });
        }

        //update the config value to local file
        caseError = communConfigValuesService.deleteCommunConfigValueFile(stage, communConfigValues, new_config_value_name, res);
        if(caseError==1)
        {
        res.status(500).json({ error: 'Internal Server Error:  config value not deleted in file commun file' });
        }


        for(microservice in microservices)
        {
                //get config values
                configValues = configValuesService.readConfigFile(microservices[microservice], stage, res);
                if(configValues==1)
                {
                    return res.status(404).json({ error: `The required file config_values.${microservices[microservice]}.${stage} not found` });
                }

                if(configValues[new_config_value_name])
                {
                    configValuesService.deleteConfigValueFile(microservices[microservice], stage,configValues, new_config_value_name,res);
                    redisPubSubService.deleteConfigValueRedis(microservices[microservice], stage, new_config_value_name, res);
                }
        }


        //notify subscribed microservices
        redisPubSubService.sendNotificationPubSubCommon(stage);

        //create archive file or add configs to existing config file if exists
        communConfigValuesService.create_archive_file_common(stage);



        res.status(200).json({ message: 'Configuration value deleted successfully' });


    }


}


module.exports = communConfigValuesController;