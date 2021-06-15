'use strict'

import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import ViewPager from './index'

const VIEWPAGER_REF = 'viewPager'
const INDICATOR_REF = 'indicator'
export default class IndicatorViewPager extends Component {
    static defaultProps = {
        indicator: null,
        initialPage: 0,
        autoPlayInterval: 3000,
        autoPlayEnable: false,
        horizontalScroll: true
    }

    constructor (props) {
        super(props)
        this._onPageScroll = this._onPageScroll.bind(this)
        this._onPageSelected = this._onPageSelected.bind(this)
        this._goToNextPage = this._goToNextPage.bind(this)
        this._renderIndicator = this._renderIndicator.bind(this)
        this.setPage = this.setPage.bind(this)
        this.setPageWithoutAnimation = this.setPageWithoutAnimation.bind(this)
        this._startAutoPlay = this._startAutoPlay.bind(this)
        this._stopAutoPlay = this._stopAutoPlay.bind(this)
        this._currentIndex = props.initialPage
        this._childrenCount = React.Children.count(props.children)
    }

    componentDidMount () {
        if (this.props.autoPlayEnable) this._startAutoPlay()
        else this._stopAutoPlay()
    }


    componentDidUpdate(prevProps, prevState) {
        if(this.props.initialPage !== prevProps.initialPage){
            this.setPage(this.props.initialPage)
        }
        this._childrenCount = React.Children.count(this.props.children)
        if (this.props.autoPlayEnable !== prevProps.autoPlayEnable) {
            this.props.autoPlayEnable ? this._startAutoPlay() : this._stopAutoPlay()
        }
    }

    render () {
        return (
            <View style={[styles.container, this.props.style]} >
                {this._renderIndicator()}
                {/* <View style = {{shadowOffset: { width: 5, height: 5 },
                            shadowColor: '#F0F0F2',
                            shadowRadius: 5,
                            shadowOpacity: 0.8,
                            elevation: 4,
                            height: 1}}/> */}
                <ViewPager
                    {...this.props}
                    horizontalScroll={this.props.horizontalScroll}
                    ref={VIEWPAGER_REF}
                    style={[styles.pager, this.props.pagerStyle]}
                    onPageScroll={this._onPageScroll}
                    onPageSelected={this._onPageSelected}
                />
                
            </View>
        )
    }

    componentWillUnmount () {
        this._stopAutoPlay()
    }

    _onPageScroll (params) {
        let indicator = this.refs[INDICATOR_REF]
        indicator && indicator.onPageScroll && indicator.onPageScroll(params)
        this.props.onPageScroll && this.props.onPageScroll(params)
    }

    _onPageSelected (params) {
        let indicator = this.refs[INDICATOR_REF]
        indicator && indicator.onPageSelected && indicator.onPageSelected(params)
        this.props.onPageSelected && this.props.onPageSelected(params)
        this._currentIndex = params.position
    }

    _renderIndicator () {
        let {indicator, initialPage} = this.props
        if (!indicator)return null
        return React.cloneElement(indicator, {
            ref: INDICATOR_REF,
            pager: this,
            initialPage: initialPage
        })
    }

    _goToNextPage () {
        let nextIndex = (this._currentIndex + 1) % this._childrenCount
        this.setPage(nextIndex)
    }

    _startAutoPlay () {
        if (this._timerId) clearInterval(this._timerId)
        this._timerId = setInterval(this._goToNextPage, this.props.autoPlayInterval)
    }

    _stopAutoPlay () {
        if (this._timerId) {
            clearInterval(this._timerId)
            this._timerId = null
        }
    }

    setPage (selectedPage) {
        this.refs[VIEWPAGER_REF].setPage(selectedPage)
    }

    setPageWithoutAnimation (selectedPage) {
        this.refs[VIEWPAGER_REF].setPageWithoutAnimation(selectedPage)
    }
}

const styles = StyleSheet.create({
    container: {},
    pager: {flex: 1}
})
