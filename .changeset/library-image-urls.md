---
'@geins/types': minor
'@geins/oms': patch
'@geins/cms': patch
---

Read the asset library URL of cart, configuration and widget images, and export `CheckoutStatus`.

The cart and configuration reads now select `url` on every product image, and the widget reads
select `url` on every widget image. `url` is the image's asset library URL and is `null` for an
image outside the library. `parseContent` passes a widget's images through on `ContentType.images`
(`fileName`, `url`, `largestSize`), an empty list when the widget has none.

Breaking for TypeScript consumers, which is why this is a minor bump. Both changes correct types
that were already wrong at runtime:

- `ProductImageType.url` is now `url?: string | null`. It was typed `string`, but no query
  selected it, so it was always `undefined`, and the API answers `null` for an image outside the
  library.
- `ContentImageType.largestSize` is now nullable. The API answers `null` for every asset library
  image.

Additions: cart and configuration product images gain `url?: string | null`, `ContentImageType`
gains `url?: string | null`, `ContentType` gains `images?: ContentImageType[]`, and `CheckoutStatus`
is exported, so `CheckoutType.checkoutStatus` can be written outside the SDK.

The packages are released as one fixed group, so all five take the minor bump.
