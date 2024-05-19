"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* call margin check methods */
const getMarginDetails_1 = require("./exchangeApi/getMarginDetails");
const utils_1 = require("@leonetti/utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const _apiKey = process.env.BINANCE_API_KEY ?? "";
const _apiSecret = process.env.BINANCE_SECRET ?? "";
async function sequencialCallMargin(list) {
    let allOrders = [];
    for (const s of list) {
        await (0, utils_1.sleep)(2000);
        try {
            console.log(` checking orders on ${s} pair...`);
            let orders = await (0, getMarginDetails_1.getMarginOpenOrders)(s, _apiKey, _apiSecret);
            allOrders.push([orders, s]);
        }
        catch (error) {
            console.log(error);
        }
    }
    return allOrders;
}
async function test() {
    /*
        const some  = "BTCUSDT";///,"ETHUSDT"];
        const eth   = "ETHUSDT";
        const paxg	= "PAXGUSDT";
        let orders  = await getMarginOpenOrders(some, _apiKey, _apiSecret);
        let orders2  = await getMarginOpenOrders(eth, _apiKey, _apiSecret);
        let p= await getMarginOpenOrders(paxg, _apiKey, _apiSecret);*/
    let allTickers = [
        "BTCUSDT",
        "BTCFDUSD",
        "BTCTUSD",
        "BTCUSDC",
        "PAXGUSDT",
        "DOGEFDUSD",
        "DOGEUSDT",
        "BCHUSDT",
        "ETHUSDT",
        "BNBUSDT",
        "WIFUSDT",
        "SOLUSDT",
        "UNIUSDT"
    ];
    let all = await sequencialCallMargin(allTickers);
    //console.log(all);
    all.forEach(x => {
        console.log(` pair ${x[1]} has ${x[0].length} stops`);
    });
}
test();
