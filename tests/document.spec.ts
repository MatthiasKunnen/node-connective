import {randomUUID} from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import {Connective} from '../src';
import {
    AddDocumentResponse,
    GetDocumentByIdResponse,
} from '../src/packages/documents/document.interface';
import {jestGetErrorAsync} from './jest.helper';
import {registerPackageSetUpAndTearDown, requireEnv} from './package.helper';

let connectiveClient: Connective;
const {packagesToDelete} = registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

let packageId: string;
let documentBase64: string;
const initiator = requireEnv('CONNECTIVE_INITIATOR')

beforeAll(async () => {
    const testDocumentFilename = path.join(__dirname, 'simple.pdf');
    documentBase64 = (await fs.promises.readFile(testDocumentFilename)).toString('base64');

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

        expect(createDocumentResponse.data).toEqual<AddDocumentResponse>({
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

        expect(getDocumentResponse.data).toEqual<GetDocumentByIdResponse>({
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

        expect(getDocumentResponse.data).toEqual<GetDocumentByIdResponse>({
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
