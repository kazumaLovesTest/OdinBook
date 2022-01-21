import React from 'react';
import { useState,useEffect } from 'react';
import Login from './component/Login';
import login from './services/login';
const Notification = ({notification}) => {
  const notificationStyle = {
    border: '5px solid red',
    borderRadius: '14px',
    fontSize: '20px',
    padding: '20px',
    textAlign:'center'
  }
  if (notification !== null)
  return (
    <div style={notificationStyle}>
      {notification}
    </div>
  )
  else 
    return(
      <></>
    )
}
function App() {
  const [notification, setNotification]  = useState(null);
  const handleLogging = async(credintials) => {
    try{
      const response = await login(credintials)
      window.localStorage.setItem('Token',response.token)
      setInterval(() =>{
        setNotification(`${response.username} is logged in`)
      },3000)
    }
    catch (error){
      setInterval(() => {
        setNotification(`couldn't Loggin because ${error.message}`)
      })
    }
  }
  return (
    <>
      <Login handleLogging = {handleLogging}/>
      <Notification notification = {notification}/>
    </>
  );
}

export default App;
