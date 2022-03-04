#!/usr/bin/env node

import * as commander from 'commander'
import { translate } from './main'

const program = new commander.Command()

program
  .version('0.0.1')
  .name('qishui')
  .usage('<words>')
  .arguments('<english>')
  .action((english) => {
    translate(english)
  })

program.parse()