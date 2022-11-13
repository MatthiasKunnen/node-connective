import {randomUUID} from 'crypto';

import {Connective, CreatePackageInput, GetPackageByIdResponse} from '../src';
import {jestGetErrorAsync} from './jest.helper';
import {registerPackageSetUpAndTearDown, requireEnv} from './package.helper';

const initiator = requireEnv('CONNECTIVE_INITIATOR');
let connectiveClient: Connective;
const {packagesToDelete} = registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

describe('Create', () => {
    it('should create a draft package using a simple input', async () => {
        const createData: CreatePackageInput = {
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Draft',
        };

        const {data} = await connectiveClient.packages.create(createData);
        const packageId = data.Id;
        packagesToDelete.push(packageId);
        expect(typeof data.CreationDate).toBe('string');
        expect(new Date(data.CreationDate)).not.toBeNaN();

        data.CreationDate = '2022-10-28T12:32:39Z';

        expect(data).toEqual<GetPackageByIdResponse>({
            Id: packageId,
            Name: createData.Name,
            Status: 'Draft',
            CreationDate: '2022-10-28T12:32:39Z',
            ExpiryDate: null,
            Initiator: initiator,
            UnplacedElements: [],
            Documents: [],
            Stakeholders: [],
            DefaultLegalNotice: {
                Text: null,
            },
            ExternalReference: null,
            DocumentGroupCode: '00001',
            ThemeCode: '00001',
            DefaultRedirectUrl: null,
            CallBackUrl: null,
            NotificationCallBackUrl: null,
            F2fSigningUrl: null,
            PreviewUrl: null,
            F2fRedirectUrl: null,
            IsUnsignedContentDownloadable: false,
            ActionUrlExpirationPeriodInDays: null,
            ProofCorrelationId: null,
            AddInitiatorAsReceiver: false,
            Warnings: [],
            MustBeArchived: false,
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
        });
    });

    it('should create a draft package using an input with stakeholders', async () => {
        const createData: CreatePackageInput = {
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
        };

        const {data} = await connectiveClient.packages.create(createData);
        const packageId = data.Id;
        packagesToDelete.push(packageId);
        expect(typeof data.CreationDate).toBe('string');
        expect(new Date(data.CreationDate)).not.toBeNaN();

        data.CreationDate = '2022-10-28T12:32:39Z';

        expect(data).toEqual<GetPackageByIdResponse>({
            Id: packageId,
            Name: createData.Name,
            Status: 'Draft',
            CreationDate: '2022-10-28T12:32:39Z',
            ExpiryDate: null,
            Initiator: initiator,
            UnplacedElements: [],
            Documents: [],
            Stakeholders: [
                {
                    Type: 'person',
                    EmailAddress: 'none@example.com',
                    Language: 'nl',
                    FirstName: 'First',
                    LastName: 'Last',
                    Id: data.Stakeholders[0]?.Id,
                    PackageId: packageId,
                    Actors: [],
                },
            ],
            DefaultLegalNotice: {
                Text: null,
            },
            ExternalReference: null,
            DocumentGroupCode: '00001',
            ThemeCode: '00001',
            DefaultRedirectUrl: null,
            CallBackUrl: null,
            NotificationCallBackUrl: null,
            F2fSigningUrl: null,
            PreviewUrl: null,
            F2fRedirectUrl: null,
            IsUnsignedContentDownloadable: false,
            ActionUrlExpirationPeriodInDays: null,
            ProofCorrelationId: null,
            AddInitiatorAsReceiver: false,
            Warnings: [],
            MustBeArchived: false,
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
        });
    });
});

describe('getById', () => {
    it('returns the same package as create', async () => {
        const createData: CreatePackageInput = {
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Draft',
        };

        const createResponse = await connectiveClient.packages.create(createData);
        const packageId = createResponse.data.Id;
        packagesToDelete.push(packageId);

        const {data} = await connectiveClient.packages.getById(packageId);
        expect(typeof data.CreationDate).toBe('string');
        expect(new Date(data.CreationDate)).not.toBeNaN();

        data.CreationDate = '2022-10-28T12:32:39Z';

        expect(data).toEqual<GetPackageByIdResponse>({
            Id: packageId,
            Name: createData.Name,
            Status: 'Draft',
            CreationDate: '2022-10-28T12:32:39Z',
            ExpiryDate: null,
            Initiator: initiator,
            UnplacedElements: [],
            Documents: [],
            Stakeholders: [],
            DefaultLegalNotice: {
                Text: null,
            },
            ExternalReference: null,
            DocumentGroupCode: '00001',
            ThemeCode: '00001',
            DefaultRedirectUrl: null,
            CallBackUrl: null,
            NotificationCallBackUrl: null,
            F2fSigningUrl: null,
            PreviewUrl: null,
            F2fRedirectUrl: null,
            IsUnsignedContentDownloadable: false,
            ActionUrlExpirationPeriodInDays: null,
            ProofCorrelationId: null,
            AddInitiatorAsReceiver: false,
            Warnings: [],
            MustBeArchived: false,
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
        });
    });
});

describe('delete', () => {
    it('correctly deletes a package', async () => {
        const {data} = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Draft',
        });

        const deleteResponse = await connectiveClient.packages.delete(data.Id);

        expect(deleteResponse.status).toBe(204);
        expect(deleteResponse.data).toBe('');

        const error: any = await jestGetErrorAsync(async () => {
            return connectiveClient.packages.getById(data.Id);
        });
        expect(error.isAxiosError).toBe(true);
        expect(error.response.status).toBe(404);
    });
});
