import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';

function setToken(userToken) {
	sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
	const tokenString = sessionStorage.getItem('token');
 	const userToken = JSON.parse(tokenString);
 	console.log(userToken)
  	return userToken ? userToken : "";
}

function App() {
	const token = getToken();
	console.log(token);

	if(!token) {
    	return <Home setToken={setToken} />
  	}

	return (
	
		<BrowserRouter>
		  <div>
		    <Switch>
		      <Route path="/dashboard" component={Dashboard} exact />
		      <Route component={Dashboard}  />
		    </Switch>
		  </div>
		</BrowserRouter>
  	
  	);
}

export default App;
