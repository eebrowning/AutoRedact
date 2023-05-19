import logo from './logo.svg';
import react, { useState } from 'react'
import './App.css';


function App() {
  const [userText, setUserText] = useState();
  const [redactedPhrases, setRedactedPhrases] = useState([]);

  const [redactedText, setRedactedText] = useState("");


  const handleFileUpload = (event) => {//upload file, and read its contents
    const file = event.target.files[0];
    const reader = new FileReader(); //had to refer to https://developer.mozilla.org/en-US/docs/Web/API/FileReader

    reader.onload = (e) => {
      const fileContents = e.target.result;
      // setUserText(fileContents);//maybe not needed?
      setRedactedText(fileContents)
    };

    reader.readAsText(file); // Read the file as text
  };
  const addRedaction = () => {
    //if phrase isn't in current list of phrases...
    if (redactedPhrases.indexOf(document.getElementById('redacted-phrase').value) == -1) {
      setRedactedPhrases([...redactedPhrases, document.getElementById('redacted-phrase').value])
    }

  }

  const redactFile = () => {
    // Here I can manipulate the content.
    //simple regex: 
    ////literal matches, piped together, searched globally and case-insensitive:
    const redactRegex = new RegExp(redactedPhrases.join('|'), 'gi');
    ////could be improved to avoid things like redacting 'to' resulting in 'alXXXXgether' from 'altogether'
    ////but, in this case, I doubt anyone will be redacting smaller words that can lie within others.

    const redactedString = redactedText.replace(redactRegex, 'XXXX');//swap out phrases.

    setRedactedText(redactedString);
  }


  function downloadFile() {

    const fileName = "redacted.txt"; // Replace with your desired file name

    const element = document.createElement('a');
    const file = new Blob([redactedText], { type: 'text/plain' });//replace user text with redacted text when the time comes

    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  return (
    <div className="App">


      <div id='inputs'>
        <input type="file" id="fileInput" onChange={handleFileUpload} />
        <input type='text' id='redacted-phrase' />
        <button onClick={addRedaction}>Add phrase to redact</button>
      </div>
      <div>
        <button id='confirm-redaction' onClick={redactFile}>Confirm Phrases</button>
        <button id="downloadButton" onClick={downloadFile}>Download Redacted File</button>
      </div>

      <div id='phrases'> Phrases
        {
          redactedPhrases.map(phrase => (
            <h3 className='phrase' key={phrase}>
              {phrase}
            </h3>
          ))
        }
      </div>
      <h2>Current Text</h2>
      <p>
        {redactedText}
      </p>
    </div>
  );
}

export default App;
