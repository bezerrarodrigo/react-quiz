import {useQuiz} from "../context/QuizContext";

export function Options() {

  const {questions, dispatch, newAnswer: answer, questionIndex} = useQuiz();
  const question = questions[questionIndex];

  const hasAnswer = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => {
        return <button key={option}
                       className={`btn btn-option ${index === answer ? 'answer' : ''}
                       ${hasAnswer ? index === question.correctOption ? 'correct' : 'wrong' : ''}`}
                       onClick={() => dispatch(
                         {type: 'newAnswer', payload: index})}
                       disabled={hasAnswer}
        >{option}</button>;
      })}
    </div>
  );
}