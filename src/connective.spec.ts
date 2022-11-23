import {jestGetErrorAsync} from '../tests/jest.helper';
import {getNewConnectiveInstance} from '../tests/package.helper';

describe('HTTP error handling', () => {
    it('should not change non-Axios errors', async () => {
        const connective = getNewConnectiveInstance();
        const simpleError: any = await jestGetErrorAsync(async () => {
            return connective.http.get('https://example.com', {
                transformResponse: () => {
                    throw new Error('Not an axios error');
                },
            });
        });

        expect(simpleError.message).toEqual('Not an axios error');

        const error: any = await jestGetErrorAsync(async () => {
            return connective.http.get('https://example.com', {
                transformResponse: () => {
                    throw Object.assign(new Error('Request failed with status 418'), {
                        isAxiosError: false,
                        response: {
                            data: [],
                        },
                    });
                },
            });
        });

        expect(error.message).toEqual('Request failed with status 418');
    });

    it('should not change non-Connective errors', async () => {
        const connective = getNewConnectiveInstance();
        const error: any = await jestGetErrorAsync(async () => {
            return connective.http.get('https://example.com', {
                transformResponse: () => {
                    throw Object.assign(new Error('Request failed with status 418'), {
                        isAxiosError: false,
                        response: {
                            data: [
                                {
                                    NotErrorCode: 'Teapot',
                                },
                            ],
                        },
                    });
                },
            });
        });

        expect(error.message).toEqual('Request failed with status 418');
        expect(error.response).toEqual({
            data: [
                {
                    NotErrorCode: 'Teapot',
                },
            ],
        });
    });

    it('should append the Connective error to the error message', async () => {
        const connective = getNewConnectiveInstance();
        const error: any = await jestGetErrorAsync(async () => {
            return connective.http.get('https://example.com', {
                transformResponse: () => {
                    throw Object.assign(new Error('Request failed with status 418'), {
                        isAxiosError: true,
                        response: {
                            data: [
                                {
                                    ErrorCode: 'ErrorCode',
                                    ErrorMessage: 'ErrorMessage',
                                },
                                {
                                    ErrorCode: 'Package.NotFound:d5bcce68-ca67-40eb-ac36-be3a817'
                                        + 'ce22a',
                                    ErrorMessage: 'Could not perform operation on package [d5bcce68'
                                        + '-ca67-40eb-ac36-be3a817ce22a] because it could not be '
                                        + 'found',
                                },
                            ],
                        },
                    });
                },
            });
        });

        expect(error.message).toEqual(`Request failed with status 418. Connective errors:
 - ErrorCode: ErrorMessage
 - Package.NotFound:d5bcce68-ca67-40eb-ac36-be3a817ce22a: Could not perform operation on package \
[d5bcce68-ca67-40eb-ac36-be3a817ce22a] because it could not be found`);
        expect(error.response).toEqual({
            data: [
                {
                    ErrorCode: 'ErrorCode',
                    ErrorMessage: 'ErrorMessage',
                },
                {
                    ErrorCode: 'Package.NotFound:d5bcce68-ca67-40eb-ac36-be3a817ce22a',
                    ErrorMessage: 'Could not perform operation on package [d5bcce68-ca67-40eb-ac36-'
                        + 'be3a817ce22a] because it could not be found',
                },
            ],
        });
    });
});
