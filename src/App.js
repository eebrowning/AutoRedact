import logo from './logo.svg';
import react, { useState } from 'react'
import './App.css';


function App() {
  const [userText, setUserText] = useState();
  const [redactedPhrases, setRedactedPhrases] = useState([]);

  const [redactedText, setRedactedText] = useState("");


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContents = e.target.result;

      // Here I can manipulate the content.
      console.log(fileContents);

      let contentArray = fileContents.split(" ");


      console.log(contentArray)

      setUserText(fileContents)


    };

    reader.readAsText(file); // Read the file as text
  };
  const addRedaction = () => {
    //if phrase isn't in current list of phrases...
    if (redactedPhrases.indexOf(document.getElementById('redacted-phrase').value) == -1) {
      setRedactedPhrases([...redactedPhrases, document.getElementById('redacted-phrase').value])
    }
    // console.log(redactedPhrases)

  }

  const redactFile = () => {


  }


  function downloadFile() {

    const fileName = "redacted.txt"; // Replace with your desired file name

    const element = document.createElement('a');
    const file = new Blob([userText], { type: 'text/plain' });//replace user text with redacted text when the time comes

    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
  }





  return (
    <div className="App">
      {/* <header className="App-header">
      </header> */}

      <div id='inputs'>

        <input type="file" id="fileInput" onChange={handleFileUpload} />
        <input type='text' id='redacted-phrase' />
        <button onClick={addRedaction}> Add phrase to redact</button>

        <button id="downloadButton" onClick={downloadFile}>Download Redacted File</button>

      </div>
      <div>
        {
          redactedPhrases.map(phrase => (
            <h3 key={phrase}>
              {phrase}
            </h3>
          ))
        }
      </div>
      <p>
        {userText}
      </p>
    </div>
  );
}

export default App;
