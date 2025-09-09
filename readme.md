# Anryverse Express Template

Minimal Express.js template for quick API/project bootstrapping.

## Features

- Simple Express server
- Environment-driven configuration
- Typescript
- ESLint

## Environment variables

There are two environment variables used by this template:

- `PORT` — TCP port the server listens on (default: `3000`)
- `NODE_ENV` — runtime environment, e.g. `development` or `production` (default: `development`)

Example `.env`:

```env
PORT=3000
NODE_ENV=development
```

## Requirements

- Node.js
- pnpm

## Installation

Clone the repository and enter the project folder:

```bash
git clone https://github.com/anry20/anryverse-express.git
cd anryverse-express
```

Install dependencies:

```bash
pnpm install
```

Create or copy the environment file and adjust values:

```bash
# Copy example env to .env
# Unix / macOS:
cp .env.example .env

# Windows CMD:
copy .env.example .env

# PowerShell:
Copy-Item .env.example -Destination .env

# edit .env as needed
```

Start the development server:

```bash
pnpm run dev
```

## Linting

Run ESLint to check code quality and formatting:

```bash
pnpm run lint           # run linter
```

## Scripts

- `pnpm run dev` — start the server for development
- `pnpm run build` — build the project
- `pnpm start` — start the server for production (`NODE_ENV=production`)

Example:

```bash
pnpm run dev
# or
pnpm start
```

You can also set env vars inline:

```bash
PORT=3000 NODE_ENV=production pnpm start
```

## Notes

- Ensure `PORT` and `NODE_ENV` are set in production.
- Adjust scripts to match your preferred tooling (nodemon, pm2, docker, etc.).

## License

MIT
