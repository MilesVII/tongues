export type LocaleMap = (key: string, def?: string) => string;

function parseLocale(raw: string, apply: (k: string, v: string) => void) {
	const lines = raw
		.replaceAll("\r\n", "\n")
		.split("\n")
		.map(line =>
			line.startsWith("    ")
				? `\t${line.slice(4)}`
				: line
		);

	let index = 0;
	function feedLine(){
		const line = lines[index];
		const isEmpty = line?.trim() === "";

		return {
			content: line || "",
			isKey: !line?.startsWith("\t") && !isEmpty,
			eof: index++ >= lines.length
		};
	}
	function unroll(){
		--index;
	}

	for (let key = feedLine(); !key.eof; key = feedLine()) {
		if (!key.isKey) continue;

		const value: string[] = [];
		for (let next = feedLine(); !next.eof; next = feedLine()){
			if (next.isKey){
				unroll();
				break;
			}
			if (next.content.startsWith("\t"))
				value.push(next.content.slice(1));
		}
		apply(key.content.split("//")[0].trim(), value.join("\n"));
	}
}

export default function tongues<T extends Record<string, string>>(raws: T) {
	type LocaleKey = keyof T;
	const cachedMaps: [LocaleKey, LocaleMap][] = [];
	const availableLocales: LocaleKey[] = Object.keys(raws);

	function getMap(localeCode: LocaleKey) {
		const cached = cachedMaps.find(([k]) => k === localeCode);
		if (cached) return cached[1];

		const raw = raws[localeCode];
		const map = new Map<string, string>();
		parseLocale(raw, (k, v) => map.set(k, v));

		const t: LocaleMap = (key, def = "") => (map.get(key) ?? def);

		cachedMaps.push([localeCode, t]);
		return t;
	}

	return {
		availableLocales,
		getMap
	}
}
