const program = require('commander')
const chalk = require('chalk')
const createProject = require('./createProject')
const packageVersion = require('../package.json').version

program
	.version(packageVersion, '-v, --version')
	.usage('<command> [options]')

program
	.command('create <template> [folder]')
	.usage('<template> [folder]')
	.description('create a project with <template> and optional [folder]')
	.action(async (projectTemplate, projectFolder) => {
		try {
			await createProject(projectTemplate, projectFolder)
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
