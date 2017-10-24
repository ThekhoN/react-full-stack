import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSurveys } from "../../actions";

class SurveysList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }
  renderSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div key={survey._id} className="card darken-1">
          <div className="card-content ">
            <span className="card-title">{survey.title}</span>
            <p>{survey.body}</p>
            <p className="righ">
              Sent on: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action">
            <a href="">Yes: {survey.yes}</a>
            <a href="">No: {survey.no}</a>
          </div>
        </div>
      );
    });
  }
  render() {
    const { surveys } = this.props;
    console.log(surveys);
    return <div>{this.renderSurveys()}</div>;
  }
}

// const mapDispatchToProps = dispatch => ({
//   fetchSurveys: () => dispatch(fetchSurveys())
// });
const mapStateToProps = state => ({
  surveys: state.surveys
});

// export default connect(mapStateToProps, mapDispatchToProps)(SurveysList);
export default connect(mapStateToProps, { fetchSurveys })(SurveysList);
