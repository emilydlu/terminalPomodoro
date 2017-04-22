var fs          = require('fs'),
    path        = require('path'),
    readline    = require('readline'), 
    Timr        = require ('timrjs'), 
    colors      = require('colors');  

var util=require('util');

colors.setTheme(
    {
        menuItem    : 'bgCyan',
        menuTitle   : 'bgBlue',
        store       : 'bgBlue',
        info        : 'cyan'
    }
);

var rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout,
        terminal:true
    }
);
process.stdin.setEncoding('utf8');

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

//data 
var Data = {} 
Data['pomodoroCount'] = 0 
Data['pomodoros'] = [] 

function Pomodoro(length, index) { 
    this.length = length; 
    this.index = index; 
    this.getInfo = getPomodoroInfo; 
}

function getPomodoroInfo(){
    return 'pomorodo number ' + this.index + ": " + this.length + " seconds"; 
}
rl.setPrompt('Pomodoro> ');
rl.prompt();

rl.on(
    'line',
    function(chunk) {
        chunk=chunk.trim();

        if (chunk !== null) {
            chunk = chunk.replace( /\s\s+/g, ' ' ).trim();

            var data = chunk.toLowerCase();


            if(data.indexOf('start timer ')>-1){
                startTimer(data.slice(data.indexOf('start timer ')+12));
                return;
            }

            if(data.indexOf('help')>-1){
                help();
                return;
            }

            if(data.indexOf('stats') > -1) { 
                getData(); 
                return;
            }
            rl.prompt();
        }
    }
);

function help(){ 
    var commands = [
    'start timer', 
    'pause', 
    'continue', 
    'show pomodoro data']; 
    for (var i in commands) { 
        console.log(commands[i] + '\n');
    }
}
function startTimer(duration){
    Data['pomodoroCount'] = Data['pomodoroCount'] + 1;
    var pomodoro = new Pomodoro(duration, Data['pomodoroCount']) 
    Data['pomodoros'].push(pomodoro);
    const timer = Timr(duration)
    timer.start()
    rl.on(
        'line',
        function(chunk) {
            chunk=chunk.trim();
            if (chunk !== null) {
                chunk = chunk.replace( /\s\s+/g, ' ' ).trim();

                var data = chunk.toLowerCase();                
                if(data.indexOf('pause')>-1){
                    timer.pause();
                    console.log("\n PAUSED \n".blue)
                }
                if(data.indexOf('resume')>-1){
                    timer.start();
                    // console.log(" \n".blue)
                }
            }
        }
    );
    timer.ticker(({ formattedTime, percentDone }) => {
        console.log(formattedTime); 
        if (percentDone%50 == 0 && formattedTime!= '00:00') { 
            console.log('halfway!'.bgCyan)} 
    });
    timer.finish((self) => {
        console.log("Congrats! You're done! Take a break".cyan);
});
    return Data; 
}

function getData(){ 
    var totalPomodoros = Data['pomodoroCount'];
    console.log("pomodoros completed: " + totalPomodoros)
    if (totalPomodoros == 0) { 
        console.log("detailed pomodoro data: None completed");
    }
    else{ 
        console.log("detailed pomodoro data:\n")
        for (i = 0; i<totalPomodoros; i++)
            console.log(Data['pomodoros'][i].getInfo())
    }
}
