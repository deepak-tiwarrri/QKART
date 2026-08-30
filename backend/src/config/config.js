const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

const DEFAULT_WALLET_MONEY = 500;
const DEFAULT_PAYMENT_OPTION = "PAYMENT_OPTION_DEFAULT";
const DEFAULT_ADDRESSS = "ADDRESS_NOT_SET";

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .default("production"),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// The MONGODB_URL in .env already has the database name (qkart) and URL-encoded password.
// For test mode we just append -test to the db name.
const mongoUrl = envVars.NODE_ENV === "test"
  ? envVars.MONGODB_URL.replace(/\/([a-zA-Z0-9_-]+)(\?|$)/, "/$1-test$2")
  : envVars.MONGODB_URL;

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  // Set mongoose configuration
  mongoose: {
    url: mongoUrl,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  default_wallet_money: DEFAULT_WALLET_MONEY,
  default_payment_option: DEFAULT_PAYMENT_OPTION,
  default_address: DEFAULT_ADDRESSS,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};
