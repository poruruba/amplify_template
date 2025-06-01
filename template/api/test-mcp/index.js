'use strict';

const { McpServer, ResourceTemplate } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { z } = require("zod");

exports.handler = () => {
    const server = new McpServer({
        name: "McpTest",
        version: "1.0.0"
    });

    // Add tools
    server.tool("testtool1", "add two numbers",
        { a: z.number().describe("数値1"), b: z.number().describe("数値2") },
        async (args) => {
          return {
            content: [
              {
                type: "text",
                text: String(args.a + args.b)
              }
            ]
          }
        }
    );
    server.tool("testtool2", "subtract two numbers",
      { a: z.number().describe("数値1"), b: z.number().describe("数値2") },
      async (args) => {
        return {
          content: [
            {
              type: "text",
              text: String(args.a - args.b)
            }
          ]
        }
      }
    );

    // Add a dynamic greeting resource
    server.resource(
        "gpio",
        new ResourceTemplate("gpio://PORT{name}", { list: async () => {
            return {
                resources:
                    [
                      { name: "37", uri: "gpio://PORT37"},
                      { name: "39", uri: "gpio://PORT39"},
                    ]
            };
          }}
        ),
        async (uri, variables) => {
          return {
              contents: [{
                  uri: uri.href,
                  text: variables.name
              }]
          }
        }
    );
    
    return server;
};
