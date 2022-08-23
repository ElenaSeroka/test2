import React from 'react'

/**
 * Activates compare 'released games in Japan and in Europe' query when button is clicked.
 *
 * @param {object} props - Props sent in from App.js
 * @returns {HTMLButtonElement} button - Button element with onClick event listener.
 */
const GamesCompareJapanEUPAL = (props) => {
  return (
    <div>

      <button onClick={props.clickAction}>Compare games released in Japan and EU</button>

    </div>
  )
}

export default GamesCompareJapanEUPAL
