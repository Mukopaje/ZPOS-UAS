import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';


PouchDB.plugin(PouchDBFind); // install the pouchdb-find plugin
// Change these to set them only when user is logged in
const localDB = new PouchDB('zpos');
let remoteDB = undefined;

ReactDOM.render(
  <BrowserRouter>
    <App localDB={localDB} remoteDB={remoteDB}/>
  </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();