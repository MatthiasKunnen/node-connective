import {randomUUID} from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import {Connective} from '../src';
import {
    CreateApproverActorResponse,
    CreateReceiverActorResponse,
    CreateSignerActorResponse,
} from '../src/packages/stakeholders/actors/actors.interface';
import {registerPackageSetUpAndTearDown, requireEnv} from './package.helper';

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
    const testDocumentFilename = path.join(__dirname, 'simple.pdf');
    documentBase64 = (await fs.promises.readFile(testDocumentFilename)).toString('base64');
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

describe('Create actor', () => {
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

        expect(data).toEqual({
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

        expect(data).toEqual({
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

        expect(data).toEqual({
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

        expect(data).toEqual<CreateApproverActorResponse>({
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

        expect(data).toEqual<CreateReceiverActorResponse>({
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

        expect(data).toEqual<CreateSignerActorResponse>({
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

        expect(data).toEqual<CreateSignerActorResponse>({
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
});

describe('getById', () => {
    it('should get', async () => {

    });
});
