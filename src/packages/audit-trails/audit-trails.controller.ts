import {Readable} from 'stream';

import {AxiosInstance, AxiosResponse} from 'axios';

export class AuditTrailsController {

    constructor(
        private readonly http: AxiosInstance,
    ) {
    }

    /**
     * Download the audit trail as a PDF.
     * Note this can only be done on finished and archived packages.
     * @param packageId The ID of the package.
     * @param language The two letter, ISO 639-1, language code.
     * @param responseType The response type you desire. If set to "arraybuffer" the data property
     * will be a Buffer. If set to 'stream' the property will be of type Readable.
     */
    async download(
        packageId: string,
        language: string,
        responseType: 'arraybuffer',
    ): Promise<AxiosResponse<Buffer>>;
    async download(
        packageId: string,
        language: string,
        responseType: 'stream',
    ): Promise<AxiosResponse<Readable>>;
    async download(
        packageId: string,
        language: string,
        responseType: 'arraybuffer' | 'stream',
    ): Promise<AxiosResponse> {
        return this.http.get(`/packages/${packageId}/audittrail/${language}`, {
            responseType: responseType,
        });
    }
}
