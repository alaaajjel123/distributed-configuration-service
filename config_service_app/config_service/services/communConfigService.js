// services/configService.js
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const redis = require('redis');

//const stages = ['developing', 'release', 'production']
let stages=[]
const filePath = `./services.map.json`;
const microservices_stages_parsed = fs.readFileSync(filePath);
const microservices_stages = JSON.parse(microservices_stages_parsed);
for(elt in microservices_stages['segmentation'])
{
    stages.push(microservices_stages['segmentation'][elt])
}



const communConfigValuesService = {

    testParameter: (stage, res) =>{
      if (!stage || !stages.includes(stage)) {
        return 1;
      }
      else
        return 0;
      },

    checkCommunFileExists: (stage) => {
        const filePath = `./data/config_values.commun.${stage}.json`;
        try {
          fs.accessSync(filePath, fs.constants.F_OK);
        } catch (err) {
          return 1;
        }
        return 0; 
      },

      readCommunConfigFile: (stage) => {
        const filePath = `./data/config_values.commun.${stage}.json`;
        try {
          const configData = fs.readFileSync(filePath);
          const configValues = JSON.parse(configData);
          return configValues;
        } catch (error) {
          return 1;
        }
        return 0;
      },

      testBodyParams: (new_config_value_name, new_config_value_value) => {
        if (!new_config_value_name || !new_config_value_value) {
          return 1;
        }
        else
          return 0;
      },
  
      checkNonExistingCommunConfigValue: (new_config_value_name , communConfigValues , res) => {
        if(new_config_value_name in communConfigValues)
        {
            return 1;
        }
        else
        {
          return 0;
        }
            

      },

      checkExistingCommunConfigValue: (new_config_value_name, communConfigValues, res) => {
        if(!(new_config_value_name in communConfigValues))
        {
            return 1;
        }
        else
            return 0;

      },

      addConfigValueCommunFile: ( stage, new_config_value_name, new_config_value_value, communConfigValues) => {
        const filePath = `./data/config_values.commun.${stage}.json`;
        let old_config_values=_.cloneDeep(communConfigValues);
        let parsed_config_value_value=JSON.parse(new_config_value_value);
        communConfigValues[new_config_value_name]=parsed_config_value_value;
        //communConfigValues[new_config_value_name]=new_config_value_value;
        //console.log(configValues);
        let jsonString = JSON.stringify(communConfigValues);
        if(communConfigValues!=old_config_values)
        {
          
          try { 
            old_config_values=communConfigValues;
            fs.writeFileSync(filePath, jsonString);
            //var_commit=1;
          } catch (error) {
            return 1
          }
          return 0;
        }
  
      },

      addConfigValueMicroserviceFile: (microservice, stage, new_config_value_name, new_config_value_value, configValues, res) => {
        const filePath = `./data/config_values.${microservice}.${stage}.json`;
        let old_config_values=_.cloneDeep(configValues);
        let parsed_config_value_value=JSON.parse(new_config_value_value);
        //console.log(parsed_config_value_value);
        configValues[new_config_value_name]=parsed_config_value_value;
        //console.log(configValues);
        let jsonString = JSON.stringify(configValues);
        if(configValues!=old_config_values)
        {
          
          try { 
            old_config_values=configValues;
            fs.writeFileSync(filePath, jsonString);
            var_commit=1;
          } catch (error) {
            return 1
          }
          return 0;
        }
  
      },

    updateCommunConfigValueFile: (stage, configValues, new_config_value_name, new_config_value_value, res) => {
      const filePath = `./data/config_values.commun.${stage}.json`;
      let old_config_values=_.cloneDeep(configValues);
      configValues[new_config_value_name]=JSON.parse(new_config_value_value);
      //configValues[new_config_value_name]=new_config_value_value;
      let jsonString = JSON.stringify(configValues);
      if(configValues!=old_config_values)
      {
        
        try {
          old_config_values=configValues;
          fs.writeFileSync(filePath, jsonString);
          //var_commit=1;
        } catch (error) {
          return 1;
        }
        return 0;
      }
    },


    deleteCommunConfigValueFile: (stage, configValues, new_config_value_name, res) => {

      const filePath = `./data/config_values.commun.${stage}.json`;
      let old_config_values=_.cloneDeep(configValues);
      delete configValues[new_config_value_name];
      //console.log(configValues);
      let jsonString = JSON.stringify(configValues);
      if(configValues!=old_config_values)
      {
    
        try {
          old_config_values=configValues;
          fs.writeFileSync(filePath, jsonString);
        } catch (error) {
          return 1;
        }
        return 0;
      }
  },

  create_archive_file_common: (stage) => {

    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    let month = (currentDate.getMonth() + 1).toString();// Adding 1 because getMonth() returns zero-based index
    if(month.length===1)
    {
      month="0"+month;
    } 
    let day = currentDate.getDate().toString();
    if(day.length===1)
    {
      day="0"+day;
    }
    let hour = currentDate.getHours().toString();
    if(hour.length===1)
    {
      hour="0"+hour;
    }
    let minute = currentDate.getMinutes().toString();
    if(minute.length===1)
    {
      minute="0"+minute;
    }
    let seconde = currentDate.getSeconds().toString();
    if(minute.length===1)
    {
      seconde="0"+seconde;
    }

    //let time_now = year+"_"+month+"_"+day+"__"+hour+":"+minutes+":"+secondes;
    let filename = "config_values."+day+'_'+month+'_'+year+".json";

    const directory = './archives';

    const filePath = path.join(directory, filename);

    //if file does not exist create one
    if (!(fs.existsSync(filePath))) 
    {
      let elt = {};
      fs.writeFileSync(filePath, JSON.stringify(elt));
    }

    //fill the archive file
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return 1;
      } else { 
        //part to read the config file after changes
        let configData1;
        let configValues1;
        let keyName;
        //let jsonString1;
        try{
            configData1 = fs.readFileSync(`./data/config_values.commun.${stage}.json`);
            configValues1 = JSON.parse(configData1);
            keyName = `config_values.common.${stage}.${hour}:${minute}:${seconde}`;
            //jsonString1 = JSON.stringify(configValues1);
        }
        catch(error)
        {     
            return 1;
        }

        //read the archive file content 
        let configData;
        let configValues;

        try {
          configData = fs.readFileSync(filePath);
          configValues = JSON.parse(configData);
        } catch (error) {
          return 1;
        }

        //update the archive file 
        let old_config_values=_.cloneDeep(configValues);
        configValues[keyName]=configValues1;
        //console.log(configValues);
        let jsonString = JSON.stringify(configValues);
        if(configValues!=old_config_values)
        {
          
          try { 
            old_config_values=configValues;
            fs.writeFileSync(filePath, jsonString);
            var_commit=1;
          } catch (error) {
            return 1
          }
          return 0;
        }
        return 0;
      }});



  },

}

module.exports = communConfigValuesService;