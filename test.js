var test=require('./index.js');
var host='mqtt://localhost:1883';
//Standard settings available in npm package mqtt
var settings={
  protocolId: 'MQIsdp',
  protocolVersion: 3
};

var one= new test();
//Connect to mqtt server with given credentials
one.connect(host,settings);
//Get mqtt client for advanced operations, Refer npm package mqtt for more information
//However message event is handled by the package
var mqtt=one.getMQTTClient();
mqtt.on('connect',function(){
  console.log('Connected');
})
//Making a request to topic 'request' with message 'send me details' whose expected result goes to topic response with options
var options={qos:2};
//Options are standard options available for publishing in npm package mqtt
one.request('request','send me details',options,'response',function(err,result){
  console.log(result);
});
