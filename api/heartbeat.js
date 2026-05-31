import { cors } from './_lib/cors.js'

export default function handler(req, res) {
    if (cors(req, res)) return

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    res.json({
        message: '服务正常运行',
        timestamp: new Date().toISOString()
    })
}
