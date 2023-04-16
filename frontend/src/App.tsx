import { useRef, useState } from 'react'
import Group from './Components/Group'
import { io } from 'socket.io-client'
function App() {
  const socket = useRef(io("/",{reconnection:false}))
  return (
    <div className="App min-w-screen min-h-screen bg-red-600">
      <Group socket={socket.current} />
    </div>
  )
}
export default App;
