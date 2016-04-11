#!/usr/bin/env node
var path = require('path');
var shell = require('shelljs');

shell.exec('cd "' + path.resolve(__dirname) + '" && gulp lnPatterns');