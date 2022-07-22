import hljs, { registerLanguage } from "highlight.js/lib/core";
registerLanguage("xml", require("highlight.js/lib/languages/xml"));
registerLanguage("json", require("highlight.js/lib/languages/json"));

export default hljs;
