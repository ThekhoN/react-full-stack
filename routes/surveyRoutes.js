const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplates");

const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thank you for the feedback!");
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
