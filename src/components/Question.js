import {Options} from "./Options";
import {useQuiz} from "../context/QuizContext";

export function Question() {

  const {questions, questionIndex} = useQuiz();
  const question = questions[questionIndex];

  return (
    <div>
      <h4>{question.question}</h4>
      <Options/>
    </div>
  );
}