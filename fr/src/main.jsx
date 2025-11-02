// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App'
// import Dashboard from './Dashboard'
// import Complaints from './Complaints'  // Import Complaints component
// import Complaintsbox from './Complaintsbox'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <Routes>
//       <Route path='/' element={<App />} />
//       <Route path='/dashboard' element={<Dashboard />} />
//       <Route path='/Complaints' element={<Complaints />} />
//       <Route path='/mycomplaints' element={<Complaintsbox />} />  {/* Add Complaints route */}
//     </Routes>
//   </BrowserRouter>,
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

