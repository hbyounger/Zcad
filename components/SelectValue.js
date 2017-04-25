
'use strict';
//选择值
import React, { Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/table/table';


class SelectValue extends Component {
    constructor(props) {
        super(props);
        let { login, table } = this.props;

        this.fieldID = this.props.table.fieldID;         //字段ID
        let curValue = this.props.table.curvalue;

        this.ValueItemArray = [];//选择值
        if (login.tables['选择值']) {
            login.tables['选择值'].forEach((item, i) => {
                let fieldID = item['字段ID'];
                let value = item['值'];
                if (this.fieldID === fieldID) {
                    this.ValueItemArray.push(value);
                }
            })
        }

        this.state = {
            CustomValue: curValue,    //自定义的值
            FieldName: ''       //字段名称
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
                    <View style={[styles3.style_select]}>
                        <Text style={{ color: '#ffffff' }} >
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

    onPressOK(newValue) {
        alert(this.state.CustomValue);
        this.props.router.callBack(this.state.CustomValue);
        this.props.navigator.pop({ name: 'data' }); 
    }

    //改变自定义的值
    _handleCustomChange = (newValue) => {
        this.setState({
            CustomValue: newValue,
        });
    };

    render() {
        return (
            <View >
                <Text style={styles3.Title} >
                    {'请选择参数' + this.state.FieldName + '的值'}
                </Text>

                <View >
                    <View style={{ flex: 1, flexWrap: 'wrap', flexGrow: 1, flexDirection: 'row' }}>
                        <TouchableHighlight
                            onPress={() => { this.props.navigator.pop({ name: 'data' }); }}
                            underlayColor="transparent"
                            activeOpacity={0.5}>
                            <View style={[styles3.style_view_commit, { flex: 1 }]} >
                                <Text style={{ color: '#ffffff' }} >
                                    返回
                        </Text>
                            </View>
                        </TouchableHighlight>
                        <TextInput
                            style={[styles3.style_user_input, { flex: 3 }]}
                            placeholder='输入值'
                            numberOfLines={1}
                            underlineColorAndroid={'transparent'}
                            autoFocus={true}
                            textAlign='center'
                            onChangeText={this._handleCustomChange}
                            value={this.state.CustomValue}
                        />

                        <TouchableHighlight
                            onPress={this.onPressOK.bind(this)}
                            underlayColor="transparent"
                            activeOpacity={0.5}>
                            <View style={[styles3.style_view_commit, { flex: 1 }]} >
                                <Text style={{ color: '#ffffff' }} >
                                    确定
                        </Text>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>

                <View style={{ flex: 1, flexWrap: 'wrap',  flexDirection: 'row',alignItems:'flex-start' }}>
                    {this.ValueItemDomArray}
                </View>

            </View>

        );
    }
}

const styles3 = StyleSheet.create({
    style_user_input: {
        backgroundColor: '#ffffff',
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
    style_select: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ff99ff',
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
        table: state.table.toJS(),
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