import {Options} from "./Options";

export function Question({question}) {

  console.log(question);

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question}/>
    </div>
  );
}