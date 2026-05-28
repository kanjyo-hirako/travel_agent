import express from 'express';
import travelRouter from './routes/travel.js';
import 'dotenv/config'
import cors from 'cors';

const app = express();
const port = process.env.PORT;

// 允许跨域请求
app.use(cors());
// 解析请求体中的 URL 编码数据
app.use(express.urlencoded({ extended: true }));
// 解析请求体中的 JSON 数据
app.use(express.json());

app.post('/api/heartbeat', (req, res) => {
    console.log(req.query)
    console.log(req.body)
    res.json({
        message: '服务正常运行',
        timestamp: new Date().toISOString()
    })
})

app.use('/api/travel', travelRouter);

app.listen(port, () => {
    console.log(`服务地址: http://localhost:${port}`)
})