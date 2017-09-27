const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
// module.exports = app => {
//   app.post('/api/stripe', (req, res) => {

//     stripe.charges.create({
//       amount: 500,
//       currency: 'usd',
//       description: '$5 for 5 surveys',
//       source: req.body.id
//     });

//   });
// };

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    // using requireLogin middleware to ensure user is logged in

    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 surveys',
      source: req.body.id
      // req.body.id -> id of the token generated from stripe on entering billing info accessed via bodyParser via dispatch AC handleToken
    });

    // req.user -> current logged in user in db ~ who is logged in
    req.user.credits += 5;
    const updatedUser = await req.user.save();
    res.send(updatedUser);
  });
};
