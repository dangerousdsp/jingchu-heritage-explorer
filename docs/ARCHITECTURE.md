# 1.0 架构

`content.mjs` 将基础专题与145条地区记录合并为146条，保留稳定ID、来源、原行号与地区坐标。`english-content.mjs` 与 `i18n.mjs` 提供双语内容和界面；浏览器学习存储键保持兼容。

`photo-data.mjs` 保存22张图片的作者、授权、真实主题、参考范围和文件校验值。`photo-links.mjs` 显式关联文化专题；`gallery.mjs` 提供图集、放大和详情链接。

`roadmap.mjs` 使用本地Leaflet库与随站点分发的湖北市州边界，默认不请求外部瓦片。73组地区点点击后弹出专题列表；8个文化目的地提供行程入口。在线OSM街道图由用户切换，连续失败或10秒没有加载成功时返回本地分布图。ResizeObserver缺失时保留窗口尺寸监听。请求超时使用AbortController定时器，兼容未实现AbortSignal.timeout的浏览器。

道路规划保留公共目的地白名单、8站上限、缓存、结果版本隔离与导航链接。静态部署在本地API不可用时请求固定OSRM公共服务。地区参考坐标不用于精确出行；目的地使用独立WGS84坐标，进入高德时转换为GCJ02。

`scripts/package_webgl.py` 只读原导出，将352957010字节的压缩数据切成17份，每份最大20MiB，保留loader/framework/wasm。`runtime-download.mjs` 顺序下载分片，校验大小与SHA256，组装Blob后交给原Unity解压逻辑；初始化完成后释放对象URL。源文件不重写、不重编译。首次加载三维才下载这些资源。

`scripts/package_release.py --public --auto-webgl` 检测已准备的 `dist/runtime/runtime-manifest.json`，输出public-webgl配置；没有分片时生成不启用三维的轻量公开版。公开包不含原339MB视频，视频预览使用用户自己的本地文件。

`scripts/serve.py` 优先服务准备好的runtime分片；未准备时可只读挂载同级原WebGL目录。普通静态服务器无需gzip响应头即可运行完整发布包，Unity原加载器负责压缩格式兼容。

`scripts/check_release.py` 检查站内链接、模块导入、全部文件摘要、分片重组摘要、公开配置与单文件25MiB上限。GitHub Actions执行测试、打包、校验后发布Pages。
