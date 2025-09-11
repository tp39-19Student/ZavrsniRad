import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import AuthRoute from './components/AuthRoute'
import { useAppDispatch } from './hooks'
import { getUserStart } from './features/user/usersSlice'

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
        <AuthRoute role={0}><h1>Texts</h1></AuthRoute>
      }></Route>
    </Routes>
  </React.Fragment>
    
  )
}

export default App
