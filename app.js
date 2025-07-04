'use strict';

const MAX_DATA_SIZE = process.env.MAX_DATA_SIZE || '1mb';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const expressWs = require('express-ws')(app);

//app.use(logger('tiny', { stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }));
app.use(logger('dev')); // for development
//app.use(express.json({limit: MAX_DATA_SIZE}));
app.use(express.urlencoded({ limit: MAX_DATA_SIZE, extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static( path.join(__dirname, 'public')));

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || 'secret_key';
app.use(session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
//    cookie: { secure: true }
}));

process.env.THIS_BASE_PATH = __dirname;
console.log('THIS_BASE_PATH: ' + process.env.THIS_BASE_PATH);
process.env.HELPER_BASE = process.env.THIS_BASE_PATH + "/api/helpers/opt/";

// swagger.yamlの検索
const routing = require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing');
app.use(routing.basePath, routing.router);
console.log('BasePath: ' + routing.basePath);

// mcp.yamlの検索
//const routing_mcp = require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_mcp');
//app.use(routing_mcp.basePath, routing_mcp.router);

// mqtt.jsonの検索
if( process.env.MQTT_BROKER_URL )
  require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_mqtt');

// udp.jsonの検索
require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_udp');

// cron.jsonの検索
require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_cron');

// sqs.jsonの検索
if( process.env.ROUTING_SQS_ENDPOINT )
  require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_sqs');

// kinesis.jsonの検索
if( process.env.ROUTING_KINESIS_ENDPOINT )
  require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_kinesis');

// ws.jsonの検索
const routing_ws = require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_ws');
app.use('/', routing_ws.router);
routing_ws.setWss(expressWs.getWss());

// wsc.jsonの検索
require(process.env.THIS_BASE_PATH + '/api/controllers/routing/routing_wsc');

app.all('*', function(req, res) {
//  console.log(req);
  console.log('Unknown Endpoint');
  console.log('\tmethod=' + req.method);
  console.log('\tendpoint=' + req.params[0]);
  res.sendStatus(404);
});

var port = Number(process.env.PORT) || 30080;
app.listen(port, () =>{
  console.log('http PORT=' + port)
})

const https = require('https');
try{
  const options = {
    key:  fs.readFileSync('./cert/privkey.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
    ca: fs.readFileSync('./cert/chain.pem')
  };
  const sport = Number(process.env.SPORT) || 30443;
  const servers = https.createServer(options, app);
  console.log('https PORT=' + sport );
  servers.listen(sport);
}catch(error){
//  console.log(error);
  console.log("can't load https");
}
