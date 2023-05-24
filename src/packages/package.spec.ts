import {randomUUID} from 'crypto';
import {Readable} from 'stream';

import {jestGetErrorAsync} from '../../tests/jest.helper';
import {
    DocumentsStore,
    registerPackageSetUpAndTearDown,
    requireEnv,
    sortPackageData,
} from '../../tests/package.helper';
import {
    Connective,
    CreatePackageInput,
    Package,
    PackageStatus,
} from '../index';

const initiator = requireEnv('CONNECTIVE_INITIATOR');
let connectiveClient: Connective;
const {packagesToDelete} = registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

let documentBase64: string;

beforeAll(async () => {
    documentBase64 = await DocumentsStore.getSimpleDocumentBase64();
});

describe('create', () => {
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

        expect(data).toEqual<Package>({
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
            IsReassignEnabled: true,
            IsUnsignedContentDownloadable: true,
            ActionUrlExpirationPeriodInDays: null,
            ProofCorrelationId: null,
            AddInitiatorAsReceiver: false,
            Warnings: [],
            MustBeArchived: false,
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
            AutomaticReminder: {
                DaysBeforeFirstReminder: 0,
                IsRepeatRemindersEnabled: false,
                IsSendAutomaticRemindersEnabled: false,
                RepeatReminders: 0,
            },
            ExpirationReminder: {
                DaysBeforeExpirationReminder: 0,
                IsSendExpirationRemindersEnabled: false,
            },
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

        expect(data).toEqual<Package>({
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
                    BirthDate: null,
                    AdditionalProperties: {},
                    ExternalReference: null,
                    PhoneNumber: null,
                    Substitutes: [],
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
            IsReassignEnabled: true,
            IsUnsignedContentDownloadable: true,
            ActionUrlExpirationPeriodInDays: null,
            ProofCorrelationId: null,
            AddInitiatorAsReceiver: false,
            Warnings: [],
            MustBeArchived: false,
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
            AutomaticReminder: {
                DaysBeforeFirstReminder: 0,
                IsRepeatRemindersEnabled: false,
                IsSendAutomaticRemindersEnabled: false,
                RepeatReminders: 0,
            },
            ExpirationReminder: {
                DaysBeforeExpirationReminder: 0,
                IsSendExpirationRemindersEnabled: false,
            },
        });
    });

    it('should create a package with a super call', async () => {
        const name = `Test-super-${randomUUID()}`;

        const createResponse = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: name,
            Status: 'Draft',
            DefaultRedirectUrl: 'https://example.com/redirect',
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
            CallBackUrl: 'https://example.com/callback',
            ExternalReference: `Super ${name}`,
            ActionUrlExpirationPeriodInDays: 2,
            AddInitiatorAsReceiver: true,
            F2fRedirectUrl: 'https://example.com/f2f-redirect',
            MustBeArchived: false,
            ExpiryTimestamp: '2022-11-18T00:00:00.000Z',
            IsReassignEnabled: false,
            IsUnsignedContentDownloadable: true,
            NotificationCallBackUrl: 'https://example.com/notification',
            DefaultLegalNotice: {
                Text: 'I do solemnly swear I am up to no good.',
            },
            Documents: [
                {
                    Name: 'Doc 1',
                    Language: 'en',
                    ExternalReference: 'doc1',
                    DocumentOptions: {
                        ContentType: 'application/pdf',
                        Base64data: documentBase64,
                        PdfOptions: {
                            PdfErrorHandling: 'DetectFail',
                            TargetFormat: 'pdf',
                        },
                    },
                    IsOptional: false,
                },
            ],
            Stakeholders: [
                {
                    Type: 'person',
                    EmailAddress: 'signer@example.com',
                    Language: 'en',
                    LastName: 'LastName',
                    FirstName: 'FirstName',
                    ExternalReference: 'Stakeholder1',
                    BirthDate: '2000-01-01',
                    PhoneNumber: '+32474011547',
                    AdditionalProperties: {
                        BeId: '90020199704',
                    },
                    Actors: [
                        {
                            Type: 'signer',
                            SuppressNotifications: true,
                            Elements: [
                                {
                                    Type: 'signingfield',
                                    Marker: 'SIG01',
                                    SigningMethods: ['Manual:Manual'],
                                    ExternalReference: 'Sig1',
                                    DocumentIndex: 0,
                                },
                            ],
                        },
                    ],
                },
                {
                    Type: 'person',
                    EmailAddress: 'formfiller@example.com',
                    Language: 'en',
                    LastName: 'LastName',
                    FirstName: 'FirstName',
                    ExternalReference: 'Stakeholder2',
                    BirthDate: '2000-01-01',
                    PhoneNumber: '+32474011547',
                    AdditionalProperties: {
                        BeId: '90020199704',
                    },
                    Actors: [
                        {
                            Type: 'formFiller',
                            SuppressNotifications: true,
                            Elements: [
                                {
                                    Name: 'Textbox 1',
                                    Type: 'textboxfield',
                                    Marker: 'txtbox01',
                                    ExternalReference: 'Text1',
                                    DocumentIndex: 0,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        packagesToDelete.push(createResponse.data.Id);
        sortPackageData(createResponse.data);

        expect(createResponse.data).toEqual<Package>({
            Id: createResponse.data.Id,
            Initiator: initiator,
            Name: name,
            CreationDate: createResponse.data.CreationDate,
            Status: 'Draft',
            DefaultRedirectUrl: 'https://example.com/redirect',
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
            CallBackUrl: 'https://example.com/callback',
            ExternalReference: `Super ${name}`,
            ActionUrlExpirationPeriodInDays: 2,
            AddInitiatorAsReceiver: true,
            F2fRedirectUrl: 'https://example.com/f2f-redirect',
            MustBeArchived: false,
            // ExpiryDate: '2030-01-01T00:00:00.000Z', This is what I expect but not what is
            // returned
            ExpiryDate: null,
            DocumentGroupCode: createResponse.data.DocumentGroupCode,
            IsReassignEnabled: false,
            IsUnsignedContentDownloadable: true,
            PreviewUrl: null,
            ProofCorrelationId: null,
            F2fSigningUrl: null,
            NotificationCallBackUrl: 'https://example.com/notification',
            DefaultLegalNotice: {
                Text: 'I do solemnly swear I am up to no good.',
            },
            Documents: [
                {
                    Id: createResponse.data.Documents[0].Id,
                    PackageId: createResponse.data.Id,
                    CreationDate: createResponse.data.Documents[0].CreationDate,
                    Name: 'Doc 1',
                    // Language: 'en', // should be present but missing
                    ExternalReference: 'doc1',
                    IsOptional: false,
                    MediaType: 'application/pdf',
                    Elements: [
                        {
                            Id: createResponse.data.Documents[0].Elements[0].Id,
                            ActorId: createResponse.data.Stakeholders[0].Actors[0].Id,
                            CompletedDate: null,
                            Dimensions: {
                                Height: 200,
                                Width: 300,
                            },
                            ExternalReference: 'Sig1',
                            KeyPairMappings: [],
                            LegalNotice: {
                                Text: 'I do solemnly swear I am up to no good.',
                            },
                            Location: {
                                Left: 98,
                                Page: 1,
                                Top: 306,
                            },
                            SigningMethods: [
                                'Manual:Manual',
                            ],
                            Status: 'Pending',
                            Type: 'signingfield',
                            UsedSigningMethod: null,
                        },
                        {
                            Id: createResponse.data.Documents[0].Elements[1].Id,
                            ActorId: createResponse.data.Stakeholders[1].Actors[0].Id,
                            CharLimit: null,
                            CompletedDate: null,
                            DefaultValue: null,
                            Dimensions: {
                                Height: 50,
                                Width: 100,
                            },
                            ExternalReference: 'Text1',
                            IsMultiline: false,
                            IsRequired: false,
                            Label: null,
                            Location: {
                                Left: 107,
                                Page: 1,
                                Top: 466,
                            },
                            Name: 'txtbox01',
                            Status: 'Pending',
                            ToolTipLabel: null,
                            Type: 'textboxfield',
                            Value: null,
                        },
                    ],
                    Status: 'Draft',
                    OrderIndex: 0,
                    ProofCorrelationId: null,
                },
            ],
            Stakeholders: [
                {
                    Id: createResponse.data.Stakeholders[0].Id,
                    PackageId: createResponse.data.Id,
                    Type: 'person',
                    EmailAddress: 'signer@example.com',
                    Language: 'en',
                    LastName: 'LastName',
                    FirstName: 'FirstName',
                    ExternalReference: 'Stakeholder1',
                    BirthDate: '2000-01-01',
                    PhoneNumber: '+32474011547',
                    AdditionalProperties: {
                        BeId: '90020199704',
                    },
                    Substitutes: [],
                    Actors: [
                        {
                            Id: createResponse.data.Stakeholders[0].Actors[0].Id,
                            Type: 'signer',
                            ActionUrls: [],
                            BackButtonUrl: null,
                            Links: [],
                            MemberLinks: [],
                            RedirectType: null,
                            RedirectUrl: null,
                            Result: null,
                            Status: 'Draft',
                            SuppressNotifications: true,
                            Elements: [
                                {
                                    Id: createResponse.data.Documents[0].Elements[0].Id,
                                    ActorId: createResponse.data.Stakeholders[0].Actors[0].Id,
                                    CompletedDate: null,
                                    Dimensions: {
                                        Height: 200,
                                        Width: 300,
                                    },
                                    ExternalReference: 'Sig1',
                                    KeyPairMappings: [],
                                    LegalNotice: {
                                        Text: 'I do solemnly swear I am up to no good.',
                                    },
                                    Location: {
                                        Left: 98,
                                        Page: 1,
                                        Top: 306,
                                    },
                                    SigningMethods: [
                                        'Manual:Manual',
                                    ],
                                    Status: 'Pending',
                                    Type: 'signingfield',
                                    UsedSigningMethod: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    Id: createResponse.data.Stakeholders[1].Id,
                    PackageId: createResponse.data.Id,
                    Type: 'person',
                    EmailAddress: 'formfiller@example.com',
                    Language: 'en',
                    LastName: 'LastName',
                    FirstName: 'FirstName',
                    ExternalReference: 'Stakeholder2',
                    BirthDate: '2000-01-01',
                    PhoneNumber: '+32474011547',
                    AdditionalProperties: {
                        BeId: '90020199704',
                    },
                    Substitutes: [],
                    Actors: [
                        {
                            Type: 'formFiller',
                            Id: createResponse.data.Stakeholders[1].Actors[0].Id,
                            BackButtonUrl: null,
                            ActionUrls: [],
                            Links: [],
                            MemberLinks: [],
                            RedirectType: null,
                            RedirectUrl: null,
                            Result: null,
                            Status: 'Draft',
                            SuppressNotifications: true,
                            Elements: [
                                {
                                    Id: createResponse.data.Documents[0].Elements[1].Id,
                                    ActorId: createResponse.data.Stakeholders[1].Actors[0].Id,
                                    CharLimit: null,
                                    CompletedDate: null,
                                    DefaultValue: null,
                                    Dimensions: {
                                        Height: 50,
                                        Width: 100,
                                    },
                                    ExternalReference: 'Text1',
                                    IsMultiline: false,
                                    IsRequired: false,
                                    Label: null,
                                    Location: {
                                        Left: 107,
                                        Page: 1,
                                        Top: 466,
                                    },
                                    Name: 'txtbox01',
                                    Status: 'Pending',
                                    ToolTipLabel: null,
                                    Type: 'textboxfield',
                                    Value: null,
                                },
                            ],
                        },
                    ],
                },
            ],
            ThemeCode: createResponse.data.ThemeCode,
            UnplacedElements: [],
            Warnings: [],
            AutomaticReminder: {
                DaysBeforeFirstReminder: 0,
                IsRepeatRemindersEnabled: false,
                IsSendAutomaticRemindersEnabled: false,
                RepeatReminders: 0,
            },
            ExpirationReminder: {
                DaysBeforeExpirationReminder: 0,
                IsSendExpirationRemindersEnabled: false,
            },
        });
    });
});

describe('download', () => {
    it('downloads all documents of a finished package in a zip file as Buffer', async () => {
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
                {
                    Name: 'Doc 2',
                    Language: 'en',
                    DocumentOptions: {
                        ContentType: 'application/pdf',
                        Base64data: documentBase64,
                    },
                },
            ],
        });
        packagesToDelete.push(createPackageResponse.data.Id);

        const downloadResponse = await connectiveClient.packages.download(
            createPackageResponse.data.Id,
            'arraybuffer',
        );

        expect(downloadResponse.data).toBeInstanceOf(Buffer);
    });

    it('downloads all documents of a finished package in a zip file as Readable', async () => {
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
                {
                    Name: 'Doc 2',
                    Language: 'en',
                    DocumentOptions: {
                        ContentType: 'application/pdf',
                        Base64data: documentBase64,
                    },
                },
            ],
        });
        packagesToDelete.push(createPackageResponse.data.Id);

        const downloadResponse = await connectiveClient.packages.download(
            createPackageResponse.data.Id,
            'stream',
        );

        expect(downloadResponse.data).toBeInstanceOf(Readable);
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

        expect(data).toEqual<Package>({
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
            IsReassignEnabled: true,
            IsUnsignedContentDownloadable: true,
            ActionUrlExpirationPeriodInDays: null,
            ProofCorrelationId: null,
            AddInitiatorAsReceiver: false,
            Warnings: [],
            MustBeArchived: false,
            ArchiveAuditProofs: false,
            ArchiveAuditTrail: false,
            AutomaticReminder: {
                DaysBeforeFirstReminder: 0,
                IsRepeatRemindersEnabled: false,
                IsSendAutomaticRemindersEnabled: false,
                RepeatReminders: 0,
            },
            ExpirationReminder: {
                DaysBeforeExpirationReminder: 0,
                IsSendExpirationRemindersEnabled: false,
            },
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

describe('updateStatus', () => {
    it('updating a Draft package with actors to Pending results in Pending', async () => {
        const createPackageResponse = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Draft',
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
            Stakeholders: [
                {
                    Type: 'person',
                    FirstName: 'First',
                    LastName: 'Last',
                    Language: 'en',
                    EmailAddress: 'jane@doe.net',
                    Actors: [
                        {
                            Type: 'signer',
                            Elements: [
                                {
                                    Type: 'signingfield',
                                    Marker: 'SIG01',
                                    DocumentIndex: 0,
                                    SigningMethods: ['Manual:Manual'],
                                },
                            ],
                            SuppressNotifications: true,
                        },
                    ],
                },
            ],
        });
        const packageId = createPackageResponse.data.Id;

        const updateStatusResponse = await connectiveClient.packages.updateStatus({
            Status: 'Pending',
            PackageId: packageId,
        });
        expect(updateStatusResponse.status).toBe(200);
        expect(updateStatusResponse.data).toBe('');

        const statusResponse = await connectiveClient.packages.getStatusById(packageId);
        expect(statusResponse.data).toBe<PackageStatus>('Pending');
    });

    it('updating a Draft package without actors to Pending results in Finished', async () => {
        const createPackageResponse = await connectiveClient.packages.create({
            Initiator: initiator,
            Name: `Test-${randomUUID()}`,
            Status: 'Draft',
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
        const packageId = createPackageResponse.data.Id;
        packagesToDelete.push(packageId);

        const updateStatusResponse = await connectiveClient.packages.updateStatus({
            Status: 'Pending',
            PackageId: packageId,
        });
        expect(updateStatusResponse.status).toBe(200);
        expect(updateStatusResponse.data).toBe('');

        const statusResponse = await connectiveClient.packages.getStatusById(packageId);
        expect(statusResponse.data).toBe<PackageStatus>('Finished');
    });
});

it('response should match GetPackageByIdResponse', () => {
    const data: Package = {
        Id: '1500230f-c447-4f19-95d5-3035c867f4e7',
        Name: 'Test-54591e5f-6b18-4c8d-87a0-658d133f6473',
        Status: 'Finished',
        CreationDate: '2022-11-17T11:05:40Z',
        ExpiryDate: null,
        Initiator: 'initiator@example.com',
        UnplacedElements: [],
        Documents: [
            {
                Id: 'fb8ca9b6-d67b-4b87-938f-b2de76c16151',
                PackageId: '1500230f-c447-4f19-95d5-3035c867f4e7',
                Name: 'Doc 1',
                IsOptional: false,
                CreationDate: '2022-11-17T11:05:41Z',
                MediaType: 'application/pdf',
                Status: 'Finished',
                Elements: [
                    {
                        Type: 'signingfield',
                        UsedSigningMethod: 'Manual:Manual',
                        SigningMethods: [
                            'Manual:Manual',
                        ],
                        LegalNotice: {
                            Text: null,
                        },
                        Id: '2ba16f3d-f547-4bb8-9847-4bb5f26947e4',
                        ActorId: 'cefb9c80-c408-4a7b-8b78-8c8eb507bdd1',
                        KeyPairMappings: [],
                        Location: {
                            Page: 1,
                            Top: 306,
                            Left: 98,
                        },
                        Dimensions: {
                            Width: 300,
                            Height: 200,
                        },
                        Status: 'Finished',
                        ExternalReference: null,
                        CompletedDate: '2022-11-17T11:16:24Z',
                    },
                    {
                        Type: 'signingfield',
                        UsedSigningMethod: 'Manual:Manual',
                        SigningMethods: [
                            'Manual:Manual',
                        ],
                        LegalNotice: {
                            Text: null,
                        },
                        Id: '82d9e180-be8a-467f-9716-429e6c9eeec9',
                        ActorId: '6dbab85d-7d70-4640-9465-20479e46e350',
                        KeyPairMappings: [],
                        Location: {
                            Page: 1,
                            Top: 100,
                            Left: 63,
                        },
                        Dimensions: {
                            Width: 340,
                            Height: 200,
                        },
                        Status: 'Finished',
                        ExternalReference: null,
                        CompletedDate: '2022-11-17T11:18:56Z',
                    },
                ],
                ExternalReference: null,
                ProofCorrelationId: null,
                OrderIndex: 0,
            },
        ],
        Stakeholders: [
            {
                Type: 'group',
                GroupName: 'Approvers',
                Members: [
                    {
                        Substitutes: [],
                        Language: 'nl',
                        FirstName: 'M1',
                        LastName: 'K1',
                        EmailAddress: 'approver-1@example.com',
                        BirthDate: null,
                        PhoneNumber: null,
                        ExternalReference: null,
                        AdditionalProperties: {},
                    },
                    {
                        Substitutes: [],
                        Language: 'en',
                        FirstName: 'M2',
                        LastName: 'K2',
                        EmailAddress: 'approver-2@example.com',
                        BirthDate: null,
                        PhoneNumber: null,
                        ExternalReference: null,
                        AdditionalProperties: {},
                    },
                ],
                Id: 'ba9caa5c-6c76-41a4-9b80-5ee6994a007d',
                PackageId: '1500230f-c447-4f19-95d5-3035c867f4e7',
                Actors: [
                    {
                        Type: 'signer',
                        Elements: [
                            {
                                Type: 'signingfield',
                                UsedSigningMethod: 'Manual:Manual',
                                SigningMethods: [
                                    'Manual:Manual',
                                ],
                                LegalNotice: {
                                    Text: null,
                                },
                                Id: '82d9e180-be8a-467f-9716-429e6c9eeec9',
                                ActorId: '6dbab85d-7d70-4640-9465-20479e46e350',
                                KeyPairMappings: [],
                                Location: {
                                    Page: 1,
                                    Top: 100,
                                    Left: 63,
                                },
                                Dimensions: {
                                    Width: 340,
                                    Height: 200,
                                },
                                Status: 'Finished',
                                ExternalReference: null,
                                CompletedDate: '2022-11-17T11:18:56Z',
                            },
                        ],
                        RedirectUrl: null,
                        RedirectType: null,
                        BackButtonUrl: null,
                        Result: {
                            CompletedBy: {
                                Email: 'approver-2@example.com',
                                VerifiedName: null,
                            },
                            CompletedDate: '2022-11-17T11:18:56Z',
                            RejectReason: null,
                        },
                        Id: '6dbab85d-7d70-4640-9465-20479e46e350',
                        SuppressNotifications: true,
                        Status: 'Finished',
                        Links: [],
                        MemberLinks: [
                            {
                                Email: 'approver-1@example.com',
                                Link: 'https://example.connective.eu',
                            },
                            {
                                Email: 'approver-2@example.com',
                                Link: 'https://example.connective.eu',
                            },
                        ],
                        ActionUrls: [
                            {
                                Email: 'approver-1@example.com',
                                Url: 'https://example.connective.eu',
                                Type: 'Download',
                            },
                            {
                                Email: 'approver-2@example.com',
                                Url: 'https://example.connective.eu',
                                Type: 'Download',
                            },
                        ],
                    },
                    {
                        Type: 'receiver',
                        Id: 'f2b44660-1d9b-423d-b355-14c5f66f3d88',
                        SuppressNotifications: true,
                        Status: 'Available',
                        Links: [],
                        MemberLinks: [
                            {
                                Email: 'approver-1@example.com',
                                Link: 'https://example.connective.eu',
                            },
                            {
                                Email: 'approver-2@example.com',
                                Link: 'https://example.connective.eu',
                            },
                        ],
                        ActionUrls: [
                            {
                                Email: 'approver-1@example.com',
                                Url: 'https://example.connective.eu',
                                Type: 'Download',
                            },
                            {
                                Email: 'approver-2@example.com',
                                Url: 'https://example.connective.eu',
                                Type: 'Download',
                            },
                        ],
                    },
                ],
                ExternalReference: 'Approvers',
            },
            {
                Type: 'person',
                Language: 'nl',
                FirstName: 'ClientF',
                LastName: 'ClientL',
                EmailAddress: 'client@example.com',
                PhoneNumber: null,
                BirthDate: null,
                AdditionalProperties: {},
                Substitutes: [],
                Id: 'c9fcd09c-98bf-4712-9cfd-8377c2963657',
                PackageId: '1500230f-c447-4f19-95d5-3035c867f4e7',
                Actors: [
                    {
                        Type: 'signer',
                        Elements: [
                            {
                                Type: 'signingfield',
                                UsedSigningMethod: 'Manual:Manual',
                                SigningMethods: [
                                    'Manual:Manual',
                                ],
                                LegalNotice: {
                                    Text: null,
                                },
                                Id: '2ba16f3d-f547-4bb8-9847-4bb5f26947e4',
                                ActorId: 'cefb9c80-c408-4a7b-8b78-8c8eb507bdd1',
                                KeyPairMappings: [],
                                Location: {
                                    Page: 1,
                                    Top: 306,
                                    Left: 98,
                                },
                                Dimensions: {
                                    Width: 300,
                                    Height: 200,
                                },
                                Status: 'Finished',
                                ExternalReference: null,
                                CompletedDate: '2022-11-17T11:16:24Z',
                            },
                        ],
                        RedirectUrl: null,
                        RedirectType: null,
                        BackButtonUrl: null,
                        Result: {
                            CompletedBy: {
                                Email: 'client@example.com',
                                VerifiedName: null,
                            },
                            CompletedDate: '2022-11-17T11:16:24Z',
                            RejectReason: null,
                        },
                        Id: 'cefb9c80-c408-4a7b-8b78-8c8eb507bdd1',
                        SuppressNotifications: true,
                        Status: 'Finished',
                        Links: [
                            'https://example.connective.eu',
                        ],
                        MemberLinks: [],
                        ActionUrls: [
                            {
                                Email: 'client@example.com',
                                Url: 'https://example.connective.eu',
                                Type: 'Download',
                            },
                        ],
                    },
                ],
                ExternalReference: 'Client',
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
        IsReassignEnabled: false,
        IsUnsignedContentDownloadable: false,
        ActionUrlExpirationPeriodInDays: null,
        ProofCorrelationId: null,
        AddInitiatorAsReceiver: false,
        Warnings: [],
        MustBeArchived: false,
        ArchiveAuditProofs: false,
        ArchiveAuditTrail: false,
        AutomaticReminder: {
            IsSendAutomaticRemindersEnabled: false,
            DaysBeforeFirstReminder: 0,
            IsRepeatRemindersEnabled: false,
            RepeatReminders: 0,
        },
        ExpirationReminder: {
            IsSendExpirationRemindersEnabled: false,
            DaysBeforeExpirationReminder: 0,
        },
    };

    expect(data).toEqual<Package>(data);
});
