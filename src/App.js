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

const initialState = {
  questions: [],
  status: 'loading', //loading, error, ready,active,finished
  questionIndex: 0,
  newAnswer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {...state, questions: action.payload, status: 'ready'};
    case 'dataFailed':
      return {...state, status: 'error'};
    case 'startGame':
      return {...state, status: 'active'};
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


    default:
      throw new Error('Action unknown!');
  }
}


export default function App() {

  //states
  const [state, dispatch] = useReducer(reducer, initialState);
  const {questions, status, questionIndex, newAnswer, points, highscore} = state;

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
            <NextButton dispatch={dispatch} answer={newAnswer} index={questionIndex}
                        numQuestions={numQuestions}/>
          </>}
        {status === 'finished' &&
          <FinishScreen points={points} maxPoints={maxPoints} highscore={highscore}/>}
      </Main>
    </div>
  );
}