[![npm version](https://img.shields.io/npm/v/connective-api.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/connective-api)
[![Build Status](https://img.shields.io/github/workflow/status/MatthiasKunnen/node-connective/Main?label=Build&logo=github&style=for-the-badge)
](https://github.com/MatthiasKunnen/node-connective/actions)
[![Build Status](https://img.shields.io/npm/l/connective-api?&style=for-the-badge&color=green)
](https://github.com/MatthiasKunnen/node-connective/blob/master/LICENSE)

# Connective.eu API library
A promise based library for the API of [connective.eu](https://connective.eu) with types.

This library is based on <https://documentation.connective.eu/en-us/eSignatures5.5/api/API.html>.

<sub><sup>This library is not a product of, nor made by, connective.eu.</sup></sub>

# Usage
This is a simple example of how to create a package and upload a document.

```ts
import * as fs from 'fs';
import {Connective} from 'connective-api';

connective = new Connective({
    endpoint: 'https://your-company.connective.eu',
    password: 'your password',
    username: 'your username',
});

const pdf = fs.createReadStream('path-to-pdf.pdf');
const {data: createPackageData} = await connective.packages.create({
    Initiator: 'info@example.com',
    PackageName: 'package',
});
const packageId = createPackageData.PackageId;
const {data: addDocumentData} = await connective.packages.addDocumentPdf({
    packageId: packageId,
    document: pdf,
    input: {
        DocumentLanguage: 'en',
        DocumentName: 'DocumentName',
    },
});
```
