import Wave from './Wave'
import './App.css'

function App() {
  const style: React.CSSProperties = {
    width: 100,
    height: 30,
    borderRadius: 8,
    margin: 100,
    borderColor: 'red',
  }

  return (
    <>
      <Wave>
        <button style={style}>Click</button>
      </Wave>
    </>
  )
}

export default App
