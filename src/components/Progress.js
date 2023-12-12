import {useQuiz} from "../context/QuizContext";

export function Progress() {

  const {numQuestions: totalQuestions, questionIndex, points, maxPoints: totalPoints, newAnswer: answer} = useQuiz();

  return (
    <header className="progress">
      <progress max={totalQuestions} value={questionIndex + Number(answer !== null)}/>
      <p>Question <strong>{questionIndex + 1}</strong> / {totalQuestions}</p>
      <p>Points <strong>{points}</strong> / {totalPoints}</p>
    </header>
  );
}