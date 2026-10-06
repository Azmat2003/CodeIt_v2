import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lengthstr = fs.readFileSync(path.join(__dirname, "length.txt")).toString();
const length = lengthstr.split("\n");

for (let i = 0; i < length.length; i++) {
  length[i] = Number(length[i]);
}

export default length;
