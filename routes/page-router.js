import express from 'express'
import {PageController} from '../controllers/page-controller.js'

export const pageRouter = express.Router()
export const controller = new PageController()

pageRouter.get('/api', controller.getChartShit)
pageRouter.get('/api/all-games', controller.getAllGames)
pageRouter.get('/', controller.renderMain)
