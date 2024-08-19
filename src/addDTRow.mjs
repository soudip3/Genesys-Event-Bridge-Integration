import fetch from "node-fetch";

export const addDTRow = async (accessToken, environment,userId, queueId, joined) => {
    const params = {
            "key": userId,
            "inOffice": joined,
            "queueId": queueId
    };
    
    // fetching routing activity query
	const response = await fetch(`https://api.${environment}/api/v2/flows/datatables/${process.env.dataTable}/rows`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`
		},
		body: JSON.stringify(params)
	})
    const data = await response.json();
    // returning json data
    return data;
}