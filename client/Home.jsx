import React, { useState } from 'react';
import questions from './questions';
import functs from './functs';

const { range, fetchRequestHandler, validateEmail } = functs;

const Home = () => {
  const [ email, getEmail ] = useState('');
  const [ errMessage, setErrMessage ] = useState('');
  const [ responses, updateResponse ] = useState({});
  const [ displayResult, updateDisplayResult ] = useState(false);
  const [ toggleClassName, setClassName ] = useState({});
  const [ mbtiScore, updateScore ] = useState('');
  const mbtiDimension = {
    EI: ['E', 'I'],
    SN: ['S', 'N'],
    TF: ['T', 'F'],
    JP: ['J', 'P'],
  }
  
  const onSubmit = async () => {
    if (Object.keys(responses).length !== 10)
      return setErrMessage('Please complete all questions');
    if (!email)
      return setErrMessage('Please provide your email address in the field below');
    if (!validateEmail(email))
      return setErrMessage('Please provide a valid email address');

    // calculate score and submit
    const questionIdx = Object.keys(responses);
    const mbtiScoring = {};
    questionIdx.forEach((qIdx )=> {
      const question = questions[qIdx];
      const answer = responses[qIdx];
      const dimension = question.dimension;
      const meaning = question.meaning;
      const direction = question.direction;
      const dimArray = mbtiDimension[dimension];
      const switchedMeaning = dimArray.find(dim => dim !== meaning);

      if (mbtiScoring[dimension]) {
        mbtiScoring[dimension] = mbtiScoring[dimension] + answer;
        if ((answer > 4 && direction === 1) || (answer > 4 && direction === -1)) {
          mbtiScoring[meaning] = mbtiScoring[meaning] + 1;
        } else if ((answer < 4 && direction === 1) || (answer < 4 && direction === -1)) {
          mbtiScoring[switchedMeaning] = mbtiScoring[switchedMeaning] + 1;
        } else if (answer === 4) {
          mbtiScoring[dimArray[0]] = mbtiScoring[dimArray[0]] + 1;
        }
      } else {
        mbtiScoring[dimension] = answer;
        mbtiScoring[dimArray[0]] = 0;
        mbtiScoring[dimArray[1]] = 0;
        if ((answer > 4 && direction === 1) || (answer > 4 && direction === -1)) {
          mbtiScoring[meaning] = 1;
        } else if ((answer < 4 && direction === 1) || (answer < 4 && direction === -1)) {
          mbtiScoring[switchedMeaning] = 1;
        }  else if (answer === 4) {
          mbtiScoring[dimArray[0]] = 1;
        }
      }
    });

    // create collection of hightest scores across dimension &
    // update the toggleClassName object
    const score = Object.keys(mbtiDimension).map(dim => {
      const dimArray = mbtiDimension[dim];
      const dim1 = dimArray[0];
      const dim2 = dimArray[1];
      if (mbtiScoring[dim1] > mbtiScoring[dim2]) {
        toggleClassName[dim1] = 'mbti-on';
        setClassName(toggleClassName);
        return dim1;
      } else if (mbtiScoring[dim1] < mbtiScoring[dim2]) {
        toggleClassName[dim2] = 'mbti-on';
        setClassName(toggleClassName);
        return dim2;
      } else {
        toggleClassName[dim1] = 'mbti-on';
        setClassName(toggleClassName);
        return dim1;
      }
    }).join('');
  
    updateScore(score);
    updateDisplayResult(true);

    responses.email = email;
    responses.mbtiScore = score;
    const serverResponse = await fetchRequestHandler(responses);
    console.log(serverResponse);
  }

  const handleChange = (event) => {
    const [ questionIdx, userResponse ] = [ ...event.target.value.split(' ')];
    const questionIndex = parseInt(questionIdx, 10);
    responses[questionIndex] = parseInt(userResponse, 10);
    updateResponse(responses);
  }

  const closeErrorModal = () => {
    setErrMessage('');
  }


  return (
    <div>
      {
      displayResult ? (
        <ResultPage
          mbtiScore ={ mbtiScore }
          toggleClassName={toggleClassName}
        />
      ) : (
        <HomePage
          handleChange={handleChange}
          onSubmit={onSubmit}
          getEmail={getEmail}
          closeErrorModal={closeErrorModal}
          range={range}
          errMessage={errMessage} 
          questions={questions}
        />
      )
    }
    </div>
  );
};

const HomePage = ({
  handleChange,
  onSubmit,
  getEmail,
  closeErrorModal,
  range,
  errMessage,
  questions
}) => {
  return (
    <div id='perspective-test'>
      <div id="header">
        <h1>Discover Your Perspective</h1>
        <p>Complete the 7 min test and get a detailed report of you lenses on the world.</p>
      </div>
      <div>
        { 
          errMessage ? (
            <div id="error-modal">
              <span><button onClick={closeErrorModal}>x</button></span>
              <p>
                {errMessage}
              </p>
            </div> 
          ): null
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
                  <div className='radio-group'>
                  {
                    range(7).map(count => {
                      return (
                        <div key={count}>
                          <input
                            type='radio'
                            className="answer-radio"
                            id={`answer${index}${count+1}`}
                            name={`answer${index}`}
                            onChange={handleChange}
                            value={`${index} ${count + 1}`}
                          />
                          <label htmlFor={`answer${index}${count+1}`}></label>
                          <div className='check'></div>
                        </div>
                      )
                    })
                  }
                  </div>
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
          <input
            name='email'
            type='text'
            placeholder='you@example.com'
            onChange={e => getEmail(e.target.value)}
          />
        </div>
        <div id='submit-div'>
          <input
            type='submit'
            value='Save & Continue'
            name='submit'
            onClick={onSubmit}
          />
        </div>
      </div>
  </div>
  )
}

const ResultPage = ({ mbtiScore, toggleClassName }) => {
  const perspectives = [
    ['Introversion (I)', 'Extraversion (E)', 'I', 'E' ],
    ['Sensing (S)', 'Intuition (N)', 'S', 'N' ],
    [ 'Thinking (T)', 'Feeling (F)', 'T', 'F' ],
    [ 'Judging (J)', 'Perceiving (P)', 'J', 'P' ],
  ];
  return (
    <div id='perspective-result'>
      <div>
        <div id='heading'>
        <h1>Your Perspective</h1>
        <p>Your Perspective Type is {mbtiScore} </p>
      </div>
      <div id='perspective-summary'>
        <div>
          {
            perspectives.map((perspective, index)=> (
              <div key={index}>
              <div>
                <strong>{perspective[0]}</strong>
              </div>
              <div>
                <div className='perspective-bar'>
                  <div className={`${toggleClassName[perspective[2]]}`}></div>
                  <div className={`${toggleClassName[perspective[3]]}`}></div>
                </div>
              </div>
              <div className="perspective-right">
                <strong>{perspective[1]}</strong>
              </div>
            </div>
            ))
          }
        </div>
      </div>
      </div>
    </div>
  );
}

export default Home;
