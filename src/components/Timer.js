import {useEffect} from "react";

export function Timer({seconds, dispatch}) {

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;


  useEffect(() => {
    const id = setInterval(() => {
      dispatch({type: 'tick'});
    }, 1000);

    return () => clearInterval(id);


  }, [dispatch]);

  return (
    <div className="timer">
      {min < 10 && '0'}{min}:{sec < 10 && '0'}{sec}
    </div>
  );
}