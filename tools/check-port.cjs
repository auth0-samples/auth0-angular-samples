const fs = require("fs");
const path = require("path");
const { detect } = require("detect-port");

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

detect(PORT)
  .then((port) => {
    if (port !== parseInt(PORT)) {
      console.error(`
❌ The port ${PORT} that is configured in Auth0 is currently in use.

To resolve this issue:
1. Free up port ${PORT} by stopping the application using it, OR
2. Configure URLs with a new port in your Auth0 application settings:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
   Then update the port by running:
   npm run auth0-config -- --domain <domain> --clientId <clientId> --port <new-port>
`);
      process.exit(1);
    }
    console.log(`✅ Port ${PORT} is available.`);
  })
  .catch((err) => {
    console.error("Error checking port availability:", err);
    process.exit(1);
  });
