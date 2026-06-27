import { c as minutesInDay, d as normalizeDates, f as toDate, i as getTimezoneOffsetInMilliseconds, l as minutesInMonth, n as enUS, o as millisecondsInMinute, r as getDefaultOptions, t as constructFrom, u as minutesInYear } from "./en-US-C35fmb72.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/formatDistanceToNowStrict-Bja_p55D.js
/**
* @name compareAsc
* @category Common Helpers
* @summary Compare the two dates and return -1, 0 or 1.
*
* @description
* Compare the two dates and return 1 if the first date is after the second,
* -1 if the first date is before the second or 0 if dates are equal.
*
* @param dateLeft - The first date to compare
* @param dateRight - The second date to compare
*
* @returns The result of the comparison
*
* @example
* // Compare 11 February 1987 and 10 July 1989:
* const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
* //=> -1
*
* @example
* // Sort the array of dates:
* const result = [
*   new Date(1995, 6, 2),
*   new Date(1987, 1, 11),
*   new Date(1989, 6, 10)
* ].sort(compareAsc)
* //=> [
* //   Wed Feb 11 1987 00:00:00,
* //   Mon Jul 10 1989 00:00:00,
* //   Sun Jul 02 1995 00:00:00
* // ]
*/
function compareAsc(dateLeft, dateRight) {
	const diff = +toDate(dateLeft) - +toDate(dateRight);
	if (diff < 0) return -1;
	else if (diff > 0) return 1;
	return diff;
}
/**
* @name constructNow
* @category Generic Helpers
* @summary Constructs a new current date using the passed value constructor.
* @pure false
*
* @description
* The function constructs a new current date using the constructor from
* the reference date. It helps to build generic functions that accept date
* extensions and use the current date.
*
* It defaults to `Date` if the passed reference date is a number or a string.
*
* @param date - The reference date to take constructor from
*
* @returns Current date initialized using the given date constructor
*
* @example
* import { constructNow, isSameDay } from 'date-fns'
*
* function isToday<DateType extends Date>(
*   date: DateArg<DateType>,
* ): boolean {
*   // If we were to use `new Date()` directly, the function would  behave
*   // differently in different timezones and return false for the same date.
*   return isSameDay(date, constructNow(date));
* }
*/
function constructNow(date) {
	return constructFrom(date, Date.now());
}
function getRoundingMethod(method) {
	return (number) => {
		const result = (method ? Math[method] : Math.trunc)(number);
		return result === 0 ? 0 : result;
	};
}
/**
* The {@link formatDistanceStrict} function options.
*/
/**
* The unit used to format the distance in {@link formatDistanceStrict}.
*/
/**
* @name formatDistanceStrict
* @category Common Helpers
* @summary Return the distance between the given dates in words.
*
* @description
* Return the distance between the given dates in words, using strict units.
* This is like `formatDistance`, but does not use helpers like 'almost', 'over',
* 'less than' and the like.
*
* | Distance between dates | Result              |
* |------------------------|---------------------|
* | 0 ... 59 secs          | [0..59] seconds     |
* | 1 ... 59 mins          | [1..59] minutes     |
* | 1 ... 23 hrs           | [1..23] hours       |
* | 1 ... 29 days          | [1..29] days        |
* | 1 ... 11 months        | [1..11] months      |
* | 1 ... N years          | [1..N]  years       |
*
* @param laterDate - The date
* @param earlierDate - The date to compare with
* @param options - An object with options
*
* @returns The distance in words
*
* @throws `date` must not be Invalid Date
* @throws `baseDate` must not be Invalid Date
* @throws `options.unit` must be 'second', 'minute', 'hour', 'day', 'month' or 'year'
* @throws `options.locale` must contain `formatDistance` property
*
* @example
* // What is the distance between 2 July 2014 and 1 January 2015?
* const result = formatDistanceStrict(new Date(2014, 6, 2), new Date(2015, 0, 2))
* //=> '6 months'
*
* @example
* // What is the distance between 1 January 2015 00:00:15
* // and 1 January 2015 00:00:00?
* const result = formatDistanceStrict(
*   new Date(2015, 0, 1, 0, 0, 15),
*   new Date(2015, 0, 1, 0, 0, 0)
* )
* //=> '15 seconds'
*
* @example
* // What is the distance from 1 January 2016
* // to 1 January 2015, with a suffix?
* const result = formatDistanceStrict(new Date(2015, 0, 1), new Date(2016, 0, 1), {
*   addSuffix: true
* })
* //=> '1 year ago'
*
* @example
* // What is the distance from 1 January 2016
* // to 1 January 2015, in minutes?
* const result = formatDistanceStrict(new Date(2016, 0, 1), new Date(2015, 0, 1), {
*   unit: 'minute'
* })
* //=> '525600 minutes'
*
* @example
* // What is the distance from 1 January 2015
* // to 28 January 2015, in months, rounded up?
* const result = formatDistanceStrict(new Date(2015, 0, 28), new Date(2015, 0, 1), {
*   unit: 'month',
*   roundingMethod: 'ceil'
* })
* //=> '1 month'
*
* @example
* // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
* import { eoLocale } from 'date-fns/locale/eo'
* const result = formatDistanceStrict(new Date(2016, 7, 1), new Date(2015, 0, 1), {
*   locale: eoLocale
* })
* //=> '1 jaro'
*/
function formatDistanceStrict(laterDate, earlierDate, options) {
	const defaultOptions = getDefaultOptions();
	const locale = options?.locale ?? defaultOptions.locale ?? enUS;
	const comparison = compareAsc(laterDate, earlierDate);
	if (isNaN(comparison)) throw new RangeError("Invalid time value");
	const localizeOptions = Object.assign({}, options, {
		addSuffix: options?.addSuffix,
		comparison
	});
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, ...comparison > 0 ? [earlierDate, laterDate] : [laterDate, earlierDate]);
	const roundingMethod = getRoundingMethod(options?.roundingMethod ?? "round");
	const milliseconds = earlierDate_.getTime() - laterDate_.getTime();
	const minutes = milliseconds / millisecondsInMinute;
	const dstNormalizedMinutes = (milliseconds - (getTimezoneOffsetInMilliseconds(earlierDate_) - getTimezoneOffsetInMilliseconds(laterDate_))) / millisecondsInMinute;
	const defaultUnit = options?.unit;
	let unit;
	if (!defaultUnit) if (minutes < 1) unit = "second";
	else if (minutes < 60) unit = "minute";
	else if (minutes < 1440) unit = "hour";
	else if (dstNormalizedMinutes < 43200) unit = "day";
	else if (dstNormalizedMinutes < 525600) unit = "month";
	else unit = "year";
	else unit = defaultUnit;
	if (unit === "second") {
		const seconds = roundingMethod(milliseconds / 1e3);
		return locale.formatDistance("xSeconds", seconds, localizeOptions);
	} else if (unit === "minute") {
		const roundedMinutes = roundingMethod(minutes);
		return locale.formatDistance("xMinutes", roundedMinutes, localizeOptions);
	} else if (unit === "hour") {
		const hours = roundingMethod(minutes / 60);
		return locale.formatDistance("xHours", hours, localizeOptions);
	} else if (unit === "day") {
		const days = roundingMethod(dstNormalizedMinutes / minutesInDay);
		return locale.formatDistance("xDays", days, localizeOptions);
	} else if (unit === "month") {
		const months = roundingMethod(dstNormalizedMinutes / minutesInMonth);
		return months === 12 && defaultUnit !== "month" ? locale.formatDistance("xYears", 1, localizeOptions) : locale.formatDistance("xMonths", months, localizeOptions);
	} else {
		const years = roundingMethod(dstNormalizedMinutes / minutesInYear);
		return locale.formatDistance("xYears", years, localizeOptions);
	}
}
/**
* The {@link formatDistanceToNowStrict} function options.
*/
/**
* @name formatDistanceToNowStrict
* @category Common Helpers
* @summary Return the distance between the given date and now in words.
* @pure false
*
* @description
* Return the distance between the given dates in words, using strict units.
* This is like `formatDistance`, but does not use helpers like 'almost', 'over',
* 'less than' and the like.
*
* | Distance between dates | Result              |
* |------------------------|---------------------|
* | 0 ... 59 secs          | [0..59] seconds     |
* | 1 ... 59 mins          | [1..59] minutes     |
* | 1 ... 23 hrs           | [1..23] hours       |
* | 1 ... 29 days          | [1..29] days        |
* | 1 ... 11 months        | [1..11] months      |
* | 1 ... N years          | [1..N]  years       |
*
* @param date - The given date
* @param options - An object with options.
*
* @returns The distance in words
*
* @throws `date` must not be Invalid Date
* @throws `options.locale` must contain `formatDistance` property
*
* @example
* // If today is 1 January 2015, what is the distance to 2 July 2014?
* const result = formatDistanceToNowStrict(
*   new Date(2014, 6, 2)
* )
* //=> '6 months'
*
* @example
* // If now is 1 January 2015 00:00:00,
* // what is the distance to 1 January 2015 00:00:15, including seconds?
* const result = formatDistanceToNowStrict(
*   new Date(2015, 0, 1, 0, 0, 15)
* )
* //=> '15 seconds'
*
* @example
* // If today is 1 January 2015,
* // what is the distance to 1 January 2016, with a suffix?
* const result = formatDistanceToNowStrict(
*   new Date(2016, 0, 1),
*   {addSuffix: true}
* )
* //=> 'in 1 year'
*
* @example
* // If today is 28 January 2015,
* // what is the distance to 1 January 2015, in months, rounded up??
* const result = formatDistanceToNowStrict(new Date(2015, 0, 1), {
*   unit: 'month',
*   roundingMethod: 'ceil'
* })
* //=> '1 month'
*
* @example
* // If today is 1 January 2015,
* // what is the distance to 1 January 2016 in Esperanto?
* const eoLocale = require('date-fns/locale/eo')
* const result = formatDistanceToNowStrict(
*   new Date(2016, 0, 1),
*   {locale: eoLocale}
* )
* //=> '1 jaro'
*/
function formatDistanceToNowStrict(date, options) {
	return formatDistanceStrict(date, constructNow(date), options);
}
//#endregion
export { getRoundingMethod as n, formatDistanceToNowStrict as t };
