import React from 'react'
import ReactDOM from 'react-dom/client'
// 假设你的主代码在 index.tsx 或者 App.tsx 里，请确保文件名对应
// 如果你把所有 UI 代码都写在了 index.tsx，请用下面这行：
import App from './index.tsx' 

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
