import express from 'express'
import {PageController} from '../controllers/page-controller.js'

export const pageRouter = express.Router()
export const controller = new PageController()

// pageRouter.get('/api/all-games', controller.getAllGames)
pageRouter.get('/api/games-per-year', controller.getGamesPerYear)
pageRouter.get('/api/games-all-years-JP-EU', controller.getGamesAllYearsJapanAndEurope)
pageRouter.get('/api/games-per-publisher', controller.getGameCompany)
// pageRouter.get('/api/all-released-games-specific-year', controller.getAllGamesForASpecificYear)

