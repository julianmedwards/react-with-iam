import express, { Express } from 'express'
import path from 'path'
import logger from 'morgan'
import 'dotenv/config'

const app: Express = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Auth & CORS setup
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*'])
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE')
    res.append('Access-Control-Allow-Headers', [
        'Content',
        'Content-Type',
        'Authorization',
    ])
    next()
})

// Routing & server initialization
import authRouter from './routes/auth'
import apiRouter from './routes/api'

app.use(authRouter)
app.use('/api', apiRouter)

import config from './config'

app.listen(config.port, () => {
    console.log(
        `[server]: Server is running at http://localhost:${config.port}`
    )
})

export default app
