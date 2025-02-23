// src/TopicDetail.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Layout from './components/Layout';
import './TopicDetail.css';

function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [socket, setSocket] = useState(null);

  // fetchTopicをuseCallbackでメモ化
  const fetchTopic = useCallback(() => {
    fetch(`https://realtimeohgiri-backend.onrender.com/topics/${id}`)
      .then(res => res.json())
      .then(data => {
        setTopic(data);
        setAnswers(data.answers);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    // WebSocket接続を確立
    const newSocket = io('https://realtimeohgiri-backend.onrender.com');
    setSocket(newSocket);

    // コメンタリーの更新をリッスン
    newSocket.on('commentary_updated', (data) => {
      setAnswers(prevAnswers => 
        prevAnswers.map(answer =>
          answer.id === data.answer_id
            ? { ...answer, commentary: data.commentary }
            : answer
        )
      );
    });

    // 新しい回答が投稿されたときにトピックを再取得
    newSocket.on('new_answer_posted', () => {
      fetchTopic();
    });

    return () => newSocket.close();
  }, [fetchTopic]);

  // トピックの初期取得
  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const submitAnswer = () => {
    if (!answerText.trim()) return;
    fetch(`https://realtimeohgiri-backend.onrender.com/topics/${id}/answers`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ answer_text: answerText })
    })
    .then(res => res.json())
    .then(() => {
      setAnswerText("");
      // 新しい回答が投稿されたことをサーバーに通知
      socket?.emit('answer_posted');
      fetchTopic();
    })
    .catch(console.error);
  };

  const voteAnswer = (answerId) => {
    fetch(`https://realtimeohgiri-backend.onrender.com/answers/${answerId}/vote`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setAnswers(answers.map(ans =>
          ans.id === answerId ? { ...ans, vote_count: data.vote_count } : ans
        ));
      })
      .catch(console.error);
  };

  if (!topic) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="topic-detail">
        <h2 className="section-title">{topic.prompt}</h2>
        <div className="answer-section">
          <h3 className="section-title">回答一覧</h3>
          <div className="answers-list">
            {answers.map(answer => (
              <div key={answer.id} className="answer-card">
                <p className="answer-text">{answer.answer_text}</p>
                <p className="commentary"><strong>総評:</strong> {answer.commentary || "生成中..."}</p>
                <div className="vote-section">
                  <span>投票数: {answer.vote_count}</span>
                  <button onClick={() => voteAnswer(answer.id)} className="vote-button">Vote</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="submit-section">
          <h3 className="section-title">回答を投稿する</h3>
          <textarea
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
            placeholder="あなたの回答を入力してください"
            className="answer-input"
          />
          <button onClick={submitAnswer} className="submit-button">送信</button>
        </div>
      </div>
    </Layout>
  );
}

export default TopicDetail;
