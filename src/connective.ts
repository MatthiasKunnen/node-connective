import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

import {Packages} from './packages/packages.controller';

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

    packages: Packages;

    private readonly http: AxiosInstance;

    constructor(
        options: ConnectiveOptions,
        axiosConfig: Partial<AxiosRequestConfig> = {},
    ) {
        const basicHeaderValue = `${options.username}:${options.password}`;

        this.http = axios.create({
            baseURL: `${options.endpoint}/webportalapi`,
            headers: {
                Authorization: `Basic ${Buffer.from(basicHeaderValue).toString('base64')}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
            // Prevent loading whole stream into memory, see
            // https://github.com/axios/axios/issues/1045
            maxRedirects: 0,
            ...axiosConfig,
        });

        this.packages = new Packages(this.http);
    }
}
