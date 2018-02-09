const path = require('path')
const os = require('os')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const gitConfig = promisify(require('git-config'))
const mkdirp = promisify(require('mkdirp'))
const rimraf = promisify(require('rimraf'))
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const downloadGitRepo = promisify(require('download-git-repo'))
const { writeFile } = require('./util/fsExtra')
const templateRead = require('./util/templateRead')

const tmpdir = os.tmpdir()
const anuouaCLIDir = path.resolve(tmpdir, 'anuoua-cli')
const anuouaCLIDownloadRepoDir = path.resolve(anuouaCLIDir, 'downloadRepo')
const anuouaCLIRepoTemplateDir = path.resolve(anuouaCLIDownloadRepoDir, 'template')

async function createOne(projectFolder, onePath, answer) {
	const renderedContent = await templateRead(onePath, { ...answer })
	const generatePath = path.resolve(projectFolder || './', path.relative(anuouaCLIRepoTemplateDir, onePath))
	await mkdirp(path.dirname(generatePath))
	await writeFile(generatePath, renderedContent)
}

async function getRepository() {
	try {
		return (await gitConfig('./.git/config'))['remote "origin"'].url
	} catch (err) {
		return undefined
	}
}

module.exports = async function createTypescriptProject(projectTemplate, projectFolder) {
	let spinner
	try {
		spinner = ora(`Downloading ${projectTemplate} project`).start()
		await downloadGitRepo(`anuoua-cli-templates/${projectTemplate}`, anuouaCLIDownloadRepoDir)
		spinner.succeed()
	} catch (err) {
		if (err.statusCode === 404) {
			spinner.fail()
			const template = chalk.cyan(`${projectTemplate}`)
			const message = chalk.red('project template not found, please search projects template in https://github.com/anuoua-cli-templates')
			console.log(`\n  ${template} ${message}\n`)
			process.exit(1)
		}
		throw err
	}

	if (!projectFolder) {
		const result = await inquirer.prompt([{
			type: 'confirm',
			name: 'confirm',
			message: 'Create project in this directory',
		}])
		if (!result.confirm) {
			console.log(chalk.red('\nPlease recreate project with appropriate directory\n'))
			process.exit(1)
		}
	}
	const answer = await inquirer.prompt([
		{
			type: 'input',
			name: 'projectName',
			message: 'Project name',
			default: projectFolder || path.basename(process.cwd()),
			validate(value) {
				const pass = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value)
				return pass || 'Please enter a valid project name, it should match the pattern of "^(?:@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$"'
			},
		},
		{
			type: 'input',
			name: 'projectDescription',
			message: 'Project description',
			default: 'A new great project',
		},
		{
			type: 'input',
			name: 'projectAuthor',
			message: 'Author',
			default: (await gitConfig()).user.email,
		},
		{
			type: 'input',
			name: 'projectRepository',
			message: 'Git repository',
			default: await getRepository(),
		},
		{
			type: 'input',
			name: 'projectLicense',
			message: 'License ( MIT ISC... )',
			default: 'NONE',
		},
	])
	const pathArr = await glob(path.resolve(anuouaCLIRepoTemplateDir, '**/*.*'), { dot: true })
	const prArr = []
	for (const onePath of pathArr) {
		prArr.push(createOne(projectFolder, onePath, answer))
	}
	await Promise.all(prArr)
	await rimraf(anuouaCLIDownloadRepoDir)
}
