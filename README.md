# esbuild plugin for inline scripts

 [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Exact-Realty_esbuild-plugin-inline-js&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Exact-Realty_esbuild-plugin-inline-js)
 [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Exact-Realty_esbuild-plugin-inline-js&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Exact-Realty_esbuild-plugin-inline-js)
 [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Exact-Realty_esbuild-plugin-inline-js&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Exact-Realty_esbuild-plugin-inline-js)
 [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Exact-Realty_esbuild-plugin-inline-js&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Exact-Realty_esbuild-plugin-inline-js)
 [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Exact-Realty_esbuild-plugin-inline-js&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Exact-Realty_esbuild-plugin-inline-js)
 ![NPM Downloads](https://img.shields.io/npm/dw/@exact-realty/esbuild-plugin-inline-js?style=flat-square)

## How to use

### Installing

```sh
npm i -D @exact-realty/esbuild-plugin-inline-js
```

### Configuring esbuild

In the file you have your configuration, first import this plugin

```js
const inlineJs = require('@exact-realty/esbuild-plugin-inline-js');
```

Or using ES module syntax:

```js
import inlineJs from '@exact-realty/esbuild-plugin-inline-js';
```

Then, in your esbuild configuration, add `inlineJs()` to the `plugins` list. `inlineJs` optionally takes an object that is passed to `esbuild.build`, with the exception of the following keys: `entryPoints`, `outdir`, `outfile` and `write`. Minimal example:

```js
const esbuild = require('esbuild');
const responsiveImages = require('@exact-realty/esbuild-plugin-inline-js');

await esbuild
	.build({
		entryPoints: ['index.js'],
		outdir: 'build',
		bundle: true,
		format: 'cjs',
		plugins: [inlineJs()],
	});
```

### Getting inline scripts

Import your inline scripts like this (the extensions supported are `inline.js`, `inline.jsx`, `inline.ts` and `inline.tsx`):

```js
const inline = require('./foo.inline.js');
// import * as inline from './foo.inline.js';
```

#### Result

The import will return something like this:

```json
{
	"contentBase64":
		"KGZ1bmN0aW9uKCl7cmV0dXJuIkhlbGxvLCBXb3JsZCEifSkoKTsK",
	"default":
		"(function(){return\"Hello, World!\"})();\n",
	"sri": "sha384-PKTF85dF3CsFYaS3tntysCSCAPJBKTcMWuzUmxBG0MTrEJMfMFeNSUo+KQGaqzp3"
}
```
