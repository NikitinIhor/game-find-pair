
const cards = document.querySelectorAll('.card');
const restart = document.querySelector('.restart');
const starter = document.querySelector('.start');
const p = document.querySelector('p');
const timer = document.querySelector('.timer');
const popup = document.querySelector('.popup');

let firstCard, secondCard
let cardIsOpened = false
let lockBoard = false 
let attempt = 0
let checked = 0

let minute = 0
let second = 0
let time

const your = document.querySelector('.your');

function cardOpen() {
    
    if(lockBoard) return
    
    this.classList.add('open')

    if(!cardIsOpened){
        cardIsOpened = true
        firstCard = this
        
        return
    }
    
    if(this===firstCard) return
    secondCard = this
    cardIsOpened = false
    checkCards()
}

const checkCards = () => {
    if(firstCard.dataset.animal === secondCard.dataset.animal) {
        
        checked++
        firstCard.removeEventListener('click', cardOpen)
        secondCard.removeEventListener('click', cardOpen)
        setTimeout(()=>{
            firstCard.classList.add('hide')
            secondCard.classList.add('hide')
        },500)

        attempt++
        theEnd()
        return
    }
    
    else {
        lockBoard = true
        setTimeout(()=> {
            firstCard.classList.remove('open')
            secondCard.classList.remove('open')
            lockBoard = false
        },1000)
    }
    attempt++
   
};
const theEnd = () => {
    setTimeout(()=> {
        if(checked===12){
            p.textContent = `${attempt} attempts`
            restart.style.display='block'
            clearInterval(time)
            popup.style.display ='block'
            your.textContent = `your time: ${timer.textContent}`
            timer.style.display = 'none'
        }
    },500)
   
};

const timing = () => {
    setTimeout(()=>{
        starter.style.display='none'
    },1000)
    
    time = setInterval(()=> {
    if(second<9){
        second++
        timer.textContent= `0${minute}:0${second}`
    }
    else if(second>=9&&second<59){
        second++
        timer.textContent= `0${minute}:${second}`
    }
    else{
        minute++
        second = 0
        timer.textContent= `${minute}:00`
    }
    
  },1000)
  cards.forEach(card => card.addEventListener('click', cardOpen))
};

(function start() {
    cards.forEach(card => {
        let newGame = Math.floor(Math.random()*24)
        card.style.order = newGame
    })
})()

const reload = () => {
    location.reload();
};

restart.addEventListener('click', reload)
starter.addEventListener('click', timing)