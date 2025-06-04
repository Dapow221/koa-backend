import dotenv from "dotenv";
dotenv.config();

import Koa from "koa";
import bodyParser from "koa-body";
import logger from "koa-logger";
import router from "./routes";
// import errorHandler from "./middleware/errorHandler";
import cors from "@koa/cors";
import serve from "koa-static";
import path from "path";

const app = new Koa();

app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
  })
);

const storagePath = path.join(__dirname, "./storage/");
app.use(serve(storagePath));

app.use(logger());
app.use(bodyParser({ multipart: true }));
// app.use(errorHandler);

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3030;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
server.timeout = 600000;

console.log("Available routes:");
router.stack.forEach((layer) => {
  if (layer.methods.length > 0) {
    console.log(`${layer.methods.join(", ")} ${layer.path}`);
  }
});


export default app;
