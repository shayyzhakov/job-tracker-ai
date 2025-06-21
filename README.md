# Job Tracker MCP Server

A Model Context Protocol (MCP) server for tracking job interview processes using AI-powered chat interaction.

## Overview

This service exposes structured tools (via MCP) that enable users to log, update, and query their ongoing job applications, interviews, contacts, and outcomes — all through natural language conversations with an LLM. Backed by Supabase for fast prototyping and persistent storage, it's designed to work seamlessly with LLMs like GPT Claude.

## Features

- **Structured Event Tracking**
  - Applications
  - Interviews
  - Offers
  - Follow-ups
- **Company & Role Management**
  - Company profiles
  - Role details and requirements
- **Data Management**
  - Compensation tracking
  - Contact history
  - Application status updates
- **AI-Powered Assistance**
  - Context-aware Q&A
  - Natural language interaction
  - Intelligent insights

## Design

The Job Tracker is built with a modern, scalable architecture:

### Backend Infrastructure

- **Supabase Backend**
  - PostgreSQL database for robust data storage
  - Row Level Security (RLS) for data privacy
  - Built-in authentication and user management

### System Components

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   LLM Chat   │────>│   MCP Tools  │────>│   Supabase   │
│  Interface   │     │   Server     │     │   Backend    │
└──────────────┘     └──────────────┘     └──────────────┘
```

- **MCP Tools Layer**: Exposes structured endpoints for LLM interaction
- **Data Models**:
  - Companies
  - Roles (applications)
  - Interview Events
  - Contacts

The system leverages Supabase's serverless architecture, eliminating the need for traditional backend maintenance while providing enterprise-grade reliability and security.

## How To Use

### Prerequisites

1. Node.js installed on your system
2. A Supabase account and project
3. Your Supabase project URL and user token

### Setup in Your AI Development Environment

1. Add the following configuration to your AI agent's MCP servers configuration:

```json
{
  "mcpServers": {
    "job-tracker": {
      "command": "node",
      "args": [
        "<path-to-job-tracker>/dist/index.js",
        "<your-supabase-project-url>",
        "<your-user-token>"
      ]
    }
  }
}
```

Replace the placeholders:

- `<path-to-job-tracker>`: Path to the installed job-tracker-mcp directory
- `<your-supabase-project-url>`: Your Supabase project URL
- `<your-user-token>`: Your Supabase user JWT token

### Available Commands

Once configured, you can interact with the job tracker through natural language in your AI chat. Examples:

- "Add a new company I'm applying to"
- "Log a new interview for [company]"
- "Update the status of my application at [company]"
- "Show me all my upcoming interviews"
- "List all companies I've applied to"

The AI will automatically use the appropriate MCP tools to manage your job search data.

### Printing Logs

The log file is written to `mcp-tool.log` in your user's home directory.
To view the application's logs in real-time, you can use the following command in your terminal:

```bash
tail -f ~/mcp-tool.log
```
