import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import './TickerCard'
import axios from 'axios'
import TickerCard from './TickerCard'
import './Ticker.css'

const BASE_URL = process.env.REACT_APP_RAJBINHOOD_BASE_URL

async function fetchCurrentPrices() {
  const data = await axios(BASE_URL + 'assets/')
  return data
}

function priceColorStates(prior, current) {
  if (current > prior) {
    return 'green'
  } else if (prior > current) {
    return 'red'
  } else {
    return 'darkblue'
  }
}

function Ticker() {
  const [priceData, setPriceData] = useState({ data: [] })
  const [ticker, setTicker] = useState(0)

  useQuery(['price_data', ticker], fetchCurrentPrices, {
    onSuccess: setPriceData,
    cacheTime: 10 * 1000, // 5 s caching
  })

  const queryClient = useQueryClient()
  const priorPriceData = queryClient.getQueryData(['price_data', ticker - 1])

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(ticker => ticker + 1)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const colorMap = {
    color: {},
  }

  return (
    <React.Fragment>
      <h1> TICKERS </h1>
      <div className={'Tickers-container'}>
        <table>
          <tbody>
            <tr>
              {priceData.data.map((ticks, index) => {
                if (priorPriceData) {
                  colorMap.color = priceColorStates(
                    priorPriceData.data[index].current_price,
                    ticks.current_price,
                  )
                } else {
                  colorMap.color = 'darkblue'
                }

                return (
                  <td key={index}>
                    <TickerCard ticker={ticks} colors={colorMap} />
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

export default Ticker
