import React, { useState } from 'react'
import { useQueries, useQuery } from 'react-query'
import axios from 'axios'
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
)

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    colors: {
      enabled: true,
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Historical Fake Ticker Data',
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        tooltipFormat: 'M/DD HH:mm:ss',
      },
      title: {
        display: true,
        text: 'Date',
      },
    },
  },
}
const BASE_URL = process.env.REACT_APP_RAJBINHOOD_BASE_URL

async function fetchHistoricalData({ queryKey }) {
  // eslint-disable-next-line no-unused-vars
  const [_, slug] = queryKey
  const data = await axios(BASE_URL + 'assets/historical/' + slug)
  return data
}

async function fetchSlugs() {
  const data = await axios(BASE_URL + 'assets/slugs')
  return data
}

function PriceGraph() {
  const [slugData, setSlugData] = useState({ data: [] })
  // eslint-disable-next-line no-unused-vars
  const [intermediateResult, _] = useState({ outer: { data: { data: [[]] } } })

  useQuery(['slugs'], fetchSlugs, {
    onSuccess: setSlugData,
  })

  intermediateResult.outer = useQueries(
    slugData?.data?.map(slug => {
      return {
        queryKey: ['historical_data', slug],
        queryFn: fetchHistoricalData,
        enabled: !!slug,
      }
    }),
  )

  const labels = intermediateResult.outer[0]?.data?.data?.timestamps
  const colors = {
    border: ['#ca44ab', '#448cca', '#44ca90', '#ca5644', '#ca9744'],
    bg: ['#FD77DE', '#77BFFD', '#77FDC3', '#FD8977', '#FDCA77'],
  }

  const data = {
    labels,
    datasets: intermediateResult.outer.map((res, index) => {
      return {
        label: res?.data?.data?.slug,
        data: res?.data?.data?.prices,
        borderColor: colors.border[index],
        backgroundColor: colors.bg[index],
      }
    }),
  }

  return (
    <React.Fragment>
      <div style={{ width: '80%', height: '50%' }}>
        <Line className='Chart__line' options={options} data={data}></Line>
      </div>
    </React.Fragment>
  )
}

export default PriceGraph
