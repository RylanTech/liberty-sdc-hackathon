import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import CreatePlan from './pages/CreatePlan'
import SignIn from './pages/SignIn'
import SignUp from './pages/Signup'
import TravelPlanning from './pages/TravelPlanning'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='travel-planing' element={<TravelPlanning/>} />
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
