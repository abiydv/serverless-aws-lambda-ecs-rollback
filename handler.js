'use strict';

const AWS = require('aws-sdk');	
const ecs = new AWS.ECS({ region: 'us-east-1' });

module.exports.rollback = (event, context) => {
	
	const resp = main(process.env.ECS_SERVICE,process.env.ECS_CLUSTER,process.env.ECS_TASK); 
	return resp;

	async function main(service,cluster,task){

		try {
			var td = await gettaskdef(service,cluster);
			console.log("Service task definition: ", td);
		} catch (error) { 
			console.log("Unable to get service's task definition");
			return error;
		}

		try { 
			var rbtd = await listtaskdef(task);
			if ( td === rbtd ){
				const  msg = "Already on the second last version. Nothing to do";
				console.log(msg);
				return msg;
			} else {
				console.log("On the latest version, will rollback to second last version");
			}
		} catch (error) {
			console.log("Unable to list task definitions");
			return error;
		}
		
		try {
			console.log("Rollback triggered: ", await updateservice(service,cluster,rbtd));
		} catch (error){
			console.log("Unable to update service");
			return error;
		}

		try {
			console.log("Service task definition changed to: ",await gettaskdef(service,cluster));
		} catch (error){
			console.log("Unable to get service's new task definition");
			return error;
		}
	}

	function gettaskdef(service, cluster){
		return new Promise(function(resolve, reject){
		var sparams = {
  		services: [ service ],
  		cluster: cluster
		};
		ecs.describeServices(sparams, function(err, data) {
	   		if (err) reject(err);
	   		else resolve(data.services[0].taskDefinition);
	   	});
	})}

	function listtaskdef(taskfamily){
		return new Promise(function(resolve, reject){
		var params = {
			familyPrefix: taskfamily,
			maxResults: 5,
			sort: "DESC",
			status: "ACTIVE"
		};
		ecs.listTaskDefinitions(params, function(err, data){
			if (err) reject(err);
		   	else resolve(data.taskDefinitionArns[1]);
		});
	})}

	function updateservice(service,cluster,taskDefinition){
		return new Promise(function(resolve, reject){
		var params = {
		   	service: service,
		   	cluster: cluster,
		   	taskDefinition: taskDefinition
		};
		ecs.updateService(params, function(err, data) {
		   if (err) reject(err);
		   else resolve(data.service.events[0]);
		});
	})}
};
