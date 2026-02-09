import { UserService } from '../src/services/userService';
import { GeinsError } from '@geins/core';

function createMockApiClient() {
  const mockClient = {
    runQuery: jest.fn(),
    runMutation: jest.fn(),
  };
  return { getter: () => mockClient as any, mock: mockClient };
}

const settings = {
  channel: 'test-channel',
  tld: 'se',
  locale: 'sv-SE',
  market: 'SE',
} as any;

describe('UserService', () => {
  let service: UserService;
  let mockClient: ReturnType<typeof createMockApiClient>['mock'];

  beforeEach(() => {
    const client = createMockApiClient();
    mockClient = client.mock;
    service = new UserService(client.getter, settings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('get', () => {
    it('returns user from getUser response', async () => {
      mockClient.runQuery.mockResolvedValue({
        data: {
          getUser: {
            id: 1,
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      });

      const result = await service.get('user-token-123');
      expect(result).toBeDefined();
      expect(result!.email).toBe('john@example.com');
    });

    it('passes userToken in query options', async () => {
      mockClient.runQuery.mockResolvedValue({ data: { getUser: { id: 1 } } });

      await service.get('my-token');

      const callArgs = mockClient.runQuery.mock.calls[0][0];
      expect(callArgs.userToken).toBe('my-token');
    });

    it('throws when data is missing', async () => {
      mockClient.runQuery.mockResolvedValue({});

      await expect(service.get('token')).rejects.toThrow(GeinsError);
    });

    it('returns undefined when no user found', async () => {
      mockClient.runQuery.mockResolvedValue({ data: {} });

      const result = await service.get('token');
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('creates user via mutation', async () => {
      const user = { email: 'new@example.com', firstName: 'Jane' };
      mockClient.runMutation.mockResolvedValue({
        data: {
          updateUser: {
            id: 2,
            email: 'new@example.com',
            firstName: 'Jane',
          },
        },
      });

      const result = await service.create(user as any, 'token');
      expect(result).toBeDefined();
      expect(result!.email).toBe('new@example.com');
    });

    it('transforms entityId to personalId', async () => {
      const user = { email: 'test@example.com', entityId: '12345' };
      mockClient.runMutation.mockResolvedValue({ data: { updateUser: { id: 1 } } });

      await service.create(user as any, 'token');

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      const userVar = callArgs.variables.user;
      expect(userVar.personalId).toBe('12345');
      expect(userVar.entityId).toBeUndefined();
    });

    it('converts newsletter string to boolean', async () => {
      const user = { email: 'test@example.com', newsletter: 'true' };
      mockClient.runMutation.mockResolvedValue({ data: { updateUser: { id: 1 } } });

      await service.create(user as any, 'token');

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.user.newsletter).toBe(true);
    });

    it('converts non-true newsletter to false', async () => {
      const user = { email: 'test@example.com', newsletter: 'false' };
      mockClient.runMutation.mockResolvedValue({ data: { updateUser: { id: 1 } } });

      await service.create(user as any, 'token');

      const callArgs = mockClient.runMutation.mock.calls[0][0];
      expect(callArgs.variables.user.newsletter).toBe(false);
    });
  });

  describe('update', () => {
    it('updates user via mutation', async () => {
      const user = { firstName: 'Updated' };
      mockClient.runMutation.mockResolvedValue({
        data: {
          updateUser: { id: 1, firstName: 'Updated' },
        },
      });

      const result = await service.update(user as any, 'token');
      expect(result).toBeDefined();
      expect((result as any).firstName).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('returns true on success', async () => {
      mockClient.runMutation.mockResolvedValue({ data: { deleteUser: true } });

      const result = await service.delete('token');
      expect(result).toBe(true);
    });

    it('returns false on falsy response', async () => {
      mockClient.runMutation.mockResolvedValue(null);

      const result = await service.delete('token');
      expect(result).toBe(false);
    });
  });
});
