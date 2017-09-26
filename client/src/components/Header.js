import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
  }
  renderContent() {
    const { auth } = this.props;
    switch (auth) {
      case null:
        return null;
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>;
          </li>
        );
      default:
        return <a href="/api/logout">Logout</a>;
    }
  }
  render() {
    console.log('this.props.auth: ', this.props.auth);
    return (
      <nav>
        <div className="nav-wrapper">
          <Link
            className="left brand-logo"
            to={this.props.auth ? '/surveys' : '/'}
          >
            Emaily
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(Header);
