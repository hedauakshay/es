import React from 'react';
import {render} from 'react-dom';
//import { Route } from 'react-router';
//import { BrowserRouter } from 'react-router-dom';
import App from './components/App.jsx';
/*render((
		<BrowserRouter>
		  <div>
			<Route exact path="/" 
				history={history} 
				onLeave={ ()=> { alert('sure you want to leave?');} } 
				render={() => ( <App /> )}/>
			<Route exact path="/forms" 
				history={history} 
				onLeave={ ()=> { alert('sure you want to leave?');} } 
				render={() => ( <Form /> )}/>
			<Route exact path="/fields" 
				history={history} 
				onLeave={ ()=> { alert('sure you want to leave?');} } 
				render={() => ( <Field /> )}/>
		  </div>
		</BrowserRouter>
	), document.getElementById('root')
);*/

render( <App />, document.getElementById('root') );