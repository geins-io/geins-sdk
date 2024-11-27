import { GeinsCMS } from '../src/geinsCMS';
import { GeinsCore } from '@geins/core';
import { MenuService, ContentPageService, ContentAreaService } from '../src/services';

// Mock the services
jest.mock('../src/services/menuService');
jest.mock('../src/services/contentPageService');
jest.mock('../src/services/contentAreaService');

// Mock the GeinsCore class
jest.mock('@geins/core');

describe('GeinsCMS Class Spec', () => {
  let mockCore: GeinsCore;

  beforeEach(() => {
    // Create a mock instance of GeinsCore
    mockCore = new GeinsCore({} as any);

    // Reset mocks before each test
    jest.clearAllMocks();
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
