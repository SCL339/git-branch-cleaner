#!/usr/bin/env node

import { program } from 'commander';
import { execSync } from 'node:child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

program
  .name('git-branch-cleaner')
  .description('Interactive CLI to clean up local Git branches')
  .version(pkg.version)
  .option('-d, --dry-run', 'Show what would be deleted without actually deleting')
  .option('-f, --force', 'Skip safety confirmation prompts')
  .option('-m, --merged', 'Only show/delete branches merged into HEAD')
  .option('-s, --stale', 'Only show/delete branches with no commits in 30 days')
  .option('-a, --all', 'Show all local branches for interactive selection')
  .option('--days <days>', 'Days threshold for stale detection', '30')
  .option('--no-color', 'Disable colored output')
  .action(async (options) => {
    if (options.color === false) {
      chalk.level = 0;
    }

    try {
      const cleaner = await import('../lib/cleaner.js');
      await cleaner.cleanBranches(options);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

program.parse();
