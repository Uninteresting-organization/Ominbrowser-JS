let bookmarks = [];
ipcMain.handle('save-bookmark', (_, data) => {
  bookmarks.push(data);
  return { success: true };
});
ipcMain.handle('get-bookmarks', () => bookmarks);
