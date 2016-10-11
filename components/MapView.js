/**
 * Created by wxk on 2016/7/18.
 */
import React,{ Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/project';
import Cell from './Cell'

class MapView extends Component {
    /*onPressFeed = ()=> {
        this.props.navigator.push({name: 'feed'});
    };*/
    onSubmit(){
        console.log('welcome');
        this.props.navigator.push({name: 'welcome'});
    }
    render() {
        /*var rows = this.state.board.grid.map((cells, row) =>
         <View key={'row' + row} style={styles.row}>
         {cells.map((player, col) =>
         <Cell
         key={'cell' + col}
         player={player}
         onPress={this.handleCellPress.bind(this, row, col)}
         />
         )}
         </View>

         );*/
        let PList = [],
            {project} = this.props,
            index = 0 ;
        if(this.props.list) {
            this.props.list.forEach((ele,i)=> {
                PList.push(<Cell
                    Point = {ele}
                    num = {i}
                    navigator = {this.props.navigator}
                />)//<TicTacToeApp/>
            })
        }
        console.log('MapView render');
        return (
            <ScrollView >
                <Text style = {styles2.welcome}>{project.project+'选取钻位'}</Text>
                <ScrollView
                    horizontal = {true}>
                    <View style = {[styles2.container,{width: 500,height: 900,}]}>
                        { PList }
                    </View>
                </ScrollView>
                <TouchableHighlight
                    style={[styles2.style_view_commit,{top : 0 ,left : 0}]}
                    onPress={this.onSubmit.bind(this)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'提交'}
                        </Text>
                    </View>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}

const styles2 = StyleSheet.create({
    style_view_commit:{
        marginTop:0,
        //marginLeft:10,
        //marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        //width:60,
        //borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    welcome: {
        color: '#19a9e5',
        fontSize: 18,
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
});

function mapStateToProps(state){
    return {
        cell : state.cell.toJS(),
        project : state.project.toJS(),
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
)(MapView);

