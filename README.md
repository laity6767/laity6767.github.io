# AOM · An Ordinary Mind

用 Hexo 生成公开博客。文章和资料由 GitHub 仓库的写入权限控制。

## 发布到 GitHub Pages

1. 将本目录的文件（包括 .github/workflows/pages.yml）放入自己账号的公开仓库，默认分支为 main。可以使用 用户名.github.io 作为仓库名，也支持普通项目仓库。
2. 在仓库 Settings → Pages → Build and deployment 中选择 GitHub Actions。
3. 在 Actions 中选择 Publish AOM → Run workflow，或将改动提交到 main。任务完成后，以部署记录显示的 URL 为准。

## 发文章和更新资料

- 打开 source/_posts 里的 .md 文件，点击铅笔，即可直接在手机或电脑的 GitHub 网页编辑。提交到 main 后网站自动更新。
- 新文章可复制已有文章的格式。title 为标题，date 用 YYYY-MM-DD，slug 是唯一英文路径，categories 填学习资料、个人手记或有感。正文用 Markdown，二级标题以两个井号和空格开头。
- 站点资料在 source/_data/profile.json；关于页正文在 source/about/index.md。
- 仓库为公开时，提交进仓库的草稿也可以被人直接查看。只提交准备公开的内容，账号密码不要写入仓库。

## 本地验证

使用 Node.js 24，运行 npm ci 和 npm run build。public 为生成的网页；本地预览可用 python3 -m http.server 8000 --directory public 。

此版本发布静态文件。站内编辑和云端书架仍属于原 AOM 版本。原有月球图来自 NASA Scientific Visualization Studio / Ernie Wright，登月舱照片来自 NASA Apollo 11 AS11-40-5927。机房与地球夜景图来自 Unsplash。
