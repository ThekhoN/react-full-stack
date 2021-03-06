const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplates");

const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thank you for the feedback!");
  });

  app.get("/api/surveys", requireLogin, async (req, res) => {
    // current user ~ req.user
    // select ~ projection ~ do not include recipients
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    res.send(surveys);
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice");
    // const pathname = new URL(url).pathname;
    const events = _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      .compact()
      .uniqBy("email", "surveyId")
      .each(({ email, surveyId, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date()
          }
        ).exec(); // execute
      })
      .value();
    console.log(events);
    res.send({});

    // console.log(req.body); // get req.body triggered by click event from sendgrid
    // before lodash chain
    /*
    const p = new Path("/api/surveys/:surveyId/:choice");
    const events = _.map(req.body, ({ email, url }) => {
      const pathname = new URL(url).pathname;
      // console.log(p.test(pathname));
      const match = p.test(pathname);
      if (match) {
        return {
          email,
          surveyId: match.surveyId,
          choice: match.choice
        };
      }
    });
    const compactEvents = _.compact(events);
    const uniqueEvents = _.uniqBy(compactEvents, "email", "surveyId");
    console.log(uniqueEvents);
    res.send({});
    */
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // send the email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    // handle errors with try and catch
    try {
      await mailer.send();
      // send mailer and then save to db
      await survey.save();

      // update user credit
      req.user.credits -= 1;
      const user = await req.user.save();

      // send back updated user as response
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
