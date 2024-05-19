
import {Client} from "leonetti-axios-kucoin";
import { sleep } from "@leonetti/utils";
import { tradeParams } from "../config/trades";
import { allParams } from "../config/config";



const k1 = new Client({
	secret: process.env.KUCOIN_SECRET as string,
	password: process.env.PASS_PHRASE as string,
	key: process.env.KUCOIN_KEY as string,
});

interface TradeParamObject {
	name: string;
	size: number;
	stop: number;
	limit: number;
	minPrice: number;
}
interface ParamObject {
	name: string;
	pricePrecision: number;
	sizePrecision: number;
}

// Define an interface for the return type
interface Params {
	pricePrecision: number;
	sizePrecision: number;
}
function tradeParamGenerator(symbol: string): TradeParamObject{
	const allTradeParams: TradeParamObject[] = tradeParams.KUCOIN;
	const params = allTradeParams.find((x) => x.name === symbol);
	const size = params?.size ?? 0;
	const stop = params?.stop ?? 0.002;
	const limit = params?.limit ?? 0.002;
	const minPrice = params?.minPrice ?? 0;
	const name= symbol;

	return {name, size, stop, limit, minPrice };
}
function paramGenerator(symbol: string): Params {
	// Assuming allParams is defined elsewhere in your code
	const all_params: ParamObject[] = allParams.KUCOIN;
	const params = all_params.find((x) => x.name === symbol);

	// Use optional chaining and nullish coalescing to handle undefined cases
	/* returns 0 if precision doesnt exist */
	const pricePrecision = params?.pricePrecision ?? 0;
	const sizePrecision = params?.sizePrecision ?? 0;

	return { pricePrecision, sizePrecision };
}
async function entry(name:string) {

	let tradeInstanceParams = tradeParamGenerator(name) ;
	let symbolTicker = tradeInstanceParams.name;
	let size= tradeInstanceParams.size;
	let stopLoss= tradeInstanceParams.stop;
	let limitLoss= tradeInstanceParams.limit;
	let lowBound = tradeInstanceParams.minPrice;

	let precisionParams = paramGenerator(name);
	let sizePrecision = precisionParams.sizePrecision;
	let pricePrecision = precisionParams.pricePrecision;

	//let size = 1.5;
	let str_size = size.toFixed(sizePrecision);
	let size_stop = (size * 0.995).toFixed(sizePrecision);

	//let stopLoss = 0.005;
	//let limitLoss = 0.007;

	const prom_price = await k1.symbolsTicker.getTicker({ symbol: symbolTicker });
	const price = prom_price.data.data.price;
	const numberPrice = Number.parseFloat(price);
//	const randomDelay = Math.random() * 6000;
//	await sleep(randomDelay);
	if (numberPrice > lowBound) {
		//console.log(`price : ${numberPrice}, lower bound : ${lowBound}`);
		//console.log(`size precision : ${sizePrecision}, price precision ${pricePrecision}`);
		try{

		const { data } = await k1.orders.placeMarginOrder({
			clientOid: Date.now().toString(),
			side: "buy",
			symbol: symbolTicker,
			type: "market",
			size: str_size,
			marginModel: "isolated",
		});
		//console.log(data);
		//console.log(data.data);
		const avgBuy = await k1.getAvg(data.data.orderId);

		//console.log("avgBuy : ", avgBuy);

		// stop loss orders
		let stop_price = (avgBuy * (1 - stopLoss)).toFixed(pricePrecision);
		let lim_price = (avgBuy * (1 - limitLoss)).toFixed(pricePrecision);

		await sleep(300);

		const sl1 = await k1.stopOrder.placeNewOrder({
			clientOid: Date.now().toString(),
			side: "sell",
			symbol:symbolTicker,
			stop: "loss",
			stopPrice: stop_price,
			price: lim_price,
			size: size_stop,
			tradeType: "MARGIN_ISOLATED_TRADE",
		});
		console.log(sl1);
		}catch(error){
			console.log(error);
		}
	} else {
		console.log("price too low");

		return "price too low";
	}
}



export {entry};




