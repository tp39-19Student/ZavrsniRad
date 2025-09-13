import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import AuthRoute from './components/AuthRoute'
import { useAppDispatch } from './hooks'
import { adminOnlyEndpoint, getUserStart, userOnlyEndpoint } from './features/user/usersSlice'
import Texts from './features/text/Texts'
import Game from './features/game/Game'

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
        <AuthRoute role={2}><Texts /></AuthRoute>
      }></Route>
      <Route path='/play/:id?' element={
        <AuthRoute role={0}><Game /></AuthRoute>
      }></Route>
    </Routes>
  </React.Fragment>
    
  )
}

export default App
