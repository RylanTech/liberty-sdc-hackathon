import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import CreatePlan from './pages/CreatePlan'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/create-plan" element={<CreatePlan />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
