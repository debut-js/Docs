# Debut - Trading Framework

Debut is an ecosystem for developing and launching trading strategies. An analogue of the well-known `ZenBot`, but with much more flexible possibilities for constructing strategies. All you need to do is come up with and describe the entry points to the market and connect the necessary [plugins](https://github.com/debut-js/Plugins) to work. Everything else is a matter of technology: **genetic algorithms** - will help you choose the most effective parameters for the strategy (period, stops, and others), **ticker selection module** - will help you find an asset suitable for the strategy (token or share), on which it will work best.

Debut is based on the architecture of the core and add-on plugins that allow you to flexibly customize any solution. The main goal of the entire Debut ecosystem is to simplify the process of creating and launching working trading robots on various exchanges.

## Features

<p align="center"><img src="./assets/preview.gif" width="800"></p>

- Multiple exchanges API
- Backtesting with historical data
- Backtesting results visualization
- Backtesting live preview
- Strategy optimisation (genetic algorithms, multi thread)
- Stretegy overfitting control (Walk-Forward)
- Cross timeframe candles access
- Simple working with data using callbacks e.g. [onCandle](#onCandle), [onTick](#onTick), [onDepth](#onDepth) ...
- Written in TypeScript (JavaScript), may be executed in browser
- Customizable with [plugins](https://github.com/debut-js/Plugins)
- Can use community edition for free with limitations

## Available brokers
<p>
    <img src="https://raw.githubusercontent.com/debut-js/Core/master/.github/assets/alpaca.png" alt="Alpaca API" width="64">
    <img src="https://raw.githubusercontent.com/debut-js/Core/master/.github/assets/binance.png" alt="Binance API" width="64">
    <img src="https://raw.githubusercontent.com/debut-js/Core/master/.github/assets/tinkoff.png" alt="Tinkoff API (Russia only)" width="64">
    <img src="https://raw.githubusercontent.com/debut-js/Core/master/.github/assets/ibkr.png" alt="Interactive Brokers (beta)" width="64">
</p>

Didn't see your broker? You can [donate](https://www.patreon.com/bePatron?u=57560983) for support. 

## Community edition
We believe in the power of the community! That is why we decided to publish the project. The community version is free, but it has some limitations in commercial use (income from trading startups is not commerce), as well as technical differences in testing strategies. Join the community, join the **[developer chat](https://t.me/joinchat/Acu2sbLIy_c0OWIy)**

## Enterprise edition
**(Available by [subscription](https://www.patreon.com/bePatron?u=57560983) for $20/mo)**

* Cross timeframe candles access (from lower to higher candles)
* Advanced tick emulation in backtesting (60+ ticks per candle)
* Tinkoff and Alpaca supports all timeframes (programmaticaly solved broker issue)

## Live orders streaming

We broadcast our experiments on telegram channels, where you can see our orders on cryptocurrencies and stocks.

[![Telegram crypto trading orders stream](https://badgen.net/badge/tg/crypt:stream/blue?icon=telegram)](https://t.me/debutjs)
[![Telegram stocks trading orders stream](https://badgen.net/badge/tg/stocks:stream/cyan?icon=telegram)](https://t.me/debutjs2)

Order stream schema

![](assets/order_detail.png)


**Disclaimer**

- Debut does not guarantee 100% probability of making a profit. Use it at your own peril and risk, relying on your own professionalism.
- Cryptocurrency is a global experiment, so Debut is also. That is, both can fail at any time.


## Quick Start Guide

__Step 1: Install__

Fork the [repository](https://github.com/debut-js/Strategies/) and install dependencies by `npm i`

__Step 2: Get broker API keys__
Follow broker instruction and get API access token. The access level is required only for trading, be careful when choosing access settings.

Broker API guides: [Tinkoff instructions](https://tinkoff.github.io/investAPI/token/) or
[Binance instructions](https://www.binance.com/en/support/faq/360002502072)
For interactive brokers you need to copose docker image from [this](https://github.com/extrange/ibkr-docker?tab=readme-ov-file) repo

Then create tokens file `.tokens.json` in root directory via copy and rename file `.token.example.json`. Just replace placeholders by you broker API access tokens and remove unused.

.tokens.exapmle.json listing:

```json
{
    "binance": "YOU_BINANCE_TOKEN",
    "binanceSecret": "YOU_BINANCE_SECRET",
    "tinkoff": "YOU_TINKOFF_TOKEN",
    "tinkoffAccountId": "YOU_TINKOFF_ACCOUNT",
    "alpacaKey": "YOU_ALPACA_KEY",
    "alpacaSecret": "YOU_ALPACA_SECRET"
}
```

__Step 3: Create strategy__

Execute command `npm run create` in root project directory and enter name of strategy. This command creates empty strategy file structure with next files:
* `src/strategies/{name}/bot.ts` - Main strategy file for strategy logic
* `src/strategies/{name}/cfgs.ts` - Store for strategy configuration objects
* `src/strategies/{name}/meta.ts` - Meta information for creating, optimising, backtesting and executing

Also file `schema.json` will be modified with strategy path description

__Step 4: Describe strategy__

In `bot.ts` file you can start working with strategy runtime. `MyStrategy` class for working with anything around you own trading strategy, this class extended from core `Debut` which provided runtime methods and data.


```typescript
// bot.ts file example
import { Debut } from '@debut/community-core';

// Basic strategy runtime
export class MyStrategy extends Debut {
    // this - is strategy runtime for working with broker and runtime data or methods
}
```

__Step 5: Configure strategy__
Before launching, you need to add a strategy configuration setting for the selected instrument and broker.

__Step 6: Backtesting__

Use historical simulation to evaluate the trading performance of your strategy. Backtesting can be started with the command:

```bash
npm run compile && npm run testing -- --ticker=TSLA --bot=MyStrategy --days=200 --olhc
```

For results visualisation use [Report Plugin](https://github.com/debut-js/Plugins/tree/master/packages/report)
See detailed command descriptions in [strategy tester docs](#strategy-tester)

<hr/>

# Documentation

## Runtime public methods

### registerPlugins

__Contract:__ *`this.registerPlugins(plugins: PluginInterface[]);`*

__Description:__ Register plugins. It can be called at any convenient moment, but it is recommended to register all the necessary plugins at the stage of creation in the strategy constructor or in the environment constructor in the meta file

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { DebutOptions, BaseTransport } from '@debut/types';
import { gridPlugin, GridPluginOptions, Grid, GridPluginAPI } from '@debut/plugin-grid';

export interface MyStrategyOptions extends DebutOptions, GridPluginOptions {}

export class MyStrategy extends Debut {
    declare opts: MyStrategyOptions;
    declare plugins: GridPluginAPI;

    constructor(transport: BaseTransport, opts: MyStrategyOptions) {
        super(transport, opts);

        // Register grid plugin
        this.registerPlugins(gridPlugin(opts));
    }
}
```

### start

__Contract:__ *`this.start();`*

__Description:__ When called, a subscription to ticks for the current transport (Binance / Tinkfff / Tester) will be created. In production, it creates a web socket connection to the exchange and receives updates by the ticker from the settings.

__Example:__
```typescript
    // ...
    // Take the required field from the available configurations
    const config = cfgs.TSLA;
    // Create a robot in Production mode
    const bot = await meta.create(getTransport(config), config, WorkingEnv.production);

    // Subscribe to data from the exchange in real time to work
    // Calling the start method, returns the stop function, which, when called,
    // will delete the strategy and close active positions on it
    const dispose = await bot.start();

    // Stop trading and restroy strategy instance
    dispose()
```

### getName

__Contract:__ *`this.getName();`*

__Description:__ Returns the name of the strategy constructor, in fact the name of the strategy. For various needs, for example, for logging, so that it is clear by what strategy the event occurred.

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { DebutOptions, BaseTransport } from '@debut/types';

export class MyStrategy extends Debut {
    // ...
    constructor(transport: BaseTransport, opts: DebutOptions) {
        super(transport, opts);

        // Show class constructor name
        console.log(this.getName()) // MyStrategy
    }
}
```

### createOrder

__Contract:__ *`this.createOrder(operation: OrderType): Promise<ExecutedOrder>;`*

__Description:__ Creates a trade on the market with the direction [OrderType](#ordertype)

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle, OrderType, DebutOptions } from '@debut/types';

// Basic strategy runtime
export class MyStrategy extends DebutOptions {
    // ...
    async onCandle(candle: Candle) {
        // Create order
       const order = await this.createOrder(OrderType.BUY);
    }
}

```

### closeOrder

__Contract:__ *`this.closeOrder(closing: ExecutedOrder): Promise<ExecutedOrder>;`*

__Description:__ Closes the specified application. Accepts a previously executed order as input [ExecutedOrder](#executedorder)

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle, OrderType, BaseTransport } from '@debut/types';

// Basic strategy configuration
export interface MyStrategyOptions extends DebutOptions {}

// Basic strategy runtime
export class MyStrategy extends Debut {
    // ...
    async onCandle(candle: Candle) {
        // Create order
       const order = await this.createOrder(OrderType.BUY);

        // Close order
       await this.closeOrder(order);
    }
}
```

### reduceOrder

__Contract:__ *`reduceOrder(order: ExecutedOrder | PendingOrder, reduce: number): Promise<ExecutedOrder>;`*

__Description:__ Partial close for passed `order`, second argument is `reduce` - this is how many percent are closed. For example reduce = 0.25 mean 25% of order will be closed

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle, OrderType, BaseTransport } from '@debut/types';

// Basic strategy configuration
export interface MyStrategyOptions extends DebutOptions {}

// Basic strategy runtime
export class MyStrategy extends Debut {
    // ...
    async onCandle(candle: Candle) {
        // Create order
       const order = await this.createOrder(OrderType.BUY);

        // Close 35% of order
       await this.reduceOrder(order, 0.35);
    }
}
```

### closeAll

__Contract:__ *`this.closeAll(collapse: boolean): Promise<ExecutedOrder[]>;`*

__Description:__ Sequentially closes all open positions from the `this.orders` array, returns the [ExecutedOrders](#executedorder) array of closed deals. **It has a `collapse` option that allows you to close all deals in one direction in one request to the exchange server**

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle, OrderType, BaseTransport } from '@debut/types';

// Basic strategy configuration
export interface MyStrategyOptions extends DebutOptions {}

// Basic strategy runtime
export class MyStrategy extends Debut {
    // ...
    async onCandle(candle: Candle) {
        // Create order
       const order1 = await this.createOrder(OrderType.BUY);
       const order2 = await this.createOrder(OrderType.BUY);

        // Close all orders in for loop with different requests to server
       await this.closeAll();

       // Close all order with only one request to server
       await this.closeAll(true);
    }
}
```

### learn

__Contract:__ *`this.learn(days: number): Promise<void>;`*

__Description:__ Submitting historical data to the bot as a pre-start stage. It is necessary for the bot to enter the market with these indicators and possibly open trades in order to make a smooth transition to real trades. All trades opened in the training mode will be closed safely bypassing the real balance of the broker.

__Example:__
```typescript
const bot = await meta.create(getTransport(config), config, WorkingEnv.production);
// Begin leanring with 60 days
await bot.learn(60);

// Start realtime ticks listening
await bot.start();
```

### useMajorCandle

 *(Only for Enterprise version)*

__Contract:__ *`this.useMajorCandle (timeframe: TimeFrame): void;`*

__Description:__ Creation of an aggregator of candles, which will accumulate data for the formation of candles of higher timeframes and call the corresponding hook at the end of their formation.

__Example:__

```typescript
import { Debut } from '@debut/community-core';
import { DebutOptions, BaseTransport } from '@debut/types';

export class MyStrategy extends Debut {
    // ...
    constructor(transport: BaseTransport, opts: DebutOptions) {
        super(transport, opts);

        this.useMajorCandle ('day'); // aggregator registration for daily time intervals
        this.useMajorCandle ('4h'); // aggregator registration for 4 hour intervals
    }

    /**
     * Hook to track candle closes from higher time frames
     */
    async onMajorCandle (candle: Candle, timeframe: TimeFrame) {
        console.log (candle); // {o: ..., h: ..., l: ..., c: ..., v: ..., time: ...};
        console.log (timeframe); // 'day' or '4h'

        // Update the daily indicator, for example SMA
        if (timeframe === 'day') {
            this.daySMAValue = this.daySMA.nextValue(candle.c);
        }
    }
}

```

## Runtime Data


### candles

__Property__: *`this.candles[]`*

__Description:__ Array of candles [Candle](#candle) (last 10), `this.candles[0]` - current not closed candle, `this.candles[1]` - last known closed candle.

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle } from '@debut/types';
// Basic strategy runtime
export class MyStrategy extends Debut {

    async onCandle(candle: Candle) {
        // Getting current candle (non closed candle in production mode)
        const currentCandle = this.candles[0];
        // Getting previous candle
        const prevCandle = this.candles[1];

        // Quick access to the last two candles using aliases
        this.currentCandle // Alias to this.candles[0]
        this.prevCandle // Alias to this.candles[1]

        // For current iteration, after method onCandle executed candle will moved to next position
        // And then will be available on this.candles[1]
        candle === this.candles[0] // true
    }
}

```
### orders

__Property:__ *`this.orders[]`*

__Description:__ Array of open positions [ExecutedOrder](#executedorder) in the opening order `this.orders[0]` - the first one. Deals are added synchronously to the array, first an optimistic deal is created, indicating the processing process, as soon as a response comes from the server, the deal is replaced with the original one.

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle } from '@debut/types';
// Basic strategy runtime
export class MyStrategy extends Debut {

    async onCandle(candle: Candle) {
        const currentOrder = this.orders[0];

        if (currentOrder?.type === OrderType.BUY) {
            // do something
        }
        
    }
}
```

### ordersCount

__Property:__ *`this.ordersCount`*

__Description:__ Quick access to count of opened positions

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle, OrderType } from '@debut/types';

// Basic strategy runtime
export class MyStrategy extends Debut {

    async onCandle(candle: Candle) {
        // Slow clount access
        const count = this.orders.length;

        // Fast (recommended) alias
        const count = this.ordersCount;

        // If no orders, lets open
        if (!count) {
            await this.createOrder(OrderType.BUY);
        }
    }
}
```

### plugins

__Property__: *`this.plugins`*

__Description:__ Public methods of plugins collection. The property `this.plugins` is generated automatically after [registering plugins](#public-methods). As a rule: `this.plugins[name] = PluginAPI`, where name is the unique name of the plugin.

__Example:__
```typescript
import { Debut } from '@debut/community-core';
import { Candle, OrderType, BaseTransport } from '@debut/types';
import { dynamicTakesPlugin, DynamicTakesPluginAPI, DynamicTakesPluginOptions } from '@debut/plugin-dynamic-takes';

// Basic strategy configuration
export interface MyStrategyOptions extends DebutOptions, DynamicTakesPluginOptions {}

// Basic strategy runtime
export class MyStrategy extends Debut {
    // Declare strategy configuration type
    declare opts: MyStrategyOptions;
    // Declare included plugin API type
    declare plugins: DynamicTakesPluginAPI;

     constructor(transport: BaseTransport, opts: MyStrategyOptions) {
        super(transport, opts);

        this.registerPlugins([ dynamicTakesPlugin(this.opts) ]);
    }

    async onCandle(candle: Candle) {
        // Create order
       const order = await this.createOrder(OrderType.BUY);

        let take = 0;
        let stop = 0;

        if (target === OrderType.BUY) {
            take = c + (1 + 0.5);
            stop = c * (1 - 0.1);
        } else {
            take = c * (1 - 0.5);
            stop = c * (1 + 0.1);
        }

        // Use access to plugin for set up take profit and stop loss
        this.plugins.dynamicTakes.setForOrder(order.cid, take, stop);
    }
}

```

## Hooks

### onOrderClosed

__Event name:__ One of the positions has been closed

__Hook:__ `onOrderClosed (order: ExecutedOrder, closing: ExecutedOrder): Promise<void>`

__Description:__ Implement any of these methods in the strategy, and it will be automatically called upon this or that event during the strategy operation.

### onOrderOpened

__Event name:__ Position has been opened

__Hook:__ `onOrderOpened (order: ExecutedOrder): Promise<void>`

__Description:__ The candlestick has closed and it can be processed (for example, passed to indicators):

### onCandle

__Event name:__ Current candle has been closed

__Hook:__ `onCandle(candle: Candle): Promise<void>`

__Description:__ Strategy recieve new closed candle from backtester or from broker in realtime

### onTick

__Event name:__ Market tick has been recieved

__Hook:__ `onTick (tick: Candle): Promise<void>`

__Description:__ Strategy recieve new tick in backtesting or from broker in realtime

### onDepth

__Event name:__ New depth market data has been received

__Hook:__ `onDepth(tick: Depth): Promise<void>`

__Description:__ Depth data update receved from market. Backtesting depth does not supported yet, available only in realtime

### onMajorCandle

*(Only for Enterprise version)*

__Event name:__ Candle from a higher timeframe has been closed

__Hook:__ `onMajorCandle (candle: Candle, timeframe: TimeFrame): Promise<void>`

__Description:__ New candle recieved in from higher timeframe, called in backtesting and working with realtime data

### onMajorTick

*(Only for Enterprise version)*

__Event name:__ Tick from major candles

__Hook:__ `onMajorTick (tick: Candle, timeframe: TimeFrame): Promise<void>`

__Description:__ New tick recieved in from higher timeframe, called in backtesting and working with realtime data

<hr/>

## Command Line Modules

<h3> Genetic Optimizer </h3>

It is based on the [async-genetic](https://www.npmjs.com/package/async-genetic) module of genetics, which allows you to find optimal solutions for various problems. The genetic optimizer is able to select the best parameters much more efficiently, compared to simple random enumeration of values ​​(Brutforce).

### Single **genetic**

A single call to the genetic optimizer, used to tune a strategy for optimization during development. For example, to check the correctness of the [optimization scheme](#geneticschema), other stages of creating a robot and its work during optimization as a whole.

But it can also be used as a one-time optimization on a previously known instrument, for a quick result.

Started by calling the command:
  
```bash
npm run genetic -- [...args]
```
<h4> Run options </h4>

__Parameter:__ *`--bot=...`*

__Description:__ Name of the trading robot from the file `schema.json`

__Example:__ `--bot=SpikesG`

<hr/>

__Parameter:__ *`--ticker=...`*

__Description:__ Tool for work, must be in the file `cfgs.ts`, in the directory of the strategy

__Example:__ `--ticker=AAPL`,` --ticker=BTCUSDT`

<hr/>

__Parameter:__ *`--amount=...`*

__Description:__ Initial amount for trading (from it is [equityLevel](#debutoptions)) `schema.json`

__Example:__ `--amount=500`

<hr/>

__Parameter:__ *`--days=...`*

__Description:__ Number of days to download history, if any. The loaded history is saved in the `./History` directory for reuse

__Example:__ `--days=200`

<hr/>

__Parameter:__  *`--gap=...`*

__Description:__ How many days to deviate from today before starting the history request

__Recommendations:__ Used to create a non-training interval. If we passed the `--days=150` setting and the` --gap=50` setting, then 50 days of history will be formed to run in the tester and test on untrained data, it will be enough to pass `--days=200` in the tester, then we will capture the entire training period, plus a new 50 days of indentation

__Example:__ `--gap=20`

<hr/>

__Parameter:__ *`--pop=...`*

__Description:__ Population size in the genetic algorithm (population is the number of strategies created)

__Recommendations:__ It is recommended to set the population size in the range from `100` to` 1500`, but bigger is not always better! The meaning is very individual, large populations increase the likelihood of mutations and other random phenomena. Focus on the number of generations

__Example:__ `--pop=500`

<hr/>

__Parameter:__ *`--gen=...`*

__Description:__ Number of generations in optimization

__Recommendations:__ Strength of genetics in generations, recommended values are from `10` to` 100`, more is better. However, watch out for overtraining by testing the strategy against new historical data. There is a high probability of adaptation to specific conditions of price changes, with a very large number of generations.

__Example:__ `--gen=20`

<hr/>

__Parameter:__ *`--ohlc`*

__Description:__ The mechanism is designed for closer accurate tracking of price changes. Splits each candle in history into 4 ticks.

__Example:__ `--ohlc`

<hr/>

__Parameter:__ *`--best=...`*

__Description:__ How many best results to output to the console at the end of optimization, by default `30`

__Example:__ `--best=20`

<hr/>

__Parameter:__ *`--log`*

__Description:__ Whether to output each generation statistics to the console

__Example:__ `--log`

<hr/>

__Parameter:__ *`--maxThreads`*

__Description:__ Limit cpu usage (no limits by default)

__Example:__ `--maxThreads=8`

<hr/>

__Parameter:__ *`--wfo`*

__Description:__ Use walk forward optimisation. Available values: `rolling`, `anchored`. See rolling and anchored modes description [here](https://www.dothefinancial.info/trading-systems/anchored-vs-rolling-walk-forward-analysis-wfa.html)

__Example:__ `--wfo=rolling`

<hr/>

__Parameter:__ *`--gaType`*

__Description:__ Available next values: `islands` and `classic`, Enables genetic island mode. See about it [here](https://www.researchgate.net/publication/2244494_The_Island_Model_Genetic_Algorithm_On_Separability_Population_Size_and_Convergence) 

__Example:__ `--gaType=islands`

<hr/>

__Parameter:__ *`--gaContinent`*

__Description:__ Use continent for genetical optimiser, by default false, available only when `--gaType` passed

__Example:__ `--gaContinent`


<hr/>


Run example:

```bash
npm run compile && npm run genetic -- --bot=SpikesG --ticker=CRVUSDT --days=180 --gap=20 --gen=20 --pop=100 --log --amount=500 --wfo=rolling --maxThreads=8
```


### Find tickers **finder**
This is a module for selecting a ticker for a strategy, it enumerates all available tickers for stocks from the file `./Stocks.json`, for cryptocurrency from the file`./Crypt.json`
For each ticker, genetic selection of parameters is performed in the process. As a result, you get ready-made results for each ticker. Convenient to leave overnight.

The results will be generated as reports in JSON format configuration + its statistics. Reports are stored in the folder `./public/reports/...`

Analyze the report data as follows. In the file with the name of the ticker, you will see 30 configuration options that showed the best results after genetic optimization. The json file ranks the results from top to bottom, from worst to best. The best results are always from below. The `id` field in the config allows you to establish a connection with the result, this will allow you to understand which config was selected to run.

When working, the files `stocks.json` or` crypt.json` are modified, do not forget to roll back the changes after the selection of tickers is complete.

*Run by calling the command:*
```bash
npm run finder -- [...args]
```

<h4> Run options </h4>

The main parameters are the same as for [genetic](#Single-genetic), with one difference


__Parameter:__ *`--crypt`*

__Description:__ Whether to use the file `crypt.json` for work (the default is` stocks.json` with a list of stocks)

__Example:__ `--crypt`

__Recommendations:__ The process finishes after processing one ticker, for cyclic restarts use `pm2`, below are examples of starting the ticker search process.

*Mac/Linux*
```bash
npm run compile && pm2 start finder -n instance -- --ticker=NDAQ --bot=SpikesG --amount=1000 --days=1000 --log --useTicks --pop=100 --gen=50 --wfo-rolling
```

*Windows:*
```bash
npm run compile && pm2 start node_modules/@debut/enterprise-core/lib/cli/finder.js -f -- --ticker=ZILUSDT --bot=SpikesG --amount=500 --gen=50 --pop=300 --days=180 --gap=20 --log --useTicks --crypt --wfo=rolling
```
### Strategy tester **tester**

This is a strategy testing module. It is used during development, to check the opening and closing of positions in the right places and the operation of the stregia in general. Also for creating visualizations of ready-made algorithmic strategies.

*Launched by calling the command:*
```bash
npm run testing - [... args]
```

<h4> Run Options </h4>

__Parameter:__ *`--bot=...`*

__Description:__ Name of the trading robot from the file `schema.json`

__Example:__ `--bot=SpikesG`

<hr/>

__Parameter:__ *`--ticker=...`*

__Description:__ Tool for work, must be in the file `cfgs.ts`, in the directory of the strategy

__Example:__ `--ticker=AAPL`,` --ticker=BTCUSDT`

<hr/>

__Parameter:__ *`--days=...`*

__Description:__ Number of days to download history, if any. The loaded history is saved in the `./History` directory for reuse

__Example:__ `--days=200`

<hr/>

__Parameter:__ *`--gap=...`*

__Description:__ How many days to deviate from today before starting the history request

__Recommendations:__ Used to create a non-training interval. If we passed the `--days=150` setting and the` --gap=50` setting, then 50 days of history will be formed to run in the tester and test on untrained data, it will be enough to pass `--days=200` in the tester, then we will capture the entire training period, plus a new 50 days of indentation

__Example:__ `--gap=20`

<hr/>

__Parameter:__ *`--ohlc`*

__Description:__ The mechanism is designed for closer accurate tracking of price changes. Splits each candle in history into 4 ticks.

__Example:__ `--ohlc`


*Run example:*
```bash
npm run compile && npm run testing -- --ticker=TSLA --bot=SpikesG --days=200 --olhc
```
# Plugin development
The architecture of plugins is based on the use of calls to certain functions (hereinafter hooks), in order to intercept events occurring in the system.
Some types of hooks allow you to stop events, some have a passive status without affecting what is happening. The plugin architecture should be structured in such a way as not to affect performance in the genetic optimizer.

The whole plugin is a function that returns an object containing the `name` field - this is the name of the plugin, it must be unique within the plugins used,` api` are external plugin methods for calls inside the strategy, well, the rest of the object fields are a set of hooks.

```typescript
export function pluginConstructor (): PluginInterface {
    const variable = 23;
    return {
        name: 'MyPluginName',
        api: {
            getVariable () {
                return variable;
            },
        // ... hooks
    };
}

```

# Plugin Hooks
The entire set of plugin hooks available is listed below.

## Sync hooks

### onInit

__Hook:__ *`[onInit]: () => void;`*

__Description:__ Plugin initialization, here you can create something or connect another plugin by its name using the call `this.findPlugin (name)`

### onSnapshot

__Hook:__ *`[onSnapshot]: () =>  Record<string, unknown>;`*

__Description:__ Get object from plugin to saving runtime snapshot data.

### onHydrate

__Hook:__ *`[onHydrate]: (data: Record<string, unknown>) => void;`*

__Description:__ Reviecve saved runtime snapshot data for current plugin. May be used for restoring after crush.

### onOrderUpdated

__Hook:__ *`[onOrderUpdated]: (order: PendingOrder | ExecutedOrder, changes: Partial<BaseOrder>) => void;`*

__Description:__ Order was updated. For example order position reduced.


## Skipping hooks

__Hook:__ *`[async onBeforeClose]: (order: OrderOptions, closing: ExecutedOrder) => Promise<boolean | void>;`*

__Description:__ The strategy tries to close the `closing` deal, the options for the closing deal are available as the` order` argument. The hook supports the action blocking mode if it returns `true`, in which case the trade will not be closed, but attempts to close it will continue according to the logic of the strategy.

### onBeforeOpen

__Hook:__ *`[async onBeforeOpen]: (order: OrderOptions) => Promise<boolean | void>;`*

__Description:__ The strategy tries to open a trade, trade options are available as an argument. The hook supports the action blocking mode if it returns `true`, in which case the deal will not be created.

### onBeforeTick

__Hook:__ *`[async onBeforeTick]: (tick: Candle) => Promise<boolean | void>;`*

__Description:__ Before new tick has been handled by Debut plugins can intercept candle data and prevent next execution by return `true` - mean skip tick.

## Async hooks

### onStart

__Hook:__ *`[async onStart]: () => Promise<void>;`*

__Description:__ The strategy subscribes to stock data and receives it in real time.

### onDispose

__Hook:__ *`[async onDispose]: () => Promise<void>;`*

__Description:__ The strategy unsubscribed from the exchange data and finished its work. Good opportunity to clean up plugin memory.

### onOpen

__Hook:__ *`[async onOpen]: (order: ExecutedOrder) => Promise<void>;`*

__Description:__ The deal is created, you can get it as an argument and collect the necessary data about it. At the time the hook is called, transactions in the market have already been executed.

### onClose

__Hook:__ *`[async onClose]: (order: ExecutedOrder, closing: ExecutedOrder) => Promise<void>;`*

__Description:__ The deal is closed, the deal which is closed by `closing` and the deal of which we are closed by` order` are passed as arguments. At the time the hook is called, transactions in the market have already been executed.

### onTick

__Hook:__ *`[async onTick]: (tick: Candle) => Promise<void>;`*

__Description:__ A new tick has arrived for the current candle. All ticks go to this handler. It also supports blocking the event, if it returns `true`, the tick will not be passed to the strategy. Used for example to limit trading sessions. To disconnect the strategy from the market virtually depending on the time or day of the week or the phase of the moon.

### onCandle

__Hook:__ *`[async onCandle]: (candle: Candle) => Promise<void>;`*

__Description:__ The current candle has closed. These candles are available in the `candle` argument

### onAfterCandle

__Hook:__ *`[async onAfterCandle]: (candle: Candle) => Promise<void>;`*

__Descriprion:__ The current candle has closed and the `onCandle` hooks have worked, all calculation is ready for handled candle.

### onAfterTick

__Hook:__ *`[async onAfterTick]: (tick: Candle) => Promise<void>;`*

__Descriprion:__ The current tick hass been fully handled by debut and all recalculations is ready. 

### onDepth

__Hook:__ *`[async onDepth]: (candle: Depth) => Promise<void>;`*

__Description:__ New data on the glass has been received.

### onMajorCandle

*(Only for Enterprise version)*

__Hook:__ *`[async onMajorCandle]: (tick: Candle, timeframe: TimeFrame) => Promise<void>;`*

__Description:__ A new candlestick has been formed for the higher timeframe, which was specified by the user when calling the `this.useMajorCandle ('1h');` method in the strategy implementation. Plugins can also independently invoke a subscription to use major frames using the plugin context `this.debut.useMajorCandle` or `ctx.debut.useMajorCandle ('1h'); `

### onMajorTick

*(Only for Enterprise version)*

__Hook:__ *`[async onMajorTick]: (tick: Candle, timeframe: TimeFrame) => Promise<void>;`*

__Description:__ A new tick has been formed for the higher timeframe


### Execution context

All hooks are executed in the plugin context, calls to `this.` inside any hook will be bound to the object below. All hook arguments are mutable, so be careful.

The strategy itself is available as `this.debut` and you have access to all public methods and kernel attributes.

`this.debut.orders` - a list of active deals,` this.debut.closeOrder` - will close a deal, `this.debut.opts` - will help to access the strategy settings.


Context interface
```typescript
interface PluginCtx {
    findPlugin <T extends PluginInterface> (name: string): T;
    debut: DebutCore;
}
```

## Examples
### Simple plugin
Let's consider an example of one of the simplest plugins that adds the profit to the existing balance of the strategy.

```typescript
import {PluginInterface} from '@debut/types';
import {orders} from '@debut/plugin-utils';

export function reinvestPlugin (): PluginInterface {
    // this = undefined here
    // but you can use deferred assignment like this:
    let ctx: PluginCtx;

    return {
        name: 'reinvest',

        onInit () {
            ctx = this;
        },

        async onClose (order, closing) {
            // this = PluginCtx here
            if (! order.openPrice) {
                return;
            }

            const profit = orders.getCurrencyProfit (closing, order.price) - order.commission.value;

            // this -> PluginCtx
            this.debut.opts.amount +=profit;
        },
    };
}

```

### Plugin step by step

**Create a generic plugin type and export it**
```typescript
export interface DynamicTakesPlugin extends PluginInterface {
    name: 'dynamicTakes';
    api: Methods;
}
```

**Export the type with plugin parameters to connect it to debut.opts**
```typescript
export type DynamicTakesPluginOptions = {
    trailing ?: boolean;
    ignoreTicks ?: boolean;
    maxRetryOrders ?: number;
};
```

**Separately declare the interface of public methods of the plugin (it is private, there is no export)**
```typescript
interface Methods {
    setForOrder (orderId: string, takePrice: number, stopPrice: number): void;
    getTakes (orderId: string): OrderTakes;
}
```

**Exporting the plugin API for calling via `this.plugins.dynamicTakes.setForOrder ()` from the strategy**
```typescript
export interface DynamicTakesPluginAPI {
    dynamicTakes: Methods;
}
```

* NB !: All public methods of plugins will be accessible from the strategy by calling `this.plugins [plugin name]` *


The full plugin listing is available [here](https://github.com/debut-js/Plugins/blob/master/packages/dynamic-takes/index.ts)


# Data Types **@debut/types**

Data types are located in a separate package, to install, run the command

```bash
npm i --save-dev @debut/types
```

## `Candle`

Market data presentation form. It is used both for ticks and for formed candles. Unified standard, independent of the choice of the trading platform.

```typescript
interface Candle {
    o: number;
    c: number;
    h: number;
    l: number;
    v: number;
    time: number;
}
```

## `DepthOrder`
Order data in the order book

```typescript
interface DepthOrder {
     price: number;
     qty: number;
}
```

## `Depth`
Order-book dataset

```typescript
interface Depth {
     bids: DepthOrder [];
     asks: DepthOrder [];
};
```

## `TimeFrame`
A unified timeframe format for the strategy, the list contains only supported formats.

```typescript
type TimeFrame = '1min' | '3min' | '5min' | '15min' | '30min' | '1h' | '2h' | '4h' | 'day' | 'week' | 'month';
```
## `WorkingEnv`
Runtime environment variables. It is necessary to separate all stages of production. Tk for different environments requires a different configuration of plugins and modes of operation. Tunable environment variables allow you to initialize only the mechanisms required for a given environment.

```typescript
enum WorkingEnv {
    'genetic', // strategy works in genetic optimization mode
    'tester', // the strategy works in backtesting mode
    'production', // the strategy works in real trading mode
}
```

## `DebutOptions`

Basic options for any trading strategy.

```typescript
interface DebutOptions {
    broker: 'tinkoff' | 'binance'; // Broker type
    ticker: string; // Ticker
    currency: string; // Currency
    interval: TimeFrame; // Time interval
    amount: number; // Amount for the strategy to work
    fee ?: number; // Tax for the operation in fractions
    id ?: number; // configuration id
    sandbox ?: boolean; // Is sandbox mode active or real money trading
    margin?: boolean; // Switching to margin account in binance
    instrumentType ?: 'SPOT' | 'FUTURES'; // Type of the traded instrument (for now only for binance), by default SPOT
    lotsMultiplier ?: number; // Lot multiplier, for example, if you need to make x2 or x3 purchases, by default 1
    equityLevel ?: number; // Sklko available from the total deposit for the current strategy
}
```

## `DebutMeta`
Base class for defining strategy meta information. Used in all `meta.ts` files containing meta data.

```typescript
interface DebutMeta {
    parameters: GeneticSchema; // Strategy optimization parameters
    score: (bot: DebutCore) => number; // Method for calculating efficiency in genetic optimization
    validate: (cfg: DebutOptions) => false | DebutOptions; // Validate the configuration
    stats: (bot: DebutCore) => unknown; // Method for getting statistics on a robot, any statistics plugin can be used
    create: (transport: BaseTransport, cfg: DebutOptions, env: WorkingEnv) => Promise<DebutCore>; // Strategy creation method
    ticksFilter?: (solution: DebutOptions) => (tick: Candle) => boolean; // Filtering ticks, to remove them from history during testing, also works for a geneticist
}
```

## `GeneticSchema`
An object consisting of [Descriptors](#schemadescriptor) fields, describing the ranges of the ranking of the fields and the data types in them. Used to generate random values, during mutation in a genetic algorithm, or initially to create the first random dataset.

Example:
```typescript
const parameters: GeneticSchema <SpikesGOptions> = {
    stopLoss: {min: 10, max: 30}, // float: numbers from 10 to 30 with any fractional part
    usePeaks: {bool: true}, // boolean: true or false
    bandsPeriod: {min: 10, max: 80, int: true}, // int: integers from 10 to 80
    minus: {min: -10, max: -5, int: true}, // int: negative integers from -10 to -5
};
```

## `SchemaDescriptor`
A data ranking format for randomly generating values. The `number`,` float` and `boolean` types are supported.

```typescript
type SchemaDescriptor = SchemaNumberDescriptor | SchemaBoolDescriptor;

type SchemaNumberDescriptor = {
    min: number; // initial value
    max: number; // final value
    int ?: boolean; // integer
    odd ?: boolean; // odd
};

type SchemaBoolDescriptor = {
    bool: true; // boolean
};
```

## `OrderType`
Supported deal types. * Currently only market trades are supported *

```typescript
enum OrderType {
    'BUY' = 'BUY', // Buy by market
    'SELL' = 'SELL ', // Sell by market or short, in case of no positions and margin trading is allowed
}
```
## `ExecutedOrder`

```typescript
interface ExecutedOrder {
    // Unique client generated identifier
    cid: number;
    // Selected broker for trading
    broker: string;
    // Deal type from OrderType
    type: OrderType;
    // Ticker of the instrument on the exchange
    ticker: string;
    // Time of the candle on which it was executed
    time: number;
    // Identifier of the asset on the exchange, if supported by the exchange
    figi ?: string;
    // Operation currency in which the balance is measured for example:
    // ticker XRPBTC - the transaction currency will be BTC,
    // ticker BTCUSDT - currency is USDT,
    // in case of buying shares, this is fiat for which the share will be sold.
    currency: string;
    // Timeframe of candles on which we work
    interval: TimeFrame;
    // Strategy signature (name)
    author: string;
    // Order execution price
    price: number;
    // Requested number of lots
    lots: number;
    // Lot size, for example, in Russian stocks one lot can be 1000 pieces, by default lotSize = 1
    lotSize: number;
    // Pip size (Minimum price change)
    pipSize: number;
    // Sandbox Ftag (Used in Enterprise version)
    sandbox: boolean;
    // Whether the deal is closing, that is, canceling the previously opened one.
    // For such transactions, the openId and openPrice fields will be filled
    close: boolean;
    // Opening price. Only for deals that close the position
    openPrice ?: number;
    // Identifier of the deal that created the position. For closing deals only
    openId ?: string;
    // Lot multiplier, lots were multiplied by it for purchase. Used for the convenience of working with martingale systems.
    lotsMultiplier ?: number;
    // How much money we take from the allocated strategy, the value as a percentage is calculated from the opts.amout field
    // Example: 0-1, 0 - 0%, 1 - 100%. 0.25 = 25%.
    equityLevel ?: number;
    // Whether a deal was executed in the training phase on test data
    learning ?: boolean;
    // For Binance only - whether a cross margin account was used
    margin ?: boolean;
    // For Binance only - whether a cross futures account was used
    futures ?: boolean;
    // Trade ID
    orderId: string;
    // How many lots were purchased may differ in quantity from the requested ones, due to the reasons of the exchange
    executedLots: number;
    // Commission data, commission currency and size
    commission: {currency: string; value: number};
    // Initiate the execution of transactions in the market for this deal.
    // true - network interactions have started. false - no or over
    processing ?: boolean;
}
```

## `InstrumentType`
Types of traded asset

```typescript
interface InstrumentType = 'FUTURES' | 'SPOT';
```

## `Instrument`
Trading instrument parameters.

```typescript
interface Instrument {
    // Identifier of the asset on the exchange, if supported by the exchange
    figi ?: string;
    // Ticker on the exchange
    ticker: string;
    // Point size
    pipSize ?: number;
    // Size of one lot to buy (default 1)
    lot: number;
    // With what precision the lots are indicated, for example, value 6 = 0.000001
    lotPrecision: number;
    // Instrument type (CFD, FUTURES, SPOT ...)
    type: InstrumentType;
    // Internal identifier of the Debut instrument
    id: string;
}
```
