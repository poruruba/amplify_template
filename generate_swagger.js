'use strict';

const THIS_BASE_PATH = __dirname;
const DEFAULT_HELPER_BASE = THIS_BASE_PATH + "/api/helpers/";
const HELPER_BASE = DEFAULT_HELPER_BASE;

const CONTROLLERS_BASE = THIS_BASE_PATH + '/api/controllers/';
const BACKEND_BASE = THIS_BASE_PATH + '/amplify/backend/function/';
const SWAGGER_BASE_FILE = THIS_BASE_PATH + "/api/swagger/" + SWAGGER_FNAME;
const SWAGGER_FNAME = "swagger.yaml";

const fs = require('fs');
const swagger_utils = require(HELPER_BASE + 'swagger_utils');

const root_file = fs.readFileSync(SWAGGER_BASE_FILE, 'utf-8');
const root = swagger_utils.parse_document(root_file);

var num = 0;

num += swagger_utils.delete_paths(root);
num += swagger_utils.delete_definitions(root);

const folders = fs.readdirSync(CONTROLLERS_BASE);
folders.forEach(folder =>{
  var stats_dir = fs.statSync(CONTROLLERS_BASE + folder);
  if( !stats_dir.isDirectory() )
    continue;
  try{
    fs.statSync(CONTROLLERS_BASE + folder + '/' + SWAGGER_FNAME );
  }catch(error){
    continue;
  }

  const file = fs.readFileSync(CONTROLLERS_BASE + folder + '/' + SWAGGER_FNAME, 'utf-8');
  const doc = swagger_utils.parse_document(file);
  num += swagger_utils.append_paths(root, doc, folder);
  num += swagger_utils.append_definitions(root, doc, folder);
});

const folders2 = fs.readdirSync(BACKEND_BASE);
folders2.forEach(folder =>{
  var stats_dir = fs.statSync(BACKEND_BASE + folder);
  if( !stats_dir.isDirectory() )
    continue;
    
  try{
    fs.statSync(BACKEND_BASE + folder + '/src/' + SWAGGER_FNAME );
  }catch(error){
    continue;
  }

  const file = fs.readFileSync(BACKEND_BASE + folder + '/src/' + SWAGGER_FNAME, 'utf-8');
  const doc = swagger_utils.parse_document(file);
  num += swagger_utils.append_paths(root, doc, folder);
  num += swagger_utils.append_definitions(root, doc, folder);
});

if( num == 0 ){
  console.log(SWAGGER_BASE_FILE + ' no changed');
  return;
}

var swagger = String(root);
fs.writeFileSync(SWAGGER_BASE_FILE, swagger, 'utf-8');
console.log(SWAGGER_BASE_FILE + ' merged');
