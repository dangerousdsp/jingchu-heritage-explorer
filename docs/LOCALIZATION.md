# Bilingual web interface / 网页双语

0.5.0 adds a persistent Chinese/English selector to the main website and source-notes page. Query parameter `?lang=en` or `?lang=zh` can choose the initial language; choosing a different option updates that parameter and the browser preference. Existing reading, favourites, trip and quiz IDs are unchanged.

主网页和来源页右上角可切换中英文。`?lang=en`、`?lang=zh`指定初始语言，主动选择会更新网址和本地偏好。没有自动清空或迁移用户的阅读、收藏、行程和测验记录。

- `dist/english-content.mjs`: 146 English titles, concise cultural guides and observation prompts, keyed by original FID or stable pottery ID.
- `dist/english-ui.mjs`: interface, source-scope, quiz and destination text mappings. Official source URLs remain unchanged.
- `dist/i18n.mjs`: language selection, reversible text/attribute rendering and dynamic count/route formatting. Values, IDs, URLs and user file names are not translated.
- `dist/content.mjs`: an English search index augments Chinese search without changing filter values or saved IDs.

英文文化导读基于同一批已引用的中文材料整理为简明导读，**不是逐句对照翻译**。不得增加中文来源未支持的疗效、历史结论、具体场次或开放入口。地区通用资料的范围、来源更正和医疗文化内容边界均有英文对应说明。

The English cultural guides are concise adaptations of the same cited Chinese material, not sentence-by-sentence translations. They retain regional source limits and distinctions between cultural information, historical evidence and medical advice.

原始机构名称以中文记录并明确标记；地图服务返回的道路专名、原始来源网页及旧Unity程序内部界面保留原语言。网页双语不会重新编译旧三维或改变第三方地图/导航平台的语言。标志中的中文是原团队设计的一部分。

Original organisation records are labelled as original Chinese. Map-provided street names, external source pages and internal legacy Unity text can remain in their original language. The website switch does not rebuild Unity or change external platforms. Chinese lettering within the logo belongs to the original team design.

维护时直接编辑上述ES模块数据及中文原内容，保留原FID、引用URL和记录ID。重新运行 `npm test`、Python测试和公开版检查。英文长词需在桌面及390px手机视口检查筛选、详情、行程和测验，不能仅检查标题。
