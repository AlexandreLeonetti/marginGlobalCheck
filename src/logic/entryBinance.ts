/* logic functions   */
import { isolatedBuyBor } from "../exchangeApi/isolatedBuyBor";
import { isolatedShortBor } from "../exchangeApi/isolatedShortBor";
import { isolatedStopSell } from "../exchangeApi/isolatedStopSell";
import { isolatedStopBuy } from "../exchangeApi/isolatedStopBuy";
import { formatter, sleep } from "../utils/utils";
import { getTickerPrice } from "../exchangeApi/ticker";
import { allParams } from "../config/config";
import { tradeParams } from "../config/trades";

import dotenv from "dotenv";
dotenv.config();
const _apiKey = process.env.BINANCE_API_KEY ?? "";
const _apiSecret = process.env.BINANCE_SECRET ?? "";

function logCurrentDay() {
	const currentDate = new Date();
	const formattedDate = `${currentDate.getFullYear()}-${
		currentDate.getMonth() + 1
	}-${currentDate.getDate()}`;
	return formattedDate;
}

async function buy(
	symbol: string,
	quantity: number,
	_apiKey: string,
	_apiSecret: string
): Promise<any> {
	//logStream.write(`Symbol : ${symbol}, quantity : ${quantity} \n`);
	let tx = "";
	tx = await isolatedBuyBor(symbol, quantity, _apiKey, _apiSecret);
	//logStream.write(`isoBuy and Borrow. \n`);
	//logStream.write(JSON.stringify(tx, null, 2)+`\n`);

	return tx;
}

async function sell(
	symbol: string,
	quantity: number,
	_apiKey: string,
	_apiSecret: string
): Promise<any> {
	//logStream.write(`Symbol : ${symbol}, quantity : ${quantity} \n`);
	let tx = "";
	tx = await isolatedShortBor(symbol, quantity, _apiKey, _apiSecret);
	//logStream.write(`isoBuy and Borrow. \n`);
	//logStream.write(JSON.stringify(tx, null, 2)+`\n`);
	return tx;
}

async function handleBuyEntry(
	qty: number,
	precision: number,
	sizePrecision: number,
	stopLoss: number,
	limitLoss: number,
	_apiKey: string,
	_apiSecret: string,
	//logStream:any,
	symbol: string
) {
	//logStream.write(`quantity ${qty}`);
	const str_bitcoin = qty.toString();
	const new_bitcoin = formatter(str_bitcoin, 1, 5);

	const tx = await buy(
		symbol,
		new_bitcoin,
		_apiKey,
		_apiSecret
		//logStream
	);

	/* account has insufficient balance for requested action */

	//logStream.write(JSON.stringify(tx, null, 2) + `\n`);
	let qtyStopLoss: number = formatter(tx.executedQty, 0.997, sizePrecision);

	let avgPrice = parseFloat(
		/*avg bought price */
		(tx.cummulativeQuoteQty / tx.executedQty).toFixed(precision)
	);
	let stopPrice = formatter(avgPrice, 1 - stopLoss, precision);
	let limit = formatter(avgPrice, 1 - limitLoss, precision);
	console.log(stopPrice, limit);
	/* frequent error BTCFDUSD NaN NaN NaN */
	//console.log(symbol, bitcoin, stopPrice, limit);
	/*logStream.write(
			`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`
		);*/
	await sleep(300);
	const stopLossTx = await isolatedStopSell(
		symbol,
		qtyStopLoss,
		stopPrice,
		limit,
		_apiKey,
		_apiSecret
	);
	//logStream.write(`placed stop loss\n`);
	//logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
	if (Object.hasOwn(stopLossTx, "code")) {
		/* sleep 200ms */
		await sleep(300);

		/* replace stop loss a bit wider */
		/*logStream.write(
				`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`
			);*/
		const stopLossTx2 = await isolatedStopSell(
			symbol,
			qtyStopLoss,
			stopPrice,
			limit,
			_apiKey,
			_apiSecret
		);
		//logStream.write(`placed stop loss 2nd trial\n`);
		//logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
	}
}

async function handleSellEntry(
	qty: number,
	precision: number,
	sizePrecision: number,
	stopLoss: number,
	limitLoss: number,
	_apiKey: string,
	_apiSecret: string,
	//logStream:any,
	symbol: string
) {
	// side === "SELL"
	//logStream.write(`quantity ${qty}`);
	const str_bitcoin = qty.toString();
	const new_qty = formatter(str_bitcoin, 1, 5);

	const tx = await sell(symbol, new_qty, _apiKey, _apiSecret);

	//logStream.write(JSON.stringify(tx, null, 2) + `\n`);
	let qtyStopLoss = formatter(tx.executedQty, 0.997, sizePrecision);

	let avgPrice = parseFloat(
		(tx.cummulativeQuoteQty / tx.executedQty).toFixed(precision)
	);
	//console.log("avgPrice", avgPrice);
	let stopPrice = formatter(avgPrice, 1 + stopLoss, precision);
	let limit = formatter(avgPrice, 1 + limitLoss, precision);
	//console.log(stopPrice, limit);
	/* frequent error BTCFDUSD NaN NaN NaN */
	//console.log(symbol, bitcoin, stopPrice, limit);
	/*logStream.write(
			`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`
		);*/
	await sleep(500);
	const stopLossTx = await isolatedStopBuy(
		symbol,
		qtyStopLoss,
		stopPrice,
		limit,
		_apiKey,
		_apiSecret
	);
	//logStream.write(`placed stop loss\n`);
	//logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
	if (Object.hasOwn(stopLossTx, "code")) {
		/* sleep 200ms */
		await sleep(300);

		/* replace stop loss a bit wider */
		/*logStream.write(
				`symbol ${symbol}, quantity : ${qtyStopLoss}, stopPrice : ${stopPrice}, limit : ${limit} \n`
			);*/
		const stopLossTx2 = await isolatedStopBuy(
			symbol,
			qtyStopLoss,
			stopPrice,
			limit,
			_apiKey,
			_apiSecret
		);
		//logStream.write(`placed stop loss on second attempt\n`);
		//logStream.write(JSON.stringify(stopLossTx, null, 2) + `\n`);
	}
}

/* type the following function */
async function ENTRY(
	//side:"BUY"|"SELL",
	qty: number,
	precision: number,
	sizePrecision: number,
	stopLoss: number,
	limitLoss: number,
	_apiKey: string,
	_apiSecret: string,
	//logStream:any,
	symbol: string
) {
	let side = "BUY";
	if (side === "BUY") {
		handleBuyEntry(
			qty,
			precision,
			sizePrecision,
			stopLoss,
			limitLoss,
			_apiKey,
			_apiSecret,
			//logStream,
			symbol
		);
	} else if (side === "SELL") {
		handleSellEntry(
			qty,
			precision,
			sizePrecision,
			stopLoss,
			limitLoss,
			_apiKey,
			_apiSecret,
			//logStream,
			symbol
		);
	}
}

async function GET_PRICE(symbol: string) {
	/* add logStream */
	try {
		const price = await getTickerPrice(symbol);
		return price;
	} catch (e) {
		console.log(e);
	}
}

// Define an interface for the objects within allParams
interface ParamObject {
	name: string;
	pricePrecision: number;
	sizePrecision: number;
}

// Define an interface for the return type
interface Params {
	precision: number;
	sizePrecision: number;
}

interface TradeParamObject {
	name: string;
	size: number;
	stop: number;
	limit: number;
	minPrice: number;
}



function PARAMS(symbol: string): Params | undefined {
	// Assuming allParams is defined elsewhere in your code
	const all_params: ParamObject[] = allParams.BINANCE;
	const params = all_params.find((x) => x.name === symbol);

	// Use optional chaining and nullish coalescing to handle undefined cases
	/* returns 0 if precision doesnt exist */
	const precision = params?.pricePrecision ?? 0;
	const sizePrecision = params?.sizePrecision ?? 0;

	return { precision, sizePrecision };
}

function tradeParamGenerator(symbol: string): TradeParamObject{
	const allTradeParams: TradeParamObject[] = tradeParams.BINANCE;
	const params = allTradeParams.find((x) => x.name === symbol);
	const size = params?.size ?? 0;
	const stop = params?.stop ?? 0.002;
	const limit = params?.limit ?? 0.002;
	const minPrice = params?.minPrice ?? 0;
	const name= symbol;

	return {name, size, stop, limit, minPrice };
}

async function isAbove(side: string, symbol: string, price: number, t: number) {
	if (side === "BUY") {
		return t == null ? false : price >= t;
	} else if (side === "SELL") {
		return false;
	} else {
		return false;
	}
}

async function strat(
	//side:"BUY"|"SELL",
	name: string,
	//qty: number,
	//stopLoss: number,
	//limitLoss: number,
	//minimum: number
	//logStream:any
) {
	let side = "BUY";
	//async function strat({side,  qty, name, asset,  stop, limit, range=null}, logStream) {
	let tradeInstanceParams = tradeParamGenerator(name) ;
	let symbol = tradeInstanceParams.name;
	let qty    = tradeInstanceParams.size;
	let stopLoss= tradeInstanceParams.stop;
	let limitLoss= tradeInstanceParams.limit;
	let minimum = tradeInstanceParams.minPrice;
	//let {, qty, stopLoss, limitLoss, minimum}= tradeParamGenerator(name);
	let p = PARAMS(symbol);
	//let {precision, sizePrecision} = p
	let sizePrecision = p?.sizePrecision ?? 0;
	let precision = p?.precision ?? 0;

	//console.log(` precision is ${precision}, sizePrecision is ${sizePrecision}`);

	const currentDate = new Date();
	const logMsg = `\n\n ***** ${currentDate} *****  \n`;

	//logStream.write(logMsg);

	//    let  error=null, borUsd=null, freeUsd=null, borAsset=null, freeAsset=0 ;//= await TEST_BALANCE(symbol,  asset, _apiKey, _apiSecret, logStream );
//	const randomDelay = Math.random() * 6000;
//	await sleep(randomDelay);

	let price = await GET_PRICE(symbol);
	price = price ?? 0;

	//const c = await treshold(side, symbol, price, tres);// returns what ???
	//const c = await rangeBoundaries(side, symbol, price, range);
	const c = await isAbove(side, symbol, price, minimum);
	if (c === true) {
		const entry = await ENTRY(
			qty,
			precision,
			sizePrecision,
			stopLoss,
			limitLoss,
			_apiKey,
			_apiSecret,
			symbol
		);
	} else {
		const log2 = `\ndid not pass treshold condition on ${symbol}, price = ${price}, treshold = ${minimum} \n`;
		//logStream.write(log2);
	}

	/*setTimeout(() => {
		//logStream.end();
		//logStream.destroy();
	}, 9000);*/
}

async function multi(logStream: any) {
	//
	//const one = await strat("BUY", 0.060, "BTCFDUSD","BTC",  0.0025,0.0035,logStream,53500);
	//	await sleep(100);
	//await sleep(400);
	//const two = await strat( 0.010, "BTCUSDT",  0.01,0.0150,70000);
	//const sol= await strat( 1, "SOLUSDT",  0.025,0.029,143);//4.4
	//await sleep(500);
	//const link = await strat("BUY", 7, "LINKUSDT","LINK",0.015,0.019,logStream,20.8);
	//const ltc  = await strat("SELL",1 , "LTCBTC",  "LTC", 0.010,0.013,logStream, 0.00129);//1
}

async function multiFast(logStream: any) {
	//const one = await strat("BUY", 0.055, "BTCFDUSD","BTC",  0.0045,0.0055,logStream,53500);
	await sleep(100);
}

async function single(logStream: any) {
	//const usdc = await strat(0.001, "BTCUSDC", 0.001,0.0015,66800);
}

export { logCurrentDay, multi, multiFast, single, strat };
