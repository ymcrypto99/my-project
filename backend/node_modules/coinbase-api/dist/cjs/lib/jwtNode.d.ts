interface JWTSignParams {
    algorithm: 'ES256';
    timestampMs: number;
    jwtExpiresSeconds: number;
    apiPubKey: string;
    apiPrivKey: string;
}
export declare function signJWT(params: {
    url: string;
    method: string;
} & JWTSignParams): string;
export declare function signWSJWT(params: JWTSignParams): string;
export {};
