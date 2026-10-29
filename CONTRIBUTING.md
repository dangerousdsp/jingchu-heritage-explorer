# 参与改进 / Contributing

欢迎通过Issue报告界面问题、失效来源、目的地地址更正或可复现的故障。请写明浏览器、版本、步骤、预期行为和实际结果；截图中不要包含私人信息。内容更正应附可核查的官方或一手来源，标注地区及适用范围。

Please use Issues for interface bugs, broken source links, destination corrections or reproducible failures. Include browser/version, steps, expected behaviour and actual behaviour. Remove private information from screenshots. Content corrections should include a verifiable primary or official source and its regional scope.

## 开发 / Development

无需安装前端依赖；使用Python启动本地服务，Node执行 `npm test`，Python执行 `python -m unittest discover -s tests -p "test_*.py"`。公开版通过 `python scripts/package_release.py --public --output output/review-site` 生成，并用 `python scripts/check_release.py output/review-site` 检查。已存在的输出目录不会被覆盖。

No frontend dependency installation is needed. Run the local server with Python, execute `npm test` with Node and run the Python unittest command above. Generate a public preview with the packaging command and validate it with `check_release.py`. Existing output directories are preserved.

保持原ID、地区子项和来源可追溯性。不要提交原Unity导出、恢复目录、原工作簿、原视频、访问密钥或个人运行记录。提交新资产时写明来源及许可范围；参见LICENSE_SCOPE.md。当前未选定统一开源许可证，提交贡献不会自动将所有项目资源重新授权。

Keep IDs, regional records and source traceability intact. Do not commit the original Unity export, recovery folders, workbook, archived video, secrets or personal runtime records. Document the source and permissions of new assets; see LICENSE_SCOPE.md. Contributions do not automatically relicense other project resources.
