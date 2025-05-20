"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJWT = signJWT;
exports.signWSJWT = signWSJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
function signJWT(params) {
    const { url, method, algorithm, timestampMs, jwtExpiresSeconds, apiPrivKey, apiPubKey, } = params;
    // Remove https:// but keep the rest
    const urlWithEndpoint = url.slice(8);
    const uri = `${method} ${urlWithEndpoint}`;
    const payload = {
        iss: 'cdp',
        nbf: Math.floor(timestampMs / 1000),
        exp: Math.floor(timestampMs / 1000) + jwtExpiresSeconds,
        sub: apiPubKey,
        uri,
    };
    const header = {
        alg: algorithm,
        kid: apiPubKey,
        nonce: (0, nanoid_1.nanoid)(16),
    };
    const options = {
        algorithm: algorithm,
        header: header,
    };
    return jsonwebtoken_1.default.sign(payload, apiPrivKey, options);
}
function signWSJWT(params) {
    const { algorithm, timestampMs, jwtExpiresSeconds, apiPrivKey, apiPubKey } = params;
    const payload = {
        iss: 'cdp',
        nbf: Math.floor(timestampMs / 1000),
        exp: Math.floor(timestampMs / 1000) + jwtExpiresSeconds,
        sub: apiPubKey,
    };
    const header = {
        alg: algorithm,
        kid: apiPubKey,
        nonce: (0, nanoid_1.nanoid)(16),
    };
    const options = {
        algorithm: algorithm,
        header: header,
    };
    return jsonwebtoken_1.default.sign(payload, apiPrivKey, options);
}
//# sourceMappingURL=jwtNode.js.map