# 校园服务与个人生活中心

## 项目简介

以「校园服务与个人生活中心」为主题的综合信息展示站点，分为两大板块：

- **校园公共服务**：自习室查询、图书馆数据、社团风采
- **个人服务**：课程表、歌手数据看板、个人简介、三维生活宇宙、风景展示、留言反馈

## 技术栈

- HTML + CSS + JavaScript
- Bootstrap 5（响应式布局）
- jQuery 3.7.1（DOM 操作）
- ECharts 5（柱状图、饼状图、图表联动）
- Three.js + OrbitControls（三维场景）
- Python 内置 http.server（本地接口服务）

## 页面结构

| 页面 | 文件 | 说明 |
| 首页 | index.html | 统一入口与导航，含断网提示 |
| 课程表 | courses.html + courses.js | 课程增删/筛选/搜索/双击改名（localStorage） |
| 留言反馈 | sub.html | 反馈表单，原生校验 |
| 个人简介 | about.html | 照片、爱好、常用链接 |
| 歌手数据看板 | singer.html + singer.js | 歌曲播放/收藏数据，ECharts 柱状图+饼图联动 |
| 生活宇宙 | sun.html + sun.js | Three.js 三维星球（任务/学习/课程/留言） |
| 风景展示 | view.html | 校园历史建筑图片 |
| 社团风采 | group.html | Bootstrap 卡片展示 |

## 运行说明

### 方式一：启动接口服务器（推荐，支持跨电脑访问）

1. 确保已安装 Python 3
2. 在项目根目录打开命令行，执行：
   python server.py
3. 浏览器打开：
   - 本机：http://localhost:8000
   - 同局域网其他电脑：http://<本机IP>:8000
4. 自习室数据接口：http://<本机IP>:8000/api/rooms

### 方式二：直接打开（仅限本机查看，自习室接口不可用）

双击 `index.html` 即可，但自习室模块的数据接口无法调用。

## 接口说明

### 自习室数据接口

- **路径**：`/api/rooms`
- **方法**：GET
- **返回**：JSON，包含自习室列表
- **跨域**：已设置 `Access-Control-Allow-Origin: *`，其他电脑可直接调用


## 功能亮点

1. **响应式布局**：Bootstrap 栅格系统，适配手机与桌面
2. **JSON 数据加载**：自习室数据通过 `/api/rooms` 接口获取
3. **双图表联动**：柱状图点击联动饼图高亮
4. **三维展示**：Three.js 实现星球轨道动画
5. **离线提示**：断网时显示警告条
6. **本地存储**：课程数据保存在 localStorage

## 资源来源

| 资源 | 来源 |
| Bootstrap 5 | 本地 libs/ |
| jQuery 3.7.1 | 本地 libs/ |
| ECharts 5 | 本地 libs/ |
| Three.js | 本地 libs/ |
| 图片 | images/，网上查找，不作商业用途 |