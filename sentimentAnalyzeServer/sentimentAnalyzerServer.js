const express = require("express");
const app = new express();
const dotenv = require("dotenv");
dotenv.config();

async function getNLUInstance(analyseParams) {
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;

  const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
  const { IamAuthenticator } = require("ibm-watson/auth");

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: "2021-08-01",
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });

  let analysis = await naturalLanguageUnderstanding
    .analyze(analyseParams)
    .then((analysisRaw) => {
      let data = JSON.stringify(analysisRaw, null, 2);
      console.log(data);
      return JSON.stringify(analysisRaw, null, 2);
    })
    .catch((err) => {
      return "error:", err;
    });

  // let analysis = await naturalLanguageUnderstanding
  //   .analyze(analyseParams)
  //   .then((analysisRaw) => {
  //     return JSON.stringify(analysisRaw, null, 2);
  //   })
  //   .catch((err) => {
  //     return "error:", err;
  //   });

  return analysis;
}

function getAnalyseParams(input, isText, isEmotion) {
  let analyseParams = {
    language: "en",
    features: {
      entities: {
        emotion: isEmotion,
        sentiment: !isEmotion,
        limit: 1,
      },
      keywords: {
        emotion: isEmotion,
        sentiment: !isEmotion,
      },
    },
  };

  if (isText) {
    analyseParams.text = input;
  } else {
    analyseParams.url = input;
  }

  return analyseParams;
}

app.use(express.static("client"));

const cors_app = require("cors");
app.use(cors_app());

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/url/emotion", async (req, res) => {
  let analyseParams = getAnalyseParams(req.query.url, false, true);
  let analysis = await getNLUInstance(analyseParams);
  return res.send(analysis);
});

app.get("/url/sentiment", async (req, res) => {
  let analyseParams = getAnalyseParams(req.query.url, false, false);
  let analysis = await getNLUInstance(analyseParams);
  return res.send(analysis);
});

app.get("/text/emotion", async (req, res) => {
  let analyseParams = getAnalyseParams(req.query.text, true, true);
  let analysis = await getNLUInstance(analyseParams);
  return res.send(analysis);
});

app.get("/text/sentiment", async (req, res) => {
  let analyseParams = getAnalyseParams(req.query.text, true, false);
  let analysis = await getNLUInstance(analyseParams);
  return res.send(analysis);
});

let server = app.listen(8080, () => {
  console.log("Listening", server.address().port);
});
