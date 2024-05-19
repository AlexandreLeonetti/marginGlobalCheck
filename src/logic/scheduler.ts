import { strat as entryBinance } from "./entryBinance";
import { entry as entryKucoin } from "./entryKucoin";
import { sleep } from "@leonetti/utils";

/*
export class Scheduler {
	private cronJobs: Map<string, nc.ScheduledTask>;

	constructor() {
		this.cronJobs = new Map();
	}

	scheduleJob(cronTime: string, callback: () => void): void {
		const job = nc.schedule(cronTime, callback);
		this.cronJobs.set(cronTime, job);
	}

	unscheduleJob(cronTime: string): void {
		const job = this.cronJobs.get(cronTime);
		if (job) {
			(job as any).destroy();
			this.cronJobs.delete(cronTime);
		}
	}
}
*/

export class TradingAction {
	static execute(pair: string, exchange: string ): void {
	  let res;
	  switch (exchange) {
		case "BINANCE":
		  res = entryBinance(pair);
		  break;
		case "KUCOIN":
		  res = entryKucoin(pair);
		  break;
		default:
		  console.error("Unknown exchange:", exchange);
		  break;
	  }
	}
}
export async function TradingEntry(pair: string, exchange: string): Promise<void> {
	let res;
	switch (exchange) {
		case "BINANCE":
			res = await entryBinance(pair);
			break;
		case "KUCOIN":
			res = await entryKucoin(pair);
			break;
		default:
			console.error("Unknown exchange:", exchange);
			break;
	}
}



/* new forming sequential event */

export interface InterfaceParam {
    time:boolean[];
    ticker:string;
    exchange:string;//"BINANCE"|"KUCOIN";
}


function getNextHour() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const nextHour = (currentHour + 1) % 24;
    return nextHour;
}

async function apiCall(params:InterfaceParam){
	// do async api calls.
	// call binance entry or kucoin entry.
    let pair = params.ticker;
    let exchange= params.exchange;
    await TradingEntry(pair, exchange);
    await sleep(1000);
	return;
}


async function sequencialCall(list: InterfaceParam[]){
	/* execute list of async tasks sequentially with 500ms interval between each */
	for(const element of list ){
		let x = await apiCall(element);
	}
}

export function checkAndExecuteFunctions(tasks:InterfaceParam[]) {

	const currentHour = getNextHour();
	const resultingListOfTasks = [];

	for (let i = 0; i < tasks.length; i++) {
		const task = tasks[i];
		if (task.time[currentHour] == true) {
			console.log("execution");
			resultingListOfTasks.push(task);
		} else {
			console.log("not the time to execute");
			//resultingListOfTasks.push(task);// TO BE DELETED
		}
	}

	/* build a sequencial API call function out of the new list of tasks. */
	sequencialCall(resultingListOfTasks);
	return resultingListOfTasks;
}
