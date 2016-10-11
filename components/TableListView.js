/**
 * Created by younger on 2016/8/14.
 */
import React,{ Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/table';

var tableList = ['勘探点数据表','波速表','剖线数据表','静探表','动探表'];
class TableListView extends Component {
    onPressTable(value){
        let {actions} = this.props;
        this.props.navigator.push({name: 'data'});
        actions.SetTable(value);
    }
    componentWillMount(){
        this.tableArray = [];//.bind(this,ele)
        tableList.forEach((ele)=>{
            this.tableArray.push(
                <TouchableHighlight
                    onPress={this.onPressTable.bind(this,ele)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={styles3.style_view_commit}>
                        <Text style={{color:'#fff'}} >
                            {ele}
                        </Text>
                    </View>
                </TouchableHighlight>
            )
        });
    }
    render() {
        //let tableArray = [];
        let {cell} = this.props;
        console.log(this.props);


        return (
            <View >
                <Text style={styles3.welcome} >
                    {'钻位'+cell.position+'-选择数据表'}
                </Text>
                {this.tableArray}
            </View>

        );
    }
}

const styles3 = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        color:'#63B8FF',
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    cell: {
        width: 16,
        height: 16,
        borderRadius: 3,
        backgroundColor: '#7b8994',
        margin: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellX: {
        backgroundColor: '#72d0eb',
    },
    cellO: {
        backgroundColor: '#7ebd26',
    },
    cellText: {
        fontSize: 50,
        fontFamily: 'AvenirNext-Bold',
    },
    cellTextX: {
        color: '#19a9e5',
    },
    cellTextO: {
        color: '#b9dc2f',
    },
    style_view_commit:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

function mapStateToProps(state){
    return {
        cell : state.cell.toJS()
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions : bindActionCreators( actions , dispatch )
    }
}
//export default
export default connect(
    mapStateToProps ,
    mapDispatchToProps
)(TableListView);