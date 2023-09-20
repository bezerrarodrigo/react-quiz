export function FinishScreen({points, maxPoints, highscore}) {

  //derived states
  const percentage = (points / maxPoints) * 100;

  let emoji;
  if(percentage === 100) emoji = '🏅';
  if(percentage >= 80 && percentage < 100) emoji = '🥈';
  if(percentage < 80) emoji = '🥉';
  if(percentage === 0) emoji = '😥';

  return (
    <>
      <p className="result"><span>{emoji}</span> You scored <strong>{points}</strong> out
        of {maxPoints} ({Math.ceil(
          percentage)}%)</p>
      <p className="highscore">(High-score: {highscore} points )</p>
    </>
  );
}