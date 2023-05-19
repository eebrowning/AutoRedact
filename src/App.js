import logo from './logo.svg';
import react, { useState } from 'react'
import './App.css';


function App() {
  // const [userText, setUserText] = useState();
  const [redactedPhrases, setRedactedPhrases] = useState([]);
  const [redactedText, setRedactedText] = useState("");

  ///////////HANDLER FUNCTIONS
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
  const handleBlockSubmit = () => {
    let text = document.getElementById('block-input').value;
    setRedactedText(text)

  }

  const addRedaction = () => {
    //if phrase isn't in current list of phrases...
    if (redactedPhrases.indexOf(document.getElementById('redacted-phrase').value) == -1) {
      setRedactedPhrases([...redactedPhrases, document.getElementById('redacted-phrase').value])
    }
  }
  const addRedactionBlock = () => {
    //block of redactions:
    let block = document.getElementById('redo-redacted').value;
    console.log(block)
    let inputString = block.trim();
    // let inputString = 'Hello world "Dutch is Best", "Pepperoni Pizza", \'Drone at the military base\', \'beer\'';
    // inputString = inputString.split(',').join(' ');

    //regex breakdown:
    //for double Q: /"([^"]*)" 
    //for single Q: /'([^']*)'
    //for any lingering single words: /\S+
    //global search
    const regexPattern = /"([^"]*)"|'([^']*)'|\S+/g;

    let matches = [];
    let match;

    while ((match = regexPattern.exec(inputString)) !== null) {
      const matchedPart = match[1] || match[2] || match[0]; // Use match[1] if it exists, otherwise use match[2], or use match[0] (non-quoted part)
      matches.push(matchedPart);
    }

    console.log(matches);

    matches = matches.filter(entry => entry != ',')

    setRedactedPhrases(matches)

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

    const fileName = "redacted.txt";

    const element = document.createElement('a');
    const file = new Blob([redactedText], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  return (
    <div className="App">


      <div id='inputs'>
        <label>
          <span>Text file upload</span>
          <input type="file" id="fileInput" accept='.txt' onChange={handleFileUpload} />
        </label>
        <label>
          <textarea id='block-input' />
          <button onClick={handleBlockSubmit}> or Submit Text Block</button>
        </label>

        {/* <input type='text' id='redacted-phrase' />
        <button onClick={addRedaction}>Add phrase to redacted phrases</button> */}

        <input type='text' id='redo-redacted' />
        <button onClick={addRedactionBlock}>Add group of phrases to redact</button>

      </div>

      <h2>Phrases to redact</h2>
      <div id='phrases'>
        {
          redactedPhrases.map(phrase => (
            <h3 className='phrase' key={phrase}>
              {phrase}
            </h3>
          ))
        }
      </div>

      <div>
        <button id='confirm-redaction' onClick={redactFile}>Redact Phrases</button>
        <button id="downloadButton" onClick={downloadFile}>Download Redacted File</button>
      </div>
      <h2>Current Text, updates after 'Redact Phrases'</h2>
      <p>
        {redactedText}
      </p>
    </div>
  );
}

export default App;
