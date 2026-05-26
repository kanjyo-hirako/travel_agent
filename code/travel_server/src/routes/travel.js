import express from 'express';
const router = express.Router();

router.post('/recommend', (req, res) => {
    const {city,budget,days} = req.body;
    if(!city || !budget || !days) {
        return res.status(400).json({
            success: false,
            message: '缺少必要参数: city, budget, days'
        })
    }
    //return res.json({
    //  message: '推荐景点',
    //  timestamp: new Date().toISOString()
    //})
})

router.post('/chat', (req, res) => {
    return res.json({
        message: '聊天',
        timestamp: new Date().toISOString()
    })
})

export default router;
