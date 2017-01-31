var resmetrylib=require('./index.js');
var host='mqtt://localhost';
//Standard settings available in npm package mqtt
var settings={
  protocolId: 'MQIsdp',
  protocolVersion: 3
};
var resmetry= new resmetrylib();
//Connect to mqtt server with given credentials
resmetry.connect(host,settings);
//Get mqtt client for advanced operations, Refer npm package mqtt for more information
//For other features offered by MQTT, the modifications can be made using the object
var mqtt=resmetry.getMQTTClient();
//Connection listener
resmetry.on('connect',function(message){
  console.log(message);
});
//Message event listener
resmetry.on('message',function(topic,message){
  console.log(topic,message);
});

//Making a request to topic 'request' with message 'send me details' whose expected result goes to topic response with options
var options={qos:2};
//Options are standard options available for publishing in npm package mqtt
resmetry.request('request','send me details',options,'response',function(err,response){
  console.log('Response:'+response);
});
