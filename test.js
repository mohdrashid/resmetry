var resmetrylib=require('./index.js');
var host='mqtt://localhost';
//Standard settings available in npm package mqtt
var settings={
  protocolId: 'MQIsdp',
  protocolVersion: 3
};
/**
 * The last parameter should be true for an always active connection, false for a one time connection
 * @type {resmetry}
 */
var resmetry= new resmetrylib(host,settings,false);

/*
* Get mqtt client for advanced operations, Refer npm package mqtt for more information
* For other features offered by MQTT, the modifications can be made using the object
* Only applicable true is passed the last parameter of the constructor
*/
//var mqtt=resmetry.getMQTTClient();
//MQTT operations
//mqtt.subscribe('request/1');

//Connection listener
resmetry.on('connect',function(message){
  console.log(message);
});

//Message event listener
var temp=25;
resmetry.on('message',function(topic,message){
  console.log("Topic: "+topic,"Message: "+message);
  if(topic==='request/1'&&message==='temp'){
    mqtt.publish('response/1',temp+'',{qos:2});
  }
});

//Making a request to topic 'request' with message 'send me details' whose expected result goes to topic response with options
var options={qos:2};
//Options are standard options available for publishing in npm package mqtt
resmetry.request('request/1','temp',options,'response/1',function(err,response){
  console.log('Response:'+response);
});
