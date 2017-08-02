import React from 'react';
import GitHub from 'github-api';

import GitHubIssue from './GitHubIssue.js';

class GitHubIssueList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      gitHubIssues: [],
    };

  }

  componentDidMount() {
    const gh = new GitHub();
    gh.getIssues(this.props.user, this.props.repo).listIssues()
    .then( (response) => {
      this.setState({gitHubIssues: response.data});
    });
  }

  handleClick(i) {
    this.props.voteForIssue(this.state.gitHubIssues[i]);
  }

  render() {
    return (
      <ul>
        {
          this.state.gitHubIssues.map( (issue, i) => {
            return (
              <li key={i}>
                <GitHubIssue
                  data={issue}
                  onClick={() => this.handleClick(i)}
                />
              </li>
            );
          })
        }
      </ul>
    );
  }

}

export default GitHubIssueList
