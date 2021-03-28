import path from 'path';
import ts from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';

const packagesDir = path.resolve(__dirname, 'packages'); // 获取packages目录

const packageDir = path.resolve(packagesDir, process.env.TARGET); // 获取需要打包的目标目录
const name = path.basename(packageDir); // 获取打包的名字

const resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve('package.json')); // 获取repo下的指定仓库package.json描述文件
const packageOptions = pkg.buildOptions;

const outputConfigs = {
	'esm-bundler': {
		file: resolve(`dist/${name}.esm-bundler.js`), // es module
		format: 'es'
	},
	'cjs': {
		file: resolve(`dist/${name}.cjs.js`), // node使用 commonjs规范
		format: 'cjs'
	},
	'global': {
		file: resolve(`dist/${name}.global.js`), // 全局模块
		format: 'iife' // 立即执行函数返回
	}
}

function createConfig (format, output) {
	output.name = packageOptions.name;
	output.sourcemap = true;
	return {
		input: resolve(`src/index.ts`),
		output,
		plugins: [
			json(),
			ts({
				tsconfig: path.resolve(__dirname, 'tsconfig.json')
			}),
			resolvePlugin()
		]
	}
}

// 根据模块配置信息选择性打包
export default packageOptions.formats.map(format => createConfig(format, outputConfigs[format]));
