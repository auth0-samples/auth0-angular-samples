const fs = require("fs");
const path = require("path");

function parseArgs(args) {
  const params = {};
  for (let i = 2; i < args.length; i += 2) {
    const key = args[i].replace("--", "");
    const value = args[i + 1];
    params[key] = value;
  }
  return params;
}

try {
  const args = parseArgs(process.argv);

  // Validate required arguments
  if (!args.domain) {
    console.error("Error: --domain argument is required");
    console.error(
      "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
    );
    process.exit(1);
  }

  if (!args.clientId) {
    console.error("Error: --clientId argument is required");
    console.error(
      "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
    );
    process.exit(1);
  }

  // Validate port argument if provided
  if (args.port) {
    const portNumber = parseInt(args.port, 10);
    if (isNaN(portNumber) || portNumber.toString() !== args.port.toString()) {
      console.error("Error: --port argument must be a valid number");
      console.error(
        "Usage: node auth0-config.cjs --domain <domain> --clientId <clientId> [--port <port>]",
      );
      process.exit(1);
    }
  }

  const port = args.port || "4200";

  // Write public/config.js (browser config)
  const configPath = path.join(__dirname, "..", "public", "config.js");
  const configContent = `window.AUTH0_DOMAIN = '${args.domain}';
window.AUTH0_CLIENT_ID = '${args.clientId}';
`;
  fs.writeFileSync(configPath, configContent);

  // Write .auth0.config.json (server config - port only)
  const auth0ConfigPath = path.join(__dirname, "..", ".auth0.config.json");
  const auth0Config = {
    port: parseInt(port, 10),
  };
  fs.writeFileSync(
    auth0ConfigPath,
    JSON.stringify(auth0Config, null, 2) + "\n",
  );

  console.log(`Auth0 configuration has been written`);
  console.log("Config keys state:");
  console.log(`  AUTH0_DOMAIN: ${args.domain}`);
  console.log(`  AUTH0_CLIENT_ID: ${args.clientId}`);
  console.log(`  PORT: ${port}`);
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
}
