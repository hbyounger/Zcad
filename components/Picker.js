/**
 * Created by wxk on 2016/8/11.
 */
'use strict';

import React,{ Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    TextInput,
    ScrollView,
    Picker
} from 'react-native';
//const UIExplorerBlock = require('UIExplorerBlock');
//const UIExplorerPage = require('UIExplorerPage');
const Item = Picker.Item;

export default class PickerExample extends Component{
    /*statics: {
     title: '<Picker>',
     description: 'Provides multiple options to choose from, using either a dropdown menu or a dialog.',
     }*/
    static title = '<Picker>';
    static description = 'Provides multiple options to choose from, using either a dropdown menu or a dialog.';

    state = {
        selected1: 'key1',
        selected2: 'key1',
        selected3: 'key1',
        color: 'red',
        mode: Picker.MODE_DIALOG,
    };

    onValueChange = (key: string, value: string)=>{
        let newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    changeMode = ()=> {
        const  newMode = this.state.mode === Picker.MODE_DIALOG
            ? Picker.MODE_DROPDOWN
            : Picker.MODE_DIALOG;
        this.setState({mode: newMode});
    }

    onSubmit = ()=>{
        this.props.navigator.pop({name: 'data'});
    }
    render() {
        return (
            <View title="<Picker>">
                <View title="Basic Picker">
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.selected1}
                        onValueChange={this.onValueChange.bind(this,'selected1')}>
                        <Item label="hello" value="key0" />
                        <Item label="world" value="key1" />
                    </Picker>
                </View>
                <View title="Disabled picker">
                    <Picker style={styles.picker} enabled={false} selectedValue={this.state.selected1}>
                        <Item label="hello" value="key0" />
                        <Item label="world" value="key1" />
                    </Picker>
                </View>
                <View title="Dropdown Picker">
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange.bind(this,'selected2')}
                        mode="dropdown">
                        <Item label="hello" value="key0" />
                        <Item label="world" value="key1" />
                    </Picker>
                </View>
                <View title="Picker with prompt message">
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.selected3}
                        onValueChange={this.onValueChange.bind(this,'selected3')}
                        prompt="Pick one, just one">
                        <Item label="hello" value="key0" />
                        <Item label="world" value="key1" />
                    </Picker>
                </View>
                <View title="Picker with no listener">
                    <Picker style={styles.picker}>
                        <Item label="hello" value="key0" />
                        <Item label="world" value="key1" />
                    </Picker>
                    <Text>
                        Cannot change the value of this picker because it doesn't update selectedValue.
                    </Text>
                </View>
                <View title="Colorful pickers">
                    <Picker
                        style={[styles.picker, {color: 'white', backgroundColor: '#333'}]}
                        selectedValue={this.state.color}
                        onValueChange={this.onValueChange.bind(this, 'color')}
                        mode="dropdown">
                        <Item label="red" color="red" value="red" />
                        <Item label="green" color="green" value="green" />
                        <Item label="blue" color="blue" value="blue" />
                    </Picker>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.color}
                        onValueChange={this.onValueChange.bind(this, 'color')}
                        mode="dialog">
                        <Item label="red" color="red" value="red" />
                        <Item label="green" color="green" value="green" />
                        <Item label="blue" color="blue" value="blue" />
                    </Picker>
                </View>
                <TouchableHighlight
                    style={[styles.style_view_commit,{top : 0 ,left : 0}]}
                    onPress={this.onSubmit}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'提交'}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    picker: {
        width: 100,
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