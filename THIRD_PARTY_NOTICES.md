# 资料和资源来源

## 原项目资源

三维演示来自本地保留的 Unity 导出，生成于 Unity `2021.3.11f1c2`。模型、材质、音频、花鼓戏视频和 XDreamer/XCSJ 等插件来自早期项目；当前文件不能完整证明各项资源的原始作者及公开分发许可。没有为它们重新授予开源许可证。

`dist/assets/pottery.webp`、`wood.webp`、`chime.webp` 由本项目扫描时捕获的原版运行截图裁出展品区域并去除背景，供本地预览。这些图片的几何外观来自原模型，不能独立推导其再分发权。原始截图位于同级 `project_audit_20261029`。

本次新写的网页、服务器、测试和文档没有自动套用 MIT 等许可。选择公开许可证时，应确认个人新增代码、历史团队代码和第三方资源分别适用的范围。0.2/0.3未复制第三方库；0.4新增的本地库与许可证见下方说明。

## 文化内容

来源核对日期：2026-10-29。只进行短篇概述，并提供原文链接。

- 毛家窑背景：[人民论坛网考察文章](https://www.rmlt.com.cn/2018/1023/531042.shtml)，用于陶器与日常器用背景；不据此宣称当前名录级别。
- 通山木雕：[中国非物质文化遗产网项目页](https://www.ihchina.cn/project_details/14141/)，用于材料纹理、浮雕与题材说明。
- 编钟制作：[中国非物质文化遗产网项目页](https://www.ihchina.cn/project_details/23564/)，用于材料、制作工序与校音说明。

网站没有复制来源文章全文或下载其图片。来源链接与原三维模型并不构成两者一一对应的文物认定，尤其不将模型称为真实文物的精确测绘或声学复原。

## 0.3.0 新增来源与团队标志

用户确认“荆楚非遗”花形标志是早期团队自行设计。本版本从原 `sharedassets0` 首页纹理中裁出完整标志与花形符号，分别保存为 project-logo.png、project-symbol.png。保持原像素设计，没有用生成图片替代。该团队标志的原始权属说明与团队协作背景应随项目保留。

新增专题由下列官方项目页作简短概述，核对日期 2026-10-29：

- 荆州花鼓戏：https://www.ihchina.cn/project_details/13279.html
- 楚式漆器髹饰技艺：https://www.ihchina.cn/project_details/14549/
- 宜昌丝竹：https://www.ihchina.cn/project_details/12549

opera.svg、lacquer.svg、music.svg 为本轮绘制的主题图形，仅为示意，没有从官网复制图片或宣称文物复原。原项目花鼓戏视频具体剧目尚未核实，未将它认定为新增专题所述剧目的实录。

湖北地市边界保存为 dist/assets/hubei.geojson，2026-10-29 下载自阿里云 DataV GeoAtlas：

- 数据：https://geo.datav.aliyun.com/areas_v3/bound/420000_full.json
- 提供方说明：https://datav.aliyun.com/portal/school/atlas/area_selector
- 文件字节：155792；SHA256：0acb559fcfe2ab2c5d2707c2477e60facdf4328ad89b8ab7d9126c5166675502

数据在界面保留来源链接，用于文化专题的地市级示意导览，专题位置根据资料所属地区关联，不代表传承人住址、场馆精确坐标或实地导航点。DataV 数据不被本项目重新授予开源许可。

## 0.4 内容与地图

本轮新增读取用户提供的湖北省非遗数据.xlsx，仅派生应用数据，原表保持不变。145条记录按地区子项计数，不宣称是145种互不重复的非遗项目。49条有官方直接来源的原创资料保存在 researched-topics.json；来源与修订见 docs/CONTENT_RESEARCH.md。

8个参观目的地的地址、坐标和来源逐条保存在 visit-places.json。OSM数据遵循Open Database License，地图保留 OpenStreetMap contributors 可见署名和来源链接。来源：https://www.openstreetmap.org/copyright 。底图按当前视口加载，没有批量下载、预取或离线瓦片功能；遵循 https://operations.osmfoundation.org/policies/tiles/ 。

街道路线使用 OSRM 公共演示服务，规则及接口：https://project-osrm.org/docs/v5.24.0/api/ ，https://github.com/Project-OSRM/osrm-backend/wiki/Api-usage-policy 。请求仅含主动选择的公共目的地，服务可用性不由本项目保证。

高德导航使用公开 URI API：https://lbs.amap.com/api/uri-api/guide/travel/route 。地点确认使用 https://lbs.amap.com/api/uri-api/guide/search/search 。没有复制高德地图瓦片，也没有嵌入高德商业服务密钥。

新增本地第三方代码：

- Leaflet 1.9.4，BSD-2-Clause，官方 https://leafletjs.com/ ，来源由其官方推荐CDN获取，许可证保留于 dist/vendor/leaflet/LICENSE。
- coordtransform 2.1.2，Wandergis，MIT，https://github.com/wandergis/coordtransform ，原代码及许可证保留于 dist/vendor/coordtransform，另加ESM包装用于WGS84/GCJ02转换。

透明标志根据用户提供的 Logo..jpg 使用内置图像编辑处理，当前版本和提示词见 docs/BRAND_ASSETS.md；团队原有权属背景继续保留。

## 0.4.1 内容覆盖补齐

145条表格记录已全部补齐原创简明介绍、观察点与官方来源，共138个不同官方链接。包含地区专文与明确标注适用范围的项目通用资料。完整来源见 dist/researched-topics.json 及网页版本说明，导入与更正见 docs/CONTENT_RESEARCH.md。

## 0.5 双语内容与分发范围

主网页和来源说明支持中英文。英文文化导读根据同一批已引用中文资料编写为简明导读，不是逐句翻译，不增加新的史实、疗效或场次承诺；原中文与引用URL均保留。地区资料适用范围与原表更正有英文说明。详见docs/LOCALIZATION.md。

English guides are concise adaptations of the same cited cultural material, rather than sentence-by-sentence translations. Source URLs, regional limitations and original records are retained. No additional historical, medical or event-availability claims are implied.

本次源码包与Pages公开包不包含原Unity构建、商业插件二进制或原花鼓戏视频；保留的模型外观预览与标志仍按上述原团队资源说明处理。未自动增加统一MIT许可。许可范围见LICENSE_SCOPE.md。
