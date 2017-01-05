/**
 * Created by younger on 2016/7/17.
 */
import React,{ Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    }from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/cell';
import PointData from './PointData'

class Cell extends Component{
    cellStyle() {
        switch (1) {
            case 1:
                return styles.cellO;
            case 2:
                return styles.cellX;
            default:
                return null;
        }
    }

    textStyle() {
        switch (1) {
            case 1:
                return styles.cellTextO;
            case 2:
                return styles.cellTextX;
            default:
                return {};
        }
    }

    textContents() {
        /*    switch (this.props.num) {
         case 1:
         return 'X';
         case 2:
         return 'O';
         default:
         return '';
         }*/
        let { cell } = this.props;
        return cell.value;
    }
    onPress(data){
        //console.log('tablelist');
        let { actions } = this.props;
        this.props.navigator.push({name: 'tablelist'});//callback//tablelist
        actions.SetPosition({
            num:this.props.num,
            data:data
        });
        //actions.test(this.props.num);
    }


    /*  position(top,left){
     return({position: 'absolute', top: {top}, left: {left}})
     }
     ,this.position(this.props.ptop,this.props.pleft)
     */
    render() {
        //{{top: 200, left: 300,}}
        /*if(this.props.Point){

        }*/
        let top = this.props.Point.top||this.props.Point.y,
            left = this.props.Point.left||this.props.Point.x;//.bind(this)
        return (
            <View style={{position: 'absolute',top: top, left: left}}>
                <TouchableHighlight
                    onPress={this.onPress.bind(this,this.props.Point.data)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={[styles.cell, this.cellStyle()]}>
                        <Text style={[styles.cellText, this.textStyle()]}>
                            {this.props.Point.data["钻孔编号"]}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}
//this.props.key
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width:500,
        height:100,
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
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#63B8FF',
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
        fontSize: 10,
        fontFamily: 'AvenirNext-Bold',
    },
    cellTextX: {
        color: '#19a9e5',
    },
    cellTextO: {
        //color: '#b9dc2f',
        color: '#fff',
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
)(Cell);

