'use strict';

const HELPER_BASE = process.env.HELPER_BASE || process.env.DEFAULT_HELPER_BASE;

exports.handler = async(parent, args, context, info) =>{
	console.log("args", JSON.stringify(args));
	console.log("path", info.path);

	return "Hello World";
};
