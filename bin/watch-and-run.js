#!/usr/bin/env node

var paramon = require('paramon')
var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec

function die () {
	console.error.apply(console, arguments)
	process.exit(1)
}

function collapseDirectories (file) {
	return path.resolve(file)
}

function onTerminate (err, stdout, stderr) {
	if (err) {
		console.error(err)
	}

	process.stdout.write(stdout)
	process.stderr.write(stderr)
}

function onChange (event) {
	exec(command, onTerminate)
}

function watch (file) {
	fs.watch(file, onChange)
}

var args = paramon.readFormat(process.argv, {
	name: 'watch-and-run',
	usage:	'watch-and-run [options] <command> <files>',
	params:	[
		{
			name:	'recursive',
			args:	['--recursive', '-r'],
			desc:	'Update target (wrappers).',
			maxParams: 0
		}
	]
})

if (args['$!stray'].length < 2) die('Insufficent arguments.')

var command = args['$!stray'].shift()

var files = args['$!stray'].map(collapseDirectories)

files.forEach(watch)
