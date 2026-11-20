---
title: "用 Git worktree 并行处理两个分支"
date: "2026-10-28"
slug: "git-worktree"
categories: ["学习资料"]
tags: ["Git", "工作流"]
description: "把临时修复放进独立工作目录，让手头写到一半的代码留在原地。"
cover: "terminal"
---

## 临时任务来了

一个功能写到一半时，常会遇到需要切回稳定分支的情况。工作树让同一个仓库拥有多个工作目录，每个目录可以检出不同分支，并保持自己的暂存区。

## 给修复开一个目录

在使用 main 作为主分支的仓库中，运行 git worktree add ../fix-docs -b fix/docs main，便会在相邻目录创建一个从 main 起步的工作树。在新目录修正文档并提交，原目录里的修改仍然保留。

## 收尾时检查状态

运行 git worktree list 可以查看目录和分支的对应关系。确认修改已提交并合并后，使用 git worktree remove ../fix-docs 清理额外目录。分支仍会保留，可以按日常习惯管理。
