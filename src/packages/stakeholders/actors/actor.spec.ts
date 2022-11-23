import {randomUUID} from 'crypto';

import {jestGetErrorAsync} from '../../../../tests/jest.helper';
import {
    DocumentsStore,
    registerPackageSetUpAndTearDown,
    requireEnv,
} from '../../../../tests/package.helper';
import {
    Actor,
    ApproverActor,
    Connective,
    CreateActorParamsInput,
    ElementWithDocumentId,
    FormFillerActor,
    ReceiverActor,
    SignerActor,
} from '../../../index';

let connectiveClient: Connective;
const {packagesToDelete} = registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

let packageId: string;
let stakeholderId: string;
let documentBase64: string;
let documentId: string;

beforeAll(async () => {
    documentBase64 = await DocumentsStore.getSimpleDocumentBase64();
    const createPackageResponse = await connectiveClient.packages.create({
        Documents: [
            {
                Language: 'en',
                Name: 'Test actors document',
                DocumentOptions: {
                    ContentType: 'application/pdf',
                    Base64data: documentBase64,
                },
            },
        ],
        Initiator: requireEnv('CONNECTIVE_INITIATOR'),
        Name: `Test-actors-${randomUUID()}`,
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
    documentId = createPackageResponse.data.Documents[0].Id;
    stakeholderId = createPackageResponse.data.Stakeholders[0].Id;
    packagesToDelete.push(packageId);
});

describe('all', () => {
    it('should return all actors', async () => {
        const actorData: Array<CreateActorParamsInput<ElementWithDocumentId>> = [
            {
                BackButtonUrl: 'https://example.com/back1',
                Elements: [],
                RedirectUrl: 'https://example.com/redirect1',
                SuppressNotifications: true,
                Type: 'formFiller',
            },
            {
                BackButtonUrl: 'https://example.com/back2',
                Elements: [],
                RedirectUrl: 'https://example.com/redirect2',
                SuppressNotifications: true,
                Type: 'formFiller',
            },
        ];
        const stakeholderResponse = await connectiveClient.packages.stakeholders.create({
            PackageId: packageId,
            Stakeholder: {
                Type: 'person',
                EmailAddress: 'all-test@example.com',
                FirstName: 'FTest',
                LastName: 'LTest',
                Language: 'nl',
                Actors: actorData,
            },
        });
        const actorsResponse = await connectiveClient.packages.stakeholders.actors.all({
            PackageId: packageId,
            StakeholderId: stakeholderResponse.data.Id,
        });

        expect(actorsResponse.data.map(actor => actor.Type))
            .toEqual<Array<string>>(actorData.map(actor => actor.Type));

        expect(actorsResponse.data)
            .toEqual<Array<Actor>>(stakeholderResponse.data.Actors);
    });
});

describe('create', () => {
    it('correctly creates a formFiller', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                BackButtonUrl: 'https://example.com/back',
                Elements: [],
                RedirectUrl: 'https://example.com/redirect',
                SuppressNotifications: true,
                Type: 'formFiller',
            },
        });

        expect(data).toEqual<FormFillerActor>({
            Type: 'formFiller',
            Elements: [],
            RedirectUrl: 'https://example.com/redirect',
            RedirectType: null,
            BackButtonUrl: 'https://example.com/back',
            Result: null,
            Id: data.Id,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });

    it('correctly creates a formFiller with immediate redirect', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            Actor: {
                BackButtonUrl: 'https://example.com/back',
                Elements: [],
                RedirectType: 'Immediately',
                RedirectUrl: 'https://example.com/redirect',
                SuppressNotifications: true,
                Type: 'formFiller',
            },
            StakeholderId: stakeholderId,
        });

        expect(data).toEqual<FormFillerActor>({
            Type: 'formFiller',
            Elements: [],
            RedirectUrl: 'https://example.com/redirect',
            RedirectType: 'Immediately',
            BackButtonUrl: 'https://example.com/back',
            Result: null,
            Id: data.Id,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });

    it('correctly creates a formFiller with redirect after 5 seconds', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            Actor: {
                BackButtonUrl: 'https://example.com/back',
                Elements: [],
                RedirectType: 'AfterDelay',
                RedirectUrl: 'https://example.com/redirect',
                SuppressNotifications: true,
                Type: 'formFiller',
            },
            StakeholderId: stakeholderId,
        });

        expect(data).toEqual<FormFillerActor>({
            Type: 'formFiller',
            Elements: [],
            RedirectUrl: 'https://example.com/redirect',
            RedirectType: 'AfterDelay',
            BackButtonUrl: 'https://example.com/back',
            Result: null,
            Id: data.Id,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });

    it('correctly creates a formFiller with elements', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                Type: 'formFiller',
                BackButtonUrl: 'https://example.com/back',
                Elements: [
                    {
                        Type: 'textboxfield',
                        DocumentId: documentId,
                        Marker: 'txtbox01',
                        Name: 'Textbox 1',
                    },
                ],
                RedirectUrl: 'https://example.com/redirect',
                SuppressNotifications: true,
            },
        });

        expect(data).toEqual<FormFillerActor>({
            Type: 'formFiller',
            Elements: [
                {
                    ActorId: data.Id,
                    CharLimit: null,
                    CompletedDate: null,
                    DefaultValue: null,
                    Dimensions: {
                        Height: 50,
                        Width: 100,
                    },
                    ExternalReference: null,
                    Id: data.Elements[0].Id,
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
            RedirectUrl: 'https://example.com/redirect',
            RedirectType: null,
            BackButtonUrl: 'https://example.com/back',
            Result: null,
            Id: data.Id,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });

    it('correctly creates an approver', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                Type: 'approver',
                BackButtonUrl: 'https://example.com/back',
                RedirectUrl: 'https://example.com/redirect',
                SuppressNotifications: true,
            },
        });

        expect(data).toEqual<ApproverActor>({
            Type: 'approver',
            RedirectUrl: 'https://example.com/redirect',
            BackButtonUrl: 'https://example.com/back',
            Result: null,
            Id: data.Id,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });

    it('correctly creates a receiver', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                Type: 'receiver',
                SuppressNotifications: true,
            },
        });

        expect(data).toEqual<ReceiverActor>({
            Type: 'receiver',
            Id: data.Id,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });

    it('correctly creates a signer without elements', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                Type: 'signer',
                Elements: [],
                SuppressNotifications: true,
            },
        });

        expect(data).toEqual<SignerActor>({
            Type: 'signer',
            Id: data.Id,
            Elements: [],
            RedirectUrl: null,
            RedirectType: null,
            BackButtonUrl: null,
            Result: null,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });

    it('correctly creates a signer with elements', async () => {
        const {data} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                Type: 'signer',
                Elements: [
                    {
                        Type: 'signingfield',
                        Marker: 'SIG01',
                        DocumentId: documentId,
                    },
                ],
                SuppressNotifications: true,
            },
        });

        expect(data).toEqual<SignerActor>({
            Type: 'signer',
            Id: data.Id,
            Elements: [
                {
                    ActorId: data.Elements[0].ActorId,
                    CompletedDate: null,
                    Dimensions: {
                        Height: 200,
                        Width: 300,
                    },
                    ExternalReference: null,
                    Id: data.Elements[0].Id,
                    LegalNotice: {
                        Text: null,
                    },
                    Location: {
                        Left: 98,
                        Page: 1,
                        Top: 306,
                    },
                    SigningMethods: [],
                    Status: 'Pending',
                    Type: 'signingfield',
                    UsedSigningMethod: null,
                },
            ],
            RedirectUrl: null,
            RedirectType: null,
            BackButtonUrl: null,
            Result: null,
            SuppressNotifications: true,
            Status: 'Draft',
            Links: [],
            MemberLinks: [],
            ActionUrls: [],
        });
    });
});

describe('deleteById', () => {
    it('should delete the actor', async () => {
        const {data: createData} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                BackButtonUrl: 'https://example.com/back',
                Elements: [],
                RedirectUrl: 'https://example.com/redirect',
                SuppressNotifications: true,
                Type: 'formFiller',
            },
        });
        const deleteResponse = await connectiveClient.packages.stakeholders.actors.deleteById({
            ActorId: createData.Id,
            PackageId: packageId,
            StakeholderId: stakeholderId,
        });

        expect(deleteResponse.data).toBe('');

        const error: any = await jestGetErrorAsync(async () => {
            return connectiveClient.packages.stakeholders.actors.getById({
                ActorId: createData.Id,
                PackageId: packageId,
                StakeholderId: stakeholderId,
            });
        });
        expect(error.isAxiosError).toBe(true);
        expect(error.response.status).toBe(404);
    });
});

describe('getById', () => {
    it('should return same actor data as create', async () => {
        const {data: createData} = await connectiveClient.packages.stakeholders.actors.create({
            PackageId: packageId,
            StakeholderId: stakeholderId,
            Actor: {
                BackButtonUrl: 'https://example.com/back',
                Elements: [],
                RedirectUrl: 'https://example.com/redirect',
                SuppressNotifications: true,
                Type: 'formFiller',
            },
        });
        const {data: fetchData} = await connectiveClient.packages.stakeholders.actors.getById({
            ActorId: createData.Id,
            PackageId: packageId,
            StakeholderId: stakeholderId,
        });

        expect(createData).toEqual<Actor>(fetchData);
    });
});
