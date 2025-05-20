import { WS_KEY_MAP } from './websocket-util.js';
function isDefinedObject(value) {
    return typeof value === 'object' || !value;
}
export function isCBAdvancedTradeWSEvent(event) {
    if (!isDefinedObject(event)) {
        return false;
    }
    const message = event;
    return typeof message.channel === 'string';
}
/**
 * Type guard that checks whether this event is/extends CBExchangeBaseEvent
 */
export function isCBExchangeWSEvent(event, wsKey) {
    if (!isDefinedObject(event)) {
        return false;
    }
    return (wsKey === WS_KEY_MAP.exchangeMarketData ||
        wsKey === WS_KEY_MAP.exchangeDirectMarketData);
}
/**
 * Type guard for error-type response events seen for the Advnaced Trade WS channel
 */
export function isCBAdvancedTradeErrorEvent(event) {
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
export function isCBExchangeWSRequestOperation(evt, wsKey) {
    if (!isDefinedObject(evt)) {
        return false;
    }
    const looselyTypedEvent = evt;
    if (typeof looselyTypedEvent.type !== 'string' ||
        !Array.isArray(looselyTypedEvent.channels)) {
        return false;
    }
    return (wsKey === WS_KEY_MAP.exchangeDirectMarketData ||
        wsKey === WS_KEY_MAP.exchangeMarketData);
}
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
export function isCBINTXWSRequestOperation(evt, wsKey) {
    if (!isDefinedObject(evt)) {
        return false;
    }
    const looselyTypedEvent = evt;
    if (typeof looselyTypedEvent.type !== 'string' ||
        !Array.isArray(looselyTypedEvent.channels)) {
        return false;
    }
    return wsKey === WS_KEY_MAP.internationalMarketData;
}
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
export function isCBPrimeWSRequestOperation(evt, wsKey) {
    if (!isDefinedObject(evt)) {
        return false;
    }
    const looselyTypedEvent = evt;
    if (typeof looselyTypedEvent.type !== 'string' ||
        typeof looselyTypedEvent.channel !== 'string') {
        return false;
    }
    return wsKey === WS_KEY_MAP.internationalMarketData;
}
//# sourceMappingURL=typeGuards.js.map