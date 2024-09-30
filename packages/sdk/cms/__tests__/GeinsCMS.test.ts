import { GeinsCMS } from '../src/geinsCMS';
import { GeinsCore } from '@geins/core';
import {
  MenuService,
  ContentPageService,
  ContentAreaService,
} from '../src/services';
import exp from 'constants';

// Mock the services
jest.mock('../src/services/MenuService');
jest.mock('../src/services/ContentPageService');
jest.mock('../src/services/ContentAreaService');

// Mock the GeinsCore class
jest.mock('@geins/core');

describe('GeinsCMS', () => {
  let mockCore: GeinsCore;

  beforeEach(() => {
    // Create a mock instance of GeinsCore
    mockCore = new GeinsCore({} as any);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should initialize GeinsCMS with the correct services', () => {
    // Instantiate GeinsCMS
    const cms = new GeinsCMS(mockCore);

    // Verify that the services are instantiated correctly
    expect(cms.menu).toBeInstanceOf(MenuService);
    expect(cms.page).toBeInstanceOf(ContentPageService);
    expect(cms.area).toBeInstanceOf(ContentAreaService);

    // Ensure that the services are initialized with the correct parameters
    expect(MenuService).toHaveBeenCalledWith(
      mockCore.client,
      mockCore.geinsSettings,
    );
    expect(ContentPageService).toHaveBeenCalledWith(
      mockCore.client,
      mockCore.geinsSettings,
    );
    expect(ContentAreaService).toHaveBeenCalledWith(
      mockCore.client,
      mockCore.geinsSettings,
    );
  });

  it('should call services with the correct client and settings', () => {
    const cms = new GeinsCMS(mockCore);

    // Check that the service constructor is called with the correct arguments
    expect(MenuService).toHaveBeenCalledTimes(1);
    expect(ContentPageService).toHaveBeenCalledTimes(1);
    expect(ContentAreaService).toHaveBeenCalledTimes(1);

    expect(MenuService).toHaveBeenCalledWith(
      mockCore.client,
      mockCore.geinsSettings,
    );
    expect(ContentPageService).toHaveBeenCalledWith(
      mockCore.client,
      mockCore.geinsSettings,
    );
    expect(ContentAreaService).toHaveBeenCalledWith(
      mockCore.client,
      mockCore.geinsSettings,
    );
  });

  it('should use the correct client and settings from GeinsCore', () => {
    const cms = new GeinsCMS(mockCore);

    // Ensure that GeinsCMS correctly uses the client and settings from GeinsCore
    expect(cms.menu).toBeDefined();
    expect(cms.page).toBeDefined();
    expect(cms.area).toBeDefined();

    expect(cms.menu).toBeInstanceOf(MenuService);
    expect(cms.page).toBeInstanceOf(ContentPageService);
    expect(cms.area).toBeInstanceOf(ContentAreaService);

    expect(cms.menu!.get).toBeDefined();
    expect(cms.page!.get).toBeDefined();
    expect(cms.area!.get).toBeDefined();
  });
});
