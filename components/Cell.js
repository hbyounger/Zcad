/**
 * Created by younger on 2016/7/17.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/cell';

//钻孔
class Cell extends Component {

    cellStyle(isWorking) {
        switch (1) {
            case 0:
                return styles.cellO;    //没有数据的钻孔颜色
            case 1:
                return styles.cellX;    //有数据的钻孔颜色
            default:
                return null;
        }
    }

    onPress(data) {
        console.log('点击了 钻孔 ' + this.props.Point.data["钻孔编号"]);
        let { actions } = this.props;
        this.props.navigator.push({ name: 'tablelist' });//callback//tablelist
        actions.SetPosition({
            pointData : data
        });
    }


    render() {
        let Y = this.props.Point.y;
        let X = this.props.Point.x;
        return (
            <View style={{ position: 'absolute', top: Y, left: X }}>
                <TouchableHighlight
                    onPress={this.onPress.bind(this, this.props.Point.data)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={[styles.cell, this.cellStyle(this.props.Point.isWorking)]}>
                        <Text style={styles.cellText}>
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
    cell: {
        width: 20,
        height: 20,
        borderRadius: 10,
        margin: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        /*position: 'absolute',
         top: 250,
         left: 300,*/
    },
    cellX: {
        backgroundColor: '#FFA500',//橙色
    },
    cellO: {
        backgroundColor: '#90EE90',//淡绿色
    },

    // CELL TEXT
    cellText: {
        fontSize: 10,
        fontFamily: 'AvenirNext-Bold',
        color: '#ffffff'
    }
});

function mapStateToProps(state) {
    return {
        cell: state.cell.toJS()
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
)(Cell);

