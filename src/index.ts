/* call margin check methods */
import { getMarginOpenOrders } from "./exchangeApi/getMarginDetails";
import { sleep } from "@leonetti/utils";
import dotenv from "dotenv";
dotenv.config();
const _apiKey = process.env.BINANCE_API_KEY ?? "";
const _apiSecret = process.env.BINANCE_SECRET ?? "";

async function sequencialCallMargin(list : string[]){
	let allOrders:any[] = [];
	for ( const s of list){
		await sleep (2000);
		try{
		console.log(` checking orders on ${s} pair...`)
		let orders = await getMarginOpenOrders(s, _apiKey, _apiSecret);
		allOrders.push([orders, s]);
		}catch(error){
			console.log(error);
		}
	}
	return allOrders; 
}

async function test(){

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
		"PEPEUSDT",
		"SOLFDUSD",
		"SOLUSDT",
		"UNIUSDT"
	];
	let all = await sequencialCallMargin(allTickers);

	all.forEach(x =>{
		console.log(` pair ${x[1]} has ${x[0].length} stops`);
	}
	)
	
}


test();