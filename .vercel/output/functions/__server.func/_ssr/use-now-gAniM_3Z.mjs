import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./react-DGbDRcN1.mjs";
import { t as createLucideIcon } from "./createLucideIcon-DahuBJmx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-now-gAniM_3Z.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Clock = createLucideIcon("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var listeners = /* @__PURE__ */ new Set();
var interval = null;
function tick() {
	listeners.forEach((listener) => listener());
}
function useNow(updateInterval = 1e3) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const listener = () => setNow(Date.now());
		listeners.add(listener);
		if (!interval) interval = setInterval(tick, updateInterval);
		return () => {
			listeners.delete(listener);
			if (listeners.size === 0 && interval) {
				clearInterval(interval);
				interval = null;
			}
		};
	}, [updateInterval]);
	return now;
}
//#endregion
export { useNow as n, Clock as t };
