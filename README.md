# 荆风楚韵 | Jingchu Reverie

**[在线体验](https://dangerousdsp.github.io/jingchu-heritage-explorer/)** · [English](README.en.md)

湖北非遗数字展馆，提供中英文非物质文化遗产图鉴、湖北非遗地图、文化旅行路线与三维器物展览。专题涵盖曾都编钟、通山木雕与毛家窑陶器。

- **文化图鉴**：146条地区记录与专题，支持搜索、筛选、收藏和学习手记。
- **地图与旅行**：点选非遗分布，查看文化目的地，规划多站道路行程。
- **影像与作品**：非遗照片、六幅专题地图与戏曲视频节选。
- **云上展馆**：Three.js轻量展厅、原项目青铜钟、青花瓷、圆雕与浮雕，支持旋转、观察热点、双语与观察手记；高清模型按需加载。
- **小楚助手**：基于本地知识库回答问题，支持双语与上下文追问。

**主要技术**：HTML / CSS / JavaScript、Three.js、Leaflet、OSRM。

## 本地运行（可选）

需要Node.js 18+和现代浏览器，在项目根目录执行：

```sh
npm run serve
```

直接打开编钟展区可运行 `npm run museum`，Windows也可双击“打开轻量展馆.cmd”。已有Python 3.10+时仍可运行 `python scripts/serve.py --open`。

新版无需安装Unity，首页不加载三维库或模型。原编钟轻量版约2.81 MiB，高清版约4.47 MiB；另有注明真实产地的Smithsonian开放藏品。旧版Unity已移出网站，仅作本地备份。

素材归属见[资源署名](THIRD_PARTY_NOTICES.md)，使用范围见[许可说明](LICENSE_SCOPE.md)。

## 联系我们

如有问题请联系 QQ 2257211623，或发送邮件至 [2257211623@qq.com](mailto:2257211623@qq.com)。
