const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "X Desktop",
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Полностью убираем верхнее меню (File, Edit и т.д.)
  mainWindow.setMenu(null);

  // Load the X (Twitter) website
  mainWindow.loadURL('https://x.com');

  // Handle external links to open in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function showWelcomeDialog() {
  const locale = app.getLocale();
  let title, message, detail, buttonLabel;

  if (locale.startsWith('ru')) {
    title = "Добро пожаловать";
    message = "Внимание: Неофициальное приложение";
    detail = "Это удобная WebView-версия X (Twitter), с любовью созданная 1mN1kO(MOLLRA) для вашего комфорта.\n\nДанное приложение не является официальным продуктом.";
    buttonLabel = "Понятно, спасибо!";
  } else if (locale.startsWith('uk')) {
    title = "Ласкаво просимо";
    message = "Увага: Неофіційний додаток";
    detail = "Це зручна WebView-версія X (Twitter), з любов'ю створена 1mN1kO(MOLLRA) для вашого комфорту.\n\nЦей додаток не є офіційним продуктом.";
    buttonLabel = "Зрозуміло, дякую!";
  } else if (locale.startsWith('es')) {
    title = "Bienvenido";
    message = "Atención: Aplicación no oficial";
    detail = "Esta es una conveniente versión WebView de X (Twitter), creada con cariño por 1mN1kO(MOLLRA) para su comodidad.\n\nEsta no es una aplicación oficial.";
    buttonLabel = "¡Entendido, gracias!";
  } else if (locale.startsWith('zh')) {
    title = "欢迎";
    message = "注意：非官方应用";
    detail = "这是一个便捷的 X (Twitter) WebView 版本，由 1mN1kO(MOLLRA) 为您的舒适体验精心制作。\n\n此应用不是官方产品。";
    buttonLabel = "明白了，谢谢！";
  } else {
    // Default to English
    title = "Welcome";
    message = "Notice: Unofficial Application";
    detail = "This is a convenient WebView wrapper for X (Twitter), lovingly created by 1mN1kO(MOLLRA) for your comfort.\n\nThis is not an official app.";
    buttonLabel = "Got it, thanks!";
  }

  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: title,
    message: message,
    detail: detail,
    buttons: [buttonLabel],
    icon: path.join(__dirname, 'build', 'icon.png')
  });
}

app.whenReady().then(() => {
  createWindow();
  showWelcomeDialog();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
