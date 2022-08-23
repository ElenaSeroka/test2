import express from 'express'
import { QueryAndResponseController } from '../controllers/page-controller.js'

export const pageRouter = express.Router()
export const controller = new QueryAndResponseController()

pageRouter.get('/api/games-per-year', controller.getGamesPerYear)
pageRouter.get('/api/games-all-years-JP-EU', controller.getGamesAllYearsJapanAndEurope)
pageRouter.get('/api/games-per-publisher', controller.getGameCompany)
