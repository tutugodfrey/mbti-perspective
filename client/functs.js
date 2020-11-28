export default {
  range: (start=0, end=0, interval=1) =>  {
    const range = [];
    if (start && end === 0) {
      end = start;
      start = 0;
    }
    for(let i = start; i < end; i+=interval) {
      range.push(i);
    }
    return range;
  },
  fetchRequestHandler: (data) => {
    fetch('http://localhost:3005/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
      return result;
    })
    .catch((error) => {
      return error;
    });
  },
  validateEmail:  (email) => {
    const emailRegEx = /\w+@\w+\.(net|com|org|co)/i;
    const test = emailRegEx.test(email);
    return test;
  }
}
