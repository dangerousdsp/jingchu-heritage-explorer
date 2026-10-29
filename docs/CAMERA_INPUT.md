# 漫游相机与输入核查

日期：2026-10-29，网页修订0.4.3。原始Unity导出未修改，未安装Unity。

## 已确认的事实

原备份 il2cppOutput/Assembly-CSharp28.cpp 中 StarterAssetsInputs.LookInput 的实现先检查 Mouse.current.rightButton.isPressed：按住右键才写入鼠标look向量，否则把look置零。这解释了只移动鼠标时视角保持原方向的设计。

原漫游场景 level5 的 PlayerArmature 挂有启用的 PlayerInput、StarterAssetsInputs 与 ThirdPersonController；PlayerFollowCamera 使用 CinemachineVirtualCamera、Cinemachine3rdPersonFollow，MainCamera挂有CinemachineBrain。

本轮直接从WebGL压缩包只读提取相关UnityFS数据块，核对序列化参数（本地证据 qa/camera_scene_evidence.json）：

- cursorInputForLook = true，鼠标视角输入开启。
- cursorLocked = false，默认不锁鼠标。
- LockCameraPosition = false，控制器未开启固定视角。
- 俯仰上限70度，下限-30度。

C++代码来自Windows备份；WebGL本轮直接确认了相同控制组件及上述配置。配置和源码检查不是对所有浏览器实际输入的完整运行验收。

## 0.4.3网页输入适配

用户提供的运行截图出现跨越画布的蓝色轨迹和“无效手势”，符合宿主浏览器右键手势表现；页面contextmenu拦截无法保证拦截浏览器自身手势，0.4.2只提示右键不足以解决此冲突。

默认勾选“左键环视”。适配器在Unity初始化前注册window捕获监听，只在戏台漫游且开启环视时接管画布左键按下，转换为button=2、buttons=2的MouseEvent。拖动保留坐标和movementX/Y，松开转换为右键抬起。原始左键事件不再进入Unity，避免同时点击场景UI；转换事件有独立标记，不会递归转换。用户实际按的是左键，无需触发宿主右键手势。

需要点击旧程序的设置、Tips、＋/−按钮时取消勾选，恢复原始鼠标事件；其它三维展品不映射左键。窗口失焦、Esc、指针取消、页面隐藏、切换模式或场景、结束实例时释放映射按键，避免卡住。保留画布聚焦、contextmenu与聚焦漫游的键盘滚动保护。

静态核对实际WebGL framework中的registerMouseEventCallback/fillMouseEventData：处理mousedown/mousemove/mouseup，读取button/buttons和movementX/Y，未检查isTrusted。该结果说明网页事件适配有代码依据，不等于对所有浏览器兼容性作保证。MouseEvent中的buttons是按位状态，右键为2，参见[MDN buttons](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)。合成事件不是原生可信事件，参见[MDN isTrusted](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted)。未修改、解压覆盖或重新编译原始Unity构建。

7项输入自动测试覆盖下压/位移/抬起映射、范围限制、交互模式、画布外释放、失焦/取消/隐藏/Esc、模式/场景切换以及解绑清理。浏览器运行结果另见VALIDATION.md。

## 第一/第三人称切换

当前场景明确使用第三人称方案，未发现可直接由网页调用的第一/第三人称切换入口。现有SendMessage桥接只能调用旧构建已包含的方法，不能新增C#逻辑或直接写入任意相机字段。

可落地的实现有两条：

1. 恢复可编辑Unity工程，增加相机模式控制器，统一鼠标输入与角色朝向，设置第一人称头部位置和第三人称跟随距离，处理人物模型遮挡、相机碰撞和返回UI，再重新导出WebGL。这是保留原场景交互的优先路线。
2. 继续不安装Unity，将可恢复模型与场景迁移到可编辑的网页三维模块，使用浏览器三维引擎实现两种相机与切换，并逐步迁移旧互动。这需要场景迁移和交互重写，不能仅改网页按钮。

如果左键适配仍无法转动，需要继续定位WebGL输入事件/动作绑定或运行时卡顿；原场景物理问题仍可能影响响应。
