// App configuration constants
export default () => ({
  port: parseInt(process.env.PORT || '3002', 10),
  database: {
    uri: process.env.MONGO_URI,
  },
  authService: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:4200',
  },
});
