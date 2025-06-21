# AI-Based Job Tracking - Product Spec

## Overview

The goal of this system is to provide job seekers with an AI-based tool to track, manage, and gain insights into their ongoing application processes across different companies and roles. The user will interact with the system via a chat interface powered by a Large Language Model (LLM) and structured using Model Context Protocol (MCP).

## Goals

- Enable users to track their job search journey (companies, roles, interviews)
- Provide a chat-based interface for inserting and updating job-related events
- Allow freestyle Q&A about application statuses, timelines, people involved, and insights
- Maintain structured data while supporting natural, conversational interaction

## Core Features

### 1. Chat-Based Interaction

- **Interface**: LLM-driven conversational UI
- **Input types**: Free-text questions and structured commands
- **Backed by MCP** for structured message-context flows

### 2. Event Tracking

Track milestones per application:

- Application submitted
- Phone screen (HR/Tech)
- On-site interview
- Offer made/declined
- Rejection

Each event includes:

- Date
- Notes
- Contact person
- Outcome

### 3. Company & Role Management

- **Company**: name, industry, size, location
- **Role**: title, level, tech stack, compensation info
- **Contact(s)**: name, role (e.g., recruiter), LinkedIn URL, email

### 4. Insightful Q&A Examples

- "When was my last touch with Google?"
- "Which roles do I have pending offers from?"
- "Who interviewed me at Meta?"
- "Show me companies I haven't heard from in 2+ weeks"

## System Architecture

### Interaction Model

- Users interact with the system exclusively through a chat interface
- The LLM powers the conversation and determines when to invoke structured actions (tools) via the Model-Context Protocol (MCP)
- There is no traditional frontend — all state updates and queries are triggered through chat prompts and handled via MCP-exposed tools

### LLM + MCP Tooling Layer (Node.js)

- Acts as an API layer that exposes a set of structured tools to the LLM via MCP
- Each tool has a defined schema (name, parameters, return format)
- The LLM decides when to call a tool based on user input

Tools handle specific operations such as:

```typescript
add_interview_event(company_id, date, type, contact);
get_company_info(company_id);
```

**Important**: Tool invocations require valid, structured data. Free-form chat is only used to select and parameterize tools — not to pass raw inputs.

### Backend API & Data Store (Supabase)

Supabase acts as the backend system of record:

- PostgreSQL for structured storage
- Auth for user identity
- RLS for secure multi-user access

Each MCP tool (on the MCP server) interacts with Supabase for its data access logic via:

- REST
- RPC
- Client library

### Authentication

- Managed by Supabase Auth
- MCP server includes token verification logic for secured access to tools

## Database Schema (Supabase)

### 1. users

| Field      | Type      | Description                        |
| ---------- | --------- | ---------------------------------- |
| id         | UUID      | Primary key, Supabase Auth user ID |
| created_at | timestamp |                                    |
| email      | text      |                                    |

Usually handled by Supabase Auth, but included for completeness.

### 2. companies

| Field      | Type      | Description              |
| ---------- | --------- | ------------------------ |
| id         | UUID      | Primary key              |
| user_id    | UUID      | Foreign key → users.id   |
| name       | text      |                          |
| industry   | text      | Optional                 |
| size       | text      | Optional, e.g., "51–200" |
| location   | text      | Optional                 |
| notes      | text      | Optional                 |
| created_at | timestamp |                          |

### 3. roles

| Field                  | Type   | Description                             |
| ---------------------- | ------ | --------------------------------------- |
| id                     | UUID   | Primary key                             |
| user_id                | UUID   | Foreign key → users.id                  |
| company_id             | UUID   | Foreign key → companies.id              |
| title                  | text   |                                         |
| level                  | text   | Optional                                |
| tech_stack             | text[] | Optional                                |
| compensation_requested | jsonb  | Optional                                |
| compensation_offered   | jsonb  | Optional                                |
| status                 | enum   | open, rejected, offer, withdrawn, hired |
| source                 | text   | e.g., "LinkedIn", "headhunter message"  |
| initiated_by           | enum   | user, company                           |
| notes                  | text   | Optional                                |

Example compensation format:

```json
{
  "base": "60K NIS/month",
  "bonus": "5%",
  "rsu": "40K USD/4y",
  "espp": "15%"
}
```

### 4. interview_events

| Field        | Type      | Description                                                                                |
| ------------ | --------- | ------------------------------------------------------------------------------------------ |
| id           | UUID      | Primary key                                                                                |
| user_id      | UUID      | Foreign key → users.id                                                                     |
| role_id      | UUID      | Foreign key → roles.id                                                                     |
| event_type   | enum      | application, hr_screen, tech_screen, take_home, onsite, offer, rejection, followup, custom |
| event_date   | timestamp |                                                                                            |
| contact_id   | UUID      | Nullable, foreign key → contacts.id                                                        |
| meeting_type | enum      | phone_call, zoom_meeting, onsite_meeting, coffee_chat, other                               |
| notes        | text      | Optional                                                                                   |
| outcome      | text      | Optional                                                                                   |

### 5. contacts

| Field        | Type | Description                |
| ------------ | ---- | -------------------------- |
| id           | UUID | Primary key                |
| user_id      | UUID | Foreign key → users.id     |
| company_id   | UUID | Foreign key → companies.id |
| name         | text |                            |
| role         | text | e.g., "Recruiter"          |
| email        | text | Optional                   |
| linkedin_url | text | Optional                   |
| phone_number | text | Optional                   |
| notes        | text | Optional                   |

## End-to-End Flow

1. User types:

   ```
   "When was my last interview with Microsoft?"
   ```

2. LLM:

   - Interprets intent
   - Chooses `get_last_interview(company_name)`
   - Fills in structured parameters

3. MCP Server:

   - Validates input against tool schema
   - Queries Supabase where company = "Microsoft"

4. Supabase:

   - Returns structured data

5. LLM:

   - Generates a natural-language response

6. User:
   - Sees response in chat

## MCP Design Principles

Each user interaction is an MCP message:

```typescript
{
  'intent', 'entities', 'context', 'content';
}
```

The system maintains session context to:

- Update job state
- Disambiguate references (e.g., "the Microsoft role")
- Provide informed answers

## Future Ideas

- Priority ranking of applications
- Integration with email/calendar/LinkedIn
