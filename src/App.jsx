import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Sidebar } from './components/Sidebar'
import { Home } from './components/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home />
      <Sidebar />
    </>
  )
}

export default App
