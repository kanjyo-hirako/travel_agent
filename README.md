<div align="center">

# 智能旅游助手 Travel Agent

**基于 AI 的智能景点介绍与行程规划系统**

![Vue](https://img.shields.io/badge/Vue%203-3.5.34-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vant](https://img.shields.io/badge/Vant%204-4.9.24-1989FA?style=flat-square&logo=vant&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1.1.48-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
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
| **热门城市推荐** | 首页展示热门目的地，一键选择 |
| **快捷问题引导** | 对话页提供常见旅游问题标签，快速提问 |
| **移动端适配** | 基于 Vant 组件库，专为移动端优化的 UI |
| **多模型支持** | 后端支持 DeepSeek / SiliconFlow 等 OpenAI 兼容接口 |

---

## 技术栈

### 前端 `travel_agent_fronted`

| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue 3** | 3.5.34 | 核心框架，使用 Composition API |
| **Vite** | 8.0.12 | 构建工具，快速开发与打包 |
| **Vue Router** | 5.0.7 | 路由管理，支持 History 模式 |
| **Vant 4** | 4.9.24 | 移动端 UI 组件库 |
| **Axios** | 1.16.1 | HTTP 请求封装 |
| **Fetch API** | - | SSE 流式数据接收 |

### 后端 `travel_server`

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | - | 运行时环境 |
| **Express** | 4.19.2 | Web 框架 |
| **LangChain** | 1.1.48 | LLM 编排框架 |
| **@langchain/openai** | 1.4.7 | OpenAI 兼容接口适配器 |
| **dotenv** | 16.4.5 | 环境变量管理 |
| **cors** | 2.8.6 | 跨域资源共享 |
| **nodemon** | 3.1.14 | 开发热重载 |

---

## 项目结构

```
travel_agent/
├── README.md                          # 项目说明文档
└── code/
    ├── travel_agent_fronted/          # 前端项目 (Vue 3 + Vite)
    │   ├── index.html                 # 入口 HTML
    │   ├── package.json               # 依赖配置
    │   ├── vite.config.js             # Vite 配置（含 Vant 自动导入）
    │   ├── public/
    │   │   ├── favicon.svg
    │   │   └── icons.svg
    │   └── src/
    │       ├── main.js                # 应用入口
    │       ├── App.vue                # 根组件（Tabbar 布局）
    │       ├── router/
    │       │   └── index.js           # 路由配置
    │       ├── views/
    │       │   ├── Home.vue           # 首页 - 行程规划表单
    │       │   ├── Chat.vue           # AI 对话页
    │       │   ├── Detail.vue         # 行程规划详情页
    │       │   └── Profile.vue        # 个人中心
    │       ├── components/
    │       │   ├── ChatBubble.vue     # 聊天气泡组件
    │       │   ├── BudgetTable.vue    # 预算明细表格
    │       │   └── SpotItem.vue       # 景点信息卡片
    │       ├── utils/
    │       │   └── request.js         # Axios 封装 + SSE 流式请求
    │       ├── styles/
    │       │   └── common.css         # 全局通用样式
    │       └── assets/                # 静态资源
    │
    └── travel_server/                 # 后端项目 (Node.js + Express)
        ├── package.json               # 依赖配置
        ├── nodemon.json               # 热重载配置
        ├── .env                       # 环境变量（API Key 等）
        └── src/
            ├── index.js               # 服务入口（Express 启动）
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

## 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器 (移动端)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │
│  │  Home    │  │  Chat    │  │  Detail  │  │ Profile │  │
│  │  首页     │  │  对话     │  │  详情     │  │  我的    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────────┘  │
│       │             │              │                      │
│       │    Axios / Fetch(SSE)      │                      │
└───────┼─────────────┼──────────────┼──────────────────────┘
        │             │              │
        ▼             ▼              ▼
┌─────────────────────────────────────────────────────────┐
│              Express Server (:3300)                       │
│  ┌─────────────────────────────────────────────────┐     │
│  │              travelRouter                        │     │
│  │   POST /api/travel/recommend  → 行程规划          │     │
│  │   POST /api/travel/chat       → AI 对话 (SSE)    │     │
│  └─────────────────────┬───────────────────────────┘     │
│                        │                                  │
│  ┌─────────────────────▼───────────────────────────┐     │
│  │              TravelService                       │     │
│  │   recommend()  → LLM 生成 JSON 行程               │     │
│  │   chat()       → LLM 流式对话                     │     │
│  └─────────────────────┬───────────────────────────┘     │
│                        │                                  │
│  ┌─────────────────────▼───────────────────────────┐     │
│  │   LangChain + ChatOpenAI                         │     │
│  │   (DeepSeek / SiliconFlow / OpenAI 兼容接口)      │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 核心流程

#### 行程规划流程
```
用户输入(城市/预算/天数) → Home.vue 表单提交 → 路由跳转 Detail.vue
→ POST /api/travel/recommend → TravelService.recommend()
→ LangChain 调用 LLM → 解析 JSON 响应 → 返回结构化行程数据
→ Detail.vue 渲染行程卡片 + 预算表格 + 注意事项
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

在 `code/travel_server/.env` 文件中配置以下变量：

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

---

## 页面预览

| 页面 | 路由 | 说明 |
|------|------|------|
| **首页** | `/` | 目的地选择、预算/天数输入、热门城市推荐 |
| **行程详情** | `/detail` | 多日行程展示、每日时间段安排、预算明细、温馨提示 |
| **AI 对话** | `/chat` | 实时流式对话、快捷问题标签、消息气泡展示 |
| **个人中心** | `/profile` | 用户信息、收藏/历史（预留）、关于我们 |

---

<div align="center">

**智能旅游助手** — 让 AI 为你的每一次旅行精心规划

Made with Vue 3 + Node.js + LangChain

</div>
