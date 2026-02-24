import React, { useEffect, useState } from 'react'
import Mainroutes from './routes/Mainroutes'

const App = () => {

  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <div style={{textAlign:"center", marginTop:"100px"}}>
        <h1>No Internet Connection</h1>
        <p>Please check your network.</p>
      </div>
    )
  }

  return (
    <div>
      <Mainroutes />
    </div>
  )
}

export default App