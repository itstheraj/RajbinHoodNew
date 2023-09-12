import logo from './logo.svg'
import './App.css'
import './components/Ticker'
import Ticker from './components/Ticker'
import PriceGraph from './components/PriceGraph'
import { useTranslation } from 'react-i18next'
function App() {
  const { t } = useTranslation()

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='App-disclaimer'>
          <p>{t('app-disclaimer')}</p>
        </div>
        <img src={logo} className='App-logo-left' alt='logo' />
        <img src={logo} className='App-logo-right' alt='logo' />

        <div>
          <Ticker></Ticker>
        </div>

        <PriceGraph></PriceGraph>

        <div className='App-link-div'>
          <a
            className='App-link'
            href='https://finch127.github.io'
            target='_blank'
            rel='noopener noreferrer'
          >
            {t('portfolio-link-text')}
          </a>
        </div>
      </header>
    </div>
  )
}

export default App
