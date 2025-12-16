const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Read .auth0.config.json to get the configured port
const configPath = path.join(__dirname, "..", ".auth0.config.json");

if (!fs.existsSync(configPath)) {
  console.error(`
❌ Configuration file not found: .auth0.config.json

Please run the auth0-config script first:
  npm run auth0-config -- --domain <domain> --clientId <clientId> --port <port>
`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const PORT = config.port || 4200;

// Use npx to run local ng binary
try {
  execSync(`npx ng serve --port ${PORT}`, { stdio: "inherit" });
} catch (err) {
  process.exit(err.status || 1);
}
