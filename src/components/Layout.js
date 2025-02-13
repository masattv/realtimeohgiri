import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Layout({ children }) {
	return (
		<div className="app">
			<header className="header">
				<Link to="/" style={{ textDecoration: 'none' }}>
					<h1>リアルタイム大喜利</h1>
				</Link>
			</header>
			<main className="main">
				{children}
			</main>
		</div>
	);
}

export default Layout;