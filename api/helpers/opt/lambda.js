const fetch = require('node-fetch');
const Headers = fetch.Headers;

class LambdaProxy{
  constructor(base_url){
    this.base_url = base_url;
  }

  invoke(params, callback){
    if(params.InvocationType == 'RequestResponse'){
      do_post( this.base_url + params.FunctionName, JSON.parse(params.Payload) )
      .then(response =>{
        callback(null, {
          StatusCode: 200,
          Payload: JSON.stringify(response)
        });
      })
      .catch(error =>{
        callback(error);
      });
    }else
    if( params.InvocationType == 'Event' ){
      do_post( this.base_url + params.FunctionName, JSON.parse(params.Payload) )
      .then(response =>{
        console.log("LambdaProxy", response);
      })
      .catch(error =>{
        console.error("LambdaProxy", error);
      });

      callback(null, {
        StatusCode: 202,
        Payload: ""
      });
    }else
    if( params.InvocationType == "DryRun" ){
      callback(null, {
        StatusCode: 200,
        Payload: ""
      });
    }
  }
}

function do_post(url, body) {
  const headers = new Headers({ "Content-Type": "application/json" });
  return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers
    })
    .then((response) => {
      if (!response.ok)
        throw 'status is not 200';
      return response.json();
    });
}

module.exports = LambdaProxy;
