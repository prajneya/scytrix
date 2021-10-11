import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

async function loginUser(credentials) {
 
}

function Home({ setToken }) {
	const [username, setUserName] = useState();
  	const [password, setPassword] = useState();

  	const handleSubmit = async e => {
	    e.preventDefault();
	    await axios.post('http://localhost:5000/login', {credentials: { username, password }})
				   .then(res => {if(res.data['token']){
					  				const { token } = res.data;
							     	setToken(token);
							      	console.log("Decoded token", token)
									window.location.reload(false);
					  			}})
				   .catch(err => console.log(err))
	 }

	return (
		<>
			<div className="container">
				<div className="text-center m-5">
					<div className="landing-header">
						Hello.
					</div>
					<div className="landing-subtitle">
						Was hoping to pull one last surprise.
					</div>
				</div>

				<div className="">
					<div className="login-container">
				       <form onSubmit={handleSubmit}>
				           <h1>THE SCYTRIX SIM</h1>
				           <div>
				               <label>Username</label>
				               <input className="mt-2" type="text" name="username" placeholder="Enter your username here" onChange={e => setUserName(e.target.value)} />
				           </div>
				           <div>
				               <label>Password</label>
				               <input className="mt-2" type="password" name="password" placeholder="Enter your password here" onChange={e => setPassword(e.target.value)} />
				           </div>
				           <input className="mt-4" type="submit" name="login" value="LOGIN" />
				       </form>
				   </div>
				</div>
			</div>
		</>

	)
}

Home.propTypes = {
  setToken: PropTypes.func.isRequired
}


export default Home;