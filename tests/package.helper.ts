import {Connective} from '../src';

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
