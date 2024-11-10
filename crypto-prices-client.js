import WebSocket from "ws";
import ReconnectingWebSocket from "./assets/js/reconnecting-websocket.mjs";

import {
  HOST,
  PORT,
  CRYPTO_ID,
  CRYPTO_CUR,
} from "./Constants/API_DB_Constants.js";

let LOCAL_WSC = null,
  BINANCE_WSC = null;

/*
export const connectBinanceAndLocalWSS = function () {
  // #######################################################
  // --- in ws package once new WebSocket() is called --> a connection with
  //---- the server is set no need to explicitly call connect or something

  //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
  //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+[ Declaring the two clients ]=+=+=++=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
  const BINANCE_WSC = new WebSocket(
    "wss://stream.binance.com:9443/stream?streams=btcusdt@kline_3m/ethusdt@kline_3m/bnbusdt@kline_3m/solusdt@kline_3m/ltcusdt@kline_3m"
  );
  const LOCAL_WSC = new WebSocket(`ws://${HOST}:${PORT}`);
  //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
  //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

  BINANCE_WSC.on("open", () => {
    console.log("Connected to BINANCE_WSC");
  });

  BINANCE_WSC.on("message", (message) => {
    if (LOCAL_WSC.readyState !== WebSocket.CLOSING || LOCAL_WSC.readyState !== WebSocket.CLOSED) {
      LOCAL_WSC.send(message);
    }
  });

  BINANCE_WSC.on("close", () => {
    console.log("Disconnected from BINANCE_WSC");
  });

  //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

  LOCAL_WSC.on("open", () => {
    console.log("Connected to LOCAL_WSC");
  });

  LOCAL_WSC.on("message", (message) => {
    // nothing
  });

  LOCAL_WSC.on("close", () => {
    console.log("Disconnected LOCAL_WSC");
  });

  //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
  //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
};
*/

/*
[  readyState property values ]
CONNECTING 0 The connection is not yet open.
OPEN       1 The connection is open and ready to communicate.
CLOSING    2 The connection is in the process of closing.
CLOSED     3 The connection is closed or couldn't be opened.

*/

export const connectLocalWSS = () => {
  LOCAL_WSC = new ReconnectingWebSocket(
    `ws://${HOST}:${PORT}/?id=${CRYPTO_ID}`,
    [],
    {
      WebSocket: WebSocket,

      maxReconnectionDelay: 10000,
      minReconnectionDelay: 6000,
      connectionTimeout: 5000,
    }
  );

  LOCAL_WSC.onopen = (event) => {
    console.log("Connected to LOCAL_WSC");
  };

  LOCAL_WSC.onmessage = (event) => {
    // nothing
  };
  LOCAL_WSC.onclose = (event) => {
    console.log("Disconnected LOCAL_WSC");
  };
};

export const connectBinance = () => {
  let assets = CRYPTO_CUR.map((v) => v.toLowerCase().concat("@kline_3m")).join(
    "/"
  );

  BINANCE_WSC = new ReconnectingWebSocket(
    `wss://stream.binance.com:9443/stream?streams=${assets}`,
    [],
    {
      WebSocket: WebSocket,
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 6000,
      connectionTimeout: 5000,
    }
  );

  BINANCE_WSC.onopen = (event) => {
    // console.log("Connected to BINANCE_WSC");
  };

  BINANCE_WSC.onmessage = (event) => {
    if (
      LOCAL_WSC != null &&
      (LOCAL_WSC.readyState !== WebSocket.CLOSING ||
        LOCAL_WSC.readyState !== WebSocket.CLOSED)
    ) {
      LOCAL_WSC.send(event.data);
    }
  };

  //-- important -----
  BINANCE_WSC.onerror = (event) => {
    // nothing
  };

  BINANCE_WSC.onclose = (event) => {
    // console.log("Disconnected BINANCE_WSC");
  };
};
