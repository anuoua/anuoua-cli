const { promisify } = require('util')
const mustache = require('mustache')
const fs = require('fs')

const readFile = promisify(fs.readFile)

/**
 * render file with template and return rendered file content
 * @param  {string} path
 * @param  {any} templateOption
 * @returns {string}
 */
exports.ejsRead = async (path, view) => {
	const buffer = await readFile(path)
	return mustache.render(buffer.toString(), view)
}

exports.writeFile = promisify(fs.writeFile)
