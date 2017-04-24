
'use strict';
//选择值
import React, { Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/table/table';


class SelectValue extends Component {
    constructor(props) {
        super(props);
        let { login } = this.props;

        let fieldIDs = [];         //字段ID数组
        let MapFieldID_Name = {};      //字段ID : 字段名
        if (login.tables['表_字段']) {
            login.tables['表_字段'].forEach((item, index) => {
                if (item['表名'] === table.table) {
                    MapFieldID_Name[item['ID']] = item['字段名'];
                    fieldIDs.push(item['ID']);
                }
            })//字段ID
        }

        this.ValueItemArray = [];
        if (login.tables['选择值']) {
            login.tables['选择值'].forEach((item, i) => {
                let fieldID = item['字段ID'];
                let value = item['值'];
                let fieldName = MapFieldID_Name[fieldID];//字段名
                if (-1 !== fieldIDs.indexOf(fieldID)) {
                    this.ValueItemArray.push(value);
                }
            })
        }

        this.state = {
            CustomValue: '',//自定义的值
            FieldName: '',//字段名称
        };
    }

    componentWillMount() {
        this.ValueItemDomArray = [];
        this.ValueItemArray.forEach((ele, i) => {
            this.ValueItemDomArray.push(
                <TouchableHighlight
                    key={i}
                    onPress={this.onPressValueItem.bind(this, ele)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={[styles3.style_view_commit, { flex: 1, top: 0, left: 0 }]}>
                        <Text style={{ color: '#fff' }} >
                            {ele}
                        </Text>
                    </View>
                </TouchableHighlight>
            )
        });
    }

    //选择某个值
    onPressValueItem(newValue) {
        this.setState({
            CustomValue: newValue,
        });
    }

    //改变自定义的值
    _handleCustomChange = (newValue) => {
        this.setState({
            CustomValue: newValue,
        });
    };

    //点击确定
    onPressOK = () => {
        this.props.navigator.push({ name: 'data' });
    }

    render() {
        return (
            <View >
                <Text style={styles3.Title} >
                    {'请选择参数' + this.state.FieldName + '的值'}
                </Text>

                <View >
                    <TextInput
                        style={styles3.style_user_input}
                        placeholder='输入自定义值'
                        numberOfLines={1}
                        underlineColorAndroid={'transparent'}
                        textAlign='center'
                        onChangeText={this._handleCustomChange}
                        value={this.state.CustomValue}
                    />
                    <TouchableHighlight
                        onPress={this.onPressOK}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View style={styles3.style_view_commit} >
                            <Text style={{ color: '#fff' }} >
                                确定
                        </Text>
                        </View>
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 1, flexwrap : wrap ,flexDirection: 'row' }}>
                    {this.ValueItemArray}
                </View>

            </View>

        );
    }
}

const styles3 = StyleSheet.create({
    style_user_input: {
        backgroundColor: '#fff',
        marginTop: 10,
        height: 40,
    },
    style_view_commit: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#63B8FF',
        height: 35,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Title: {
        color: '#63B8FF',
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    }
});

function mapStateToProps(state) {
    return {
        cell: state.cell.toJS(),
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
)(SelectValue);