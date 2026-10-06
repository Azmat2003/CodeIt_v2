import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keywordsstr = fs.readFileSync(path.join(__dirname, "keywords.txt")).toString();
const keywords = keywordsstr.split("\n");

export default keywords;
