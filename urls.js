import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urlsstr = fs.readFileSync(path.join(__dirname, "problem-urls.txt")).toString();
const urls = urlsstr.split("\n");

export default urls;
