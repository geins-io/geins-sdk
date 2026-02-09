import { BaseApiService } from '@geins/core';
import type { GraphQLQueryOptions } from '@geins/core';
import { mutations } from '../graphql';
import { digest } from '../auth/authHelpers';

/** Service for requesting and committing password resets. */
export class PasswordResetService extends BaseApiService {
  /**
   * Sends a password reset email to the given address.
   * @param email - The user's email address.
   */
  async request(email: string): Promise<unknown> {
    const options: GraphQLQueryOptions = {
      query: mutations.pwResetRequest,
      variables: this.createVariables({ email }),
    };
    return this.runMutation(options);
  }

  /**
   * Commits a password reset using the reset key and new password.
   * The password is hashed before being sent to the API.
   * @param resetKey - The reset key from the password reset email.
   * @param password - The new plaintext password (will be digested).
   */
  async commit(resetKey: string, password: string): Promise<unknown> {
    const pwd = await digest(password);
    const options: GraphQLQueryOptions = {
      query: mutations.pwResetCommit,
      variables: this.createVariables({ resetKey, password: pwd }),
    };
    return this.runMutation(options);
  }
}
