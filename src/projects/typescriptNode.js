const { promisify } = require('util')
const glob = promisify(require('glob'))
const path = require('path')
const gitConfig = promisify(require('git-config'))
const mkdirp = promisify(require('mkdirp'))
const rimraf = promisify(require('rimraf'))
const inquirer = require('inquirer')
const chalk = require('chalk')
const downloadGitRepo = promisify(require('download-git-repo'))
const { writeFile } = require('../util/fsExtra')
const templateRead = require('../util/templateRead')

async function createOne(createDirectory, onePath, answer) {
	const renderedContent = await templateRead(onePath, { ...answer })
	const generatePath = path.resolve(createDirectory || './', path.relative('./.tmp/repo/template', onePath))
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

module.exports = async function createTypescriptProject(projectType, createDirectory) {
	await downloadGitRepo(`anuoua-cli-templates/${projectType}`, './.tmp/repo')
	if (!createDirectory) {
		const result = await inquirer.prompt([{
			type: 'confirm',
			name: 'confirm',
			message: 'Create project in this directory',
		}])
		if (!result.confirm) {
			console.log(chalk.red('\nPlease recreate project with appropriate directory\n'))
			process.exit(0)
		}
	}
	const answer = await inquirer.prompt([
		{
			type: 'input',
			name: 'projectName',
			message: 'Project name',
			validate(value) {
				const pass = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value)
				return pass || 'Please enter a valid project name, it should match the pattern of "^(?:@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$"'
			},
		},
		{
			type: 'input',
			name: 'projectDescription',
			message: 'Project description',
			default: 'A new typescript node project',
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
	const pathArr = await glob('.tmp/repo/template/**/*.*', { dot: true })
	const prArr = []
	for (const onePath of pathArr) {
		prArr.push(createOne(createDirectory, onePath, answer))
	}
	await Promise.all(prArr)
	await rimraf('./.tmp')
}
