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
//import Realm from './components/realm';
import Storage from 'react-native-storage';

var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 10000,//1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,//1000 * 3600 * 24,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是写到另一个文件里，这里require引入
    // 或是在任何时候，直接对storage.sync进行赋值修改
    //sync: require('./sync')
})

global.storage = storage;
///////////////////////////////////////////
/*class MyScene extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onForward: PropTypes.func.isRequired,
        onBack: PropTypes.func.isRequired,
    }
    render() {
        return (
            <View>
                <Text>Current Scene: { this.props.title }</Text>
                <TouchableHighlight onPress={this.props.onForward}>
                    <Text>Tap me to load the next scene</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.props.onBack}>
                    <Text>Tap me to go back</Text>
                </TouchableHighlight>
            </View>
        )
    }
}*/
////////////////////////////////////////////
class Zcad extends Component {
    /*<Text style={styles.welcome}>
     Welcome to React Native!
     </Text>
     <Text style={styles.instructions}>
     To get started, edit index.android.js
     </Text>
     <Text style={styles.instructions}>
     Shake or press menu button for dev menu
     </Text>
     cd android && ./gradlew assembleRelease
     */
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
        /*this.list = [
            {top : 0 ,left : 0},
            {top : 55 ,left : 66},
            {top : 77 ,left : 23},
            {top : 111 ,left : 99},
            {top : 222 ,left : 44},
            {top : 333 ,left : 111},
            {top : 166 ,left : 55},
            {top : Dimensions.get('window').height-45,left : 0},
            {top : Dimensions.get('window').height-45,left : Dimensions.get('window').width-20},
            {top : 0,left : Dimensions.get('window').width-20},
            {top : Dimensions.get('window').height/2-22,left : Dimensions.get('window').width/2-10}];*/
    }

    /*handleTouchStart(event) {//: Object
        this.startX = event.nativeEvent.pageX;
        this.startY = event.nativeEvent.pageY;
    }

    handleTouchEnd(event) {//: Object
        var deltaX = event.nativeEvent.pageX - this.startX;
        var deltaY = event.nativeEvent.pageY - this.startY;

        var direction = -1;
        if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
            direction = deltaX > 0 ? 2 : 0;
        } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
            direction = deltaY > 0 ? 3 : 1;
        }

        if (direction !== -1) {
            //this.setState({board: this.state.board.move(direction)});
        }
    }*/
    /*<MoviesApp>123</MoviesApp>
    * <SampleApp style={styles.instructions}/>
    * <View style={styles.container}
     onTouchStart={(event) => this.handleTouchStart(event)}
     onTouchEnd={(event) => this.handleTouchEnd(event)}>
     <Text style={styles.welcome}>
     ��������Ϸ
     </Text>
     <TicTacToeApp/>
     </View>*/

     /*initialRoute={{ title: 'My Initial Scene', index: 0 }}
     renderScene={}
     (route, navigator) =><MyScene
     title={route.title}*/

     // Function to call when a new scene should be displayed
     /*onForward={ () => {
     const nextIndex = route.index + 1;
     navigator.push({
     title: 'Scene ' + nextIndex,
     index: nextIndex,
     });
     }}*/

     // Function to call to go back to the previous scene
     /*onBack={() => {
     if (route.index > 0) {
     navigator.pop();
     }
     }}
     />*/
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

   /* renderScene = (router, navigator)=>{
        let Component = null;
        this._navigator = navigator;
        switch(router.name){
            case "welcome":
                Component = WelcomeView;
                break;
            case "feed":
                Component = FeedView;
                break;
            case "default":
                Component = DefaultView;
                break;
            default: //default view
                Component = DefaultView;
        }
        return <Component navigator = {navigator} />
    }*/
    renderScene = (router, navigator)=>{
        let Component = null;
        /*let list = [
            {top : 0 ,left : 0},
            {top : 550,left : 0},
            {top : 550,left : 330},
            {top : 0,left : 330},
            {top : 270,left : 165}];*/
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
/*            case "default":
                Component = <DefaultView navigator = {navigator} />;
                break;*/
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
            /*case 'realm':
                Component = <Realm navigator = {navigator} />;
                break;*/
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

AppRegistry.registerComponent('Zcad', () => Zcad);
