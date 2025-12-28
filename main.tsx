import React from 'react'
import ReactDOM from 'react-dom/client'
// 请确保你的根目录下有一个叫 index.tsx 的文件（它是你的主 UI 代码）
import App from './index.tsx' 
import './index.css'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
