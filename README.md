Resmetry is a client library for the [MQTT](http://mqtt.org/) protocol, written
in JavaScript for node.js with the aim of building request-response communication on top of mqtt protocol.

This library relies on [MQTT.js library](https://www.npmjs.com/package/mqtt) for interacting with mqtt server.

<a name="install"></a>
## Installation

```sh
npm install resmetry --save
```

<a name="example"></a>
## Example

```js
var resmetrylib=require('resmetry');
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
//MQTT operations
mqtt.subscribe('request/1');
//Message event listener
var temp=25;
resmetry.on('message',function(topic,message){
  console.log("Topic: "+topic,"Message: "+message);
  if(topic=='request/1'&&message=='temp'){
    mqtt.publish('response/1',temp+'',{qos:2});
  }
});
//Making a request to topic 'request' with message 'send me details' whose expected result goes to topic response with options
var options={qos:2};
//Options are standard options available for publishing in npm package mqtt
resmetry.request('request/1','temp',options,'response/1',function(err,response){
  console.log('Response:'+response);
});

```

output:
```
Connected
Topic: request/1 Message: temp
Topic: response/1 Message: 25
Response:25

```


<a name="api"></a>
## API

  * <a href="#connect"><code>resmetry.<b>connect()</b></code></a>
  * <a href="#request"><code>resmetry.<b>request()</b></code></a>
  * <a href="#getMQTTClient"><code>resmetry.<b>getMQTTClient()</b></code></a>


-------------------------------------------------------
<a name="connect"></a>
### resmetry.connect(url,options)

Connects to the broker specified by the given url and options and
ted options. Options are as mentioned in connect part of npm package [mqtt.js](https://www.npmjs.com/package/mqtt#connect)

-------------------------------------------------------
<a name="request"></a>
### resmetry.request(topic,data,options,responseTopic,callback)

* 'topic' is the topic to which message will be send to.[Like request]
* 'data' is the message which needs to be passed along with request
* 'options' are additional options like qos and retain features. Refer npm package [mqtt.js publish](https://www.npmjs.com/package/mqtt#publish)
* 'responseTopic' is the the topic to which response will be send to[Like response]
* 'callback' is where any err or result will be passed

-------------------------------------------------------
<a name="getMQTTClient"></a>
### resmetry.getMQTTClient()

Returns the mqtt client for the functionality of add your listeners other than <b>'message'</b> event.Refer [mqtt.js Events](https://www.npmjs.com/package/mqtt#connect) for information on events and other functionalities.

-------------------------------------------------------
<a name="events"></a>
## Events

  * <a href="#connect"><code>connect</code></a>
  * <a href="#message"><code>message</code></a>
  -------------------------------------------------------
  <a name="connect"></a>
  ### resmetry.on('connect',function(message))

  * Fired when mqtt client connects to server
  * 'message' is a string saying Connected

  -------------------------------------------------------
  <a name="message"></a>
  ### resmetry.on('message',function(topic,message))

  * Fired when a message comes
  * 'topic' is the topic to which message was published
  * 'message' contains the message send in the topic

  -------------------------------------------------------
<a name="license"></a>
## License

MIT
