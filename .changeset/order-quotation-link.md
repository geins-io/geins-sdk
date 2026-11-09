---
'@geins/types': minor
'@geins/oms': minor
---

Read the quotation an order was finalized from in the order read.

The order read (`order.get`) now selects `quotationId` and `quotationNumber`, and
`OrderSummaryType` gets both as optional strings. They are `undefined` on an order that did not
come from a quotation, and on one placed before the API recorded the link.
