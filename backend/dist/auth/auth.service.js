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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const logger_service_1 = require("../logger/logger.service");
const USERS = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        name: 'Admin User',
        password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
    },
];
let AuthService = class AuthService {
    constructor(jwtService, logger) {
        this.jwtService = jwtService;
        this.logger = logger;
        this.logger.setContext('AuthService');
    }
    async validateUser(username, password) {
        this.logger.debug(`Validating user: ${username}`);
        const user = USERS.find(user => user.username === username);
        if (!user) {
            this.logger.warn(`User not found: ${username}`);
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Invalid password for user: ${username}`);
            return null;
        }
        const { password: _ } = user, result = __rest(user, ["password"]);
        this.logger.debug(`User validated: ${username}`);
        return result;
    }
    async login(user) {
        this.logger.debug(`Generating JWT token for user: ${user.username}`);
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
        };
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(userData) {
        this.logger.debug(`Registering new user: ${userData.username}`);
        const existingUser = USERS.find(user => user.username === userData.username || user.email === userData.email);
        if (existingUser) {
            this.logger.warn(`User already exists: ${userData.username}`);
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = {
            id: USERS.length + 1,
            username: userData.username,
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
        };
        USERS.push(newUser);
        this.logger.log(`User registered: ${userData.username}`);
        const { password: _ } = newUser, result = __rest(newUser, ["password"]);
        return result;
    }
    validateToken(token) {
        try {
            this.logger.debug('Validating JWT token');
            return this.jwtService.verify(token);
        }
        catch (error) {
            this.logger.error(`Token validation failed: ${error.message}`);
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        logger_service_1.LoggerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map