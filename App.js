import './global';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Web3 from 'web3';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      block: 0,
      timestamp: 0
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text></Text>
        <Text>The latest block number is: {this.state.block}</Text>
        <Text>The latest block's timestamp is: {this.state.timestamp}</Text>
      </View>
    );
  }

  componentWillMount() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
    );

    web3.eth.getBlock('latest').then(latestBlock =>
      this.setState({ block: latestBlock.number, timestamp: latestBlock.timestamp }));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
