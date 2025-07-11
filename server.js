import express from "express";
import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, "static");

// static 配信
app.use(express.static(staticDir));

// デフォルト画面
app.get("/", (req, res) => {
  const indexPath = path.join(staticDir, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <h1>ページがまだ保存されていません</h1>
      <p>例: <code>/puppet?url=https://example.com</code></p>
    `);
  }
});

// Puppeteer 実行
app.get("/puppet", async (req, res) => {
  const targetURL = req.query.url;
  if (!targetURL) return res.send("エラー: URL を ?url= で指定してください");

  console.log(`取得開始: ${targetURL}`);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(targetURL, {
    waitUntil: "networkidle2",
    timeout: 60000
  });

  const html = await page.content();

  await fs.ensureDir(staticDir);
  await fs.writeFile(path.join(staticDir, "index.html"), html);

  await browser.close();

  console.log(`保存完了: static/index.html`);

  res.send(`
    <h1>保存完了！</h1>
    <p>取得先: ${targetURL}</p>
    <p><a href="/">最新ページを見る</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
