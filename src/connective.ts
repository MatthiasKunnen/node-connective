import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import axiosBetterStacktrace from 'axios-better-stacktrace';

import {PackageController} from './packages/package.controller';
import {SigningMethodsController} from './signing-methods/signing-methods.controller';
import {isAxiosConnectiveError} from './utils/error.util';

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

        this.http.interceptors.response.use(undefined, (error: unknown) => {
            if (!isAxiosConnectiveError(error)) {
                throw error;
            }

            error.message += `. Connective errors:\n${error.response.data
                .map(e => {
                    return ` - ${e.ErrorCode}: ${e.ErrorMessage}`;
                })
                .join('\n')}`;

            throw error;
        });

        // Include call site of request causing error in stack trace. See:
        // - https://github.com/axios/axios/issues/2387
        // - https://github.com/axios/axios/issues/5012
        axiosBetterStacktrace(this.http, {
            errorMsg: 'Originates at:',
        });

        this.packages = new PackageController(this.http);
        this.signingMethods = new SigningMethodsController(this.http);
    }
}
