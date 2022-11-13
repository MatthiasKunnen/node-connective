import {AxiosInstance, AxiosResponse} from 'axios';

import {
    AddDocumentElementInput,
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

    async createCheckBoxField(
        input: AddDocumentElementInput<CreateCheckboxFieldInput>,
    ): Promise<AxiosResponse<CreateCheckboxFieldOutput>> {
        return this.create(input);
    }

    async createRadioGroup(
        input: AddDocumentElementInput<CreateRadioGroupInput>,
    ): Promise<AxiosResponse<CreateRadioGroupOutput>> {
        return this.create(input);
    }

    async createSigningField(
        input: AddDocumentElementInput<CreateSigningFieldInput>,
    ): Promise<AxiosResponse<CreateSigningFieldOutput>> {
        return this.create(input);
    }

    async createTextBoxField(
        input: AddDocumentElementInput<CreateTextBoxFieldInput>,
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
    async getElementsByDocumentId(
        packageId: string,
        documentId: string,
    ): Promise<AxiosResponse<Array<CreateElementOutput>>> {
        return this.http.get(`/packages/${packageId}/documents/${documentId}/elements`);
    }

    /**
     * Get element by ID.
     */
    async getByElementId(
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
    async getUnplacedElements(
        packageId: string,
    ): Promise<AxiosResponse<CreateElementOutput>> {
        return this.http.get(
            `/packages/${packageId}/unplacedElements`,
        );
    }

    private async create(
        input: AddDocumentElementInput<CreateCheckboxFieldInput>,
    ): Promise<AxiosResponse<CreateCheckboxFieldOutput>>;
    private async create(
        input: AddDocumentElementInput<CreateRadioGroupInput>,
    ): Promise<AxiosResponse<CreateRadioGroupOutput>>;
    private async create(
        input: AddDocumentElementInput<CreateSigningFieldInput>,
    ): Promise<AxiosResponse<CreateSigningFieldOutput>>;
    private async create(
        input: AddDocumentElementInput<CreateTextBoxFieldInput>,
    ): Promise<AxiosResponse<CreateTextBoxFieldOutput>>;
    private async create(
        input: AddDocumentElementInput<CreateElementInput>,
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
