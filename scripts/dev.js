const fs = require('fs');
const execa = require('execa');

// 获取packages下的所有文件夹目录
const targets = ['reactivity'];

runParallel(targets, build)
async function runParallel (source, iteratorFn) {
	const allProm = source.reduce((acc, item) => {
		let p = iteratorFn(item);
		acc.push(p);
		return acc;
	}, []);
	return Promise.all(allProm);
}

async function build (target) {
	await execa(
		'rollup',
		[
			'-cw',
			'--environment',
			`TARGET:${target}`
		],
		{ stdio: 'inherit' }
	)
}
