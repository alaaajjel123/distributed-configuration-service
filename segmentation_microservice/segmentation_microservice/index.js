/** */
const express = require("express");
const app = express();
const fs = require('fs');
const redis = require("redis")
const axios = require('axios');
const PORT = 5555;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
microservice="segmentation";
stage="production";*/
const filePath = `./service.map.json`;
const microservices_stages_parsed = fs.readFileSync(filePath);
const microservices_stages = JSON.parse(microservices_stages_parsed);
//console.log(microservices_stages)
let microservice =microservices_stages["microservice"]
let stage=microservices_stages["stage"]

//create and connect the client
const subscriber = redis.createClient(  
  {  
    
    username: 'config_service_admin', // use your Redis user. More info https://redis.io/docs/management/security/acl/
    password: 'config_service_123', // use your password here
    socket:{
      host: 'redis',
      tls: false,
      port: 6379,
    }
    /*
    socket: {
    host: 'localhost',
    port: 6379,
    } */
}
);

try{
  //connect to the redis client
  subscriber.connect().then(()=>{
      console.log("client connected");
})}
catch(error)
{
  console.error(error)
}

// Endpoint to get the config values from the configuration service or Redis
app.get('/get_config_values', async (req, res) => {
    const microservice = 'segmentation';
    const stage = 'production'; // Hardcoded for this example, but you can change it as needed
    let filePath = `./config_values.${microservice}.json`;
    let desiredConfigValues={};
    let configData;
    let configValues;
    let jsonString;

    try{
        configData = fs.readFileSync(`./config_values.${microservice}.json`);
        configValues = JSON.parse(configData);
    }
    catch(error)
    {
      return res.status(500).send('Internal server error:To the microservice itself');
    }



    try {
      // Try to get the config values from the configuration service
      const configServiceUrl = `http://localhost:2023/config/${microservice}/?stage=${stage}`;
      console.log(response);
      desiredConfigValues = response.data;
      jsonString = JSON.stringify(desiredConfigValues);

      //write the content of the coming config values to the config files 
      if(desiredConfigValues!=configValues)
      {
        fs.writeFileSync(filePath, jsonString);
        console.log("config values from the request")
      }

      //console.log("config values from config service");
      res.status(200).json(desiredConfigValues);
    } catch (error) {

        try{
            let config_value_redis_name=`config_values.${microservice}.${stage}.*`;
            let value;
            let redisKey;
            let parts;
            let lastPart;


            let keys = await redisClient.keys(config_value_redis_name);
            for(key in keys)
            {
                value= await redisClient.get(keys[key]);
                redisKey = keys[key];
                parts = redisKey.split('.');
                lastPart = parts.pop();
                desiredConfigValues[lastPart]=JSON.parse(value);
            }
            jsonString = JSON.stringify(desiredConfigValues);
            //write the content of the coming config values to the config files 
            if(desiredConfigValues!=configValues)
            {
                fs.writeFileSync(filePath, jsonString);
                console.log("config values from the redis")
            }
            

        }catch(error)
        {
            return res.status(404).json({ error: 'cannot fetch from the redis'});
        }


    }
  });





 

//function for getting config values
const getConfigValues = async (microservice, stage) => {

    let filePath = `./config_values.${microservice}.json`;
    let desiredConfigValues = {};
    let configData;
    let configValues;
    let jsonString;
  
    try {
      configData = fs.readFileSync(filePath);
      configValues = JSON.parse(configData);
    } catch (error) {
      return { error: 'Internal server error: To the microservice itself' };
    }
  
    //choose the appropirate one if running on local choose "localhost" else choose "config_service"
    let localhost='config_service';
    //let localhost='localhost';
    try {
      // Try to get the config values from the configuration service
      const configServiceUrl = `http://${localhost}:2023/config/${microservice}/?stage=${stage}`;
      const response = await axios.get(configServiceUrl);
      desiredConfigValues = response.data;
      jsonString = JSON.stringify(desiredConfigValues); 
  
      // Write the content of the coming config values to the config files
      if (JSON.stringify(desiredConfigValues) !== JSON.stringify(configValues)) {
        fs.writeFileSync(filePath, jsonString);
        console.log('config values from the server');
      }
  
      return { status: 200, data: desiredConfigValues };
    } catch (error) {

      //try get configs from the redis
      try {
  
        let config_value_redis_name = `config_values.${microservice}.${stage}.*`;
        let value;
        let redisKey;
        let parts;
        let lastPart;
  
        let keys = await redisClient.keys(config_value_redis_name);
        for (let key of keys) {
          value = await redisClient.get(key);
          redisKey = key;
          parts = redisKey.split('.');
          lastPart = parts.pop();
          desiredConfigValues[lastPart] = JSON.parse(value);
        }
  
        jsonString = JSON.stringify(desiredConfigValues);
  
        // Write the content of the coming config values to the config files
        if (JSON.stringify(desiredConfigValues) !== JSON.stringify(configValues)) {
          fs.writeFileSync(filePath, jsonString);
          console.log('config values from the redis');
        }
  
        return { status: 200, data: desiredConfigValues };
      } catch (error) {
        return { status: 404, error: 'cannot fetch from the redis' };
      }
    }


};
 
(async () => {

  //const subscriber = client.duplicate();
  let channel = `${microservice}.${stage}_channel`
  await subscriber.subscribe(channel, async (message) => {
    console.log(message); // 'message'
    await getConfigValues(microservice, stage);
    console.log("configs updated successfully");
  });

})(); 

(async () => {

  //const subscriber = client.duplicate();
  let channel = `${stage}_common_channel`;
  await subscriber.subscribe(channel, async (message) => {
    console.log(message); // 'message'
    await getConfigValues(microservice, stage);
    console.log("configs updated successfully");
  });

})(); 


app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});

