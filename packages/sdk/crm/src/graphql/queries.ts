import userGet from './user/get.gql';
import userOrders from './order/orders.gql';
import userRegister from './user/register.gql';
import userUpdate from './user/update.gql';
import userDelete from './user/delete.gql';
import pwResetRequest from './auth/pw-reset-request.gql';
import pwResetCommit from './auth/pw-reset-commit.gql';

const queries = {
  userGet,
  userOrders,
};
const mutations = {
  userRegister,
  userUpdate,
  userDelete,
  pwResetRequest,
  pwResetCommit,
};

export { queries, mutations };
