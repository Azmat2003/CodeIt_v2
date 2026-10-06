import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const titlesstr = fs.readFileSync(path.join(__dirname, "problem-titles.txt")).toString();
const titles = titlesstr.split("\n");

export default titles;
