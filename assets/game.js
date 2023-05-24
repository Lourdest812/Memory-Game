const emojis =['🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈']

const selectors = {
    boardContainer: document.querySelector('.board-container'), 
    board: document.querySelector(".board"),
    moves: document.querySelector(".moves"),
    timer: document.querySelector(".timer"),
    start: document.querySelector("#start"),
    restart: document.querySelector("#restart"),
    win: document.querySelector(".win")
}

console.log(selectors.boardContainer, selectors.board, selectors.moves, selectors.timer, 
    selectors.start, selectors.restart, selectors.win)

    // Estado inicial del juego
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const dimension = selectors.board.getAttribute('data-dimension') // es 4
//console.log(dimension)

//CORE DEL MEMORY GAME

const shuffle = array => {
    const clonedArray = [...array]

    for(let i = clonedArray.length-1; i>0; i--){
        const randomIndex = Math.floor( Math.random() * (i+1))
        const original = clonedArray[i]
        clonedArray[i]=clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }
    return clonedArray
}

// console.log(shuffle(emojis))

const pickRandom = ( array, items ) => {
    const randomPicks = []

    for( let i=0;i<items;i++){
        const randomIndex = Math.floor(Math.random() * array.length)
        randomPicks.push(array[randomIndex])
        array.splice(randomIndex, 1)
    }
    return randomPicks
}

const validateDimension = () => {
    if( dimension % 2 !== 0){
        throw new Error("The dimension of the board must be an even number");
    }
}

const generateGame = () => {
    validateDimension()
    const picks = pickRandom(emojis, dimension * dimension / 2)
    const items = shuffle([...picks, ...picks])
    const cards = items.reduce( (acc, element)  => {
        return acc + `
        <div class="card">
            <div class = "card-front">
            </div>
            <div class = "card-back">
                ${element}
            </div>
        </div>
        `
    },"")
    selectors.board.innerHTML = cards
}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add("disable")
    state.loop = setInterval(() => {
        state.totalTime++
        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time ${state.totalTime} sec`
    } ,1000)
}

const flipBackCards = () => {
    document.querySelectorAll(`.card:not(.matched)`).forEach( card => {
        card.classList.remove("flipped")
    })
}

const flipcard = card => {
    state.flippedCards++
    state.totalFlips++

    if(!state.gameStarted){
        startGame()
    }

    if(!state.flippedCards<=2){
        card.classList.add("flipped")
    }

    if( state.flippedCards === 2 ){
        const flippedCards = document.querySelectorAll( `.flipped:not(.matched)`)

        if( flippedCards[0].innerText === flippedCards[1].innerText ){
            flippedCards[0].classList.add("matched")
            flippedCards[1].classList.add("matched")
        }
    }

    setTimeout(() => {
        flipBackCards()
    }, 1000)

    if( !document.querySelectorAll(".card:not(.flipped)").length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add("flipped")
            selectors.win.innerHTML = `
            <span class="win-text">
            You won!
            <p>
            with <span class = "highlight"> ${state.totalFlips} moves </span>
            </p>
            <p>
            under <span class = "highlight"> ${state.totalTime} seconds </span>
            </p>
            </span>
        `
        clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener( "click", e =>{
        const eventTarget = e.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes("card") && !eventParent.className.includes("flipped")) {
            flipcard(eventParent)
        }else if (eventTarget.nodeName === "BUTTON" && !eventTarget.className.includes("disabled")){
            startGame
        }
        if(eventTarget.id === "restart"){
            window.location.reload()
        }
    })
}

generateGame()
attachEventListeners()
