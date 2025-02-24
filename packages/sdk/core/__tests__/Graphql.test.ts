
import { GeinsCore, GraphQLService, gql } from '@geins/core';
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

  it('should get result from custom string query', async () => {
    const MY_QUERY = `
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

    graphqlClient.log_to_console = true;

    const result = await graphqlClient.query<Channels>({
      queryAsString: MY_QUERY,
    });

    expect(result).toBeDefined();
    expect(result!.channels).toBeDefined();
    expect(result!.channels.length).toBeGreaterThan(0);
  });

  it('should add standard vars is if present in query', async () => {
    const MY_QUERY = `
    query listPageInfo(
    $url: String!
    $channelId: String
    $languageId: String
    $marketId: String
    ) {
      listPageInfo(
        url: $url
        channelId: $channelId
        languageId: $languageId
        marketId: $marketId
      ) {
            id
            alias
            canonicalUrl
            primaryImage
            name
            primaryDescription
            secondaryDescription
            hideTitle
            hideDescription
            logo
            meta {
               title
                description
            }
            subCategories {
              name
              alias
              canonicalUrl
            }
      }
    }
    `;

    graphqlClient.log_to_console = true;

    const result = await graphqlClient.query<any>({
      queryAsString: MY_QUERY,
      variables: {
        url: 'home-interior',
      },
    });

    expect(result).toBeDefined();
  });
});
