import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const N = 3023;
let tf = new Array(N);

for (let i = 0; i < N; i++) {
  tf[i] = new Array(0);
}

const TF = fs.readFileSync(path.join(__dirname, "TF.txt")).toString();

const temp = TF.split("\n");
for (let k = 0; k < temp.length; k++) {
  const arr = temp[k].split(" ");
  const i = Number(arr[0]);
  const j = Number(arr[1]);
  const val = Number(arr[2]);
  tf[i].push({
    id: j,
    val: val,
  });
}

export default tf;
