export function Progress({totalQuestions, index, points, totalPoints, answer}) {
  return (
    <header className="progress">
      <progress max={totalQuestions} value={index + Number(answer !== null)}/>
      <p>Question <strong>{index + 1}</strong> / {totalQuestions}</p>
      <p>Points <strong>{points}</strong> / {totalPoints}</p>
    </header>
  );
}