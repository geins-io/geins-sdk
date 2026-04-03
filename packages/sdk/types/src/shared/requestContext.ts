/**
 * Optional per-request overrides for locale and market context.
 *
 * When passed to service methods, these fields take precedence over the
 * SDK-level settings configured in GeinsSettings. This allows a single SDK
 * instance to serve requests targeting different locales or markets without
 * reinitialisation.
 */
export type RequestContext = {
  /** BCP-47 language tag to use instead of the SDK-level locale (e.g. "sv-SE"). */
  languageId?: string;
  /** Market identifier to use instead of the SDK-level market (e.g. "se"). */
  marketId?: string;
  /** Channel identifier to use instead of the derived channelId (e.g. "channel|tld"). */
  channelId?: string;
  /** JWT bearer token for authenticated requests (e.g. CMS preview, user-specific content). */
  userToken?: string;
};
