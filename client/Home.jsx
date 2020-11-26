import React, { useState } from 'react';
const questions = [
  {
    question: 'You find it takes effort to introduce yourself to other people.',
    dimension: 'EI',
    direction: 1,
    meaning: 'I',
  },
  {
    question: 'You consider yourself more practical than creative.',
    dimension: 'SN',
    direction: -1,
    meaning: 'S',
  },
  {
    question: 'Winning a debate matters less to you than making sure no one gets upset.',
    dimension: 'TF',
    direction: 1,
    meaning: 'F',
  },
  {
    question: 'You get energized going to social events that involve many interactions.',
    dimension: 'EI',
    direction: -1,
    meaning: 'E',
  },
  {
    question: 'You often spend time exploring unrealistic and impractical yet intriguing ideas.',
    dimension: 'SN',
    direction: 1,
    meaning: 'N',
  },
  {
    question: 'Deadlines seem to you to be of relative rather than absolute importance.',
    dimension: 'JP',
    direction: 1,
    meaning: 'P',
  },
  {
    question: 'Logic is usually more important than heart when it comes to making important decisions.',
    dimension: 'TF',
    direction: -1,
    meaning: 'T',
  },
  {
    question: 'Your home and work environments are quite tidy.',
    dimension: 'JP',
    direction: -1,
    meaning: 'J',
  },
  {
    question: 'You do not mind being at the center of attention.',
    dimension: 'EI',
    direction: -1,
    meaning: 'E',
  },
  {
    question: 'Keeping your options open is more important than having a to-do list.',
    dimension: 'JP',
    direction: 1,
    meaning: 'P',
  },
];
function range(start=0, end=0, interval=1) {
  const range = [];
  if (start && end === 0) {
    end = start;
    start = 0;

  }
  for(let i = start; i < end; i+=interval) {
    range.push(i);
  }

  return range;
}

const Home = () => {
  const [ email, getEmail ] = useState('');
  const [ errMessage, getErrMessage ] = useState('');
  const [responses, updateResponse] = useState({});
  const [ displayResult, updateDisplayResult ] = useState(false);
  const [ toggleClassName, setClassName ] = useState({});
  const [ mbtiResult, updateResult ] = useState({});
  const mbtiDimension = {
    EI: ['E', 'I'],
    SN: ['S', 'N'],
    TF: ['T', 'F'],
    JP: ['J', 'P'],
  }
  
  const onSubmit = () => {
    if (!email) return getErrMessage('Please enter you email');

    // calculate score and submit to backend
    const questionIdx = Object.keys(responses);
    const dimension = {};
    let count = 1
    questionIdx.forEach((qIdx )=> {
      if (dimension[questions[qIdx].dimension]) {
        dimension[questions[qIdx].dimension] = dimension[questions[qIdx].dimension] + responses[qIdx];
        if (responses[qIdx] >= 4 && questions[qIdx].direction === 1) {
          dimension[questions[qIdx].meaning] = dimension[questions[qIdx].meaning] + 1;
        }

        if (responses[qIdx] >= 4 && questions[qIdx].direction === -1) {
          dimension[questions[qIdx].meaning] = dimension[questions[qIdx].meaning] + 1;
        }

      } else {
        dimension[questions[qIdx].dimension] = responses[qIdx];
        dimension[mbtiDimension[questions[qIdx].dimension][0]] = 0;
        dimension[mbtiDimension[questions[qIdx].dimension][1]] = 0; 
        if (responses[qIdx] >= 4 && questions[qIdx].direction === 1) {
          dimension[questions[qIdx].meaning] = 1;
        }

        if (responses[qIdx] >= 4 && questions[qIdx].direction === -1) {
          dimension[questions[qIdx].meaning] = 1;
        }
        count ++;
      }
    });

    const mbtiScore = Object.keys(mbtiDimension).map(dim => {
      if (dimension[mbtiDimension[dim][0]] > dimension[mbtiDimension[dim][1]]) {
        toggleClassName[mbtiDimension[dim][0]] = 'mbti-on';
        setClassName(toggleClassName);
        return mbtiDimension[dim][0];
      } else if (dimension[mbtiDimension[dim][0]] < dimension[mbtiDimension[dim][1]]) {
        toggleClassName[mbtiDimension[dim][1]] = 'mbti-on';
        setClassName(toggleClassName);
        return mbtiDimension[dim][1];
      } else {
        toggleClassName[mbtiDimension[dim][0]] = 'mbti-on';
        setClassName(toggleClassName);
        return mbtiDimension[dim][0];
      }
    });

    mbtiResult.mbtiScore = mbtiScore.join('');
    updateDisplayResult(true);
    updateResult(mbtiResult);

    responses.email = email;
    responses.mbtiScore = mbtiResult.mbtiScore 

    fetch('http://localhost:3005/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responses),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const handleChange = (event) => {
    const [ questionIdx, userResponse ] = [ ...event.target.value.split(' ')];
    const questionIndex = parseInt(questionIdx, 10)
    responses[questionIndex] = parseInt(userResponse, 10);
    updateResponse(responses);
  }

  return (
    <div className='container'>
      {
      displayResult ? (
        <div id='perspective'>
          <div id='perspective-result'>
            <h1>Your Perspective</h1>
           <p>Your Perspective Type is {mbtiResult.mbtiScore} </p>
          </div>
          <div id='perspective-summary'>
            <div>
              <div>
                <div>
                  <strong>Introversion (I)</strong>
                </div>
                <div>
                  <div className='perspective-bar'>
                    <div className={`${toggleClassName['I']}`}></div>
                    <div className={`${toggleClassName['E']}`}></div>
                  </div>
                </div>
                <div>
                  <strong>Extraversion (E)</strong>
                </div>
              </div>
              <div>
                <div>
                  <strong>Sensing (S)</strong>
                </div>
                <div>
                  <div className='perspective-bar'>
                    <div className={`${toggleClassName['S']}`}></div>
                    <div className={`${toggleClassName['N']}`}></div>
                  </div>
                </div>
                <div>
                  <strong>Intuition (N)</strong>
                </div>
              </div>
              <div>
                <div>
                  <strong>Thinking (T)</strong>
                </div>
                <div>
                  <div className='perspective-bar'>
                    <div className={`${toggleClassName['T']}`}></div>
                    <div className={`${toggleClassName['F']}`}></div>
                  </div>
                </div>
                <div>
                  <strong>Feeling (F)</strong>
                </div>
              </div>
              <div>
                <div>
                  <strong>Judging (J)</strong>
                </div>
                <div>
                  <div className='perspective-bar'>
                    <div className={`${toggleClassName['J']}`}></div>
                    <div className={`${toggleClassName['P']}`}></div>
                  </div>
                </div>
                <div>
                  <strong>Perceiving (P)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : 
        <div>
        <div id="header">
          <h1>Discover Your Perspective</h1>
          <p>Complete the 7 min test and get a detailed report of you lenses on the world.</p>
        </div>
        <div>
          { 
            errMessage ? <p>{errMessage}</p> : null
          }
        </div>
        <div id='questions'>
          { 
            questions.map((test, index) => {
              return (
                <div key={index}>
                  <p>{test.question}</p>
                  <div id='response'>
                    <div>
                      <strong id='disagree'>Disagree</strong>
                    </div>
                    {
                      range(7).map(count => {
                        return (
                          <div key={count}>
                            <input type='radio' name={`answer-${index}`} onChange={handleChange} value={`${index} ${count + 1}`} />
                          </div>
                        )
                      })
                    }
                    <div>
                      <strong id='agree'>Agree</strong>
                    </div>
                  </div>
                </div>
              );
            })
          }
          <div id='email-div'>
            <p>Your Email</p>
            <input name='email' type='text' placeholder='you@example.com' onChange={e => getEmail(e.target.value)} />
          </div>
        </div>
        <div id='submit-div'>
            <input type='submit' value='Save & Continue' name='submit' onClick={onSubmit}/>
        </div>
      </div>
    }
      
    </div>
  );
};

export default Home;
