import dotenv from "dotenv";

// Load environment variables
dotenv.config({
  quiet: true,
});

// Tests (and deployments) can override the DB with a full URI.
// Example for tests: mongodb://127.0.0.1:<port>/<db>
const overrideUri = process.env.MONGO_URI;
export const databasename = process.env.MONGO_DATABASE || "test";

let uri;
if (overrideUri) {
  uri = overrideUri;
} else {
  // Validate required variables (for the default connection path)
  const user = process.env.MONGO_USER;
  if (!user) throw new Error("MONGO_USER is not defined");

  const password = process.env.MONGO_PASSWORD;
  if (!password) throw new Error("MONGO_PASSWORD is not defined");

  const cluster = process.env.MONGO_CLUSTER;
  if (!cluster) throw new Error("MONGO_CLUSTER is not defined");

  if (!process.env.MONGO_DATABASE) {
    throw new Error("MONGO_DATABASE is not defined");
  }

  // Construct the MongoDB connection string (legacy default)
  uri = `mongodb+srv://Admin:wmL3HZsLYuieRpNs@the-deadline-smasher.63ulfs6.mongodb.net/?appName=The-Deadline-Smasher`;
}

// Export the URI
export default uri;
