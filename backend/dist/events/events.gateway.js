"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_jwt_auth_guard_1 = require("../auth/ws-jwt-auth.guard");
const exchange_service_1 = require("../exchange/exchange.service");
const logger_service_1 = require("../logger/logger.service");
let EventsGateway = class EventsGateway {
    constructor(exchangeService, logger) {
        this.exchangeService = exchangeService;
        this.logger = logger;
        this.clientSubscriptions = new Map();
        this.logger.setContext('EventsGateway');
    }
    afterInit(server) {
        this.logger.log('WebSocket server initialized');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.clientSubscriptions.set(client.id, []);
        client.emit('connection_status', { connected: true });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.cleanupClientSubscriptions(client.id);
        this.clientSubscriptions.delete(client.id);
    }
    handleSubscribeMarketData(client, payload) {
        try {
            this.logger.log(`Client ${client.id} subscribing to market data for ${payload.symbol} on ${payload.platform}`);
            const { symbol, platform, interval = 5000 } = payload;
            const subscription = {
                symbol,
                platform,
                type: 'marketData',
                interval,
                timerId: null,
            };
            subscription.timerId = setInterval(async () => {
                try {
                    const marketData = await this.exchangeService.getMarketData(platform, symbol);
                    client.emit('market_data', marketData);
                }
                catch (error) {
                    this.logger.error(`Error fetching market data for ${symbol} on ${platform}`, error);
                    client.emit('error', { message: `Error fetching market data: ${error.message}` });
                }
            }, interval);
            const clientSubs = this.clientSubscriptions.get(client.id) || [];
            clientSubs.push(subscription);
            this.clientSubscriptions.set(client.id, clientSubs);
            this.exchangeService.getMarketData(platform, symbol)
                .then(marketData => client.emit('market_data', marketData))
                .catch(error => {
                this.logger.error(`Error fetching initial market data for ${symbol} on ${platform}`, error);
                client.emit('error', { message: `Error fetching initial market data: ${error.message}` });
            });
            return { success: true, message: `Subscribed to market data for ${symbol} on ${platform}` };
        }
        catch (error) {
            this.logger.error(`Error subscribing to market data`, error);
            throw new websockets_1.WsException(`Error subscribing to market data: ${error.message}`);
        }
    }
    handleSubscribeOrderBook(client, payload) {
        try {
            this.logger.log(`Client ${client.id} subscribing to order book for ${payload.symbol} on ${payload.platform}`);
            const { symbol, platform, interval = 5000 } = payload;
            const subscription = {
                symbol,
                platform,
                type: 'orderBook',
                interval,
                timerId: null,
            };
            subscription.timerId = setInterval(async () => {
                try {
                    const orderBook = await this.exchangeService.getOrderBook(platform, symbol);
                    client.emit('order_book', orderBook);
                }
                catch (error) {
                    this.logger.error(`Error fetching order book for ${symbol} on ${platform}`, error);
                    client.emit('error', { message: `Error fetching order book: ${error.message}` });
                }
            }, interval);
            const clientSubs = this.clientSubscriptions.get(client.id) || [];
            clientSubs.push(subscription);
            this.clientSubscriptions.set(client.id, clientSubs);
            this.exchangeService.getOrderBook(platform, symbol)
                .then(orderBook => client.emit('order_book', orderBook))
                .catch(error => {
                this.logger.error(`Error fetching initial order book for ${symbol} on ${platform}`, error);
                client.emit('error', { message: `Error fetching initial order book: ${error.message}` });
            });
            return { success: true, message: `Subscribed to order book for ${symbol} on ${platform}` };
        }
        catch (error) {
            this.logger.error(`Error subscribing to order book`, error);
            throw new websockets_1.WsException(`Error subscribing to order book: ${error.message}`);
        }
    }
    handleUnsubscribe(client, payload) {
        try {
            this.logger.log(`Client ${client.id} unsubscribing from ${payload.type} for ${payload.symbol} on ${payload.platform}`);
            const { symbol, platform, type } = payload;
            const clientSubs = this.clientSubscriptions.get(client.id) || [];
            const subIndex = clientSubs.findIndex(sub => sub.symbol === symbol &&
                sub.platform === platform &&
                sub.type === type);
            if (subIndex !== -1) {
                clearInterval(clientSubs[subIndex].timerId);
                clientSubs.splice(subIndex, 1);
                this.clientSubscriptions.set(client.id, clientSubs);
                return { success: true, message: `Unsubscribed from ${type} for ${symbol} on ${platform}` };
            }
            else {
                return { success: false, message: `Subscription not found` };
            }
        }
        catch (error) {
            this.logger.error(`Error unsubscribing`, error);
            throw new websockets_1.WsException(`Error unsubscribing: ${error.message}`);
        }
    }
    async handlePlaceOrder(client, payload) {
        try {
            this.logger.log(`Client ${client.id} placing ${payload.side} ${payload.type} order for ${payload.quantity} ${payload.symbol} on ${payload.platform}`);
            const { symbol, platform, side, type, quantity, price } = payload;
            const order = await this.exchangeService.placeOrder(platform, symbol, side, type, quantity, price);
            client.emit('order_update', order);
            return { success: true, order };
        }
        catch (error) {
            this.logger.error(`Error placing order`, error);
            throw new websockets_1.WsException(`Error placing order: ${error.message}`);
        }
    }
    async handleCancelOrder(client, payload) {
        try {
            this.logger.log(`Client ${client.id} cancelling order ${payload.orderId} on ${payload.platform}`);
            const { orderId, platform } = payload;
            const success = await this.exchangeService.cancelOrder(platform, orderId);
            return { success, message: success ? 'Order cancelled successfully' : 'Failed to cancel order' };
        }
        catch (error) {
            this.logger.error(`Error cancelling order`, error);
            throw new websockets_1.WsException(`Error cancelling order: ${error.message}`);
        }
    }
    async handleGetBalance(client, payload) {
        try {
            this.logger.log(`Client ${client.id} requesting balance for ${payload.platform}`);
            const { platform } = payload;
            const balance = await this.exchangeService.getBalance(platform);
            return { success: true, balance };
        }
        catch (error) {
            this.logger.error(`Error getting balance`, error);
            throw new websockets_1.WsException(`Error getting balance: ${error.message}`);
        }
    }
    async handleGetOpenOrders(client, payload) {
        try {
            this.logger.log(`Client ${client.id} requesting open orders for ${payload.platform}`);
            const { platform } = payload;
            const orders = await this.exchangeService.getOpenOrders(platform);
            return { success: true, orders };
        }
        catch (error) {
            this.logger.error(`Error getting open orders`, error);
            throw new websockets_1.WsException(`Error getting open orders: ${error.message}`);
        }
    }
    cleanupClientSubscriptions(clientId) {
        this.logger.log(`Cleaning up subscriptions for client ${clientId}`);
        const clientSubs = this.clientSubscriptions.get(clientId) || [];
        for (const sub of clientSubs) {
            clearInterval(sub.timerId);
        }
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('subscribe_market_data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribeMarketData", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('subscribe_order_book'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribeOrderBook", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleUnsubscribe", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('place_order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handlePlaceOrder", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('cancel_order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleCancelOrder", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('get_balance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleGetBalance", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('get_open_orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleGetOpenOrders", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [exchange_service_1.ExchangeService,
        logger_service_1.LoggerService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map