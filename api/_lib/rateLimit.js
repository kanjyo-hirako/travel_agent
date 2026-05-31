const store = new Map()
const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT || '15', 10)

export function checkRateLimit(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
    const now = Date.now()
    const entry = store.get(ip)

    if (!entry || now - entry.start > WINDOW_MS) {
        store.set(ip, { start: now, count: 1 })
        return false
    }

    entry.count++
    if (entry.count > MAX_REQUESTS) {
        res.status(429).json({
            success: false,
            error: '请求过于频繁，请稍后再试'
        })
        return true
    }
    return false
}
