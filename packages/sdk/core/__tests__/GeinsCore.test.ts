import { GeinsCore } from '@geins/core';
import { GeinsSettings } from '@geins/types';
import { validSettings } from '../../../../test/globalSettings';

describe('GeinsCore', () => {
  describe('Real API Calls', () => {
    let geinsCore: GeinsCore;
    beforeEach(() => {
      geinsCore = new GeinsCore(validSettings);
      // Reset mocks before each test
      jest.clearAllMocks();
    });
    it('should list channels', async () => {
      const channels = await geinsCore.channel.all();
      expect(channels).toBeDefined();
      expect(channels!.length).toBeGreaterThan(0);
    });
  });

  it('should initialize with valid settings', () => {
    expect(() => new GeinsCore(validSettings)).not.toThrow();
    const geinsCore = new GeinsCore(validSettings);
    expect(geinsCore).toBeInstanceOf(GeinsCore);
    expect(geinsCore.geinsSettings).toEqual(validSettings);
  });

  it('should throw an error when channel is missing', () => {
    const invalidSettings: Partial<GeinsSettings> = {
      ...validSettings,
      channel: undefined as any,
    };
    expect(() => new GeinsCore(invalidSettings as GeinsSettings)).toThrow('Channel is required');
  });

  it('should throw an error when API key is missing', () => {
    const invalidSettings: Partial<GeinsSettings> = {
      ...validSettings,
      apiKey: undefined as any,
    };
    expect(() => new GeinsCore(invalidSettings as GeinsSettings)).toThrow('API Key is required');
  });

  it('should throw an error when Account name is missing', () => {
    const invalidSettings: Partial<GeinsSettings> = {
      ...validSettings,
      accountName: undefined as any,
    };
    expect(() => new GeinsCore(invalidSettings as GeinsSettings)).toThrow('Account name is required');
  });

  it('should use default environment when not specified', () => {
    const settingsWithoutEnvironment: Omit<GeinsSettings, 'environment'> = {
      ...validSettings,
    };
    delete (settingsWithoutEnvironment as any).environment;
    const geinsCore = new GeinsCore(settingsWithoutEnvironment);
    expect(geinsCore.geinsSettings.environment).toBe('prod');
  });

  it('should correctly set up endpoints', () => {
    const geinsCore = new GeinsCore(validSettings);
    expect(geinsCore.endpoints).toHaveProperty('main');
    expect(geinsCore.endpoints).toHaveProperty('auth');
    expect(geinsCore.endpoints).toHaveProperty('authSign');
    expect(geinsCore.endpoints).toHaveProperty('image');
  });
});
