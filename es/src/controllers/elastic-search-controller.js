// @ts-nocheck
import { Client } from '@elastic/elasticsearch'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

/**
 *
 */
export default class ElasticSearchControllerController {
  /**
   * Populates Elastic Search EC2 instance with data. Test data.
   */

  /**
   * Renders the main page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */

  /**
   * The only endpoint controller in the application.
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

    const defaultSize = 5000

    //   Let's search!
    // detta ska in i express appen sen. ny connect varje search
    const searchResults = await client.search({
      size: defaultSize,
      index: 'games',

      // test query for att se att elastic snurrar
      query: {
        bool: {
          must: [
            {
              match: {
                JP: 'Unreleased'
              }
            },
            {
              range: {
                Firstreleased: {
                  gte: '2000-01-01',
                  lte: '2020-01-01'
                }
              }
            }
          ]
        }
      }
    })
    console.log(searchResults.hits.hits)

    console.log(searchResults.hits.hits.length)
  }
}

/** Adds data to the elastic search. Only run this once!
 *
 * @param { Client } client The client created in page-controller.js.
 */
// this is here to show how to use the elastic search client to populate a query bank.
// eslint-disable-next-line no-unused-vars
async function addToDB (client) {
  let gameObject
  const csv = fs.readFileSync('playstation2_games.csv')
  const gamearray = csv.toString().split('\n')
  const gameArrayNoHeader = gamearray.slice(1)
  const gamesData = []

  for (let j = 0; j < gameArrayNoHeader.length; j++) {
    const game = gameArrayNoHeader[j].split(',')
    game.push(j)
    for (let index = 1; index < game.length; index++) {
      gameObject = {
        Id: game[0],
        Title: game[1],
        Publisher: game[3],
        Firstreleased: game[4],
        JP: game[5],
        EUPAL: game[6]
      }
    }
    gamesData.push(gameObject)
  }
  //   Let's start by indexing some data
  for (let index = 0; index < gamesData.length; index++) {
    const element = gamesData[index]
    await client.index({
      index: 'games',
      document: {
        Id: element.Id,
        Title: element.Title,
        Publisher: element.Publisher,
        Firstreleased: element.Firstreleased,
        JP: element.JP,
        EUPAL: element.EUPAL
      }
    })
  }
  // Here we are forcing an index refresh, otherwise we will not get any result in the consequent search
  await client.indices.refresh({ index: 'games' })
}

// Helpful links:
// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html
// https://www.elastic.co/guide/en/elasticsearch/reference/7.6/query-dsl-query-string-query.html#query-string-syntax
// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html
// https://stackoverflow.com/questions/33246344/querying-elasticsearch-by-combining-a-range-and-a-term-match-json-format
