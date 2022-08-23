import React from 'react'

/**
 * Activates games per year query when button is clicked.
 *
 * @param {object} props - Props sent in from App.js
 * @returns {HTMLButtonElement} button - Button element with onClick event listener.
 */
const GamesPerYearButton = (props) => {
  return (
      <div>
          <button onClick={props.clickAction}>Games Per Year</button>
      </div>
  )
}

export default GamesPerYearButton
