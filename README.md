# Git Branch Cleaner

[![npm version](https://img.shields.io/npm/v/git-branch-cleaner.svg)](https://www.npmjs.com/package/git-branch-cleaner)
[![npm downloads](https://img.shields.io/npm/dm/git-branch-cleaner.svg)](https://www.npmjs.com/package/git-branch-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/SCL339/git-branch-cleaner?style=social)](https://github.com/SCL339/git-branch-cleaner)

---

- 🏃 **Dry-run mode** — see what would be deleted before committing
- 🔒 **Safety confirmations** — double-check before deleting
- 💪 **Force mode** — skip confirmations for scripting
- 🎯 **Smart defaults** — shows merged + stale branches out of the box
- 🎨 **Color-coded output** — at-a-glance branch status

---

# Global install (recommended)
npm install -g git-branch-cleaner

# Or run via npx
npx git-branch-cleaner

# Or use as a dependency
npm install --save-dev git-branch-cleaner
```

---

# Run in any Git repository (interactive)
git-branch-cleaner

# Dry-run (show what would be deleted)
git-branch-cleaner --dry-run

# Only show merged branches
git-branch-cleaner --merged

# Only show stale branches (custom threshold)
git-branch-cleaner --stale --days 60

# Show all branches for manual selection
git-branch-cleaner --all

# Skip confirmation prompts (for automation)
git-branch-cleaner --force

# Combine options
git-branch-cleaner --merged --stale --dry-run
```

---

|--------|-------|---------|-------------|
| `--dry-run` | `-d` | `false` | Show what would be deleted without deleting |
| `--force` | `-f` | `false` | Skip safety confirmation prompts |
| `--merged` | `-m` | `false` | Only show branches merged into HEAD |
| `--stale` | `-s` | `false` | Only show branches with no recent commits |
| `--all` | `-a` | `false` | Show all local branches for selection |
| `--days` | | `30` | Days threshold for stale detection |
| `--no-color` | | `false` | Disable colored output |

---

3. **Detects stale branches** — branches with no commits in the last 30 days
4. **Shows an interactive checklist** of the merged + stale branches
5. **Prompts for confirmation** before deleting
6. **Deletes** using `git branch -d` (safe delete) or `-D` (force delete if needed)

```
$ git-branch-cleaner

---

◻ old-feature [merged]
◻ bugfix-123 [merged]
◻ wip-styles [merged]
◻ experiment-1 [21d stale]
◻ experiment-2 [45d stale]
(Move up and down to reveal more choices)

? Delete 3 branch(es)? (y/N)
```

---

- **CI/CD automation** — use `--force` in scripts to auto-delete merged branches
- **Onboarding** — run on a legacy repo with hundreds of stale branches
- **Pre-PR checklist** — clean up before submitting your next pull request

---

|---------|-------------------|----------------------|
| Interactive UI | ✅ Checkbox selection | ❌ |
| Merged detection | ✅ Automatic | ⚠️ Manual check |
| Stale detection | ✅ Configurable | ❌ |
| Dry-run | ✅ Built-in | ❌ |
| Safety confirmations | ✅ Always | ❌ Accidental deletes |
| Bulk delete | ✅ One command | ❌ One at a time |

---

- [env-validator](https://github.com/SCL339/env-validator) — Validate .env files against .env.example

---

- 🚀 **Deploy your frontend** on [Vercel](https://vercel.com/?utm_source=scl339&utm_campaign=oss)
- ⭐ **Star this repo** to help others discover it

---

---

## 🤝 赞助支持 (Sponsor)

如果这个项目对你有帮助，可以请我喝杯咖啡 ☕

- 💖 **支付宝 (Alipay)**: `18559219554` | 邮箱联系: `530765059@qq.com`
- ☁️ **DigitalOcean 联盟链接**: [免费 $200 额度](https://www.digitalocean.com/?refcode=scl339-01&utm_campaign=Referral_Invite&utm_medium=opensource&utm_source=SCL339)
- ⭐ **在 GitHub 上点 Star** 帮助更多人发现这个项目

## 📄 License