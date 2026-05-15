import express from "express";
import path from "path";
import assetsRouter from "./routes/assets";

const app = express();

app.use(express.json());

// CORS — allows direct cross-origin calls from Netlify or localhost.
// Not needed when Netlify's proxy redirect rule is active (the default setup),
// but required if VITE_API_BASE points directly at this server.
app.use((req, res, next) => {
  const origin = req.headers.origin ?? ''
  const allowed = /^https?:\/\/localhost(:\d+)?$/.test(origin) || /\.netlify\.app$/.test(origin)
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use("/assets", assetsRouter);

const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

app.get(/^(?!\/assets).*/, (_req, res) => {
  const indexPath = path.join(clientDist, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(503).send(
        "Frontend not built yet. Run: npm run build:client"
      );
    }
  });
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