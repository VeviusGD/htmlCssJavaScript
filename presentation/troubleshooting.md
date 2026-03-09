---
marp: true
theme: default
class: invert
paginate: true
---

# Troubleshooting, QA & Developer Tools

***

# **Presentation Guide: Mastering Chrome DevTools for QA & Troubleshooting**

## **1. Introduction: The Developer's Command Center**
Vieo Link: https://youtu.be/x4q86IjJFag?list=TLGGcd5srfTBjRcwNjAzMjAyNg
***
Google Chrome DevTools is the most important tool for web development. It allows us to "look under the hood" of any website to see how it is built, find bugs, and test performance.

*   **How to Access:** You can open it by pressing **F12**, **Ctrl+Shift+I**, or via the browser menu under **More Tools > Developer Tools**.
*   **Layout:** You can move the panel to the bottom, the sides, or "undock" it into its own window to see your website better.

---

## **2. The Elements Panel: Live-Editing HTML & CSS**
The **Elements Panel** is where we inspect the "source code" of a page. Any changes made here are **temporary**—they disappear if you refresh the page.

### **Visual Concept: The Box Model**
When you hover over code in the Elements panel, you will see colored boxes on the screen:
*   **Green:** Represents **Padding** (internal space).
*   **Orange:** Represents **Margin** (external space).

### **Demonstration: Live-Editing**
If we were looking at a standard heading, we could double-click the text in DevTools to change it instantly. 

**Example Code (What we see in the Inspector):**
```html
<!-- Before Editing -->
<h1 class="mt-5">Welcome to the Class</h1>

<!-- After Double-Clicking and Editing -->
<h1 class="mt-5">DevTools is Awesome!</h1>
```

---

## **3. Device Mode: Testing Responsive Design**
A major part of Quality Assurance (QA) is ensuring a site works on all screens. 

*   **The Icon:** Clicking the "Device Toggle" icon allows us to simulate different devices.
*   **Capabilities:** We can select specific presets like **iPhone 6** or **Galaxy S5** to see how the layout shifts from desktop to mobile.
*   **Orientation:** We can even flip the "phone" from **portrait to landscape** mode to test how the site reacts.

---

## **4. The Console: Finding and Fixing Bugs**
The **Console** is where JavaScript errors are logged. If a button on a website isn't working, the answer is usually a **red error message** in the Console.

### **Shortcuts for Troubleshooting:**
*   **`$0`**: This references the element you currently have selected in the Elements panel.
*   **`console.table()`**: This turns a messy list of data into a clean, readable table.

**Demonstration Code (Running JS in the Console):**
```javascript
// Typing this in the console changes the heading color to red instantly
$0.style.color = 'red';

// Typing this creates a clean data table for debugging
console.table([{name: "Bug 1", status: "Fixed"}, {name: "Bug 2", status: "Open"}]);
```

---

## **5. Network & Performance Tracking**
The **Network Panel** shows every file the browser downloads (images, scripts, CSS).

*   **Speed Check:** It shows the **Size** of files and the **Time** it takes to load them.
*   **XHR/Ajax Requests:** This is used to track "hidden" data requests. For example, when you click "Get Users," you can see the exact JSON data the server sends back.
*   **Audits (Lighthouse):** This tool runs a "health check" on the site, giving scores for **Performance, Accessibility, and SEO**.

---

# **Debugging**

Bug testing (often called debugging) is the process of finding and fixing problems in a website’s code to ensure it functions correctly for all users. For web developers, this often involves using browser developer tools to inspect live code, watching variable values, and finding the specific lines of code preventing a script from running.
## Key Steps to Debugging

1. Test things on your website to see if anything doesn't work
2. Finding something that doesn't function as intended
3. Checking the source code for errors/inconsistencies
4. Figuring out how to prevent the issue from occurring again
5. Running the new code to make sure it works intentionally

## Applying It
We have a code block here, but there are a few errors scattered inside it. Find the errors and fix them!

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
```
```html
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

## **All Solutions**
These are the solutions you should have found<br><br>
- **Solution 1:** The class and id name for the div don't match the styling name for the div.<br>Replace **&lt;div class="box" id="main-box"&gt;** with **&lt;div class="card" id="main-card"&gt;** on line 18.


- **Solution 2:** Pressing the left button doesn't change anything. Make sure the id you're finding matches the id of the button.<br>Replace **&lt;button id="btn-col"&gt;** with **&lt;button id="btn-color"&gt;** on line 22.


- **Solution 3:** Pressing the right button makes the box go off the screen. Make sure the value is positive, so it moves in the intended direction.<br>Remove the **"-"** from the **"200px"** on line 36.

---

# **Test Cases**
A standard test case typically includes a specific Action (the step the user takes), an Expected Result (how the site should respond), and a Pass/Fail status.
1. **Required Field Validation:**
Action: Leave a field marked with the required attribute empty and click the "Submit" button
.
Expected Result: The browser should prevent submission and display a validation message, such as "Please fill out this field"
.

2. **Error-Free Script Execution:**
Action: Open the Console panel and reload the form page
.
Expected Result: The console should be clear of red error messages, such as an Uncaught ReferenceError
3. **Responsive Mobile Layout:**
Action: Toggle Device Mode in DevTools and select a mobile device, like an iPhone 6
.
Expected Result: The form inputs should scale correctly to the screen width without horizontal scrolling or overlapping elements
4. **Color Contrast for Accessibility:**
Action: Use an accessibility tool or inspector to check the contrast of the "Submit" button text against its background
.
Expected Result: The contrast ratio should be at least 4.5:1 for normal text to ensure it is perceivable for all users

