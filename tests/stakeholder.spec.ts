import {randomUUID} from 'crypto';

import {Connective} from '../src';
import {
    CreateStakeholderContactGroupResponse,
    CreateStakeholderGroupResponse,
    CreateStakeholderPersonResponse,
} from '../src/packages/stakeholders/stakeholder.interface';
import {registerPackageSetUpAndTearDown, requireEnv} from './package.helper';

let connectiveClient: Connective;
const {packagesToDelete} = registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

let packageId: string;

beforeAll(async () => {
    const createPackageResponse = await connectiveClient.packages.create({
        Initiator: requireEnv('CONNECTIVE_INITIATOR'),
        Name: `Test-${randomUUID()}`,
        Status: 'Draft',
    });
    packageId = createPackageResponse.data.Id;
    packagesToDelete.push(packageId);
});

describe('Create stakeholder', () => {
    it('correctly adds a contact group stakeholder', async () => {
        const response = await connectiveClient.packages.stakeholders.create(packageId, {
            Type: 'contactgroup',
            ContactGroupCode: '00001',
            ExternalReference: 'ExternalRef',
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data.Members[0].EmailAddress).toBeDefined();
        expect(response.data).toEqual<CreateStakeholderContactGroupResponse>({
            Type: 'contactgroup',
            ContactGroupCode: '00001',
            Members: [
                {
                    Language: 'en',
                    FirstName: 'Test',
                    LastName: 'Account',
                    EmailAddress: response.data.Members[0].EmailAddress,
                    BirthDate: null,
                    PhoneNumber: null,
                    ExternalReference: null,
                    AdditionalProperties: {
                        BeId: '90020199704',
                    },
                },
            ],
            Id: response.data.Id,
            PackageId: packageId,
            Actors: [],
            ExternalReference: 'ExternalRef',
        });
    });

    it('correctly adds a group stakeholder', async () => {
        const response = await connectiveClient.packages.stakeholders.create(packageId, {
            Type: 'group',
            GroupName: 'GroupName',
            Members: [
                {
                    Language: 'en',
                    FirstName: 'First',
                    LastName: 'Last',
                    AdditionalProperties: {
                        BeId: '12345678900',
                    },
                    EmailAddress: 'noreply@example.com',
                    ExternalReference: 'ExternalRef',
                },
            ],
            ExternalReference: 'ExternalRef',
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data).toEqual<CreateStakeholderGroupResponse>({
            Type: 'group',
            GroupName: 'GroupName',
            Members: [
                {
                    Language: 'en',
                    FirstName: 'First',
                    LastName: 'Last',
                    EmailAddress: 'noreply@example.com',
                    BirthDate: null,
                    PhoneNumber: null,
                    ExternalReference: 'ExternalRef',
                    AdditionalProperties: {
                        BeId: '12345678900',
                    },
                },
            ],
            Id: response.data.Id,
            PackageId: packageId,
            Actors: [],
            ExternalReference: 'ExternalRef',
        });
    });

    it('correctly adds a person stakeholder', async () => {
        const response = await connectiveClient.packages.stakeholders.create(packageId, {
            Type: 'person',
            Language: 'en',
            FirstName: 'Test',
            LastName: 'Last',
            BirthDate: null,
            AdditionalProperties: {
                BeId: '12345678900',
            },
            EmailAddress: 'noreply@example.com',
            ExternalReference: 'ExternalRef',
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data).toEqual<CreateStakeholderPersonResponse>({
            Type: 'person',
            Language: 'en',
            FirstName: 'Test',
            LastName: 'Last',
            EmailAddress: 'noreply@example.com',
            PhoneNumber: null,
            BirthDate: null,
            AdditionalProperties: {
                BeId: '12345678900',
            },
            Id: response.data.Id,
            PackageId: packageId,
            Actors: [],
            ExternalReference: 'ExternalRef',
        });
    });

    it('should always return an object for AdditionalProperties', async () => {
        const response = await connectiveClient.packages.stakeholders.create(packageId, {
            Type: 'person',
            Language: 'en',
            FirstName: 'Test',
            LastName: 'Last',
            BirthDate: null,
            EmailAddress: 'noreply@example.com',
            ExternalReference: 'ExternalRef',
            AdditionalProperties: null,
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data.AdditionalProperties).toEqual({});
    });
});
