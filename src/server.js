require('dotenv').config();
const app = require('./app');
const { connectPostgres } = require('./config/postgres');
const connectMongo = require('./config/mongo');

const PORT = process.env.PORT || 3000;

// connect to both databases then start the server
const startServer = async () => {
  await connectPostgres();
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📋 Task Manager API ready!\n`);
  });
};

startServer();
