import { cors } from '../_lib/cors.js'
import { checkRateLimit } from '../_lib/rateLimit.js'
import { travelService } from '../_lib/travelService.js'

export default async function handler(req, res) {
    if (cors(req, res)) return
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    if (checkRateLimit(req, res)) return

    const { city, budget, days } = req.body
    if (!city || !budget || !days) {
        return res.status(400).json({
            success: false,
            error: '缺少必要参数: city, budget, days'
        })
    }

    const result = await travelService.recommend(city, budget, days)
    res.json(result)
}
