import getCart from './cart/get.gql';
import updateCart from './cart/update.gql';
import addItem from './cart/add-item.gql';

const queries = {
  cartCreate: getCart,
  cartGet: getCart,
  cartAddItem: addItem,
  cartUpdateItem: updateCart,
};
export { queries };
