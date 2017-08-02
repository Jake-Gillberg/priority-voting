import React, { Component } from 'react'
import ERC20Contract from '../build/contracts/ERC20.json'
import ERC20VotingContract from '../build/contracts/ERC20Voting.json'
import getWeb3 from './utils/getWeb3'
import GitHubIssueList from './components/GitHubIssueList'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const Contract = require('truffle-contract')

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      erc20Address: null,
      erc20VotingAddress: null,
      accounts: []
    }
  }

  componentDidMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      this.initContracts();
      this.initAccounts();

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  initContracts() {
    this.getERC20VotingInstance()
      .then((erc20VotingInstance) => {
        this.setState({
          erc20VotingAddress: erc20VotingInstance.address
        });
        return erc20VotingInstance.token.call();
      })
      .then((address) => {
        this.setState({
          erc20Address: address
        });
      });
  }

  initAccounts() {
    this.state.web3.eth.getAccounts((error, accounts) => {
        this.setState({
          accounts: accounts
        });
    })
  }

  getERC20Instance() {
    let ERC20 = Contract(ERC20Contract);
    ERC20.setProvider(this.state.web3.currentProvider);
    return ERC20.at(this.state.erc20Address);
  }

  getERC20VotingInstance() {
    let ERC20Voting = Contract(ERC20VotingContract);
    ERC20Voting.setProvider(this.state.web3.currentProvider);
    return ERC20Voting.deployed();
  }

  approveERC20Withdrawl(amount) {
    return this.getERC20Instance()
      .then((erc20Instance) => {
        return erc20Instance.approve(this.state.erc20VotingAddress, amount, {from: this.state.accounts[0]});
      });
  }

  sendVote(key, amount) {
    return this.getERC20VotingInstance()
      .then((erc20VotingInstance) => {
        return erc20VotingInstance.vote(key, amount, {from: this.state.accounts[0]});
      });
  }

  getVotesFor(key) {
    return this.getERC20VotingInstance()
      .then((erc20VotingInstance) => {
        return erc20VotingInstance.totalVotesFor.call(key);
      });
  }

  voteForIssue(user, repo, issue) {
    let amount = 1;
    this.approveERC20Withdrawl(amount)
      .then(() => {
        this.sendVote(user + repo + issue.number, amount)
          .then(() => { //TODO: remove displaying of result, have other way to display result
            this.getVotesFor(user+repo+issue.number)
              .then((r)=>console.log(r.c[0]))
          });
      })
      .catch(function(e) {
        console.log(e);
      });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <GitHubIssueList
                user='rchain' repo='Members'
                voteForIssue={(user, repo, issue) => this.voteForIssue(user,repo,issue)} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
