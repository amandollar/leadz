# Leadz - Agency CRM

Leadz is a multi-tenant CRM built to coordinate leads, track sales pipelines, and manage internal team roles within agencies. It enforces strict workspace boundaries and provides robust role-based access control.

## Key Features

* **Multi-Tenant Architecture**: Enforces database-level isolation of all leads, contacts, and logs based on the user's workspace context.
* **Workspace Registration**: Self-serve signup flow at `/signup` that registers a new workspace and initializes the creator as the workspace Admin.
* **Role-Based Access Control (RBAC)**: Supports roles including Admin, Manager, Sales Representative, and Intern.
* **Onboarding Security Gate**: Custom Rails middleware that intercepts initial login attempts for invited users, forcing a password reset before accessing CRM resources.
* **Modern Interface**: Designed using React and Tailwind CSS, loaded via Inertia.js with no client-side routing overhead.

## Technical Stack

* **Backend Framework**: Ruby on Rails 8
* **Frontend Integration**: Inertia.js
* **Frontend Framework**: React
* **Build System**: Vite
* **Database**: PostgreSQL
* **CSS Framework**: Tailwind CSS
* **Code Quality**: RuboCop (Rails-omakase compliant)

## Prerequisites

* **Ruby**: 4.0.3 (or version specified in `.ruby-version`)
* **Node.js**: >= 20.19.0 or >= 22.12.0 (required by Vite)
* **PostgreSQL**: Local or Docker instance

## Development Setup

### 1. Install Dependencies

Install the required Ruby gems and Node modules:

```bash
bundle install
npm install
```

### 2. Database Setup

Create the database, run migrations, and load seed data:

```bash
bundle exec rails db:prepare db:seed
```

### 3. Start the Development Servers

Run the Rails application and Vite HMR development server concurrently:

```bash
bin/dev
```

The application will be accessible at `http://localhost:3000`.

## Testing and Code Quality

### Running Tests

Execute the Rails test suite (models, controllers, integration, and system tests):

```bash
bundle exec rails test
```

### Code Style and Linting

To analyze the codebase against style guidelines:

```bash
bundle exec rubocop
```

To automatically resolve fixable style offenses:

```bash
bundle exec rubocop -A
```

