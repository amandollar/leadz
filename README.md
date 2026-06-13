# Agency CRM

A modern, premium multi-tenant SaaS application designed for agencies to coordinate leads, track sales pipelines, and manage internal team roles.

---

## 🚀 Key Features

* **Multi-Tenant Workspace Boundaries**: Enforces strict database-level isolation of all leads, contacts, and logs based on the user's registered workspace context.
* **Seamless Agency Registration**: Instant self-serve signup flow at `/signup` that registers a new workspace and initializes the user as the workspace `Admin` owner.
* **Team Management & Role Administration**: 
  - Dynamic roster directory showing team members with role-specific styled color gradients.
  - Interactive counter cards displaying member counts and category stats.
  - Support for `Admin`, `Manager`, `Sales Representative`, and `Intern` access roles.
* **Onboarding & Password Reset Gate**: 
  - Generates secure, copyable 10-character temporary passwords when inviting team members.
  - Intercepts initial login attempts via custom Rails middleware, forcing users to set a permanent password at the `/force_reset` gate before accessing any CRM data.
* **Premium SaaS Aesthetics**: Uses Inter typography, smooth CSS backdrop gradients, soft input focus effects, transitions, and responsive navigation sidebars.

---

## 🛠️ Technology Stack

* **Backend**: Ruby on Rails (PostgreSQL Database)
* **Frontend**: React (wrapped with Inertia.js, bundled via Vite)
* **Styling**: Tailwind CSS
* **Code Quality**: RuboCop static code analysis (Rails-omakase compliant)
* **Deployment Blueprint**: Render IaC Configuration
* **CI/CD**: GitHub Actions (linting, vulnerability checks, tests)

---

## 💻 Local Setup & Development

### Prerequisites

Ensure you have the following installed locally:
* **Ruby**: `~> 3.2` (or version specified in `.ruby-version`)
* **Node.js**: `>= 20.0.0`
* **PostgreSQL**: Running locally or via Docker

### 1. Clone & Install Dependencies

Clone the repository and install the gem and npm packages:

```bash
bundle install
npm install
```

### 2. Configure Database

Setup the database environment and load seeds (contains sample workspace and user credentials):

```bash
bundle exec rails db:prepare db:seed
```

### 3. Run Development Servers

Start the Rails application and Vite HMR dev server concurrently using the Rails dev command:

```bash
bin/dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## 🧪 Testing & Linting

### Running Automated Tests
Run the Rails controller, model, integration, and system test suite:

```bash
bundle exec rails test
```

### Code Style Compliance (RuboCop)
To check code compliance and linting constraints:

```bash
bundle exec rubocop
```

To run auto-correction on any style violations:

```bash
bundle exec rubocop -A
```

---

