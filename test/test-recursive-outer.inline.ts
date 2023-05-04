import * as inner from './test-recursive-inner.inline.ts';

(function () {
	new Function(inner.default)();
	this.result = 'Hello, ' + this.result + '!';
})();
