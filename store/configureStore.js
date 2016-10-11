import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

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
	))
	return store
}




