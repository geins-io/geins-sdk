import { GeinsCore, GraphQLService, gql } from '../src';
import { validSettings } from '../../../../test/globalSettings';

describe('GeinsCMS', () => {
  let graphqlClient: GraphQLService;

  beforeEach(() => {
    const geinsCore = new GeinsCore(validSettings);
    graphqlClient = geinsCore.graphql;

    // Reset mocks before each test
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get result from custom query', async () => {
    const MY_QUERY = gql`
      query getChannels {
        channels {
          name
          url
        }
      }
    `;

    interface Channels {
      channels: {
        name: string;
        url: string;
      }[];
    }

    const result = await graphqlClient.query<Channels>({
      query: MY_QUERY,
    });

    expect(result).toBeDefined();
    expect(result!.channels).toBeDefined();
    expect(result!.channels.length).toBeGreaterThan(0);
  });
});
