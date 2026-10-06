import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const N = 2874;
const W = 37641;
const tfidf = new Array(N);

for (let i = 0; i < N; i++) {
  tfidf[i] = new Array(W).fill(0);
}

const TFIDF = fs.readFileSync(path.join(__dirname, "TFIDF.txt")).toString();
const temp = TFIDF.split("\n");
for (let k = 0; k < temp.length; k++) {
  const arr = temp[k].split(" ");
  const i = Number(arr[0]);
  const j = Number(arr[1]);
  const val = Number(arr[2]);
  tfidf[i][j] = val;
}

export default tfidf;
