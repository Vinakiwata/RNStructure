import React, { PureComponent } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import Bar from './Bar'

class ProgressBar extends PureComponent {
  render() {
    const { width } = Dimensions.get('window');
    const { progress, loading } = this.props;
    const top = Platform.OS === 'ios' ? 66 : 56;
    return (
      <View style={{ flexDirection: 'row', paddingTop: 2, paddingBottom: 2, height: 10, position: 'absolute', top, left: 0, zIndex: 100 }}>
        {loading &&
        <Bar
          color='blue'
          unfilledColor='#ccc'
          borderRadius={2}
          progress={progress}
          height={10}
          width={width - 20}
          indeterminate={false}
          style={{ marginLeft: 10, marginRight: 10 }}
        />}
      </View>
    );
  }
}
export default ProgressBar;
