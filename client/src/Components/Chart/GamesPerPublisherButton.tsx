import React from 'react'

/**
 * Activates games per publisher query when button is clicked.
 *
 * @param {object} props - Props sent in from App.js
 * @returns {HTMLButtonElement} button - Button element with onClick event listener.
 */
const GamesPerPublisherButton = (props) => {
  return (
    <div>
      <button onClick={props.clickAction}>Games Per Publisher</button>
    </div>
  )
}

export default GamesPerPublisherButton
