# GitHub 上传与发布教程

适用版本：0.5.0。核对GitHub官方文档日期：2026-10-29。本教程用于你自己操作上传；目前未创建远程仓库、未推送、未部署。

## 1. 先认清两个包

| 文件 | 用途 | 怎么用 |
| --- | --- | --- |
| heritage-explorer-source-0.5.0.zip | 上传GitHub的源码包 | 先解压，把内部heritage-explorer目录的内容作为仓库根目录 |
| heritage-explorer-pages-0.5.0.zip | 已生成的纯静态公开网站 | 解压后可交给静态主机；GitHub仓库使用上面的源码包即可 |

源码包含README、README.en.md、.github工作流、dist、scripts、tests及docs。发布包只有网页和校验清单，不含Python服务。ZIP本身上传到Code页只会成为一个下载文件，**不会变成源码目录或自动发布网站**。

建议仓库名：`jingchu-heritage-explorer`。

中文简介：`湖北非遗文化探索平台：资料图鉴、街道地图、多站道路规划与互动学习，延续原团队Unity作品。`

英文简介：`Explore Hubei heritage through a sourced catalogue, street maps, cultural road trips and learning tools. A web continuation of an earlier Unity team project.`

建议Topics：`cultural-heritage`、`hubei`、`webgis`、`leaflet`、`javascript`、`python`、`unity-webgl`、`digital-humanities`。

## 2. 上传范围

只上传解压后的 `heritage-explorer` 内部内容。仓库打开后第一层应看到：

```text
.github/
dist/
docs/
scripts/
tests/
README.md
README.en.md
package.json
...
```

**不要在更外层Windows资料目录初始化仓库。** 原 `Windows/`、`WebGL/`、扫描目录、申请书、原Excel和Logo原图继续保留在本机。源码包已经排除它们，以及qa、output、缓存和本地恢复目录。无需手动挑选旧文件。

原Unity数据文件约337MiB，不能放入普通Git提交。GitHub网页上传上限为每文件25MiB、一次最多100文件；普通Git单文件上限100MiB。[官方上传说明](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)、[大文件限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)。当前轻量源码包里的文件远小于这些限制。

## 3. 创建空仓库

1. 登录GitHub，点击右上角“+”→“New repository”。
2. Repository name填写 `jingchu-heritage-explorer`，Description粘贴上方英文简介。
3. 用免费账户发布Pages，选择Public；如先选Private，后续Pages可用性取决于套餐。[Pages可用范围](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
4. **不要勾选Add a README、Add .gitignore，也先不要选择License。** 包里已经有说明与忽略规则；许可范围见LICENSE_SCOPE.md，不把原团队资源统一套成MIT。
5. 点击Create repository。你会得到 `https://github.com/你的用户名/jingchu-heritage-explorer`。

以下上传方式任选一种，不要对同一目录重复初始化。

## 4A. 网页上传：适合第一次操作

1. 解压源码ZIP。进入内部 `heritage-explorer`，先打开README确认是0.5.0。
2. 在新仓库页面点击“uploading an existing file”；已有仓库使用Add file → Upload files。
3. 将该目录**里面的文件和子目录**拖进上传区，保留子目录结构。不要拖最外层heritage-explorer文件夹，也不要上传ZIP代替源码。
4. 查看上传预览，确认有 `.github/workflows/pages.yml`、`dist/index.html` 和 `README.en.md`。资源管理器如看不到点开头目录/文件，开启“查看→显示→隐藏的项目”；若浏览器遗漏点文件，改用下面的Git方式。
5. 提交说明填写 `Prepare bilingual heritage explorer and public demo`，提交到main。
6. 回仓库首页，确认README自动展示，English链接能打开英文说明。

网页一次最多100文件；若以后文件数增加，分批上传或使用Git。若网页拒绝工作流文件，用GitHub的Add file → Create new file，文件名填 `.github/workflows/pages.yml`，从包内同名文件原样复制内容并提交，或改用Git/桌面客户端上传。

## 4B. Git命令上传：适合后续持续维护

需要可用Git；先执行 `git --version`。如没有Git，可从[Git官网](https://git-scm.com/downloads)安装，或使用[GitHub Desktop](https://desktop.github.com/)。本次打包没有替你安装它们。

在解压后包含README的文件夹打开PowerShell，先用 `Get-Location` 确认目录，再执行：

```powershell
git init -b main
git add .
git status --short
```

检查列表只包含本项目源码、说明与网页资源，不含原WebGL、申请书、工作簿或output。若提示缺少提交身份，可仅给此仓库设置；邮箱可使用GitHub Settings → Emails显示的noreply地址：

```powershell
git config user.name "你的GitHub显示名"
git config user.email "你的GitHub提交邮箱"
git commit -m "Prepare bilingual heritage explorer and public demo"
```

把下面的 `YOUR_USERNAME` 替换成你的GitHub用户名，仓库名与网页创建的一致：

```powershell
git remote add origin https://github.com/YOUR_USERNAME/jingchu-heritage-explorer.git
git push -u origin main
```

按Git弹出的登录流程完成身份验证。不要把访问令牌写进remote URL、源码或截图。GitHub账户密码不能直接代替HTTPS Git访问令牌；登录方式见[GitHub官方身份验证说明](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)。如当前Git环境不便登录，GitHub Desktop登录后添加此本地仓库并Publish repository也可以。

若提示origin已存在，先 `git remote -v` 检查，不盲目覆盖；若远程已经有提交，先确认仓库内容，不使用force强推。这里假定第3步创建的是空仓库。

## 5. 开通并发布 GitHub Pages

1. 进入仓库 **Settings → Pages**。
2. 在Build and deployment下把Source设为 **GitHub Actions**。无需选docs目录；本仓库docs是说明文件，网站来自自动生成的公开版。
3. 打开 **Actions → Check and publish Pages**。如果首次push在配置Pages前失败，这是正常的配置顺序问题；完成第2步后使用Re-run all jobs，或Run workflow → Branch: main → Run workflow。
4. 等待 `check` 和 `deploy` 都变绿。工作流会执行JavaScript/Python测试、生成公开版、校验文件清单与引用，最后发布。首次运行可能需要等待几分钟。
5. 返回Settings → Pages，打开GitHub给出的实际网址。通常形如 `https://你的用户名.github.io/jingchu-heritage-explorer/`。以页面显示的真实网址为准。
6. 在仓库首页About右侧齿轮里，将Website填为该网址并添加Topics；README里已有相对路径，不需要替换虚构的演示URL。

这些步骤对应[GitHub Pages发布源配置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)和[自定义工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。工作流所需Pages/OIDC权限已经在文件中配置，无需新建个人密钥或手工填写Secrets。

### 发布后核对

- 首页正常显示；页脚版本0.5.0。
- 右上角Language可切换中英文，英文搜索、详情、行程和测验正常；About链接打开双语项目介绍。
- 图鉴146条、筛选和详情来源正常，阅读记录与测验能用。
- 街道地图有OSM署名；选择“武汉文化漫游”并主动规划，道路成功时显示实线与方向。公共服务不通时应有失败提示和替代导航入口。
- 三维区明确提示公开版未附原构建，按钮禁用；原视频入口同样明确说明。本地视频预览仍可用。
- 手机页面不横向溢出。分享的应是Pages网址，而不是仓库Code网址。

## 6. 发布第一个 Release（可选）

在代码与Pages都正常后，进入Releases → Draft a new release。创建tag `v0.5.0`，target选main，标题 `Jingchu Heritage Explorer v0.5.0`。正文可复制docs/RELEASE_NOTES_v0.5.0.md。将轻量源码ZIP和Pages ZIP作为附件，便于他人下载；原Unity/原视频不作为本次附件。确认后Publish release。这一步由你执行，本次没有替你向GitHub发布。

## 7. 日后更新

在自己正在维护的仓库目录改代码、测试，再：

```powershell
git add .
git commit -m "Describe the actual change"
git push
```

每次推送main会重新测试和发布。发新版本时同步package.json、网页/说明版本和更新记录，再运行打包脚本；已存在输出不会覆盖。不要把修改只做在output下的临时网页，否则下次重新生成会丢失。

## 8. 完整三维为什么不随 Pages 包一起发

GitHub Pages是静态主机，不运行本项目的Python服务；本次公开包通过生成配置明确关闭未附带的旧三维和视频入口。原导出既有大文件，也依赖正确的 `Content-Encoding: gzip` 与Wasm MIME响应头，[Unity部署说明](https://docs.unity3d.com/2020.2/Documentation/Manual/webgl-deploying.html)。不能把压缩文件直接扔进Pages就认定可用。Git LFS也不适用于Pages站点，[GitHub LFS说明](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)。

目前保留本地资源版最直接：`python scripts/serve.py --runtime-dir "原WebGL目录" --open`。以后需要公开完整三维，可在核实历史模型/插件/视频分发范围后，使用可配置响应头的静态资源主机或对象存储，测试HTTPS、CORS、gzip/Wasm、资源路径和实际运行表现，再接入网站。当前尚未配置或验收这种远程运行方案。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 仓库只看到一个ZIP | 应先解压，上传内部源码 |
| 首页多了一层heritage-explorer目录 | 重新确认仓库根目录，应直接有dist、README和.github |
| Pages配置找不到或不能开启 | 检查仓库可见性、套餐和管理员权限 |
| Actions报Pages未启用 | Settings → Pages选择GitHub Actions，再重新运行 |
| Actions找不到dist或脚本 | 检查是否把源码多嵌套了一层 |
| Pages主页404 | 检查deploy是否成功、实际网址是否含仓库名；等待部署生效 |
| 图片/脚本404 | 保持目录与文件名大小写，不要用本机C盘路径；仓库需完整上传 |
| 地图空白或道路失败 | 检查外网与公共服务，保留失败提示；不承诺所有地区网络可访问 |
| 公开页面三维不能启动 | 本次公开版设计如此；使用有原资源的本地版 |
| 旧Unity内部仍是中文 | 网页右上角Language可切换中英文；旧Unity构建内文字、原机构名、外部来源正文及地图原路名保留原文 |
