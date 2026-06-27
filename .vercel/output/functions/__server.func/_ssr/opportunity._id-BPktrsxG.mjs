import { F as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as opportunityByIdQuery } from "./opportunities-C0PIb0qa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/opportunity._id-BPktrsxG.js
var $$splitNotFoundComponentImporter = () => import("./opportunity._id-CDWp7NP-.mjs");
var $$splitErrorComponentImporter = () => import("./opportunity._id-B6dE-XdL.mjs");
var $$splitComponentImporter = () => import("./opportunity._id-BskCViV8.mjs");
var Route = createFileRoute("/opportunity/$id")({
	loader: async ({ context, params }) => {
		const data = await context.queryClient.ensureQueryData(opportunityByIdQuery(params.id));
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.title} — LOOP` : "Opportunity" }, {
		name: "description",
		content: loaderData?.description ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
