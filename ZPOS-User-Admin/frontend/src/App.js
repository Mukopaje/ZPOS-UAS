import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import Login from './Login/Login';
import Register from './Register/Register';
import NavBar from './NavBar/NavBar';
import Question from './Question/Question';
import Questions from './Questions/Questions';
import NewQuestion from './NewQuestion/NewQuestion';
import SecuredRoute from './SecuredRoutes/SecuredRoutes';
import Callback from './Callback';

//import pouchdb
import PouchDB from 'pouchdb';


class App extends Component {

    constructor(props) {

      //we dont want to change state with this
     if(auth0Client.isAuthenticated()) 
      this.remoteDB = auth0Client.getRemote(); 

        super(props);
        this.state = {
          checkingSession: true,
        }
      }

    // this will check for any authenticated user currently loggen in
    async componentDidMount() {
        if (this.props.location.pathname === '/callback') {
         this.setState({checkingSession:false});
        return;
    }
        try {
          await auth0Client.silentAuth();
          this.forceUpdate();
        } catch (err) {
          if (err.error === 'login_required') return;
          console.log(err.error);
        }

        this.setState({checkingSession:false});

        if (this.remoteDB) {
          this.syncToRemote();
        }
      }

      /**
   * Synchronize local PouchDB with a remote CouchDB or Cloudant
   */
  syncToRemote = () => {
    this.props.localDB.sync(this.remoteDB, {live: true, retry: true})
    .on('change', change => {
      this.getPouchDocs();
    })
    // .on('paused', info => console.log('replication paused.'))
    // .on('active', info => console.log('replication resumed.'))
    .on('error', err => console.log('uh oh! an error occured while synching.'));
}


  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Login}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/questions' component={Questions}/>
        <Route exact path='/question/:questionId' component={Question}/>
        <Route exact path='/callback' component={Callback}/>
        <SecuredRoute path='/new-question'
            component={NewQuestion}
            checkingSession={this.state.checkingSession} />
        }
      </div>
    );
}
}

export default withRouter(App);