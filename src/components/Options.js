export function Options({question}) {
  return (
    <div className="options">
      {question.options.map(option => {
        return <button key={option} className="btn btn-option">{option}</button>;
      })}
    </div>
  );
}