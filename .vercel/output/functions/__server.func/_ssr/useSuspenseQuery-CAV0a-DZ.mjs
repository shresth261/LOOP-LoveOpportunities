import { m as defaultThrowOnError, p as useBaseQuery, v as QueryObserver } from "./local-store-CcXE9Eyb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useSuspenseQuery-CAV0a-DZ.js
function useSuspenseQuery(options, queryClient) {
	return useBaseQuery({
		...options,
		enabled: true,
		suspense: true,
		throwOnError: defaultThrowOnError,
		placeholderData: void 0
	}, QueryObserver, queryClient);
}
//#endregion
export { useSuspenseQuery as t };
