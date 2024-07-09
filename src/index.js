import initializeApp from "./app.js";
import config from "../config.js";

const startServer = async () => {
  const app = await initializeApp();

  app.listen(3000, () => {
    console.log(config.app_name + " Started on Port 3000");
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
