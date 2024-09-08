interface LogTypes {
  trace: LogTypeMeta;
  debug: LogTypeMeta;
  info: LogTypeMeta;
  warn: LogTypeMeta;
  error: LogTypeMeta;
}

interface LogTypeMeta {
  abbreviation: string;
  name: string;
  color: string;
  icon: string;
}

interface LogTypeFiles {
  typescript: LogFileMeta;
  javascript: LogFileMeta;
  vue: LogFileMeta;
  jsx: LogFileMeta;
  tsx: LogFileMeta;
  next: LogFileMeta;
  react: LogFileMeta;
  astro: LogFileMeta;
  angular: LogFileMeta;
  svelte: LogFileMeta;
}

interface LogFileMeta {
  abbreviation: string;
  name: string;
  color: string;
  colorServer: string;
  icon?: string;
  fileExtensions: string[]; // Added fileExtensions for identifying file type by extension
}

const logColorServer = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',

  fgBlack: '\x1b[30m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

const logLevels = ['trace', 'debug', 'info', 'warn', 'error'] as const; // Fixed logLevels
type LogLevel = (typeof logLevels)[number];

const logTypes: LogTypes = {
  trace: {
    abbreviation: 'T',
    name: 'Trace',
    color: '#881DD7',
    icon: '🔍',
  },
  debug: {
    abbreviation: 'D',
    name: 'Debug',
    color: '#128655',
    icon: '🐛',
  },
  info: {
    abbreviation: 'I',
    name: 'Info',
    color: '#18A7B4',
    icon: 'ℹ️',
  },
  warn: {
    abbreviation: 'W',
    name: 'Warning',
    color: '#D7881D',
    icon: '⚠️',
  },
  error: {
    abbreviation: 'E',
    name: 'Error',
    color: '#D72B1D',
    icon: '❌',
  },
};

const logTypeFiles: LogTypeFiles = {
  typescript: {
    abbreviation: 'TS',
    name: 'TypeScript',
    colorServer: logColorServer.bgBlue,
    color: '#007ACC',
    icon: '📘',
    fileExtensions: ['.ts', '.tsx'],
  },
  javascript: {
    abbreviation: 'JS',
    name: 'JavaScript',
    color: '#F7DF1E',
    colorServer: logColorServer.bgYellow,
    icon: '📙',
    fileExtensions: ['.js', '.mjs'],
  },
  vue: {
    abbreviation: 'VUE',
    name: 'Vue',
    color: '#41B883',
    colorServer: logColorServer.bgGreen,
    icon: '🖼️',
    fileExtensions: ['.vue'],
  },
  jsx: {
    abbreviation: 'JSX',
    name: 'JSX',
    color: '#61DAFB',
    colorServer: logColorServer.bgCyan,
    icon: '📘',
    fileExtensions: ['.jsx'],
  },
  tsx: {
    abbreviation: 'TSX',
    name: 'TSX',
    color: '#007ACC',
    colorServer: logColorServer.bgBlue,
    icon: '📘',
    fileExtensions: ['.tsx'],
  },
  next: {
    abbreviation: 'NEXT',
    name: 'Next.js',
    color: '#000000',
    colorServer: logColorServer.bgBlue,
    icon: '🚀',
    fileExtensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  react: {
    abbreviation: 'REACT',
    name: 'React',
    color: '#61DAFB',
    colorServer: logColorServer.bgBlue,
    icon: '⚛️',
    fileExtensions: ['.jsx', '.tsx'],
  },
  astro: {
    abbreviation: 'ASTRO',
    name: 'Astro',
    color: '#FF5D01',
    colorServer: logColorServer.fgMagenta,
    icon: '🌌',
    fileExtensions: ['.astro'],
  },
  angular: {
    abbreviation: 'ANG',
    name: 'Angular',
    color: '#DD0031',
    colorServer: logColorServer.bgBlue,
    icon: '🅰️',
    fileExtensions: ['.ts', '.html'],
  },
  svelte: {
    abbreviation: 'SVELTE',
    name: 'Svelte',
    color: '#FF3E00',
    colorServer: logColorServer.bgBlue,
    icon: '🔥',
    fileExtensions: ['.svelte'],
  },
};

const frameworkPatterns: { [framework: string]: RegExp } = {
  'Nuxt.js': /\/_nuxt\//,
  'Vue.js': /\/\.vue\//,
  React: /\/react\//,
  Angular: /\/angular\//,
  Svelte: /\/svelte\//,
  'Next.js': /\/next\//,
  Astro: /\/astro\//,
};

export class LogService {
  private static configIsEnabled: boolean = true;
  private static configLogLevel: LogLevel = 'debug';

  // Set configuration for enabling/disabling logs and log levels
  public static configure({
    isEnabled = true,
    logLevel = 'debug',
  }: {
    isEnabled?: boolean;
    logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error';
  } = {}): void {
    LogService.configIsEnabled = isEnabled;
    LogService.configLogLevel = logLevel;
  }

  public static isServer(): boolean {
    return typeof window === 'undefined';
  }

  public static trace(...args: any[]): void {
    LogService.log('trace', args);
  }

  public static debug(...args: any[]): void {
    LogService.log('debug', args);
  }

  public static info(...args: any[]): void {
    LogService.log('info', args);
  }

  public static warn(...args: any[]): void {
    LogService.log('warn', args);
  }

  public static error(...args: any[]): void {
    LogService.log('error', args);
  }

  private static log(logLevel: LogLevel, args: any[]): void {
    const { methodName, fileName, className, framework, fileType } =
      LogService.getCallerInfoExtended();

    LogService.output(
      logLevel,
      methodName,
      fileName,
      className,
      framework,
      fileType,
      args,
    );
  }

  private static output(
    logLevel: LogLevel,
    methodName: string,
    fileName: string,
    className: string,
    framework: string | null,
    fileType: LogFileMeta | null,
    args: any[],
  ): void {
    const typeMeta = logTypes[logLevel];
    const fileTypeInfo = fileType ? ` (${fileType.name})` : '';
    const frameworkInfo = framework ? ` [${framework}]` : '';
    const methodInfo = methodName ? `${methodName}()` : '';
    const classInfo = className ? `${className}.` : '';

    const boxColor = fileType ? fileType.color : typeMeta.color;
    const boxtColorServer = fileType ? fileType.colorServer : typeMeta.color;
    const icon = fileType ? fileType.icon : typeMeta.icon;

    if (LogService.isServer()) {
      console.log(
        `${boxtColorServer}${icon} ${fileName} ${logColorServer.reset} ${classInfo}${methodInfo}${logColorServer.reset}`,
      );

      args.forEach((arg) => {
        console.log(
          `%c>>`,
          `color: ${typeMeta.color}; margin-left: 5px; font-weight: bold;`,
          arg,
        );
      });
    } else {
      console.log(
        `%c${icon} ${fileName}%c ${classInfo}${methodInfo}`,
        `background: ${boxColor}; padding: 2px 8px; border-radius: 2px 0 0 2px; color: #fff`,
        'background: #D3D3D3; color: #000; padding: 2px 8px; border-radius: 0 2px 2px 0;',
      );

      args.forEach((arg) => {
        console.log(
          `%c>>`,
          `color: ${typeMeta.color}; margin-left: 5px; font-weight: bold;`,
          arg,
        );
      });
    }
  }

  private static getCallerInfoExtended(): {
    methodName: string;
    fileName: string;
    className: string;
    framework: string | null;
    fileType: LogFileMeta | null;
  } {
    let error: any = {};

    try {
      throw new Error('');
    } catch (e) {
      error = e;
    }

    if (!error.stack) {
      return {
        methodName: 'anonymous',
        fileName: 'unknown',
        className: '',
        framework: null,
        fileType: null,
      };
    }

    const stack = error.stack.split('\n');
    let framework: string | null = null;

    if (LogService.isServer()) {
      framework = 'node.js';
      // logic for server server side
      for (let i = 1; i < stack.length; i++) {
        const line = stack[i];
        // Skip internal lines related to LogService and node_modules
        if (
          line.includes('LogService') ||
          line.includes('node_modules') ||
          line.includes('logService.ts')
        ) {
          continue;
        }
        // Extract class name (optional) and method name (mandatory)
        const methodNameMatch = line.match(/at (?:([\w$]+)\.)?(\w+)\s*\(/); // Optional className, methodName
        const filePathMatch =
          line.match(/(http.*\.\w+)/) || line.match(/at (.*):\d+:\d+/);

        const className = methodNameMatch ? methodNameMatch[1] || '' : ''; // Return an empty string if class name is not found
        const methodName = methodNameMatch ? methodNameMatch[2] : 'anonymous';
        let fileName = 'unknown';
        let fileType: LogFileMeta | null = null;

        if (filePathMatch) {
          const fullFilePath = filePathMatch[1];
          const filePath = fullFilePath.split('/') || [];
          fileName = filePath.pop() || 'unknown'; // Extract only the file name
          filePath.reverse();
          const filePathString = filePath.slice(0, 3).reverse().join('/');
          fileType = LogService.getFileTypeFromExtension(fileName);
          fileName = `${filePathString}/${fileName}`;
        }

        return { methodName, fileName, className, framework, fileType };
      }
    } else {
      // Identify framework based on common paths or file patterns in the stack trace
      for (const line of stack) {
        for (const [name, pattern] of Object.entries(frameworkPatterns)) {
          if (pattern.test(line)) {
            framework = name;
            break;
          }
        }
        if (framework) break;
      }

      // Iterate over the stack and find the first line that doesn't reference LogService or node_modules
      for (let i = 1; i < stack.length; i++) {
        const line = stack[i];

        // Skip internal lines related to LogService and node_modules
        if (line.includes('LogService') || line.includes('node_modules')) {
          continue;
        }

        // Extract class name (optional) and method name (mandatory)
        const methodNameMatch = line.match(/at (?:([\w$]+)\.)?(\w+)\s*\(/); // Optional className, methodName
        const filePathMatch =
          line.match(/(http.*\.\w+)/) || line.match(/at (.*):\d+:\d+/);

        const className = methodNameMatch ? methodNameMatch[1] || '' : ''; // Return an empty string if class name is not found
        const methodName = methodNameMatch ? methodNameMatch[2] : 'anonymous';
        let fileName = 'unknown';
        let fileType: LogFileMeta | null = null;

        if (filePathMatch) {
          let fullFilePath = filePathMatch[1];
          fullFilePath = fullFilePath.split('?')[0]; // Remove query strings if present
          fileName = fullFilePath.split('/').pop() || 'unknown'; // Extract only the file name

          // Get file type based on file extension
          fileType = LogService.getFileTypeFromExtension(fileName);
        }

        return { methodName, fileName, className, framework, fileType };
      }
    }

    return {
      methodName: 'anonymous',
      fileName: 'unknown',
      className: '',
      framework: null,
      fileType: null,
    };
  }

  // Helper method to get file type from extension
  private static getFileTypeFromExtension(
    fileName: string,
  ): LogFileMeta | null {
    for (const key in logTypeFiles) {
      const fileType = logTypeFiles[key as keyof LogTypeFiles];
      if (fileType.fileExtensions.some((ext) => fileName.endsWith(ext))) {
        return fileType;
      }
    }
    return null; // Return null if the file type is not identified
  }
}
