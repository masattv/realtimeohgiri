import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:5000/topics');
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>リアルタイム大喜利</h1>
      </header>
      <main className="main">
        <h2 className="section-title">大喜利のお題一覧</h2>
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

