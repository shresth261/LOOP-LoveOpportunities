import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-now-BuTBBodb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
export { useNow as t };
