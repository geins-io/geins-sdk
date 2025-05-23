---
title: User
description: How to work with the user in the Geins CRM Package
tags:
  - sdk
  - crm
  - user
---

# User

When a user is logged in, the user object is available in the CRM package. The user object provides methods for managing user profiles, groups, balances, transactions, and orders.

## Profile

The information on the user profile can be updated using the `update` method. The method takes an object with the fields to update. The fields that can be updated are `name`, `email`, `phone`, `address`, `city`, `state`, `zip`, and `country`.

Read more about the user profile [here](profile.md).

## Groups

Groups are used to manage the permissions of the user. The user can be assigned to multiple groups. The groups can be used to control access to different parts of the system.

Read more about groups [here](groups.md).

## Balance

Balance is a powerful tool to build functionality on top of. The balance of a user is the amount of money that the user has in their account. The balance can be increased by adding funds to the account or by receiving refunds. The balance can be decreased by making purchases or by paying fees.

Read more about the user balance [here](balance.md).

## Transactions

Transactions are the core of the CRM package. They are used to track all the user's interactions with the system. Transactions can be created by the system or by the user. They can be used to track user's balance changes, orders, and other interactions.

Read more about user transactions [here](transactions.md).
