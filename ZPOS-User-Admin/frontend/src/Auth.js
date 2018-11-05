import axios from 'axios';

class Auth {
  constructor() {
    /*
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: 'digitalsystemsapi.auth0.com',
      audience: 'https://digitalsystemsapi.auth0.com/userinfo',
      clientID: 'O0PBMHZYXipRXlSatxw6rre6AaNQ2Sne',
      redirectUri: 'http://localhost:3000/callback',
      responseType: 'token id_token',
      scope: 'openid profile'
    });
*/
    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

 

  getIdToken() {
    return this.idToken;
  }

  //we share the remote db here
  getRemote() {
    return this.remote;
  }

  isAuthenticated() {
    // alert('Expires - '+this.expiresAt);
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

    
  async handleAuthentication() {
    
      let headers = new Headers(), response;
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.idToken + ':' + this.password);
    try {
    response = await axios.get('http://localhost:3030/auth/session', {
        
      headers: headers 
    });
        alert('Session '+response);
        this.setSession(response.data);
       return;
      } catch (error)  {
        console.log('Error on Registering '+error);
        if (error) return error;
        if (!response.data || !response.data.token) {
          return error;
        }
    
  }
}

  setSession(authResult, step) {
    this.idToken = authResult.token;
    this.password = authResult.password;
    this.profile = authResult.profile;
    this.remote = authResult.userDBs.zpos;
    // set the time that the id token will expire at
    this.expiresAt = authResult.expires * 1000 + new Date().getTime();
  }

  signOut() {
    this.idToken = null;
    this.password = null;
    this.profile = null;
    this.expiresAt = null;
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.handleAuthentication({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}


 const auth0Client = new Auth();

export default auth0Client;