import { useState } from "react"
import App from "../App"
const Login = (props) => {
  const [credintials, setCredintials] = useState({
    username: null,
    password: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (credintials.username === null || credintials.password === null) {
      window.alert("You must fill all info.")
      return
    }
    props.handleLogging(credintials)
  }
  return (
    <form onSubmit={handleSubmit}>
      username:<input id="username" type='text' onChange={(e) => setCredintials({
        ...credintials, username: e.target.value
      })}></input>
      password:<input id="password" type='password' onChange={(e) => setCredintials({
        ...credintials, password: e.target.value
      })}></input>
      <button id = "login" type='submit'>Login</button>
    </form>
  )
}

export default Login;