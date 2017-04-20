import { combineReducers } from 'redux'
//import { routerReducer as routing } from 'react-router-redux'
import login from './login'
import cell from './cell'
//import map from '../redux/map'
import project from './project/project'
import table from './table/table'
/*import demo from 'reducers/demo'
import companyList from 'reducers/customer/companyList'
import companyDetail from 'reducers/customer/detail'
import search from 'reducers/search'
import list from 'reducers/list'
import davidSearch from 'reducers/search/davidSearch'
/!* import filter from 'reducers/filter' *!/
import geography from 'reducers/filter/geography'
import industry  from 'reducers/filter/industry'*/

const rootReducer = combineReducers({
/*	demo ,
	companyList,*/
	login ,
	cell,
	//map,
	project,
	table,
	/*search,
	davidSearch,
	companyDetail,
	geography,
	industry,
	list,
	/!* filter, *!/
	routing // don't remove*/
})

export default rootReducer
