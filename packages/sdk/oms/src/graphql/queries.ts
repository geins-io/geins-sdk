import createCart from './cart/create.gql';
import getCart from './cart/get.gql';
import cloneCart from './cart/clone.gql';
import completeCart from './cart/complete.gql';
import updateCart from './cart/update.gql';
import updateSilentCart from './cart/update-silent.gql';
import setMerchantData from './cart/set-merchant-data.gql';
import setPromotionCode from './cart/set-promotion-code.gql';
import setShippingFee from './cart/set-shipping-fee.gql';
import addItem from './cart/add-item.gql';
import addPackageItem from './cart/add-package.gql';
import updatePackageItem from './cart/update-package.gql';
// import getCheckout from './checkout/get.gql';
import createOrUpdateCheckout from './checkout/create-update.gql';
import validateCheckout from './checkout/validate.gql';
import createOrder from './order/create.gql';
import getOrder from './order/get.gql';

const queries = {
  cartCreate: createCart,
  cartGet: getCart,
  cartCopy: cloneCart,
  cartComplete: completeCart,
  cartAddItem: addItem,
  cartAddPackageItem: addPackageItem,
  cartUpdatePackageItem: updatePackageItem,
  cartUpdateItem: updateCart,
  cartUpdateItemSilent: updateSilentCart,
  cartSetMerchantData: setMerchantData,
  cartSetPromotionCode: setPromotionCode,
  cartSetShippingFee: setShippingFee,
  // checkoutGet: getCheckout,
  checkoutCreate: createOrUpdateCheckout,
  checkoutValidate: validateCheckout,
  orderCreate: createOrder,
  orderGet: getOrder,
};

export { queries };
