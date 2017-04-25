/**
 * Created by wxk on 2016/7/18.
 */
'use strict';
import React, { Component } from 'react';
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
import * as actions from '../actions/project/project';
import Cell from './Cell';//点组件,钻孔

//选择钻孔
class MapView extends Component {

    //勘探点数据表
    constructor(props) {
        super(props);
        let { login } = this.props,//project
            table = login.tables,
            list = table["勘探点数据表"],
            tableEarth = table["土层表"],
            minX = 9999999,//list[0]["坐标X"],
            minY = 9999999,//list[0]["坐标Y"],
            maxX = -9999999,//list[0]["坐标X"],
            maxY = -9999999;//list[0]["坐标Y"],
        this.dotList = [];
        list.forEach((ele) => {
            let x = ele["坐标X"],
                y = ele["坐标Y"];
            if (minX > x) {
                minX = x
            }
            else {
                if (maxX < x) {
                    maxX = x
                }
            }
            if (minY > y) {
                minY = y
            }
            else {
                if (maxY < y) {
                    maxY = y
                }
            }
        });
        let xScale = (maxX - minX) / (Dimensions.get('window').width - 20);
        let yScale = (maxY - minY) / (Dimensions.get('window').height - 110);
        let Scale = xScale > yScale ? xScale : yScale;
        /*console.log(xScale);
        console.log(yScale);
        console.log(Scale);*/
        list.forEach((ele) => {

            let earthHole = ele["钻孔编号"];
            //在土层表中找有没有数据
            let isFindData = 0;
            for (let i = 0; i < tableEarth.length; i++) {
                let eleEarth = tableEarth[i];
                if (earthHole === eleEarth["钻孔编号"]) {
                    isFindData = 1;
                    break;
                }
            }

            this.dotList.push({
                x: 10 + (ele["坐标X"] - minX) / Scale,
                y: 10 + (ele["坐标Y"] - minY) / Scale,
                isWorking: isFindData,   //是否已经开始工作
                data: ele
            });
        });
    }

    render() {
        let CellArray = [];
        let { project } = this.props;

        if (this.dotList) {
            this.dotList.forEach((ele, i) => {
                CellArray.push(<Cell
                    key={`point${i}`}
                    Point={ele}
                    navigator={this.props.navigator}
                />)//<TicTacToeApp/>
            })
        }

        return (
            <ScrollView >
                <Text style={styles2.welcome}>{project.project + ' 选取钻孔'}</Text>
                <TouchableHighlight
                    style={[styles2.style_view_commit, { top: 0, left: 0 }]}
                    onPress={() => {this.props.navigator.pop({ name: 'welcome' });}}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{ color: '#fff' }} >
                            {'返回项目列表'}
                        </Text>
                    </View>
                </TouchableHighlight>
                <ScrollView
                    horizontal={true}>
                    <View style={[styles2.container, { width: 500, height: 900, }]}>
                        {CellArray}
                    </View>
                </ScrollView>

            </ScrollView>
        );
    }
}

const styles2 = StyleSheet.create({
    style_view_commit: {
        marginTop: 0,
        //marginLeft:10,
        //marginRight:10,
        backgroundColor: '#63B8FF',
        height: 35,
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
    }
});

function mapStateToProps(state) {
    return {
        cell: state.cell.toJS(),
        project: state.project.toJS(),
        login: state.login.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
//export default
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapView);

