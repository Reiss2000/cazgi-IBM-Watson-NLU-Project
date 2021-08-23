import "./bootstrap.min.css";
import "./App.css";
import EmotionTable from "./EmotionTable.js";
import React from "react";
import axios from "axios";

class App extends React.Component {
  state = { innercomp: <textarea rows="4" cols="50" id="textinput" />, mode: "text", sentimentOutput: [], sentiment: true };

  renderTextArea = () => {
    document.getElementById("textinput").value = "";
    if (this.state.mode === "url") {
      this.setState({ innercomp: <textarea rows="4" cols="50" id="textinput" />, mode: "text", sentimentOutput: [], sentiment: true });
    }
  };

  renderTextBox = () => {
    document.getElementById("textinput").value = "";
    if (this.state.mode === "text") {
      this.setState({ innercomp: <textarea rows="1" cols="50" id="textinput" />, mode: "url", sentimentOutput: [], sentiment: true });
    }
  };

  sendForSentimentAnalysis = () => {
    this.setState({ sentiment: true });
    let ret = "";
    let url = ".";

    if (this.state.mode === "url") {
      url = url + "/url/sentiment?url=" + document.getElementById("textinput").value;
    } else {
      url = url + "/text/sentiment?text=" + document.getElementById("textinput").value;
    }
    ret = axios.get(url);
    ret.then((response) => {
      let sentiment;
      let confidence;
      if (this.state.mode === "url") {
        sentiment = response.data.result.entities[0].sentiment;
        confidence = response.data.result.entities[0].confidence;
      } else {
        sentiment = response.data.result.keywords[0].sentiment;
      }
      let output;
      if (sentiment.label === "positive") {
        output = (
          <div style={{ fontSize: 20, marginTop: "20px" }}>
            {confidence && <p style={{ color: "black" }}>Confidence score: {confidence}</p>}
            <p style={{ color: "green" }}>Sentiment score: {sentiment.score}</p>
          </div>
        );
      } else if (sentiment === "negative") {
        output = (
          <div style={{ fontSize: 20, marginTop: "20px" }}>
            <p style={{ color: "red" }}>Sentiment score: {sentiment.score}</p>
            {confidence && <p style={{ color: "black" }}>Confidence score: {confidence}</p>}
          </div>
        );
      } else {
        output = (
          <div style={{ fontSize: 20, marginTop: "20px" }}>
            <p style={{ color: "orange" }}>Sentiment score: {sentiment.score}</p>
            {confidence && <p style={{ color: "black" }}>Confidence score: {confidence}</p>}
          </div>
        );
      }
      this.setState({ sentimentOutput: output });
    });
  };

  sendForEmotionAnalysis = () => {
    this.setState({ sentiment: false });
    let ret = "";
    let url = ".";
    if (this.state.mode === "url") {
      url = url + "/url/emotion?url=" + document.getElementById("textinput").value;
    } else {
      url = url + "/text/emotion/?text=" + document.getElementById("textinput").value;
    }
    ret = axios.get(url);

    ret.then((response) => {
      let emotions;
      let confidence;
      if (this.state.mode === "url") {
        emotions = response.data.result.entities[0].emotion;
        confidence = response.data.result.entities[0].confidence;
      } else {
        emotions = response.data.result.keywords[0].emotion;
        console.log(emotions);
      }
      this.setState({ sentimentOutput: <EmotionTable emotions={emotions} confidence={confidence} /> });
    });
  };

  render() {
    return (
      <div className="App">
        <button className="btn btn-info" onClick={this.renderTextArea}>
          Text
        </button>
        <button className="btn btn-dark" onClick={this.renderTextBox}>
          URL
        </button>
        <br />
        <br />
        {this.state.innercomp}
        <br />
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>
          Analyze Sentiment
        </button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>
          Analyze Emotion
        </button>
        <br />
        {this.state.sentimentOutput}
      </div>
    );
  }
}

export default App;
