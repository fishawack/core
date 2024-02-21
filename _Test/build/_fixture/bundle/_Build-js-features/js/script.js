import "./import-es6.js";
import "./json-import-es6.json";

require("./json-import-cjs.json");
require("./import-cjs.js");

require("./import-amd.js");

console.log(process.env.ENV_1);
console.log(process.env.ENV_2);
console.log(process.env.ENV_3);

require('./txt-import.txt');

require('./html-import.html');

console.log(`__VUE_OPTIONS_API__:`, __VUE_OPTIONS_API__);
console.log(`__VUE_PROD_DEVTOOLS__:`, __VUE_PROD_DEVTOOLS__);
console.log(`__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:`, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__);