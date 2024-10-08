/* Copyright © 2022 Apeleg Limited.
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

import esbuild from 'esbuild';
import { randomBytes, createHash } from 'node:crypto';

export default (
	config?: Omit<
		esbuild.BuildOptions,
		'entryPoints' | 'outdir' | 'outfile' | 'write'
	>,
	filter?: RegExp,
): esbuild.Plugin => {
	const mainFilter = filter ?? /^inline:/;
	const skipResolve = {};
	const instanceName = `${((0, Math.random)() * 1000) | 0}-${mainFilter}`;

	config = { ...config };

	delete (config as esbuild.BuildOptions).entryPoints;
	delete (config as esbuild.BuildOptions).outdir;
	delete (config as esbuild.BuildOptions).outfile;
	delete (config as esbuild.BuildOptions).write;

	return {
		name: `@apeleghq/esbuild-plugin-inline-js/${instanceName}`,
		setup(build) {
			build.onLoad(
				{
					filter: /./,
					namespace: `@apeleghq/esbuild-plugin-inline-js/loader/${instanceName}`,
				},
				async ({ path }) => {
					const outfile = randomBytes(9).toString('base64url');
					const result = await esbuild.build({
						target: build.initialOptions.target,
						format: build.initialOptions.format,
						...config,
						entryPoints: [path],
						bundle: true,
						minify: true,
						outfile: outfile,
						write: false,
					});

					const output = result.outputFiles.find((o) =>
						o.path.endsWith(outfile),
					);

					if (!output) {
						return {
							errors: [
								{
									detail: 'No output',
								},
							],
						};
					}

					return {
						contents: `
						import path from ${JSON.stringify(path)};
						const content = ${JSON.stringify(
							Buffer.from(output.contents).toString('utf8'),
						)};
						const contentBase64 = ${JSON.stringify(
							Buffer.from(output.contents).toString('base64'),
						)};
						const sri = ${JSON.stringify(
							'sha384-' +
								createHash('sha384')
									.update(output.contents)
									.digest('base64'),
						)};
						export {content as default, contentBase64, path, sri};`,
						loader: 'js',
						pluginData: output.contents,
					};
				},
			);

			build.onResolve({ filter: mainFilter }, async (a) => {
				const { path, resolveDir, pluginData, namespace, kind } = a;
				if (
					kind === 'entry-point' ||
					pluginData === skipResolve ||
					namespace ===
						`@apeleghq/esbuild-plugin-inline-js/loader/${instanceName}`
				) {
					return;
				}

				const pathWP = path.slice(7);

				const result = await build.resolve(pathWP, {
					resolveDir,
					pluginData: skipResolve,
					kind: 'require-resolve',
					namespace,
				});

				if (result.errors.length > 0) {
					return { errors: result.errors };
				}

				return {
					external: false,
					namespace: `@apeleghq/esbuild-plugin-inline-js/loader/${instanceName}`,
					path: result.path,
					suffix: undefined,
					watchDirs: [],
					watchFiles: [result.path],
				};
			});

			build.onResolve(
				{
					filter: /.*/,
					namespace: `@apeleghq/esbuild-plugin-inline-js/loader/${instanceName}`,
				},
				({ path, pluginData }) => ({
					external: false,
					namespace: `@apeleghq/esbuild-plugin-inline-js/content/${instanceName}`,
					path: path.replace(/\.inline\.[jt]sx?$/, '.js'),
					pluginData: pluginData,
				}),
			);

			build.onLoad(
				{
					filter: /./,
					namespace: `@apeleghq/esbuild-plugin-inline-js/content/${instanceName}`,
				},
				({ pluginData }) => ({
					contents: pluginData,
					loader: 'file',
				}),
			);
		},
	};
};
