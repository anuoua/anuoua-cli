const { promisify } = require('util')
const inquirer = require('inquirer')
const path = require('path')
const gitConfig = promisify(require('git-config'))

async function getRepository() {
	try {
		return (await gitConfig('./.git/config'))['remote "origin"'].url
	} catch (err) {
		return undefined
	}
}

exports.inquirerConfirm = async () => inquirer.prompt([{
	type: 'confirm',
	name: 'confirm',
	message: 'Create project in this directory',
}])

exports.inquirerProjectDetail = async projectFolder => inquirer.prompt([
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
