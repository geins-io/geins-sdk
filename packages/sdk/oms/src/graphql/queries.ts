import addItem from './cart/add-item.gql';
import addPackageItem from './cart/add-package.gql';
import copyCart from './cart/clone.gql';
import completeCart from './cart/complete.gql';
import createCart from './cart/create.gql';
import getCart from './cart/get.gql';
import setMerchantData from './cart/set-merchant-data.gql';
import setPromotionCode from './cart/set-promotion-code.gql';
import setShippingFee from './cart/set-shipping-fee.gql';
import updatePackageItem from './cart/update-package.gql';
import updateSilentCart from './cart/update-silent.gql';
import updateCart from './cart/update.gql';
import createOrUpdateCheckout from './checkout/create-update.gql';
import getCheckoutSummary from './checkout/get-summary.gql';
import validateOrder from './checkout/validate-order.gql';
import validateCheckout from './checkout/validate.gql';
import addConfiguredCartItem from './configuration/add-cart-item.gql';
import applyConfigurationChanges from './configuration/apply-changes.gql';
import commitConfiguration from './configuration/commit.gql';
import createConfiguration from './configuration/create.gql';
import deleteConfiguration from './configuration/delete.gql';
import getConfiguredCartLines from './configuration/get-cart-lines.gql';
import getConfiguredOrderLineChoices from './configuration/get-order-line-choices.gql';
import getConfiguredOrderLines from './configuration/get-order-lines.gql';
import getConfiguration from './configuration/get.gql';
import renewConfiguration from './configuration/renew.gql';
import reopenCartItemConfiguration from './configuration/reopen-cart-item.gql';
import updateConfiguredCartItem from './configuration/update-cart-item.gql';
import createOrder from './order/create.gql';
import getOrder from './order/get.gql';

const queries = {
  cartCreate: createCart,
  cartGet: getCart,
  cartCopy: copyCart,
  cartComplete: completeCart,
  cartAddItem: addItem,
  cartAddPackageItem: addPackageItem,
  cartUpdatePackageItem: updatePackageItem,
  cartUpdateItem: updateCart,
  cartUpdateItemSilent: updateSilentCart,
  cartSetMerchantData: setMerchantData,
  cartSetPromotionCode: setPromotionCode,
  cartSetShippingFee: setShippingFee,
  checkoutCreate: createOrUpdateCheckout,
  checkoutValidate: validateCheckout,
  checkoutSummaryGet: getCheckoutSummary,
  checkoutOrderValidate: validateOrder,
  orderCreate: createOrder,
  orderGet: getOrder,
  configurationCreate: createConfiguration,
  configurationGet: getConfiguration,
  configurationApplyChanges: applyConfigurationChanges,
  configurationRenew: renewConfiguration,
  configurationCommit: commitConfiguration,
  configurationDelete: deleteConfiguration,
  configurationReopenCartItem: reopenCartItemConfiguration,
  configurationAddCartItem: addConfiguredCartItem,
  configurationUpdateCartItem: updateConfiguredCartItem,
  configurationGetCartLines: getConfiguredCartLines,
  configurationGetOrderLines: getConfiguredOrderLines,
  configurationGetOrderLineChoices: getConfiguredOrderLineChoices,
};

export { queries };
