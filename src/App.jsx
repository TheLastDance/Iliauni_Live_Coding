import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';

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

  useEffect(() => {
    fetch('https://random-colors-lovat.vercel.app')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.log(err))
  }, []);

  const checker = () => {
    if (data[page - 1].color === selected) {
      setPage(prev => prev + 1);
    } else {
      setScore(prev => prev - 20);
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    let timer;
    if (page > 1) {
      timer = setTimeout(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    if (page > 10) {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  })

  console.log(selected, page);

  return (
    <>
      {page <= 10 &&
        <main>
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
              {data[page - 1].answers.map((item, index) => <li key={index} onClick={() => setSelected(item)}><button type='button'> <span className='keys'> {keys[index]} </span> {item} </button> </li>)}
            </ul>
          </div> : null}

          <div className='next_button'>
            <button onClick={checker}>CONTINUE</button>
          </div>
        </main>
      }
      {
        page > 10 && <main>
          <div className="info_container">
            <div className='info_div'>
              {page > 10 ? score : 200}
            </div>
            <div className='color_quiz'>
              <p>Color Quiz</p>
            </div>
          </div>
          <div className="score_info">
            <span>Your score is: {score}</span>
            <span>Time: {timer} second</span>
          </div>
        </main>
      }
    </>
  )
}

export default App
