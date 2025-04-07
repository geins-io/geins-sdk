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
};

export { queries };
