import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const magnitudestr = fs.readFileSync(path.join(__dirname, "Magnitude.txt")).toString();
const magnitude = magnitudestr.split("\n");

for (let i = 0; i < magnitude.length; i++) {
  magnitude[i] = Number(magnitude[i]);
}

export default magnitude;
