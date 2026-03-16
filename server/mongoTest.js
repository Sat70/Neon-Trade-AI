
require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neontrade'

mongoose
  .connect(uri)
  .then(() => {
    console.log('MongoDB local connection OK ✅')
    process.exit(0)
  })
  .catch((err) => {
    console.error('MongoDB local connection failed ❌', err.message)
    process.exit(1)
  })
