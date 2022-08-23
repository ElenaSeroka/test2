import express from 'express'
import ElasticSearchControllerController from '../controllers/elastic-search-controller.js'

export const pageRouter = express.Router()
export const controller = new ElasticSearchControllerController()

pageRouter.get('/', controller.renderMain)
