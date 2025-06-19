# Job Tracker MCP Server

A TypeScript-based Master Control Program server for job tracking.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
PORT=3000
NODE_ENV=development
```

## Development

To run the server in development mode with hot reload:
```bash
npm run dev
```

## Production

To build and run the server in production:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check endpoint 