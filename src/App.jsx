import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Papers from './pages/Papers'
import SubjectPapers from './pages/SubjectPapers'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/papers/:subjectCode" element={<SubjectPapers />} />
      </Route>
    </Routes>
  )
}

export default App
