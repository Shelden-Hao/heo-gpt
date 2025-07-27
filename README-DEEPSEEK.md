# SILICONFLOW API 集成指南

本文档提供了在 XIU-GPT 项目中集成和使用 SILICONFLOW API 的详细说明。

## 配置步骤

### 1. 获取 SILICONFLOW API 密钥

1. 访问 [SILICONFLOW 官网](https://www.siliconflow.cn/) 并注册账号
2. 在个人设置或 API 部分获取您的 API 密钥 [API 密钥](https://cloud.siliconflow.cn/sft-qnbt9lamox/account/ak)

![SILICONFLOW官网获取 API 密钥](https://i-blog.csdnimg.cn/direct/5db45f5db2df415097651ed864535726.png)

### 2. 配置环境变量

在项目根目录创建或编辑`.env`文件，添加以下内容：

```
SILICONFLOW_API_KEY=your_api_key_here
```

将`your_api_key_here`替换为您的实际 SILICONFLOW API 密钥。

### 3. 重启应用

配置完成后，重启开发服务器以使环境变量生效：

```bash
npm run dev
```

## 使用 SILICONFLOW 模型

### 测试 SILICONFLOW API

1. **基本测试页面**：访问`/test-openai`查看基本的 DeepSeek 模型集成测试

## 开发者信息

### 相关文件

- `lib/openai.ts`：DeepSeek API 集成的核心实现
- `app/api/chat/openai/route.ts`：处理 DeepSeek 聊天请求的 API 路由

### 相关文档

openai 规范调用大模型可以参考 deepseek文档：https://api-docs.deepseek.com/zh-cn/

也可以参考硅基流动的文档：https://docs.siliconflow.cn/cn/userguide/quickstart