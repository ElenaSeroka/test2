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


    welcomeMessage(req, res) {
    }

    async renderMain(req, res) {
        res.json('rendermain Hello')
        console.log('rendermain')
    }

    async getChartShit(req, res) {
        const data = [
            {
                labels: ['Boo', 'February', 'March', 'April', 'May', 'June', 'Spooktober'],
                data: [{
                    values: [2, 5, 10, 25, 75, 43, 23],
                },
                {
                    values: [21, 45, 28, 80, 150, 43, 23]
                }]
            }
        ]
        console.log(data)
        res.json(data)
    }


    async getAllGames(req, res) {
        console.log('getAllGames func')

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



        // const keyword = 'sonic'
        // const size = 20
        const defaultSize = 4000
        const year = '2004-07'
        const decade = 20

        //   Let's search!
        // detta ska in i express appen. conmect. ny connect varje gång
        const searchResults = await client.search({
            // size: `${size}` || defaultSize,
            size: defaultSize,
            index: 'games',

            // query: {
            //   match: {
            //     Firstreleased: '2002-12-12'
            //   }
            // }

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
                                    gte: '2002-06-25',
                                    lte: '2002-06-29'
                                }
                            }
                        }
                    ]
                }
            }
        })

        console.log(searchResults.hits.hits)

        console.log(searchResults.hits.hits.length)

        res.json(searchResults.hits.hits)

        // const data = [
        //     {
        //         labels: ['Boo', 'February', 'March', 'April', 'May', 'June', 'July'],
        //         data: [{
        //             values: [2, 5, 10, 25, 75, 43, 23],
        //         },
        //         {
        //             values: [21, 45, 28, 80, 99, 43, 23]
        //         }]
        //     }
        // ]

    }




    //---------------------------------------------------------GET----------------------------------------------------------------------------------

    
}