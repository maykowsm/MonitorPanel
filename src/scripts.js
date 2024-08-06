const { ipcRenderer } = require('electron')
const { createWriteStream } = require('node:original-fs')

var numCPUs = 0

var darckThemeColor = window.matchMedia("(prefers-color-scheme: dark)").matches

ipcRenderer.on('main/data', function(event, data){
    updatecpus(data)
    updateRam(data)
})


function updateRam(data){
    // UPDATE RAM BAR
    document.getElementById('bar_ram').style.width = data['menPercentage'] + '%'

    // UPDATE DATA RAM
    document.getElementById('ram_total').innerText = data['menTotal'] + ' GB'
    document.getElementById('ram_free').innerText = data['menFree'] + ' GB'
    document.getElementById('ram_used').innerText = data['menUsed'] + ' GB / ' + data['menPercentage'] + ' %'
    
}


// CRIA O VIEW DAS THREADS DA CPU
function creatView(data){
    numCPUs = data.process.length
    for(let i = 0; i < numCPUs; i++){
        var divCpu = document.createElement('div')
        divCpu.setAttribute('class', 'cpu')    

        var divContainer = document.createElement('div')
        divContainer.setAttribute('class', 'progress_container')

        var divProgress = document.createElement('div')
        divProgress.setAttribute('class', 'progress_bar')
        divProgress.setAttribute('id', 'barCPU_' + i.toString())

        var divPercent = document.createElement('p')
        divPercent.setAttribute('id', 'percentCpu_' + i.toString())

        divPercent.innerText = '0 %'

        var divTemp = document.createElement('p')
        divTemp.setAttribute('id', 'tempCpu_' + i.toString())
        divTemp.innerText = '0 ºC'
        

        divContainer.appendChild(divProgress)
        divCpu.appendChild(divContainer)
        divCpu.appendChild(divPercent)
        divCpu.appendChild(divTemp)
        var cpus = document.getElementById('cpus')
        cpus.append(divCpu)

    }    
}

function updatecpus(data){
    if(numCPUs == 0){
        creatView(data)
    }

    // UPDATE MAIN AND MAX PROCESS
    document.getElementById('temp_main').innerText = data.tempMain + " ºC"
    document.getElementById('temp_max').innerText = data.tempMax + " ºC"

    // UPDATE BAR PROCESS
    for(let [i, process] of data.process.entries()){
        document.getElementById('barCPU_' + i).style.height = process + '%'
        document.getElementById('percentCpu_' + i).innerText = process + ' %'
    }

    // UPDATE TEMPERATURA
    for(let [i, temp] of data.tempCores.entries()){
        document.getElementById('tempCpu_' + i * 2).innerText = temp + " ºC"
        document.getElementById('tempCpu_' + ((i * 2) + 1)).innerText = temp + " ºC"
    }

}

