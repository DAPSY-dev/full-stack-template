# Full-Stack Template

## Installation prerequisites

- Node.js: `v20.18.0`

## Setup environment

- Create `.env` files from `.env.example`

## Scripts

Install

```sh
npm install
```

Start (_dev_)

```sh
npm run dev
```

Build

```sh
npm run build
```

Start (_build_)

```sh
npm start
```

Clean build files

> Remove generated build files

```sh
npm run clean-build-files
```

Lint

```sh
npm run lint
```

Test backend

```sh
npm run test-backend
```

Test frontend

```sh
npm run test-frontend
```

Favicon check (_dev_)

> Dev start the app before running favicon check

```sh
npm run favicon-check-dev
```

Favicon check (_build_)

> Build start the app before running favicon check

```sh
npm run favicon-check-build
```

## Libraries and tools notes

- Favicon (Web App Manifest) generator: [RealFaviconGenerator](https://realfavicongenerator.net)

## Deploy checklist

- Files are set up correctly

  - `.env`

  - `robots.txt`

  - `site.webmanifest`

  - `sitemap.xml`
