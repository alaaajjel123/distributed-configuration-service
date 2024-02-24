const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const redis = require('redis');
const NRP = require("node-redis-pubsub");
const { RedisClient } = require('redis');

const publisher = redis.createClient(
  
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
      }*/
  
});


try{ 
    //connect to the redis client 
    publisher.connect().then(()=>{
        console.log("client connected");
    })}
    catch(error)
    {
    console.error(error)
}

const redisPubSubService = {

    addConfigValueRedis: async (microservice, stage, new_config_value_name, new_config_value_value, res) => {

        try{
          let config_value_redis_name=`config_values.${microservice}.${stage}.${new_config_value_name}`;
          //let config_value_redis_value=JSON.stringify(new_config_value_value);
          let config_value_redis_value=new_config_value_value;
  
          //add the new config value to redis cache
          await publisher.set(config_value_redis_name,config_value_redis_value);
  
        }catch(error)
        {
          return 1;
        }
        return 0;
  
      },


      updateConfigValueRedis: async (microservice, stage, new_config_value_name, new_config_value_value, res) => {
        try{
            let config_value_redis_name=`config_values.${microservice}.${stage}.${new_config_value_name}`;
            //let config_value_redis_value=JSON.stringify(new_config_value_value);
            let config_value_redis_value=new_config_value_value;

            //add the new config value to redis cache
            await publisher.set(config_value_redis_name,config_value_redis_value);
            //h_elt = await client.get(config_value_redis_name)

        }catch(error)
        {
           return 1;
        }
        return 0;

    },


    deleteConfigValueRedis: async (microservice, stage, new_config_value_name, res) => {

        try{
          let config_value_redis_name=`config_values.${microservice}.${stage}.${new_config_value_name}`;
  
          //delete the new config value to redis cache
          await publisher.del(config_value_redis_name);
  
        }catch(error)
        {
            return 1;
        }
        return 0;
  
      },


      sendNotificationPubSub:async (microservice,stage) => {

  
          const notify_msg = "changes are made you have to reapply configs 🔄🔄🔄🔄🔄🔄🔄";
  
          //sending notification of updates using the redis pub/sub

          let channel = `${microservice}.${stage}_channel`
          await publisher.publish(channel, notify_msg); 
  
          /*
          if(microservice === 'segmentation')
          {
            await publisher.publish('segmentation_channel', notify_msg); 
          }
          else if(microservice === 'transcription')
          {
            await publisher.publish('transcription_channel', notify_msg); 
          }*/
          
      },


      sendNotificationPubSubCommon:async (stage) => {
   
        const notify_msg = "changes are made you have to reapply configs 🔄🔄🔄🔄🔄🔄🔄";
        let channel = `${stage}_common_channel`;
        await publisher.publish(channel, notify_msg);

    },

}



module.exports = redisPubSubService;

