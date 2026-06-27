import { c as createServerFn } from "./createServerFn-B6xwD7pN.mjs";
import { u as createSsrRpc } from "./local-store-CcXE9Eyb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/opportunities-cMMFOfN1.js
function queryOptions(options) {
	return options;
}
var categoryColor = {
	internship: "bg-primary text-primary-foreground",
	scholarship: "bg-secondary text-secondary-foreground",
	competition: "bg-foreground text-background",
	fellowship: "bg-indigo text-foreground",
	hackathon: "bg-lime text-foreground"
};
var fetchOpportunities = createServerFn({ method: "POST" }).validator((filters = {}) => filters).handler(createSsrRpc("03febdf13f72e249cbf3615c826a26c5d098cc852896ff36f1a50d4f784bac59"));
var fetchOpportunityById = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("8252fb867a620cd62c226015459983f04baaed04b21005799606cae9819dd07e"));
var fetchOpportunitiesByIds = createServerFn({ method: "POST" }).validator((ids) => ids).handler(createSsrRpc("dfde72ba60fcba7537a454e0e0100d8c8e9e0de64dfef3ede208d91276e7087f"));
var fetchTickerOpportunities = createServerFn({ method: "GET" }).handler(createSsrRpc("35aa29d81bf8cda5d9397ecdcad2ecaacbcf6b80e932096436c289c5f974e0ec"));
var opportunitiesQuery = (filters) => queryOptions({
	queryKey: ["opportunities", filters],
	queryFn: () => fetchOpportunities({ data: filters })
});
var opportunityByIdQuery = (id) => queryOptions({
	queryKey: ["opportunity", id],
	queryFn: () => fetchOpportunityById({ data: id })
});
var opportunitiesByIdsQuery = (ids) => queryOptions({
	queryKey: [
		"opportunities",
		"byIds",
		ids
	],
	queryFn: () => fetchOpportunitiesByIds({ data: ids })
});
//#endregion
export { opportunitiesQuery as a, opportunitiesByIdsQuery as i, fetchOpportunities as n, opportunityByIdQuery as o, fetchTickerOpportunities as r, queryOptions as s, categoryColor as t };
