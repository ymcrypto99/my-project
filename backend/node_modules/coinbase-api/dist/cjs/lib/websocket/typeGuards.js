"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCBAdvancedTradeWSEvent = isCBAdvancedTradeWSEvent;
exports.isCBExchangeWSEvent = isCBExchangeWSEvent;
exports.isCBAdvancedTradeErrorEvent = isCBAdvancedTradeErrorEvent;
exports.isCBExchangeWSRequestOperation = isCBExchangeWSRequestOperation;
exports.isCBINTXWSRequestOperation = isCBINTXWSRequestOperation;
exports.isCBPrimeWSRequestOperation = isCBPrimeWSRequestOperation;
const websocket_util_js_1 = require("./websocket-util.js");
function isDefinedObject(value) {
    return typeof value === 'object' || !value;
}
function isCBAdvancedTradeWSEvent(event) {
    if (!isDefinedObject(event)) {
        return false;
    }
    const message = event;
    return typeof message.channel === 'string';
}
/**
 * Type guard that checks whether this event is/extends CBExchangeBaseEvent
 */
function isCBExchangeWSEvent(event, wsKey) {
    if (!isDefinedObject(event)) {
        return false;
    }
    return (wsKey === websocket_util_js_1.WS_KEY_MAP.exchangeMarketData ||
        wsKey === websocket_util_js_1.WS_KEY_MAP.exchangeDirectMarketData);
}
/**
 * Type guard for error-type response events seen for the Advnaced Trade WS channel
 */
function isCBAdvancedTradeErrorEvent(event) {
    if (!isDefinedObject(event)) {
        return false;
    }
    const message = event;
    return message.type === 'error';
}
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
function isCBExchangeWSRequestOperation(evt, wsKey) {
    if (!isDefinedObject(evt)) {
        return false;
    }
    const looselyTypedEvent = evt;
    if (typeof looselyTypedEvent.type !== 'string' ||
        !Array.isArray(looselyTypedEvent.channels)) {
        return false;
    }
    return (wsKey === websocket_util_js_1.WS_KEY_MAP.exchangeDirectMarketData ||
        wsKey === websocket_util_js_1.WS_KEY_MAP.exchangeMarketData);
}
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
function isCBINTXWSRequestOperation(evt, wsKey) {
    if (!isDefinedObject(evt)) {
        return false;
    }
    const looselyTypedEvent = evt;
    if (typeof looselyTypedEvent.type !== 'string' ||
        !Array.isArray(looselyTypedEvent.channels)) {
        return false;
    }
    return wsKey === websocket_util_js_1.WS_KEY_MAP.internationalMarketData;
}
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
function isCBPrimeWSRequestOperation(evt, wsKey) {
    if (!isDefinedObject(evt)) {
        return false;
    }
    const looselyTypedEvent = evt;
    if (typeof looselyTypedEvent.type !== 'string' ||
        typeof looselyTypedEvent.channel !== 'string') {
        return false;
    }
    return wsKey === websocket_util_js_1.WS_KEY_MAP.internationalMarketData;
}
//# sourceMappingURL=typeGuards.js.map