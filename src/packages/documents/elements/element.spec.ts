import {randomUUID} from 'crypto';

import {jestGetErrorAsync} from '../../../../tests/jest.helper';
import {
    DocumentsStore,
    registerPackageSetUpAndTearDown,
    requireEnv,
} from '../../../../tests/package.helper';
import {
    Connective,
    CreateCheckboxFieldOutput,
    CreateElementOutput,
    CreateRadioGroupOutput,
    CreateSigningFieldOutput,
    CreateTextBoxFieldOutput,
} from '../../../index';

let connectiveClient: Connective;
const {packagesToDelete} = registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

let packageId: string;
let documentId: string;
let documentBase64: string;

beforeAll(async () => {
    documentBase64 = await DocumentsStore.getSimpleDocumentBase64();

    const createPackageResponse = await connectiveClient.packages.create({
        Initiator: requireEnv('CONNECTIVE_INITIATOR'),
        Name: `Test-${randomUUID()}`,
        Documents: [
            {
                Name: 'test doc',
                Language: 'en',
                DocumentOptions: {
                    ContentType: 'application/pdf',
                    Base64data: documentBase64,
                },
            },
        ],
        Status: 'Draft',
    });
    packageId = createPackageResponse.data.Id;
    documentId = createPackageResponse.data.Documents[0].Id;
    packagesToDelete.push(packageId);
});

describe('createCheckbox', () => {
    it('should create a checkbox with a location', async () => {
        const response = await connectiveClient.packages.elements.createCheckBoxField({
            PackageId: packageId,
            DocumentId: documentId,
            Element: {
                Type: 'checkboxfield',
                Location: {Page: 1, Top: 466, Left: 107},
                Dimensions: {Width: 100, Height: 50},
                ToolTipLabel: 'Tooltip',
                DefaultValue: true,
                IsRequired: true,
                Label: 'lblManualTextbox1',
                Name: 'Manual checkbox 01',
                ExternalReference: 'ManualCheck1',
            },
        });

        expect(response.data).toEqual<CreateCheckboxFieldOutput>({
            Type: 'checkboxfield',
            DefaultValue: true,
            Checked: false,
            Name: 'Manual checkbox 01',
            Label: 'lblManualTextbox1',
            ToolTipLabel: 'Tooltip',
            IsRequired: true,
            Id: response.data.Id,
            ActorId: response.data.ActorId,
            Location: {
                Page: 1,
                Top: 466,
                Left: 107,
            },
            Dimensions: {
                Width: 100,
                Height: 50,
            },
            Status: 'Pending',
            ExternalReference: 'ManualCheck1',
            CompletedDate: null,
        });
    });
});

describe('createRadioGroup', () => {
    it('should create a radio group with a location', async () => {
        const response = await connectiveClient.packages.elements.createRadioGroup({
            PackageId: packageId,
            DocumentId: documentId,
            Element: {
                Type: 'radiogroup',
                Name: 'Manual radio group',
                Options: [
                    {
                        Name: 'one',
                        ToolTipLabel: 'RadioGroup one tooltip',
                        Label: 'RadioGroup one label',
                        IsSelected: false,
                        Location: {
                            Page: 1,
                            Top: 700.0,
                            Left: 10.0,
                        },
                        Dimensions: {
                            Width: 18.0,
                            Height: 18.0,
                        },
                    },
                    {
                        Name: 'two',
                        ToolTipLabel: 'RadioGroup two tooltip',
                        Label: 'RadioGroup two label',
                        IsSelected: false,
                        Location: {
                            Page: 1,
                            Top: 700.0,
                            Left: 30.0,
                        },
                        Dimensions: {
                            Width: 18.0,
                            Height: 18.0,
                        },
                    },
                ],
                ToolTipLabel: 'Make a choice',
                IsRequired: true,
            },
        });

        if (response.data.Options != null) {
            response.data.Options = response.data.Options.sort((a, b) => {
                return a.Name.localeCompare(b.Name);
            });
        }

        expect(response.data).toEqual<CreateRadioGroupOutput>({
            Type: 'radiogroup',
            Selected: 'one',
            Options: [
                {
                    Name: 'one',
                    Label: 'RadioGroup one label',
                    IsSelected: true,
                    Location: {
                        Page: 1,
                        Top: 700,
                        Left: 10,
                    },
                    Dimensions: {
                        Width: 18,
                        Height: 18,
                    },
                },
                {
                    Name: 'two',
                    Label: 'RadioGroup two label',
                    IsSelected: false,
                    Location: {
                        Page: 1,
                        Top: 700,
                        Left: 30,
                    },
                    Dimensions: {
                        Width: 18,
                        Height: 18,
                    },
                },
            ],
            Name: 'Manual radio group',
            Label: null,
            ToolTipLabel: 'Make a choice',
            IsRequired: true,
            Id: response.data.Id,
            ActorId: response.data.ActorId,
            Status: 'Pending',
            ExternalReference: null,
            CompletedDate: null,
        });
    });
});

describe('createSigningField', () => {
    it('should create a signing field with a location', async () => {
        const response = await connectiveClient.packages.elements.createSigningField({
            DocumentId: documentId,
            PackageId: packageId,
            Element: {
                Type: 'signingfield',
                SigningMethods: ['SmartCard:BeIDManual'],
                LegalNotice: {
                    Text: 'Legalese here',
                },
                Location: {
                    Page: 1,
                    Left: 63,
                    Top: 270,
                },
                Dimensions: {
                    Width: 340,
                    Height: 300,
                },
                ExternalReference: 'ManualLocation1',
            },
        });

        expect(response.data).toEqual<CreateSigningFieldOutput>({
            Type: 'signingfield',
            UsedSigningMethod: null,
            SigningMethods: [
                'SmartCard:BeIDManual',
            ],
            LegalNotice: {
                Text: 'Legalese here',
            },
            Id: response.data.Id,
            KeyPairMappings: [],
            ActorId: response.data.ActorId,
            Location: {
                Page: 1,
                Top: 270,
                Left: 63,
            },
            Dimensions: {
                Width: 340,
                Height: 300,
            },
            Status: 'Pending',
            ExternalReference: 'ManualLocation1',
            CompletedDate: null,
        });
    });

    it('should create a signing field with a marker', async () => {
        const response = await connectiveClient.packages.elements.createSigningField({
            DocumentId: documentId,
            PackageId: packageId,
            Element: {
                Type: 'signingfield',
                SigningMethods: ['SmartCard:BeIDManual'],
                LegalNotice: {
                    Text: 'Legalese here',
                },
                Marker: 'SIG01',
                ExternalReference: 'MarkerSig1',
            },
        });

        expect(response.data).toEqual<CreateSigningFieldOutput>({
            Type: 'signingfield',
            UsedSigningMethod: null,
            SigningMethods: [
                'SmartCard:BeIDManual',
            ],
            LegalNotice: {
                Text: 'Legalese here',
            },
            Id: response.data.Id,
            KeyPairMappings: [],
            ActorId: response.data.ActorId,
            Location: {
                Left: 98,
                Page: 1,
                Top: 306,
            },
            Dimensions: {
                Height: 200,
                Width: 300,
            },
            Status: 'Pending',
            ExternalReference: 'MarkerSig1',
            CompletedDate: null,
        });
    });
});

describe('createTextBoxField', () => {
    it('should create a textbox field with a location', async () => {
        const response = await connectiveClient.packages.elements.createTextBoxField({
            DocumentId: documentId,
            PackageId: packageId,
            Element: {
                Type: 'textboxfield',
                Location: {Page: 1, Top: 466, Left: 107},
                Dimensions: {Width: 100, Height: 50},
                IsMultiline: true,
                ToolTipLabel: 'Tooltip',
                DefaultValue: 'DefaultValue',
                CharLimit: 500,
                IsRequired: true,
                Label: 'lblManualTextbox1',
                Name: 'Manual textbox 01',
                ExternalReference: 'ManualText1',
            },
        });

        expect(response.data).toEqual<CreateTextBoxFieldOutput>({
            Type: 'textboxfield',
            DefaultValue: 'DefaultValue',
            IsMultiline: true,
            CharLimit: 500,
            Value: null,
            Name: 'Manual textbox 01',
            Label: 'lblManualTextbox1',
            ToolTipLabel: 'Tooltip',
            IsRequired: true,
            Id: response.data.Id,
            ActorId: response.data.ActorId,
            Location: {Page: 1, Top: 466, Left: 107},
            Dimensions: {Width: 100, Height: 50},
            Status: 'Pending',
            ExternalReference: 'ManualText1',
            CompletedDate: null,
        });
    });

    it('should create a textbox field with a marker', async () => {
        const response = await connectiveClient.packages.elements.createTextBoxField({
            DocumentId: documentId,
            PackageId: packageId,
            Element: {
                Type: 'textboxfield',
                Marker: 'txtbox01',
                Name: 'Marker textbox 01',
                IsMultiline: true,
                ToolTipLabel: 'Tooltip',
                DefaultValue: 'DefaultValue',
                CharLimit: 500,
                IsRequired: true,
                Label: 'lblTxtbox01',
                ExternalReference: 'MarkerText1',
            },
        });

        expect(response.data).toEqual<CreateTextBoxFieldOutput>({
            Type: 'textboxfield',
            DefaultValue: 'DefaultValue',
            IsMultiline: true,
            CharLimit: 500,
            Value: null,
            Name: 'txtbox01',
            Label: 'lblTxtbox01',
            ToolTipLabel: 'Tooltip',
            IsRequired: true,
            Id: response.data.Id,
            ActorId: response.data.ActorId,
            Location: {Page: 1, Top: 466, Left: 107},
            Dimensions: {Width: 100, Height: 50},
            Status: 'Pending',
            ExternalReference: 'MarkerText1',
            CompletedDate: null,
        });
    });
});

describe('deleteById', () => {
    it('should delete the document', async () => {
        const createElementResponse = await connectiveClient.packages.elements.createTextBoxField({
            PackageId: packageId,
            DocumentId: documentId,
            Element: {
                Type: 'textboxfield',
                Marker: 'txtbox01',
                Name: 'Some name',
            },
        });

        const deleteResponse = await connectiveClient.packages.elements.deleteById({
            packageId,
            documentId,
            elementId: createElementResponse.data.Id,
        });

        expect(deleteResponse.data).toBe('');

        const error: any = await jestGetErrorAsync(async () => {
            return connectiveClient.packages.elements.getById({
                packageId,
                documentId,
                elementId: createElementResponse.data.Id,
            });
        });
        expect(error.isAxiosError).toBe(true);
        expect(error.response.status).toBe(404);
    });
});

describe('getById', () => {
    describe('signing field', () => {
        it('should be returned', async () => {
            const createElementResponse = await connectiveClient.packages.elements
                .createSigningField({
                    PackageId: packageId,
                    DocumentId: documentId,
                    Element: {
                        Type: 'signingfield',
                        Marker: 'SIG01',
                    },
                });

            expect(createElementResponse.data).toEqual<CreateSigningFieldOutput>({
                ActorId: createElementResponse.data.ActorId,
                CompletedDate: null,
                Dimensions: {
                    Height: 200,
                    Width: 300,
                },
                ExternalReference: null,
                Id: createElementResponse.data.Id,
                KeyPairMappings: [],
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
            });
        });
    });
});

describe('getByDocumentId', () => {
    it('should return the elements', async () => {
        const documentResponse = await connectiveClient.packages.documents.create({
            PackageId: packageId,
            Document: {
                Name: 'test doc',
                Language: 'en',
                DocumentOptions: {
                    ContentType: 'application/pdf',
                    Base64data: documentBase64,
                },
            },
        });

        const responses = [
            await connectiveClient.packages.elements.createSigningField({
                PackageId: packageId,
                DocumentId: documentResponse.data.Id,
                Element: {
                    Type: 'signingfield',
                    Marker: 'SIG01',
                },
            }),
            await connectiveClient.packages.elements.createTextBoxField({
                PackageId: packageId,
                DocumentId: documentResponse.data.Id,
                Element: {
                    Type: 'textboxfield',
                    Marker: 'txtbox01',
                    Name: 'Textbox 02',
                },
            }),
        ];

        const getElementsResponse = await connectiveClient.packages.elements
            .getByDocumentId(packageId, documentResponse.data.Id);

        expect(getElementsResponse.data)
            .toEqual<Array<CreateElementOutput>>(responses.map(response => response.data));
    });
});

describe('getUnplaced', () => {
    it('should return the unplaced elements', async () => {
        const d = await connectiveClient.packages.elements.getUnplaced(packageId);

        expect(d.data.length).toEqual(0);
    });
});
