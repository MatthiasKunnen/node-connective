import {Readable} from 'stream';

import {AxiosInstance, AxiosResponse} from 'axios';
import * as FormData from 'form-data';

import {
    AddDocumentPdfInput,
    AddDocumentResponse,
    AddDocumentXmlInput,
    CreatePackageInput,
    CreatePackageResponse,
    GetSigningLocationsResponse,
    SetPackageStatusInput,
    SetProcessInformationInput,
    StatusResponse,
} from './packages.interface';

export class Packages {

    constructor(private readonly http: AxiosInstance) {
    }

    /**
     * Add a PDF document to a previously created package.
     */
    async addDocumentPdf(input: AddDocumentPdfInput): Promise<AxiosResponse<AddDocumentResponse>> {
        const formData = new FormData();

        formData.append(
            'Data',
            JSON.stringify({
                DocumentType: 'application/pdf',
                ...input.input,
            }),
            {
                contentType: 'application/json; charset=utf-8',
            },
        );
        formData.append('Document', input.document);

        return this.http.post(`/v3/packages/${input.packageId}/documents`, formData, {
            headers: formData.getHeaders(),
        });
    }

    /**
     * Add an XML document to a previously created package.
     */
    async addDocumentXml(input: AddDocumentXmlInput): Promise<AxiosResponse<AddDocumentResponse>> {
        const formData = new FormData();
        formData.append(
            'Data',
            JSON.stringify({
                DocumentType: 'application/xml',
                RepresentationType: 'application/xml',
                ...input.input,
            }),
            {
                contentType: 'application/json; charset=utf-8',
            },
        );
        formData.append('Document', input.document);

        if (input.representation !== undefined) {
            formData.append('Representation', input.representation);
        }

        return this.http.post(`/v3/packages/${input.packageId}/documents`, formData.getBuffer(), {
            headers: formData.getHeaders(),
        });
    }

    /**
     * Create a package.
     */
    async create(input: CreatePackageInput): Promise<AxiosResponse<CreatePackageResponse>> {
        return this.http.post('/v3/packages', input);
    }

    async delete(packageId: string): Promise<AxiosResponse<{}>> {
        return this.http.delete(`/v3/packages/${packageId}`);
    }

    async deleteDocument(packageId: string, documentId: string): Promise<AxiosResponse<{}>> {
        return this.http.delete(`/v3/packages/${packageId}/documents/${documentId}`);
    }

    /**
     * Download the package. Important: the status of the package must be "Finished".
     * @param packageId The ID of the package.
     * @param responseType The response type you desire. If set to "arraybuffer" the data property
     * will be a Buffer. If set to 'stream' the property will be of type Readable.
     */
    async download(
        packageId: string,
        responseType: 'arraybuffer',
    ): Promise<AxiosResponse<Buffer>>
    async download(
        packageId: string,
        responseType: 'stream',
    ): Promise<AxiosResponse<Readable>>
    async download(
        packageId: string,
        responseType: 'arraybuffer' | 'stream',
    ): Promise<AxiosResponse<any>> {
        return this.http.get(`/v3/packages/${packageId}/download`, {
            responseType: responseType,
        });
    }

    /**
     * Download a document from a package. Important: the status of the package must be "Finished".
     * @param packageId The ID of the package.
     * @param documentId The ID of the document to download.
     * @param responseType The response type you desire. If set to "arraybuffer" the data property
     * will be a Buffer. If set to 'stream' the property will be of type Readable.
     */
    async downloadDocument(
        packageId: string,
        documentId: string,
        responseType: 'arraybuffer',
    ): Promise<AxiosResponse<Buffer>>
    async downloadDocument(
        packageId: string,
        documentId: string,
        responseType: 'stream',
    ): Promise<AxiosResponse<Readable>>
    async downloadDocument(
        packageId: string,
        documentId: string,
        responseType: 'arraybuffer' | 'stream',
    ): Promise<AxiosResponse<any>> {
        return this.http.get(`/v3/packages/${packageId}/download/${documentId}`, {
            responseType: responseType,
        });
    }

    async getSigningLocations(
        packageId: string,
    ): Promise<AxiosResponse<GetSigningLocationsResponse>> {
        return this.http.get(`/v3/packages/${packageId}/locations`);
    }

    async getStatus(packageId: string): Promise<AxiosResponse<StatusResponse>> {
        return this.http.get(`/v3/packages/${packageId}/status`);
    }

    async setPackageStatus(packageId: string, status: SetPackageStatusInput): Promise<{}> {
        return this.http.put(`/v3/packages/${packageId}/status`, {
            status,
        });
    }

    /**
     * This webservice method updates the people involved in the process, i.e. the stakeholders, and
     * assigns them the steps that need to be taken.
     *
     * A stakeholder can either be a person (default), a list of persons, or a contact group. The
     * type of stakeholder is defined by the Type parameter. When you set the type to Person, or
     * don’t pass a type at all, the API call will function exactly as in previous versions.
     *
     * If you want one of multiple persons to be able to approve or sign the package for the entire
     * group, set the Type parameter to PersonGroup, pass a PersonGroupName and list the different
     * persons in the Persons array. Each person of the group will receive a unique URL to
     * approve/sign their document. Attention: as soon as one member of the group has taken action,
     * the others no longer can.
     *
     * If you don’t want to list the different persons in each API call, you can also define a
     * contact group in the eSignatures WebPortal. In that case you set the Type to ContactGroup and
     * only need to pass the ContactGroupCode in the call.
     *
     * This uses the v3.1 API.
     */
    async setProcessInformation(
        packageId: string,
        input: SetProcessInformationInput,
    ): Promise<AxiosResponse<{}>> {
        return this.http.put(`/v3.1/packages/${packageId}/process`, input);
    }
}
