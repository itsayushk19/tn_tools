import beautifyCode from 'utils/beautify.js'

let requestCounter = 0;

export default async function handler(req, res) {
  const requestId = (++requestCounter).toString().padStart(4, '0')
  if (req.method === 'POST') {
    const { code, type } = req.body

    if (!code || !type) {
      return res.status(400).json({ error: 'Invalid code or type' });
    }

    const initialLength = code.length

    try {
      const prettyCode = await beautifyCode(code, type)
      const finalLength = prettyCode.length
      const expandPercentile = ((( finalLength-initialLength) / finalLength ) * 100).toFixed(1)
      return res.status(200).json({prettyCode, expandPercentile})
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
