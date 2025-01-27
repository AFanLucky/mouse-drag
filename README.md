# AI 图片分析框选工具

这是一个基于 Next.js 14 构建的 AI 图片分析框选工具，框选所需的图片位置，并导出数据。

## 项目简介

本项目是一个轻量级的 AI 图片分析框选工具，为AI分析图片提供数据。图片上传使用，图片上传使用的是[imgbb](https://imgbb.com/)，可以会有网络问题，建议多试几次。

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- CSS Modules

## 开始使用

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装步骤

1. 克隆仓库
```bash
git clone [仓库地址]
cd ai-chat-app
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
```
编辑 `.env.local` 文件，配置必要的环境变量。

4. 运行开发服务器
```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 项目结构

```
├── app/
│   ├── lib/          
│   │   ├── constant.ts   # 常量定义
│   │   └── useCreate.tsx # 对话创建相关 Hook
│   ├── page.tsx      # 主页面
│   ├── layout.tsx    # 应用布局
│   └── globals.css   # 全局样式
├── public/           # 静态资源
└── next.config.ts    # Next.js 配置
```

## 开发指南

### 主要文件说明

- `app/page.tsx`: 主页面组件，包含图片框选实现
- `app/lib/useCreate.tsx`: 处理图片框选的核心逻辑
- `app/lib/constant.ts`: 定义项目常量和配置
- `app/globals.css`: 全局样式定义

### 自定义开发

1. 修改图片框选：编辑 `app/page.tsx` 和 `app/page.module.css`
2. 调整图片框选逻辑：修改 `app/lib/useCreate.tsx`
3. 更新配置项：编辑 `app/lib/constant.ts`

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解更多详情。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
