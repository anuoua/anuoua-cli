const program = require('commander')
const chalk = require('chalk')
const packageVersion = require('../package.json').version

program
	.version(packageVersion, '-v, --version')
	.usage('<command> [options]')

program
	.command('create <project-name>')
	.description('create a project')
	.option('-t, --type <project-type>', 'Specify project type such as typescript', (value) => {

	}, 'typescript')
	.action((projectName, cmd) => {
		console.log(projectName, cmd.type)
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
