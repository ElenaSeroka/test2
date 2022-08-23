import express from 'express'
import dotenv from 'dotenv'
import { pageRouter } from './page-router.js'

dotenv.config()
const router = express.Router()

router.use('/', pageRouter)

export default router
