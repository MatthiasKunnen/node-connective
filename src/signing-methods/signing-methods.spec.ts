import {registerPackageSetUpAndTearDown} from '../../tests/package.helper';
import {Connective} from '../index';
import {SigningMethod} from './signing-methods.interface';

let connectiveClient: Connective;
registerPackageSetUpAndTearDown({
    setConnectiveClient: client => {
        connectiveClient = client;
    },
});

test('getSigningMethods(true) returns only active signing methods', async () => {
    const {data} = await connectiveClient.signingMethods.get(true);

    expect(data).toEqual<Array<SigningMethod>>(data.map(method => {
        return {
            ...method,
            IsActive: true,
        };
    }));
});

test('getSigningMethods(false) returns only inactive signing methods', async () => {
    const {data} = await connectiveClient.signingMethods.get(false);

    expect(data).toEqual<Array<SigningMethod>>(data.map(method => {
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

    expect(sort(allMethods))
        .toEqual<Array<SigningMethod>>(sort([...activeMethods, ...inactiveMethods]));
});
