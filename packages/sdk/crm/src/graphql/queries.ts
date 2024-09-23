import userGet from './user/get.gql';
import userRegister from './user/register.gql';
import userUpdate from './user/update.gql';
import orders from './order/orders.gql';
import order from './order/order.gql';

const queries = {
  userGet,
  userRegister,
  userUpdate,
  orders,
  order,
};

export { queries };
