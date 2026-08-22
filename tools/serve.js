/* ============================================================
   tools/serve.js —— 本機靜態預覽 server（開發用，不進 production）

   這個專案是純靜態的 HTML/CSS，但驗 RWD 不能直接開 file://——
   file:// 下相對路徑的 <link> 在部分預覽環境會解析不到，CSS 整個不載入。
   起一個 server 才能看到真實的樣式。

   用 node 而不是 python3 -m http.server，是因為後者在沙箱環境下
   會因為 os.getcwd() 權限不足而啟動失敗。

   用法：node tools/serve.js  →  http://localhost:4173
   （或透過 .claude/launch.json 由編輯器啟動）
   ============================================================ */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4173;
/* 以這支檔案的位置回推專案根目錄，不依賴啟動時的 cwd */
const ROOT = path.resolve(__dirname, "..");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    const file = path.join(ROOT, urlPath);
    /* 擋掉 ../ 之類想跳出專案目錄的路徑 */
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end("forbidden");
      return;
    }

    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404).end("not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type":
          TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
        /* 改完 CSS 重整就要看到新結果，不要吃到瀏覽器快取 */
        "Cache-Control": "no-store",
      });
      res.end(buf);
    });
  })
  .listen(PORT, () => {
    console.log(`serving ${ROOT} on http://localhost:${PORT}`);
  });
