import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Homepage from './pages/Homepage'
import CreatePlan from './pages/CreatePlan'
import SignIn from './pages/SignIn'
import SignUp from './pages/Signup'
import TravelPlanning from './pages/TravelPlanning'

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/create-plan" element={<CreatePlan />} />
            <Route path='/sign-in' element={<SignIn/>}/>
            <Route path='/sign-up' element={<SignUp/>}/>
            <Route path='/travel-planning' element={<TravelPlanning/>} />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
