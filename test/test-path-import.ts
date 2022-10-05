/* Copyright © 2021 Exact Realty Limited.
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import * as x from './external.inline.ts';

assert.notEqual(x.default, '');
assert.equal(
	x.contentBase64,
	Buffer.from(x.default, 'utf-8').toString('base64'),
);
assert.equal(
	x.sri,
	'sha384-' + createHash('sha384').update(x.default).digest('base64'),
);
assert.equal(new Function('return ' + x.default)(), 'Hello, World!');
assert.equal(
	x.path.replace(/external-[^.]+\.js$/, 'external.js'),
	'http://invalid/assets/external.js',
);
