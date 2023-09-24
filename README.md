@ragarwal06/cf-operations - SAP BTP SSH & Enviorment Generator Wrapper for NodeJS (with Typescipt Support)
==============================================

<a href="https://www.npmjs.com/package/@ragarwal06/cf-operations">
    <img src="https://img.shields.io/npm/v/@ragarwal06/cf-operations" alt="Version">
</a>
<a href="https://www.npmjs.com/package/@ragarwal06/cf-operations">
    <img src="https://img.shields.io/npm/dw/@ragarwal06/cf-operations" alt="Total Downloads">
</a>
<a href="https://www.npmjs.com/package/@ragarwal06/cf-operations">
    <img src="https://img.shields.io/npm/l/@ragarwal06/cf-operations" alt="License">
</a>

Table of contents
-------------

* [Install](#install)
* [Getting started](#getting-started)
* [Contact](#contact)

Install
-------

Install from npm:

```bash
npm install @ragarwal06/cf-operations
```

or clone from the [GitHub repository](https://github.com/ragarwal06/cf-operations) to run tests and examples locally:

```bash
git clone https://github.com/ragarwal06/cf-operations.git
cd cf-operations
npm install
```

Getting started
------------

### Loading Environment from SAP BTP
This is a very simple example showing how to use this module in Javascript:

```js
const operations = require("@ragarwal06/cf-operations");
operations
  .generateDotEnv({
    appName: "appName",
    isBGDeployment: true,
  })
  .then((e) => {
    console.log("env loaded");
  })
  .catch((e) => console.log(e));
```

This is a very simple example showing how to use this module in Typescript:

```ts
import { generateDotEnv } from "@ragarwal06/cf-operations";

generateDotEnv({
  appName: "appName",
  isBGDeployment: true,
})
  .then((e) => {
    console.log("env loaded");
  })
  .catch((e) => console.log(e));
```

### SSH Tunneling from SAP BTP to Local

This is a very simple example showing how to use this module in Javascript:

```ts
const operations = require("@ragarwal06/cf-operations");

operations
  .startTunneling({
    appName: "appName",
    isBGDeployment: true,
    outPort: 9094,
    serviceName: "serviceName",
    urlGenerator: (credentials) => {
      // make sure to generate & return the ssh format in
      // {url}:{port}
    },
  })
  .then((e) => {
    console.log("hi");
  });
```
This is a very simple example showing how to use this module in Typescript:

```ts
import { startTunneling } from "@ragarwal06/cf-operations";

startTunneling({
  appName: "appName",
  isBGDeployment: true,
  outPort: 9094,
  serviceName: "serviceName",
  urlGenerator: (creds) => {
    // make sure to generate & return the ssh format in
    // {url}:{port}
  },
}).then((e) => {
  console.log("hi");
});

```

Currently `kafka` & `postgresql-db` url generator is already available. So you can skip sending `urlGenerator` function

Contact
-------

If you face any issue please write to [owner](mailto:agarwal.rahul324@gmail.com) or create a [GitHub issue](https://github.com/ragarwal06/cf-operations/issues/new?assignees=&labels=bug&projects=&template=issue.md&title=)

For feature request please request [here](https://github.com/ragarwal06/cf-operations/issues/new?assignees=&labels=feature&projects=&template=feature.md&title=)