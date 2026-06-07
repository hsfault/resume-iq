import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Reviewer from './pages/Reviewer'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"       element={<Landing />}  />
        <Route path="/review" element={<Reviewer />} />
      </Routes>
    </Router>
  )
}

export default App