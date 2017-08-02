import React from 'react'

class GitHubIssue extends React.Component {

  render() {
    return (
      <div>
        <a href={this.props.data.html_url}>
          {this.props.data.title}
        </a>
        <span>
          #{this.props.data.number} opened {this.props.data.created_at} by <a href={this.props.data.user.html_url}>{this.props.data.user.login}</a>
        </span>
        <button onClick={()=>this.props.onClick()}>vote</button>
      </div>
    );
  }
}

export default GitHubIssue
