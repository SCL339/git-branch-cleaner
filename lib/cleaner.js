/**
 * git-branch-cleaner — Interactive CLI to clean up local Git branches
 *
 * Analyzes local branches and lets users selectively delete:
 * - Merged branches
 * - Stale branches (no commits in N days)
 * - Any user-selected branch
 */

import { execSync } from 'node:child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * @param {object} options
 * @param {boolean} [options.dryRun]
 * @param {boolean} [options.force]
 * @param {boolean} [options.merged]
 * @param {boolean} [options.stale]
 * @param {boolean} [options.all]
 * @param {string} [options.days='30']
 */
export async function cleanBranches(options) {
  const dryRun = options.dryRun || false;
  const force = options.force || false;
  const daysThreshold = parseInt(options.days, 10) || 30;

  // Validate we're in a git repo
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe', encoding: 'utf-8' });
  } catch {
    throw new Error('Not in a Git repository');
  }

  // Get current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf-8',
    stdio: 'pipe',
  }).trim();

  // Get all local branches
  const branches = execSync('git branch --format="%(refname:short)"', {
    encoding: 'utf-8',
    stdio: 'pipe',
  })
    .trim()
    .split('\n')
    .filter(Boolean);

  if (branches.length === 0) {
    console.log(chalk.yellow('ℹ No local branches found.'));
    return;
  }

  // Get merge base info for each branch
  const branchInfo = [];
  for (const branch of branches) {
    if (branch === currentBranch) continue; // Never delete current branch

    const info = await getBranchInfo(branch, currentBranch, daysThreshold);
    branchInfo.push(info);
  }

  let candidates = [];

  if (options.merged) {
    const merged = branchInfo.filter(b => b.isMerged);
    candidates.push(...merged);
    console.log(chalk.blue(`\n🔍 Found ${merged.length} merged branches`));
  }

  if (options.stale) {
    const stale = branchInfo.filter(b => b.isStale);
    // Avoid double-counting if both flags are used
    const existing = new Set(candidates.map(b => b.name));
    candidates.push(...stale.filter(b => !existing.has(b.name)));
    console.log(chalk.blue(`\n🔍 Found ${stale.length} stale branches (no commits in ${daysThreshold} days)`));
  }

  if (!options.merged && !options.stale && !options.all) {
    // Default mode: show merged + stale
    const merged = branchInfo.filter(b => b.isMerged);
    const stale = branchInfo.filter(b => b.isStale && !b.isMerged);
    candidates = [...merged, ...stale];
    console.log(chalk.blue(`\n🔍 Found ${merged.length} merged + ${stale.length} stale branches`));
  }

  if (options.all || (!options.merged && !options.stale && !options.all && candidates.length === 0)) {
    // Interactive: let user pick from everything
    candidates = branchInfo;
  }

  if (candidates.length === 0) {
    console.log(chalk.green('✨ No branches to clean up!'));
    return;
  }

  // Present to user for selection
  const choices = candidates.map(b => ({
    name: formatBranchChoice(b, currentBranch),
    value: b.name,
    short: b.name,
  }));

  const { selectedBranches } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedBranches',
      message: 'Select branches to delete:',
      choices,
      pageSize: 20,
      loop: false,
    },
  ]);

  if (selectedBranches.length === 0) {
    console.log(chalk.yellow('ℹ No branches selected.'));
    return;
  }

  // Summary
  console.log(chalk.yellow(`\n📋 Selected ${selectedBranches.length} branches for deletion:`));
  for (const name of selectedBranches) {
    const info = branchInfo.find(b => b.name === name);
    console.log(`   ${chalk.red(name)}` +
      (info?.isMerged ? chalk.green(' (merged)') : '') +
      (info?.isStale ? chalk.yellow(` (stale: ${info.lastCommitAgo} days)`) : ''));
  }

  // Confirmation (unless force)
  if (!force && !dryRun) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Delete ${selectedBranches.length} branch(es)?`,
        default: false,
      },
    ]);
    if (!confirm) {
      console.log(chalk.yellow('ℹ Aborted.'));
      return;
    }
  }

  // Execute deletion
  for (const branch of selectedBranches) {
    if (dryRun) {
      console.log(chalk.dim(`[DRY-RUN] Would delete: ${branch}`));
    } else {
      try {
        execSync(`git branch -d "${branch}"`, { stdio: 'pipe', encoding: 'utf-8' });
        console.log(chalk.green(`✓ Deleted: ${branch}`));
      } catch (err) {
        // If -d fails (unmerged changes), try -D
        try {
          execSync(`git branch -D "${branch}"`, { stdio: 'pipe', encoding: 'utf-8' });
          console.log(chalk.green(`✓ Force-deleted: ${branch}`));
        } catch (err2) {
          console.error(chalk.red(`✗ Failed to delete ${branch}: ${err2.message}`));
        }
      }
    }
  }

  const action = dryRun ? 'would be deleted' : 'deleted';
  console.log(chalk.green(`\n✅ ${selectedBranches.length} branch(es) ${action}.`));
}

async function getBranchInfo(branch, currentBranch, daysThreshold) {
  const now = Math.floor(Date.now() / 1000);
  const thirtyDays = daysThreshold * 24 * 60 * 60;

  let lastCommitDate = 0;
  let lastCommitAgo = 0;
  let isStale = false;
  let isMerged = false;

  try {
    const dateStr = execSync(
      `git log -1 --format="%ct" "${branch}" 2>/dev/null || echo "0"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    lastCommitDate = parseInt(dateStr, 10) || 0;
    lastCommitAgo = lastCommitDate > 0
      ? Math.floor((now - lastCommitDate) / 86400)
      : Infinity;
    isStale = lastCommitAgo > daysThreshold;
  } catch {
    isStale = false;
  }

  try {
    // Check if branch is merged into current HEAD
    const mergeBase = execSync(
      `git merge-base "${branch}" "${currentBranch}" 2>/dev/null`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();

    const branchTip = execSync(
      `git rev-parse "${branch}" 2>/dev/null`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();

    if (mergeBase === branchTip) {
      isMerged = true;
    } else {
      // Also check if all commits are reachable from current branch
      const behindCount = execSync(
        `git rev-list --count "${branch}..${currentBranch}" 2>/dev/null || echo "0"`,
        { encoding: 'utf-8', stdio: 'pipe' }
      ).trim();
      isMerged = parseInt(behindCount, 10) === 0;
    }
  } catch {
    isMerged = false;
  }

  return {
    name: branch,
    lastCommitDate,
    lastCommitAgo,
    isStale,
    isMerged,
  };
}

function formatBranchChoice(info, currentBranch) {
  const parts = [info.name];
  if (info.isMerged) parts.push(chalk.green('[merged]'));
  if (info.isStale && info.lastCommitAgo !== Infinity) {
    parts.push(chalk.yellow(`[${info.lastCommitAgo}d stale]`));
  }
  return parts.join(' ');
}
