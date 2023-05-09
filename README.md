[![npm version](https://img.shields.io/npm/v/connective-api.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/connective-api)
[![Build Status](https://img.shields.io/github/workflow/status/MatthiasKunnen/node-connective/Main?label=Build&logo=github&style=for-the-badge)
](https://github.com/MatthiasKunnen/node-connective/actions)
[![Code coverage](https://img.shields.io/codecov/c/github/MatthiasKunnen/node-connective/master?style=for-the-badge)
](https://app.codecov.io/gh/MatthiasKunnen/node-connective)
[![License](https://img.shields.io/npm/l/connective-api?style=for-the-badge&color=green)
](https://github.com/MatthiasKunnen/node-connective/blob/master/LICENSE)

# Connective.eu API library
A promise based library for the API of [connective.eu](https://connective.eu) with types.

<sub><sup>This library is not a product of, nor made by, connective.eu.</sup></sub>

## Compatibility

| Package version | Connective API version | eSignature version                                                            |
|-----------------|------------------------|-------------------------------------------------------------------------------|
| ^4.0.0          | v4                     | [v7.4](https://apidocs.connective.eu/#7418e06a-4a47-4a68-b02c-216c341e8b82)   |
| ^3.0.0          | v4                     | [v7.2](https://apidocs.connective.eu/#cd7d157e-8496-4b8e-a1c8-209d253d71d0)   |
| ^2.0.0          | v4                     | [v7.1](https://apidocs.connective.eu/#0f142ada-238b-4eb9-ac2a-b238f247c133)   |
| ^1.0.0          | v3                     | [v5.5](https://documentation.connective.eu/en-us/eSignatures5.5/api/API.html) |

**Warning** OrderIndex is broken in 7.4. The first document index is reported as 2 and the next as 4 by `Document.OrderIndex` but the actual index is 1 and 3 respectively. When using `documents.getByOrderIndex` either start counting from one increasing in steps of two or subtract one from the `OrderIndex`.

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

const {data: createPackageData} = await connective.packages.create({
    Initiator: 'info@example.com',
    Name: 'package',
    Status: 'Draft',
    Documents: [
        {
            Elements: [],
            Name: 'Test document',
            Language: 'en',
            DocumentOptions: {
                ContentType: 'application/pdf',
                Base64data: documentData.toString('base64'),
            },
        },
    ],
});
```
