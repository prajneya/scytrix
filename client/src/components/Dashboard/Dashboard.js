import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

function updateScroll(){
    var element = document.getElementById("chat");
    if(element)
    	element.scrollTop = element.scrollHeight;
}

function getToken() {
	const tokenString = sessionStorage.getItem('token');
 	const userToken = JSON.parse(tokenString);
 	console.log(userToken)
  	return userToken ? userToken : "";
}

function getUsername (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).username;
};

function Dashboard() {

	const [allMessages, setAllMessages] = useState([])
	const [myUsername, setMyUsername] = useState("")
	const [checkLoad, setCheckLoad] = useState(1)
	const [message, setMessage] = useState("");
	
	const token = getToken();

	if(checkLoad){
		setMyUsername(getUsername(token))
		axios
    		.get("/record")
    		.then(res => {setAllMessages(res.data)})

    	setCheckLoad(0);
    	updateScroll();
	}


	
	const handleSubmit = async e => {
	    e.preventDefault();

	    if(message.trim()===""){
	    	setMessage("")
	    	return;
	    }

	    await axios.post('/addMessage', { username: myUsername, message: message })
				   .then(res => {axios
						    		.get("/record")
						    		.then(res => {setAllMessages(res.data)})
						    		updateScroll();
					  			})
				   .catch(err => console.log(err))
	    
	    setMessage("")
	 }

	 const logOut = () => {
	 	sessionStorage.clear();
	 	window.location.reload(false);
	 }
	

	return (
		<>

			
			<div className="container">
				<div className="text-center m-5">
					<div className="landing-subtitle">
						Welcome to the home of	
					</div>
					<div className="landing-header" onClick={updateScroll}>
						SCYTRIX
					</div>
				</div>

				<div className="chat">
					<div className="chat-container" id="chat">
					{console.log(allMessages)}
					{allMessages.map(msg_item => ( 
						<>
							{msg_item.username === myUsername ? 
								<div className="m-3 message right p-3">
									<div className="msg-user">{msg_item.username}</div><br/>
									<div className="msg">{msg_item.message}</div>
								</div> :
								<div className="m-3 message left p-3">
									<div className="msg-user">{msg_item.username}</div><br/>
									<div className="msg">{msg_item.message}</div>
								</div>
							}	
							
						</>
					))}
					</div>
					<div className="message-sender">
						<form onSubmit={handleSubmit}>
							<input className="my-1 px-2" type="text" placeholder="How are you feeling today?" onChange={e => setMessage(e.target.value)} value={message} />
							<button className="btn btn-success mx-3">SEND</button>
						</form>
					</div>
				</div>
			</div>

			<div className="logout" onClick={logOut}>
				Logout
			</div>
		</>

	)
}


export default Dashboard;