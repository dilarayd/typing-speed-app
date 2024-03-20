import { createSlice } from "@reduxjs/toolkit"
import word from '../data.json'

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const typingSlice = createSlice({
    name: 'typing',
    initialState: {
        wordList: shuffleArray(word.words),
        time: 60,
        timerActive: false,
        keyStroke: 0,
        dks: 0,
        accurancy: 0,
        wrongStroke: 0,
        userEnteredWords: [],
        correctWords: [],
        incorrectWords: [],
        currentWordIndex: 0,
        hasMistake: false,
    },
    reducers: {
        startTimer: state => {
            state.timerActive = true;
        },
        stopTimer: state => {
            state.timerActive = false;
        },
        decrementTimeLeft: state => {
            if (state.time > 0) {
                state.time -= 1;
            }
        },
        resetState: state => {
            state.wordList = shuffleArray([...word.words]);
            state.time = 60;
            state.timerActive = false;
            state.keyStroke = 0;
            state.dks = 0;
            state.accurancy = 0;
            state.wrongStroke = 0;
            state.userEnteredWords = [];
            state.correctWords = [];
            state.incorrectWords = [];
            state.currentWordIndex = 0;
            state.hasMistake = false;
        },
        updateKeyStroke: (state, action) => {
            state.keyStroke += action.payload;
        },
        updateWrongStroke: state => {
            state.wrongStroke += 1;
        },
        addUserEnteredWord: (state, action) => {
            state.userEnteredWords.push(action.payload);
        },
        addCorrectWord: (state, action) => {
            state.correctWords.push(action.payload);
        },
        addIncorrectWord: (state, action) => {
            state.incorrectWords.push(action.payload);
        },
        incrementCurrentWordIndex: state => {
            state.currentWordIndex += 1;
        },
        setHasMistake: (state, action) => {
            state.hasMistake = action.payload;
        },
        calculateDks: state => {
            state.dks = Math.round(state.keyStroke / 5);
        },
        calculateAccurancy: state => {
            const corrects = state.correctWords.length
            const incorrects = state.incorrectWords.length
            state.accurancy = Math.round(100 * corrects / (corrects + incorrects))
        }
    },
})
export const {
    startTimer,
    stopTimer,
    decrementTimeLeft,
    resetState,
    updateKeyStroke,
    updateWrongStroke,
    addUserEnteredWord,
    addCorrectWord,
    addIncorrectWord,
    incrementCurrentWordIndex,
    setHasMistake,
    calculateDks,
    calculateAccurancy
} = typingSlice.actions;

export default typingSlice.reducer;



