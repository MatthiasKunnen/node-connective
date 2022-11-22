import * as fs from 'fs';
import * as path from 'path';

import {
    Connective,
    ExternalReference,
} from '../src';

interface PackageSetUpAndTearDown {
    setConnectiveClient: (client: Connective) => void;
}

export function registerPackageSetUpAndTearDown(input: PackageSetUpAndTearDown) {
    let connectiveClient: Connective;
    const packagesToDelete: Array<string> = [];

    beforeAll(() => {
        connectiveClient = new Connective({
            endpoint: requireEnv('CONNECTIVE_ENDPOINT'),
            password: requireEnv('CONNECTIVE_PASSWORD'),
            username: requireEnv('CONNECTIVE_USERNAME'),
        });
        input.setConnectiveClient(connectiveClient);
    });

    afterAll(async () => {
        for (const id of packagesToDelete) {
            // istanbul ignore next
            await connectiveClient.packages.delete(id);
        }
    });

    return {
        packagesToDelete,
    };
}

export function requireEnv(name: keyof typeof process.env): string {
    const value = process.env[name];

    if (value === undefined) {
        throw new Error(`Environment variable ${name} required. Add to .env.`);
    }
    return value;
}

const compareExternalReference = (a: ExternalReference, b: ExternalReference) => {
    if (a.ExternalReference == null || b.ExternalReference == null) {
        return 0;
    }

    return a.ExternalReference.localeCompare(b.ExternalReference);
};

interface Sortable {
    Documents?: Array<ExternalReference & {Elements?: Array<ExternalReference>}>;
    Stakeholders?: Array<ExternalReference & {
        Actors?: Array<{
            Type: string;
            Elements?: Array<ExternalReference>;
        }>;
    }>;
}

/**
 * Sort package data to make equality comparison stable.
 */
export function sortPackageData(data: Sortable) {
    data.Documents?.sort(compareExternalReference);
    data.Documents?.forEach(doc => {
        doc.Elements?.sort(compareExternalReference);
    });
    data.Stakeholders?.sort(compareExternalReference);
    data.Stakeholders?.forEach(stakeholder => {
        stakeholder.Actors?.sort((a, b) => {
            return a.Type.localeCompare(b.Type);
        });
        stakeholder.Actors?.forEach(actor => {
            if ('Elements' in actor) {
                actor.Elements?.sort(compareExternalReference);
            }
        });
    });
}

export class DocumentsStore {

    static async getSimpleDocumentBuffer(): Promise<Buffer> {
        const simpleDocumentFilename = path.join(__dirname, 'simple.pdf');
        return fs.promises.readFile(simpleDocumentFilename);
    }

    static async getSimpleDocumentBase64(): Promise<string> {
        return this.getSimpleDocumentBuffer().then(buffer => buffer.toString('base64'));
    }
}
