import './global';
import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import Web3 from 'web3';
import FigLottoContract from './build/contracts/FigLotto.json';

const coinbase = "0x833ff6f27c9c9355228048b8b861297e68a49b10";
const contractAddress = "0xd0812516bf9c66d70f57109588331ff6586faa0d";


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      account: '0x0',
      balance: 0,
      figBalance: 0,
      block: 0,
      timestamp: 0,
      betValue: 0
    };

    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      var web3 = new Web3('https://rinkeby.infura.io/');
    }

    web3.eth.getBalance(coinbase).then(balance =>
      this.setState({ balance: Number(balance / 1000000000000000000 ).toFixed(2) }));

    this.fig = new web3.eth.Contract(FigLottoContract.abi, contractAddress);

    this.bet = this.bet.bind(this);

    web3.eth.personal.unlockAccount(coinbase, "00353698", 600)
      .catch(error => console.log(error))

  }

  componentDidMount() {
    this.fig.methods.wallets(coinbase).call().
      then(wallet =>
        this.setState({figBalance:wallet.balance})
      )
  };

  async bet() {
    this.setState({ loading: true });

    betGas = await this.fig.methods.bet(9, 1231231).estimateGas();
    receipt = await this.fig.methods.bet(13, 1231231).send({from:coinbase, gas:betGas});
    bet13 = await this.fig.methods.bets(coinbase, 13).call();

    this.setState({betValue:bet13.value, loading:false})
  }


  render() {
    return (
      <View style={styles.container}>
        <Text></Text>
        <Text>Your balance is: {this.state.balance} ether</Text>
        <Text>Your FIG balance is: {this.state.figBalance}</Text>
        <Text>bet 13 value is: {this.state.betValue}</Text>
        {
          this.state.loading ?
            (<ActivityIndicator animating = {this.state.loading}/>) :
            (<Button onPress={this.bet} title='Place Bet' />)
        }
      </View>
    );
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
