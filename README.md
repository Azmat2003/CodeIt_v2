# CodeIt v2 — Coding Problem Search Engine

A coding problem search engine that helps developers discover relevant DSA and interview questions using natural-language queries. CodeIt processes search queries with NLP techniques and ranks matching problems using BM25-inspired relevance scoring and title similarity.

[Live Demo](https://codeit-v2.onrender.com/) · [GitHub Repository](https://github.com/Azmat2003/CodeIt_v2)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Application Routes](#application-routes)
- [Author](#author)

---

## Features

- **Natural-language search:** Find coding problems using topics, keywords, or descriptions.
- **Query processing:** Stop-word removal, punctuation cleaning, lemmatization, spell correction, and number normalization.
- **Relevance ranking:** BM25-style scoring using term frequency, inverse document frequency, document length, and title similarity.
- **Problem discovery:** Browse relevant questions sourced from LeetCode, InterviewBit, and TechDelight.
- **Problem details:** View problem statements and access the original problem links.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Backend** | Node.js, Express.js |
| **Frontend** | EJS, HTML, CSS, JavaScript |
| **Search and NLP** | BM25-inspired ranking, TF/IDF statistics, `natural`, `wink-lemmatizer`, `stopword`, `string-similarity` |
| **Deployment** | Render |

## Architecture

```text
User Query
    |
    v
Express Server (app.js)
    |
    v
Query Preprocessing
(stop words, spelling, lemmatization, number normalization)
    |
    v
Search Index & Ranking
(TF/IDF data + BM25-style scoring + title similarity)
    |
    v
Top 10 Matching Problems
    |
    v
EJS Frontend / Problem Details
```

The application uses precomputed search statistics and locally stored problem statements. The Express server preprocesses each query, scores indexed problems, and returns the highest-ranked results.

## Project Structure

```text
CodeIt_v2/
├── app.js                  # Express server and search routes
├── Problems/               # Stored coding problem statements
├── public/                 # Static frontend assets
├── views/                  # EJS templates
├── TF.js                   # Term-frequency data
├── idf.js                  # Inverse document-frequency data
├── keywords.js             # Search vocabulary
├── titles.js               # Problem titles
├── urls.js                 # Original problem URLs
├── length.js               # Document length data
├── TFIDF.js                # TF-IDF utility/data module
├── *.txt                   # Precomputed search index and metadata
└── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Azmat2003/CodeIt_v2.git
cd CodeIt_v2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

### 4. Open the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser. You can set the `PORT` environment variable to change the default port.

## Application Routes

| Route | Description |
| --- | --- |
| `GET /` | Renders the search homepage |
| `GET /search?query=...` | Returns ranked matching problems as JSON |
| `GET /question/:id` | Displays a problem statement and its source link |

## Author

Created by [Azmat2003](https://github.com/Azmat2003).
