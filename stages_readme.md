# Resort Map - stages

### Stage 1

#### Backend

- reading map.ascii
- GET /map

##### Backend technologies

- Node.js
- Express
- TypeScript

##### Backend setup

```bash
npm init -y
npm install express cors
npm install -D typescript tsx @types/node @types/express
npx tsc --init
```

**Express**: is a web framework for Node.js that simplifies building servers and managing HTTP routes.
**CORS**: is a package that allows your server to accept requests from different origins (domains).
**typescript**: is the core compiler that converts TypeScript code into standard JavaScript.
**tsx**: is a fast runner that lets you execute TypeScript files directly during development without manual compilation.
**@types/node**: is a type definitions for Node.js that provide autocomplete and error checking for built-in modules.
**@types/express**: is a type definitions for the Express framework to ensure type safety for requests and responses.
**npx tsc --init**: creates a tsconfig.json file, which stores project's TypeScript configuration setting.

### Stage 2

#### Frontend

- render grid
- show cabanas

##### Frontend technologies

- react
- typescript
- vite

##### Frontend setup

```bash
npm create vite@latest . -- --template react-ts
npm install
```

**Vite**: A modern, ultra-fast build tool that serves your code during development and bundles it for production.
**React**: The core library for building user interfaces using components.
**TypeScript (template)**: Pre-configured support for writing your React components with static typing.
**Development environment**: A ready-to-use structure with folders (like src/), a local dev server, and essential configuration files.
**npm install**: Downloads all dependencies (React, TypeScript, Vite) listed in package.json into your local node_modules folder.
**npm run dev**: Starts the local development server so you can see your app in the browser (usually at localhost:5173).

### Stage 3

- click cabana
- modal

#### Stage 4

- POST booking
- update UI

#### Stage 5

- tests

##### Backend tests

- vitest
- supertest

##### Frontend tests

- React Testing Library

#### Stage 6

- README.md
- AI.md
