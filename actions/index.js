import { combineReducers } from 'redux'

import login from './login'
import cell from './cell'
import project from './project/project'
import table from './table/table'


const rootReducer = combineReducers({

	login ,
	cell,
	project,
	table,

})

export default rootReducer
