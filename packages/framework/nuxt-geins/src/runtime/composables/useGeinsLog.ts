import { useRuntimeConfig } from '#app';

export function useGeinsLog() {
  const config = useRuntimeConfig();
  const debug = config.public.geins.debug;
  const logTag = '%cgeins';
  const logStyle =
    'background-color: #e8452c; color: #FFFFFF; padding: 3px 8px 5px; border-radius: 8px; font-weight:bold; letter-spacing:0.2em; font-size:1.1em; margin-right:5px;';

  const createLogger = (
    method: 'log' | 'warn' | 'error' | 'info',
    alwaysLog = false,
  ) => {
    return (message: string, ...args: string[]) => {
      if (!alwaysLog && !debug) {
        return;
      }
      console[method](logTag, logStyle, message, ...args);
    };
  };

  const geinsLog = createLogger('log'); // Will only log if debug is enabled
  const geinsLogWarn = createLogger('warn', true); // Will always log a warning
  const geinsLogError = createLogger('error', true); // Will always log an error
  const geinsLogInfo = createLogger('info', true); // Will always log an info message

  return {
    geinsLog,
    geinsLogWarn,
    geinsLogError,
    geinsLogInfo,
  };
}
