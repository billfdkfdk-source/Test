import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // 确保你根目录下有一个 App.tsx 文件
import './index.css'

// 找到 index.html 里的那个 <div id="root"></div>
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error("找不到 root 节点，请检查 index.html 中是否有 <div id='root'></div>");
}
