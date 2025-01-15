# Packages

Geins is a modular platform and the SDK is also modular. The SDK consists of several packages so you don't bloat your application. Each package provides a specific set of functionality that you can use to build your application. 

The following packages are available:

## @geins/core <Badge type="info" text="0.3.9" />

Main package for interacting with the Geins API. All other packages depend on this one.

[![core-badge-version]][core-npm-url]

[![core-badge-size]][core-npm-url]

[![core-badge-size-unpacked]][core-npm-url]

[![core-badge-version-canary]][core-npm-url-canary]

Read the [documentation](./core/) for more information.

## @geins/cms <Badge type="info" text="0.3.9" />

Package for managing content, including pages, menus.

[![cms-badge-version]][cms-npm-url]

[![cms-badge-size]][cms-npm-url]

[![cms-badge-size-unpacked]][cms-npm-url]

[![cms-badge-version-canary]][cms-npm-url-canary]

Read the [documentation](./cms/) for more information.

## @geins/crm <Badge type="info" text="0.3.9" />

Package for managing customer relationship management (CRM) functionalities, such as user authentication, registration, and order history.

[![crm-badge-version]][crm-npm-url]

[![crm-badge-size]][crm-npm-url]

[![crm-badge-size-unpacked]][crm-npm-url]

[![crm-badge-version-canary]][crm-npm-url-canary]

Read the [documentation](./crm/) for more information.

## @geins/oms <Badge type="info" text="0.3.9" />

_This package is not yet available since it is still under development._

[![oms-badge-version]][oms-npm-url]

[![oms-badge-size]][oms-npm-url]

[![oms-badge-size-unpacked]][oms-npm-url]

[![oms-badge-version-canary]][oms-npm-url-canary]

Read the [documentation](./oms/) for more information.


## @geins/pim <Badge type="warning" text="TBA" />

_This package is not yet available since it is still under development._

Mean while you can use the [`graphql client`](./core/graphql-client) in [`@geins/core`](./core/) package. Checkout some example queries in [here](./../guide/examples/gql/).


## @geins/search <Badge type="warning" text="TBA" />

_This package is not yet available since it is still under development._

Mean while you can use the [`graphql client`](./core/graphql-client) in [`@geins/core`](./core/) package. Checkout some example queries in [here](./../guide/examples/gql/).


[core-npm-url]: https://www.npmjs.com/package/@geins/core
[core-npm-url-canary]: https://www.npmjs.com/package/@geins/core/v/canary
[core-badge-version]: https://img.shields.io/npm/v/%40geins%2Fcore?style=for-the-badge&label=latest%20version
[core-badge-version-canary]: https://img.shields.io/npm/v/%40geins%2Fcore/canary?style=for-the-badge&label=Latest%20canary
[core-badge-size]: https://img.shields.io/bundlejs/size/%40geins%2Fcore?style=for-the-badge
[core-badge-size-unpacked]: https://img.shields.io/npm/unpacked-size/%40geins%2Fcore?style=for-the-badge

[cms-npm-url]: https://www.npmjs.com/package/@geins/cms
[cms-npm-url-canary]: https://www.npmjs.com/package/@geins/cms/v/canary
[cms-badge-version]: https://img.shields.io/npm/v/%40geins%2Fcms?style=for-the-badge&label=latest%20version
[cms-badge-version-canary]: https://img.shields.io/npm/v/%40geins%2Fcms/canary?style=for-the-badge&label=Latest%20canary
[cms-badge-size]: https://img.shields.io/bundlejs/size/%40geins%2Fcms?style=for-the-badge
[cms-badge-size-unpacked]: https://img.shields.io/npm/unpacked-size/%40geins%2Fcms?style=for-the-badge

[crm-npm-url]: https://www.npmjs.com/package/@geins/crm
[crm-npm-url-canary]: https://www.npmjs.com/package/@geins/crm/v/canary
[crm-badge-version]: https://img.shields.io/npm/v/%40geins%2Fcrm?style=for-the-badge&label=latest%20version
[crm-badge-version-canary]: https://img.shields.io/npm/v/%40geins%2Fcrm/canary?style=for-the-badge&label=Latest%20canary
[crm-badge-size]: https://img.shields.io/bundlejs/size/%40geins%2Fcrm?style=for-the-badge
[crm-badge-size-unpacked]: https://img.shields.io/npm/unpacked-size/%40geins%2Fcrm?style=for-the-badge

[oms-npm-url]: https://www.npmjs.com/package/@geins/oms
[oms-npm-url-canary]: https://www.npmjs.com/package/@geins/oms/v/canary
[oms-badge-version]: https://img.shields.io/npm/v/%40geins%2Foms?style=for-the-badge&label=latest%20version
[oms-badge-version-canary]: https://img.shields.io/npm/v/%40geins%2Foms/canary?style=for-the-badge&label=Latest%20canary
[oms-badge-size]: https://img.shields.io/bundlejs/size/%40geins%2Foms?style=for-the-badge
[oms-badge-size-unpacked]: https://img.shields.io/npm/unpacked-size/%40geins%2Foms?style=for-the-badge
