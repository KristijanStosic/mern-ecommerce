require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const colors = require('colors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(
  fileUpload({
    useTempFiles: true,
  })
)

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))

// Connect to MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      throw new Error(
        `Connection to MongoDB failed:${err.message}`.red.underline.bold
      )
      process.exit(1)
    } else {
      console.log(`MongoDB Connected`.cyan.underline)
    }
  }
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
  })
}

app.get('/', (req, res) => {
  res.send(`API is running...`)
})

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
