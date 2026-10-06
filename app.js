import express from "express";

// Template Engine
import ejs from "ejs";

// Module to remove the stopwords (is, an, the ....)
import stopword from "stopword";

// Module to remove the Punctuations (. , !)
import removePunc from "remove-punctuation";

// Module for spell-check
import natural from "natural";

// Module to remove grammer (add / adding == add)
import lemmatizer from "wink-lemmatizer";

// Module to convert number to words
import converter from "number-to-words";

// Modules to read file and set directory path
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Module to calculate Title Similarity
import stringSimilarity from "string-similarity";

// Module to convert word to numbers
import wordsToNumbersModule from "words-to-numbers";
import dotenv from "dotenv";

import IDF from "./idf.js";
import keywords from "./keywords.js";
import length from "./length.js";
import TF from "./TF.js";
import titles from "./titles.js";
import urls from "./urls.js";

const { removeStopwords } = stopword;
const { wordsToNumbers } = wordsToNumbersModule;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const N = 3023;
const W = 27602;
const avgdl = 138.27125372146875;

// Starting the Server
const app = express();

// Function to capitalize the string
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

// Setting EJS as our view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Path to our Public Assets Folder
app.use(express.static(path.join(__dirname, "public")));

// Making a dictionary with all our keywords
const spellcheck = new natural.Spellcheck(keywords);

// GET Route to home page
app.get("/", (req, res) => {
  res.render("index");
});

// GET Route to perform our search
app.get("/search", (req, res) => {
  const query = req.query.query?.trim();
  if (!query) {
    return res.json([]);
  }
  const oldString = query.split(" ");
  const newString = removeStopwords(oldString);
  newString.sort();

  let queryKeywords = [];

  let getNum = query.match(/\d+/g);

  if (getNum) {
    getNum.forEach((num) => {
      queryKeywords.push(num);
      let numStr = converter.toWords(Number(num));
      let numKeys = numStr.split("-");
      queryKeywords.push(numStr);

      numKeys.forEach((key) => {
        let spaceSplits = key.split(" ");
        if (numKeys.length > 1) queryKeywords.push(key);
        if (spaceSplits.length > 1)
          spaceSplits.forEach((key) => {
            queryKeywords.push(key);
          });
      });
    });
  }

  for (let j = 0; j < newString.length; j++) {
    newString[j] = newString[j].toLowerCase();
    newString[j] = removePunc(newString[j]);
    if (newString[j] !== "") queryKeywords.push(newString[j]);

    var letr = newString[j].match(/[a-zA-Z]+/g);
    if (letr) {
      letr.forEach((w) => {
        queryKeywords.push(removePunc(w.toLowerCase()));
      });
    }

    let x = wordsToNumbers(newString[j]).toString();
    if (x != newString[j]) queryKeywords.push(x);
  }

  let queryKeywordsNew = queryKeywords;
  queryKeywords.forEach((key) => {
    let key1 = key;
    let key2 = lemmatizer.verb(key1);
    queryKeywordsNew.push(key2);

    let spellkey1 = spellcheck.getCorrections(key1);
    let spellkey2 = spellcheck.getCorrections(key2);
    if (spellkey1.indexOf(key1) == -1) {
      spellkey1.forEach((k1) => {
        queryKeywordsNew.push(k1);
        queryKeywordsNew.push(lemmatizer.verb(k1));
      });
    }

    if (spellkey2.indexOf(key2) == -1) {
      spellkey2.forEach((k2) => {
        queryKeywordsNew.push(k2);
        queryKeywordsNew.push(lemmatizer.verb(k2));
      });
    }
  });

  queryKeywords = queryKeywordsNew;
  console.log(queryKeywords);

  let temp = [];
  for (let i = 0; i < queryKeywords.length; i++) {
    const id = keywords.indexOf(queryKeywords[i]);
    if (id !== -1) {
      temp.push(queryKeywords[i]);
    }
  }

  queryKeywords = temp;
  queryKeywords.sort();

  let temp1 = [];
  queryKeywords.forEach((key) => {
    if (temp1.indexOf(key) == -1) {
      temp1.push(key);
    }
  });

  queryKeywords = temp1;

  let qid = [];
  queryKeywords.forEach((key) => {
    qid.push(keywords.indexOf(key));
  });

  const arr = [];

  for (let i = 0; i < N; i++) {
    let s = 0;
    qid.forEach((key) => {
      const idfKey = IDF[key];
      let tf = 0;
      for (let k = 0; k < TF[i].length; k++) {
        if (TF[i][k].id == key) {
          tf = TF[i][k].val / length[i];
          break;
        }
      }
      const tfkey = tf;
      const x = tfkey * (1.2 + 1);
      const y = tfkey + 1.2 * (1 - 0.75 + 0.75 * (length[i] / avgdl));
      let BM25 = (x / y) * idfKey;

      if (i < 2214) BM25 *= 2;
      s += BM25;
    });

    const titSim = stringSimilarity.compareTwoStrings(
      titles[i],
      query.toLowerCase()
    );
    s *= titSim;

    arr.push({ id: i, sim: s });
  }

  arr.sort((a, b) => b.sim - a.sim);

  let response = [];
  let nonZero = 0;

  const resultsToShow = Math.min(10, arr.length);
  for (let i = 0; i < resultsToShow; i++) {
    if (!arr[i]) continue;
    if (arr[i].sim != 0) nonZero++;
    const str = path.join(__dirname, "Problems");
    const str1 = path.join(str, `problem_text_${arr[i].id + 1}.txt`);

    let question;
    try {
      question = fs.readFileSync(str1).toString().split("\n");
    } catch (err) {
      console.error("Failed to read problem file:", str1, err.message);
      continue;
    }

    let n = question.length;
    let problem = "";

    if (arr[i].id <= 1773) {
      const parts = question[0].split("ListShare");
      problem = (parts.length > 1 ? parts[1] : parts[0]) + " ";
      if (n > 1) problem += question[1];
    } else {
      problem = question[0] + " ";
      if (n > 1) problem += question[1];
    }

    response.push({
      id: arr[i].id,
      title: titles[arr[i].id],
      problem: problem,
    });
  }

  console.log(response);

  setTimeout(() => {
    if (nonZero) res.json(response);
    else res.json([]);
  }, 1000);
});

app.get("/question/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 0 || id >= titles.length) {
    return res.status(404).send("Question not found");
  }

  const str = path.join(__dirname, "Problems");
  const str1 = path.join(str, `problem_text_${id + 1}.txt`);
  let text;
  try {
    text = fs.readFileSync(str1).toString();
  } catch (err) {
    return res.status(404).send("Question not found");
  }

  if (id <= 1773) {
    const parts = text.split("ListShare");
    text = parts.length > 1 ? parts[1] : parts[0];
  }

  var find = "\n";
  var re = new RegExp(find, "g");

  text = text.replace(re, "<br/>");

  let title = titles[id] || "";
  const titleParts = title.split("-");
  let temp = "";
  for (let i = 0; i < titleParts.length; i++) {
    temp += titleParts[i] + " ";
  }
  title = temp.trim();
  title = title.capitalize();
  let type = 0;
  if (id < 1774) type = "Leetcode";
  else if (id < 2214) type = "Interview Bit";
  else type = "Techdelight";
  const questionObject = {
    title,
    link: urls[id],
    value: text,
    type,
  };

  res.locals.questionObject = questionObject;
  res.locals.questionBody = text;
  res.locals.questionTitle = titles[id];
  res.locals.questionUrl = urls[id];
  res.render("question");
});

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is runnning on port " + PORT);
});
