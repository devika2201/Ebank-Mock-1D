import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userId: '', userPin: '', showError: false, errorMsg: ''}

  onChangeUser = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({userPin: event.target.value})
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 7, path: '/'})
    console.log(jwtToken)

    history.replace('/')
  }

  error = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userId, userPin} = this.state
    const userDetails = {user_id: userId, pin: userPin}
    const apiUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.error(data.error_msg)
    }
  }

  render() {
    const {userId, userPin, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="card-container">
          <div className="first-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="website-size"
            />
          </div>
          <div className="second-container">
            <h1 className="heading">Welcome Back!</h1>
            <form onSubmit={this.onSubmitForm}>
              <div className="label-and-input">
                <label htmlFor="user" className="labels">
                  User ID
                </label>
                <input
                  type="text"
                  id="user"
                  className="inputs"
                  value={userId}
                  onChange={this.onChangeUser}
                  placeholder="Enter User ID"
                />
              </div>
              <div className="label-and-input">
                <label htmlFor="pin" className="labels">
                  PIN
                </label>
                <input
                  type="password"
                  id="pin"
                  className="inputs"
                  value={userPin}
                  onChange={this.onChangePin}
                  placeholder="Enter PIN"
                />
              </div>
              <button type="submit" className="buttons">
                Login
              </button>
              {showError === true && <p className="error">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
