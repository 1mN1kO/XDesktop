const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
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
  if (store.get('hideWelcomeDialog')) {
    return;
  }

  const locale = app.getLocale();
  let title, message, detail, buttonLabel, checkboxLabel;

  if (locale.startsWith('ru')) {
    title = "Добро пожаловать";
    message = "ℹ️ Внимание: неофициальное приложение";
    detail = "Это неофициальное настольное приложение для X, созданное 1mN1kO (MOLLRA).\n\nПриложение использует встроенный WebView и не связано с X Corp.";
    buttonLabel = "Понятно";
    checkboxLabel = "Больше не показывать это сообщение";
  } else if (locale.startsWith('uk')) {
    title = "Ласкаво просимо";
    message = "ℹ️ Увага: неофіційний додаток";
    detail = "Це неофіційний настільний додаток для X, створений 1mN1kO (MOLLRA).\n\nДодаток використовує вбудований WebView і не пов'язаний з X Corp.";
    buttonLabel = "Зрозуміло";
    checkboxLabel = "Більше не показувати це повідомлення";
  } else if (locale.startsWith('es')) {
    title = "Bienvenido";
    message = "ℹ️ Atención: aplicación no oficial";
    detail = "Esta es una aplicación de escritorio no oficial para X, creada por 1mN1kO (MOLLRA).\n\nLa aplicación utiliza un WebView integrado y no está afiliada a X Corp.";
    buttonLabel = "Entendido";
    checkboxLabel = "No volver a mostrar este mensaje";
  } else if (locale.startsWith('zh')) {
    title = "欢迎";
    message = "ℹ️ 注意：非官方应用";
    detail = "这是由 1mN1kO (MOLLRA) 创建的 X 非官方桌面应用。\n\n该应用使用内置的 WebView，与 X Corp 无关。";
    buttonLabel = "明白了";
    checkboxLabel = "不再显示此消息";
  } else {
    // Default to English
    title = "Welcome";
    message = "ℹ️ Notice: unofficial application";
    detail = "This is an unofficial desktop application for X, created by 1mN1kO (MOLLRA).\n\nThe application uses a built-in WebView and is not affiliated with X Corp.";
    buttonLabel = "Got it";
    checkboxLabel = "Do not show this message again";
  }

  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: title,
    message: message,
    detail: detail,
    buttons: [buttonLabel],
    checkboxLabel: checkboxLabel,
    checkboxChecked: false,
    icon: path.join(__dirname, 'build', 'icon.png')
  }).then(result => {
    if (result.checkboxChecked) {
      store.set('hideWelcomeDialog', true);
    }
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
