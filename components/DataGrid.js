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
import CheckBox from 'react-native-checkbox';
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
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let offsetval = {x : 0, y: 0};
        let {pointInfo,data,table,login} = this.props;
        //console.log("pointInfo : " + pointInfo);
        //console.log("data : " + data);
        //console.log(login.tables['表_字段'],'------------------->login.tables[表_字段]');//选择值//表_字段
        let fields = [],
            fieldNameMap = {};
        if(login.tables['表_字段']){
            login.tables['表_字段'].forEach((item,index)=>{
                //console.log(item,'------------------->表_字段');//选择值//表_字段
                //console.log(item['字段名'],'------------------->字段名');//选择值//表_字段
                //console.log(item['ID'],'------------------->ID');//选择值//表_字段
                //console.log(table.table,'------------------->table.table');//选择值//表_字段
                if(item['表名']===table.table){
                    fieldNameMap[item['ID']] = item['字段名'];
                    fields.push(item['ID']);
                }
            })//字段ID
        }
        //console.log(fieldNameMap,'------------------->fieldNameMap');//选择值//表_字段
        this.optionList = {};
        this.optionIndexList = {};
        this.optionValueList = {};
        this.fieldList = {};
        if(login.tables['选择值']){
            login.tables['选择值'].forEach((item,index)=>{
                let field = item['字段ID'],
                    value = item['值'];
                //console.log(item,'------------------->选择值');//选择值//表_字段
                //console.log(field,'------------------->字段ID');//选择值//表_字段
                //console.log(value,'------------------->值');//选择值//表_字段
                if(-1!==fields.indexOf(field)){
                    if(!this.optionList[field]){
                        this.optionList[field]=[];
                        this.optionList[field].push(<Item key = {-1} label={''} value={`${-1}`} />);
                    }
                    this.optionList[field].push(<Item key = {index} label={value} value={`${index}`} />);
                    //this.optionValueArrayList[field].push(value);
                    this.optionIndexList[value] = `${index}`;
                    this.optionValueList[index] = value;
                    this.fieldList[fieldNameMap[field]] = field;//item['字段名']
                }
            })
        }
        this.nameArray = [];
        this.leftArray = [];
        this.rightArray = [];

        for(let ele in data[0]){
            console.log(ele);
            this.nameArray.push(ele)
        }
        data.forEach((ele,i)=>{
            if((ele["钻孔编号"]===pointInfo["钻孔编号"])||(!ele["钻孔编号"])){
                //this.leftArray.push(ele["ID"]?ele["ID"]:i);
                ele['check'] = false;
                //console.log(ele);
                this.rightArray.push(ele);
            }
        });
        this.nameList=[];
        this.nameArray.forEach((ele,i)=>{
            this.rowNum = i;
            if(this.fieldList[ele]){
                let optioList = [],
                    optionIndex = this.fieldList[ele];
                if(this.optionList[optionIndex]){
                    this.nameList.push(//style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                        <TouchableHighlight
                            key={`title${i}`}
                            onPress={this.onPressPicker}
                            underlayColor="transparent"
                            activeOpacity={0.5}>
                            <View  style={styles.darkTitleView}>
                                <Text>{ele}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                }
                else {
                    this.nameList.push(
                        <View key={`title${i}`} style={styles.titleView}>
                            <Text>{ele}</Text>
                        </View>
                    )
                }
            }
            else {
                this.nameList.push(
                    <View key={`title${i}`} style={styles.titleView}>
                        <Text>{ele}</Text>
                    </View>
                )
            }
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
        this.changedRowIndex = -1;
    }

    componentDidMount(){
        /*this.setState({
         loaded : true
         });*/
        this.state.loaded = true;
        //this.state.loaded = true;
    }
    onPressWelcome(){
        this.props.navigator.push({name: 'welcome'});
    }
    /*let alertMessage = 'Credibly reintermediate next-generation potentialities after goal-oriented ' +
     'catalysts for change. Dynamically revolutionize.';
     Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},]);*/
    onPressPicker = (value)=>{
        let alertMessage = value;
        //Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},]);
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
        /*this.setState({
            rightdataSource:this.ds.cloneWithRows(this.rightArray),
        })*/
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
    componentWillUpdate(nextProps : object, nextState: object){
        //console.log(nextState.rightdataSource,'------------------->nextState.rightdataSource');
        let {pointInfo,data} = this.props;
        if(nextProps.data!==data){
            this.rightArray = [];
            console.log(nextProps.data!==data,'nextProps.data!==data')
            nextProps.data.forEach((ele,i)=>{
                if((ele["钻孔编号"]===pointInfo["钻孔编号"])||(!ele["钻孔编号"])){
                    this.rightArray.push(ele);
                }
            });
            this.state.rightdataSource = this.ds.cloneWithRows(this.rightArray);
        }
        else {
            if (this.changedRowIndex != -1) {
                //console.log(this.changedRowIndex,'------------------->this.changedRowIndex');
                this.state.rightdataSource = this.ds.cloneWithRows(this.rightArray);
            }
        }
    };
    getPicker = (ele,rowData,i)=>{
        if(!this.Picker){
            this.Picker = {};
        }
        if(!this.Picker[ele]){
            this.Picker[ele] = {};
        }
        if(!this.Picker[ele][i]){
            this.Picker[ele][i] = {};
        }
        let optionIndex = this.fieldList[ele];
        //console.log(rowData,'====================>rowData');
        //console.log(rowData[ele],'====================>rowData[ele]');
        //console.log(this.optionIndexList[rowData[ele]],'====================>this.optionIndexList[rowData[ele]]');

        this.Picker[ele][i]=(<View style={styles.cellView} key = {`right${i}`}>
            <Picker
                style={styles.cellView}
                //prompt = {rowData[ele]}
                selectedValue={this.optionIndexList[rowData[ele]]?this.optionIndexList[rowData[ele]]:-1}
                onValueChange={(e)=>{
                            let value = this.optionValueList[e];
                            rowData[ele]=value;
                            this.onTableChange(value,i);
                            this.changedRowIndex = i;
                            this.changedSelectName = ele;
                            }}
                mode="dropdown">
                {this.optionList[optionIndex]}
            </Picker>
        </View>);

        this.changedRowIndex = -1
        return this.Picker[ele][i];
    }
    getList = (rowData)=>{
        this.list=[];
        let {table,login} = this.props;
        //console.log(rowData,'------------------->rowData');
        this.nameArray.forEach((ele,i)=>{
            //console.log(ele,'------------------->ele');
            if(this.fieldList[ele]){
                let optioList = [],
                    optionIndex = this.fieldList[ele];
                if(this.optionList[optionIndex]){
                    //
                    //console.log(this.optionIndexList,'------------------->this.optionIndexList');
                    //console.log(this.optionIndexList[rowData[ele]],'------------------->this.optionIndexList[rowData[ele]]');
                    this.list.push(this.getPicker(ele,rowData,i));
                    /*()=>{
                     console.log(this.optionIndexList[rowData[ele]],'------------------->this.optionIndexList[rowData[ele]]');
                     return this.optionIndexList[rowData[ele]]}*/
                }
                else {
                    this.list.push(
                        <View key = {`right${i}`}>
                            <TextInput style = {styles.cellView} onChangeText ={(e)=>{rowData[ele]=e;this.onTableChange(e);}}>{rowData[ele]}</TextInput>
                        </View>)
                }
            }
            else {

                if(ele !== 'check'){
                    this.list.push(
                        <View style = {styles.cellView} key = {`right${i}`}>
                            <TextInput style={styles.cellView} onChangeText ={(e)=>{rowData[ele]=e;this.onTableChange(e);}}>{rowData[ele]}</TextInput>
                        </View>)
                }
                else{
                    this.list.push(
                        <View style = {styles.cellView} key = {`right${i}`}>
                            <CheckBox
                                label=''
                                checked={rowData[ele]}
                                onChange={(e) => {
                    console.log('I am checked', e)
                    rowData[ele]=!e;
                    this.changedRowIndex = i;
                    this.onTableChange(e);
                    }}
                            />
                        </View>)
                }
            }
        });
        return this.list;
    }
    _rightRenderRow = (rowData: object, sectionID: number, rowID: number)=>{
        //() => Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},])  <TextInput>{rowData.name}</TextInput>
        return (
            <View style = {styles.rightListRow}>
                {this.getList(rowData)}
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
        //let _rightRenderRow = this.rightRenderRow(this.state.rightdataSource)
        //console.log(this.state.rightdataSource,'------------------->this.state.rightdataSource');

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
    darkTitleView:{
        width:100,
        height:40,
        backgroundColor:'#db384c',
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