import express from 'express'
import http from 'http'
import errorhandler from 'errorhandler'
import config from '../config'
import bodyParser from 'body-parser'
import routes from './routes'
import path from 'path'
import webpack from './webpack'

const app = express()
app.set('port', config.get('port'))

// webpack(app)

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('public'))

app.use('/api', routes)

app.get(/.*/, (req, res) => {
    res.sendFile(
    	path.resolve(__dirname, '../public/index.html')
	)
})

if (process.env.NODE_ENV === 'development') {
    // attach errorHandler only for development
    app.use(errorhandler())
}

const server = http.createServer(app)
server.listen(app.get('port'), function () {
    console.log('Start server on port ' + app.get('port'))
})