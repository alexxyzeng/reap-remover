#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const process = require('process')
const childProcess = require('child_process')

const cwd = process.cwd()


function removeReaper(dir) {
  const paths = fs.readdirSync(dir) 
  paths.forEach(p => {
    if (p.includes('node_modules')) {
      return
    }
    const childPath = path.resolve(dir, p)
    const stat = fs.statSync(childPath)
    if (stat.isDirectory()) {
      removeReaper(childPath)
    } else if (childPath.endsWith('.js')) {
      const removeReapJSPath = path.resolve(__dirname, '..', 'remove-reap.js')
      childProcess.exec(`jscodeshift -t ${removeReapJSPath} ${childPath}`)
    }
  })
}

removeReaper(cwd)
