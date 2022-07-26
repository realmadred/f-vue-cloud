import hljs, { registerLanguage } from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
registerLanguage("xml", xml);
registerLanguage("json", json);

export default hljs;
