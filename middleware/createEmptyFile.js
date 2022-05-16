const {join} = require('path')
const {writeFile} = require('fs/promises')

module.exports = async (req, res, next) => {
  const { file_id } = req.params
  const filePath = join(process.cwd(), 'files', file_id)

  try {
    await writeFile(filePath, Buffer.from(''), {flag: 'a'})
    res.sendStatus('200')
  } catch (err) {
    console.error(err.message || err)
  }
}
