import {AxiosError, AxiosResponse} from 'axios';

import {objectContainsProperty} from './object.util';

export function isAxiosError(error: unknown): error is AxiosError {
    return objectContainsProperty(error, 'isAxiosError') && error.isAxiosError === true;
}

export interface ConnectiveError {
    ErrorCode: string;
    ErrorMessage: string;
}

export type ConnectiveErrorData = Array<ConnectiveError>;
export type AxiosConnectiveError = AxiosError<ConnectiveErrorData> & {
    response: AxiosResponse<ConnectiveErrorData>;
};

export function isConnectiveErrorData(data: unknown): data is ConnectiveErrorData {
    if (data == null) {
        return false;
    }

    return Array.isArray(data)
        && data.length > 0
        && objectContainsProperty(data[0], 'ErrorCode');
}

export function isAxiosConnectiveError(
    error: unknown,
): error is AxiosConnectiveError {
    return isAxiosError(error)
        && error.response !== undefined
        && isConnectiveErrorData(error.response.data);
}
