# 将现有GitHub仓库更新到1.0

现有仓库：https://github.com/dangerousdsp/jingchu-heritage-explorer

网站地址：https://dangerousdsp.github.io/jingchu-heritage-explorer/

本地1.0已包含网页、图片和准备好的三维资源。完成下面的上传后，线上网站才会更新。无需创建新仓库，也不要删除原仓库或改写提交历史。

## 一、打开这次准备的文件夹

交付位置：`output/github-v1.0.0/`。

- `source/heritage-explorer/`：完整源码和三维分片。适合GitHub Desktop或Git上传。
- `upload-batches/`：按网页上传限制拆好的8个批次。只用浏览器时，按下文操作。
- `heritage-explorer-source-1.0.0.zip`：完整源码备份，先解压后才能作为代码上传。
- `heritage-explorer-pages-1.0.0.zip`：生成好的静态网站，供静态主机使用。

**不要把ZIP当作仓库源码上传，也不要把整个 `github-v1.0.0` 或批次编号文件夹上传。** GitHub仓库根目录应直接看到README、dist、scripts、tests和.github。

## 二、在现有仓库创建更新分支

1. 打开上面的仓库地址，回到Code页面。
2. 点击文件列表上方的 `main` 分支按钮。
3. 输入 `release-v1.0.0`。
4. 点击 `Create branch: release-v1.0.0 from main`。
5. 确认左上角的分支现在是 `release-v1.0.0`。

将8批都传完后再合并，避免三维文件尚未传齐时替换线上网站。

## 三、分8批上传

每一批都执行同样的流程：

1. 在仓库**根目录**，点击 `Add file → Upload files`。
2. 打开本地对应批次文件夹。
3. **进入该文件夹里面**，把里面的文件和目录拖进网页。不要拖最外层 `01-...` 这样的批次文件夹。
4. 等待所有条目上传完成，检查网页显示的路径。
5. 写提交说明，例如 `Update v1.0 batch 1`。
6. 选择提交到当前 `release-v1.0.0` 分支，点击 `Commit changes`。
7. 回到分支的Code根目录，再上传下一批。

| 顺序 | 本地批次 | 上传后在GitHub中的路径 |
| --- | --- | --- |
| 1 | `01-code-and-docs` | 根目录文件、docs、scripts、tests及.github |
| 2 | `02-website-and-photos` | `dist/index.html`、`dist/*.mjs`、`dist/assets/photos/`等 |
| 3 | `03-webgl-engine` | `dist/runtime/runtime-manifest.json`、loader、framework及wasm |
| 4 | `04-webgl-data-1` | `dist/runtime/Build/data-00.bin`至`data-03.bin` |
| 5 | `05-webgl-data-2` | `data-04.bin`至`data-07.bin`，仍在相同Build目录 |
| 6 | `06-webgl-data-3` | `data-08.bin`至`data-11.bin` |
| 7 | `07-webgl-data-4` | `data-12.bin`至`data-15.bin` |
| 8 | `08-webgl-data-5` | `data-16.bin` |

路径预览 `/dist/runtime/Build/data-00.bin` 是正确的；`/04-webgl-data-1/dist/...` 则多套了一层，应删除待上传项后重新拖入内部的 `dist` 文件夹。

三维分片共17份，每份最大20MiB；不要把原始337MiB的 `WebGL.data.unityweb` 上传，也不要使用Git LFS来替代分片。无需上传原视频、WebGL原文件夹、Windows导出或原始工作簿。

## 四、确认工作流文件更新

浏览器有时会遗漏点号开头的目录，先确认这个文件：

`.github/workflows/pages.yml`

在 `release-v1.0.0` 分支中打开它，找到 `Build public static site`，其下一行应为：

```yaml
run: python scripts/package_release.py --public --auto-webgl --output output/github-pages
```

**必须有 `--auto-webgl`，否则公开网页不会启用三维。**

若没有更新，点铅笔Edit，用本地完整源码中的 `.github/workflows/pages.yml` 全文替换并提交到同一分支。若根本没有该文件，点Add file → Create new file，文件名输入完整小写路径 `.github/workflows/pages.yml`，粘贴本地文件内容后提交。

## 五、清理仓库中已不用的旧说明

本地旧发布包已经移除。由于网页“上传”只新增和替换，不会自动删除远程旧文件，可以在更新分支内删除以下旧文件（如果还存在）：

```text
docs/RELEASE_NOTES_v0.5.0.md
docs/ROADMAP.md
docs/images/detail-en.png
docs/images/mobile-detail-en.png
docs/images/mobile-en.png
docs/images/road-map-en.png
docs/images/road-map.png
```

在Code页打开相应文件，右上角 `… → Delete file`，提交到更新分支。不要删除整个docs或dist目录，也不要删除Git提交历史。

## 六、合并并发布

1. 回到仓库主页。点击 `Compare & pull request`，或 `Pull requests → New pull request`。
2. 确认 `base: main`，`compare: release-v1.0.0`。
3. 标题填写 `Release 1.0.0`，点击 `Create pull request`。
4. 等待检查通过。如果显示失败，打开Details查看具体步骤，先不要跳过检查。
5. 点击 `Merge pull request → Confirm merge`。
6. 打开仓库 `Actions`，等待最新 `Check and publish Pages` 的check和deploy都变成绿色。
7. 如果再次出现Configure Pages错误，进入 `Settings → Pages → Source`，确认是 `GitHub Actions`，再回到Actions重跑失败任务。已有工作流，不用新建Jekyll或Static HTML模板。
8. 打开网站。电脑用 `Ctrl+F5` 刷新；手机可用无痕窗口检查，避免旧缓存。

## 七、验收1.0

- 页脚显示1.0.0；中英文可切换。
- 图鉴部分有摄影配图，导航可打开“非遗影像”，共22张。
- 手机地图默认显示地区轮廓；点击数字弹出项目，再点击名称打开详情。
- “在线街道图”可以手动切换；外部底图失联时自动返回分布图。
- 电脑点击“进入三维体验”，等待约348MiB首次下载后看到陶器；切换木雕可以显示另一个模型。
- 选择推荐行程后可以生成道路路线，外部道路服务不可达时仍有逐站高德导航入口。

如果三维按钮仍显示“未包含”，优先检查工作流是否带 `--auto-webgl`；如果缺分片，检查 `dist/runtime/Build/` 中是否有data-00到data-16，且manifest已上传。

## GitHub Desktop替代方式

如果浏览器上传三维文件太慢，可使用GitHub Desktop克隆**现有仓库**，新建更新分支，把完整源码目录中的内容复制到克隆目录（不要复制外层heritage-explorer目录），按上述名单删除旧文件，检查Changed files后提交、Push origin、创建PR并合并。保留克隆目录自身的.git，不要用发布ZIP替换它。

## 限制与依据

GitHub网页每个文件最多25MiB、每次最多100个文件；本次每批都已控制在限制内。完整静态站约350MiB，低于GitHub Pages的1GB站点上限。首次三维加载较大，手机推荐先浏览图鉴、图片和地图。

官方说明：[上传文件](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)、[Pages限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)。
