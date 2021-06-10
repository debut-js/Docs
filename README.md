<style>
tr td:not(:nth-child(1)) {
   text-align: center;
}
</style>

# Debut
<b><a href="/ru">Switch to Russian</a><b/>

Debut is an ecosystem for developing and launching trading strategies. An analogue of the well-known `ZenBot`, but with much more flexible possibilities for constructing strategies. All you need to do is come up with and describe the entry points to the market and connect the necessary [plugins](https://github.com/debut-js/Plugins) to work. Everything else is a matter of technology: **genetic algorithms** - will help you choose the most effective parameters for the strategy (period, stops, and others), **ticker selection module** - will help you find an asset suitable for the strategy (token or share), on which it will work best.

Debut is based on the architecture of the core and add-on plugins that allow you to flexibly customize any solution. The main goal of the entire Debut ecosystem is to simplify the process of creating and launching working trading robots on various exchanges. Currently supported: **Tinkoff Investitsi** and **Binance**.

The project has two starting trading strategies "For example" how to work with the system.

An example of the strategy [SpikesG](https://github.com/debut-js/Strategies/tree/master/src/strategies/spikes-grid) in 200 days. Optimization was carried out in 180 days and 20 days of free work on untrained data.
An initial deposit of *$500* was used

<p align="center"><img src="https://github.com/debut-js/Strategies/raw/master/src/strategies/spikes-grid/img/BATUSDT.png" width="800"></p>

Strategy statistics were collected based on the [Stats plugin](https://github.com/debut-js/Plugins/tree/master/packages/stats), follow the link to learn more about the meaning of some statistics.

Visualization is done using the [Report plugin](https://github.com/debut-js/Plugins/tree/master/packages/report).

## Community edition
We believe in the power of the community! That is why we decided to publish the project. The community version is free, but it has some limitations in commercial use (income from trading startups is not commerce), as well as technical differences in testing strategies. Join the community, join the **[developer chat](https://t.me/joinchat/Acu2sbLIy_c0OWIy)**

## Enterprise edition
The Enterprise version is a ready-made set of tools for "big guys", for those who are engaged in trade services or create strategies professionally. Everything is here! And this is all ready to work for you and to increase the speed of your development.


## Live orders streaming

<p style="max-width:500px">
<iframe id="preview" style="height:500px;width:500px;" src="https://xn--r1a.website/s/debutjs"></iframe>
</p>
<table>
<thead>
<tr>
<th> Functionality </th>
<th> Community </th>
<th> Enterprise </th>
</tr>
</thead>
<tbody> <tr>
<td> Strategy Tester </td>
<td> ✅ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Emulation of OHLC ticks in the tester </td>
<td> ✅ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Search modle (finder) suitable for the strategy of assets </td>
<td> ✅ </td>
<td> ✅ </td>
</tr>
<tr>
<td> A collection of plugins from the <a href="https://github.com/debut-js/Plugins" target="_blank" rel="noopener"> collection </a> </td>
<td> ✅ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Basic set of ready-made trading strategies </td>
<td> ✅ </td>
<td> ✅ </td>
</tr>
<tr>
<td> M1 candlestick data for tick emulation </td>
<td> ❌ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Synthetic emulation of ticks in the tester (tick size no more than 0.75%) </td>
<td> ❌ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Risk Management System </td>
<td> ❌ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Work reports in <a href="https://t.me/debutjs" target="_blank" rel="noopener"> messenger </a> </td>
<td> ❌ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Ready solutions to run on VPS/VDS and Cloud servers </td>
<td> ❌ </td>
<td> ✅ </td>
</tr>
<tr>
<td> Technical Support </td>
<td> ❌ </td>
<td> ✅ </td>
</tr>
<tr>
<td> System of fast subscriptions to signals by token, for signal sales </td>
<td> ❌ </td>
<td> ✅ </td>
</tr>
</tbody> </table>

<br/>

We conduct live streaming of transactions based on Enterprise solutions in our [telegram channel](https://t.me/debutjs)

**Find out the price by sending a request to [sales@debutjs.io](mailto: sales@debutjs.io)**

**Disclaimer**

- Debut does not guarantee 100% probability of making a profit. Use it at your own peril and risk, relying on your own professionalism.
- Cryptocurrency is a global experiment, so Debut is also. That is, both can fail at any time.

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

<h5>

*`--bot=...`*

</h5>

__Description:__ Name of the trading robot from the file `schema.json`

__Example:__ `--bot=SpikesG`

<h5>

*`--ticker=...`*

</h5>

__Description:__ Tool for work, must be in the file `cfgs.ts`, in the directory of the strategy

__Example:__ `--ticker=AAPL`,` --ticker=BTCUSDT`

<h5>

*`--amount=...`*

</h5>

__Description:__ Initial amount for trading (from it is [equityLevel](#debutoptions)) `schema.json`

__Example:__ `--amount=500`

<h5>

*`--days=...`*

</h5>

__Description:__ Number of days to download history, if any. The loaded history is saved in the `./History` directory for reuse

__Example:__ `--days=200`

<h5>

*`--gap=...`*

</h5>

__Description:__ How many days to deviate from today before starting the history request

__Recommendations:__ Used to create a non-training interval. If we passed the `--days=150` setting and the` --gap=50` setting, then 50 days of history will be formed to run in the tester and test on untrained data, it will be enough to pass `--days=200` in the tester, then we will capture the entire training period, plus a new 50 days of indentation

__Example:__ `--gap=20`

<h5>

*`--pop=...`*

</h5>

__Description:__ Population size in the genetic algorithm (population is the number of strategies created)

__Recommendations:__ It is recommended to set the population size in the range from `100` to` 1500`, but bigger is not always better! The meaning is very individual, large populations increase the likelihood of mutations and other random phenomena. Focus on the number of generations

__Example:__ `--pop=500`

<h5>

*`--gen=...`*

</h5>

__Description:__ Number of generations in optimization

__Recommendations:__ Strength of genetics in generations, recommended values are from `10` to` 100`, more is better. However, watch out for overtraining by testing the strategy against new historical data. There is a high probability of adaptation to specific conditions of price changes, with a very large number of generations.

__Example:__ `--gen=20`

<h5>

*`--ohlc`*

</h5>

__Description:__ The mechanism is designed for closer accurate tracking of price changes. Splits each candle in history into 4 ticks.

__Example:__ `--ohlc`

<h5>

*`--best=...`*

</h5>

__Description:__ How many best results to output to the console at the end of optimization, by default `30`

__Example:__ `--best=20`


<h5>

*`--log`*

</h5>

__Description:__ Whether to output intermediate generation data to the console

__Recommendations:__ Use when developing strategies and testing them in genetics, or generally always.

__Example:__ `--log`


Run example:

```bash
npm run compile && npm run genetic -- --bot=SpikesG --ticker=CRVUSDT --days=180 --gap=20 --gen=20 --pop=100 --log --amount=500
```


### Find tickers **finder**
This is a module for selecting a ticker for a strategy, it enumerates all available tickers for stocks from the file `./Stocks.json`, for cryptocurrency from the file`./Crypt.json`
For each ticker, genetic selection of parameters is performed in the process. As a result, you get ready-made results for each ticker. Convenient to leave overnight.

The results will be generated as reports in JSON format configuration + its statistics. Reports are stored in the folder `./public/reports/...`
When working, the files `stocks.json` or` crypt.json` are modified, do not forget to roll back the changes after the selection of tickers is complete.

*Run by calling the command:*
```bash
npm run finder -- [...args]
```

<h4> Run options </h4>

The main parameters are the same as for [genetic](#Single-genetic), with one difference

<h5>

*`--crypt`*

</h5>

__Description:__ Whether to use the file `crypt.json` for work (the default is` stocks.json` with a list of stocks)

__Example:__ `--crypt`

__Recommendations:__ The process finishes after processing one ticker, for cyclic restarts use `pm2`, below are examples of starting the ticker search process.

*Mac/Linux*
```bash
npm run compile && pm2 start finder -n instance -- --ticker=NDAQ --bot=SpikesG --amount=1000 --days=1000 --log --useTicks --pop=100 --gen=50
```

*Windows:*
```bash
npm run compile && pm2 start node_modules/@debut/enterprise-core/lib/cli/finder.js -f -- --ticker=ZILUSDT --bot=SpikesG --amount=500 --gen=50 --pop=300 --days=180 --gap=20 --log --useTicks --crypt
```
### Strategy tester **tester**

This is a strategy testing module. It is used during development, to check the opening and closing of positions in the right places and the operation of the stregia in general. Also for creating visualizations of ready-made algorithmic strategies.

*Launched by calling the command:*
```bash
npm run testing - [... args]
```

<h4> Run Options </h4>
<h5>

*`--bot=...`*

</h5>

__Description:__ Name of the trading robot from the file `schema.json`

__Example:__ `--bot=SpikesG`

<h5>

*`--ticker=...`*

</h5>

__Description:__ Tool for work, must be in the file `cfgs.ts`, in the directory of the strategy

__Example:__ `--ticker=AAPL`,` --ticker=BTCUSDT`

<h5>

*`--days=...`*

</h5>

__Description:__ Number of days to download history, if any. The loaded history is saved in the `./History` directory for reuse

__Example:__ `--days=200`

<h5>

*`--gap=...`*

</h5>

__Description:__ How many days to deviate from today before starting the history request

__Recommendations:__ Used to create a non-training interval. If we passed the `--days=150` setting and the` --gap=50` setting, then 50 days of history will be formed to run in the tester and test on untrained data, it will be enough to pass `--days=200` in the tester, then we will capture the entire training period, plus a new 50 days of indentation

__Example:__ `--gap=20`

<h5>

*`--ohlc`*

</h5>

__Description:__ The mechanism is designed for closer accurate tracking of price changes. Splits each candle in history into 4 ticks.

__Example:__ `--ohlc`

<h5>

*Run example:*
```bash
npm run compile && npm run testing -- --ticker=TSLA --bot=SpikesG --days=200 --olhc
```
## Plugin development
The architecture of plugins is based on the use of calls to certain functions (hereinafter hooks), in order to intercept events occurring in the system.
Some types of hooks allow you to stop events, some have a passive status without affecting what is happening. The plugin architecture should be structured in such a way as not to affect performance in the genetic optimizer.

The whole plugin is a function that returns an object containing the `name` field - this is the name of the plugin, it must be unique within the plugins used,` api` are external plugin methods for calls inside the strategy, well, the rest of the object fields are a set of hooks.

```javascript
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

### Hooks
The entire set of plugin hooks available is listed below.

* `[onInit]: () => void;` *

Plugin initialization, here you can create something or connect another plugin by its name using the call `this.findPlugin (name)`

* `[async onStart]: () => Promise <void>;` *

The strategy subscribes to stock data and receives it in real time.

* `[async onDispose]: () => Promise <void>;` *

The strategy unsubscribed from the exchange data and finished its work. Good opportunity to clean up plugin memory.

* `[async onBeforeOpen]: (order: OrderOptions) => Promise <boolean | void>; `*

The strategy tries to open a trade, trade options are available as an argument. The hook supports the action blocking mode if it returns `true`, in which case the deal will not be created.

* `[async onOpen]: (order: ExecutedOrder) => Promise <void>;` *

The deal is created, you can get it as an argument and collect the necessary data about it. At the time the hook is called, transactions in the market have already been executed.

* `[async onBeforeClose]: (order: OrderOptions, closing: ExecutedOrder) => Promise <boolean | void>; `*

The strategy tries to close the `closing` deal, the options for the closing deal are available as the` order` argument. The hook supports the action blocking mode if it returns `true`, in which case the trade will not be closed, but attempts to close it will continue according to the logic of the strategy.

* `[async onClose]: (order: ExecutedOrder, closing: ExecutedOrder) => Promise <void>;` *

The deal is closed, the deal which is closed by `closing` and the deal of which we are closed by` order` are passed as arguments. At the time the hook is called, transactions in the market have already been executed.

* `[async onCandle]: (candle: Candle) => Promise <void>;` *

The current candle has closed. These candles are available in the `candle` argument

* `[async onAfterCandle]: (candle: Candle) => Promise <void>;` *

The current candle has closed and the `onCandle` hooks have worked, you can do something.

* `[async onTick]: (tick: Candle) => Promise <void>;` *

A new tick has arrived for the current candle. All ticks go to this handler. It also supports blocking the event, if it returns `true`, the tick will not be passed to the strategy. Used for example to limit trading sessions. To disconnect the strategy from the market virtually depending on the time or day of the week or the phase of the moon.


### Execution context

All hooks are executed in the plugin context, calls to `this.` inside any hook will be bound to the object below. All hook arguments are mutable, so be careful.

The strategy itself is available as `this.debut` and you have access to all public methods and kernel attributes.

`this.debut.orders` - a list of active deals,` this.debut.closeOrder` - will close a deal, `this.debut.opts` - will help to access the strategy settings.


Context interface
```javascript
interface PluginCtx {
    findPlugin <T extends PluginInterface> (name: string): T;
    debut: DebutCore;
}
```

### Examples
#### Simple plugin
Let's consider an example of one of the simplest plugins that adds the profit to the existing balance of the strategy.

```javascript
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

#### Plugin step by step

**Create a generic plugin type and export it**
```javascript
export interface DynamicTakesPlugin extends PluginInterface {
    name: 'dynamicTakes';
    api: Methods;
}
```

**Export the type with plugin parameters to connect it to debut.opts**
```javascript
export type DynamicTakesPluginOptions = {
    trailing ?: boolean;
    ignoreTicks ?: boolean;
    maxRetryOrders ?: number;
};
```

**Separately declare the interface of public methods of the plugin (it is private, there is no export)**
```javascript
interface Methods {
    setForOrder (orderId: string, takePrice: number, stopPrice: number): void;
    getTakes (orderId: string): OrderTakes;
}
```

**Exporting the plugin API for calling via `this.plugins.dynamicTakes.setForOrder ()` from the strategy**
```javascript
export interface DynamicTakesPluginAPI {
    dynamicTakes: Methods;
}
```

* NB !: All public methods of plugins will be accessible from the strategy by calling `this.plugins [plugin name]` *


The full plugin listing is available [here](https://github.com/debut-js/Plugins/blob/master/packages/dynamic-takes/index.ts)


## Data Types **@debut/types**

Data types are located in a separate package, to install, run the command

```bash
npm i --save-dev @debut/types
```

### `Candle`

Market data presentation form. It is used both for ticks and for formed candles. Unified standard, independent of the choice of the trading platform.

```javascript
interface Candle {
    o: number;
    c: number;
    h: number;
    l: number;
    v: number;
    time: number;
}
```
### `TimeFrame`
A unified timeframe format for the strategy, the list contains only supported formats.

```javascript
type TimeFrame = '1min' | '3min' | '5min' | '15min' | '30min' | '1h' | '2h' | '4h' | 'day' | 'week' | 'month';
```
### `WorkingEnv`
Runtime environment variables. It is necessary to separate all stages of production. Tk for different environments requires a different configuration of plugins and modes of operation. Tunable environment variables allow you to initialize only the mechanisms required for a given environment.

```javascript
enum WorkingEnv {
    'genetic', // strategy works in genetic optimization mode
    'tester', // the strategy works in backtesting mode
    'production', // the strategy works in real trading mode
}
```

### `DebutOptions`

Basic options for any trading strategy.

```javascript
interface DebutOptions {
    broker: 'tinkoff' | 'binance'; // Broker type
    ticker: string; // Ticker
    currency: string; // Currency
    interval: TimeFrame; // Time interval
    amount: number; // Amount for the strategy to work
    fee ?: number; // Tax for the operation in fractions
    id ?: number; // configuration id
    sandbox ?: boolean; // Is sandbox mode active or real money trading
    margin ?: boolean; // Is short trading allowed
    lotsMultiplier ?: number; // Lot multiplier, for example, if you need to make x2 or x3 purchases, by default 1
    equityLevel ?: number; // Sklko available from the total deposit for the current strategy
}
```

### `DebutMeta`
Base class for defining strategy meta information. Used in all `meta.ts` files containing meta data.

```javascript
interface DebutMeta {
    parameters: GeneticSchema; // Strategy optimization parameters
    score: (bot: DebutCore) => number; // Method for calculating efficiency in genetic optimization
    validate: (cfg: DebutOptions) => false | DebutOptions; // Validate the configuration
    stats: (bot: DebutCore) => unknown; // Method for getting statistics on a robot, any statistics plugin can be used
    create: (transport: BaseTransport, cfg: DebutOptions, env: WorkingEnv) => Promise <DebutCore>; // Strategy creation method
    ticksFilter ?: (solution: DebutOptions) => (tick: Candle) => boolean; // Filtering ticks, to remove them from history during testing, also works for a geneticist
}
```

### `GeneticSchema`
An object consisting of [Descriptors](#schemadescriptor) fields, describing the ranges of the ranking of the fields and the data types in them. Used to generate random values, during mutation in a genetic algorithm, or initially to create the first random dataset.

Example:
```javascript
const parameters: GeneticSchema <SpikesGOptions> = {
    stopLoss: {min: 10, max: 30}, // float: numbers from 10 to 30 with any fractional part
    usePeaks: {bool: true}, // boolean: true or false
    bandsPeriod: {min: 10, max: 80, int: true}, // int: integers from 10 to 80
    minus: {min: -10, max: -5, int: true}, // int: negative integers from -10 to -5
};
```

### `SchemaDescriptor`
A data ranking format for randomly generating values. The `number`,` float` and `boolean` types are supported.

```javascript
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

### `OrderType`
Supported deal types. * Currently only market trades are supported *

```javascript
enum OrderType {
    'BUY' = 'BUY', // Buy by market
    'SELL' = 'SELL ', // Sell by market or short, in case of no positions and margin trading is allowed
}
```
### `ExecutedOrder`

```javascript
interface ExecutedOrder {
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

### `Instrument`
Trading instrument parameters.

```javascript
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
}
```