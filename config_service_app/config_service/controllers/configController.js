const fs = require('fs');
// controllers/configController.js
const configValuesService = require('../services/configService');
const redisPubSubService = require('../services/redisPubSubService');
const app = require('../index');

/*
const stages=['production','developing','release'];
const microservices=['segmentation','transcription'/*,'qualityGates', 'Google translation detector', 'File Format Conversion', 'Storage'];*/

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

const configValuesController = {
  getConfigValues: async (req, res) => {
    //const { microservice, stage } = req.params;
    const microservice = req.params.microservice;
    const stage = req.query.stage;

    //test if the microservice parameter is null or does not exist
    caseError= configValuesService.testReqParams(microservice, microservices,stage,stages, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'Microservice and stage are required parameters' });
    }

    //check if the intended file exists
    caseError= configValuesService.checkFileExists(microservice, stage, res);
    if(caseError==1)
    {
        return res.status(404).json({ error: 'The required file not found' });
    }

    //get config values
    configValues = configValuesService.readConfigFile(microservice, stage, res);
    if(configValues==1)
    {
        return res.status(404).json({ error: 'The required file not found' });
    }

    //retrun config values
    return res.status(200).json(configValues); 

  },

  addConfigValue: async (req, res) => {
    const microservice = req.params.microservice;
    const stage = req.query.stage;
    const new_config_value = req.body;
    const new_config_value_name = new_config_value['config_value_name'];
    const new_config_value_value = new_config_value['config_value_value'];
    let caseError;
    let configValues;

    //test if the microservice parameter is null or does not exist
    caseError= configValuesService.testReqParams(microservice, microservices,stage, stages, res);
    if(caseError==1) 
    {
        return res.status(400).json({ error: 'Microservice and stage are required parameters' });
    }

    //test if the body params exist
    caseError= configValuesService.testBodyParams(new_config_value_name, new_config_value_value, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'Body parameters are required parameters' });
    }

    //check if the intended file exists
    caseError= configValuesService.checkFileExists(microservice, stage, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'Non existing file' });
    }

    //get config values
    configValues = configValuesService.readConfigFile(microservice, stage, res);
    if(configValues==1)
    {
        return res.status(404).json({ error: 'The required file not found' });
    }
    
    //check if the new config value does not exist
    caseError= configValuesService.checkNonExistingConfigValue(new_config_value_name ,configValues , res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'config value already exists' });
    }

    //add the new config value to local file
    caseError= configValuesService.addConfigValueFile(microservice, stage, new_config_value_name, new_config_value_value, configValues, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'config value not added to file' });
    }

    //add the new config value to redis cache
    caseError= redisPubSubService.addConfigValueRedis(microservice, stage, new_config_value_name, new_config_value_value, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'config value not added to rdis' });
    }

    redisPubSubService.sendNotificationPubSub(microservice,stage);


    //change the content of the specific file commit_type
    //change_commit_type_file(1);

    //archive the file with the new commited data
    configValuesService.create_archive_file_microservice(microservice,stage);

    //execute to commit changes to git repo
    //deploy_to_github(1);

    res.status(200).json({ message: 'Configuration value added successfully' });

    },



  updateConfigValue: async (req, res) => {
    const microservice = req.params.microservice;
    const stage = req.query.stage;
    const new_config_value = req.body;
    const new_config_value_name = new_config_value['config_value_name'];
    const new_config_value_value = new_config_value['config_value_value'];
    let caseError;
    let configValues;

    //test if the microservice parameter is null or does not exist
    caseError= configValuesService.testReqParams(microservice, microservices,stage, stages, res);
    if(caseError==1) 
    {
        return res.status(400).json({ error: 'Microservice and stage are required parameters' });
    }

    //test if the body params exist
    caseError= configValuesService.testBodyParams(new_config_value_name, new_config_value_value, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'Body parameters are required parameters' });
    }
  
    //check if the intended file exists
    caseError= configValuesService.checkFileExists(microservice, stage, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'Non existing file' });
    }

    //get config values
    configValues = configValuesService.readConfigFile(microservice, stage, res);
    if(configValues==1)
    {
        return res.status(404).json({ error: 'The required file not found' });
    }


    //check if the new config value does exist
    caseError = configValuesService.checkExistingConfigValue(new_config_value_name, configValues, res);
    if(caseError==1)
    {
        return res.status(400).json({error: 'Non existing configuration value'});
    }

    //update the config value to local file
    caseError = configValuesService.updateConfigValueFile(microservice, stage,configValues, new_config_value_name, new_config_value_value, res);
    if(caseError==1)
    {
        res.status(500).json({ error: 'Internal Server Error:  config value not updated in files' });
    }

    //update the config value to redis cache
    caseError = redisPubSubService.updateConfigValueRedis(microservice, stage, new_config_value_name, new_config_value_value, res);
    if(caseError==1)
    {
        res.status(500).json({ error: 'Internal Server Error: cannot update to redis cache' });
    }

    redisPubSubService.sendNotificationPubSub(microservice,stage);

    //archive the file with the new commited data
    //configValuesService.create_archive_file(microservice,stage);
    configValuesService.create_archive_file_microservice(microservice, stage);

    //execute to commit changes to git repo
    //deploy_to_github(1);

    res.status(200).json({ message: 'Configuration value added successfully' });
  },

  deleteConfigValue: async (req, res) => {
    const microservice = req.params.microservice;
    const stage = req.query.stage;
    const new_config_value = req.body;
    const new_config_value_name = new_config_value['config_value_name'];

    //test if the microservice parameter is null or does not exist
    caseError= configValuesService.testReqParams(microservice, microservices,stage, stages, res);
    if(caseError==1) 
    {
        return res.status(400).json({ error: 'Microservice and stage are required parameters' });
    }

    //test if the body params exist
    caseError= configValuesService.testBodyParam(new_config_value_name, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'Body parameters are required parameters' });
    }
  
    //check if the intended file exists
    caseError= configValuesService.checkFileExists(microservice, stage, res);
    if(caseError==1)
    {
        return res.status(400).json({ error: 'Non existing file' });
    }

    //get config values
    configValues = configValuesService.readConfigFile(microservice, stage, res);
    if(configValues==1)
    {
        return res.status(404).json({ error: 'The required file not found' });
    }

    //check if the config value does exist
    caseError= configValuesService.checkExistingConfigValue(new_config_value_name, configValues, res);
    if(caseError==1)
    {
        return res.status(400).json({error: 'Non existing configuration value'});
    }

    //delete the config value from local file
    caseError = configValuesService.deleteConfigValueFile(microservice, stage,configValues, new_config_value_name, res);
    if(caseError==1)
    {
        res.status(500).json({ error: 'Internal Server Error:  config value not updated in files' });
    } 

    //delete the config value from redis
    caseError = redisPubSubService.deleteConfigValueRedis(microservice, stage, new_config_value_name, res);
    if(caseError==1)
    {
        res.status(500).json({ error: 'Internal Server Error:  config value not deleted from the redis' });
    }

    redisPubSubService.sendNotificationPubSub(microservice,stage);

    //archive the file with the new commited data
    configValuesService.create_archive_file_microservice(microservice, stage);

    //execute to commit changes to git repo
    //deploy_to_github(1);


    //change the content of the specific file commit_type
    //change_commit_type_file(1);

    res.status(200).json({ message: 'Configuration value deleted successfully'});
  },
};

module.exports = configValuesController;