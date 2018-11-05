import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import auth0Client from '../Auth';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      email: '',
      password: '',
    };
  }

  // update password state
  updatePassword(value) {
    this.setState({
      password: value,
    });
  }

  // update email state
  updateEmail(value) {
    this.setState({
      email: value,
    });
  }

  async submit() {
     
    this.setState({
      disabled: true,
    });

    let user = {
        username: this.state.email,
        password: this.state.password
    }

    // console.log('User Details '+JSON.stringify(user));
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    await axios.post('http://localhost:3030/auth/login', user, {
        
      headers: headers 
    }).then((response) => {
        console.log('Authenticated');
        // if login success then set session
        auth0Client.setSession(response.data);
      }).catch((error) => {
        console.log('Error on Authentication '+error);
        this.setState({
            disabled: false,
          });
      });

    this.props.history.push('/');
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-header">Login</div>
              <div className="card-body text-left">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Emal:</label>
                  <input
                    disabled={this.state.disabled}
                    type="email"
                    onBlur={(e) => {this.updateEmail(e.target.value)}}
                    className="form-control"
                    placeholder="Email e.g mukopaje@gmail.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword">Password:</label>
                  <input
                    disabled={this.state.disabled}
                    type="password"
                    onBlur={(e) => {this.updatePassword(e.target.value)}}
                    className="form-control"
                    placeholder="Enter Your Password"
                  />
                </div>
                <button
                  disabled={this.state.disabled}
                  className="btn btn-primary"
                  onClick={() => {this.submit()}}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Login);