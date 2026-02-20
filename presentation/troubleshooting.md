---
marp: true
theme: default
class: invert
paginate: true
---

# Troubleshooting, QA & Developer Tools

---

<h1>Developer Tools</h1>
Developer Tools are a group of tools that are built into the web browser for people developing systems and websites to use. They allow you to edit pages, find and diagnose issues, and analyze how the page performs. There are a few ways to access them, depending on the browser you use, and it has multiple built-in features that each do different things.
<h3>Inspector Panel</h3>
The Inspector Panel shows the HTML and CSS the exact same way the browser shows it. It is typically the default view in browser tools and acts as a Document Object Model (DOM) and a CSS Editor.
<h3>Console Panel</h3>
The Console Panel reports errors the browser encounters while running code and allows you to execute your own JavaScript on the page. It's used for debugging JavaScript and viewing messages sent to the console.
<h3>Sources Panel</h3>
The Sources Panel allows you to view all of the files associated with the page and can pause code in the middle of it being executed. It's used for more advanced JavaScript debugging and file management.


<h1>Troubleshooting</h1>
<p>We have a code block here, but theres a few errors in it. Find the errors and fix them!</p>

```html
<!DOCTYPE html>
<html>
<head>
    <title>Bug Hunt</title>
    <style>
        body { font-family: sans-serif; text-align: center; }
        .card {
            border: 2px solid black;
            padding: 20px;
            background-color: lightblue;
            transition: all 1.25s ease;
            width: 50%;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <div class="box" id="main-box">
        <h1>Bug Checking</h1>

        <p>Use the buttons below to modify the box:</p>
        <button id="btn-col">Change Color</button>
        <button id="btn-move">Move Box</button>
    </div>

    <script>
        console.log("Page Loaded!");

        const card = document.getElementById('main-card');
        const colorBtn = document.getElementById('btn-color');
        const moveBtn = document.getElementById('btn-move');

        colorBtn.addEventListener('click', () => {
            card.style.backgroundColor = 'lightgreen';
        });

        moveBtn.addEventListener('click', () => {
            card.style.marginTop = '-200px';
        });
    </script>
</body>
</html>
```


# All Solutions
These are the solutions you should have found<br><br>
Solution 1: The class and id name for the div don't match the styling name for the div.<br>Replace &lt;div class="box" id="main-box"&gt; with &lt;div class="card" id="main-card"&gt; on line 18.
<br><br>
Solution 2: Pressing the left button doesn't change anything. Make sure the id you're finding matches the id of the button.<br>Replace &lt;button id="btn-col"&gt; with &lt;button id="btn-color"&gt; on line 22.
<br><br>
Solution 3: Pressing the right button makes the box go off the screen. Make sure the value is positive, so it moves in the intended direction.<br>Remove the - from the '200px' on line 36.