import express from 'express'
import { Router } from 'express'
import userRouter from './user'

const router: Router = express.Router()
router.use('/users', userRouter)

export default router
