import {Readable} from 'stream';

import {AxiosInstance, AxiosResponse} from 'axios';

import {DocumentController} from './documents/document.controller';
import {ElementController} from './documents/elements/element.controller';
import {
    CreatePackageInput,
    CreatePackageResponse,
    GetPackageByIdResponse,
} from './packages.interface';
import {StakeholdersController} from './stakeholders/stakeholders.controller';

export class PackagesController {

    readonly documents: DocumentController;
    readonly elements: ElementController;
    readonly stakeholders: StakeholdersController;

    constructor(private readonly http: AxiosInstance) {
        this.documents = new DocumentController(this.http);
        this.elements = new ElementController(this.http);
        this.stakeholders = new StakeholdersController(this.http);
    }

    /**
     * Create a package.
     */
    async create(input: CreatePackageInput): Promise<AxiosResponse<CreatePackageResponse>> {
        return this.http.post('/packages', input);
    }

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
    ): Promise<AxiosResponse<GetPackageByIdResponse>> {
        return this.http.get(`/packages/${packageId}`);
    }
}
