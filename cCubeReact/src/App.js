import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import CodePage from './pages/CodePage/CodePage'

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/room">
          <CodePage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
