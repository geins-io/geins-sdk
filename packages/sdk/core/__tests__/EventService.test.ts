import { EventService } from '../src/services/eventService';
import { BroadcastChannel } from 'broadcast-channel';
import { EventEmitter } from 'events';
import { isServerContext } from '../src/utils';
import type { GeinsEventMessage } from '@geins/types';

// Mock dependencies
jest.mock('broadcast-channel');
jest.mock('events');
jest.mock('../src/utils', () => ({
  isServerContext: jest.fn(),
}));

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(() => {
    // Set isServerContext to return false to simulate a browser environment
    (isServerContext as jest.Mock).mockReturnValue(false);

    // Create a new instance of EventService before each test
    eventService = new EventService();
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });
});
