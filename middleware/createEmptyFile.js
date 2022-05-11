const {join, parse} = require('path')
const {writeFile} = require('fs/promises')

module.exports = async (req, res, next) => {
  const wopiStorageFolder = process.env.WOPI_STORAGE.split('/')
  const { file_id } = req.params
  const filePath = join(parse(process.cwd()).root, ...wopiStorageFolder, file_id)

  try {
    await writeFile(filePath, Buffer.from(''), {flag: 'a'})
    res.sendStatus('200')
  } catch (err) {
    console.error(err.message || err)
  }
}
