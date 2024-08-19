import fetch from 'node-fetch';
import { authentication } from "./auth.mjs";
import { addDTRow } from "./addDTRow.mjs";
import { updateDTRow} from "./updateDTRow.mjs";

export const handler = async(event, context, callback) => {
    console.log(event.detail.eventBody.id);
    const userId = event.detail.eventBody.id;
    const queueId = event.detail.eventBody.queueId;
    const joined = event.detail.eventBody.joined;
    const envQueueId = process.env.queueId.split(",");
    if(envQueueId.includes(queueId)){
        const clientId = process.env.clientId;
        const clientSecret = process.env.clientSecret;
        const environment = process.env.environment;
        const accessToken =  await authentication(clientId, clientSecret, environment);
    	const getValue = await fetch(`https://api.${environment}/api/v2/flows/datatables/${process.env.dataTable}/rows/${userId}`, {
    		method: 'GET',
    		headers: {
    		    'Content-Type': 'application/json',
        		'Authorization': `Bearer ${accessToken}`
        	}
    	});
	    if (getValue.status == 200){
    	    await updateDTRow(accessToken, environment, userId, queueId, joined);
    	    const response = {
                statusCode: 200,
                body: JSON.stringify('Data table row updated'),
            };
            console.log(response);
            return response;
        }
    	else{
    	    await addDTRow(accessToken, environment, userId, queueId, joined);
    	    const response = {
                statusCode: 200,
                body: JSON.stringify('Data table row added'),
            };
            console.log(response);
	        return response;
    	}
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('queueId is not matched'),
    };
    console.log(response);
    return response;
};