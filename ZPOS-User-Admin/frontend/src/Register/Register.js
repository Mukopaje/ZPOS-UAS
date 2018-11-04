import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import authClient from '../Auth';
import axios from 'axios';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

 
   // update name state
   updateName(value) {
    this.setState({
      name: value,
    });
  }

  // update username and email state
  updateEmail(value) {
    this.setState({
      email: value,
    });
  }

   // update password state
   updatePassword(value) {
    this.setState({
      password: value,
    });
  }

    // update confirm password state
    updateConfirmPassword(value) {
        this.setState({
          confirmPassword: value,
        });
      }

 

  // submit click handler
  async submit() {
    this.setState({
      disabled: true,
    });

    let user = {
        name: this.state.name,
        usrname: this.state.email,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
    }

    alert(JSON.stringify(user));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    await axios.post('http://localhost:3030/auth/register', user, {
        
      headers: headers 
    }).then((response) => {
        console.log('Registered '+response);
        // if login success then set session
        //authClient.setSession(response);
      }).catch((error) => {
        console.log('Error on Registering '+error);
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
              <div className="card-header">Register</div>
              <div className="card-body text-left">
              <div className="form-group">
                  <label htmlFor="exampleInputName">Full Name:</label>
                  <input
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={(e) => {this.updateName(e.target.value)}}
                    className="form-control"
                    placeholder="Name e.g Mukopaje Singogo"
                  />
                </div>
                
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
                <div className="form-group">
                  <label htmlFor="exampleInputPassword">Confirm Password:</label>
                  <input
                    disabled={this.state.disabled}
                    type="confirmPassword"
                    onBlur={(e) => {this.updateConfirmPassword(e.target.value)}}
                    className="form-control"
                    placeholder="Enter Your Password"
                  />
                </div>
                <button
                  disabled={this.state.disabled}
                  className="btn btn-primary"
                  onClick={() => {this.submit()}}>
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Register);