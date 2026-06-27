import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./react-DGbDRcN1.mjs";
import { a as useRouter } from "./utils-BHOkQMUa.mjs";
import { A as replaceEqualDeep, L as useStore, b as invariant } from "./react-dom-D5WtRz1Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useMatch-CQi_-B3b.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var matchContext = import_react.createContext(void 0);
var dummyMatchContext = import_react.createContext(void 0);
var dummyStore = {
	get() {},
	subscribe() {
		return { unsubscribe() {} };
	}
};
function useStructuralSharing(opts, router) {
	const previousResult = import_react.useRef();
	return (slice) => {
		const selected = opts?.select ? opts.select(slice) : slice;
		if (opts?.structuralSharing ?? router.options.defaultStructuralSharing) return previousResult.current = replaceEqualDeep(previousResult.current, selected);
		return selected;
	};
}
/**
* Read and select the nearest or targeted route match.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useMatchHook
*/
function useMatch(opts) {
	const router = useRouter();
	const nearestMatchId = import_react.useContext(opts.from ? dummyMatchContext : matchContext);
	const matchStore = opts.from ? router.stores.getRouteMatchStore(opts.from) : router.stores.matchStores.get(nearestMatchId);
	{
		const match = matchStore?.get();
		if (!match) {
			if (opts.shouldThrow ?? true) invariant();
			return;
		}
		return opts.select ? opts.select(match) : match;
	}
	const selector = useStructuralSharing(opts, router);
	const matchSelection = useStore(matchStore ?? dummyStore, (match) => match ? selector(match) : dummyStore);
	if (matchSelection !== dummyStore) return matchSelection;
	if (opts.shouldThrow ?? true) invariant();
}
//#endregion
export { useMatch as n, useStructuralSharing as r, matchContext as t };
