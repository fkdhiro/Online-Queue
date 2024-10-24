const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const screenshot = require('screenshot-desktop');
const sharp = require('sharp');
const vision = require('@google-cloud/vision');
const { API_KEY } = require('./config');

const client = new vision.ImageAnnotatorClient({
    apiKey: API_KEY
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.loadURL("http://localhost:3001");
}

let isShortcutActive = true;

app.whenReady().then(() => {
    createWindow();

    const registerScreenshotShortcut = () => {
        if (isShortcutActive) {
            globalShortcut.register('Z', async () => {
                try {
                    const img = await screenshot({ format: 'png' });

                    const x = 30;
                    const y = 230;
                    const width = 370;
                    const height = 200;

                    // Verifica as dimensões da imagem
                    const { width: imgWidth, height: imgHeight } = await sharp(img).metadata();

                    // Verifica se as coordenadas de extração estão dentro dos limites da imagem
                    if (x < 0 || y < 0 || width <= 0 || height <= 0 || (x + width) > imgWidth || (y + height) > imgHeight) {
                        throw new Error('As coordenadas de extração estão fora dos limites da imagem.');
                    }

                    // Usando sharp para cortar a imagem
                    const croppedBuffer = await sharp(img)
                        .extract({ left: x, top: y, width: width, height: height }) // Recorta a imagem
                        .png()
                        .toBuffer();

                    const imageBase64 = `data:image/png;base64,${croppedBuffer.toString('base64')}`;

                    // Detecção de texto usando Google Vision API
                    const [result] = await client.textDetection({ image: { content: croppedBuffer } });
                    const textArray = result.textAnnotations.map(annotation => annotation.description).filter(text => text.trim() !== '');

                    const resultObject = { codigo: textArray[0], imageBase64 };
                    console.log(resultObject.codigo);

                    // Envia os dados para o front-end via `ipcRenderer`
                    const win = BrowserWindow.getAllWindows()[0]; // Obtém a janela ativa
                    win.webContents.send('screenshot-captured', resultObject); // Envia os dados para o front-end
                    
                    // Armazenar o código no banco de dados
                    const objetoBanco = { codigo: textArray[0] }
                    await insertPrint(objetoBanco);

                } catch (error) {
                    console.error('Erro ao capturar a tela:', error);
                }
            });
        }
    };

    // Registra o atalho quando o app está pronto
    registerScreenshotShortcut();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Ouve eventos do front-end para ativar ou desativar o atalho
    ipcMain.on('toggle-shortcut', (event, isEnabled) => {
        if (isEnabled) {
            isShortcutActive = true;
            registerScreenshotShortcut(); // Ativa o atalho
        } else {
            isShortcutActive = false;
            globalShortcut.unregister('Z'); // Desativa o atalho
        }
    });
});

app.on('will-quit', () => {
    // Desregistra todos os atalhos globais quando a aplicação fecha
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
