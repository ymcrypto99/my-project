import { AxiosRequestConfig } from 'axios';
import { BaseRestClient } from './lib/BaseRestClient.js';
import { RestClientOptions, RestClientType } from './lib/requestUtils.js';
import { AllocateAdvTradePortfolioRequest, CloseAdvTradePositionRequest, GetAdvTradeFillsRequest, GetAdvTradeMarketTradesRequest, GetAdvTradeOrdersRequest, GetAdvTradeProductCandlesRequest, GetAdvTradeProductsRequest, GetAdvTradePublicMarketTradesRequest, GetAdvTradePublicProductCandlesRequest, GetAdvTradePublicProductsRequest, GetAdvTradeTransactionSummaryRequest, MoveAdvTradePortfolioFundsRequest, PreviewAdvTradeOrderRequest, SubmitAdvTradeConvertQuoteRequest, SubmitAdvTradeOrderRequest } from './types/request/advanced-trade-client.js';
import { AdvTradeAccount, AdvTradeAccountsList, AdvTradeApiKeyPermissions, AdvTradeCancelOrdersResponse, AdvTradeCandle, AdvTradeClosePositionResponse, AdvTradeCurrentMarginWindow, AdvTradeEditOrderPreviewResponse, AdvTradeEditOrderResponse, AdvTradeFill, AdvTradeFuturesBalance, AdvTradeFuturesPosition, AdvTradeFuturesSweep, AdvTradeMarketTrades, AdvTradeOrder, AdvTradeOrderPreview, AdvTradePaymentMethod, AdvTradePerpetualsPortfolio, AdvTradePerpetualsPosition, AdvTradePerpetualsPositionSummary, AdvTradePortfolio, AdvTradePortfolioBalance, AdvTradePortfolioBreakdown, AdvTradePricebook, AdvTradeProduct, AdvTradePublicProduct, AdvTradeSubmitOrderResponse, AdvTradeTransactionSummary } from './types/response/advanced-trade-client.js';
/**
 * REST client for Coinbase's Advanced Trade API:
 * https://docs.cdp.coinbase.com/advanced-trade/docs/api-overview/
 */
export declare class CBAdvancedTradeClient extends BaseRestClient {
    constructor(restClientOptions?: RestClientOptions, requestOptions?: AxiosRequestConfig);
    /**
     *
     * Custom SDK functions
     *
     */
    /**
     * This method is used to get the latency and time sync between the client and the server.
     * This is not official API endpoint and is only used for internal testing purposes.
     * Use this method to check the latency and time sync between the client and the server.
     * Final values might vary slightly, but it should be within few ms difference.
     * If you have any suggestions or improvements to this measurement, please create an issue or pull request on GitHub.
     */
    fetchLatencySummary(): Promise<any>;
    getClientType(): RestClientType;
    /**
     *
     * Account Endpoints
     *
     */
    /**
     * List Accounts
     *
     * Get a list of authenticated accounts for the current user.
     */
    getAccounts(params?: {
        limit?: number;
        cursor?: string;
        retail_portfolio_id?: string;
    }): Promise<AdvTradeAccountsList>;
    /**
     * Get Account
     *
     * Get a list of information about single account, given an account UUID.
     * Tip: Use List Accounts (getAccounts funcion) to find account UUIDs.
     */
    getAccount(params: {
        account_id: string;
    }): Promise<{
        account: AdvTradeAccount;
    }>;
    /**
     *
     * Products Endpoints
     *
     */
    /**
     * Get Best Bid/Ask
     *
     * Get the best bid/ask for all products. A subset of all products can be returned instead by using the product_ids input.
     */
    getBestBidAsk(params?: {
        product_ids?: string[];
    }): Promise<{
        pricebooks: AdvTradePricebook[];
    }>;
    /**
     * Get Product Book
     *
     * Get a list of bids/asks for a single product. The amount of detail shown can be customized with the limit parameter.
     */
    getProductBook(params: {
        product_id: string;
        limit?: number;
        aggregation_price_increment?: string;
    }): Promise<{
        pricebook: AdvTradePricebook;
    }>;
    /**
     * List Products
     *
     * Get a list of the available currency pairs for trading.
     *
     */
    getProducts(params?: GetAdvTradeProductsRequest): Promise<{
        products: AdvTradeProduct[];
        num_products: number;
    }>;
    /**
     * Get Product
     *
     * Get information on a single product by product ID.
     */
    getProduct(params: {
        product_id: string;
        get_tradability_status?: boolean;
    }): Promise<AdvTradeProduct>;
    /**
     * Get Product Candles
     *
     * Get rates for a single product by product ID, grouped in buckets.
     */
    getProductCandles(params: GetAdvTradeProductCandlesRequest): Promise<{
        candles: AdvTradeCandle[];
    }>;
    /**
     * Get Market Trades
     *
     * Get snapshot information by product ID about the last trades (ticks) and best bid/ask.
     */
    getMarketTrades(params: GetAdvTradeMarketTradesRequest): Promise<AdvTradeMarketTrades>;
    /**
     *
     * Orders Endpoints
     *
     */
    /**
     * Create Order
     *
     * Create an order with a specified product_id (asset-pair), side (buy/sell), etc.
     *
     */
    submitOrder(params: SubmitAdvTradeOrderRequest): Promise<AdvTradeSubmitOrderResponse>;
    /**
     * Cancel Orders
     *
     * Initiate cancel requests for one or more orders.
     * The maximum number of order_ids that can be cancelled per request is 100.
     * This number may be subject to change in emergency, but if a request exceeds the max,
     * then an InvalidArgument error code will be returned with an error message denoting the limit.
     */
    cancelOrders(params: {
        order_ids: string[];
    }): Promise<AdvTradeCancelOrdersResponse>;
    /**
     * Edit Order
     *
     * Edit an order with a specified new size, or new price.
     *
     * - Your request moves to the back of the queue if you increase the size or increase or decrease the price.
     * - If you decrease the size, you keep your place in line.
     * - A client can only send an Edit Order request after the previous request for the same order has been fully processed.
     */
    updateOrder(params: {
        order_id: string;
        price?: string;
        size?: string;
    }): Promise<AdvTradeEditOrderResponse>;
    /**
     * Edit Order Preview
     *
     * Preview an edit order request with a specified new size, or new price.
     *
     */
    updateOrderPreview(params: {
        order_id: string;
        price?: string;
        size?: string;
    }): Promise<AdvTradeEditOrderPreviewResponse>;
    /**
     * List Orders
     *
     * Get a list of orders filtered by optional query parameters.
     *
     * - The maximum number of OPEN orders returned is 1000.
     * - The parameters start_date and end_date don't apply to open orders.
     * - You cannot pair open orders with other order types.
     * - You cannot query for OPEN orders with other order types.
     */
    getOrders(params?: GetAdvTradeOrdersRequest): Promise<{
        orders: AdvTradeOrder[];
        sequence?: number;
        has_next: boolean;
        cursor?: string;
    }>;
    /**
     * List Fills
     *
     * Get a list of fills filtered by optional query parameters (product_id, order_id, etc).
     *
     */
    getFills(params?: GetAdvTradeFillsRequest): Promise<{
        fills: AdvTradeFill[];
        cursor?: string;
    }>;
    /**
     * Get Order
     *
     * Get a single order by order ID.
     */
    getOrder(params: {
        order_id: string;
        client_order_id?: string;
        user_native_currency?: string;
    }): Promise<{
        order: AdvTradeOrder;
    }>;
    /**
     * Preview Order
     *
     * Preview an order.
     *
     */
    previewOrder(params: PreviewAdvTradeOrderRequest): Promise<AdvTradeOrderPreview>;
    /**
     * Close Position
     *
     * Places an order to close any open positions for a specified product_id.
     *
     */
    closePosition(params: CloseAdvTradePositionRequest): Promise<AdvTradeClosePositionResponse>;
    /**
     *
     * Portfolios Endpoints
     *
     */
    /**
     * List Portfolios
     *
     * Get all portfolios of a user.
     */
    getPortfolios(params?: {
        portfolio_type?: 'UNDEFINED' | 'DEFAULT' | 'CONSUMER' | 'INTX';
    }): Promise<{
        portfolios: AdvTradePortfolio[];
    }>;
    /**
     * Create Portfolio
     *
     * Create a portfolio.
     */
    createPortfolio(params: {
        name: string;
    }): Promise<{
        portfolio: AdvTradePortfolio;
    }>;
    /**
     * Move Portfolio Funds
     *
     * Move funds between portfolios.
     */
    movePortfolioFunds(params: MoveAdvTradePortfolioFundsRequest): Promise<{
        source_portfolio_uuid: string;
        target_portfolio_uuid: string;
    }>;
    /**
     * Get Portfolio Breakdown
     *
     * Get the breakdown of a portfolio.
     */
    getPortfolioBreakdown(params: {
        portfolio_uuid: string;
        currency?: string;
    }): Promise<{
        breakdown: AdvTradePortfolioBreakdown;
    }>;
    /**
     * Delete Portfolio
     *
     * Delete a portfolio.
     */
    deletePortfolio(params: {
        portfolio_uuid: string;
    }): Promise<any>;
    /**
     * Edit Portfolio
     *
     * Edit a portfolio.
     *
     */
    updatePortfolio(params: {
        portfolio_uuid: string;
        name: string;
    }): Promise<{
        portfolio: AdvTradePortfolio;
    }>;
    /**
     *
     * Futures Endpoints
     *
     */
    /**
     * Get Futures Balance Summary
     *
     * Get a summary of balances for CFM trading.
     *
     * Futures vs Spot Accounts:
     * - Futures and spot balances are held in different accounts.
     * - Cash is always deposited into your Coinbase Inc. (CBI) spot account.
     * - Cash is automatically transferred to your Coinbase Financial Markets (CFM) futures account to satisfy margin requirements.
     * - You can transfer cash that isn't being used to margin or maintain futures positions into your CBI spot account.
     * - Funds held in a CBI spot account do not receive the preferential treatment given to funds held in a regulated futures account.
     *
     * Intraday vs. Overnight Margin Health:
     * - If you are opted in to receive increased leverage on futures trades during the intraday window (from 8am-4pm ET), this endpoint will return your intraday and overnight margin health.
     */
    getFuturesBalanceSummary(): Promise<{
        balance_summary: AdvTradeFuturesBalance;
    }>;
    /**
     * Get Intraday Margin Setting
     *
     * Get the futures intraday margin setting.
     */
    getIntradayMarginSetting(): Promise<{
        setting: 'INTRADAY_MARGIN_SETTING_UNSPECIFIED' | 'INTRADAY_MARGIN_SETTING_STANDARD' | 'INTRADAY_MARGIN_SETTING_INTRADAY';
    }>;
    /**
     * Set Intraday Margin Setting
     *
     * Set the futures intraday margin setting.
     */
    setIntradayMarginSetting(params?: {
        setting?: 'INTRADAY_MARGIN_SETTING_UNSPECIFIED' | 'INTRADAY_MARGIN_SETTING_STANDARD' | 'INTRADAY_MARGIN_SETTING_INTRADAY';
    }): Promise<any>;
    /**
     * Get Current Margin Window
     *
     * Get the futures current margin window.
     */
    getCurrentMarginWindow(params?: {
        margin_profile_type?: 'MARGIN_PROFILE_TYPE_UNSPECIFIED' | 'MARGIN_PROFILE_TYPE_RETAIL_REGULAR' | 'MARGIN_PROFILE_TYPE_RETAIL_INTRADAY_MARGIN_1';
    }): Promise<AdvTradeCurrentMarginWindow>;
    /**
     * List Futures Positions
     *
     * Get a list of positions in CFM products.
     */
    getFuturesPositions(): Promise<{
        positions: AdvTradeFuturesPosition[];
    }>;
    /**
     * Get Futures Position
     *
     * Get positions for a specific CFM product.
     */
    getFuturesPosition(params: {
        product_id: string;
    }): Promise<{
        position: AdvTradeFuturesPosition;
    }>;
    /**
     * Schedule Futures Sweep
     *
     * Schedules a sweep of funds from FCM wallet to USD Spot wallet.
     *
     * Futures Sweep Processing:
     * - Sweep requests submitted before 5PM ET each day are processed the following business day.
     * - Sweep requests submitted after 5PM ET each day are processed in 2 business days.
     * - You can have at most one pending sweep request at a time.
     *
     * Market movements related to your open positions may impact the final amount that is transferred into your spot account.
     * The final funds transferred, up to your specified amount, depend on the available excess in your futures account.
     */
    scheduleFuturesSweep(params?: {
        usd_amount?: string;
    }): Promise<{
        success: boolean;
    }>;
    /**
     * List Futures Sweeps
     *
     * Get pending and processing sweeps of funds from FCM wallet to USD Spot wallet.
     *
     * Pending vs. Processing Sweeps:
     * - A pending sweep is a sweep that has not started processing and can be cancelled.
     * - A processing sweep is a sweep that is currently being processed and cannot be cancelled.
     * - Once a sweep is complete, it no longer appears in the list of sweeps.
     */
    getFuturesSweeps(): Promise<{
        sweeps: AdvTradeFuturesSweep[];
    }>;
    /**
     * Cancel Pending Futures Sweep
     *
     * Cancel the pending sweep of funds from FCM wallet to USD Spot wallet.
     */
    cancelPendingFuturesSweep(): Promise<{
        success: boolean;
    }>;
    /**
     *
     * Perpetuals Endpoints
     *
     */
    /**
     * Allocate Portfolio
     *
     * Allocate portfolio funds to a sub-portfolio on Intx Portfolio.
     *
     */
    allocatePortfolio(params: AllocateAdvTradePortfolioRequest): Promise<any>;
    /**
     * Get Perpetuals Portfolio Summary
     *
     * Get a summary of your Perpetuals portfolio.
     */
    getPerpetualsPortfolioSummary(params: {
        portfolio_uuid: string;
    }): Promise<AdvTradePerpetualsPortfolio>;
    /**
     * List Perpetuals Positions
     *
     * Get a list of open positions in your Perpetuals portfolio.
     */
    getPerpetualsPositions(params: {
        portfolio_uuid: string;
    }): Promise<AdvTradePerpetualsPositionSummary>;
    /**
     * Get Perpetuals Position
     *
     * Get a specific open position on Intx.
     *
     */
    getPerpetualsPosition(params: {
        portfolio_uuid: string;
        symbol: string;
    }): Promise<{
        position: AdvTradePerpetualsPosition;
    }>;
    /**
     * Get Portfolios Balances
     *
     * Get a list of asset balances on Intx for a given Portfolio.
     */
    getPortfoliosBalances(params: {
        portfolio_uuid: string;
    }): Promise<{
        portfolio_balances: AdvTradePortfolioBalance[];
    }>;
    /**
     * Opt In or Out of Multi Asset Collateral
     *
     * Enable or Disable Multi Asset Collateral for a given Portfolio.
     */
    updateMultiAssetCollateral(params?: {
        portfolio_uuid?: string;
        multi_asset_collateral_enabled?: boolean;
    }): Promise<{
        multi_asset_collateral_enabled: boolean;
    }>;
    /**
     *
     * Fees Endpoints
     *
     */
    /**
     * Get Transaction Summary
     *
     * Get a summary of transactions with fee tiers, total volume, and fees.
     */
    getTransactionSummary(params?: GetAdvTradeTransactionSummaryRequest): Promise<AdvTradeTransactionSummary>;
    /**
     *
     * Converts Endpoints
     *
     */
    /**
     * Create Convert Quote
     *
     * Create a convert quote with a specified source account, target account, and amount.
     * Convert is applicable for USDC-USD and EURC-EUR conversion.
     */
    submitConvertQuote(params: SubmitAdvTradeConvertQuoteRequest): Promise<any>;
    /**
     * Get Convert Trade
     *
     * Gets a list of information about a convert trade with a specified trade id, source account, and target account.
     */
    getConvertTrade(params: {
        trade_id: string;
        from_account: string;
        to_account: string;
    }): Promise<any>;
    /**
     * Commit Convert Trade
     *
     * Commits a convert trade with a specified trade id, source account, and target account.
     */
    commitConvertTrade(params: {
        trade_id: string;
        from_account: string;
        to_account: string;
    }): Promise<any>;
    /**
     *
     * Public Endpoints
     *
     */
    getServerTime(): Promise<{
        iso: string;
        epochSeconds: string;
        epochMillis: string;
    }>;
    /**
     * Get Public Product Book
     *
     * Get a list of bids/asks for a single product. The amount of detail shown can be customized with the limit parameter.
     */
    getPublicProductBook(params: {
        product_id: string;
        limit?: number;
        aggregation_price_increment?: string;
    }): Promise<{
        pricebook: AdvTradePricebook;
    }>;
    /**
     * List Public Products
     *
     * Get a list of the available currency pairs for trading.
     */
    getPublicProducts(params?: GetAdvTradePublicProductsRequest): Promise<{
        products: AdvTradePublicProduct[];
        num_products: number;
    }>;
    /**
     * Get Public Product
     *
     * Get information on a single product by product ID.
     */
    getPublicProduct(params: {
        product_id: string;
    }): Promise<AdvTradePublicProduct>;
    /**
     * Get Public Product Candles
     *
     * Get rates for a single product by product ID, grouped in buckets.
     */
    getPublicProductCandles(params: GetAdvTradePublicProductCandlesRequest): Promise<{
        candles: AdvTradeCandle[];
    }>;
    /**
     * Get Public Market Trades
     *
     * Get snapshot information by product ID about the last trades (ticks) and best bid/ask.
     */
    getPublicMarketTrades(params: GetAdvTradePublicMarketTradesRequest): Promise<AdvTradeMarketTrades>;
    /**
     *
     * Payment Methods Endpoints
     *
     */
    /**
     * List Payment Methods
     *
     * Get a list of payment methods for the current user.
     */
    getPaymentMethods(): Promise<{
        payment_methods: AdvTradePaymentMethod[];
    }>;
    /**
     * Get Payment Method
     *
     * Get information about a payment method for the current user.
     */
    getPaymentMethod(params: {
        payment_method_id: string;
    }): Promise<{
        payment_method: AdvTradePaymentMethod;
    }>;
    /**
     *
     * Data API Endpoints
     *
     */
    /**
     * Get API Key Permissions
     *
     * Get information about your CDP API key permissions.
     */
    getApiKeyPermissions(): Promise<AdvTradeApiKeyPermissions>;
}
