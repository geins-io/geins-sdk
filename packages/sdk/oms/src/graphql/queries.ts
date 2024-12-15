import createCart from './cart/create.gql';
import getCart from './cart/get.gql';
import updateCart from './cart/update.gql';
import addItem from './cart/add-item.gql';

const queries = {
  cartCreate: createCart,
  cartGet: getCart,
  cartAddItem: addItem,
  cartUpdateItem: updateCart,
};
export { queries };
