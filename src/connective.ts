import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

import {PackagesController} from './packages/packages.controller';
import {SigningMethodsController} from './signing-methods/signing-methods.controller';

export interface ConnectiveOptions {
    /**
     * E.g. https://company.connective.eu
     * Do not specify a path.
     */
    endpoint: string;
    password: string;
    username: string;
}

export class Connective {

    packages: PackagesController;
    signingMethods: SigningMethodsController;

    private readonly http: AxiosInstance;

    constructor(
        options: ConnectiveOptions,
        axiosConfig: Partial<AxiosRequestConfig> = {},
    ) {
        const basicHeaderValue = `${options.username}:${options.password}`;

        this.http = axios.create({
            baseURL: `${options.endpoint}/esig/webportalapi/v4/`,
            headers: {
                Authorization: `Basic ${Buffer.from(basicHeaderValue).toString('base64')}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
            ...axiosConfig,
        });

        this.packages = new PackagesController(this.http);
        this.signingMethods = new SigningMethodsController(this.http);
    }
}
