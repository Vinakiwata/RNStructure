'use strict'

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity,ScrollView ,Dimensions} from 'react-native'

const itemLayoutInfo = [];
const screenWidth = Dimensions.get('window').width;

const FORWARD = 1;
const NONE = 0;
const BACKWARD = -1;
const DEFAULT_ITEM_MARGIN = 0;

export default class PagerTitleIndicator extends Component {

    static defaultProps = {
        titles: [],
        initialPage: 0
    }

    state = {
        selectedIndex: this.props.initialPage
    }

    constructor(props) {
        super(props);
        this._preSelectedIndex = props.initialPage;
        this._contentHorOffset = 0;
        this._currentMaxHor = screenWidth;
        this._titleCount = props.titles.length || 0;
    }

    shouldComponentUpdate (nextProps, nextState) {
        return this.state.selectedIndex != nextState.selectedIndex ||
            this.props.titles + '' != nextProps.titles + '' ||
            this.props.style != nextProps.style ||
            this.props.itemStyle != nextProps.itemStyle ||
            this.props.itemTextStyle != nextProps.itemTextStyle ||
            this.props.selectedItemTextStyle != nextProps.selectedItemTextStyle ||
            this.props.selectedBorderStyle != nextProps.selectedBorderStyle
    }

    render () {
        let {titles, pager, itemStyle, selectedItemStyle, itemTextStyle, selectedItemTextStyle, selectedBorderStyle} = this.props
        if (!titles || titles.length === 0)return null

        let titleViews = titles.map((title, index) => {
            let isSelected = this.state.selectedIndex === index

            const itemMargin = (itemStyle && itemStyle.marginLeft) || DEFAULT_ITEM_MARGIN;
            const itemMarginObj =
                index < this._titleCount - 1
                ? { marginLeft: itemMargin }
                : { marginLeft: itemMargin, marginRight: itemMargin };

            const titleView = this.props.renderTitle ? 
                this.props.renderTitle(index, title, isSelected) 
                : 
                <Text style={isSelected ? [styles.titleTextSelected, selectedItemTextStyle] : [styles.titleText, itemTextStyle,
                    {marginHorizontal: index == 2 ? 0 : 0}]} >
                    {title}
                </Text>

            return (
                <TouchableOpacity
                    style={[styles.titleContainer, itemMarginObj, isSelected ? selectedItemStyle : itemStyle, 
                        // {width: index == 0 ? 126 : index == 1 ? 143 : 80}
                    ]}
                    activeOpacity={0.6}
                    key={index}
                    onLayout={e => {
                        itemLayoutInfo[index] = e.nativeEvent;
                    }}
                    // onPress={() => {
                    //     if(this.props.trackScroll === true){
                    //         this._visibleDetect(index);
                    //     }
                    //     !isSelected && pager.setPage(index)
                    //     this.props.onPageClick && this.props.onPageClick(index)
                    // }
                    // }
                >
                    {titleView}
                    {isSelected ? <View style={[styles.selectedBorder, selectedBorderStyle]} /> : null}
                </TouchableOpacity>
            )
        })
        return (
            <View style={[styles.indicatorContainer, this.props.style, {flexDirection: 'row'}]} >
                 {/* <ScrollView
                    scrollEventThrottle={1}
                    onScroll={e => {
                        this._contentHorOffset = e.nativeEvent.contentOffset.x;
                        this._currentMaxHor = screenWidth + this._contentHorOffset;
                    }}
                    showsHorizontalScrollIndicator={false}
                    ref={c => {
                        this.scroller = c;
                    }}
                    horizontal={true}
                    contentContainerStyle={{flex:1}}
                    scrollEnabled = {false}
                    >
                    {titleViews}
                </ScrollView> */}
                     {titleViews} 
            </View>
        )
    }

    _visibleDetect(selectedIndex) {
        const curItemLayoutInfo = itemLayoutInfo[selectedIndex];
        const { width, x: curItemOffsetX } = curItemLayoutInfo.layout;
        const curItemAbsPosition = width + curItemOffsetX + DEFAULT_ITEM_MARGIN; // add on margin

        let moveDir = NONE;
        if (selectedIndex > this._preSelectedIndex) {
            moveDir = FORWARD;
        } else if (selectedIndex < this._preSelectedIndex) {
            moveDir = BACKWARD;
        }

        if (moveDir === FORWARD) {
            //indicator move forward
            let lastItemOffsetX;
            let lastItemAbsPosition;
            if (selectedIndex < this._titleCount - 1) {
                const nextLayoutInfo = itemLayoutInfo[selectedIndex + 1];
                const width = nextLayoutInfo.layout.width;
                lastItemOffsetX = nextLayoutInfo.layout.x;
                lastItemAbsPosition = width + lastItemOffsetX + DEFAULT_ITEM_MARGIN;
            } else if (selectedIndex === this._titleCount - 1) {
                lastItemOffsetX = curItemOffsetX;
                lastItemAbsPosition = curItemAbsPosition;
            }
            if (this._contentHorOffset > lastItemOffsetX) {
                const deltaX = curItemOffsetX - DEFAULT_ITEM_MARGIN;
                this.scroller.scrollTo({ x: deltaX });
            } else if (this._currentMaxHor < lastItemAbsPosition) {
                const deltaX = lastItemAbsPosition - this._currentMaxHor;
                this.scroller.scrollTo({ x: this._contentHorOffset + deltaX });
            }
        } else if (moveDir === BACKWARD) {
            //indicator move back
            let lastItemOffsetX;
            let lastItemAbsPosition;
            if (selectedIndex > 0) {
                const nextLayoutInfo = itemLayoutInfo[selectedIndex - 1];
                const width = nextLayoutInfo.layout.width;
                lastItemOffsetX = nextLayoutInfo.layout.x;
                lastItemAbsPosition = width + lastItemOffsetX + DEFAULT_ITEM_MARGIN;
            } else if (selectedIndex === 0) {
                lastItemOffsetX = curItemOffsetX;
                lastItemAbsPosition = curItemAbsPosition;
            }
            if (this._contentHorOffset > lastItemOffsetX || this._currentMaxHor < curItemAbsPosition) {
                const deltaX = lastItemOffsetX - DEFAULT_ITEM_MARGIN;
                this.scroller.scrollTo({ x: deltaX });
            }
        }
    }

    onPageSelected (e) {
        if(this.props.trackScroll === true){
            this._visibleDetect(e.position);
        }
        this._preSelectedIndex = e.position;
        this.setState({selectedIndex: e.position})
    }
}


const styles = StyleSheet.create({
    indicatorContainer: {
        height: 40,
        backgroundColor: '#F6F6F6'
    },
    titleText: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
        textAlign: 'center',
    },
    titleTextSelected: {
        color: '#FF7200',
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
        textAlign: 'center',
    },
    titleTextDisable: {
        color: '#FEFEFE4D',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    icon: {
        fontSize: 15,
        color: '#637280',
        marginLeft: 8,
    },
    iconSelected: {
        fontSize: 15,
        color: '#00A741',
        marginLeft: 8
    },
    titleContainer: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'white',
    },
    selectedBorder: {
        backgroundColor: '#FF7200',
        height: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    listContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
