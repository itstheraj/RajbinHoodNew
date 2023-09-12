import React from 'react'
import './TickerCard.css'
import PropTypes from 'prop-types'

function TickerCard(props) {
  const { ticker, colors } = props

  return (
    <React.Fragment>
      <div className='Ticker-card'>
        <div className='Ticker-card__container'>
          <h4>
            <b>{ticker.name}</b>
          </h4>
          <p style={{ color: colors.color }}>{ticker.current_price}</p>
          <p>{new Date().toUTCString()}</p>
        </div>
      </div>
    </React.Fragment>
  )
}

TickerCard.propTypes = {
  ticker: PropTypes.object.isRequired,
  colors: PropTypes.object.isRequired,
}

export default TickerCard
