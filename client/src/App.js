// @ts-nocheck
import './App.css';
import React from 'react';

import MyChart from './components/customers/MyChart.tsx'

import { useState, useEffect } from 'react';

function App() {


  const [data, setBackendData] = useState([]);

  useEffect(() => {
    /* // declare the async data fetching function */
    const fetchData = async () => {
      /* // get the data from the api */
      const data = await fetch('http://localhost:5000/api/games-per-year');
      // const data = await fetch('http://localhost:5000/api/games-all-years-JP-EU');
      // const data = await fetch('http://localhost:5000/api/games-per-publisher');
      /* // convert the data to json */
      const dataArrayJSON = await data.json();
      console.log('This is new ')
      console.log(dataArrayJSON)
      /* // set state with the result */
      setBackendData(dataArrayJSON);
    }

    /* // call the function */
    fetchData()
      /* // make sure to catch any error */
      .catch(console.error);;
  }, [])

  return (
    <div className="App">
      <MyChart
        labels={data.length === 0 ? ["pink"] : data[0].labels}
        data1={data.length === 0 ? [0, 0, 0, 0, 0, 0] : data[0].data.values}
        // data1={data.length === 0 ? [0, 0, 0, 0, 0, 0] : data[0].data[0].values}
        />
        {/* data2={data.length === 0 ? [0, 0, 0, 0, 0, 0] : data[0].data[1].values} */}

        
      <button onClick={() => window.location.reload()}>Refresh chart</button>
    </div>
  );
}

export default App;
