import createCart from './cart/create.gql';
import getCart from './cart/get.gql';
import updateCart from './cart/update.gql';
import updateSilentCart from './cart/update-silent.gql';
import setMerchantData from './cart/set-merchant-data.gql';
import setPromotionCode from './cart/set-promotion-code.gql';
import setShippingFee from './cart/set-shipping-fee.gql';
import addItem from './cart/add-item.gql';

const queries = {
  cartCreate: createCart,
  cartGet: getCart,
  cartAddItem: addItem,
  cartUpdateItem: updateCart,
  cartUpdateItemSilent: updateSilentCart,
  cartSetMerchantData: setMerchantData,
  cartSetPromotionCode: setPromotionCode,
  cartSetShippingFee: setShippingFee,
};
export { queries };
