import { CBAdvancedTradeErrorEvent, CBAdvancedTradeEvent, CBExchangeBaseEvent } from '../../types/websockets/events.js';
import { WsExchangeRequestOperation, WsInternationalRequestOperation, WsPrimeRequestOperation } from '../../types/websockets/requests.js';
import { WsKey } from './websocket-util.js';
export declare function isCBAdvancedTradeWSEvent(event: unknown): event is CBAdvancedTradeEvent;
/**
 * Type guard that checks whether this event is/extends CBExchangeBaseEvent
 */
export declare function isCBExchangeWSEvent(event: unknown, wsKey: WsKey): event is CBExchangeBaseEvent;
/**
 * Type guard for error-type response events seen for the Advnaced Trade WS channel
 */
export declare function isCBAdvancedTradeErrorEvent(event: unknown): event is CBAdvancedTradeErrorEvent;
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
export declare function isCBExchangeWSRequestOperation<TWSTopic extends string = string>(evt: unknown, wsKey: WsKey): evt is WsExchangeRequestOperation<TWSTopic>;
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
export declare function isCBINTXWSRequestOperation<TWSTopic extends string = string>(evt: unknown, wsKey: WsKey): evt is WsInternationalRequestOperation<TWSTopic>;
/**
 * Silly type guard for the structure of events being sent to the server
 * (e.g. when subscribing to a topic)
 */
export declare function isCBPrimeWSRequestOperation<TWSTopic extends string = string>(evt: unknown, wsKey: WsKey): evt is WsPrimeRequestOperation<TWSTopic>;
