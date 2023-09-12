import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './i18n'
import App from './App'

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('root'),
)
