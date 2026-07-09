<div align="center">

# 智能旅游助手 Travel Agent

**基于 AI 的智能景点介绍与行程规划系统**<br/>
**已在 Vercel 上部署，直接访问 -> https://travel-agent-two-lovat.vercel.app/**

![Vue](https://img.shields.io/badge/Vue%203-3.5.34-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vant](https://img.shields.io/badge/Vant%204-4.9.24-1989FA?style=flat-square&logo=vant&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1.1.48-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

<br/>

<img src="code/travel_agent_fronted/src/assets/hero.png" alt="Travel Agent Hero" width="400" />

</div>

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [部署方式](#部署方式)
- [架构设计](#架构设计)
- [API 接口](#api-接口)
- [环境变量配置](#环境变量配置)
- [页面预览](#页面预览)

---

## 项目简介

**智能旅游助手** 是一个前后端分离的 AI 旅游规划应用。用户只需输入目的地城市、预算和出行天数，系统即可通过大语言模型（LLM）自动生成详细的旅行行程规划，包括每日景点安排、预算明细、交通建议等。同时提供 AI 对话功能，用户可以随时向旅游助手咨询问题，获得实时流式回复。

---

## 功能特性

| 功能 | 说明 |
|------|------|
| **智能行程规划** | 输入城市、预算、天数，AI 自动生成多日行程 |
| **景点详情展示** | 每个景点包含名称、游览时长、门票价格、交通方式、简介 |
| **预算明细** | 自动拆分住宿、餐饮、交通、门票等费用 |
| **AI 流式对话** | 支持与 AI 助手实时对话，采用 SSE 流式输出 |
| **地图可视化** | 集成高德地图，每日行程景点标注在地图上，连线展示游览路线 |
| **一键导航** | 点击地图标记可调起高德地图 App 导航（移动端），桌面端跳转网页版 |
| **热门城市推荐** | 首页展示热门目的地，一键选择 |
| **快捷问题引导** | 对话页提供常见旅游问题标签，快速提问 |
| **移动端适配** | 基于 Vant 组件库，专为移动端优化的 UI |
| **多模型支持** | 后端支持 DeepSeek / SiliconFlow 等 OpenAI 兼容接口 |
| **收藏功能** | 支持收藏行程方案、景点和 AI 对话回复 |
| **历史记录** | 自动记录行程规划和对话历史，支持查看详情 |
| **3D 地球开屏** | Three.js 线框地球动画作为加载页，带进度条和平滑过渡 |
| **本地登录** | 基于 localStorage 的简单用户系统，支持头像上传 |

---

## 技术栈

### 前端 `code/travel_agent_fronted`

| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue 3** | 3.5.34 | 核心框架，使用 Composition API |
| **Vite** | 8.0.12 | 构建工具，快速开发与打包 |
| **Vue Router** | 5.0.7 | 路由管理，支持 History 模式 |
| **Vant 4** | 4.9.24 | 移动端 UI 组件库 |
| **Axios** | 1.16.1 | HTTP 请求封装 |
| **Fetch API** | - | SSE 流式数据接收 |
| **@amap/amap-jsapi-loader** | ^1.0.1 | 高德地图 JS SDK 加载器 |
| **Three.js** | - | 3D 地球开屏动画（通过 CDN 引入） |

### 后端（本地开发）`code/travel_server`

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | >= 18 | 运行时环境 |
| **Express** | 4.19.2 | Web 框架 |
| **LangChain** | 1.1.48 | LLM 编排框架 |
| **@langchain/openai** | 1.4.7 | OpenAI 兼容接口适配器 |
| **dotenv** | 16.4.5 | 环境变量管理 |
| **cors** | 2.8.6 | 跨域资源共享 |
| **nodemon** | 3.1.14 | 开发热重载 |

### 后端（生产环境）`api/`

| 技术 | 用途 |
|------|------|
| **Vercel Serverless Functions** | 生产环境部署，每个端点独立函数 |
| **LangChain + @langchain/openai** | LLM 编排（同本地开发） |
| **自定义 CORS 中间件** | 跨域处理（`api/_lib/cors.js`） |
| **IP 限流** | 15 次/分钟的请求频率限制（`api/_lib/rateLimit.js`） |

---

## 项目结构

```
travel_agent/
├── README.md                          # 项目说明文档
├── package.json                       # 根级依赖（LangChain，供 API 层使用）
├── vercel.json                        # Vercel 部署配置
├── plan.md                            # 功能路线图 / 开发计划
│
├── api/                               # Vercel Serverless Functions（生产环境）
│   ├── heartbeat.js                   # 健康检查端点
│   ├── _lib/
│   │   ├── cors.js                    # CORS 中间件
│   │   ├── rateLimit.js               # IP 限流（15 次/分钟）
│   │   └── travelService.js           # LLM 业务逻辑（Serverless 版）
│   └── travel/
│       ├── chat.js                    # POST /api/travel/chat（SSE 流式）
│       └── recommend.js              # POST /api/travel/recommend
│
└── code/
    ├── travel_agent_fronted/          # 前端项目 (Vue 3 + Vite)
    │   ├── index.html                 # 入口 HTML（含 3D 地球开屏动画）
    │   ├── package.json               # 依赖配置
    │   ├── vite.config.js             # Vite 配置（含 Vant 自动导入、API 代理）
    │   ├── .env                       # 高德地图 API Key
    │   ├── public/
    │   │   ├── favicon.svg
    │   │   └── icons.svg
    │   └── src/
    │       ├── main.js                # 应用入口
    │       ├── App.vue                # 根组件（Tabbar 布局）
    │       ├── amap-config.js         # 高德地图 API Key 配置
    │       ├── router/
    │       │   └── index.js           # 路由配置（7 个路由）
    │       ├── views/
    │       │   ├── Home.vue           # 首页 - 行程规划表单
    │       │   ├── Chat.vue           # AI 对话页
    │       │   ├── Detail.vue         # 行程规划详情页（含地图）
    │       │   ├── Profile.vue        # 个人中心
    │       │   ├── Login.vue          # 登录页
    │       │   ├── Favorites.vue      # 收藏页面
    │       │   └── History.vue        # 历史记录页面
    │       ├── components/
    │       │   ├── ChatBubble.vue     # 聊天气泡组件（含收藏）
    │       │   ├── BudgetTable.vue    # 预算明细表格
    │       │   ├── MapView.vue        # 高德地图组件（标记 + 路线 + 导航）
    │       │   └── SpotItem.vue       # 景点信息卡片（含收藏）
    │       ├── utils/
    │       │   ├── request.js         # Axios 封装 + SSE 流式请求
    │       │   └── auth.js            # 登录、收藏、历史记录（localStorage）
    │       ├── styles/
    │       │   └── common.css         # 全局通用样式
    │       └── assets/                # 静态资源
    │
    └── travel_server/                 # 后端项目（本地开发，Node.js + Express）
        ├── package.json               # 依赖配置
        ├── nodemon.json               # 热重载配置
        └── src/
            ├── index.js               # 服务入口（Express 启动，端口 3300）
            ├── routes/
            │   └── travel.js          # 路由定义
            ├── services/
            │   └── travelService.js   # 核心业务逻辑（LangChain 调用）
            └── utils/
                └── streamUtils.js     # SSE 流式响应工具
```

---

## 快速开始

### 环境要求

- **Node.js** >= 18.x
- **npm** >= 9.x

### 1. 启动后端服务

```bash
cd code/travel_server

# 安装依赖
npm install

# 配置环境变量（见下方说明）
# 编辑 .env 文件，填入 API Key

# 启动开发服务器
npm run dev
```

后端默认运行在 `http://localhost:3300`

### 2. 启动前端项目

```bash
cd code/travel_agent_fronted

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端默认运行在 `http://localhost:5173`

### 3. 访问应用

打开浏览器访问 `http://localhost:5173`，即可开始使用。

---

## 部署方式

### Vercel 生产部署

项目已部署在 Vercel 上，通过 `vercel.json` 配置：

- **构建命令**：`cd code/travel_agent_fronted && npm install && npm run build`
- **输出目录**：`code/travel_agent_fronted/dist`
- **API 部署**：`api/` 目录下的文件自动部署为 Vercel Serverless Functions
- **路由重写**：所有 `/api/*` 请求转发到对应的 Serverless Function

### 本地开发

本地开发时使用 `code/travel_server/` 下的 Express 服务器，前端通过 `vite.config.js` 中的代理配置将 `/api` 请求转发到 `localhost:3300`。

---

## 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器 (移动端)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐   │
│  │  Home    │  │  Chat    │  │  Detail  │  │ Profile │   │
│  │  首页    │  │  对话     │  │  详情    │  │  我的   │    │
│  │          │  │          │  │ +地图导航 │  │         │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────────┘   │
│       │             │             │                      │
│       │    Axios / Fetch(SSE)     │                      │
│       │             │             │  高德地图 JS SDK      │
└───────┼─────────────┼─────────────┼──────────────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│         Express Server (:3300) / Vercel Serverless       │
│  ┌─────────────────────────────────────────────────┐     │
│  │              travelRouter                       │     │
│  │   POST /api/travel/recommend  → 行程规划         │     │
│  │   POST /api/travel/chat       → AI 对话 (SSE)   │     │
│  │   POST /api/heartbeat         → 健康检查         │     │
│  └─────────────────────┬───────────────────────────┘     │
│                        │                                 │
│  ┌─────────────────────▼───────────────────────────┐     │
│  │              TravelService                       │    │
│  │   recommend()  → LLM 生成 JSON 行程               │    │
│  │   chat()       → LLM 流式对话                     │    │
│  └─────────────────────┬───────────────────────────┘     │
│                        │                                 │
│  ┌─────────────────────▼───────────────────────────┐     │
│  │   LangChain + ChatOpenAI                         │    │
│  │   (DeepSeek / SiliconFlow / OpenAI 兼容接口)      │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 核心流程

#### 行程规划流程
```
用户输入(城市/预算/天数) → Home.vue 表单提交 → 路由跳转 Detail.vue
→ POST /api/travel/recommend → TravelService.recommend()
→ LangChain 调用 LLM → 解析 JSON 响应 → 返回结构化行程数据
→ Detail.vue 渲染行程卡片 + 预算表格 + 注意事项
→ MapView 组件调用高德地图 API 标注景点 + 绘制路线
```

#### AI 对话流程
```
用户输入问题 → Chat.vue 发送消息 → fetchStream() 建立 SSE 连接
→ POST /api/travel/chat → TravelService.chat()
→ LangChain 流式调用 LLM → 逐 chunk 通过 SSE 推送
→ 前端实时拼接并渲染 ChatBubble
```

---

## API 接口

### 基础地址

```
http://localhost:3300/api/travel
```

### 1. 行程规划

```
POST /api/travel/recommend
```

**请求体：**
```json
{
    "city": "北京",
    "budget": 5000,
    "days": 3
}
```

**响应示例：**
```json
{
    "success": true,
    "city": "北京",
    "days": 3,
    "totalBudget": 5000,
    "dailyItinerary": [
        {
            "day": 1,
            "date": "第1天",
            "morning": {
                "spot": "天安门广场",
                "duration": "2小时",
                "ticket": "免费",
                "transportation": "地铁1号线",
                "description": "..."
            },
            "afternoon": { ... },
            "evening": { ... }
        }
    ],
    "budgetBreakdown": {
        "accommodation": 1500,
        "food": 1200,
        "transportation": 800,
        "tickets": 1000,
        "other": 500
    },
    "tips": ["建议提前预约故宫门票...", ...],
    "warnings": ["注意防晒...", ...]
}
```

### 2. AI 对话（SSE 流式）

```
POST /api/travel/chat
```

**请求体：**
```json
{
    "message": "北京有哪些必去的景点？"
}
```

**SSE 响应格式：**
```
data: {"type":"chunk","content":"北京"}

data: {"type":"chunk","content":"有很"}

data: {"type":"chunk","content":"多著名的景点..."}

data: {"type":"complete","data":{"success":true,"reply":"..."}}

data: {"done":true}
```

### 3. 健康检查

```
POST /api/heartbeat
```

---

## 环境变量配置

### 后端 `code/travel_server/.env`

```env
# 服务端口
PORT=3300

# 模型提供商: DEEPSEEK 或 SILICONFLOW
MODEL_PROVIDER=DEEPSEEK

# DeepSeek 配置
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# SiliconFlow 配置（备选）
SILICONFLOW_API_KEY=your_siliconflow_api_key
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen2.5-7B-Instruct
```

> **说明：** 后端通过 LangChain 的 `ChatOpenAI` 类对接 LLM，任何兼容 OpenAI API 格式的服务均可接入。

### 前端 `code/travel_agent_fronted/.env`

```env
# 高德地图 API Key
VITE_AMAP_KEY=your_amap_key
VITE_AMAP_SECURITY_CODE=your_amap_security_code
```

> **说明：** 前端使用高德地图 JS SDK 进行地图展示和导航，需要在[高德开放平台](https://lbs.amap.com/)申请 Web 端 Key。Vercel 生产环境需在项目设置中配置对应的环境变量。

---

## 页面预览

| 页面 | 路由 | 说明 |
|------|------|------|
| **首页** | `/` | 目的地选择、预算/天数输入、热门城市推荐 |
| **行程详情** | `/detail` | 多日行程展示、每日时间段安排、地图可视化、一键导航、预算明细、温馨提示 |
| **AI 对话** | `/chat` | 实时流式对话、快捷问题标签、消息气泡展示 |
| **个人中心** | `/profile` | 用户信息、头像上传、收藏/历史入口 |
| **登录** | `/login` | 用户登录（基于 localStorage） |
| **我的收藏** | `/favorites` | 收藏的行程方案、景点、AI对话回复 |
| **历史记录** | `/history` | 行程规划历史、对话记录历史 |

---

<div align="center">

**智能旅游助手** — 让 AI 为你的每一次旅行精心规划

Made with Vue 3 + Node.js + LangChain + 高德地图

</div>
