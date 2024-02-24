const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const archiveConfigValuesService = {
    testParameters: (day, month, year, res) =>{
        if (!day || !month || !year ) {
          return 1;
        }
        else
          return 0;
      },
    checkFileExists: (day, month, year, res) => {
        const filePath = `./archives/config_values.${day}_${month}_${year}.json`;
        try {
          fs.accessSync(filePath, fs.constants.F_OK);
        } catch (err) {
          return 1;
        }
        return 0; 
      }, 
    readConfigFile: (day, month, year, res) => {
        const filePath = `./archives/config_values.${day}_${month}_${year}.json`;
        try {
          const configData = fs.readFileSync(filePath);
          const configValues = JSON.parse(configData);
          return configValues;
        } catch (error) {
          /*return 1;*/
          configValues={};
          return configValues;
        }
        configValues={};
        return configValues;
        return 0;
      },
}

module.exports = archiveConfigValuesService;