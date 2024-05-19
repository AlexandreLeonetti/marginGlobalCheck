"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndExecuteFunctions = exports.TradingEntry = exports.TradingAction = void 0;
const entryBinance_1 = require("./entryBinance");
const entryKucoin_1 = require("./entryKucoin");
const utils_1 = require("@leonetti/utils");
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
class TradingAction {
    static execute(pair, exchange) {
        let res;
        switch (exchange) {
            case "BINANCE":
                res = (0, entryBinance_1.strat)(pair);
                break;
            case "KUCOIN":
                res = (0, entryKucoin_1.entry)(pair);
                break;
            default:
                console.error("Unknown exchange:", exchange);
                break;
        }
    }
}
exports.TradingAction = TradingAction;
async function TradingEntry(pair, exchange) {
    let res;
    switch (exchange) {
        case "BINANCE":
            res = await (0, entryBinance_1.strat)(pair);
            break;
        case "KUCOIN":
            res = await (0, entryKucoin_1.entry)(pair);
            break;
        default:
            console.error("Unknown exchange:", exchange);
            break;
    }
}
exports.TradingEntry = TradingEntry;
function getNextHour() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const nextHour = (currentHour + 1) % 24;
    return nextHour;
}
async function apiCall(params) {
    // do async api calls.
    // call binance entry or kucoin entry.
    let pair = params.ticker;
    let exchange = params.exchange;
    await TradingEntry(pair, exchange);
    await (0, utils_1.sleep)(1000);
    return;
}
async function sequencialCall(list) {
    /* execute list of async tasks sequentially with 500ms interval between each */
    for (const element of list) {
        let x = await apiCall(element);
    }
}
function checkAndExecuteFunctions(tasks) {
    const currentHour = getNextHour();
    const resultingListOfTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.time[currentHour] == true) {
            console.log("execution");
            resultingListOfTasks.push(task);
        }
        else {
            console.log("not the time to execute");
            //resultingListOfTasks.push(task);// TO BE DELETED
        }
    }
    /* build a sequencial API call function out of the new list of tasks. */
    sequencialCall(resultingListOfTasks);
    return resultingListOfTasks;
}
exports.checkAndExecuteFunctions = checkAndExecuteFunctions;
