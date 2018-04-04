import './global';
import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import Web3 from 'web3';
import FigLottoContract from './build/contracts/FigLotto.json';
import keystore from './keystore.json';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      balance: 0,
      figBalance: 0,
      betCount: 0
    };

    this.web3 = new Web3('https://rinkeby.infura.io/l60zpzxPk2vDRmLNrzVR');
    wallet = this.web3.eth.accounts.wallet;
    this.account = this.web3.eth.accounts.decrypt(keystore, '00353698');
    this.web3.eth.accounts.wallet.add(this.account);
    this.fig = new this.web3.eth.Contract(FigLottoContract.abi, "0xd0812516bf9c66d70f57109588331ff6586faa0d");
    this.bet = this.bet.bind(this);
  }

  componentDidMount() {
    this.web3.eth.getBalance(this.account.address)
      .then(balance =>
        this.setState({ balance: Number(balance / 1000000000000000000).toFixed(2) })
      );

    this.fig.methods.wallets(this.account.address).call().
    then(figWallet =>
      this.setState({figBalance:figWallet.balance})
    );

    this.fig.methods.playerbets(this.account.address).call()
      .then(betCount =>
        this.setState({ betCount:betCount })
      );
  };

  async bet() {
    this.setState({ loading: true });
    betGas = await this.fig.methods.bet(9, 1231231).estimateGas();
    receipt = await this.fig.methods.bet(14, 1231231).send({from: this.account.address, gas:betGas});
    betCount = await this.fig.methods.playerbets(this.account.address).call();
    figWallet = await this.fig.methods.wallets(this.account.address).call();
    this.setState({figBalance:figWallet.balance, betCount:betCount, loading:false});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text></Text>
        <Text>Your balance is: {this.state.balance} ether</Text>
        <Text>Your FIG balance is: {this.state.figBalance}</Text>
        <Text>You have placed {this.state.betCount} bets.</Text>
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
