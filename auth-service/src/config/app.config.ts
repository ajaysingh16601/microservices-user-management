// App configuration constants
export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: process.env.JWT_EXPIRES || '1d',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:4200',
  },
});
