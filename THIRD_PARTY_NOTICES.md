# 资源来源 / Resource credits

## 标志与三维 / Identity and 3D

荆楚非遗花形标志、Unity场景、模型、材质及场景内音频来自原团队项目。保留Unity导出使用2021.3.11f1c2及XDreamer/XCSJ等组件。1.0仅进行网页加载适配与数据分片，不重新授予原资产或插件许可。原视频不在公开包内。

The floral identity, Unity scenes, models, materials and in-scene audio originate from the original team project. The retained build uses Unity 2021.3.11f1c2 and components including XDreamer/XCSJ. Static packaging does not relicense those assets or plugins. The archived video is excluded.

pottery.webp、wood.webp、chime.webp及三维截图来自原项目运行画面。透明标志根据团队提供的Logo处理；原始素材保留。

## 文化资料 / Cultural references

146条地区记录与专题由简明导读、观察点与官方原文链接组成，来源保存在 `dist/catalog-data.mjs`、`dist/core-content.mjs` 及 `dist/researched-topics.json`。145条原始表格地区记录的FID与行号保留；原表不随网站分发。英文为同一批材料的简明导读。

## 摄影与艺术 / Photographs and artwork

22张来自Wikimedia Commons的图片以各自CC BY、CC BY-SA、CC0或公共领域条件提供；逐张作者、原文件页、授权链接、内容范围与摘要保存在 `dist/photo-data.mjs`，网站影像页、详情与来源页均显示署名。文件优化为WebP，尺寸缩小，卡片可能裁切；各图原授权继续适用。涉及同类技艺或地域环境的图片明确标为参考。

The 22 Commons images retain their individual licences and attribution. Each record includes its source, author, licence, subject, scope and checksum. Images are resized and converted to WebP; cards may crop them. The original image licences continue to apply to these versions. Regional and art-form references are identified in captions.

## 地图与导航 / Maps and navigation

- 湖北市州轮廓：[DataV GeoAtlas](https://datav.aliyun.com/portal/school/atlas/area_selector)，数据源 `https://geo.datav.aliyun.com/areas_v3/bound/420000_full.json`；原文件SHA256 `0acb559fcfe2ab2c5d2707c2477e60facdf4328ad89b8ab7d9126c5166675502`。提供方条款适用，不重新授权。
- 地点与街道：[© OpenStreetMap contributors / ODbL](https://www.openstreetmap.org/copyright)。在线底图仅按视口加载，不预取或打包OSM瓦片，遵循[瓦片政策](https://operations.osmfoundation.org/policies/tiles/)。
- 道路：[OSRM API](https://project-osrm.org/docs/v5.24.0/api/)。
- 外部导航：[高德URI路线接口](https://lbs.amap.com/api/uri-api/guide/travel/route)。

## 本地第三方库 / Vendored libraries

- Leaflet 1.9.4，BSD-2-Clause，[官网](https://leafletjs.com/)，许可证位于 `dist/vendor/leaflet/LICENSE`。
- coordtransform 2.1.2，Wandergis，MIT，[源码](https://github.com/wandergis/coordtransform)，许可证位于 `dist/vendor/coordtransform/LICENSE`。
