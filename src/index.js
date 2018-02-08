const program = require('commander')
const chalk = require('chalk')
const createTypescriptProject = require('./projects/typescriptNode')
const packageVersion = require('../package.json').version

program
	.version(packageVersion, '-v, --version')
	.usage('<command> [options]')

program
	.command('create <project-type> [project-name]')
	.description('create a project with <project-type> and optional [project-name]')
	.action(async (projectType, projectName) => {
		try {
			await createTypescriptProject(projectType, projectName)
		} catch (err) {
			console.log(err)
		}
	})

program.on('--help', () => {
	console.log()
	console.log(`  Run ${chalk.cyan('anuoua <command> --help')} for detailed usage of given command.`)
	console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
	program.outputHelp()
}
