import React from 'react';
import './App.css';

function App() {
  const [fullText, setFulltext] = React.useState('');
  const [sentence, setSentence] = React.useState('');

  // if you want to have getBook run right when component (App) mounts and run once,
  // just useEffect() with an empty dependency array
  // doing this was able to solve the problem where we were having to hit the 
  // getBook button before we hit the sentencePrediction button
  React.useEffect(() => {
    // Happens when Component mounts
    getBook('www.gutenberg.org/cache/epub/63393/pg63393.txt');
  }, []);

  // this handles the side effect of logging the object created from fullText
  React.useEffect(() => {
    // Runs every render. runs again when fullText or sentence changes.
    if (fullText) {
      const wordMap = bookObject(fullText);
      console.log(wordMap);
    }
    if (sentence) {
      console.log(sentence);
    }
  }, [fullText, sentence]);

  // this function retrieves book, sets state 
  function getBook(book) {
    // use https://cors-anywhere.herokuapp.com/ to bypass cors restrictions
    fetch('https://cors-anywhere.herokuapp.com/' + book, {
      'Content-Type': 'text/plain',
    })
    .then(response => response.text())
    .then(data => {
      console.log(typeof data);
      setFulltext(data);
      return fullText;
    })
    .catch(error => console.error(error))
  }

  // this function will create an object of key:value pairs of word:subsequent words from our book
  function bookObject(book) {
    // Dafuq is re?
    // ↵
    let bookList = book.replace(/\n/ig, ' ')
    .replace(/["".,!\*;:_~()]+/g," ")
    .replace(/'/g, '')
    .replace(/--/g, ' ')
    .replace(/\s{2,}/g,' ')
    .split(/\s+/)
    .map(word => word.toLowerCase());

    console.log(bookList)

    let bookObj = {};
    bookList.forEach(( book, index ) => {
      const nextword = bookList[index + 1];
      if (nextword) {
        if (!bookObj[book]) {
          bookObj[book] = [nextword];
        } else {
          bookObj[book].push(nextword);
        }
      }
    });
    return bookObj;
  }
  // the problem right now is that we have to click on book stuff before we click on prediction,
  // otherwise bookObj is an empty object, because state for fullText has not been set
  // and that's because getBook is async, so even if you run getBook inside predictSentence, the rest of the function 
  // runs before fullText has been updated in state

  function predictSentence(text = fullText, word, n) {
    const bookObj = bookObject(text);
    let newSentence = word;
    for (let i = 0; i < n; i++) {
      let nextWord = bookObj[word][Math.floor(Math.random()*bookObj[word].length)];
      console.log(newSentence);
      newSentence = newSentence + ' ' + bookObj[word][Math.floor(Math.random()*bookObj[word].length)];
      word = nextWord;
    }
    setSentence(newSentence);
    return newSentence;
    
  }

  return (
    <div>
      <div>
        <button onClick={() => predictSentence(fullText, 'project', 10)}>
        Click me for a prediction
        </button>
      </div>
      <div>
        <button onClick={() => getBook('www.gutenberg.org/cache/epub/63393/pg63393.txt')}>
        Click me for book stuff
        </button>
      </div>
      <div>
        <button onClick={() => console.log('hello')}>
        Click for hello
        </button>
      </div>
    </div>
  );
}

export default App;
