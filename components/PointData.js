/**
 * Created by wxk on 2016/7/18.
 */
import React,{ Component } from 'react';
import ReactNative from 'react-native';
var {
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ListView,
    MapView,
    Modal,
    Picker,
    TextInput,
    ScrollView,
    Dimensions,
    DrawerLayoutAndroid
    } = ReactNative;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/cell';

class PointData extends Component{

    constructor(props){
        super(props);
        this.navigationView = (
            <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the
                Drawer!</Text>);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.dataSource = this.ds.cloneWithRows([{title:'row1',content:'yes'}]);//, 'row 2','row 3','row 4','row 5','row 6','row 7','row 8'
    }



    onPress=()=>{

    };

    render(){
        this.navigationView
        return (
            <ScrollView>
                <TouchableHighlight
                    onPress={this.onPress}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={[styles.container,{width:Dimensions.get('window').width,height:Dimensions.get('window').height-25}]}>
                        <Text style={styles.welcome}>
                            {123}
                        </Text>
                        <TextInput/>
                        <ListView
                            dataSource={this.dataSource}
                            renderRow={(rowData) =><Text>{rowData.title}{rowData.content}</Text>}
                        />
                    </View>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}
/*<DrawerLayoutAndroid
 drawerWidth={300}
 drawerPosition={DrawerLayoutAndroid.positions.Right}
 renderNavigationView={() =>{(<Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>)
 }}>
 <Text style={{margin:10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
 <Text style={{margin:10, fontSize: 15, textAlign: 'right'}}>World!</Text>
 </DrawerLayoutAndroid>*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width:500,
        height:100,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    title: {
        fontFamily: 'Chalkduster',
        fontSize: 39,
        marginBottom: 20,
    },
    board: {
        padding: 15,
        backgroundColor: '#47525d',
        borderRadius: 10,
        position: 'absolute',
        top: 200,
        left: 300,
    },
    row: {
        flexDirection: 'row',
    },
    // CELL
    cell: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#7b8994',
        margin: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        /*position: 'absolute',
         top: 250,
         left: 300,*/
    },
    cellX: {
        backgroundColor: '#72d0eb',
    },
    cellO: {
        backgroundColor: '#7ebd26',
    },

    // CELL TEXT

    cellText: {
        //fontSize: 50,
        fontFamily: 'AvenirNext-Bold',
    },
    cellTextX: {
        color: '#19a9e5',
    },
    cellTextO: {
        color: '#b9dc2f',
    },

    // GAME OVER

    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(221, 221, 221, 0.5)',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayMessage: {
        fontSize: 40,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        fontFamily: 'AvenirNext-DemiBold',
        textAlign: 'center',
    },
    newGame: {
        backgroundColor: '#887765',
        padding: 20,
        borderRadius: 5,
    },
    newGameText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'AvenirNext-DemiBold',
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
)(PointData);

