import { BaseRestClient } from './lib/BaseRestClient.js';
import { REST_CLIENT_TYPE_ENUM, } from './lib/requestUtils.js';
/**
 * REST client for Coinbase Prime API:
 * https://docs.cdp.coinbase.com/commerce-onchain/docs/welcome
 */
export class CBCommerceClient extends BaseRestClient {
    constructor(restClientOptions = {}, requestOptions = {}) {
        super(restClientOptions, requestOptions);
        return this;
    }
    getClientType() {
        return REST_CLIENT_TYPE_ENUM.commerce;
    }
    /**
     *
     * Charges Endpoints
     *
     */
    /**
     * Creates a Charge
     *
     * Creates a charge.
     */
    createCharge(params) {
        return this.postPrivate('/charges', {
            body: params,
        });
    }
    /**
     * Returns All Charges
     *
     * Returns all charges.
     */
    getAllCharges() {
        return this.getPrivate('/charges');
    }
    /**
     * Returns the Charge with the Order Code
     *
     * Returns the charge with the order code.
     */
    getCharge(params) {
        return this.getPrivate(`/charges/${params.charge_code_or_charge_id}`);
    }
    /**
     *
     * Checkouts Endpoints
     *
     */
    /**
     * Creates a New Checkout
     *
     * Creates a new checkout.
     */
    createCheckout(params) {
        return this.postPrivate('/checkouts', {
            body: params,
        });
    }
    /**
     * Returns All Checkout Sessions
     *
     * Returns all checkout sessions.
     */
    getAllCheckouts() {
        return this.getPrivate('/checkouts');
    }
    /**
     * Returns a Specific Checkout Session
     *
     * Returns a specific checkout session.
     */
    getCheckout(params) {
        return this.getPrivate(`/checkouts/${params.checkout_id}`);
    }
    /**
     *
     * Events Endpoints
     *
     */
    /**
     * List Events
     *
     * Lists all events.
     */
    listEvents(headers) {
        return this.getPrivate('/events', {
            headers: headers,
        });
    }
    /**
     * Show an Event
     *
     * Retrieves the details of an event. Supply the unique identifier of the event, which you might have received in a webhook.
     */
    showEvent(params, headers) {
        return this.getPrivate(`/events/${params.event_id}`, { headers: headers });
    }
}
//# sourceMappingURL=CBCommerceClient.js.map