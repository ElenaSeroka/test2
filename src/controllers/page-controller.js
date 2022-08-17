// @ts-nocheck
import { Client } from '@elastic/elasticsearch'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

/**
 *
 */
export default class PageController {
  /** Hello.
   *
   */

  /**
   * Renders the main page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */

  /**
   * Atgywwhujik 23.
   */
  async renderMain () {
    console.log('renderMain func')

    const client = await new Client({
      node: process.env.NODE_URL,
      auth: {
        username: process.env.USER_NAME,
        password: process.env.PASSWORD
      }
    })
    // The following code adds data to the elastic search. Only run this once!  
    // await addToDB(client)

    // const searchResults = await client.search({
    //   'size': 100,
    //   "query": {
    //     "match_all": {}
    //   }
    // })


    let keyword = 'sonic'
    //   Let's search!
    // detta ska in i express appen. conmect. ny connect varje gång
    const searchResults = await client.search({
      index: 'games',
      query: {
        match: { Title: `${keyword}` }
      }
    })
    console.log(searchResults.hits.hits)

    console.log(searchResults.hits.hits.length)
  }
}
