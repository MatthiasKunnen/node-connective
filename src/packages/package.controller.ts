import {Readable} from 'stream';

import {AxiosInstance, AxiosResponse} from 'axios';

import {DocumentController} from './documents/document.controller';
import {ElementController} from './documents/elements/element.controller';
import {
    CreatePackageInput,
    Package,
    PackageStatus,
    UpdatePackageStatusInput,
} from './package.interface';
import {StakeholderController} from './stakeholders/stakeholder.controller';

export class PackageController {

    readonly documents: DocumentController;
    readonly elements: ElementController;
    readonly stakeholders: StakeholderController;

    constructor(private readonly http: AxiosInstance) {
        this.documents = new DocumentController(this.http);
        this.elements = new ElementController(this.http);
        this.stakeholders = new StakeholderController(this.http);
    }

    /**
     * Create a package.
     */
    async create(input: CreatePackageInput): Promise<AxiosResponse<Package>> {
        return this.http.post('/packages', input);
    }

    /**
     * Deletes a package by its ID.
     */
    async delete(packageId: string): Promise<AxiosResponse<''>> {
        return this.http.delete(`/packages/${packageId}`);
    }

    /**
     * Download the all documents in the package as a .zip file.
     * Note that only finished and archived packages can be downloaded.
     * @param packageId The ID of the package.
     * @param responseType The response type you desire. If set to "arraybuffer" the data property
     * will be a Buffer. If set to 'stream' the property will be of type Readable.
     */
    async download(
        packageId: string,
        responseType: 'arraybuffer',
    ): Promise<AxiosResponse<Buffer>>;
    async download(
        packageId: string,
        responseType: 'stream',
    ): Promise<AxiosResponse<Readable>>;
    async download(
        packageId: string,
        responseType: 'arraybuffer' | 'stream',
    ): Promise<AxiosResponse> {
        return this.http.get(`/packages/${packageId}/download`, {
            responseType: responseType,
        });
    }

    async getById(
        packageId: string,
    ): Promise<AxiosResponse<Package>> {
        return this.http.get(`/packages/${packageId}`);
    }

    async getStatusById(packageId: string): Promise<AxiosResponse<PackageStatus>> {
        return this.http.get(`/packages/${packageId}/status`);
    }

    async updateStatus(input: UpdatePackageStatusInput): Promise<AxiosResponse<''>> {
        return this.http.put(`/packages/${input.PackageId}/status`, `"${input.Status}"`);
    }
}
