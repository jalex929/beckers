import express from "express";
import path from "path";
import assetsRouter from "./routes/assets";

const app = express();

app.use(express.json());

app.use("/assets", assetsRouter);

const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

app.get(/^(?!\/assets).*/, (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);

export default app;


export default app