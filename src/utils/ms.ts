/**
 * Original work: https://github.com/zeit/ms
 * Converted it to work with typescript & did some changes
 * Feel free to use it
 */

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
const separators = [' ', '.', ','];

function plural(ms: number, msAbs: number, n: number, name: string) {
	const isPlural = msAbs >= n * 1.5;
	return `${Math.round(ms / n)} ${name}${isPlural ? 's' : ''}`;
}

function tokenize(str: string) {
	const units = [];
	let buf = '';
	let sawLetter = false;
	let i;
	let c;
	for (i = 0; i < str.length; i++) {
		c = str[i];
		if (separators.indexOf(c) !== -1) {
			buf += c;
		} else if (isNaN(Number(c))) {
			sawLetter = true;
			buf += c;
		} else {
			if (sawLetter) {
				units.push(buf.trim());
				buf = '';
			}
			sawLetter = false;
			buf += c;
		}
	}
	if (buf.length) {
		units.push(buf.trim());
	}
	return units;
}

function parseString(str: string) {
	str = String(str);
	if (str.length > 100) {
		return;
	}
	const match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
	if (!match) {
		return;
	}
	const n = parseFloat(match[1]);
	const type = (match[2] || 'ms').toLowerCase();
	switch (type) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return n * y;
		case 'weeks':
		case 'week':
		case 'w':
			return n * w;
		case 'days':
		case 'day':
		case 'd':
			return n * d;
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return n * h;
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return n * m;
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return n * s;
		case 'milliseconds':
		case 'millisecond':
		case 'msecs':
		case 'msec':
		case 'ms':
			return n;
		default:
			return null;
	}
}

function fmtLong(ms: number) {
	const msAbs = Math.abs(ms);
	if (msAbs >= d) return plural(ms, msAbs, d, 'day');
	if (msAbs >= h) return plural(ms, msAbs, h, 'hour');
	if (msAbs >= m) return plural(ms, msAbs, m, 'minute');
	if (msAbs >= s) return plural(ms, msAbs, s, 'second');
	return `${ms}`;
}

function fmtShort(ms: number) {
	const msAbs = Math.abs(ms);
	if (msAbs >= d) return `${Math.round(ms / d)}d`;
	if (msAbs >= h) return `${Math.round(ms / h)}h`;
	if (msAbs >= m) return `${Math.round(ms / m)}m`;
	if (msAbs >= s) return `${Math.round(ms / s)}s`;
	return `${ms}ms`;
}

function parse(str: string) {
	const units = tokenize(str);
	if (!units.length) {
		return;
	}
	let ms = 0;
	let parsed;
	let i;
	for (i = 0; i < units.length; i++) {
		parsed = parseString(units[i]);
		if (typeof parsed === 'undefined') {
			return;
		}
		ms += parsed;
	}
	return ms;
}

export function ms(val: string | number, options?: { [key: string]: any }): string | number {
	options = options || {};
	const type = typeof val;
	if (type === 'string' && (val as string).length > 0) {
		return parse(val as string);
	} else if (type === 'number' && isNaN(val as number) === false) {
		return options!.long ? fmtLong(val as number) : fmtShort(val as number);
	}
	throw new Error(`Value is not a non-empty string or a valid number. Value=${JSON.stringify(val)}`);
}
