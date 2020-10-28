# Crypto Currency Tracker

The application for [APIs](https://binance-docs.github.io/apidocs) of [Binance](https://www.binance.com/en). It logs on terminal all non zero asset balances available on an account and 10 pairs of currencies from trading with the highest volume in the last 24 hours in the SPOT exchange.

User data is kept updating by refreshing the required key. All sockets will cease after 24 hours and the application needs a restart.

The latency is updated when new data arrives instead of 1 minute intervals.

Prerequisites

* Node.js version 12.x LTS

## Setup, Running And Testing

Generate keys. More information at [the testnet](https://testnet.binance.vision/).

Set environment variables.

```bash
BINANCE_API_KEY=<my key from binance>
BINANCE_SECRET_KEY=<my secret from binance>
```

Install dependencies.

```bash
# Install dependencies
npm install
```

Running and testing.

```bash
# Run the application
npm start

# Run the unit tests
npm test
```

## Structure

**Folders**

The folders on root level are divided by context: scripts are related to running and src to the application itself. In the src folder there are common and lib folders for shared files, and other folders are named by their feature following the duck [style](https://www.freecodecamp.org/news/scaling-your-redux-app-with-ducks-6115955638be/).

* scripts - Bash scripts used in the project
* src - Application source code
  * main.js - the root file
  * common - shared application specific files
  * lib - js utils and tools which are more general than common
  * all other folders - feature modules of the application

If folder contains 10 or more source files with including their test files the files should be split in suitable sub folders. We can hold in average 7 things in our mind simultaneously and anything more starts to cause unnecessary burden and use of energy.  And it might be hard at 7 files to know a good way to create sub folders.

**Files**

Files and folders are named using kebab case: ```this-is-a-long-file-name.js``` and ```short.js```.

Files ending with ```.test.js``` are unit tests and are located in the same folder their target. Files for application are named ```name.js```.

## Todo

* Write more tests and whilst doing it split application into more usable modules.
* User Data does not update, and it seams there are no events happening. The user data update functionality is there, and so it is not tested. I could have send some value updates and test the functionality by myself. Possibly?
* Refresh sockets before they expire 24 hours after creation.
* Document exposed functions from modules.
* Learn the taxonomy of crypto currencies (would have helped a lot to have prior knowledge. I'm pretty happy with my new found wisdom on the topic!)

## Bugs

* Fix: terminal cursor sometimes breaks when exiting the app. (Quick fix for OSX: write ```reset`` on terminal.)
* Oooops! The app will crash after 5 or so mins.
  * I used npm package ```terminal-kit``` which seems to cause a total crash of the application: ```FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory```.
  * After quick research with ```node inspect``` I am pretty sure about the error's origin.
  * Sorry people, I can't put more time for this. Normally, I would fix this by:
    * researching deeper the current library and its indented usage
    * using another library
    * or finding a different approach
