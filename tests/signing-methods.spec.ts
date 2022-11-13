import {Connective} from '../src';
import {SigningMethod} from '../src/signing-methods/signing-methods.interface';
import {registerPackageSetUpAndTearDown} from './package.helper';

let connectiveClient: Connective;
registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

test('getSigningMethods(true) returns only active signing methods', async () => {
    const {data} = await connectiveClient.signingMethods.get(true);

    expect(data).toEqual(data.map(method => {
        return {
            ...method,
            IsActive: true,
        };
    }));
});

test('getSigningMethods(false) returns only inactive signing methods', async () => {
    const {data} = await connectiveClient.signingMethods.get(false);

    expect(data).toEqual(data.map(method => {
        return {
            ...method,
            IsActive: false,
        };
    }));
});

test('getSigningMethods() returns both active and inactive signing methods', async () => {
    const {data: activeMethods} = await connectiveClient.signingMethods.get(true);
    const {data: inactiveMethods} = await connectiveClient.signingMethods.get(false);
    const {data: allMethods} = await connectiveClient.signingMethods.get();

    const sort = (array: Array<SigningMethod>) => {
        return array.sort((a, b) => a.Name.localeCompare(b.Name));
    };

    expect(sort(allMethods)).toEqual(sort([...activeMethods, ...inactiveMethods]));
});
