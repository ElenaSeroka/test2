// @ts-nocheck
/**
 * Module for the PageController.
 *
 * @author Elena Seroka
 * @version 1.0.0
 */

import { Client } from '@elastic/elasticsearch'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Handles routes, queries Elastic Search and sends readonly json responses to client.
 */
export class QueryAndResponseController {
  /**
   * Handles elastic search queries and api responses.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */

  /**
   * Queries elastic search and returns data for all games per year 2000-2013.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async getGamesPerYear (req, res) {
    const client = await new Client({
      node: process.env.NODE_URL,
      auth: {
        username: process.env.USER_NAME,
        password: process.env.PASSWORD
      }
    })

    const defaultSize = 5000

    const searchResults = await client.search({
      size: defaultSize,
      index: 'games',

      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: 'Released',
                fields: ['JP', 'EUPAL']
              }
            },
            {
              range: {
                Firstreleased: {
                  gte: '1900-01-01',
                  lte: '2020-01-01'
                }
              }
            }
          ]
        }
      }
    })

    const allResults = searchResults.hits.hits.map(game => game._source.Firstreleased)
    const allResultsSorted = allResults.sort()
    const configuredData = configureYearForChart(allResultsSorted)
    const result = getLabelsAndData(configuredData)
    const labels = result[0]
    const dataPoints = result[1]

    const data = [
      {
        labels: labels,
        data: {
          values: dataPoints
        },
        dataset: {
          title: 'Games Released Per Year Between 2000-2013',
          label1: 'Total games 2000-2013'
        }
      }
    ]
    res.json(data)
  }

  /**
   * Queries elastic search and returns data for amount of games released in Japan and Europe between 2000-2013.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async getGamesAllYearsJapanAndEurope (req, res) {
    // I chose to query elastic search twice here. If my dataset was bigger, I would have used a single query,
    // and from the result of that query, seperate the data into categories (Released in Japan or EU)\
    // I also wanted to practice mor with different queries. Above I do a multi query.

    const client = await new Client({
      node: process.env.NODE_URL,
      auth: {
        username: process.env.USER_NAME,
        password: process.env.PASSWORD
      }
    })

    const defaultSize = 5000

    const searchResultsJapan = await client.search({
      size: defaultSize,
      index: 'games',

      query: {
        bool: {
          must: [
            {
              match: {
                JP: 'Released'
              }
            },
            {
              range: {
                Firstreleased: {
                  gte: '1900-01-01',
                  lte: '2020-01-01'
                }
              }
            }
          ]
        }
      }
    })
    const searchResultsEUPAL = await client.search({
      size: defaultSize,
      index: 'games',

      query: {
        bool: {
          must: [
            {
              match: {
                EUPAL: 'Released'
              }
            },
            {
              range: {
                Firstreleased: {
                  gte: '1900-01-01',
                  lte: '2020-01-01'
                }
              }
            }
          ]
        }
      }
    })

    const resultJP = getLabelsAndDataForYears(searchResultsJapan)
    const resultEU = getLabelsAndDataForYears(searchResultsEUPAL)

    const labels = resultJP[0]

    const dataPointsJP = resultJP[1]
    const dataPointsEU = resultEU[1]

    const data = [
      {
        labels: labels,
        data: [{
          values: dataPointsJP
        }, {
          values: dataPointsEU
        }
        ],
        dataset: {
          country1: 'Japan',
          country2: 'EUPAL',
          title: 'Games Released in Japan and the EU Per Year Between 2000-2013'

        }
      }
    ]

    res.json(data)
  }

  /**
   * Queries elastic search and returns data for games publshed by specific publisher between 2000-2013.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async getGameCompany (req, res) {
    const client = await new Client({
      node: process.env.NODE_URL,
      auth: {
        username: process.env.USER_NAME,
        password: process.env.PASSWORD
      }
    })

    const defaultSize = 5000

    const searchResults = await client.search({
      size: defaultSize,
      index: 'games',

      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: 'Released',
                fields: ['JP', 'EUPAL']
              }
            },
            {
              range: {
                Firstreleased: {
                  gte: '1900-01-01',
                  lte: '2020-01-01'
                }
              }
            }
          ]
        }
      }
    })

    const allResults = searchResults.hits.hits.map(game => game._source.Publisher)
    const allResultsSorted = allResults.sort()
    const configuredData = configureDataForChart(allResultsSorted)
    const result = getLabelsAndData(configuredData)
    const labels = result[0]
    const dataPoints = result[1]

    const data = [
      {
        labels: labels,
        data: [{
          values: dataPoints
        }
        ],
        dataset: {
          label1: 'Games Released Per Publisher Between 2000 and 2013',
          title: 'Games Released Per Publisher Between 2000 and 2013'

        }
      }
    ]
    res.json(data)
  }
}

/**
 * Configues sorted data for chart.
 *
 * @param {Array} sortedData - Array with the sorted data.
 * @returns {Array} - Array with the labels and data for the chart.
 */
function configureDataForChart (sortedData) {
  const label = []
  let count = 0
  const countAllYears = []

  for (let i = 0; i < sortedData.length; i++) {
    const previousElement = sortedData[i]
    const year = previousElement
    let nextNextYear
    const lastElement = sortedData.length - 1
    if (i === lastElement) {
      nextNextYear = 'different from year'
    } else {
      nextNextYear = sortedData[i + 1]
    }

    if (year === nextNextYear) {
      count++
    }

    if (year !== nextNextYear) {
      label.push(year)
      const countPerYear = {}
      countPerYear[year] = count

      countAllYears.push(count)
      count = 0
    }
  }

  const result = [label, countAllYears]
  return result
}

/**
 * Configues sorted years for chart.
 *
 * @param {Array} sortedYears - Array with the sorted years.
 * @returns {Array} - Array with the labels and data for the chart.
 */
function configureYearForChart (sortedYears) {
  let gamesCount = 0
  const labelyears = []
  const gamesPerYearCount = []
  for (let i = 0; i < sortedYears.length; i++) {
    const previousElement = sortedYears[i].substring(0, 4)
    const year = previousElement
    let nextNextYear
    const lastElement = sortedYears.length - 1
    if (i === lastElement) {
      nextNextYear = 'different from year'
    } else {
      nextNextYear = sortedYears[i + 1].substring(0, 4)
    }

    if (year === nextNextYear) {
      gamesCount++
    }

    if (year !== nextNextYear) {
      labelyears.push(year)
      const gamePerYearIndividualYear = {}
      gamePerYearIndividualYear[year] = gamesCount

      gamesPerYearCount.push(gamesCount)
      gamesCount = 0
    }
  }

  return [labelyears, gamesPerYearCount]
}

/**
 * Gets labels and data for years.
 *
 * @param {Array} searchResults - Array with the searchresults from elastic search.
 * @returns {Array} - Array with the labels and data.
 */
function getLabelsAndDataForYears (searchResults) {
  const allDates = searchResults.hits.hits.map(game => game._source.Firstreleased)
  const allDatesSorted = allDates.sort()
  const configuredData = configureYearForChart(allDatesSorted)
  const result = getLabelsAndData(configuredData)
  return result
}

/**
 * Gets labels and data.
 *
 * @param {Array} configuredData - Array with the searchresults from elastic search.
 * @returns {Array} - Array with the labels and data.
 */
function getLabelsAndData (configuredData) {
  const labels = configuredData[0]
  const amount = configuredData[1]

  return [labels, amount]
}
