import { cors } from '../_lib/cors.js'
import { checkRateLimit } from '../_lib/rateLimit.js'
import { travelService } from '../_lib/travelService.js'

export default async function handler(req, res) {
    if (cors(req, res)) return
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    if (checkRateLimit(req, res)) return

    const { message } = req.body
    if (!message) {
        return res.status(400).json({
            success: false,
            error: '缺少必要参数: message'
        })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const result = await travelService.chat(message, (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`)
    })

    res.write(`data: ${JSON.stringify({ type: 'complete', data: result })}\n\n`)
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    res.end()
}
