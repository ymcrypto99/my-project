import { BaseWebsocketClient, EmittableEvent } from './lib/BaseWSClient.js';
import { MessageEventLike, WsKey, WsTopicRequest } from './lib/websocket/websocket-util.js';
import { WSConnectedResult } from './lib/websocket/WsStore.types.js';
import { WsMarket } from './types/websockets/client.js';
import { WsOperation } from './types/websockets/requests.js';
import { WsAPITopicRequestParamMap, WsAPITopicResponseMap, WsAPIWsKeyTopicMap } from './types/websockets/wsAPI.js';
export declare const WS_LOGGER_CATEGORY: {
    category: string;
};
/**
 * Any WS keys in this list will ALWAYS skip the authentication process, even if credentials are available
 */
export declare const PUBLIC_WS_KEYS: WsKey[];
/**
 * WS topics are always a string for this exchange. Some exchanges use complex objects.
 */
type WsTopic = string;
export declare class WebsocketClient extends BaseWebsocketClient<WsKey> {
    /**
     * Request connection of all dependent (public & private) websockets, instead of waiting for automatic connection by library
     */
    connectAll(): Promise<(WSConnectedResult | undefined)[]>;
    /**
     * Request subscription to one or more topics. Pass topics as either an array of strings, or array of objects (if the topic has parameters).
     * Objects should be formatted as {topic: string, params: object}.
     *
     * - Subscriptions are automatically routed to the correct websocket connection.
     * - Authentication/connection is automatic.
     * - Resubscribe after network issues is automatic.
     *
     * Call `unsubscribe(topics)` to remove topics
     */
    subscribe(requests: (WsTopicRequest<WsTopic> | WsTopic) | (WsTopicRequest<WsTopic> | WsTopic)[], wsKey: WsKey): void;
    /**
     * Unsubscribe from one or more topics. Similar to subscribe() but in reverse.
     *
     * - Requests are automatically routed to the correct websocket connection.
     * - These topics will be removed from the topic cache, so they won't be subscribed to again.
     */
    unsubscribe(requests: (WsTopicRequest<WsTopic> | WsTopic) | (WsTopicRequest<WsTopic> | WsTopic)[], wsKey: WsKey): void;
    /**
     * Not supported by this exchange, do not use
     */
    sendWSAPIRequest<TWSKey extends keyof WsAPIWsKeyTopicMap, TWSChannel extends WsAPIWsKeyTopicMap[TWSKey] = WsAPIWsKeyTopicMap[TWSKey], TWSParams extends WsAPITopicRequestParamMap[TWSChannel] = WsAPITopicRequestParamMap[TWSChannel], TWSAPIResponse extends WsAPITopicResponseMap[TWSChannel] | object = WsAPITopicResponseMap[TWSChannel]>(wsKey: TWSKey, channel: TWSChannel, ...params: TWSParams extends undefined ? [] : [TWSParams]): Promise<TWSAPIResponse>;
    /**
     *
     * Internal methods
     *
     */
    /**
     * Return a websocket URL, which is connected to as-is.
     * If a token or anything else is needed in the URL, this is a good place to add it.
     */
    protected getWsUrl(wsKey: WsKey): Promise<string>;
    protected sendPingEvent(wsKey: WsKey): void;
    protected sendPongEvent(wsKey: WsKey): void;
    protected isWsPing(msg: any): boolean;
    protected isWsPong(msg: any): boolean;
    protected resolveEmittableEvents(wsKey: WsKey, event: MessageEventLike): EmittableEvent[];
    /**
     * Determines if a topic is for a private channel, using a hardcoded list of strings
     */
    protected isPrivateTopicRequest(request: WsTopicRequest<string>, wsKey: WsKey): boolean;
    protected getWsKeyForMarket(market: WsMarket, isPrivate: boolean): WsKey;
    protected getWsMarketForWsKey(wsKey: WsKey): WsMarket;
    protected getPrivateWSKeys(): WsKey[];
    /** Force subscription requests to be sent in smaller batches, if a number is returned */
    protected getMaxTopicsPerSubscribeEvent(wsKey: WsKey): number | null;
    /**
     * Map one or more topics into fully prepared "subscribe request" events (already stringified and ready to send)
     */
    protected getWsOperationEventsForTopics(topicRequests: WsTopicRequest<string>[], wsKey: WsKey, operation: WsOperation): Promise<string[]>;
    /**
     * Events are signed per-request, so this function isn't needed for Coinbase.
     */
    protected getWsAuthRequestEvent(wsKey: WsKey): Promise<object>;
}
export {};
