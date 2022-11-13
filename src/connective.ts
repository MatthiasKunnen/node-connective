import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

import {PackageController} from './packages/package.controller';
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

    packages: PackageController;
    signingMethods: SigningMethodsController;

    private readonly http: AxiosInstance;

    constructor(
        options: ConnectiveOptions,
        axiosConfig: Partial<AxiosRequestConfig> = {},
    ) {
        const basicHeaderValue = `${options.username}:${options.password}`;

        this.http = axios.create({
            baseURL: `${options.endpoint}/esig/webportalapi/v4`,
            headers: {
                Authorization: `Basic ${Buffer.from(basicHeaderValue).toString('base64')}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
            // Prevent loading whole stream into memory, see
            // https://github.com/axios/axios/issues/1045
            maxRedirects: 0,
            ...axiosConfig,
        });

        this.packages = new PackageController(this.http);
        this.signingMethods = new SigningMethodsController(this.http);
    }
}
