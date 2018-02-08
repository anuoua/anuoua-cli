const program = require('commander')
const chalk = require('chalk')
const createTypescriptProject = require('./projects/typescriptNode')
const packageVersion = require('../package.json').version

program
	.version(packageVersion, '-v, --version')
	.usage('<command> [options]')

program
	.command('create <project-type> [create-directory]')
	.description('create a project with <project-type> and optional [create-directory]')
	/* .option('-t, --type <project-type>',
				`Specify project type such as ${defaultProject}`, value => {
		if (value !== 'typescript-node') {
			throw new Error(`-t, --type  Now only support ${defaultProject}`)
		}
		return defaultProject
	}, defaultProject) */
	.action(async (projectType, createDirectory) => {
		try {
			await createTypescriptProject(projectType, createDirectory)
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
