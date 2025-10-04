const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  sendPrompt: (prompt) => ipcRenderer.invoke('ask-gemini', prompt),
});

// 3. Gemini Integration (gemini.js)
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

ipcMain.handle('ask-gemini', async (_, prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  return result.response.text();
});
