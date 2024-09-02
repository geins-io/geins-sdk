export function useGeinsLog() {
  const config = useRuntimeConfig();
  const debug = config.public.geins.debug;
  const logTag = '%cgeins';
  const logStyle =
    'background-color: #e8452c; color: #FFFFFF; padding: 3px 8px 5px; border-radius: 8px; font-weight:bold; letter-spacing:0.2em; font-size:1.1em; margin-right:5px;';

  // Will only log if debug is enabled
  const geinsLog = (message: string, ...args: string[]) => {
    if (!debug) {
      return;
    }
    if (args.length) {
      console.log(logTag, logStyle, message, ...args);
    } else {
      console.log(logTag, logStyle, message);
    }
  };

  // Will always log a waring
  const geinsLogWarn = (message: string, ...args: string[]) => {
    if (args.length) {
      console.warn(logTag, logStyle, message, ...args);
    } else {
      console.warn(logTag, logStyle, message);
    }
  };

  // Will always log an error
  const geinsLogError = (message: string, ...args: string[]) => {
    if (args.length) {
      console.error(logTag, logStyle, message, ...args);
    } else {
      console.error(logTag, logStyle, message);
    }
  };

  // Will always log an info message
  const geinsLogInfo = (message: string, ...args: string[]) => {
    if (args.length) {
      console.info(logTag, logStyle, message, ...args);
    } else {
      console.info(logTag, logStyle, message);
    }
  };

  return {
    geinsLog,
    geinsLogWarn,
    geinsLogError,
    geinsLogInfo,
  };
}
