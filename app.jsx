import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import localforage from 'localforage';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    localforage.getItem('lastPrompt').then((val) => {
      if (val) setPrompt(val);
    });
  }, []);

  const askGemini = async () => {
    await localforage.setItem('lastPrompt', prompt);
    const res = await window.electronAPI.sendPrompt(prompt);
    setResponse(res);
  };

  return (
    <div className="p-4 text-white bg-zinc-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">OmniBrowser Gemini 助理</h1>
      <textarea
        className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        onClick={askGemini}
      >
        提交給 Gemini
      </button>
      <div className="mt-4 bg-zinc-800 p-4 rounded border border-zinc-700">
        <h2 className="text-xl font-semibold mb-2">回覆</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

function EmailPanel({ send }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState('');
  return (
    <div className="p-2">
      <h2 className="text-lg font-bold">📧 發送郵件</h2>
      <input className="block my-1 w-full" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
      <input className="block my-1 w-full" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea className="block my-1 w-full" placeholder="Body" rows="4" value={body} onChange={(e) => setBody(e.target.value)} />
      <button className="bg-blue-500 text-white px-2 py-1" onClick={async () => {
        const res = await window.electronAPI.sendEmail({ to, subject, body });
        setResult(JSON.stringify(res));
      }}>發送</button>
      <pre className="bg-gray-800 text-white mt-2 p-2">{result}</pre>
    </div>
  );
}

function DrivePanel() {
  const [path, setPath] = useState('');
  const [res, setRes] = useState('');
  return (
    <div className="p-2">
      <h2 className="text-lg font-bold">☁️ 上傳到 Google Drive</h2>
      <input className="block my-1 w-full" placeholder="檔案路徑" value={path} onChange={(e) => setPath(e.target.value)} />
      <button className="bg-green-500 text-white px-2 py-1" onClick={async () => {
        const result = await window.electronAPI.uploadFile(path);
        setRes(JSON.stringify(result));
      }}>上傳</button>
      <pre className="bg-gray-800 text-white mt-2 p-2">{res}</pre>
    </div>
  );
}

function BookmarkPanel() {
  const [bookmark, setBookmark] = useState('');
  const [list, setList] = useState([]);
  return (
    <div className="p-2">
      <h2 className="text-lg font-bold">🔖 書籤管理</h2>
      <input className="block my-1 w-full" placeholder="輸入書籤" value={bookmark} onChange={(e) => setBookmark(e.target.value)} />
      <button className="bg-yellow-500 text-white px-2 py-1" onClick={async () => {
        await window.electronAPI.saveBookmark({ title: bookmark, time: Date.now() });
        const updated = await window.electronAPI.getBookmarks();
        setList(updated);
      }}>儲存</button>
      <ul className="mt-2">
        {list.map((b, i) => (<li key={i}>📌 {b.title}</li>))}
      </ul>
    </div>
  );
}
