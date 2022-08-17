import { Client } from '@elastic/elasticsearch'
import fs from 'fs'
/**
 *
 */
export default class addToDB {
  /** Adds data in CSV file to elastic search DB.
   *
   */

/** Adds data to the elastic search. Only run this once!
 *
 * @param { Client } client The client created in renderMain()
 */

  async addToDB(client) {
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
