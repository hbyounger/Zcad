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
    ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import * as actions from '../actions/cell';
import * as projectActions from '../redux/project';
import * as loginActions from '../actions/login';
import Cell from './Cell';
import Realm from 'realm';

const CarSchema = {
  name: 'Car',
  properties: {
    make:  'string',
    model: 'string',
    miles: {type: 'int', default: 0},
  }
};

const PersonSchema = {
  name: 'Person',
  properties: {
    name:     'string',
    birthday: 'date',
    cars:     {type: 'list', objectType: 'Car'},
    picture:  {type: 'data', optional: true}, // optional property
  }
};
//工程表
const ProjectSchema = {
    name : 'Projects',
    properties: {
        projectID :'int',
        projectName : 'string',
        tablesListID : {
            type: 'list',
            objectType: 'Tables',
        }
    }
};
//表表
const TableSchema = {
    name : 'Tables',
    properties: {
        tableID :'int',
        projectID :'int',
        tableType : 'string',
        fieldsID : {
            type : 'list',
            objectType : 'Field'
        },
    }
}
//字段表
const FieldSchema = {
    name : 'Field',
    properties: {
        fieldID :'int',
        tableID :'int',
        fieldName : 'string',
        typeName : 'string',
        typeID : 'int',
    }
}
//标贯表:ID 钻孔编号 试验点的底深度 杆长 标贯击数 试验编号
const BGSchema = {
    name : 'biaoguan',
    properties :　{
        ID : 'int',
        holeIndex : 'int',

    }
}
//波速表：钻孔编号 试验点的深度 横波波速 纵波波速 ID
const BSSchema ={
    name : 'bosu',
    properties : {
        ID : 'int',
        holeIndex : 'int',
        pointDepth : 'float',
        HWSpeed : 'float',
        VWSpeed : 'float',
    }
}

//场地地层表：
//主地层编号 亚地层编号 地质时代 成因 岩土类名 岩土名称 亚岩土名称 颜色 密实度 湿度 可塑性 浑圆度 均匀性
//风化程度 岩石倾向 岩石倾角 矿物成分 结构构造 包含物 气味 描述 压缩模量 ID
const layerSchema = {
    name : 'string',
    properties : {
        ID : 'int',
        mainLayerInx : 'int',
        subLayerInx : 'int',
        GeoTime : 'string',
        reason : 'string',
        rockType : 'string',
        rockName : 'string',
        subRockName : 'string',
        color : 'string',
        density : 'string',
        humidity :'string',
        plasticity : 'string',
        circular : 'string',
        evenness : 'string',
        weathing : 'string',
        rockOrientation :'float',
        rockAngle : 'float',
        materialIngredient : 'string',
        structure : 'string',

    }
}
//动探表：钻孔编号 试验点的底深度 动探类型 杆长 动探击数 ID

//静探表：钻孔编号 实验点底深度 静探类型 锥头阻力 侧壁摩阻力 磨阻比 ID

//勘探点数据表：钻孔编号 孔口标高 勘探深度 坐标X 坐标Y 勘探点类型 探井深度 勘探日期 ID 钻孔直径 水位高程

//剖线数据表： 剖线编号 剖线孔号 ID

//取样表: 钻孔编号 取样编号 取样类型 取样深度 取样长度 ID

//土层表 钻孔编号 层底深度 主地层编号  亚地层编号 地质时代 成因 地层厚度 岩土类名 岩土名称  土名代号 亚岩土名称 颜色 
//密实度 湿度 可塑性 压缩性 浑圆度 均匀性 风化程度 包含物 气味 描述 ID

//岩心采取率、RQD表： ID 钻孔编号 深度 岩心采取率 RQD 备注

//字段类型：
const FieldType = {
    typeID : 'int',
    typeName : 'string',
} 

class WelcomeView extends Component {
    constructor(props){
        super(props);
        // Initialize a Realm with Car and Person models
        let realm = new Realm({
            schema: [
                ProjectSchema, 
                TableSchema,
                FieldSchema,
                BGSchema,
                BSSchema]
            });

        this.projectList = ['项目1','项目2','项目3','项目4','项目5'];
    }
    onPressMap(value){
        let {projectActions} = this.props;
        this.props.navigator.push({name: 'map'});
        projectActions.SetProject(value);
    }
    onSubmit(){
        this.props.navigator.push({name: 'login'});
    }
    onTest(){
        let { loginactions,login } = this.props;
        console.log(login);
        loginactions.getUserPrivilege(login.userid);
        //loginactions.getAllData();
        //this.props.navigator.push({name: 'realm'});//callback//promise
    }
    renderProgressEntry = (entry)=>{
        //styles.style_view_commit
        //listStyles.li
        return (
            <TouchableHighlight
                onPress={this.onPressMap.bind(this,entry)}
                underlayColor="transparent"
                activeOpacity={0.5}>
                <View style={styles.style_view_commit}>
                    <View>
                        <Text style={{color:'#fff'}}>{entry}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
    /*<TouchableHighlight
     onPress={this.onPressMap.bind(this,entry)}
     underlayColor="transparent"
     activeOpacity={0.5}>

     </TouchableHighlight>*/
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
        let ProjectArray = [];//.bind(this,ele)
        //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(this.projectList){
            this.projectList.forEach((ele)=>{
                ProjectArray.push(
                    <TouchableHighlight
                        onPress={this.onPressMap.bind(this,ele)}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View style={styles.style_view_commit}>
                            <Text style={{color:'#fff'}} >
                                {ele}
                            </Text>
                        </View>
                    </TouchableHighlight>
                )
            })
        }
        /*<ListView
         dataSource={ds.cloneWithRows(this.projectList)}
         renderRow={this.renderProgressEntry}
         style={listStyles.liContainer}/>*/
        return (

            <View >
                <Text style={styles.welcome} >
                    选择项目
                </Text>
                {ProjectArray}
                <TouchableHighlight
                    style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                    onPress={this.onSubmit.bind(this)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'退出'}
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                    onPress={this.onTest.bind(this)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'数据库测试'}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>

        );
    }
}
/*const listStyles = StyleSheet.create({
    li: {
        borderBottomColor: '#c8c7cc',
        borderBottomWidth: 0.5,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
    },
    liContainer: {
        backgroundColor: '#fff',
        flex: 1,
        paddingLeft: 15,
    },
    liIndent: {
        flex: 1,
    },
    liText: {
        color: '#333',
        fontSize: 17,
        fontWeight: '400',
        marginBottom: -3.5,
        marginTop: -3.5,
    },
});*/
const styles = StyleSheet.create({
    style_view_exit:{
        marginTop:25,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        //width:60,
        //borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        cell : state.cell.toJS(),
        login : state.login.toJS()
    }
}

function mapDispatchToProps(dispatch){
    return {
        projectActions : bindActionCreators( projectActions , dispatch ),
        loginactions : bindActionCreators( loginActions , dispatch )
    }
}
//export default
export default connect(
    mapStateToProps ,
    mapDispatchToProps
)(WelcomeView);

