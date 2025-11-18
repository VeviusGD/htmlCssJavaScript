// ============================================
// TEAM PROFILE PAGE
// Team Members: [Connor/Matthew]
// ============================================

// ============================================
// MEMBER 1 VARIABLES
// ============================================

let member1Name = "Connor";
let member1Age = 16;
let member1Game = "Walking Dead";
let member1Music = "Juice WRLD";
let member1BestFood = "American chop suey";
let member1Restaurant = "Chipotle";
let member1PitBull = "Yes, they eat kids";
let member1Basketball = "Kobe";
let member1Future = "In college studying computer science, working on a business";


// ============================================
// MEMBER 2 VARIABLES
// ============================================

let member2LEBRONSname = "Matthew";
let member2LEBRONSage = 16;
let member2LEBRONSgame = "Terraria";
let member2LEBRONSmusic = "Calamity OST";
let member2LEBRONSbestFood = "Quesadillas";
let member2LEBRONSrestaurant = "Taco Bell";
let member2LEBRONSpitBull = "No";
let member2LEBRONSbasketball = "LeBron";
let member2LEBRONSfuture = "Making a video game";

//Just copy from member 1 and change values: 
// let's debug the member2Age issue here - we need to define the member2Age variable or the .js won't run //


// ============================================
// TEAM CALCULATIONS
// ============================================

// How many team members?
let totalMembers = 2;  // Change this to 3 if you have 3 people!

// Calculate total age
let totalAge = member1Age + member2LEBRONSage;  // Add member3Age if needed

// Calculate average age
let averageAge = totalAge / totalMembers;

// ============================================
// DISPLAY TEAM STATS
// ============================================

document.getElementById('total-members').textContent = totalMembers;
document.getElementById('total-age').textContent = totalAge;
document.getElementById('average-age').textContent = averageAge.toFixed(1);

// ============================================
// DISPLAY MEMBER 1
// ============================================

document.getElementById('member1Name').textContent = member1Name;
document.getElementById('member1Age').textContent = member1Age;
document.getElementById('member1Game').textContent = member1Game;
document.getElementById('member1Music').textContent = member1Music;
document.getElementById('member1BestFood').textContent = member1BestFood;
document.getElementById('member1Restaurant').textContent = member1Restaurant;
document.getElementById('member1PitBull').textContent = member1PitBull;
document.getElementById('member1Basketball').textContent = member1Basketball;
document.getElementById('member1Future').textContent = member1Future;


// ============================================
// DISPLAY MEMBER 2
// ============================================

document.getElementById('member2LEBRONSname').textContent = member2LEBRONSname;
document.getElementById('member2LEBRONSage').textContent = member2LEBRONSage;
document.getElementById('member2LEBRONSgame').textContent = member2LEBRONSgame;
document.getElementById('member2LEBRONSmusic').textContent = member2LEBRONSmusic;
document.getElementById('member2LEBRONSbestFood').textContent = member2LEBRONSbestFood;
document.getElementById('member2LEBRONSrestaurant').textContent = member2LEBRONSrestaurant;
document.getElementById('member2LEBRONSpitBull').textContent = member2LEBRONSpitBull;
document.getElementById('member2LEBRONSbasketball').textContent = member2LEBRONSbasketball;
document.getElementById('member2LEBRONSfuture').textContent = member2LEBRONSfuture;


// again copy from member 1, but remember to change the element IDs: 'member2-name' etc.



// ============================================
// LOG TO CONSOLE (for testing)
// ============================================

console.log("Team loaded!");
console.log("Total members:", totalMembers);
console.log("Total age:", totalAge);
console.log("Average age:", averageAge);