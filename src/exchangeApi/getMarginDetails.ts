/* get margin account details */
/*
/sapi/v1/margin/openOrders
*/
import { generateQueryString } from "../utils/utils";

async function getMarginOpenOrders(symbol:string, apiKey:string, apiSecret:string){
    try{
        const timestamp = Date.now();
        const endpoint  = "https://api.binance.com/sapi/v1/margin/openOrders";
        const params    = {
            symbol:symbol,
            isIsolated:"TRUE",
            timestamp
        }
        const queryString = generateQueryString(params, apiSecret);
        const url = `${endpoint}?${queryString}`;

        const request = await  fetch(url, {
                        method:"GET",
                        headers:{
                                            "X-MBX-APIKEY": apiKey,
                                            "Content-Type": "application/x-www-form-urlencoded"
                                        }
                    })

        const response = await request.json();
        return response;
    }catch(error){
        console.log(error);
        return error;
    }

}

export { getMarginOpenOrders};
