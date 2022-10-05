(function () {
	const list = [
		'H',
		'e',
		'l',
		'l',
		'o',
		',',
		' ',
		'W',
		'o',
		'r',
		'l',
		'd',
		'!',
	];
	return list
		.map(
			(c) => [c.toLowerCase(), c.toUpperCase()].find((d) => d !== c) ?? c,
		)
		.map((c) => String.prototype.codePointAt.call(c, 0))
		.map((c) => c << 1)
		.map((c) => c << 1)
		.map((c) => c << 1)
		.map((c) => c >> 3)
		.map((c) => String.fromCodePoint(c))
		.map(
			(c) => [c.toLowerCase(), c.toUpperCase()].find((d) => d !== c) ?? c,
		)
		.join(';')
		.replace(/;/g, '');
})();
