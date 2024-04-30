# Tongues
KCV dictionary parser intended for i18n. Written in TS.

*because that's not what JSON is for*

## Usage

```
const en = `
key // comment
	value!

another.key
	another
	value!
`;

const dictionaries = { en };

// create tongues instance by providing dictionaries
const instance = tongues(dictionaries);

// get t function for available dictionary
const t = instance.getMap("en");

t("key");
// value!
t("undefined key", "default value");
// default value
```

For demonstration purposes, the dictionary is stored as string literal.

Build systems usually allow to import files as strings. In [Vite](https://vitejs.dev/guide/assets#importing-asset-as-string), for example, you can use `?raw` suffix:

```
import en from "./assets/en.kcv.txt?raw";
import es from "./assets/es.kcv.txt?raw";

const dictionaries = { en, es };
const instance = tongues(dictionaries);
```

### Import
Tongues is an ES6 module, so:
```
import tongues from "tongues";
// if you need a type of t-function:
import type { LocaleMap } from "tongues";
```

### Dictionary format
Provided dictionary is split into lines. Lines that start with tabulation (`\t`) character are `value lines`, lines that don't are `key lines`. Key lines are read until `//` or end of the line, whitespaces are trimmed, resulting string is then considered a `key` for the following lines, until another key is found.

* `\r\n` is automatically replaced with `\n`
* 4 spaces in the beggining of a line are replaced with tabulation character
* first tabulation character is removed from value lines, multiline values ar joined with `\n`
* empty or whitespace-only lines are ignored, unless they start with `\t`

### Syntax highlighting
You can use [vscode extension](https://github.com/MilesVII/vscode.kcv) to highlight dictionaries stored in `.kcv.txt` files, check releases.

## License
Shared under WTFPL license.
