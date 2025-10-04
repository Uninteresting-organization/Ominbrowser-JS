const fs = require('fs');
const driveAuth = new google.auth.OAuth2(
  process.env.GDRIVE_CLIENT_ID,
  process.env.GDRIVE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
driveAuth.setCredentials({ refresh_token: process.env.GDRIVE_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: driveAuth });

ipcMain.handle('upload-file', async (_, filePath) => {
  const fileMetadata = { name: path.basename(filePath) };
  const media = {
    mimeType: 'application/octet-stream',
    body: fs.createReadStream(filePath),
  };
  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  });
  return res.data;
});