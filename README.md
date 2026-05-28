1|     1|     1|# Git Branch Cleaner
     2|     2|     2|
     3|     3|     3|[![npm version](https://img.shields.io/npm/v/git-branch-cleaner.svg)](https://www.npmjs.com/package/git-branch-cleaner)
     4|     4|     4|[![npm downloads](https://img.shields.io/npm/dm/git-branch-cleaner.svg)](https://www.npmjs.com/package/git-branch-cleaner)
     5|     5|     5|[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
     6|     6|     6|[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
     7|     7|     7|[![GitHub stars](https://img.shields.io/github/stars/SCL339/git-branch-cleaner?style=social)](https://github.com/SCL339/git-branch-cleaner)
     8|     8|     8|
     9|     9|     9|---
    10|    10|    10|
    11|    11|    11|
    12|    12|    12|- 🏃 **Dry-run mode** — see what would be deleted before committing
    13|    13|    13|- 🔒 **Safety confirmations** — double-check before deleting
    14|    14|    14|- 💪 **Force mode** — skip confirmations for scripting
    15|    15|    15|- 🎯 **Smart defaults** — shows merged + stale branches out of the box
    16|    16|    16|- 🎨 **Color-coded output** — at-a-glance branch status
    17|    17|    17|
    18|    18|    18|---
    19|    19|    19|
    20|    20|    20|
    21|    21|    21|# Global install (recommended)
    22|    22|    22|npm install -g git-branch-cleaner
    23|    23|    23|
    24|    24|    24|# Or run via npx
    25|    25|    25|npx git-branch-cleaner
    26|    26|    26|
    27|    27|    27|# Or use as a dependency
    28|    28|    28|npm install --save-dev git-branch-cleaner
    29|    29|    29|```
    30|    30|    30|
    31|    31|    31|---
    32|    32|    32|
    33|    33|    33|
    34|    34|    34|# Run in any Git repository (interactive)
    35|    35|    35|git-branch-cleaner
    36|    36|    36|
    37|    37|    37|# Dry-run (show what would be deleted)
    38|    38|    38|git-branch-cleaner --dry-run
    39|    39|    39|
    40|    40|    40|# Only show merged branches
    41|    41|    41|git-branch-cleaner --merged
    42|    42|    42|
    43|    43|    43|# Only show stale branches (custom threshold)
    44|    44|    44|git-branch-cleaner --stale --days 60
    45|    45|    45|
    46|    46|    46|# Show all branches for manual selection
    47|    47|    47|git-branch-cleaner --all
    48|    48|    48|
    49|    49|    49|# Skip confirmation prompts (for automation)
    50|    50|    50|git-branch-cleaner --force
    51|    51|    51|
    52|    52|    52|# Combine options
    53|    53|    53|git-branch-cleaner --merged --stale --dry-run
    54|    54|    54|```
    55|    55|    55|
    56|    56|    56|---
    57|    57|    57|
    58|    58|    58|
    59|    59|    59||--------|-------|---------|-------------|
    60|    60|    60|| `--dry-run` | `-d` | `false` | Show what would be deleted without deleting |
    61|    61|    61|| `--force` | `-f` | `false` | Skip safety confirmation prompts |
    62|    62|    62|| `--merged` | `-m` | `false` | Only show branches merged into HEAD |
    63|    63|    63|| `--stale` | `-s` | `false` | Only show branches with no recent commits |
    64|    64|    64|| `--all` | `-a` | `false` | Show all local branches for selection |
    65|    65|    65|| `--days` | | `30` | Days threshold for stale detection |
    66|    66|    66|| `--no-color` | | `false` | Disable colored output |
    67|    67|    67|
    68|    68|    68|---
    69|    69|    69|
    70|    70|    70|
    71|    71|    71|3. **Detects stale branches** — branches with no commits in the last 30 days
    72|    72|    72|4. **Shows an interactive checklist** of the merged + stale branches
    73|    73|    73|5. **Prompts for confirmation** before deleting
    74|    74|    74|6. **Deletes** using `git branch -d` (safe delete) or `-D` (force delete if needed)
    75|    75|    75|
    76|    76|    76|```
    77|    77|    77|$ git-branch-cleaner
    78|    78|    78|
    79|    79|    79|---
    80|    80|    80|
    81|    81|    81|
    82|    82|    82|  ◻ old-feature [merged]
    83|    83|    83|  ◻ bugfix-123 [merged]
    84|    84|    84|  ◻ wip-styles [merged]
    85|    85|    85|  ◻ experiment-1 [21d stale]
    86|    86|    86|  ◻ experiment-2 [45d stale]
    87|    87|    87|(Move up and down to reveal more choices)
    88|    88|    88|
    89|    89|    89|? Delete 3 branch(es)? (y/N)
    90|    90|    90|```
    91|    91|    91|
    92|    92|    92|---
    93|    93|    93|
    94|    94|    94|
    95|    95|    95|- **CI/CD automation** — use `--force` in scripts to auto-delete merged branches
    96|    96|    96|- **Onboarding** — run on a legacy repo with hundreds of stale branches
    97|    97|    97|- **Pre-PR checklist** — clean up before submitting your next pull request
    98|    98|    98|
    99|    99|    99|---
   100|   100|   100|
   101|   101|   101|
   102|   102|   102||---------|-------------------|----------------------|
   103|   103|   103|| Interactive UI | ✅ Checkbox selection | ❌ |
   104|   104|   104|| Merged detection | ✅ Automatic | ⚠️ Manual check |
   105|   105|   105|| Stale detection | ✅ Configurable | ❌ |
   106|   106|   106|| Dry-run | ✅ Built-in | ❌ |
   107|   107|   107|| Safety confirmations | ✅ Always | ❌ Accidental deletes |
   108|   108|   108|| Bulk delete | ✅ One command | ❌ One at a time |
   109|   109|   109|
   110|   110|   110|---
   111|   111|   111|
   112|   112|   112|
   113|   113|   113|- [env-validator](https://github.com/SCL339/env-validator) — Validate .env files against .env.example
   114|   114|   114|
   115|   115|   115|---
   116|   116|   116|
   117|   117|   117|ARKER
   118|   118|   118|- 🚀 **Deploy your frontend** on [Vercel](https://vercel.com/?utm_source=scl339&utm_campaign=oss)
   119|   119|   119|- ⭐ **Star this repo** to help others discover it
   120|   120|   120|
   121|   121|   121|
   122|   122|   122|---
   123|   123|   123|
   124|   124|   124|
   125|   125|   125|

---

## 🤝 赞助支持 (Sponsor)

如果这个项目对你有帮助，可以请我喝杯咖啡 ☕

- 💖 **支付宝 (Alipay)**: `18559219554` | 邮箱联系: `530765059@qq.com`
- ☁️ **DigitalOcean 联盟链接**: [免费 $200 额度](https://www.digitalocean.com/?refcode=scl339-01&utm_campaign=Referral_Invite&utm_medium=opensource&utm_source=SCL339)
- ⭐ **在 GitHub 上点 Star** 帮助更多人发现这个项目

## 📄 License
