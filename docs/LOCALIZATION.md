# 网页双语 / Website localisation

语言选择支持 `?lang=zh`、`?lang=en` 和浏览器偏好记忆。切换不会清空阅读、收藏、行程或测验记录。

- `english-content.mjs`：146条英文标题、导读与观察点。
- `english-ui.mjs`、`i18n.mjs`：界面文字、可逆翻译与动态数字格式。
- `photo-data.mjs`：图片的中英文主题和适用范围。
- `content.mjs`：中文与英文搜索，保留稳定ID及原筛选值。

English guides use the same cited cultural sources. Keep source URLs, cultural scope and stable record IDs when editing. The original organisation records and external platforms retain their own languages.

维护时检查桌面与390px手机尺寸中的筛选、地图弹窗、图集、详情、路线与测验。运行JavaScript及Python测试，再校验发布包。
