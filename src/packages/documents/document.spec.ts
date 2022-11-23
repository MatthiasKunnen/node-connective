import {randomUUID} from 'crypto';
import {Readable} from 'stream';

import {jestGetErrorAsync} from '../../../tests/jest.helper';
import {
    DocumentsStore,
    registerPackageSetUpAndTearDown,
    requireEnv,
} from '../../../tests/package.helper';
import {
    Connective,
    Document,
} from '../../index';

let connectiveClient: Connective;
const {packagesToDelete} = registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

let packageId: string;
let documentBase64: string;
const initiator = requireEnv('CONNECTIVE_INITIATOR');

beforeAll(async () => {
    documentBase64 = await DocumentsStore.getSimpleDocumentBase64();

    const createPackageResponse = await connectiveClient.packages.create({
        Initiator: initiator,
        Name: `Test-${randomUUID()}`,
        Status: 'Draft',
        Stakeholders: [
            {
                Type: 'person',
                EmailAddress: 'none@example.com',
                Language: 'nl',
                FirstName: 'First',
                LastName: 'Last',
            },
        ],
    });
    packageId = createPackageResponse.data.Id;
    packagesToDelete.push(packageId);
});

describe('all', () => {
    it('should return all documents', async () => {
        const createPackageResponse = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Draft',
            Documents: [
                {
                    Elements: [],
                    Name: 'Test document',
                    Language: 'en',
                    DocumentOptions: {
                        ContentType: 'application/pdf',
                        Base64data: documentBase64,
                    },
                },
                {
                    Elements: [],
                    Name: 'Test 2 document',
                    Language: 'en',
                    DocumentOptions: {
                        ContentType: 'application/pdf',
                        Base64data: documentBase64,
                    },
                },
            ],
        });

        packagesToDelete.push(createPackageResponse.data.Id);

        const documentsResponse = await connectiveClient.packages.documents.all(
            createPackageResponse.data.Id,
        );

        expect(documentsResponse.data.map(doc => doc.Name)).toEqual<Array<string>>([
            'Test document',
            'Test 2 document',
        ]);
    });
});

describe('create', () => {
    it('creates a PDF document', async () => {
        const createDocumentResponse = await connectiveClient.packages.documents.create({
            PackageId: packageId,
            Document: {
                Elements: [],
                Name: 'Test document',
                Language: 'en',
                DocumentOptions: {
                    ContentType: 'application/pdf',
                    Base64data: documentBase64,
                },
            },
        });

        expect(createDocumentResponse.data).toEqual<Document>({
            Id: createDocumentResponse.data.Id,
            PackageId: packageId,
            Name: 'Test document',
            IsOptional: false,
            CreationDate: createDocumentResponse.data.CreationDate,
            MediaType: 'application/pdf',
            Status: 'Draft',
            Elements: [],
            ExternalReference: null,
            ProofCorrelationId: null,
        });
    });
});

describe('delete', () => {
    it('should delete the document', async () => {
        const createDocumentResponse = await connectiveClient.packages.documents.create({
            PackageId: packageId,
            Document: {
                Elements: [],
                Name: 'Test document',
                Language: 'en',
                DocumentOptions: {
                    ContentType: 'application/pdf',
                    Base64data: documentBase64,
                },
            },
        });

        const deleteResponse = await connectiveClient.packages.documents.delete(
            packageId,
            createDocumentResponse.data.Id,
        );

        expect(deleteResponse.data).toBe('');

        const error: any = await jestGetErrorAsync(async () => {
            return connectiveClient.packages.documents.getById(
                packageId,
                createDocumentResponse.data.Id,
            );
        });
        expect(error.isAxiosError).toBe(true);
        expect(error.response.status).toBe(404);
    });
});

describe('download', () => {
    it('download a document of a Finished package as Buffer', async () => {
        const createPackageResponse = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Pending',
            Documents: [
                {
                    Name: 'Doc 1',
                    Language: 'en',
                    DocumentOptions: {
                        ContentType: 'application/pdf',
                        Base64data: documentBase64,
                    },
                },
            ],
        });
        packagesToDelete.push(createPackageResponse.data.Id);

        const downloadResponse = await connectiveClient.packages.documents.download(
            createPackageResponse.data.Id,
            createPackageResponse.data.Documents[0].Id,
            'arraybuffer',
        );

        expect(downloadResponse.data).toBeInstanceOf(Buffer);
    });
    it('download a document of a Finished package as Readable', async () => {
        const createPackageResponse = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Pending',
            Documents: [
                {
                    Name: 'Doc 1',
                    Language: 'en',
                    DocumentOptions: {
                        ContentType: 'application/pdf',
                        Base64data: documentBase64,
                    },
                },
            ],
        });
        packagesToDelete.push(createPackageResponse.data.Id);

        const downloadResponse = await connectiveClient.packages.documents.download(
            createPackageResponse.data.Id,
            createPackageResponse.data.Documents[0].Id,
            'stream',
        );

        expect(downloadResponse.data).toBeInstanceOf(Readable);
    });
});

describe('getById', () => {
    it('fetches a document', async () => {
        const createDocumentResponse = await connectiveClient.packages.documents.create({
            PackageId: packageId,
            Document: {
                Elements: [],
                Name: 'Test document',
                Language: 'en',
                DocumentOptions: {
                    ContentType: 'application/pdf',
                    Base64data: documentBase64,
                },
            },
        });

        const getDocumentResponse = await connectiveClient.packages.documents.getById(
            packageId,
            createDocumentResponse.data.Id,
        );

        expect(getDocumentResponse.data).toEqual<Document>({
            Id: createDocumentResponse.data.Id,
            PackageId: packageId,
            Name: 'Test document',
            IsOptional: false,
            CreationDate: createDocumentResponse.data.CreationDate,
            MediaType: 'application/pdf',
            Status: 'Draft',
            Elements: [],
            ExternalReference: null,
            ProofCorrelationId: null,
        });
    });
});

describe('getByOrderIndex', () => {
    it('fetches the correct document', async () => {
        const createPackageResponse = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Draft',
            Stakeholders: [
                {
                    Type: 'person',
                    EmailAddress: 'none@example.com',
                    Language: 'nl',
                    FirstName: 'First',
                    LastName: 'Last',
                },
            ],
        });
        packagesToDelete.push(createPackageResponse.data.Id);

        const createDocumentResponse = await connectiveClient.packages.documents.create({
            PackageId: createPackageResponse.data.Id,
            Document: {
                Elements: [],
                Name: 'Test document',
                Language: 'en',
                DocumentOptions: {
                    ContentType: 'application/pdf',
                    Base64data: documentBase64,
                },
            },
        });
        const getDocumentResponse = await connectiveClient.packages.documents.getByOrderIndex(
            createPackageResponse.data.Id,
            0,
        );

        expect(getDocumentResponse.data).toEqual<Document>({
            Id: createDocumentResponse.data.Id,
            PackageId: createPackageResponse.data.Id,
            Name: 'Test document',
            IsOptional: false,
            CreationDate: createDocumentResponse.data.CreationDate,
            MediaType: 'application/pdf',
            Status: 'Draft',
            Elements: [],
            ExternalReference: null,
            ProofCorrelationId: null,
        });
    });
});
