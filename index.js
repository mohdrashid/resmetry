'use strict';
var mqtt=require('mqtt');
var mqtt_client;
//Events
var EventEmitter = require('events');
//Where topics are stored
var topicList=[];

class resmetry extends EventEmitter{
  constructor(){
    super();
    this.setMaxListeners(0)
  }

  connect(host,settings){
    var currClass=this;
    mqtt_client= mqtt.connect(host,settings);
    mqtt_client.on('connect',function(){
      currClass.emit('connect','Connected');
    });
    mqtt_client.on('message',function(topic,message){
      currClass.emit('message',topic,message.toString());
      var index=topicList.indexOf(topic);
      if(index!=-1)
      {
        currClass.emit(topic,message.toString());
        mqtt_client.unsubscribe(topic);
        topicList.splice(index, 1);
      }
    });
  }

  getMQTTClient(){
    return mqtt_client;
  }

  //Request
  request(topic,data,options,responseTopic,callback){
    var currClass=this;
    mqtt_client.publish(topic,data,options,function(err){
      if(err)
        callback('null');
      else{
        mqtt_client.subscribe(responseTopic);
        topicList.push(responseTopic);
        currClass.once(responseTopic, function(response){
          callback('null',response);
        });
      }
    });
  }
}

module.exports=resmetry;
