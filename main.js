const { app, BrowserWindow, ipcMain, nativeTheme} = require('electron');
const { totalmem } = require('node:os');
const path = require('node:path')
const os = require('os')
const si = require('systeminformation')



var win

async function createWindow(){

    if (app.dock) {
        app.dock.setIcon(icon);
    }
    win = new BrowserWindow({
        icon: os.platform() == 'linux'? path.join(__dirname, 'img/icon.png') : path.join(__dirname, 'img/icon.ico'),
        width: 700,
        height: 500,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            // enableRemoteModule: true,
        }     
    })
    win.setMenu(null)
    win.loadFile('./pages/index.html')
    // win.webContents.openDevTools()
    
}


app.on('ready', () =>{
    createWindow()
    setInterval(()=>getData(win), 1000)
})

nativeTheme.themeSource




async function getData(win){
    
    // RAM
    var menTotal = Math.round(os.totalmem()/(1024**3) * 100) / 100
    var menFree = Math.round(os.freemem()/(1024**3) * 100) / 100
    var menUsed = Math.round((menTotal - menFree) * 100 ) / 100
    var menPercentage = Math.round((menUsed * 100 / menTotal) * 100) / 100
    
    // TEMPERATURAS
    var temp = await si.cpuTemperature()
    var tempMain =  temp['main']
    var tempCores = temp['cores']
    var tempMax = temp['max']
    

    // PROCESSAMENTO
    var carga = await si.currentLoad()
    var process = carga['cpus'].map((e) => { return Math.round(e['load'])})
    // console.log(carga);

    // RETORNO
    var data ={
        'menTotal': menTotal,
        'menFree': menFree,
        'menUsed': menUsed,
        'menPercentage': menPercentage,
        'tempMain': tempMain,
        'tempCores': tempCores,
        'tempMax': tempMax,
        'process': process
    }
    win.webContents.send('main/data', data)       
    
}






