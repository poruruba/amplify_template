'use strict';

const THIS_BASE_PATH = process.env.THIS_BASE_PATH;
const CONTROLLERS_BASE = THIS_BASE_PATH + '/api/controllers/';

function lambdaInvoke(params, callback){
  if(params.InvocationType == 'RequestResponse'){
    var returned = false;
    var return_response = (ret) =>{
      if( !returned ){
        returned = true;
        callback(null, {
          StatusCode: 200,
          Payload: JSON.stringify(ret)
        });
      }
    };
    var return_error = (err) =>{
      if( !returned ){
        returned = true;
        callback(err);
      }
    };

    try{
      var folder = CONTROLLERS_BASE + params.FunctionName;
      var func = require(folder).handler;

      const context = {
        succeed: (msg) => {
            console.log('succeed called');
            return_response(msg);
        },
        fail: (error) => {
            console.log('failed called');
            return_error(error);
        },
      };

      const task = func(JSON.parse(params.Payload), context, (error, response) =>{
        console.log('callback called');
        if( error )
          return_error(error);
        else
          return_response(response);
      });
      if( task instanceof Promise || (task && typeof task.then === 'function') ){
        return task.then(ret =>{
          if( ret ){
              console.log('promise is called');
              return_response(ret);
          }else{
              console.log('promise return undefined');
          }
        })
        .catch(err =>{
            console.log('error throwed: ' + err);
            return_error(err);
        });
      }
    }catch(error){
      return_error(error);
    }
  }else
  if( params.InvocationType == 'Event' ){
    callback(null, {
      StatusCode: 202,
      Payload: ""
    });
    
    var returned = false;
    var return_response = (ret) =>{
      if( !returned ){
        returned = true;
        console.log("LambdaProxy OK:", ret);
      }
    };
    var return_error = (err) =>{
      if( !returned ){
        returned = true;
        console.log("LambdaProxy Error:", err);
      }
    };

    try{
      var folder = CONTROLLERS_BASE + params.FunctionName;
      var func = require(folder).handler;

      const context = {
        succeed: (msg) => {
            console.log('succeed called');
            return_response(msg);
        },
        fail: (error) => {
            console.log('failed called');
            return_error(error);
        },
      };

      const task = func(JSON.parse(params.Payload), context, (error, response) =>{
        console.log('callback called');
        if( error )
          return_error(error);
        else
          return_response(response);
      });
      if( task instanceof Promise || (task && typeof task.then === 'function') ){
        task.then(ret =>{
          if( ret ){
              console.log('promise is called');
              return_response(ret);
          }else{
              console.log('promise return undefined');
          }
        })
        .catch(err =>{
            console.log('error throwed: ' + err);
            return_error(err);
        });
      }
    }catch(error){
      return_error(error);
    }
  }else
  if( params.InvocationType == "DryRun" ){
    callback(null, {
      StatusCode: 200,
      Payload: ""
    });
  }
}

module.exports = {
  invoke: lambdaInvoke
};
