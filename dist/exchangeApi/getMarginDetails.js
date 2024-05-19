"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarginOpenOrders = void 0;
/* get margin account details */
/*
/sapi/v1/margin/openOrders
*/
const utils_1 = require("../utils/utils");
async function getMarginOpenOrders(symbol, apiKey, apiSecret) {
    try {
        const timestamp = Date.now();
        const endpoint = "https://api.binance.com/sapi/v1/margin/openOrders";
        const params = {
            symbol: symbol,
            isIsolated: "TRUE",
            timestamp
        };
        const queryString = (0, utils_1.generateQueryString)(params, apiSecret);
        const url = `${endpoint}?${queryString}`;
        const request = await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const response = await request.json();
        return response;
    }
    catch (error) {
        console.log(error);
        return error;
    }
}
exports.getMarginOpenOrders = getMarginOpenOrders;
