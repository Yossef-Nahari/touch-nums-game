'use strict'

var gNums = []
var gBoard
var gBoardSize
var gNextNum
var gInterval
var gCorrectCounter = 0
var gStartTime

function startButton(startButton) {
    startButton.style.display = "none"
    var elTime = document.querySelector('.time')
    elTime.classList.add('hidden')
    var strHTML = ''
    for (var i = 0; i < 3; i++) {
        strHTML += `<button id = "l${i}" class="levels" onclick="init(${i})">Level ${i + 1}</button>\n`
    }
    const elButtons = document.querySelector('.buttons')
    elButtons.innerHTML = strHTML
}

function init(gameLevel) {
    clearInterval(gInterval)
    var elH2 = document.querySelector('.time span')
    elH2.innerText = '00.000'

    gCorrectCounter = 0
    gNextNum = 1
    var elButtons = document.querySelectorAll('.levels')
    for (var i = 0; i < 3; i++) {
        elButtons[i].style.display = "none"
    }

    var elNextStep = document.querySelector('.nextStep')
    elNextStep.style.display = "block"
    nextNumDisp()

    var elTime = document.querySelector('.time')
    elTime.classList.remove('hidden')

    if (gameLevel === 0) gBoardSize = 16
    else if (gameLevel === 1) gBoardSize = 24
    else gBoardSize = 28

    createNums(gBoardSize, gNums)

    gBoard = createBoard()

    renderBoard(gBoard)
}

function createNums(gBoardSize, gNums) {
    for (var i = 0; i < gBoardSize; i++) {
        gNums[i] = i + 1
    }
    return gNums
}

function createBoard() {
    const board = []
    for (var i = 0; i < 4; i++) {
        board.push([])
        for (var j = 0; j < (gBoardSize / 4); j++) {
            board[i][j] = gNums.splice(getRandomInt(0, gNums.length), 1)
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            strHTML += `<td class="cell${[i]}${[j]}" onclick="checkAnswer(this)">${cell}</td>`
        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
}

function checkAnswer(cell) {
    var touchedNum = Number(cell.innerHTML)
    nextNumDisp()
    if (cell.id !== 'correct') {
        if (touchedNum === gNextNum) {
            if (gNextNum === 1) startTimer()
            gNextNum++
            gCorrectCounter++
            cell.setAttribute('id', 'correct')
            cell.style.backgroundColor = "rgb(100, 220, 100)"
            playSound('correct')
            nextNumDisp()
        } else {
            cell.setAttribute('id', 'wrong')
            playSound('wrong')
        }
        if (gCorrectCounter === gBoardSize) {
            clearInterval(gInterval)
            var elTable = document.querySelectorAll('#correct')
            for (var i = 0; i < gBoardSize; i++) {
                elTable[i].id = 'winner'
                elTable[i].style.backgroundColor = "rgb(38, 51, 193)"
            }
            playSound('win')
        }
    }
}

function playSound(answer) {
    var sound = new Audio(`sound/${answer}.mp3`)
    sound.play()
}

function nextNumDisp() {
    const elNextStepDisp = document.querySelector('.nextStep span')
    if (gNextNum <= gBoardSize || gNextNum === 1) elNextStepDisp.innerHTML = gNextNum
    if (gNextNum > gBoardSize) {
        const elDivNextStepDisp = document.querySelector('.nextStep')
        elDivNextStepDisp.style.display = "none"
        const elStartButton = document.querySelector('.start')
        elStartButton.style.display = "inline"

    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

function startTimer() {
    gStartTime = Date.now()
    gInterval = setInterval(() => {
        const seconds = (Date.now() - gStartTime) / 1000
        var elH2 = document.querySelector('.time span')
        elH2.innerText = seconds.toFixed(3)
    }, 100);
}