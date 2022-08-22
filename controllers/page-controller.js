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
 * Encapsulates a controller.
 */
export class PageController {
    /**
     * Handles plant recources - creating, reading (individual plant and a collection of all plants), updating and deleting.
     *
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */

    async getGamesPerYear(req, res) {

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

                            "multi_match" : {
                                "query":    "Released", 
                                "fields": [ "JP", "EUPAL" ] 
                            },


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
        let result = getLabelsAndData(configuredData)
        let labels = result[0]
        let dataPoints = result[1]



        const data = [
            {
                labels: labels,
                data: {
                    values: dataPoints,
                }
            }
        ]
        res.json(data)
    }

    async getGamesAllYearsJapanAndEurope(req, res) {
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

        let resultJP = getLabelsAndDataForYears(searchResultsJapan)
        let resultEU = getLabelsAndDataForYears(searchResultsEUPAL)

        let labels = resultJP[0]

        let dataPointsJP = resultJP[1]
        let dataPointsEU = resultEU[1]

        const data = [
            {
                labels: labels,
                data: [{
                    values: dataPointsJP,
                }
                    ,
                {
                    values: dataPointsEU
                }
                ],
                dataset: {
                    country1: 'Japan',
                    country2: 'EUPAL'

                }
            }
        ]

        res.json(data)


    }

    async getGameCompany(req, res) {
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
                        // {
                        //     match: {
                        //         JP: 'Released'
                        //     }
                        // },
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
        let result = getLabelsAndData(configuredData)
        let labels = result[0]
        let dataPoints = result[1]


        const data = [
            {
                labels: labels,
                data: [{
                    values: dataPoints,
                }
                ]
            }
        ]
        res.json(data)

    }

}

function configureDataForChart(sortedData) {
    let label = []
    let count = 0
    let countAllYears = []

    for (let i = 0; i < sortedData.length; i++) {
        let previousElement = sortedData[i]
        let year = previousElement
        let nextNextYear
        let lastElement = sortedData.length - 1
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
            let countPerYear = {}
            countPerYear[year] = count

            countAllYears.push(count)
            count = 0
        }
    }

    let result = [label, countAllYears]
    return result
}

function configureYearForChart(sortedYears) {
    let gamesCount = 0
    let labelyears = []
    let gamesPerYearCount = []
    for (let i = 0; i < sortedYears.length; i++) {
        let previousElement = sortedYears[i].substring(0, 4)
        let year = previousElement
        let nextNextYear
        let lastElement = sortedYears.length - 1
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
            let gamePerYearIndividualYear = {}
            gamePerYearIndividualYear[year] = gamesCount

            gamesPerYearCount.push(gamesCount)
            gamesCount = 0
        }
    }

    return [labelyears, gamesPerYearCount]
}

function getLabelsAndDataForYears(searchResults) {
    let allDates = searchResults.hits.hits.map(game => game._source.Firstreleased)
    const allDatesSorted = allDates.sort()
    const configuredData = configureYearForChart(allDatesSorted)
    let result = getLabelsAndData(configuredData)
    return result
}

function getLabelsAndData(configuredData) {

    const labels = configuredData[0]
    const amount = configuredData[1]

    return [labels, amount]

}