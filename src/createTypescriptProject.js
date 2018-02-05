const { promisify } = require('util')
const glob = promisify(require('glob'))
const path = require('path')
const mkdirp = promisify(require('mkdirp'))
// const inquirer = require('inquirer')
// const downloadGitRepo = promisify(require('download-git-repo'))
const { ejsRead, writeFile } = require('./util/ejsRead')

module.exports = async function createTypescriptProject(projectName, cmd) {
	// await downloadGitRepo('anuoua/typescript-project-template', '.tmp/repo')
	const pathArr = await glob('.tmp/repo/**/*.*', { dot: true })
	pathArr.forEach(async onePath => {
		try {
			const renderedContent = await ejsRead(onePath, { projectName: 'jsdoifj-sdfsdf' })
			const generatePath = path.resolve('./.tmp/generate/test_path', path.relative('./.tmp/repo/test_path', onePath))
			await mkdirp(path.dirname(generatePath))
			await writeFile(generatePath, renderedContent)
		} catch (err) {
			console.log(err)
		}
	})
}
