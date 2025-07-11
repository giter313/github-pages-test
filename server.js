import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイル配信 (https://your-app.onrender.com/ で static 内のファイルを配信)
app.use(express.static(path.join(__dirname, "static")));

// Proxy（必要なら）
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).send("No URL specified");
  }

  try {
    const response = await fetch(target);
    const body = await response.text();
    res.set("Access-Control-Allow-Origin", "*");
    res.send(body);
  } catch (error) {
    res.status(500).send("Error: " + error.toString());
  }
});

// デフォルトは static/index.html を返す
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
