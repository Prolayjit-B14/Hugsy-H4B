function playRhyme(rhyme) {
    let audio = document.getElementById(rhyme + 'Audio');
    let textDiv = document.getElementById(rhyme);
    let lines = textDiv.getElementsByTagName('p');
    
    // Hide all rhymes first and then show the selected rhyme
    document.querySelectorAll('.rhyme').forEach(el => el.style.display = 'none');
    textDiv.style.display = 'block';
    
    // Reset wordIndex and add words to an array
    let wordIndex = 0;
    let words = [];
    
    // Split the lines into words
    for (let line of lines) {
        words.push(...line.innerText.split(' '));
    }
    
    // Function to highlight each word
    function highlightWord() {
        // Remove previous highlights
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        
        if (wordIndex < words.length) {
            let currentWord = words[wordIndex];
            
            // Find the line containing the word and highlight it
            for (let line of lines) {
                if (line.innerText.includes(currentWord)) {
                    let updatedText = line.innerHTML.replace(currentWord, `<span class='highlight'>${currentWord}</span>`);
                    line.innerHTML = updatedText;
                    break;
                }
            }
            
            wordIndex++;
            setTimeout(highlightWord, 500); // Highlight word every 500ms
        }
    }
    
    // Play audio and highlight words
    audio.play();
    highlightWord();
}
