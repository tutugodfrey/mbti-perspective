import React, { useState } from 'react';
import questions from './questions';
import functs from './functs';

const { range, fetchRequestHandler, validateEmail } = functs;

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
    if (!validateEmail(email)) return getErrMessage('Please provide a valid email address');
    if (Object.keys(responses).length !== 10)  return getErrMessage('Please complete all questions');

    // calculate score and submit
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
    const serverResponse = fetchRequestHandler(responses);
    console.log(serverResponse);
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
        <ResultPage
          mbtiResult={ mbtiResult}
          toggleClassName={toggleClassName}
        />
      ) : (
        <HomePage
          handleChange={handleChange}
          onSubmit={onSubmit}
          getEmail={getEmail}
          range={range}
          errMessage={errMessage} 
          questions={questions}
        />
      )
    }
    </div>
  );
};

const HomePage = ({ handleChange, onSubmit, getEmail, range, errMessage,  questions}) => {
  return (
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
                        <input type='radio' name={`answer${index+1}`} onChange={handleChange} value={`${index} ${count + 1}`} />
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
  )
}

const ResultPage = ({ mbtiResult, toggleClassName }) => {
  const perspectives = [
    ['Introversion (I)', 'Extraversion (E)', 'I', 'E' ],
    ['Sensing (S)', 'Intuition (N)', 'S', 'N' ],
    [ 'Thinking (T)', 'Feeling (F)', 'T', 'F' ],
    [ 'Judging (J)', 'Perceiving (P)', 'J', 'P' ],
  ]
  return (
    <div id='perspective'>
    <div id='perspective-result'>
      <h1>Your Perspective</h1>
     <p>Your Perspective Type is {mbtiResult.mbtiScore} </p>
    </div>
    <div id='perspective-summary'>
      <div>
        {
          perspectives.map(perspective => (
            <div>
            <div>
              <strong>{perspective[0]}</strong>
            </div>
            <div>
              <div className='perspective-bar'>
                <div className={`${toggleClassName[perspective[2]]}`}></div>
                <div className={`${toggleClassName[perspective[3]]}`}></div>
              </div>
            </div>
            <div>
              <strong>{perspective[1]}</strong>
            </div>
          </div>
          ))
        }
      </div>
    </div>
  </div>
  );
}

export default Home;
