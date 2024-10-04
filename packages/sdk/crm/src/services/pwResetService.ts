//import type { GeinsUserRequestPasswordResetType } from '@geins/types';
import { BaseApiService, logWrite, GeinsUserInputTypeType } from '@geins/core';
import { mutations } from '../graphql';
import { digest } from '../auth/authHelpers';
export class PasswordResetService extends BaseApiService {
  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }
  async request(email: string): Promise<any> {
    const variables = {
      email,
    };
    const options = {
      query: mutations.pwResetRequest,
      variables: await this.generateVars(variables),
    };
    return this.runMutation(options);
  }

  async commit(resetKey: string, password: string): Promise<any> {
    const pwd = await digest(password);
    const variables = { resetKey, password: pwd };
    const vars = await this.generateVars(variables);
    const options = {
      query: mutations.pwResetCommit,
      variables: vars,
    };
    return this.runMutation(options);
  }
}
