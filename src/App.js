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

    // let inputString = `${block.trim()}`;//PROBLEM, but ran out of time
    let inputString = block;//back up a little

    ////I need to learn how to sanitize inputs: copy / pasting from another source interferes with REGEX
    ////Regex currently only matches correctly on manual inputs or copy / paste from a plain text source.

    // Test this string: < Hello world “Dutch is Best”, “Pepperoni Pizza”, ‘Drone at the military base’, ‘beer’ >

    //regex breakdown:
    //for double Q: /"([^"]*)" 
    //for single Q: /'([^']*)'
    //for any lingering single words: /\S+
    // const doubleQ = /"([^"]*)"/g;
    // const singleQ = /'([^']*)'/g;
    // const singleWord = /\S+/gi;
    //global search
    // const regexSplit = /"([^"]*)"|'([^']*)'/gi; //reliably gets quoted areas. 
    // console.log(inputString.split(regexSplit))
    const regexPattern = /"([^"]*)"|'([^']*)'|\S+/gi;

    let matches = [];
    let match;

    //    ////Below is 'working'

    while (match = regexPattern.exec(inputString)) {
      //blaaah this isn't picking up correctly on paste with formatting.
      // console.log('test regex on block', inputString.slice(lastIndex, match.index))

      let currentPhrase = match[0];
      currentPhrase = currentPhrase.replace(/["',.]/g, '')
      matches.push(currentPhrase.trim());

    }
    setRedactedPhrases(matches)
    console.log(redactedPhrases);

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

      </div>

      <div id='middle-group'>

        <div id='working-redact'>
          <input type='text' id='redacted-phrase' placeholder='Single Phrase' />
          <button onClick={addRedaction}>Add individual phrase to redacted phrases</button>

        </div>
        <div id='redact-options'>

          <textarea type='text' id='redo-redacted' placeholder='String of Phrases' />
          <button onClick={addRedactionBlock}>Clear Individual phrases / Add group of phrases to redact</button>
          <p>Hit time limit--Known issues on group input: need to drop quotes when adding to list of phrases, regex inaccurate on copy / paste unless unformatted, string needs to be sanitized.</p>
        </div>
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
