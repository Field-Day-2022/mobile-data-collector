# Contributing

## Prerequisites

-   Node.js 20 (matches CI; any 18+ should work locally)
-   npm
-   Access to the `asu-field-day` Firebase project

## Local development

1. Install dependencies:
    ```bash
    npm install
    ```
2. Copy the env template and fill it in:
    ```bash
    cp .env.example .env.local
    ```
    Find the values in the Firebase Console: **Project settings → General → Your apps → SDK setup and configuration**. `REACT_APP_FIREBASE_DATABASE_URL` lives under **Build → Realtime Database** if it isn't shown in the SDK snippet.
3. Start the dev server:
    ```bash
    npm start
    ```

`.env.local` is gitignored and stays on your machine. Never commit real Firebase config values to source — they belong in `.env.local` locally and in GitHub Actions repo variables in CI.

## Firebase configuration

The app reads its Firebase config from environment variables at build time (Create React App inlines anything prefixed `REACT_APP_*` into the bundle). The config object lives in [src/firebase.js](src/firebase.js); all values are sourced from `process.env.REACT_APP_FIREBASE_*`.

Required variables (same names for local `.env.local` and CI):

| Variable                                 | Source in Firebase Console              |
| ---------------------------------------- | --------------------------------------- |
| `REACT_APP_FIREBASE_API_KEY`             | Project settings → General → SDK config |
| `REACT_APP_FIREBASE_AUTH_DOMAIN`         | Project settings → General → SDK config |
| `REACT_APP_FIREBASE_DATABASE_URL`        | Build → Realtime Database               |
| `REACT_APP_FIREBASE_PROJECT_ID`          | Project settings → General → SDK config |
| `REACT_APP_FIREBASE_STORAGE_BUCKET`      | Project settings → General → SDK config |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Project settings → General → SDK config |
| `REACT_APP_FIREBASE_APP_ID`              | Project settings → General → SDK config |
| `REACT_APP_FIREBASE_MEASUREMENT_ID`      | Project settings → General → SDK config |

These are not secret — Firebase web config ships in the static JS bundle to every browser. Access is gated by Firestore security rules and API key restrictions configured in the Firebase Console, not by hiding the keys.

## GitHub repo settings (CI/CD)

Both deployment workflows ([firebase-hosting.merge.yml](.github/workflows/firebase-hosting.merge.yml) for `main`, [firebase-hosting-pull-request.yml](.github/workflows/firebase-hosting-pull-request.yml) for PR previews) pull config from GitHub Actions repo variables and secrets.

Configure these in the GitHub repo under **Settings → Secrets and variables → Actions**:

### Variables (Variables tab)

Add each of the eight `REACT_APP_FIREBASE_*` names from the table above, with the same values you used in `.env.local`.

### Secrets (Secrets tab)

| Secret                                   | Contents                                                                                                                                                                                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT_ASU_FIELD_DAY` | JSON service-account key with **Firebase Hosting Admin** role for the `asu-field-day` project. Generate via Firebase Console → Project settings → Service accounts → Generate new private key, then paste the full JSON as the secret value. |

`GITHUB_TOKEN` is provided automatically by GitHub Actions — you don't need to create it.

## Deployments

-   **Production**: every push to `main` triggers [firebase-hosting.merge.yml](.github/workflows/firebase-hosting.merge.yml), which builds and deploys to the live channel of `asu-field-day-pwa`.
-   **PR previews**: every pull request triggers [firebase-hosting-pull-request.yml](.github/workflows/firebase-hosting-pull-request.yml), which builds and deploys to a temporary preview channel. The preview URL is posted as a comment on the PR. Previews skip for PRs from forks (secrets aren't shared).

Both workflows use Node 20, install via `npm ci`, build with `npm run build`, and deploy with `FirebaseExtended/action-hosting-deploy`.

## Code style and linting

ESLint config lives in the `eslintConfig` block of [package.json](package.json) (uses CRA's `react-app` preset). Prettier rules live in [.prettierrc](.prettierrc) and ignore patterns in [.prettierignore](.prettierignore). Three scripts are wired up:

```bash
npm run lint          # run ESLint against src/
npm run format        # format every file in place with Prettier
npm run format-check  # verify everything is formatted; exits non-zero if not
```

[ci.yml](.github/workflows/ci.yml) runs `npm run lint` and `npm run format-check` on every pull request targeting `main`. A PR fails CI if either step fails — run `npm run format` locally for prettier issues, and fix any lint errors before pushing.
