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
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/project';
import Cell from './Cell'

class MapView extends Component {
    /*onPressFeed = ()=> {
        this.props.navigator.push({name: 'feed'});
    };*/
    //勘探点数据表
    constructor(props){
        super(props);
        let { project,login } = this.props,
            table = login.tables,
            list = table["勘探点数据表"],
            minX = list[0]["坐标X"],
            minY = list[0]["坐标Y"],
            maxX = list[0]["坐标X"],
            maxY = list[0]["坐标Y"],
            array=[];

        list.forEach((ele)=>{
            let x = ele["坐标X"],
                y = ele["坐标Y"];
            if(minX>x){
                minX = x
            }
            else {
                if(maxX<x){
                    maxX = x
                }
            }
            if(minY>y){
                minY = y
            }
            else {
                if(maxY<y){
                    maxY = y
                }
            }
            /*console.log(x);
            console.log(y);*/
        });
        let xScale = (maxX-minX)/(Dimensions.get('window').width-20),
            yScale = (maxY-minY)/(Dimensions.get('window').height-110),
            Scale = xScale>yScale?xScale:yScale;
        console.log(xScale);
        console.log(yScale);
        console.log(Scale);
        list.forEach((ele)=>{
            array.push({
                x:10+(ele["坐标X"]-minX)/Scale,
                y:10+(ele["坐标Y"]-minY)/Scale,
            })
        });

        array.forEach((ele)=>{
            console.log(ele);
        });

        /*console.log(maxX);
        console.log(maxY);
        console.log(minX);
        console.log(minY);
        console.log(maxX-minX);
        console.log(maxY-minY);
        console.log(Dimensions.get('window').height);
        console.log(Dimensions.get('window').width);
        console.log();
        console.log();*/

        /*for(ele in table){
            console.log(ele);
            console.log(table[ele]);
        }*/
        /*loginactions.getUserPrivilege(login.userid,()=>{
            console.log(login)
            console.log(login.projects)
        });*/
        this.dotList = array;
    }
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
        if(this.dotList) {
            this.dotList.forEach((ele,i)=> {
                PList.push(<Cell
                    Point = {ele}
                    num = {i}
                    navigator = {this.props.navigator}
                />)//<TicTacToeApp/>
            })
        }
        //console.log('MapView render');
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
        login : state.login.toJS(),
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

