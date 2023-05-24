import {Readable} from 'stream';

import {AxiosInstance, AxiosResponse} from 'axios';

import {PackageStatus} from '../package.interface';
import {
    AddDocumentInput,
    DeleteDocumentResponse,
    Document,
} from './document.interface';

export class DocumentController {

    constructor(
        private readonly http: AxiosInstance,
    ) {
    }

    /**
     * This call retrieves all documents that currently exist within a specified package.
     */
    async all(
        packageId: string,
        status?: PackageStatus,
    ): Promise<AxiosResponse<Array<Document>>> {
        return this.http.get(`/packages/${packageId}/documents`, {
            params: {
                status,
            },
        });
    }

    /**
     * Add a PDF document to a previously created package.
     */
    async create(input: AddDocumentInput): Promise<AxiosResponse<Document>> {
        return this.http.post(`/packages/${input.PackageId}/documents`, input.Document);
    }

    /**
     * Deletes a document by ID.
     * @param packageId The ID package where the document resides in.
     * @param documentId The ID of the document to remove.
     */
    async delete(
        packageId: string,
        documentId: string,
    ): Promise<AxiosResponse<DeleteDocumentResponse>> {
        return this.http.delete(`/packages/${packageId}/documents/${documentId}`);
    }

    /**
     * Download a signed document from a package.
     *
     * Note that you can only download documents from fully finished packages.
     * @param packageId The ID of the package.
     * @param documentId The ID of the document to download.
     * @param responseType The response type you desire. If set to "arraybuffer" the data property
     * will be a Buffer. If set to 'stream' the property will be of type Readable.
     */
    async download(
        packageId: string,
        documentId: string,
        responseType: 'arraybuffer',
    ): Promise<AxiosResponse<Buffer>>;
    async download(
        packageId: string,
        documentId: string,
        responseType: 'stream',
    ): Promise<AxiosResponse<Readable>>;
    async download(
        packageId: string,
        documentId: string,
        responseType: 'arraybuffer' | 'stream',
    ): Promise<AxiosResponse> {
        return this.http.get(`/packages/${packageId}/download/${documentId}`, {
            headers: {
                Accept: 'application/pdf',
            },
            responseType: responseType,
        });
    }

    /**
     * Get document by ID.
     */
    async getById(
        packageId: string,
        documentId: string,
    ): Promise<AxiosResponse<Document>> {
        return this.http.get(`/packages/${packageId}/documents/${documentId}`);
    }

    /**
     * Get document by orderIndex.
     * The OrderIndex defines the order in which documents should be sorted within a package.
     * 0 for the first document, 1 for the second, ...
     *
     * Warning, OrderIndex is broken in 7.4.0. The first document index is reported as 2
     * and the next as 4 by `Document.OrderIndex` but the actual index is 1 and 3 respectively. When
     * using this function either start counting from one increasing in steps of two or subtract one
     * from the `OrderIndex`.
     */
    async getByOrderIndex(
        packageId: string,
        orderIndex: number,
    ): Promise<AxiosResponse<Document>> {
        return this.http.get(`/packages/${packageId}/documents/${orderIndex}`);
    }
}
