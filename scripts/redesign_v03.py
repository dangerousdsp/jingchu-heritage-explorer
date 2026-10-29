"""One-time source migration from the preserved 0.2 layout to 0.3."""
from pathlib import Path
import re
P=Path(__file__).resolve().parents[1]/'dist/index.html'
s=P.read_text(encoding='utf-8')
assert 'redesign.css' not in s,'Migration already applied'
s=s.replace('<link rel="icon" href="assets/seal.svg" type="image/svg+xml">','<link rel="icon" href="assets/project-symbol.png" type="image/png">')
s=s.replace('<link rel="stylesheet" href="styles.css">','<link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="redesign.css">')
s=s.replace('荆楚拾遗','荆楚非遗').replace('走近三种荆楚技艺','走近六个荆楚非遗专题').replace('VOL. 01','VOL. 02').replace('浏览器改进版 0.2.0','浏览器改进版 0.3.0')
s=s.replace('<span class="seal" aria-hidden="true">拾<br>遗</span><span>荆楚非遗<small>HUBEI HERITAGE EXPLORER</small></span>','<img class="project-logo" src="assets/project-logo.png" width="186" height="176" alt="团队原创荆楚非遗标志"><span>云上非遗体验馆<small>JING CHU HERITAGE</small></span>')
s=s.replace('<span class="seal" aria-hidden="true">拾<br>遗</span><span>荆楚非遗<small>器物有形 · 传承无界</small></span>','<img class="project-logo" src="assets/project-logo.png" width="186" height="176" alt="荆楚非遗"><span>云上非遗体验馆<small>器物有形 · 传承无界</small></span>')
s=s.replace('<nav aria-label="主导航"><a href="#collection">展品馆</a><a href="#experience">三维漫游</a><a href="#learn">学习手记</a></nav>','<nav aria-label="主导航"><a href="#collection">非遗图鉴</a><a href="#atlas">地区导览</a><a href="#experience">三维体验</a><a href="#media">影音课堂</a><a href="#learn">学习手记</a></nav>')
s=s.replace('已读 0 / 3','已读 0 / 6').replace('全部展品 <span>03</span>','全部专题 <span>06</span>')
s=s.replace('<button class="filter" data-filter="传统美术" aria-pressed="false">传统美术</button>','<button class="filter" data-filter="传统美术" aria-pressed="false">传统美术</button><button class="filter" data-filter="传统戏剧" aria-pressed="false">传统戏剧</button><button class="filter" data-filter="传统音乐" aria-pressed="false">传统音乐</button>')
s=s.replace('<p id="collection-status"','<div class="collection-refine"><label>地区 <select id="city-filter"><option value="all">全部地区</option></select></label><label class="favorite-filter"><input type="checkbox" id="favorites-only"> 只看我的收藏</label><button class="text-link" id="clear-filters">重置筛选</button></div>\n      <p id="collection-status"')
s=s.replace('展品图取自原项目的三维演示，展示模型外观。','前三件为原项目三维模型预览；新增专题采用图形示意，资料来源可在详情中查看。')
start=s.index('    <section class="experience-section"')
end=s.index('    <section class="section wrap learning-section"',start)
sections='''    <section class="section wrap atlas-section" id="atlas" aria-labelledby="atlas-title">
      <div class="section-heading"><div><p class="eyebrow">02 / EXPLORE HUBEI</p><h2 id="atlas-title">循着地域，遇见技艺</h2></div><p>按地区发现非遗，<br>为自己安排一条云游路线。</p></div>
      <div class="atlas-layout"><div class="map-panel"><div class="map-heading"><span>湖北非遗地区导览</span><button class="text-link" id="map-reset">查看全部地区</button></div><div id="heritage-map" class="heritage-map" role="group" aria-label="湖北地市非遗导览"><p>正在准备地区导览…</p></div><p class="map-caption">标记表示专题所属地区。云游路线用于安排线上阅读与参观顺序。<a href="https://datav.aliyun.com/portal/school/atlas/area_selector" target="_blank" rel="noopener noreferrer">边界数据：阿里云 DataV ↗</a></p></div>
      <aside class="region-detail"><p class="eyebrow">REGIONAL COLLECTION</p><h3 id="region-title">从六个专题开始</h3><p id="region-summary">点击地图中的有色地区，看看它与哪项技艺相连。</p><div id="region-items"></div></aside></div>
      <div class="route-panel"><div class="route-intro"><p class="eyebrow">MY CULTURE TRAIL</p><h3>我的云游路线 <span id="route-count">0 站</span></h3><p>把感兴趣的专题加入路线，自由调整参观顺序。</p><div class="route-tools"><button class="button compact" id="suggest-route">生成一条入门路线</button><button class="text-link" id="export-route">导出路线 ↓</button></div></div><div id="route-list" class="route-list"><p class="empty-state">还没有添加站点。可以从非遗图鉴或地区导览中加入。</p></div></div>
    </section>

    <section class="experience-section" id="experience" aria-labelledby="experience-title"><div class="wrap">
      <div class="section-heading light"><div><p class="eyebrow">03 / THREE DIMENSIONAL GALLERY</p><h2 id="experience-title">让器物，从眼前走近</h2></div><p>直接选择展品或戏台，<br>用合适的比例，慢慢细看。</p></div>
      <div class="player-panel" id="player-panel"><div class="scene-toolbar"><div class="scene-tabs" role="group" aria-label="选择三维展品"><button class="scene-tab active" data-scene="2" aria-pressed="true">毛家窑陶器</button><button class="scene-tab" data-scene="3" aria-pressed="false">通山木雕</button><button class="scene-tab" data-scene="4" aria-pressed="false">曾都编钟</button><button class="scene-tab" data-scene="5" aria-pressed="false">戏台漫游</button></div><button class="theater-close" id="leave-theater" hidden>收起放大画面 ×</button></div>
      <div class="player-stage" id="player-stage"><div class="player-cover" id="player-cover"><img src="assets/project-symbol.png" class="cover-symbol" alt=""><p class="player-kicker">荆楚非遗 · 三维展馆</p><h3>选一件器物，换一个视角</h3><p>模型观赏、文化介绍与戏台互动，都从这里进入。</p><button class="button cream" id="start-player">进入三维体验 ↗</button><p class="download-note">首次需加载约 348 MiB 核心资源，建议电脑与稳定网络。</p></div>
      <div id="player-loading" class="player-loading" hidden><p class="eyebrow">正在准备展馆</p><h3 id="loading-title">连接展馆资源…</h3><progress id="load-progress" max="100" value="0" aria-label="三维资源加载进度"></progress><p id="load-detail" role="status">首次加载需要一些时间。</p><p class="download-note" id="slow-loading" hidden>资源较大，仍在准备。你可以先阅读资料，稍后继续。</p></div>
      <div id="player-error" class="player-error" hidden><h3>暂时没有打开展馆</h3><p id="error-detail" role="alert"></p><button class="button cream" id="retry-player">重新加载</button></div><div id="canvas-host" class="canvas-host" hidden></div></div>
      <div class="player-controls"><span id="player-status" role="status">尚未加载 · 已选毛家窑陶器</span><div><button id="fullscreen-player" disabled>⛶ 放大体验</button><button id="stop-player" disabled>结束体验</button></div></div></div>
      <details class="visit-guide"><summary>操作与参观提示</summary><ol><li><span>01</span><div><h3>选择与切换</h3><p>用上方四个入口直接切换展品。资料中的“三维查看”也可直接进入对应展品。</p></div></li><li><span>02</span><div><h3>展品与漫游</h3><p>展品内可点击介绍、旋转和音乐；戏台支持 WASD / 方向键移动，具体以画面内 Tips 为准。</p></div></li><li><span>03</span><div><h3>放大与返回</h3><p>放大画面后可按 Esc 或点击收起。结束体验会释放三维程序，资料和学习手记继续保留。</p></div></li></ol></details>
    </div></section>

    <section class="section wrap media-section" id="media" aria-labelledby="media-title"><div class="section-heading"><div><p class="eyebrow">04 / WATCH AND DISCOVER</p><h2 id="media-title">把乡音，留在耳边</h2></div><p>从一段戏曲影像，<br>发现声音与表演的关系。</p></div><div class="media-layout"><div><video id="heritage-video" controls preload="none" playsinline poster="assets/opera.svg" aria-label="原项目花鼓戏视频"></video><p id="video-status" role="status">视频将由你点击后加载，不随首页自动下载。</p><div class="media-controls"><button class="button compact" id="load-video">打开花鼓戏视频</button><label>播放速度 <select id="video-speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select></label></div></div><aside class="media-notes"><p class="eyebrow">听与看的线索</p><h3>先听乡音，再看表演</h3><p>留意唱词、节奏、人物动作与情绪的配合。看完后，回到花鼓戏专题，再带着自己的问题重新观看。</p><button class="text-link" data-open="opera">阅读荆州花鼓戏专题 →</button><div class="local-preview"><label for="local-video">也可以预览自己的视频</label><input id="local-video" type="file" accept="video/*"><p>所选文件仅在当前浏览器中播放。</p><button class="text-link" id="restore-video" hidden>返回项目视频</button></div></aside></div></section>

'''
s=s[:start]+sections+s[end:]
s=s.replace('03 / FIELD NOTES','05 / FIELD NOTES').replace('份资料已读 / 共 3 份','份资料已读 / 共 6 份').replace('max="3" value="0" aria-label="资料阅读进度"','max="6" value="0" aria-label="资料阅读进度"')
s=s.replace('用三个小问题，回望器物背后的技艺。','从三题入门到十题挑战，回望技艺背后的发现。')
s=s.replace('<h3>三问荆楚</h3>','<h3>知识小测</h3>')
s=s.replace('<form id="quiz-form">','<label class="quiz-mode-label">练习模式 <select id="quiz-mode"><option value="intro">三题入门</option><option value="full">十题挑战</option></select></label><form id="quiz-form">')
s=s.replace('<p id="quiz-result" class="quiz-result" role="status"></p></form>','<p id="quiz-result" class="quiz-result" role="status"></p></form><div class="quiz-history"><h4>我的练习记录 <span id="personal-best">尚无成绩</span></h4><ol id="quiz-history-list"><li>完成一次练习，记录会出现在这里。</li></ol></div>')
s=s.replace('当前浏览器中的阅读标记和答题记录','当前浏览器中的阅读标记和答题记录')
P.write_text(s,encoding='utf-8')
print('index.html migrated to 0.3')
