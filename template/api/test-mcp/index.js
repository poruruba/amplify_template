'use strict';

const { McpServer, ResourceTemplate } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { z } = require("zod");

function textResponse(text) {
  return {
    content: [
      {
        type: "text",
        text: String(text)
      }
    ]
  };
}

function errorResponse(error) {
  console.error(error);
  return {
    content: [{
      type: "text",
      text: `Error: ${error.message || error}`
    }],
    isError: true
  };
}

function checkApiKey(req, apikey){
  const xapikey = req && req.headers['x-api-key'];
  if( xapikey != apikey ){
    const error = new Error('invalid or missing API key');
    error.statusCode = 401;
    throw error;
  }
}

exports.handler = () => {
    const server = new McpServer({
        name: "McpTest",
        version: "1.0.0"
    });

    // Add tools
    server.tool("testtool1", "2つの数値を加算します。",
        { a: z.number().describe("数値1"), b: z.number().describe("数値2") },
        async (args) => {
          try{
            return textResponse(args.a + args.b);
          }catch(error){
            return errorResponse(error);
          }
        }
    );
    server.tool("testtool2", "2つの数値を減算します。",
      { a: z.number().describe("数値1"), b: z.number().describe("数値2") },
      async (args) => {
          try{
            return textResponse(args.a - args.b);
          }catch(error){
            return errorResponse(error);
          }
      }
    );

    // Add a dynamic greeting resource
    server.resource(
        "greeting",
        new ResourceTemplate("greeting://{name}", { list: async () => {
            return {
                resources:
                    [
                      { name: "hogehoge", uri: "greeting://hogehoge"},
                    ]
            };
          }}
        ),
        async (uri, variables) => {
          return {
              contents: [{
                  uri: uri.href,
                  text: `Hello, ${variables.name}!`
              }]
          }
        }
    );
    
    return server;
};
