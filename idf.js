import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const idfstr = fs.readFileSync(path.join(__dirname, "IDF.txt")).toString();
const idf = idfstr.split("\n");

for (let i = 0; i < idf.length; i++) {
  idf[i] = Number(idf[i]);
}

export default idf;
