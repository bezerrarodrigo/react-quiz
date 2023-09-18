import {Header} from "./components/Header";
import {Main} from "./components/Main";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader";
import Error from "./components/Error";
import {StartScreen} from "./components/StartScreen";

const initialState = {
  questions: [],
  status: 'loading', //loading, error, ready,active,finished
};

function reducer(currentState, action) {
  switch (action.type) {
    case 'dataReceived':
      return {...currentState, questions: action.payload, status: 'ready'};
    case 'dataFailed':
      return {...currentState, status: 'error'};
    default:
      throw new Error('Action unknown!');
  }
}

export default function App() {

  //states
  const [state, dispatch] = useReducer(reducer, initialState);
  const {questions, status} = state;

  //derived state
  const numQuestions = questions.length;


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
        {status === 'ready' && <StartScreen numQuestions={numQuestions}/>}
      </Main>
    </div>
  );
}