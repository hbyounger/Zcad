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
    ScrollView,
    } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/cell';
import ReactART from 'ReactNativeART'//art
const {
    Path,
    Group,
    Shape,
    Surface,
    Transform
    } = ReactART

import MetricsPath from 'art/metrics/path'

var SVG_PATH = 'M30,30L200,200L202,200L150,200L300,500L305,550';

var pathMetrics = new MetricsPath(SVG_PATH);

var boxPath = new Path()
    .moveTo(-10, -10)
    .line(20, 0)
    .line(0, 20)
    .line(-20, 0)
    .close();

class SampleApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        }
    }

    componentDidMount() {

    }

    _animateEntrance() {
        requestAnimationFrame(() => {
            this.setState({value: this.state.value + 3});
            // This is some random number that I guessed to be the length of the Shape
            if (this.state.value <= pathMetrics.length) {
                requestAnimationFrame(this._animateEntrance.bind(this));
            }
        });
    }
    handleCellPress = ()=>{
        this.state = {
            value: 0,
        }
        this._animateEntrance();
    }
    /*
     <TouchableHighlight
     onPress={this.handleCellPress}
     underlayColor="transparent"
     activeOpacity={0.5}>
     </TouchableHighlight>
     <Cell
     key={'cell' + 1}
     player={1}
     onPress={this.handleCellPress}
     />*/
    render() {
        var point = pathMetrics.point(this.state.value);
        return (
            <Surface width={320} height={600}>
                <Shape d={SVG_PATH}
                       stroke="black" strokeDash={[this.state.value,700]}
                       strokeWidth={2} />

                <Shape d={boxPath}
                       x={point.x}
                       y={point.y}
                       stroke="blue" />
            </Surface>
        );
    }
}

class FeedView extends Component{

    goBack = ()=>{
        this.props.navigator.push({name:"default"});
    }

    render() {
        return (
            <ScrollView>
                <Text style={styles.instructions} onPress={this.goBack} >
                    I am Feed View! Tab to default view!
                </Text>
                <SampleApp style={styles.instructions}/>
            </ScrollView>
        )
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
)(FeedView);

