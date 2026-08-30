'use strict';

class DiscordUtils{
    constructor(client, events, bot_boken){
        this.client = client;
        this.map = new Map();

        this.client.once(events.ClientReady, this.clientReady);
        this.client.on(events.MessageCreate, this.processMessageCreate.bind(this));

        this.client.login(bot_boken);
    }

    async processMessageCreate(message){
        var handler = this.map.get('messageCreate');
        if( handler )
            handler(message, this.client);
    }

    async clientReady(c){
        console.log(c.user.tag);
    }

    messageCreate(handler){
        this.map.set('messageCreate', handler);
    }

    ackResponse(){
                var response = {
                    statusCode: 200,
                    headers: { "Content-Type": "text/plain" },
            body: ""
                };
                return response;                
            }

    lambda(){
        return async (event, context, callback) => {
            callback(null, this.ackResponse());
        }
    }
};

module.exports = DiscordUtils;
