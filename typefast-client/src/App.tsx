import React, { useEffect } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import AuthRoute from './components/AuthRoute'
import { useAppDispatch, useAppSelector } from './hooks'
import { adminOnlyEndpoint, getUserStart, userOnlyEndpoint } from './features/user/usersSlice'
import Texts from './features/text/Texts'
import Game from './features/game/Game'
import Profile from './features/profile/Profile'
import Block from './features/user/Block'
import GlobalLeaderboard from './features/profile/GlobalLeaderboard'
import BlockedPage from './features/user/BlockedPage'
import SoloGame from './features/game/SoloGame'
import DailyGame from './features/game/DailyGame'

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.users.user);

  useEffect(() => {
    dispatch(getUserStart());
  }, [dispatch])

  return (
  <React.Fragment>
    <Navbar />
    {(user != null && (user.blUntil > Date.now() / 1000))?
      <BlockedPage user={user} />
      :
      <>
      <Routes>
        <Route index element={<h1>Home</h1>} />
        <Route path='/texts' element={
          <AuthRoute role={2}><Texts /></AuthRoute>
        }></Route>
        <Route path='/play/:id?' element={
          <AuthRoute role={-1}><SoloGame /></AuthRoute>
        }></Route>
        <Route path='playDaily' element={
          <AuthRoute role={0}><DailyGame /></AuthRoute>
        }></Route>
        <Route path='profile/:id?' element={
          <AuthRoute role={2}><Profile /></AuthRoute>
        }></Route>
        <Route path='/leaderboard' element={<GlobalLeaderboard />}></Route>
        <Route path='/auth' element={<AuthRoute role={2}><Navigate to={"/"} /></AuthRoute>}></Route>
      </Routes>
      </>
    }
    
  </React.Fragment>
    
  )
}

export default App
