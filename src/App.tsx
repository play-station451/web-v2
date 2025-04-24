import Api from "./sys/Api"
import Desktop from "./sys/gui/Desktop"

function App() {
  Api()
  return (
    <>
      <Desktop desktop={1} onContextMenu={(e: MouseEvent) => {
        e.preventDefault()
      }} />
    </>
  )
}

export default App
