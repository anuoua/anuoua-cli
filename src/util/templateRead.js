const mustache = require('mustache')
const { readFile } = require('./fsExtra')

/**
 * render file with template and return rendered file content
 * @param  {string} path file path
 * @param  {any} view mustache template option
 * @returns {string}
 */
module.exports = async (path, view) => {
	const buffer = await readFile(path)
	return mustache.render(buffer.toString(), view)
}
