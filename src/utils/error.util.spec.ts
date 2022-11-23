import {isAxiosConnectiveError, isAxiosError, isConnectiveErrorData} from './error.util';

describe('isAxiosError', () => {
    it('should return false for non-Axios errors', () => {
        expect(isAxiosError(null)).toBe(false);
        expect(isAxiosError({isAxiosError: false})).toBe(false);
        expect(isAxiosError(new Error())).toBe(false);
    });
    it('should return true for Axios errors', () => {
        expect(isAxiosError({isAxiosError: true})).toBe(true);
    });
});

describe('isConnectiveErrorData', () => {
    it('should return false for null values', () => {
        expect(isConnectiveErrorData(null)).toBe(false);
        expect(isConnectiveErrorData(undefined)).toBe(false);
    });

    it('should return false for non-arrays', () => {
        expect(isConnectiveErrorData({})).toBe(false);
        expect(isConnectiveErrorData(1)).toBe(false);
        expect(isConnectiveErrorData({ErrorCode: ''})).toBe(false);
    });

    it('should return false for empty arrays', () => {
        expect(isConnectiveErrorData([])).toBe(false);
    });

    it('should return false for arrays with items missing "ErrorCode"', () => {
        expect(isConnectiveErrorData([{}])).toBe(false);
    });

    it('should return true for arrays with items that have an "ErrorCode"', () => {
        expect(isConnectiveErrorData([{ErrorCode: ''}])).toBe(true);
    });

    it('should narrow the type', () => {
        const input: unknown = [{ErrorCode: 'Teapot'}];
        const narrowed = isConnectiveErrorData(input) && input[0].ErrorCode;

        expect(narrowed).toBe('Teapot');
    });
});

describe('isAxiosConnectiveError', () => {
    it('should return false for null values', () => {
        expect(isAxiosConnectiveError(null)).toBe(false);
        expect(isAxiosConnectiveError(undefined)).toBe(false);
    });

    it('should return false for non-axios errors', () => {
        expect(isAxiosConnectiveError({})).toBe(false);
        expect(isAxiosConnectiveError(1)).toBe(false);
        expect(isAxiosConnectiveError({isAxiosError: false})).toBe(false);
        expect(isAxiosConnectiveError({
            isAxiosError: false,
            response: {
                data: [
                    {ErrorCode: ''},
                ],
            },
        })).toBe(false);
    });

    it('should return false for undefined responses', () => {
        expect(isAxiosConnectiveError({isAxiosError: true})).toBe(false);
    });

    it('should return false for empty data responses', () => {
        expect(isAxiosConnectiveError({
            isAxiosError: true,
            response: {
                data: '',
            },
        })).toBe(false);
        expect(isAxiosConnectiveError({
            isAxiosError: true,
            response: {
                data: [],
            },
        })).toBe(false);
    });

    it('should return false for data arrays with items missing "ErrorCode"', () => {
        expect(isAxiosConnectiveError({
            isAxiosError: true,
            response: {
                data: [{}],
            },
        })).toBe(false);
    });

    it('should return true for arrays with items that have an "ErrorCode"', () => {
        expect(isAxiosConnectiveError({
            isAxiosError: true,
            response: {
                data: [{ErrorCode: ''}],
            },
        })).toBe(true);
    });

    it('should narrow the type', () => {
        const input: unknown = {
            isAxiosError: true,
            response: {
                data: [{ErrorCode: 'Teapot'}],
            },
        };
        const narrowed = isAxiosConnectiveError(input) && input.response.data[0].ErrorCode;

        expect(narrowed).toBe('Teapot');
    });
});
