# 项目说明 / Project overview

[简体中文](#简体中文) · [English](#english)

## 简体中文

### 荆楚非遗：从三维展示到可探索的文化旅行

荆楚非遗是一项以湖北非物质文化遗产为主题的数字展示与互动学习项目。早期版本由团队使用Unity制作，包含器物展示与三维漫游。后续个人重构以保留下来的运行导出为基础，在不安装Unity、不依赖完整原工程的条件下，建立可独立运行的浏览器应用，让访问者能够从文化资料进入地图，再把感兴趣的公共文化地点加入行程。

访问者可以筛选146条地区项目与专题，阅读附官方来源的简明介绍和观察提示；在真实街道地图上查看地区分布与核实过地址的文化目的地；生成道路路线，查看距离、估算时间及逐段方向，并将行程保存或打印。阅读、收藏和答题记录保存在浏览器。拥有原资源的本地用户还可以进入旧三维程序，通过左键环视适配继续体验戏台漫游。

### 后续个人工作的主要内容

1. 建立独立原生JavaScript网页，重构目录、详情、筛选和学习流程；将旧三维程序改为按需加载。
2. 整理145条表格地区记录，维护原行号/FID与名称更正，补充可追溯的原创简明介绍、观察点和官方来源。
3. 接入Leaflet、OSM及OSRM，区分地区参考坐标与参观目的地坐标，实现道路绘制、路线顺序、方向、缓存和失败反馈。
4. 编写Python标准库本地服务，处理gzip、Wasm、视频Range与只读路径边界；为旧相机添加网页左键输入适配。
5. 添加业务测试、发布校验、中英文文档与GitHub Pages自动部署配置。

### 原团队与个人贡献

原Unity场景、原模型/材质/音频/历史交互和原创花形标志来自早期团队项目。后续个人贡献集中于网页重构、资料整理、地图与路径功能、交互兼容、测试和文档。项目介绍不将原团队全部成果记作个人独立完成，也不宣称已恢复完整Unity工程或修复原物理问题。

### 技术与交付

前端为HTML/CSS与原生ES模块；地图为Leaflet 1.9.4和OSM；道路由OSRM提供；本地服务仅依赖Python标准库。公开演示可以静态部署，不包含原Unity大型构建和视频。需要旧三维时，单独配置保留的WebGL资源。本项目不是经头显验收的完整VR系统。

### 可用于作品集的简短表述

> 基于早期团队Unity非遗展示作品，完成个人后续Web重构：建设包含146条地区文化项目与专题的可追溯图鉴，接入真实街道地图、8个公共文化目的地与多站道路规划，提供本地学习记录和旧三维按需接入；实现左键相机兼容、自动化测试及GitHub Pages发布流程。原三维与标志保留团队归属，公开版与本地资源版明确区分。

### 后续方向

继续校核中英文文化内容与专名；核实更多体验场所入口；在可编辑工程或新网页三维模块中修复物理并加入第一/第三人称切换。当前尚无账户后台、云端记录或全球排名。

## English

### Jingchu Heritage: from a 3D exhibition to cultural exploration

Jingchu Heritage is a digital exhibition and learning project about the intangible cultural heritage of Hubei, China. Its earlier team-built Unity version presented cultural objects and a navigable 3D environment. A subsequent personal redevelopment uses the preserved runtime export as a starting point for an independent browser application, without requiring a Unity installation or the complete original source project.

Visitors can filter 146 regional entries and topics, read concise original summaries with official references and observation prompts, explore heritage distribution and checked cultural destinations on a street map, and plan a trip with road geometry, distance, estimated time and turn instructions. Reading, favourites and quiz records stay in the browser. Local users with the separate legacy resources can also enter the original 3D experience, including a left-button input adapter for the theatre camera.

### Main contributions of the personal continuation

1. A standalone vanilla-JavaScript application with catalogue, detail, filtering and learning flows, plus on-demand legacy 3D loading.
2. Traceable organisation of 145 spreadsheet regional records, preserving original row/FID references and name corrections, with original short summaries, observation prompts and official sources.
3. Leaflet/OSM mapping and OSRM road routes, separating regional reference points from visit destinations, with stop ordering, instructions, caching and failure feedback.
4. A Python standard-library local server for gzip, Wasm, video Range requests and a read-only resource mount, plus browser-side left-button compatibility for the legacy camera.
5. Automated tests, release checks, bilingual documentation and a GitHub Pages deployment workflow.

### Attribution

The original Unity scenes, models, materials, audio, historical interactions and floral logo originate from the earlier team project. The subsequent personal contribution focuses on web redevelopment, content organisation, mapping, routing, compatibility, testing and documentation. It does not claim sole authorship of all team assets, restoration of the complete Unity source project or repair of the original physics configuration.

### Technology and delivery

The frontend uses HTML/CSS and native ES modules; mapping uses Leaflet 1.9.4 and OpenStreetMap, with OSRM for road routes. The local server uses only Python's standard library. The public static demo excludes the large Unity build and archived video. Local legacy integration requires those separately provided files. This is not a fully validated VR-headset system.

### Portfolio description

> Personally redeveloped the web experience around an earlier team-built Unity heritage exhibition: created a traceable catalogue of 146 regional cultural entries and topics, integrated street mapping, eight public cultural destinations and multi-stop road planning, and added browser-local learning records and on-demand legacy 3D integration. Implemented left-button camera compatibility, automated tests and a GitHub Pages release workflow, preserving team attribution and distinguishing the public demo from the local resource edition.

### Next steps

Continue reviewing bilingual cultural content and proper names; verify more experience venues and entrances; address physics and implement first/third-person switching in an editable Unity project or a new web 3D module. Accounts, cloud records and global rankings are not implemented.
