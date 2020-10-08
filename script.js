const body = document.querySelector('body');
const word = document.getElementById('word');
const input = document.getElementById('input');
const endgame_container = document.getElementById('endgame-container');
const time = document.getElementById('time');
const score = document.getElementById('score');
const difficulty = document.getElementById('difficulty');
const form_container = document.getElementById('form-container');
const form = document.getElementById('form');
const setting_btn = document.getElementById('setting-btn');


const randomWordArray = [];
const totalRandomWords = 100;

//INITIALIZE RANDOM WORD
let randomWord;
//INITIALIZE SCORE
let scoreCount = 0;
//INITIALIZE TIME
let timeCount = 15;
//INITIAL DIFFICULTY SETTING
let difficultyValue = localStorage.getItem('difficulty') === null ? 'medium' : localStorage.getItem('difficulty');

//UPDATING DOM FROM LOCAL STORAGE
difficulty.value= localStorage.getItem('difficulty') === null ? 'medium' : localStorage.getItem('difficulty');


//FOCUS ON INPUT AT THE STARTING
input.focus();
//TIME COUNTER
const timeCounter = setInterval(updateTime, 1000);


//FUNCTION TO FETCH RANDOM WORD AND PUSH TO THE ARRAY AND UPDATE THE DOM
async function fetchRandomWord(){    
		const res =  await fetch (`https://random-word-api.herokuapp.com/word?number=${totalRandomWords}`)
		const random = await res.json();

		 random.forEach(data => {
		 	randomWordArray.push(data);
		 })
		 updateDOM();
}
fetchRandomWord();

// TO GENERATE RANDOM WORD  
function generateRandomWord(){
	return randomWordArray[Math.floor(Math.random() * randomWordArray.length)];
}

//UPDATING THE DOM
function updateDOM(){
		 randomWord = generateRandomWord();
		 word.innerHTML = randomWord;
}

//UPDATING SCORE FUNCTION AND UPDATING THE DOM
function updateScore(){
	scoreCount++ ;
	score.textContent = scoreCount;
}

//UPDATE TIME BY COUNTING DOWN
function updateTime (){
	timeCount--
	//UPDATING DOM
	time.textContent = timeCount + 's';
	if(timeCount === 0){
		clearInterval(timeCounter);
		time.textContent = timeCount;

		gameOver();
	}
}

//GAME OVER FUNCTION 
function gameOver (){
	endgame_container.style.display='flex';
	endgame_container.innerHTML = `<h1>Game Over</h1><br>
							<h3>Your score is: <b>${scoreCount}</b></h3>
							<button onClick='location.reload()'>Replay</button>`
	body.classList.add('background-overlay');
}

//ADD EVENT LISTENER TO THE INPUT
input.addEventListener('input', e=>{
	const text = e.target.value;
	//CHECKING WHEATHER INPUT AND RANDOM WORD ARE SAME
	if(text === randomWord){
		updateDOM();
		updateScore();
		e.target.value = '';	

		if(difficultyValue === 'hard'){
			timeCount+=3;
		}else if(difficultyValue === 'medium'){
			timeCount+=4;
		}else if (difficultyValue === 'easy'){
			timeCount+=6;
		}
		updateTime();
	}
})

//TOGGLE BUTTON CLICK EVENT
setting_btn.addEventListener('click',()=>{
	form_container.classList.toggle('hide');
})

//SELECT DIFFICULTY EVENT
difficulty.addEventListener('change', e=>{
	difficultyValue = e.target.value;
	localStorage.setItem('difficulty', difficultyValue);
})



