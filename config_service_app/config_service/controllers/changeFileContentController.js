const fs = require('fs');
const path = require('path');
//const changeFileContentService = require('../services/changeFileContentService');
const redisPubSubService = require('../services/redisPubSubService');
const configValuesService=require('../services/configService');
const communConfigValuesService = require('../services/communConfigService');
const app = require('../index');
const { json } = require('body-parser');

//getting microservices and stages from the services.map
const filePath = `./services.map.json`;
const microservices_stages_parsed = fs.readFileSync(filePath);
const microservices_stages = JSON.parse(microservices_stages_parsed);

//getting stages for the commun configs
const commun_stages=[];
for(elt1 in microservices_stages)
{
    for(elt2 in microservices_stages[elt1])
    {
        if(!(commun_stages.includes(microservices_stages[elt1][elt2])))
        commun_stages.push(microservices_stages[elt1][elt2])
    }
}

//if one file corresponding to a microservice and a stage appearing in the file services.map.json is not found then create one
let filename
let data_directory
let data_filepath
for(elt1 in microservices_stages)
{
    for(elt2 in microservices_stages[elt1])
    {
        filename = "config_values."+elt1+'.'+microservices_stages[elt1][elt2]+".json";
        data_directory = './data';
        data_filepath = path.join(data_directory, filename);

        //if file does not exist create one
        if (!(fs.existsSync(data_filepath)))                
        {
            let elt = {};
            fs.writeFileSync(data_filepath, JSON.stringify( elt));
        }
    }
}

//if one file corresponding to a commun stage appearing in the file services.map.json is not found then create one
for(elt1 in commun_stages)
{
    filename = "config_values.commun."+commun_stages[elt1]+".json";
    data_directory = './data';
    data_filepath = path.join(data_directory, filename);

    //if file does not exist create one
    if (!(fs.existsSync(data_filepath)))                
    {
        let elt = {};
        fs.writeFileSync(data_filepath, JSON.stringify( elt));
    }
}


/*
//create file if does not exist 
let conf_values_filename
let directory
let conf_values_filePath
for(elt1 in microservices_stages)
{
    for(elt2 in microservices_stages[elt1])
    {
        //config_values file name
        conf_values_filename = `config_values.${elt1}.${microservices_stages[elt1][elt2]}.json`;
        directory = './data';
        conf_values_filePath = path.join(directory, conf_values_filename);

        //if the config value file does not exist create one
        if (!(fs.existsSync(conf_values_filePath)))                
        {
            let elt = {};
            fs.writeFileSync(conf_values_filePath, JSON.stringify( elt));
        }
    }
}
*/

let fileContentPath;
let elementPrevContent;

//storing the old microservice and stage content into an object
let prevContent={};
for(elt1 in microservices_stages)
{
    for(elt2 in microservices_stages[elt1])
    {
        //getting the path of the file and adding the old content to the object
        //console.log(elt1,microservices_stages[elt1][elt2])
        fileContentPath = path.join(__dirname,`../data/config_values.${elt1}.${microservices_stages[elt1][elt2]}.json`);
        elementPrevContent = `oldContent.${elt1}.${microservices_stages[elt1][elt2]}`;
        prevContent[elementPrevContent]=JSON.stringify(fs.readFileSync(fileContentPath));
    }
}

//storing the old commun file content into the object
for(elt1 in commun_stages)
{
    fileContentPath = path.join(__dirname,`../data/config_values.commun.${commun_stages[elt1]}.json`);
    elementPrevContent = `oldContent.commun.${commun_stages[elt1]}`;
    prevContent[elementPrevContent]=JSON.stringify(fs.readFileSync(fileContentPath));
}


//reading the current content and comparing it with the old one
let currContent={};
function checkAndExecute() {

    //reading the current content of the file in the microservice and the stages and comparing it with the previous
    for(elt1 in microservices_stages)
    {
        for(elt2 in microservices_stages[elt1])
        {
            fileContentPath = path.join(__dirname,`../data/config_values.${elt1}.${microservices_stages[elt1][elt2]}.json`);
            currContent = fs.readFileSync(fileContentPath);
            elementPrevContent = `oldContent.${elt1}.${microservices_stages[elt1][elt2]}`;
            
            let fileContentPath_to_update;
            //if the content has changed
            if(JSON.stringify(currContent)!== prevContent[elementPrevContent])
            {
                //update the previous content
                console.log(`${elt1}.${microservices_stages[elt1][elt2]} File content changed`);
                prevContent[elementPrevContent]=JSON.stringify(currContent);

                //get the content of the new file
                fileContentPath_to_update = path.join(__dirname,`../data/config_values.${elt1}.${microservices_stages[elt1][elt2]}.json`);
                obj_updated = JSON.parse(fs.readFileSync(fileContentPath_to_update));

                //delete old values of the redis cache content
                (async () => {
                    //console.log("hello")
                    let config_value_redis_name = `config_values.${elt1}.${microservices_stages[elt1][elt2]}.*`;
                    //console.log(config_value_redis_name)
                    let keys = await publisher.keys(config_value_redis_name);
                    //console.log(keys)
                    for (let key of keys) {
                        redisPubSubService.deleteConfigValueRedis(elt1,microservices_stages[elt1][elt2],key)
                    }
                });

                //update in redis cache
                for(elt in obj_updated)
                {
                    //console.log(elt)
                    //console.log(obj_updated[elt])
                    redisPubSubService.updateConfigValueRedis(elt1,microservices_stages[elt1][elt2],elt,JSON.stringify(obj_updated[elt]))
                }

                //archive the file
                configValuesService.create_archive_file_microservice(elt1,microservices_stages[elt1][elt2])

                //notify the specific channel
                redisPubSubService.sendNotificationPubSub(elt1,microservices_stages[elt1][elt2])

            }
        }
    }

    let fileContentPath_to_update
    let fileContentPath_4
    for(elt3 in commun_stages)
    {
        fileContentPath = path.join(__dirname,`../data/config_values.commun.${commun_stages[elt3]}.json`);
        currContent = fs.readFileSync(fileContentPath);
        elementPrevContent = `oldContent.commun.${commun_stages[elt3]}`;

        if(JSON.stringify(currContent)!== prevContent[elementPrevContent])
        {
            //update the prevContent element
            console.log(`commun.${commun_stages[elt3]} File content changed`);
            //console.log(JSON.stringify(currContent))
            //console.log(Buffer.from(JSON.stringify(currContent)))
            prevContent[elementPrevContent]=JSON.stringify(currContent);

            //get the content of the new file
            fileContentPath_to_update_commun = path.join(__dirname,`../data/config_values.commun.${commun_stages[elt3]}.json`);
            obj_updated_commun = JSON.parse(fs.readFileSync(fileContentPath_to_update_commun));
            //test1
            //console.log(obj_updated_commun)

            for(elt2 in microservices_stages)
            {
                //test2
                //console.log(microservices_stages[elt2].includes(commun_stages[elt3]))

                if(microservices_stages[elt2].includes(commun_stages[elt3]))
                {
                    //get the content of the new file
                    fileContentPath_to_update = path.join(__dirname,`../data/config_values.${elt2}.${commun_stages[elt3]}.json`);
                    obj_updated = JSON.parse(fs.readFileSync(fileContentPath_to_update));
                    //test3
                    //console.log(obj_updated)
                    for(elt1 in obj_updated_commun)
                    {
                        if(elt1 in obj_updated)
                        {
                            if(obj_updated[elt1] !== obj_updated_commun[elt1])
                            {
                                //update the config value
                                obj_updated[elt1]=obj_updated_commun[elt1]

                                //update the redis 
                                redisPubSubService.updateConfigValueRedis(elt2,commun_stages[elt3],elt1,JSON.stringify(obj_updated_commun[elt1]))

                            }
                        }
                    }

                    //update the file and the prev content in order the microservice will not notify via pub/sub
                    fileContentPath_4 = path.join(__dirname,`../data/config_values.${elt2}.${commun_stages[elt3]}.json`);
                    fs.writeFileSync(fileContentPath_4, JSON.stringify( obj_updated ));
                    elementPrevContent_4 = `oldContent.${elt2}.${commun_stages[elt3]}`;
                    prevContent[elementPrevContent_4]=JSON.stringify(fs.readFileSync(fileContentPath_4));
     
                }
            }
            
            //archive the file 
            communConfigValuesService.create_archive_file_common(commun_stages[elt3]);

            //notify the commun channel
            redisPubSubService.sendNotificationPubSubCommon(commun_stages[elt3])

        }


    }
}


//checkAndExecute()
setInterval(checkAndExecute, 3000);


//const changeContentFileController = {}

//module.exports = changeContentFileController;

