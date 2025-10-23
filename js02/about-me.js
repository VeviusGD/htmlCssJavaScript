// Log messages to the browsers developer console
console.log("Page script has started running.");

// Show a simple alert box to welcome visitors when the page loads
alert("Welcome to my About Me page!");
console.log("Welcome alert has been shown.");

// Get a reference to the main content container
const contentContainer = document.getElementById('content-container');

// Main heading
const myName = "Matthew Phillips";
const nameHeading = document.createElement('h1');
nameHeading.textContent = myName;
contentContainer.appendChild(nameHeading);

// Paragraphs about myself
const aboutMeParagraphs = [
    "I am 16 years old and go to the Medina County Career Center. I've lived in Medina my entire life. I have two sisters, two dogs, and a cat. I work at Arby's and I play Soccer for the Medina High School.",
    "I also work for a game on Roblox called TDS: Reanimated. I make the gameplay and balance the game for the players. I also am considered the best player, as I was the first to break many records in the game, which led to my position in balancing.",
    "I play other games, like Terraria and Geometry Dash. I don't go out much and prefer to stay at home. I also like to take pictures of my cat and send them to my friends. Everyone loves my cat and we nicknamed him after a boss from one of the games I play because he likes to bite me and the boss is also very aggressive, like him."
];

// Loop through the array of paragraphs and add each one to the page
aboutMeParagraphs.forEach(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    contentContainer.appendChild(paragraph);
});

// Log a message after the content has been successfully added to the page
console.log("Dynamic content (name and paragraphs) has been written to the page.");