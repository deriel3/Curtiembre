const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path=require('path')

//Configuracion del servidor
const app = express()
app.use('/assets',express.static(path.join(__dirname,'assets')))
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.use('/api',require('./routes/index'));

app.listen(process.env.PORT || 3000)