import {randomUUID} from 'crypto';

import {registerPackageSetUpAndTearDown, requireEnv} from '../../../tests/package.helper';
import {
    Connective,
    CreateStakeholderPersonInput,
    ElementWithDocumentIndex,
    Stakeholder,
    StakeholderContactGroup,
    StakeholderGroup,
    StakeholderPerson,
} from '../../index';
import {Noop} from '../../utils/types';

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

describe('all', () => {
    it('should return all stakeholders', async () => {
        const stakeholderCreateData: Array<
            CreateStakeholderPersonInput<ElementWithDocumentIndex>
        > = [
            {
                Type: 'person',
                Language: 'en',
                FirstName: '1',
                LastName: 'Last',
                EmailAddress: 'noreply@example.com',
                ExternalReference: '1',
            },
            {
                Type: 'person',
                Language: 'en',
                FirstName: '2',
                LastName: 'Last',
                EmailAddress: 'noreply2@example.com',
                ExternalReference: '2',
            },
        ];

        const createPackageResponse = await connectiveClient.packages.create({
            Initiator: requireEnv('CONNECTIVE_INITIATOR'),
            Name: `Test-stakeholders-all-${randomUUID()}`,
            Status: 'Draft',
            Stakeholders: stakeholderCreateData,
        });

        packagesToDelete.push(createPackageResponse.data.Id);
        const {data: allStakeholders} = await connectiveClient.packages.stakeholders.all(
            createPackageResponse.data.Id,
        );

        allStakeholders.sort((a, b) => {
            if (a.ExternalReference == null || b.ExternalReference == null) {
                return 1;
            }
            return a.ExternalReference.localeCompare(b.ExternalReference);
        });

        expect(allStakeholders.map(s => s.Type))
            .toEqual<Array<string>>(stakeholderCreateData.map(s => s.Type));
        expect(allStakeholders.map(s => s.ExternalReference))
            .toEqual<Array<any>>(stakeholderCreateData.map(s => s.ExternalReference));
        expect(allStakeholders.map((s: any) => s.EmailAddress))
            .toEqual<Array<string>>(stakeholderCreateData.map(s => s.EmailAddress));
    });
});

describe('create', () => {
    it('correctly adds a contact group stakeholder', async () => {
        const response = await connectiveClient.packages.stakeholders.create({
            PackageId: packageId,
            Stakeholder: {
                Type: 'contactgroup',
                ContactGroupCode: '00001',
                ExternalReference: 'ExternalRef',
            },
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data.Members[0].EmailAddress).toBeDefined();
        expect(response.data).toEqual<StakeholderContactGroup>({
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
                    Substitutes: [],
                },
            ],
            Id: response.data.Id,
            PackageId: packageId,
            Actors: [],
            ExternalReference: 'ExternalRef',
        });
    });

    it('correctly adds a group stakeholder', async () => {
        const response = await connectiveClient.packages.stakeholders.create({
            PackageId: packageId,
            Stakeholder: {
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
            },
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data).toEqual<StakeholderGroup>({
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
                    Substitutes: [],
                },
            ],
            Id: response.data.Id,
            PackageId: packageId,
            Actors: [],
            ExternalReference: 'ExternalRef',
        });
    });

    it('correctly adds a person stakeholder', async () => {
        const response = await connectiveClient.packages.stakeholders.create({
            PackageId: packageId,
            Stakeholder: {
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
            },
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data).toEqual<StakeholderPerson>({
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
            Substitutes: [],
        });
    });

    it('should always return an object for AdditionalProperties', async () => {
        const response = await connectiveClient.packages.stakeholders.create({
            PackageId: packageId,
            Stakeholder: {
                Type: 'person',
                Language: 'en',
                FirstName: 'Test',
                LastName: 'Last',
                BirthDate: null,
                EmailAddress: 'noreply@example.com',
                ExternalReference: 'ExternalRef',
                AdditionalProperties: null,
            },
        });

        expect(response.data.Id).toBeDefined();
        expect(response.data.AdditionalProperties)
            .toEqual<CreateStakeholderPersonInput<Noop>['AdditionalProperties']>({});
    });
});

describe('getById', () => {
    it('should fetch the stakeholder by id', async () => {
        const createStakeholderResponse = await connectiveClient.packages.stakeholders.create({
            PackageId: packageId,
            Stakeholder: {
                Type: 'person',
                Language: 'en',
                FirstName: 'Test',
                LastName: 'Last',
                EmailAddress: 'noreply@example.com',
            },
        });

        const fetchResponse = await connectiveClient.packages.stakeholders.getById({
            PackageId: packageId,
            StakeholderId: createStakeholderResponse.data.Id,
        });

        expect(fetchResponse.data).toEqual<Stakeholder>({
            Actors: [],
            AdditionalProperties: {},
            BirthDate: null,
            EmailAddress: 'noreply@example.com',
            ExternalReference: null,
            FirstName: 'Test',
            Id: fetchResponse.data.Id,
            Language: 'en',
            LastName: 'Last',
            PackageId: packageId,
            PhoneNumber: null,
            Type: 'person',
            Substitutes: [],
        });
    });
});
