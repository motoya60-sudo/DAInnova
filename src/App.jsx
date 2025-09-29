import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Sidebar } from './components/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>home</h1>
      <Sidebar />
    </>
  )
}

export default App
