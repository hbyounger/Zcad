/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    TouchableHighlight,
    View,
    ScrollView,
    Dimensions,
    AsyncStorage,//Storage
} from 'react-native';

import configureStore from './store/configureStore'
const store = configureStore()
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions/login'
import BackAndroid from 'BackAndroid'

import FeedView from './components/FeedView'//DefaultView
import WelcomeView from './components/WelcomeView'
import DefaultView from './components/DefaultView'
import PointData from  './components/PointData'
import MapView from './components/MapView'
import DataView from './components/DataView'
import LoginView from './components/Login'
import PickerExample from './components/Picker'
import ProjectView from './components/Project'
import TableListView from './components/TableListView'
import Callback from './components/Callback';
import Promise from './components/Promise';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 10000,//1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,//1000 * 3600 * 24,
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是写到另一个文件里，这里require引入
    // 或是在任何时候，直接对storage.sync进行赋值修改
    //sync: require('./sync')
});

global.storage = storage;

class Zcad extends Component {
    startX;//: number;
    startY;//: number;
    state;//: any;

    constructor(props) {//: {}
        super(props);
        this.state = {
            //board: new GameBoard(),
        };
        this.startX = 0;
        this.startY = 0;
    }

    /*
     *  - Navigator.SceneConfigs.PushFromRight (default)
     *  - Navigator.SceneConfigs.FloatFromRight
     *  - Navigator.SceneConfigs.FloatFromLeft
     *  - Navigator.SceneConfigs.FloatFromBottom
     *  - Navigator.SceneConfigs.FloatFromBottomAndroid
     *  - Navigator.SceneConfigs.FadeAndroid
     *  - Navigator.SceneConfigs.HorizontalSwipeJump
     *  - Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
     *  - Navigator.SceneConfigs.VerticalUpSwipeJump
     *  - Navigator.SceneConfigs.VerticalDownSwipeJump*/
    configureScene = (route)=>{
        return Navigator.SceneConfigs.PushFromRight;
    }

    renderScene = (router, navigator)=>{
        let Component = null;
        this._navigator = navigator;
        switch(router.name){
            case "welcome":
                Component = <WelcomeView
                    navigator = {navigator} />;
                break;
            case "feed":
                Component = <FeedView navigator = {navigator} />;
                break;
            case "map":
                Component = <MapView navigator = {navigator} />;
                break;
            case "point":
                Component = <PointData navigator = {navigator} />;
                break;
            case "data":
                Component = <DataView navigator = {navigator} />;
                break;
            case "login":
                Component = <LoginView navigator = {navigator} />;
                break;
            case "picker":
                Component = <PickerExample navigator = {navigator}/>;
                break;
            case "project":
                Component = <ProjectView navigator = {navigator}/>;
                break;
            case "tablelist":
                Component = <TableListView navigator = {navigator}/>;
                break;
            case 'callback':
                Component = <Callback navigator = {navigator}/>;
                break;
            case 'promise':
                Component = <Promise navigator = {navigator}/>;
                break;
            default: //default view PickerExample
                Component = <DefaultView navigator = {navigator} />;
        }
        return Component;
    }
    componentDidMount() {
        let navigator = this._navigator;
        BackAndroid.addEventListener('hardwareBackPress', function() {
            if (navigator && navigator.getCurrentRoutes().length > 1) {
                navigator.pop();
                return true;
            }
            return false;
        });
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress');
    }

    render() {
        return (
            <Provider store={store}>
                <Navigator
                    initialRoute={{name: 'login'}}//callback//login//promise
                    configureScene={ this.configureScene }
                    renderScene={ this.renderScene }
                />
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
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

AppRegistry.registerComponent('Zcad', () => Zcad);//Zcad
