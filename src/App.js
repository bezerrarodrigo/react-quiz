import {Header} from "./components/Header";
import {Main} from "./components/Main";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader";
import Error from "./components/Error";
import {StartScreen} from "./components/StartScreen";
import {Question} from "./components/Question";
import {NextButton} from "./components/NextButton";
import {Progress} from "./components/Progress";
import {FinishScreen} from "./components/FinishScreen";
import {Timer} from "./components/Timer";
import {Footer} from "./components/Footer";

const initialState = {
  questions: [],
  status: 'loading', //loading, error, ready,active,finished
  questionIndex: 0,
  newAnswer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const QUESTIONS_PER_SECOND = 10;

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {...state, questions: action.payload, status: 'ready'};
    case 'dataFailed':
      return {...state, status: 'error'};
    case 'startGame':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * QUESTIONS_PER_SECOND,
      };
    case 'newAnswer':
      const question = state.questions.at(state.questionIndex);
      return {
        ...state,
        newAnswer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points :
          state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        newAnswer: null,
      };
    case 'finished':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points :
          state.highscore,
      };
    case 'restart':
      return {
        ...state,
        status: 'ready',
        questionIndex: 0,
        points: 0,
        newAnswer: null,
        secondsRemaining: 0,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error('Action unknown!');
  }
}


export default function App() {

  //states
  const [state, dispatch] = useReducer(reducer, initialState);
  const {questions, status, questionIndex, newAnswer, points, highscore, secondsRemaining} = state;

  //derived state
  const numQuestions = questions.length;
  const maxPoints = questions.reduce(
    (previousValue, currentValue) => previousValue + currentValue.points, 0);


  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then(response => response.json())
      .then(data => dispatch({
        type: 'dataReceived',
        payload: data,
      }))
      .catch(error => {
        console.log(error.message);
        dispatch({type: 'dataFailed'});
      });
  }, []);

  return (
    <div className="app">
      <Header/>
      <Main>
        {status === 'loading' && <Loader/>}
        {status === 'error' && <Error/>}
        {status === 'ready' &&
          <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
        {status === 'active' &&
          <>
            <Progress index={questionIndex} totalQuestions={numQuestions} points={points}
                      totalPoints={maxPoints} answer={newAnswer}/>
            <Question question={questions[questionIndex]} dispatch={dispatch} answer={newAnswer}/>
            <Footer>
              <Timer seconds={secondsRemaining} dispatch={dispatch}/>
              <NextButton dispatch={dispatch} answer={newAnswer} index={questionIndex}
                          numQuestions={numQuestions}/>
            </Footer>
          </>}
        {status === 'finished' &&
          <FinishScreen points={points} maxPoints={maxPoints} highscore={highscore}
                        dispatch={dispatch}/>}
      </Main>
    </div>
  );
}