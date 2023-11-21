import { useState, useEffect, useRef } from 'react'
import './App.css'

const keys = {
  0: 'A',
  1: 'B',
  2: 'C'
}

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [score, setScore] = useState(200);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(0);
  const [countTries, setCountTries] = useState(1);
  const avoidRender = useRef(false); // to avoid first render on strictmode

  useEffect(() => {
    if (avoidRender.current) {
      fetch('https://random-colors-lovat.vercel.app')
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.log(err))
    }
    avoidRender.current = true;
  }, [countTries]);

  const checker = () => {
    if (data[page - 1].color === selected) {
      setPage(prev => prev + 1);
    } else {
      setScore(prev => prev - 20);
      setPage(prev => prev + 1);
    }
    setSelected(null);
  }

  useEffect(() => {
    let time;
    if (page > 1) {
      time = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    if (page > 10) {
      clearInterval(time);
    }

    return () => clearInterval(time);
  }, [page])

  const tryAgain = () => {
    setPage(1);
    setScore(200);
    setTimer(0);
    setSelected(null);
    setCountTries(prev => prev + 1);
  }

  return (
    <>
      {page <= 10 &&
        <>
          <main>
            <div className="main_container">
              <div className='info_container'>
                <div className='info_div'>
                  {page > 10 ? score : 200}
                </div>
                <div className='color_quiz'>
                  <p>Color Quiz</p>
                </div>
                <div className='info_div'>
                  {`${page}/10`}
                </div>
              </div>
              {data.length ? <div className='quiz_container'>
                <p>{`Color":`}</p>
                <div className="visible_color" style={{ background: data[page - 1].color }}>
                </div>
                <ul className="answers">
                  {data[page - 1].answers.map((item, index) =>
                    <li key={index} onClick={() => setSelected(item)}>
                      <button type='button'>
                        <span className='keys'> {keys[index]} </span>
                        <span>{item}</span>
                      </button>
                    </li>)}
                </ul>
              </div> : null}
            </div>
          </main>
          <footer>
            <div className='next_button'>
              <button type='button' disabled={!selected} onClick={checker}>CONTINUE</button>
            </div>
          </footer>
        </>
      }
      {
        page > 10 && <>
          <main>
            <div className="main_finish_container">
              <div className="info_container">
                <div className='info_div'>
                  {page > 10 ? score : 200}
                </div>
              </div>
              <div className="score_info">
                <div className='color_quiz'>
                  <p>Color Quiz</p>
                </div>
                <span>Your score is: {score}</span>
                <span>Time: {timer} second</span>
              </div>
            </div>
          </main>
          <footer>
            <div className='next_button'>
              <button type='button' onClick={tryAgain}>Try Again</button>
            </div>
          </footer>
        </>
      }
    </>
  )
}

export default App
