import express from 'express';
import travelService from '../services/travelService.js';
import { createStreamResponse } from '../utils/streamUtils.js';

const router = express.Router();

router.post('/recommend', async (req, res) => {
    const {city,budget,days} = req.body;
    if(!city || !budget || !days) {
        return res.status(400).json({
            success: false,
            message: '缺少必要参数: city, budget, days'
        })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = createStreamResponse(res)
    const result = await travelService.recommend(city,budget,days,(chunk) => {
        stream.send({type:'chunk',content: chunk})
    })
    stream.send({type:'complete',data: result})
    stream.end()
})

router.post('/chat', async (req, res) => {
    const {message} = req.body
    if(!message) {
        return res.status(400).json({
            success: false,
            message: '缺少必要参数: message'
        })
    }
    //对SSE流式接口返回进行处理
    const stream = createStreamResponse(res)

    //调用LLM获取流式响应
    const result = await travelService.chat(message,(chunk) => {
        stream.send({type:'chunk',content: chunk})
    })
    stream.send({type:'complete',data: result})
    stream.end()
})

export default router;
