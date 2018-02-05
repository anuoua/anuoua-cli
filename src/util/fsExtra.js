const { promisify } = require('util')
const { readFile, writeFile } = require('fs')

exports.readFile = promisify(readFile)

exports.writeFile = promisify(writeFile)
