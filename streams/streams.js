#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var Transform = require('stream').Transform;

var args = require('minimist')(process.argv.slice(2), {
  boolean: ['help', 'in', 'out', 'uncompress', 'compress'],
  string: ['file']
});

const BASEPATH = path.resolve(process.env.BASEPATH || __dirname);

var OUTPATH = path.join(BASEPATH, 'out.txt');

if (args.help || process.argv.length <= 2) {
  error(null, /*showHelp=*/ true);
} else if (args._.includes('-') || args.in) {
  processFile(process.stdin);
} else if (args.file) {
  let filePath = path.join(BASEPATH, args.file);
  processFile(fs.createReadStream(filePath));
} else {
  error('Usage incorrect.', /*showHelp=*/ true);
}

// ************************************

function printHelp() {
  console.log('ex2 usage:');
  console.log('');
  console.log('--help                      print this help');
  console.log('-, --in                     read file from stdin');
  console.log('--file={FILENAME}           read file from {FILENAME}');
  console.log('--uncompress                uncompress input file with gzip');
  console.log('--compress                  compress output with gzip');
  console.log('--out                       print output');
  console.log('');
  console.log('');
}

function error(err, showHelp = false) {
  process.exitCode = 1;
  console.error(err);
  if (showHelp) {
    console.log('');
    printHelp();
  }
}

function processFile(inputStream) {
  var stream = inputStream;
  var outStream;
  var upperStream = new Transform({
    transform(chunck, enc, cb) {
      this.push(chunck.toString().toUpperCase());
      setTimeout(cb, 2500);
    }
  });

  outStream = stream.pipe(upperStream);
  console.log(args.compress);
  if (args.compress) {
    let gzip = zlib.createGzip();
    outStream = outStream.pipe(gzip);
    OUTPATH = OUTPATH + '.gz';
  }
  var targetStream;

  if (args.out) {
    targetStream = process.stdout;
  } else {
    targetStream = fs.createWriteStream(OUTPATH);
  }

  stream.pipe(targetStream);
}
