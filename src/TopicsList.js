// src/TopicsList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TopicsList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('https://realtimeohgiri-backend.onrender.com/topics')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>大喜利のお題一覧</h2>
      {topics.map(topic => (
        <div key={topic.id} className="topic-card" style={{border: '1px solid #ccc', padding: '10px', margin: '10px'}}>
          <h3>{topic.prompt}</h3>
          <p>残り時間: {Math.max(0, Math.floor(topic.remaining_time / 60))}分</p>
          <p>回答数: {topic.answers_count}</p>
          <Link to={`/topic/${topic.id}`}>詳細を見る</Link>
        </div>
      ))}
    </div>
  );
}

export default TopicsList;
