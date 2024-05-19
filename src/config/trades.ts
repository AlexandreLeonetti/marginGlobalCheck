export const tradeParams = {
	BINANCE: [
		{
			name : "BCHUSDT",
			size : 0.2,
			stop : 0.005,
			limit: 0.01,
			minPrice:460
		},
		{
			name : "BNBUSDT",
			size : 0.25,
			stop : 0.003,
			limit: 0.005,
			minPrice:615
		},
		{
			name: "BTCUSDT",
			size: 0.005,
			stop: 0.003,
			limit: 0.004,
			minPrice: 64000,
		},
		{
			name: "BTCUSDC",
			size: 0.005,
			stop: 0.003,
			limit: 0.004,
			minPrice: 64000,
		},
		{
			name: "BTCFDUSD",
			size: 0.005,
			stop: 0.003,
			limit: 0.004,
			minPrice: 64000,
		},
		{
			name: "BTCTUSD",
			size: 0.005,
			stop: 0.003,
			limit: 0.004,
			minPrice: 64000,
		},
		{
			name : "DOGEFDUSD",
			size : 1000,
			stop : 0.003,
			limit: 0.005,
			minPrice: 0.156
		},
		{
			name:"ETHUSDT",
			size:0.035,
			stop:0.003,
			limit:0.005,
			minPrice:3100
		},
		{
			name : "PAXGUSDT",
			size : 0.05,
			stop : 0.01,
			limit: 0.012,
			minPrice:2400
		},
		{
			name:"PEPEUSDT",
			size:20000000,
			stop:0.01,
			limit:0.015,
			minPrice:0.000011
		},
		{
			name:"SOLUSDT",
			size:1,
			stop:0.007,
			limit:0.01,
			minPrice:153
		},
		{
			name:"UNIUSDT",
			size:20,
			stop :0.003,
			limit:0.005,
			minPrice:7.6
		},
		{
			name: "WIFUSDC",
			size: 10,
			stop: 0.005,
			limit: 0.007,
			minPrice: 3.5,
		},
	],
	KUCOIN: [
        	{
	            name: "BTC-USDT",
	            size: 0.005,
	            stop:0.003,
	            limit:0.004,
	            minPrice:64000
	        },
	        {
	            name: "WIF-USDT",
	            size: 10,
	            stop:0.005,
	            limit: 0.007,
	            minPrice: 3.5
	        },
		{
			name: "TON-USDT",
			size : 3,
			stop: 0.01,
			limit:0.015,
			minPrice:6.9
		}
    ],
};
