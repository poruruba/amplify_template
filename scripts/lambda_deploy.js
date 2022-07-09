'use strict';

const THIS_BASE_PATH = __dirname + "/..";

const CONTROLLERS_BASE = THIS_BASE_PATH + '/api/controllers/';
const ZIP_FNAME = 'index.zip';

const AWS = require('aws-sdk');
AWS.config.update({
  region: "ap-northeast-1",
});
const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

const fs = require('fs');
const archiver = require('archiver');

async function folderToZip(target_folder){
	return new Promise((resolve, reject) =>{
		const output = fs.createWriteStream(CONTROLLERS_BASE + target_folder + '/' + ZIP_FNAME);
		const archive = archiver('zip', {
		  zlib: { level: 9 }
		});

		output.on('close', function() {
		  console.log(CONTROLLERS_BASE + target_folder + '/' + ZIP_FNAME + ': ' + archive.pointer() + ' total bytes');
		  resolve();
		});

		output.on('end', function() {
		  console.log('Data has been drained');
		});

		archive.on('error', function(err) {
			reject(err);
		});

		archive.pipe(output);
		archive.directory(CONTROLLERS_BASE + target_folder, false);
		archive.finalize();
	});
}

if( process.argv.length < 3 ){
	console.log('usage: npm run lambda_deploy [folder_name]');
	return;
}

var folder_name = process.argv[2];
var target_folder = CONTROLLERS_BASE + folder_name + '/';

(async () =>{
	try{
		await folderToZip(folder_name);
		
		var binary = fs.readFileSync(target_folder + ZIP_FNAME);

		var params = {
		  FunctionName: folder_name,
		  ZipFile: binary
		};
		lambda.updateFunctionCode(params, (err, data) => {
		  if (err){
		  	console.log(err, err.stack);
		  	return;
		  }
		  console.log("Lambda Updated");
		  console.log("FunctionArn: " + data.FunctionArn);
		  console.log("Runtime: " + data.Runtime);
		});
	}catch(error){
		console.error(error);
	}
})();

