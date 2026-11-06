import fs from "node:fs";
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
for (const group of ["dependencies", "devDependencies"]) {
  for (const name of Object.keys(pkg[group]))
    pkg[group][name] = lock.packages[`node_modules/${name}`].version;
  lock.packages[""][group] = pkg[group];
}
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
fs.writeFileSync("package-lock.json", JSON.stringify(lock, null, 2) + "\n");
