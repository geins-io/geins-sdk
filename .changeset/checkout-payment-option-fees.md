---
'@geins/types': patch
'@geins/oms': patch
---

Read the fee of each payment option in the checkout.

The checkout read (`checkout.get`) now selects `feeIncVat`, `feeExVat`, `feeIncVatFormatted`
and `feeExVatFormatted` on every payment option. Before this, `feeIncVat` and `feeExVat` were typed
but never fetched, so they were always `undefined`. `PaymentOptionType` gets
`feeIncVatFormatted?: string` and `feeExVatFormatted?: string`.
