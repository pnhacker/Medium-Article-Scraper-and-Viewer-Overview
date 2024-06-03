import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setTopic(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Topic is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/scrape', { topic });
      setArticles(response.data);
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Medium Article Scraper</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={topic}
            onChange={handleInputChange}
            placeholder="Enter a topic"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Scraping...' : 'Scrape Articles'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="articles">
          {articles.map((article, index) => (
            <div key={index} className="article">
              <h2>{article.title}</h2>
              <p>{article.author}</p>
              <p>{new Date(article.publicationDate).toLocaleDateString()}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
