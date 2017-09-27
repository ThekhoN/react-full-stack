import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

// amount is defined in cents ~ 100 cents = 1 $
class Payments extends Component {
  render() {
    return (
      <StripeCheckout
        name="Emaily"
        description="$5 for 5 email credits"
        amount={500}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="btn">Add Credits</button>
      </StripeCheckout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  handleToken: token => dispatch(actions.handleToken(token))
});

// export default connect(null, actions)(Payments);
export default connect(null, mapDispatchToProps)(Payments);
