const ALLOWED_ORIGINS = [
    process.env.FRONTEND_URL || '',
    'http://localhost:5173',
    'http://localhost:3000',
]

export function cors(req, res) {
    const origin = req.headers.origin || ''
    if (ALLOWED_ORIGINS.includes(origin) || !process.env.FRONTEND_URL) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*')
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.status(204).end()
        return true
    }
    return false
}
