import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
} from '../redux/typingSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card, CardBody } from 'react-bootstrap';

const TypingSpeed = () => {
  const dispatch = useDispatch();
  const {
    wordList,
    time,
    timerActive,
    keyStroke,
    dks,
    accurancy,
    wrongStroke,
    userEnteredWords,
    correctWords,
    incorrectWords,
    currentWordIndex,
    hasMistake
  } = useSelector(state => state.typing)

  const [inputValue, setInputValue] = useState('');
  const [lang, setLang] = useState('TR');
  const [modalVisible, setModalVisible] = useState(false);
  const [timeUp] = useState(false);

  const cardRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    dispatch(resetState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timerActive && time > 0) {
      const timer = setInterval(() => {
        dispatch(decrementTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    } else if (timerActive && time === 0) {
      dispatch(stopTimer());
      setModalVisible(true);
      dispatch(calculateAccurancy());
      dispatch(calculateDks());
    }
  }, [timerActive, time, dispatch]);

  useEffect(() => {
    if (cardRef.current && wordRefs.current[currentWordIndex]) {
      wordRefs.current[currentWordIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [currentWordIndex]);

  const handleChange = e => {
    if (timeUp) return;
    const { value } = e.target;
    if (!timerActive) {
      dispatch(startTimer());
    }
    setInputValue(value);
    const enteredWord = value.trim();
    const currentWord = wordList[currentWordIndex];
    let hasMistake = false;

    for (let i = 0; i < enteredWord.length; i++) {
      if (enteredWord[i] !== currentWord.turkish[i] && enteredWord[i] !== currentWord.english[i]) {
        hasMistake = true;
      } else {
        hasMistake = false;
      }
    }

    if (hasMistake) {
      dispatch(setHasMistake(true));
      dispatch(updateWrongStroke());
    } else {
      dispatch(setHasMistake(false));
    }

    if (value.endsWith(" ")) {
      dispatch(setHasMistake(false));
      dispatch(addUserEnteredWord(enteredWord));

      if (enteredWord === currentWord.turkish || enteredWord === currentWord.english) {
        dispatch(addCorrectWord(enteredWord));
      } else {
        dispatch(addIncorrectWord(enteredWord));
      }
      dispatch(updateKeyStroke(value.length));
      dispatch(incrementCurrentWordIndex(currentWordIndex))
      setInputValue('');
    }
  };

  const handleReset = () => {
    dispatch(resetState());
    setInputValue('');
  };

  const langChange = e => {
    setLang(e.target.value);
    handleReset();
  };

  const closeModal = () => {
    setModalVisible(false);
    handleReset();
  }

  return (
    <Container className='text-dark mt-4 align-items-center'>
      <Row className='pt-5 '>
        <Col>
          <h1 className='text-center ' style={{ color: '#1d3b55' }}>{lang === 'TR' ? 'Yazma Hızı Testi' : 'Typing Speed Test'}</h1>
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col>
          <div>
            <div>
              <select onChange={langChange}
                style={{
                  padding: '5px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '1px solid #0275d8',
                  backgroundColor: '#fff',
                  color: '#0275d8'
                }}
              >
                <option value='TR'>Türkçe</option>
                <option value='EN'>English</option>
              </select>
            </div>
          </div>
        </Col>
      </Row>
      <Row className='mt-4'>
        <Col>
          <Card style={{ height: "6rem", overflow: "hidden" }} ref={cardRef}>
            <CardBody className='fs-2 '  >
              {wordList.slice(0, wordList.length - 1).map((word, index) => {
                let color = 'black';
                if (correctWords.includes(word.turkish) || correctWords.includes(word.english)) {
                  color = '#5cb85c';
                } else if (incorrectWords.includes(userEnteredWords[index])) {
                  color = '#d9534f';
                }
                return (
                  <span
                    key={index}
                    style={{
                      color: color,
                      backgroundColor: (index === userEnteredWords.length && hasMistake) ? "#d9534f" : (index === userEnteredWords.length ? '#ced4da' : 'transparent'),
                      padding: 2,
                      margin: 2,
                      whiteSpace: 'nowrap'
                    }}
                    ref={ref => wordRefs.current[index] = ref}
                  >
                    {lang === 'TR' ? word.turkish : word.english}
                  </span>
                );
              })}
            </CardBody>

          </Card>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col>
          <div className='input-group' >
            <input type='text' className='form-control' value={inputValue} onChange={handleChange} disabled={modalVisible} />
            <span className='input-group-text fs-2 bg-primary-subtle'>{formatTime(time)}</span>
            <Button variant="primary" onClick={handleReset}>
              <FontAwesomeIcon icon={faArrowsRotate} size='2x' />
              <div > Refresh</div>
            </Button>
          </div>
        </Col>
      </Row>

      {modalVisible && (
        <div className="modal" id='exampleModal' tabindex="-1" style={{ display: 'block' }} data-bs-target="#exampleModal">
          <div className="modal-dialog modal-dialog-centered text-center">
            <div className="modal-content  ">
              <div className="modal-header ">
                <h5 className="modal-title">{lang === 'TR' ? 'Sonuç' : 'Result'}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <h1>
                  <span className='fw-bold'>{dks}</span>
                  <span className='fw-light'>{lang === 'TR' ? 'DKS' : 'WPM'}</span>
                </h1>
                <h6 className='mt-4'>{lang === 'TR' ? 'Tuş Vuruşu ' : 'Keystrokes '}
                  (
                  <span className='text-danger'>{wrongStroke}</span>
                  |
                  <span className='text-success'>{keyStroke - wrongStroke}</span>
                  )
                  <span className='fw-medium '> {keyStroke}</span>
                </h6>
                <h6>
                  {lang === 'TR' ? 'Doğruluk ' : 'Accurancy '}
                  <span className='fw-medium'>%{accurancy}</span>
                </h6>
                <h6 className=''>
                  {lang === 'TR' ? 'Doğru Kelime ' : 'Correct Words '}
                  <span className='text-success fw-medium'>{correctWords.length}</span>
                </h6>
                <h6>
                  {lang === 'TR' ? 'Yanlış Kelime ' : 'Wrong Words '}
                  <span className='text-danger fw-medium'>{incorrectWords.length}</span>
                </h6>
                
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  {lang === 'TR' ? 'Kapat' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default TypingSpeed;
