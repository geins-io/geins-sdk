import userGet from './user/get.gql';
import userRegister from './user/register.gql';
import userUpdate from './user/update.gql';
import userOrders from './user/orders.gql';

const queries = {
  userGet,
  userRegister,
  userUpdate,
  userOrders,
};

export { queries };
