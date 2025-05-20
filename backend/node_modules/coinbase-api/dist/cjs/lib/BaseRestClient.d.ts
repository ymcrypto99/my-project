import { AxiosRequestConfig } from 'axios';
import { CloseAdvTradePositionRequest, SubmitAdvTradeOrderRequest } from '../types/request/advanced-trade-client.js';
import { SubmitCBExchOrderRequest } from '../types/request/coinbase-exchange.js';
import { SubmitINTXOrderRequest } from '../types/request/coinbase-international.js';
import { SubmitPrimeOrderRequest } from '../types/request/coinbase-prime.js';
import { CustomOrderIdProperty } from '../types/shared.types.js';
import { RestClientOptions, RestClientType } from './requestUtils.js';
/**
 * Some requests require some params to be in the query string, some in the body, some even in the headers.
 * This type anticipates either are possible in any combination.
 *
 * The request builder will automatically handle where parameters should go.
 */
type ParamsInRequest = {
    query?: object;
    body?: object;
    headers?: object;
};
export declare abstract class BaseRestClient {
    private options;
    private baseUrl;
    private globalRequestOptions;
    private apiKey;
    private apiSecret;
    private apiPassphrase;
    /** Defines the client type (affecting how requests & signatures behave) */
    abstract getClientType(): RestClientType;
    /**
     * Create an instance of the REST client. Pass API credentials in the object in the first parameter.
     * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
     * @param {AxiosRequestConfig} [networkOptions={}] HTTP networking options for axios
     */
    constructor(restClientOptions?: RestClientOptions, networkOptions?: AxiosRequestConfig);
    /**
     * Timestamp used to sign the request. Override this method to implement your own timestamp/sync mechanism
     */
    getSignTimestampMs(): number;
    get(endpoint: string, params?: object): Promise<any>;
    post(endpoint: string, params?: ParamsInRequest): Promise<any>;
    getPrivate(endpoint: string, params?: object): Promise<any>;
    postPrivate(endpoint: string, params?: ParamsInRequest): Promise<any>;
    deletePrivate(endpoint: string, params?: ParamsInRequest): Promise<any>;
    putPrivate(endpoint: string, params?: ParamsInRequest): Promise<any>;
    patchPrivate(endpoint: string, params?: ParamsInRequest): Promise<any>;
    /**
     * @private Make a HTTP request to a specific endpoint. Private endpoint API calls are automatically signed.
     */
    private _call;
    generateNewOrderId(): string;
    /**
     * Validate syntax meets requirements set by coinbase. Log warning if not.
     */
    protected validateOrderId(params: SubmitAdvTradeOrderRequest | CloseAdvTradePositionRequest | SubmitCBExchOrderRequest | SubmitINTXOrderRequest | SubmitPrimeOrderRequest, orderIdProperty: CustomOrderIdProperty): void;
    /**
     * @private generic handler to parse request exceptions
     */
    parseException(e: any, requestParams: any): unknown;
    /**
     * @private sign request and set recv window
     */
    private signRequest;
    private prepareSignParams;
    /** Returns an axios request object. Handles signing process automatically if this is a private API call */
    private buildRequest;
}
export {};
