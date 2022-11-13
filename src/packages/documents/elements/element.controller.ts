import {AxiosInstance, AxiosResponse} from 'axios';

import {
    AddElementInput,
    CreateCheckboxFieldInput,
    CreateCheckboxFieldOutput,
    CreateElementInput,
    CreateElementOutput,
    CreateRadioGroupInput,
    CreateRadioGroupOutput,
    CreateSigningFieldInput,
    CreateSigningFieldOutput,
    CreateTextBoxFieldInput,
    CreateTextBoxFieldOutput,
    DeleteElementByIdInput,
    DeleteElementByIdOutput,
    GetElementByIdInput,
} from './element.interface';

export class ElementController {

    constructor(
        private readonly http: AxiosInstance,
    ) {
    }

    /**
     * Create a checkbox on an existing document. Will create an _undecided_ stakeholder.
     */
    async createCheckBoxField(
        input: AddElementInput<CreateCheckboxFieldInput>,
    ): Promise<AxiosResponse<CreateCheckboxFieldOutput>> {
        return this.create(input);
    }

    /**
     * Create a radio group on an existing document. Will create an _undecided_ stakeholder.
     */
    async createRadioGroup(
        input: AddElementInput<CreateRadioGroupInput>,
    ): Promise<AxiosResponse<CreateRadioGroupOutput>> {
        return this.create(input);
    }

    /**
     * Create a signing field on an existing document. Will create an _undecided_ stakeholder.
     */
    async createSigningField(
        input: AddElementInput<CreateSigningFieldInput>,
    ): Promise<AxiosResponse<CreateSigningFieldOutput>> {
        return this.create(input);
    }

    /**
     * Create a text box on an existing document. Will create an _undecided_ stakeholder.
     */
    async createTextBoxField(
        input: AddElementInput<CreateTextBoxFieldInput>,
    ): Promise<AxiosResponse<CreateTextBoxFieldOutput>> {
        return this.create(input);
    }

    /**
     * This call allows you to delete a specified element from a specified document of a draft
     * package.
     */
    async deleteById(
        {
            elementId,
            documentId,
            packageId,
        }: DeleteElementByIdInput,
    ): Promise<AxiosResponse<DeleteElementByIdOutput>> {
        return this.http.delete(
            `/packages/${packageId}/documents/${documentId}/elements/${elementId}`,
        );
    }

    /**
     * Gets all elements of a document.
     */
    async getByDocumentId(
        packageId: string,
        documentId: string,
    ): Promise<AxiosResponse<Array<CreateElementOutput>>> {
        return this.http.get(`/packages/${packageId}/documents/${documentId}/elements`);
    }

    /**
     * Get element by ID.
     */
    async getById(
        {
            documentId,
            elementId,
            packageId,
        }: GetElementByIdInput,
    ): Promise<AxiosResponse<CreateElementOutput>> {
        return this.http.get(
            `/packages/${packageId}/documents/${documentId}/elements/${elementId}`,
        );
    }

    /**
     * This call retrieves a specified unplaced element within a specified package.
     */
    async getUnplaced(
        packageId: string,
    ): Promise<AxiosResponse<Array<CreateElementOutput>>> {
        return this.http.get(
            `/packages/${packageId}/unplacedElements`,
        );
    }

    private async create(
        input: AddElementInput<CreateCheckboxFieldInput>,
    ): Promise<AxiosResponse<CreateCheckboxFieldOutput>>;
    private async create(
        input: AddElementInput<CreateRadioGroupInput>,
    ): Promise<AxiosResponse<CreateRadioGroupOutput>>;
    private async create(
        input: AddElementInput<CreateSigningFieldInput>,
    ): Promise<AxiosResponse<CreateSigningFieldOutput>>;
    private async create(
        input: AddElementInput<CreateTextBoxFieldInput>,
    ): Promise<AxiosResponse<CreateTextBoxFieldOutput>>;
    private async create(
        input: AddElementInput<CreateElementInput>,
    ): Promise<AxiosResponse<CreateElementOutput>> {
        // Unfortunately, this overloaded function can be confusing to use since it will complain
        // about the Type property (e.g. Type '"signingField"' is not assignable to type
        // '"textBox"'. ) until the object fully meets the CreateSigningFieldInput. To remediate
        // this, a function per element is used.
        return this.http.post(
            `/packages/${input.PackageId}/documents/${input.DocumentId}/elements`,
            input.Element,
        );
    }
}
