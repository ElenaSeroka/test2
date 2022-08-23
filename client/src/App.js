// @ts-nocheck
import { React, useState, useEffect } from 'react'
import MyChart from './Components/Chart/MyChart.tsx'
import GamesPerYearButton from './Components/Chart/GamesPerYearButton.tsx'
import GamesCompareJapanEUPAL from './Components/Chart/GamesCompareJapanEUPAL.tsx'
import GamesPerPublisherButton from './Components/Chart/GamesPerPublisherButton.tsx'

/**
 * Main function of the application. Sets states, fetches data, renders chart.
 *
 * @returns {JSX.Element} - App component that renders in index.js
 */
function App () {
  const [labels, setLabels] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filteredData2, setFilteredData2] = useState([])
  const [title, setTitle] = useState([])
  const [lowerLabels1, setlowerLables1] = useState([])
  const [lowerlabels2, setlowerLables2] = useState([])

  /**
   * Clears all states from graph.
   */
  const ClearGraph = () => {
    setLabels('')
    setFilteredData('')
    setFilteredData2('')
    setTitle('')
    setlowerLables1('')
    setlowerLables2('')
  }

  useEffect(() => {
    /**
     * Effect when window is loaded and refreshes.
     */
    const fetchData = async () => {
      const data = await fetch('https://elastic-search-games-api.herokuapp.com/api/games-per-year')
      const dataArrayJSON = await data.json()
      console.log(dataArrayJSON)
      ClearGraph()
      setLabels(dataArrayJSON.length === 0 ? ['pink'] : dataArrayJSON[0].labels)
      setFilteredData(dataArrayJSON.length === 0 ? [0, 0, 0, 0, 0, 0] : dataArrayJSON[0].data.values)
      setTitle([dataArrayJSON[0].dataset.title])
      setlowerLables1(dataArrayJSON[0].dataset.label1)
    }

    /* // call the function */
    fetchData()
      /* // make sure to catch any error */
      .catch(console.error)
  }, [])

  /**
   * Fetches data from elastic search and sets the state.
   *
   * @param {string} url - The url sent in from which data.
   * @returns {Array} response - The response from the url.
   */
  const fetchData = async (url) => {
    const data = await fetch(url)
    /* // convert the data to json */
    const dataArrayJSON = await data.json()
    return dataArrayJSON
  }

  /**
   * Fetches data from elastic search and sets the state. This is used for the games per year button.
   *
   */
  const gamesPerYearChangeData = async () => {
    ClearGraph()
    const dataArrayJSON = await fetchData('https://elastic-search-games-api.herokuapp.com/api/games-per-year')
    setLabels(dataArrayJSON.length === 0 ? ['pink'] : dataArrayJSON[0].labels)
    setFilteredData(dataArrayJSON.length === 0 ? [0, 0, 0, 0, 0, 0] : dataArrayJSON[0].data.values)
    setTitle([dataArrayJSON[0].dataset.title])
    setlowerLables1(dataArrayJSON[0].dataset.label1)
  }

  /**
   * Fetches data from elastic search and sets the state. This is used for the games per publisher button.
   *
   */
  const gamesPerPublisher = async () => {
    ClearGraph()
    const dataArrayJSON = await fetchData('https://elastic-search-games-api.herokuapp.com/api/games-per-publisher')
    setLabels(dataArrayJSON.length === 0 ? ['pink'] : dataArrayJSON[0].labels)
    setFilteredData(dataArrayJSON.length === 0 ? [0, 0, 0, 0, 0, 0] : dataArrayJSON[0].data[0].values)
    setTitle([dataArrayJSON[0].dataset.title])
    setlowerLables1(dataArrayJSON[0].dataset.label1)
  }

  /**
   * Fetches data from elastic search and sets the state. This is used for comparing games released in Japan and Europe button.
   *
   */
  const gamesCompareJapanEUPAL = async () => {
    ClearGraph()
    const dataArrayJSON = await fetchData('https://elastic-search-games-api.herokuapp.com/api/games-all-years-JP-EU')
    setLabels(dataArrayJSON.length === 0 ? ['pink'] : dataArrayJSON[0].labels)
    setFilteredData(dataArrayJSON.length === 0 ? [0, 0, 0, 0, 0, 0] : dataArrayJSON[0].data[0].values)
    setFilteredData2(dataArrayJSON.length === 0 ? [0, 0, 0, 0, 0, 0] : dataArrayJSON[0].data[1].values)
    setTitle([dataArrayJSON[0].dataset.title])
    setlowerLables1(dataArrayJSON[0].dataset.country1)
    setlowerLables2(dataArrayJSON[0].dataset.country2)
  }

  return (
    <div className='App'>
      <MyChart
        labels={labels}
        data1={filteredData}
        data2={filteredData2}
        title={title}
        lowerLabelRed={lowerLabels1}
        lowerLabelBlue={lowerlabels2}
      />
      <button onClick={() => window.location.reload()}>Refresh page</button>
      <br />
      <GamesPerYearButton
        clickAction={gamesPerYearChangeData}/>
      <GamesCompareJapanEUPAL
        clickAction={gamesCompareJapanEUPAL} />
      <GamesPerPublisherButton
        clickAction={gamesPerPublisher} />
    </div>
  )
}

export default App
