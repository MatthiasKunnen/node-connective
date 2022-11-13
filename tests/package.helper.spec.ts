import {Connective} from '../src';
import {registerPackageSetUpAndTearDown, requireEnv, sortPackageData} from './package.helper';

describe('registerPackageSetUpAndTearDown', () => {
    let connectiveClient: Connective;
    const {packagesToDelete} = registerPackageSetUpAndTearDown({
        setConnectiveClient: client => {
            connectiveClient = client;
        },
    });

    it('should return a connective client', () => {
        expect(connectiveClient).toBeInstanceOf(Connective);
    });

    it('should return an array with packages to delete', () => {
        expect(packagesToDelete).toBeInstanceOf(Array);
    });

    it('should have an empty packagesToDelete', () => {
        expect(packagesToDelete).toEqual<Array<string>>([]);
    });
});

describe('requireEnv', () => {
    it('should error if the environment variable does not exist', () => {
        const nonexistentVariable = '2LaJgf2KJiRdKEAgBqHg3cD8zX3G7jJfn9hJPRjeKGncF5Q65X4KnCXC7R9kb';
        expect(() => {
            requireEnv(nonexistentVariable);
        }).toThrow(`Environment variable ${nonexistentVariable} required. Add to .env.`);
    });
});

describe('sortPackageData', () => {
    it('sorts documents by external reference', () => {
        const data = {
            Documents: [
                {
                    ExternalReference: '2',
                },
                {
                    ExternalReference: '1',
                },
            ],
        };

        sortPackageData(data);

        expect(data).toEqual<typeof data>({
            Documents: [
                {
                    ExternalReference: '1',
                },
                {
                    ExternalReference: '2',
                },
            ],
        });
    });

    it('sorts external reference null', () => {
        const data = {
            Documents: [
                {
                    ExternalReference: null,
                },
                {
                    ExternalReference: '2',
                },
                {
                    ExternalReference: '1',
                },
            ],
        };

        sortPackageData(data);

        expect(data).toEqual<typeof data>({
            Documents: [
                {
                    ExternalReference: null,
                },
                {
                    ExternalReference: '1',
                },
                {
                    ExternalReference: '2',
                },
            ],
        });
    });

    it('sorts documents elements by external reference', () => {
        const data = {
            Documents: [
                {
                    ExternalReference: '2',
                    Elements: [
                        {
                            ExternalReference: '2',
                        },
                        {
                            ExternalReference: '1',
                        },
                    ],
                },
                {
                    ExternalReference: '1',
                },
            ],
        };

        sortPackageData(data);

        expect(data).toEqual<typeof data>({
            Documents: [
                {
                    ExternalReference: '1',
                },
                {
                    ExternalReference: '2',
                    Elements: [
                        {
                            ExternalReference: '1',
                        },
                        {
                            ExternalReference: '2',
                        },
                    ],
                },
            ],
        });
    });

    it('sorts stakeholders by external reference', () => {
        const data = {
            Stakeholders: [
                {
                    ExternalReference: '2',
                },
                {
                    ExternalReference: '1',
                },
            ],
        };

        sortPackageData(data);

        expect(data).toEqual<typeof data>({
            Stakeholders: [
                {
                    ExternalReference: '1',
                },
                {
                    ExternalReference: '2',
                },
            ],
        });
    });

    it('sorts stakeholders actors by type', () => {
        const data = {
            Stakeholders: [
                {
                    ExternalReference: '2',
                    Actors: [
                        {
                            Type: 'receiver',
                        },
                        {
                            Type: 'formFiller',
                        },
                    ],
                },
                {
                    ExternalReference: '1',
                },
            ],
        };

        sortPackageData(data);

        expect(data).toEqual<typeof data>({
            Stakeholders: [
                {
                    ExternalReference: '1',
                },
                {
                    ExternalReference: '2',
                    Actors: [
                        {
                            Type: 'formFiller',
                        },
                        {
                            Type: 'receiver',
                        },
                    ],
                },
            ],
        });
    });

    it('sorts stakeholders actor elements by external reference', () => {
        const data = {
            Stakeholders: [
                {
                    ExternalReference: '2',
                    Actors: [
                        {
                            Type: 'receiver',
                            Elements: [
                                {
                                    ExternalReference: '2',
                                },
                                {
                                    ExternalReference: '1',
                                },
                            ],
                        },
                        {
                            Type: 'formFiller',
                        },
                    ],
                },
                {
                    ExternalReference: '1',
                },
            ],
        };

        sortPackageData(data);

        expect(data).toEqual<typeof data>({
            Stakeholders: [
                {
                    ExternalReference: '1',
                },
                {
                    ExternalReference: '2',
                    Actors: [
                        {
                            Type: 'formFiller',
                        },
                        {
                            Type: 'receiver',
                            Elements: [
                                {
                                    ExternalReference: '1',
                                },
                                {
                                    ExternalReference: '2',
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
});
