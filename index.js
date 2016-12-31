'use strict';
var mqtt=require('mqtt');
var mqtt_client;
//Events
var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(0)
//Where topics are stored
var topicList=[];

class resmetry{
  constructor(host,settings,callback){
    this.host=host;
    this.settings=settings;
  }
  connect(callback){
    mqtt_client= mqtt.connect(this.host,this.settings);
    mqtt_client.on('message',function(topic,message){
      var index=topicList.indexOf(topic);
      if(index!=-1)
      {
        eventEmitter.emit(topic,message.toString());
        mqtt_client.unsubscribe(topic);
        topicList.splice(index, 1);
      }
    });
  }
  getMQTTClient(){
    return mqtt_client;
  }
  getTopicList(){
    return topicList;
  }
  request(topic,data,options,responseTopic,callback){
    mqtt_client.publish(topic,data,options,function(err){
      if(err)
        callback('null');
      else{
        mqtt_client.subscribe(responseTopic);
        topicList.push(responseTopic);
        eventEmitter.once(responseTopic, function(response){
          callback('null',response);
        });
      }
    });
  }
}
module.exports=resmetry;
