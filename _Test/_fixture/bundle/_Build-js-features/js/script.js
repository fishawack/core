import "./import-es6.js";
import "./json-import-es6.json";

require("./json-import-cjs.json");
require("./import-cjs.js");

require("./import-amd.js");

console.log(process.env.ENV_1);
console.log(process.env.ENV_2);
console.log(process.env.ENV_3);