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
  ////I need to learn how to sanitize inputs: copy / pasting from another source interferes with REGEX
  ////Regex currently only matches correctly on manual inputs or copy / paste from a plain text source.
  //////UPDATE 5/27/23-> IT'S THE EFFING QUOTES -> check current solution
  /////->find a way to replace any non-standard space / punctuation / character 
  // Test this string: < Hello world “Dutch is Best”, “Pepperoni Pizza”, ‘Drone at the military base’, ‘beer’ >
  // Versus this string: < Hello world 'Dutch is Best', "Pepperoni Pizza", "Drone at the military base", 'beer' >
  const addRedactionBlock = () => {
    //block of redactions:
    let block = document.getElementById('redo-redacted').value;


    block = block.replace(/[^\x00-\x7F]/g, '"');
    //current solution to curly quotes--> replace ANY non-standard with a standard double quote <">, see below
    // https://stackoverflow.com/questions/150033/regular-expression-to-match-non-ascii-characters
    // non-standard characters of any other kind may break this by introducing a single character of the double quote <">,
    // but current scrubbing of quotes later on may keep that from happening /shrug
    console.log(block)
    let inputString = block;//back up a little
    //regex breakdown:
    //for double Q: /"([^"]*)" 
    //for single Q: /'([^']*)'
    //for any lingering single words: /\S+
    // const doubleQ = /"([^"]*)"/g;
    // const singleQ = /'([^']*)'/g;
    // const singleWord = /\S+/gi;

    const regexPattern = /"([^"]*)"|'([^']*)'|\S+/gi;

    let matches = [];
    let match;

    //    ////Below is 'working' -> ITS THE QUOTATION MARKS THAT ARE INCONSISTENT!!!!!!!

    while (match = regexPattern.exec(inputString)) {
      //blaaah this isn't picking up correctly on paste with formatting.
      // console.log('test regex on block', inputString.slice(lastIndex, match.index))

      let currentPhrase = match[0];
      currentPhrase = currentPhrase.replace(/["',.]/g, '');
      if (currentPhrase && matches.indexOf(currentPhrase) == -1) matches.push(currentPhrase.trim());

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
          <p>Post Time Limit: 5/27/23, This seems as close to 'correct' as I think I can get</p>
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
