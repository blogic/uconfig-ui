# OpenWRT AP UI

<p align="center" style="font-size: 1.2rem;">Basic, expandable UI to easily manage your OpenWRT-compatible device which supports the WS API</p>

<hr />

## Table of Contents

- [About](#about)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Development](#development)
  - [Production Build](#production-build)
  - [Linting & Formatting](#linting--formatting)
  - [Misc](#misc)

## ❯ About

This project is a basic UI to manage your OpenWRT-compatible device which supports the WS API. It is built with React, Typescript, TailwindCSS and Vite.

- **Typescript** - 100% Typescript, from routing to translated OpenWrt API types
- **Clear Routing Structure & Safe Routing** where you only need to define your routes in one place and the rest is taken care of for you thanks to [@tanstack/react-router](https://github.com/TanStack/router)
- **Multiple Language Support** thanks to [react-i18next](https://react.i18next.com/) and [i18next](https://www.i18next.com/)
- **TailwindCSS** for styling
- **Vite** for fast development and build times
- **Prettier** and **ESLint** for code formatting and linting
- **Pre-built Form Components** thanks to [react-hook-form](https://react-hook-form.com/) and [tailwindcss](https://tailwindcss.com/) making it easy to add your own forms to the project

## ❯ Requirements

- [Node.js](https://nodejs.org/en/) >= 14.0.0
- [npm](https://www.npmjs.com/) >= 7.0.0

## ❯ Installation

```bash
git clone https://github.com/X/X.git

cd X

npm install

```

## ❯ Usage

APP settings are stored in the .env file at the root of the project. An example is stored at the root of the project. This is where you will set the WS address the UI will attempt to connect to using the variable name **VITE_WS_URL**

### Development

When you are ready to start a development server with hot reloading enabled on port 5173 (configurable in vite.config.ts):

```bash
npm run dev
```

When you want to add or modify routes, **@tanstack/router-vite-plugin** will automatically generate the src/routeTree.gen.ts file. If you want to manually generate this file, you can run the following command:

```bash
npm run route-gen
```

### Production Build

This will create an optimized build of your site in the `dist` directory. You can then deploy this to your production environment.

```bash
npm run build
```

If you would like to run the production build on localhost you can also use:

```bash
npm run serve
```

### Linting & Formatting

This will run ESLint and throw errors if any code style issues are detected.

```bash
npm run lint
```

This will run Prettier and automatically fix any code style issues.

```bash
npm run format
```

### Misc

This will delete the `dist` & `node_modules` directories. This is useful if you want to completely reinstall your dependencies or if you want to start a fresh build.

```bash
npm run clean
```
