import dotenv from 'dotenv';

console.log("NODE_ENV: " + process.env.NODE_ENV);

const result = dotenv.config()

if (result.error) {
  if (process.env.NODE_ENV === "development") {
    console.error(".env file not found. This is an error condition in development. Additional error is logged below");
    throw result.error;
  }
}

interface Environment {
  session_secret: string,
  pi_api_key: string,
  platform_api_url: string,
  mongodb_uri: string,
  mongo_db_name: string,
  frontend_url: string,
}

const env: Environment = {
  session_secret: process.env.SESSION_SECRET || "This is my session secret",
  pi_api_key: process.env.PI_API_KEY || '',
  platform_api_url: process.env.PLATFORM_API_URL || '',
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  mongo_db_name: process.env.MONGODB_DATABASE_NAME || 'demo-app',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3314',
};

export default env;

