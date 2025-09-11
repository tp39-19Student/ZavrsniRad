import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import AuthRoute from './components/AuthRoute'
import { useAppDispatch } from './hooks'
import { adminOnlyEndpoint, getUserStart, userOnlyEndpoint } from './features/user/usersSlice'

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserStart());
  }, [dispatch])

  return (
  <React.Fragment>
    <Navbar />
    <Routes>
      <Route index element={<h1>Home</h1>} />
      <Route path='/texts' element={
        <AuthRoute role={2}><div>
            <button onClick={() => dispatch(userOnlyEndpoint())}>User only</button>
            <button onClick={() => dispatch(adminOnlyEndpoint())}>Admin only</button>
          </div></AuthRoute>
      }></Route>
    </Routes>
  </React.Fragment>
    
  )
}

export default App
