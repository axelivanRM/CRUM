import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const route = path.join(__dirname, "params.json");
const params = {};

export async function initParams() {
  const content = await fs.readFile(route, "utf8");
  Object.assign(params, JSON.parse(content));
}

export async function updateParams(newParams) {
  const updatedParams = {
    ...params,
    ...newParams,
  };

  await fs.writeFile(route, JSON.stringify(updatedParams, null, 2), "utf8");

  Object.assign(params, updatedParams);
}

export default params;
