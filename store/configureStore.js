import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../actions'

let devtool ;
if (process.env.NODE_ENV === 'development') {
	devtool = window.devToolsExtension ? window.devToolsExtension() : f => f
}else{
	devtool = f => f
} 

export default function configureStore(initialState){
	const store = createStore(rootReducer, initialState, compose(
		applyMiddleware(
			thunk
		),
		devtool
	));
	/*if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers/index');
			store.replaceReducer(nextRootReducer);
		});
	}*/
	return store
}




