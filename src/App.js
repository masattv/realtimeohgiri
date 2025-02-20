import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [topics, setTopics] = useState([]);

  const fetchTopics = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/topics`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>リアルタイム大喜利</h1>
          <nav className="header-nav">
            {/* 必要に応じてナビゲーションリンクを追加 */}
          </nav>
        </div>
      </header>
      <main className="main">
        <h2 className="section-title">みんなのお題</h2>
        <div className="topics-grid">
          {topics.map((topic) => (
            <Link 
              key={topic.id} 
              to={`/topic/${topic.id}`}
              className={`topic-card ${topic.remaining_time > 0 ? 'active' : 'inactive'}`}
            >
              <div className="topic-content">
                <div className="topic-label">【お題】</div>
                <div className="topic-text">{topic.prompt}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
