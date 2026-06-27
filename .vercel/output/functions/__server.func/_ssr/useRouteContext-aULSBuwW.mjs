import { n as useMatch } from "./useMatch-CQi_-B3b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useRouteContext-aULSBuwW.js
function useRouteContext(opts) {
	return useMatch({
		...opts,
		select: (match) => opts.select ? opts.select(match.context) : match.context
	});
}
//#endregion
export { useRouteContext as t };
