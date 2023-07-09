import minifyCode from 'utils/minify';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code, type } = req.body

    if (!code || !type) {
      return res.status(400).json({ error: 'Invalid code or type' });
    }

    const initialLength = code.length

    try {
      const minifiedCode = minifyCode(code, type)
      const finalLenght = minifiedCode.length
      const savedPercentile = (((initialLength - finalLenght ) / initialLength ) * 100).toFixed(1)
      return res.status(200).json({minifiedCode, savedPercentile})
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
