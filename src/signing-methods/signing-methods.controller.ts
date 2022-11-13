import {AxiosInstance, AxiosResponse} from 'axios';

import {SigningMethod} from './signing-methods.interface';

export class SigningMethodsController {

    constructor(
        private readonly http: AxiosInstance,
    ) {
    }

    /**
     * This call retrieves all signing methods that are currently enabled or disabled in the
     * eSignatures Configuration Index and are thus available to the users.
     *
     * Note that this API call retrieves both the SigningTypes that are configured in the deprecated
     * Signing Options settings group, and the SigningMethods and the Signing Behavior they belong
     * to, configured in the new Signing Options settings group. The new SigningMethods are
     * formatted as follows: SigningBehavior:SigningMethod. E.g. SmartCard:BeID.
     * @param isActive If true, only return active signing methods, if false, return only the
     * disabled ones. If undefined, return both.
     */
    async get(isActive: true): Promise<AxiosResponse<Array<SigningMethod<true>>>>;
    async get(isActive: false): Promise<AxiosResponse<Array<SigningMethod<false>>>>;
    async get(isActive?: undefined): Promise<AxiosResponse<Array<SigningMethod>>>;
    async get(isActive?: boolean): Promise<AxiosResponse<Array<SigningMethod>>> {
        return this.http.get(`/signingmethods`, {
            params: {
                isActive,
            },
        });
    }
}
