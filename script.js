var testData = lyricsDictionary["Olivia Rodrigo"];
var trainData = lyricsDictionary["Taylor Swift"];
var model = {
  "blood": "done,bad",
  "well": "hell,bad",
  "fly": "funny,rumors",
  "hand": "stand, scar, guitar",
  "follow": "say, stray",
  "man": "hand, plans"
};
var currentLyric = 0;
var curTestLyric = 0;

var trainSelectElement = document.getElementById("trainSelect");
var testSelectElement = document.getElementById("testSelect");
var getTestLyrics = document.getElementById("getTestLyrics");
for (var key in lyricsDictionary) {
  var option = document.createElement("option");
  option.text = key;
  option.value = key;
  trainSelectElement.add(option);
}
for (var key in lyricsDictionary) {
  var option = document.createElement("option");
  option.text = key;
  option.value = key;
  testSelectElement.add(option);
}

trainSelectElement.addEventListener("change", function () {
  const selectedOptionValue = trainSelectElement.value;
  trainData = lyricsDictionary[selectedOptionValue];
  getTestLyrics.disabled = false;
  model = {};
  currentLyric = 0;
  getLyrics();
});
testSelectElement.addEventListener("change", function () {
  const selectedOptionValue = testSelectElement.value;
  testData = lyricsDictionary[selectedOptionValue];
  getTestLyrics.disabled = false;
  currentTestLyric = 0;
  getLyrics();
});


openTab(null, 'intro');



function reveal() {
  let lastLyric = trainData[currentLyric - 1].split(" ").pop();
  document.getElementById("output").value = lastLyric;
  generateButtons();
}


function getLyrics() {
  let lyricLine = trainData[currentLyric];
  var lastIndex = lyricLine.lastIndexOf(" ");
  lyricLine = lyricLine.substring(0, lastIndex);

  document.getElementById("textInput").value = lyricLine + " ________";
  currentLyric += 1;
  currentLyric %= trainData.length;
  clearButtons();
}

function getTestLyrics() {
  let lyricLine = testData[currentLyric];
  var lastIndex = lyricLine.lastIndexOf(" ");
  lyricLine = lyricLine.substring(0, lastIndex);

  document.getElementById("testLyrics").value = lyricLine + " ________";
  curTestLyric += 1;
  curTestLyric %= testData.length;
  clearButtons();
}



function clearButtons() {
  var buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = "";
  document.getElementById("output").value = ""
}

function generateButtons() {
  // Get the value of the text input field
  var sentence = document.getElementById("textInput").value;

  // Split the sentence into an array of words
  var words = sentence.split(" ");
  // Remove the last word from the array
  words.pop();
  // Clear the button container
  var buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = "Which words were most crucial in deciding what came next? <br />";

  // Generate a button for each word
  for (var i = 0; i < words.length; i++) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = words[i];
    button.onclick = function () {
      if (this.classList.contains("attention")) {
        this.classList.remove("attention");
      } else {
        this.classList.add("attention");
      }
      storeButtons()
    };
    buttonContainer.appendChild(button);
  }
}

function storeButtons() {
  // Get the value of the output field
  var output = document.getElementById("output").value;

  // Get all the red buttons
  var redButtons = document.querySelectorAll(".attention");

  console.log(redButtons)

  // Store the red buttons in the dictionary
  var red = "";
  for (var i = 0; i < redButtons.length; i++) {
    red += redButtons[i].value.replace(/[^\w\s\']|_/g, "").toLowerCase();
    if (i < redButtons.length - 1) {
      red += ", ";
    }
  }
  model[output] = red;

  // Display the dictionary in the textarea
  var dictionary = document.getElementById("dictionary");
  var finalModel = document.getElementById("finalModel");
  dictionary.value = "";
  finalModel.value = "";
  for (var key in model) {
    var value = model[key];
    dictionary.value += value + " => " + key + "\n";
    finalModel.value += value + " => " + key + "\n";
  }
}






function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Hide all the tab contents
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the "active" class from all the buttons
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  if (tabName == "train") {
    model = {};
  }
  if (tabName == "test") {
    var finalModel = document.getElementById("finalModel");
    finalModel.value = "";
    for (var key in model) {
      var value = model[key];
      finalModel.value += value + " => " + key + "\n";
    }
  }

  // Show the current tab content and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}



/*
const sentence = 'The quick brown fox jumps over the lazy dog';
const wordList = ['quick', 'fox', 'dog', 'cat'];
const percentage = calculatePercentage(sentence, wordList);
console.log(percentage); // Output: 50.00%
*/

function calculatePercentage(sentence, wordList) {
  const wordsInSentence = sentence.split(' ');
  for (let i = 0; i < wordsInSentence.length; i++) {
    wordsInSentence[i] = stripString(wordsInSentence[i]);
  }
  const totalWords = wordsInSentence.length;
  // console.log(wordsInSentence);
  // console.log(wordList);
  let foundWords = 0;
  for (let i = 0; i < wordList.length; i++) {
    var testword = stripString(wordList[i])
    if (wordsInSentence.includes(testword)) {
      foundWords++;
      console.log(wordList[i])
    }
  }
  // console.log(foundWords);
  const percentage = (foundWords / wordList.length) * 100;

  return percentage.toFixed(2) + '%';
}

function stripString(str) {
  var word = str.trim();
  word = word.replace(/[^\w\s\']|_/g, "");
  word = word.toLowerCase();
  word = word.replace(/[?=]/g, "/");
  return word;
}

function evaluateModel() {
  for (var i = 0; i < Object.keys(model).length; i++) {
    const tableDiv = document.getElementById("table");
    const table = document.createElement("table");
    table.classList.add("table");

    const tableCard = document.createElement("div");
    tableCard.classList.add("card");
    tableCard.appendChild(table);

    const header = table.createTHead();
    const headerRow = header.insertRow(0);

    const keyHeader = headerRow.insertCell(0);
    const percentageHeader = headerRow.insertCell(1);
    const wordsHeader = headerRow.insertCell(2);
    keyHeader.innerHTML = "Output";
    percentageHeader.innerHTML = "Percentage";

    const body = table.createTBody();
    if (trainData.length == 0) {
      alert("Training data is empty. Please select an artist first.");
    }
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        const wordList = model[key].split(",");
        const percentage = calculatePercentage(trainData[i], wordList);

        const row = body.insertRow();
        const keyCell = row.insertCell(0);
        const percentageCell = row.insertCell(1);
        const wordsCell = row.insertCell(2);

        // var h3Element = document.createElement("h5")
        // h3Element.textContent = key;
        // keyCell.innerHTML = h3Element.outerHTML;
        keyCell.innerHTML = key.toUpperCase();
        percentageCell.innerHTML = percentage;
        wordsCell.innerHTML = model[key];

        if (parseFloat(percentage) === 0) {
          row.classList.add("grey");
        } else if (parseFloat(percentage) <= 50) {
          row.classList.add("yellow");
        } else {
          row.classList.add("green");
        }
      }
    }


    const h2 = document.createElement("h2");
    h2.textContent = trainData[i];
    tableCard.appendChild(h2);
    tableDiv.appendChild(tableCard);
    tableDiv.appendChild(document.createElement("hr"));
  }
}


function testModel() {
  // var testLyrics = document.getElementById("testLyrics").value;

  const tableDiv = document.getElementById("testTable");
  tableDiv.innerHTML = "";
  for (var i = 0; i < Object.keys(model).length; i++) {
    const table = document.createElement("table");
    table.classList.add("table");

    const header = table.createTHead();
    const headerRow = header.insertRow(0);

    const keyHeader = headerRow.insertCell(0);
    const percentageHeader = headerRow.insertCell(1);
    const wordsHeader = headerRow.insertCell(2);
    keyHeader.innerHTML = "Output";
    percentageHeader.innerHTML = "Percentage";

    const body = table.createTBody();
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        const wordList = model[key].split(",");
        const percentage = calculatePercentage(testData[i], wordList);

        const row = body.insertRow();
        const keyCell = row.insertCell(0);
        const percentageCell = row.insertCell(1);
        const wordsCell = row.insertCell(2);

        keyCell.innerHTML = key.toUpperCase();
        percentageCell.innerHTML = percentage;
        wordsCell.innerHTML = model[key];

        if (parseFloat(percentage) === 0) {
          row.classList.add("grey");
        } else if (parseFloat(percentage) <= 50) {
          row.classList.add("yellow");
        } else {
          row.classList.add("green");
        }
      }
    }


    const h2 = document.createElement("h2");

    h2.textContent = testData[i];
    tableDiv.appendChild(h2);
    tableDiv.appendChild(table);
    tableDiv.appendChild(document.createElement("hr"));
  }
}