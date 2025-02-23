import React, { useState } from 'react';
import Layout from './components/Layout';
import './AdminPanel.css';

function AdminPanel() {
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setMessage("お題を入力してください");
      return;
    }
    try {
      const response = await fetch('https://realtimeohgiri-backend.onrender.com/topics/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`お題が追加されました (ID: ${data.topic_id})`);
        setPrompt('');
      } else {
        setMessage(`エラー: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("通信エラーが発生しました");
    }
  };

  return (
    <Layout>
      <div className="admin-content">
        <h2 className="section-title">管理者用パネル - 大喜利のお題追加</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="prompt">お題:</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="4"
              placeholder="新しいお題を入力してください"
            />
          </div>
          <button type="submit" className="submit-button">追加する</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </Layout>
  );
}

export default AdminPanel;

