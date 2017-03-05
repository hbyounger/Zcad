/**
 * Created by younger on 2017/3/5.
 */
import React,{ Component } from 'react';
import {
    Dimensions,
    ListView,
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    TextInput,
    ScrollView,
    Alert,
    Picker
} from 'react-native';
//const Item = Picker.Item;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/table';
//import Cell from './Cell'//SvgExample
//import SvgExample from './main'
//import Example from './Map'
const RIGHT_LISTVIEW = 'right_listView';
const LEFT_LISTVIEW = 'left_listView';
const window = Dimensions.get('window');
const Item = Picker.Item;

class Grid extends Component{
    constructor(props){
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let offsetval = {x : 0, y: 0};
        let {pointInfo,data,table,login} = this.props;
        //console.log("pointInfo : " + pointInfo);
        //console.log("data : " + data);
        console.log(login.tables['表_字段'],'------------------->login.tables[表_字段]');//选择值//表_字段
        if(login.tables['表_字段']){
            this.argumentList = {};
            login.tables['表_字段'].forEach((item,index)=>{
                console.log(item,'------------------->表_字段');//选择值//表_字段
                console.log(item['字段名'],'------------------->字段名');//选择值//表_字段
                console.log(item['ID'],'------------------->ID');//选择值//表_字段
                this.argumentList[item['字段名']] = item['ID'];
            })//字段ID
        }

        if(login.tables['选择值']){
            this.optionList = {};
            this.optionIndexList = {};
            this.optionValueList = {};
            login.tables['选择值'].forEach((item,index)=>{
                console.log(item,'------------------->选择值');//选择值//表_字段
                console.log(item['字段ID'],'------------------->字段ID');//选择值//表_字段
                console.log(item['值'],'------------------->值');//选择值//表_字段

                if(this.optionList[item['字段ID']]){
                    this.optionList[item['字段ID']].push(<Item key = {index} label={item} value={`${index}`} />);
                    //this.optionValueArrayList[item['字段ID']].push(item['值']);
                    this.optionIndexList[item['值']] = `${index}`;
                    this.optionValueList[index] = item['值'];
                }
                else {
                    this.optionList[item['字段ID']]=[];
                    this.optionList[item['字段ID']].push(<Item key = {index} label={item} value={`${index}`} />);
                    //this.optionValueArrayList[item['字段ID']].push(item['值']);
                    this.optionIndexList[item['值']] = `${index}`;
                    this.optionValueList[index] = item['值'];
                }
            })
        }
        this.nameArray = [];
        this.leftArray = [];
        this.rightArray = [];

        for(let ele in data[0]){
            //console.log(ele);
            this.nameArray.push(ele)
        }
        data.forEach((ele,i)=>{
            if((ele["钻孔编号"]===pointInfo["钻孔编号"])||(!ele["钻孔编号"])){
                //this.leftArray.push(ele["ID"]?ele["ID"]:i);
                this.rightArray.push(ele);
            }
        });
        this.props.callback(this.rightArray);
        this.nameList=[];
        this.nameArray.forEach((ele,i)=>{
            this.rowNum = i;
            this.nameList.push(
                <View key = {`title${i}`} style = {styles.titleView}>
                    <Text>{ele}</Text>
                </View>
            )
        });
        this.state ={
            //leftDataSource: ds.cloneWithRows(this.leftArray),
            rightdataSource: ds1.cloneWithRows(this.rightArray),
            leftListOffset: {x : 0, y: 0},
            loaded: false,
            selected1: 'key1',
            selected2: 'key1',
            selected3: 'key1',
            color: 'red',
            mode: Picker.MODE_DIALOG,
        };
    }

    componentDidMount(){
        this.setState({
            loaded : true
        });
        //this.state.loaded = true;
    }
    onPressWelcome(){
        this.props.navigator.push({name: 'welcome'});
    }
    /*let alertMessage = 'Credibly reintermediate next-generation potentialities after goal-oriented ' +
     'catalysts for change. Dynamically revolutionize.';
     Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},]);*/
    onPressPicker(value){
        let alertMessage = value;
        Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},]);
        this.props.navigator.push({name: 'picker'});
    }

    onValChange = (key: string, value: string)=>{
        //(e)=>{rowData[ele]=e;this.onTableChange(e);
        const newState = {};
        newState[key] = value;
        this.setState(newState);
        //Alert.alert('Alert Title',key+','+value,[{text: 'OK', onPress: () => console.log('OK Pressed!')}]);
    }
    onTableChange = (e)=>{
        this.props.callback(this.rightArray);
    };
    onScroll = ()=>{
        //console.log("onScroll");
        //console.log(this.state.loaded);
        if (this.state.loaded) {//this.state.loaded
            var rightList = this.refs[RIGHT_LISTVIEW];
            //console.log(rightList)
            var y1 = rightList.scrollProperties.offset;
            //console.log(y1)
            this.setState({
                leftListOffset :{x: 0 , y: y1}
            });
        }
    }

    /*_leftRenderRow = (rowData: string, sectionID: number, rowID: number)=>{
     return (
     <View style={styles.leftListRow}>
     <Text >
     {rowData}
     </Text>
     </View>
     );
     }*/

    _rightRenderRow = (rowData: object, sectionID: number, rowID: number)=>{
        //() => Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},])  <TextInput>{rowData.name}</TextInput>
        let list=[];
        let {table,login} = this.props;


        this.nameArray.forEach((ele,i)=>{
            if(this.optionList[this.argumentList[ele]]){
                let optioList = [],
                    optionIndex = this.argumentList[ele];
                console.log(login,'------------------->login');//选择值//表_字段//字段名
                console.log(ele,'------------------->ele');
                console.log(this.argumentList[ele],'------------------->this.argumentList[ele]');

                list.push(
                    <View key = {`right${i}`}>
                        <Picker
                            style={styles.cellView}
                            selectedValue={this.optionIndexList[rowData[ele]]}
                            onValueChange={(e)=>{
                            let value = this.optionValueList[e];
                            rowData[ele]=value;
                            this.onTableChange(value);
                            }}
                            mode="dropdown">
                            {this.optionList[this.argumentList[ele]]}
                        </Picker>
                    </View>)
            }
            else {
                list.push(
                    <View key = {`right${i}`}>
                        <TextInput style = {styles.cellView} onChangeText ={(e)=>{rowData[ele]=e;this.onTableChange(e);}}>{rowData[ele]}</TextInput>
                    </View>)
            }

        });

        return (
            <View style = {styles.rightListRow}>
                {list}
            </View>
        );
    }

    render() {
        /*<View style = {styles.mingcheng}>
         <Text>Index</Text>
         </View>
         <View style = {styles.left}>
         <ListView
         ref = {LEFT_LISTVIEW}
         style = {styles.leftListView}
         contentOffset = {this.state.leftListOffset}
         showsHorizontalScrollIndicator = {false}
         showsVerticalScrollIndicator = {false}
         scrollEnabled = {false}
         bounces={false}
         // scrollEventThrottle={500}
         dataSource = {this.state.leftDataSource}
         renderRow = {this._leftRenderRow}
         />

         </View>
         */
        return (
            <ScrollView horizontal = {true} style = {styles.container}>

                <View style = {styles.right}>
                    <ScrollView
                        style = {styles.scrollView}
                        horizontal = {true}
                    >
                        <View style = {styles.contentView}>
                            <View style = {{width: 100*this.rowNum+100 , height: 40, flexDirection:'row'}}>
                                {this.nameList}
                            </View>
                            <ListView
                                ref = {RIGHT_LISTVIEW}
                                //scrollEventThrottle={500}
                                style = {styles.rightListView}
                                dataSource = {this.state.rightdataSource}
                                //onScroll={this.onScroll}
                                renderRow = {this._rightRenderRow}
                            />
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state){
    return {
        table : state.table.toJS(),
        login : state.login.toJS(),
        //cell : state.cell.toJS(),
        //project : state.project.toJS(),
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions : bindActionCreators( actions , dispatch ),
    }
}

export default connect(
    mapStateToProps ,
    mapDispatchToProps
)(Grid);

const styles = StyleSheet.create({

    welcome: {
        color: '#19a9e5',
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
    },
    container: {
        flexDirection: 'row',
        //marginTop: 20,
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    picker: {
        width: 100,
    },
    left:{
        width: 50,
        //flex: 1,
        // backgroundColor:'yellow',
        flexDirection: 'column',
    },
    right:{
        flex: 3,
        backgroundColor:'white',
    },

    mingcheng:{
        height:40,
        marginLeft:0,
        marginRight:0,
        // backgroundColor:'red',
        borderColor: '#DCD7CD',
        borderBottomWidth:1,
        borderRightWidth:1,
        borderTopWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },

    leftListView:{
        flex: 1,
        marginTop: 0,
        marginLeft:0,
        marginRight:0,
        marginBottom:30,
        // backgroundColor:'gray',
    },

    leftListRow:{
        //width:50,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
        height: 40,
        //backgroundColor:'#db384c',
        borderColor: '#DCD7CD',
        borderBottomWidth:1,
        borderRightWidth:1,
    },

    rightListRow:{
        //width: 1000 ,
        height: 40,
        flexDirection:'row'
    },

    scrollView:{
        //flex: 1,
        marginRight:1,
        marginLeft:1,
        marginTop:0,
        marginBottom:1,
        // backgroundColor: 'red',
        flexDirection:'column',
        //height:Dimensions.get('window').height-110,
        //height: window.height -50,
    },

    contentView:{

        height: window.height -120,
        //width: 900 ,
        // backgroundColor:'yellow',
        flexDirection: 'column',
    },

    rightListView:{
        flex: 1,
        // backgroundColor : 'gray'
    },

    titleView:{
        width:100,
        height:40,
        backgroundColor:'#F5FCFF',
        borderColor: '#DCD7CD',
        borderTopWidth: 1,
        borderRightWidth:1,
        borderBottomWidth:1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },
    cellView:{
        width:100,
        height:40,
        // backgroundColor:'#db384c',
        borderColor: '#DCD7CD',
        borderRightWidth:1,
        borderBottomWidth:1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },

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
});