var imgFlag = false;
var factor = 4;

const fontDiv = document.querySelector('.Font');

var words = [];
const downloadBtn = document.getElementById("downloadBtn");
var Star = document.getElementById("starBtn");
var inputText = document.getElementById("inputText");
var submitBtn = document.getElementById("submitBtn");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.textBaseline = "top";
//ctx.fillStyle = 'white';
//ctx.fillRect(0,0,canvas.width, 200);
function getRandomCoordinates(w, word, fontSize) {
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var a = Math.floor(Math.random() * ((canvas.width/2)/factor - w));   // /2 because adding/subtracting from center
  var b = Math.floor(Math.random() * ((canvas.height/2 )/factor - fontSize));
  var angle = Math.random() * 2 * Math.PI;
  var x = centerX + a * Math.cos(angle);   // BMVP  centerX - a < x < centerX + a
  var y = centerY + b * Math.sin(angle);
  return [x, y];

  // var x = Math.floor(Math.random() * (canvas.width - w));
  // var y = Math.floor(Math.random() * (canvas.height - fontSize));
	// return [x, y];
}

// Function to check if a word overlaps with any existing words
function isOverlapping( x, y, width, height) {
  // Get the image data for the first word
  var imageData1 = ctx.getImageData(x, y, width, height);
  // Check for any overlapping pixels
  console.log("inside isOverlapping");
  for (var j = 0; j < imageData1.data.length; j += 4) {  
    for(var k = 0; k < 3;k++){
      if (imageData1.data[j + k] !== 0) { //check rgb values to see if they are anything but white
        return true;
      }
    }
  }
  return false;
}
function getWordCount(text, word) {
  var words = text.split(" ");
  var count = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i] === word.text) {
      count++;
    }
  }
  return count;
}

function removeDuplicates(textArr) {
  var uniqueWords = [];
  //var counts = getWordCount(inputText.value);
  for (var i = 0; i < textArr.length; i++) {
    var word = textArr[i];
		var found = false;
      if (word.length == 0) 
      continue;
      for (var j = 0; j < uniqueWords.length; j++) {
        if (uniqueWords[j].text === word) {
					found = true;
					break;
        }
      }
      if (!found) {
        uniqueWords.push({
        text: word,
        font: "30px Arial",
        x: -1,
        y: -1,
        width: 1,
        height: 30
      });
    }
  }
  return uniqueWords;
}
    
function starFcn(){
  var backgroundImg = document.getElementById("ImageForm")
  imgFlag = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.src = 'https://compsci04.snc.edu/cs460/2023/mannrj/star.png';
  img.crossOrigin = "Anonymous";
  img.onload = function() {
  ctx.drawImage(img, 0, 0);
  }
}

function bottleFcn(){
  var backgroundImg = document.getElementById("ImageForm")
  imgFlag = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.src = 'https://compsci04.snc.edu/cs460/2023/mannrj/bottle.png';
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  }
}

function sncFcn(){
  var backgroundImg = document.getElementById("ImageForm")
  imgFlag = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.src = 'https://compsci04.snc.edu/cs460/2023/mannrj/snc.png';
  img.crossOrigin = "Anonymous";
  img.onload = function() {
  ctx.drawImage(img, 0, 0);
  }
}

function clearScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
    
function placeWords(success, words, x, y, ctx){
  for (var i = 0; i < words.length; i++) {
    var tries = 1;
		factor = 4;
    success = false;
    while (tries < 400 && factor > 0)  {
      var coords = getRandomCoordinates(words[i].width, words[i], words[i].height);  //BMVP CHANGED first parameter MARCH 4
      x = coords[0];
			y = coords[1];
				
			if (!isOverlapping(x, y, words[i].width, words[i].height)){
			  success = true;
				break;
			}
      tries++;
      if(tries %100 === 0){
        factor--;
      }
    }

    //ctx.strokeRect()
		if (success){
      ctx.font = words[i].font;

      const colorDiv = document.querySelector('.Color');
      const checkedColors = colorDiv.querySelectorAll('input[type="checkbox"]:checked');
      const selectedColors = Array.from(checkedColors).map(box => box.value);
      var randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
    	ctx.fillStyle = randomColor;
			ctx.fillText(words[i].text, x, y);
		}
		else 
      console.log("unable to place the word: " + words[i].text);
  } // end for

  console.log(words);
}

function min(a, b) {
  if (a < b) return a;
    return b;
}

function submit() {
  var maxStr = document.getElementById('max').value;
  var minStr = document.getElementById('min').value;
  var MAX_FONT_SIZE = Number(maxStr);
  var MIN_FONT_SIZE = Number(minStr);
  var originalText = inputText.value;
  var text1 = originalText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  var text2 = text1.replace(/\s+/g, ' ');  // multiple spaces gone, right?
  var text = text2.replace(/\n/g," "); // end-of-line gone, right?
  var font = "30px Arial";
  words = []; // Clear the words array
  words = removeDuplicates(text.split(" ")); 

  // var text = inputText.value;
  // var font = "30px Arial";
  // words = []; // Clear the words array
  // words = removeDuplicates(text.split(" "));
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
        
  ctx.font = font;
  var success = false;      
  var maxFrequency = 0;
  for (var k = 0; k < words.length; k++){
    var count = getWordCount(text, words[k]);
    words[k].frequency = count;
    if (count > maxFrequency)
      maxFrequency = count;
    }
    for (var i = 0; i < words.length; i++) {
      //  var count = getWordCount(text, words[i]);
      count = words[i].frequency;
      //BMVP
      //var delta = 10;//(MAX_FONT_SIZE-MINFONTSIZE)/greatestfrequency;
      // var MIN_FONT_SIZE = 12;
      if(MAX_FONT_SIZE === 0){MAX_FONT_SIZE = 100;}
      if(MIN_FONT_SIZE == 0){MIN_FONT_SIZE = 12;}

      console.log("min font= ", MIN_FONT_SIZE);
      console.log("max font= ", MAX_FONT_SIZE);

      var delta = (MAX_FONT_SIZE - MIN_FONT_SIZE)/maxFrequency;
      //var fontSize = 12 + ((count * 2) / words.length) * (MAX_FONT_SIZE - 30);
      var fontSize = min(MIN_FONT_SIZE + 2*(count-1)*delta, MAX_FONT_SIZE);
            
      // var fonts = ["Arial", "Times New Roman", "Verdana"];
      const fontDiv = document.querySelector('.Font');
      const checkedFonts = fontDiv.querySelectorAll('input[type="checkbox"]:checked');
      const selectedFonts = Array.from(checkedFonts).map(box => box.value);
      var randomFont = selectedFonts[Math.floor(Math.random() * selectedFonts.length)];

      ctx.font = fontSize + "px " + randomFont;
      words[i].font = fontSize + "px " + randomFont;
      var width = ctx.measureText(words[i].text).width;
      var height = fontSize;
      var x, y;
          
      words[i].width = width;
      words[i].height = height;
    }
    //sorts words from largest to smallest
    words.sort(function(a, b) {
    if (a.height === b.height) {
      return b.width - a.width;
    } else {
      return b.height - a.height;
    }
  });
  placeWords(success, words, x, y, ctx);
} // submit

    
    function downloadCanvas() {
        const canvas = document.getElementById("myCanvas");
        const link = document.createElement("a");
        link.download = "word_cloud.png";
        link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();
        }