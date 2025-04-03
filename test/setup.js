// Mock environment variables
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.PORT = 3007;

// Mock fetch API
global.fetch = jest.fn();

// Mock TextEncoder
global.TextEncoder = class {
    encode(str) {
        return Buffer.from(str);
    }
};

// Mock ReadableStream
global.ReadableStream = class {
    constructor(underlyingSource) {
        this.underlyingSource = underlyingSource;
    }
};

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Increase timeout for all tests
jest.setTimeout(10000); 