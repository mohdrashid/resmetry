'use strict';
var mqtt=require('mqtt');
//Events
var EventEmitter = require('events');

class resmetry extends EventEmitter{

    /**
     * Constructor. Initializes listeners and topic array
     * @param host: MQTT server URL
     * @param settings: MQTT Server additional settings if any
     * @param connectionType: 1 or true for a continuous connection, 0 or false for one-time connection
     */
    constructor(host,settings,connectionType){
        //noinspection JSAnnotator
        super();
        this.setMaxListeners(0);
        //Where topics are stored
        this.topicList=[];

        this.settings=settings;
        this.connectionType=connectionType;
        this.host=host;
        if(connectionType===true){
            this.connectClient();
        }
    }

    /**
     * Function which makes the client to connect to the MQTT server provided and listens for the messages
     */
    connectClient(){
        var self=this;
        this.mqttClient= mqtt.connect(this.host,this.settings);
        this.mqttClient.on('connect',function(){
            self.emit('connect','Connected');
        });
        this.mqttClient.on('message',function(topic,message){
            self.emit('message',topic,message.toString());
            var index=self.topicList.indexOf(topic);
            if(index!==-1)
            {
                self.emit(topic,message.toString());
                self.mqttClient.unsubscribe(topic);
                self.topicList.splice(index, 1);
            }
        });
    }

    /**
     * Disconnects the MQTT client
     */
    disconnect(){
        if(this.mqttClient===undefined){
            throw "MQTT Client is undefined. Either connection is ONE-TIME type or some issues with the connection";
        }
        this.mqttClient.end();
    }

    /**
     * Function that returns the mqtt client
     * @returns the MQTT client
     */
    getMQTTClient(){
        if(this.mqttClient===undefined){
            throw "MQTT Client is undefined. Either connection is ONE-TIME type or some issues with the connection";
        }
        return this.mqttClient;
    }

    /**
     * Function that emulates request-response action.
     * @param topic : The topic you are sending the data to
     * @param data : The data to be passed in the specified topic
     * @param options : Any additional MQTT publish options such as QoS
     * @param responseTopic : Topic to which the response will be sent to
     * @param callback : The function to which the result will be passed to
     */
    request(topic,data,options,responseTopic,callback){
        var self=this;
        if(this.connectionType===false){
            this.connectClient();
        }
        this.mqttClient.publish(topic,data,options,function(err){
            if(err)
                callback(err);
            else{
                self.mqttClient.subscribe(responseTopic);
                self.topicList.push(responseTopic);
                self.once(responseTopic, function(response){
                    callback(null,response);
                    if(self.connectionType===false)
                        self.disconnect();
                });
            }
        });
    }

}

module.exports=resmetry;
