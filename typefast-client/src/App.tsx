import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import AuthRoute from './components/AuthRoute'
import { useAppDispatch } from './hooks'
import { adminOnlyEndpoint, getUserStart, userOnlyEndpoint } from './features/user/usersSlice'
import Texts from './features/text/Texts'
import Game from './features/game/Game'
import Profile from './features/profile/Profile'
import Block from './features/user/Block'

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
      <Route path='profile/:id?' element={
        <AuthRoute role={2}><Profile /></AuthRoute>
      }></Route>
      <Route path='/block/:id' element={
        <AuthRoute role={1}><Block /></AuthRoute>
      }></Route>
    </Routes>
  </React.Fragment>
    
  )
}

export default App
