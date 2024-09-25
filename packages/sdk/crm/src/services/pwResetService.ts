import type { UserRequestPasswordResetMutation } from '@geins/types';
import { BaseApiService, logWrite, UserInputType } from '@geins/core';
import { mutaions } from '../graphql';
import { digest } from '../auth/authHelpers';
export class PasswordResetService extends BaseApiService {
  private async generateVars(variables: any) {
    return this.createVariables(variables);
  }
  async request(email: string): Promise<any> {
    const variables = {
      email,
    };
    const vars = await this.generateVars(variables);
    return this.runMutation(mutaions.pwResetRequest, vars);
  }

  async commit(resetKey: string, password: string): Promise<any> {
    const pwd = await digest(password);
    const variables = { resetKey, password: pwd };
    const vars = await this.generateVars(variables);
    logWrite('commit', vars);
    return this.runMutation(mutaions.pwResetCommit, vars);
  }
}
