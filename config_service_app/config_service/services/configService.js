// services/configService.js
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const redis = require('redis');
const NRP = require("node-redis-pubsub");

const configValuesService = {
    testParameter: (microservice, microservices,stage,stages, res) =>{
      if (!microservice || !microservices.includes(microservice) || !stage || !stages.includes(stage)) {
        return 1;
      }
      else
        return 0;
    },
    testReqParams: (microservice, microservices) => {
      if (!microservice || !microservices.includes(microservice)) {
        return 1;
      }
      else
        return 0;
    },

    testBodyParams: (new_config_value_name, new_config_value_value) => {
        if (!new_config_value_name || !new_config_value_value) {
          return 1;
        }
        else
          return 0;
      },

      testBodyParam(new_config_value_name)
      {
        if (!new_config_value_name) {
          return 1;
        }
        else
          return 0;
      },

    checkFileExists: (microservice, stage, res) => {
      const filePath = `./data/config_values.${microservice}.${stage}.json`;
      try {
        fs.accessSync(filePath, fs.constants.F_OK);
      } catch (err) {
        return 1;
      }
      return 0; 
    },
   
    readConfigFile: (microservice, stage, res) => {
      const filePath = `./data/config_values.${microservice}.${stage}.json`;
      try {
        const configData = fs.readFileSync(filePath);
        const configValues = JSON.parse(configData);
        return configValues;
      } catch (error) {
        return 1;
      }
      return 0;
    },

    checkNonExistingConfigValue: (new_config_value_name ,configValues , res) => {
        if(new_config_value_name in configValues)
        {
            return 1;
        }
        else
            return 0;

    },

    checkExistingConfigValue: (new_config_value_name, configValues, res) => {
        if(!(new_config_value_name in configValues))
        {
            return 1;
        }
        else
            return 0;

    },

    addConfigValueFile: (microservice, stage, new_config_value_name, new_config_value_value, configValues, res) => {
      const filePath = `./data/config_values.${microservice}.${stage}.json`;
      let old_config_values=_.cloneDeep(configValues);
      let parsed_config_value_value=JSON.parse(new_config_value_value);
      console.log(parsed_config_value_value);
      configValues[new_config_value_name]=parsed_config_value_value;
      console.log(configValues);
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

    updateConfigValueFile: (microservice, stage,configValues, new_config_value_name, new_config_value_value, res) => {
        const filePath = `./data/config_values.${microservice}.${stage}.json`;
        let old_config_values=_.cloneDeep(configValues);
        configValues[new_config_value_name]=JSON.parse(new_config_value_value);
        let jsonString = JSON.stringify(configValues);
        if(configValues!=old_config_values)
        {
          
          try {
            old_config_values=configValues;
            fs.writeFileSync(filePath, jsonString);
            var_commit=1;
          } catch (error) {
            return 1;
          }
          return 0;
        }
    },

    deleteConfigValueFile: (microservice, stage,configValues, new_config_value_name, res) => {

        const filePath = `./data/config_values.${microservice}.${stage}.json`;
        let old_config_values=_.cloneDeep(configValues);
        delete configValues[new_config_value_name];
        console.log(configValues);
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


    /*
    create_archive_file: (microservice, stage) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString(); // Adding 1 because getMonth() returns zero-based index
        const day = currentDate.getDate().toString();
        const hour = currentDate.getHours().toString();
        const minutes = currentDate.getMinutes().toString();
        const secondes = currentDate.getSeconds().toString();
        //let time_now = year+"_"+month+"_"+day+"__"+hour+":"+minutes+":"+secondes;
        let time_now = hour+';'+minutes+'__'+day+'_'+month+'_'+year+".json";
        console.log(time_now)
        
        //let arch_file_name1="config_values_developing_"
        let arch_file_name1=`config_values.${microservice}.${stage}_`
        let arch_file_name=(arch_file_name1+time_now).toString();
        //console.log(arch_file_name)
        
        const directory = './archives';
        console.log(arch_file_name)
        let filename = arch_file_name
        const filePath = path.join(directory, filename);
        
        if (fs.existsSync(filePath)) {
            return 1;
          } else {
            fs.writeFileSync(filePath, '');
            //console.log('File does not exist!');
        }
      
        //fill the archive file
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return 1;
            console.error('Error reading file:', err);
          } else {
            const fileSize = stats.size;
            if (fileSize === 0) {
              let configData;
              let configValues;
              try{
                  configData = fs.readFileSync(`./data/config_values.${microservice}.${stage}.json`);
                  //configData = fs.readFileSync(`./config_values_developing.json`);
                  configValues = JSON.parse(configData);
              }
              catch(error)
              {     
                  return 1;
                  //return res.status(500).send('Internal server error.');
              }
              let jsonString = JSON.stringify(configValues);
              fs.writeFile(filePath, jsonString, (err) => {
                if (err) {
                    return 1;
                    console.error('Error writing file:', err);
                } else {
                    console.log('File created and data written successfully!');
                }
              });
            } else {
              console.log('File is not empty!');
            }
            return 0;
          }
        });


    },*/

    deploy_to_github: (number) => {

    },

    create_archive_file_microservice: (microservice, stage) => {

      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      let month = (currentDate.getMonth() + 1).toString(); // Adding 1 because getMonth() returns zero-based index
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
        fs.writeFileSync(filePath, JSON.stringify( elt));
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

          try{
              configData1 = fs.readFileSync(`./data/config_values.${microservice}.${stage}.json`);
              configValues1 = JSON.parse(configData1);
              keyName = `config_values.${microservice}.${stage}.${hour}:${minute}:${seconde}`;
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


  };


  module.exports = configValuesService;