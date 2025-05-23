# NewWaveFest – backend security improvements

## Summary of applied good practices

### 1. Hidden credentials
- Connection string uses environment variables (e.g. `process.env.DB_URI`)
- Sensitive values (e.g. DB password) not stored in code

### 2. Helmet
- Middleware `helmet()` is used to secure HTTP headers

### 3. Sanitize input
- Endpoint `POST /api/seats` uses `mongo-sanitize` to prevent NoSQL injection

### 4. CORS restriction
- CORS enabled with explicit configuration
- Allows control over accepted request origins

### 5. Validation on server
- All POST/PUT endpoints validate required fields
- Data is not trusted from the frontend

### 6. Error handling
- All controllers use `try...catch`
- Errors are caught and proper HTTP codes are returned

### 7. Dependency check
- Dependencies tested with `snyk`
- No known security vulnerabilities detected

## Run instructions

```bash
yarn install
yarn seed
yarn start
```

## API test (GET /api/concerts)

```bash
yarn test
yarn test:watch
```

## Deployment

- Vercel: https://server-api-festival.vercel.app/
- Replit: https://6696527c-dd70-459a-8045-7f5d9ff5e79b-00-3rio3g8ml4as6.spock.replit.dev/

## Environment variables

Before starting the server, create a `.env` file in the root directory and set:

```env
PORT=8000
DB_URI=your-remote-mongodb-connection-string
```

## Snyk usage

To check your dependencies for known vulnerabilities:

1. Install Snyk globally (if not already):
```bash
yarn global add snyk@1.235.0
```

2. Authenticate with your snyk.io account:
```bash
npx snyk auth
```

3. Run the test in the project folder:
```bash
yarn snyk
```

You can also use:
```bash
snyk test
```
to perform a full audit of the dependencies.
