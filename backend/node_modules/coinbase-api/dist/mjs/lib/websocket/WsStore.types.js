export var WsConnectionStateEnum;
(function (WsConnectionStateEnum) {
    WsConnectionStateEnum[WsConnectionStateEnum["INITIAL"] = 0] = "INITIAL";
    WsConnectionStateEnum[WsConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
    WsConnectionStateEnum[WsConnectionStateEnum["CONNECTED"] = 2] = "CONNECTED";
    WsConnectionStateEnum[WsConnectionStateEnum["CLOSING"] = 3] = "CLOSING";
    WsConnectionStateEnum[WsConnectionStateEnum["RECONNECTING"] = 4] = "RECONNECTING";
    WsConnectionStateEnum[WsConnectionStateEnum["ERROR_RECONNECTING"] = 5] = "ERROR_RECONNECTING";
    // ERROR = 5,
})(WsConnectionStateEnum || (WsConnectionStateEnum = {}));
//# sourceMappingURL=WsStore.types.js.map