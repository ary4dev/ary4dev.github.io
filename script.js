// windows
function getRandomVal(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let z = 5;
function openWindow(element) {
    let windowElement = document.getElementById(`win${element.id}`);
    windowElement.style.display = "block";
    windowElement.style.zIndex = z++;
    windowElement.style.top = `${getRandomVal(20, 40)}%`;
    windowElement.style.left = `${getRandomVal(20, 60)}%`;
}

function closeWindow(e) {
    const grandParent = e.closest('.window');
    grandParent.style.display = "none";
}

const windows = document.querySelectorAll(".window");

windows.forEach(el => {
    const titlebar = el.querySelector(".titlebar");
    titlebar.addEventListener("pointerdown", e => {
        e.preventDefault();
        let startX = e.clientX;
        let startY = e.clientY;
        
        function drag(e) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = el.offsetLeft + dx + "px";
            el.style.top = el.offsetTop + dy + "px";
            startX = e.clientX;
            startY = e.clientY;
        }

        function stopDrag() {
            document.removeEventListener("pointermove", drag);
            document.removeEventListener("pointerup", stopDrag);
        }

        document.addEventListener("pointermove", drag);
        document.addEventListener("pointerup", stopDrag);
    });
})

// current time 
const currTime = new Date().toLocaleTimeString();
const currentHour = new Date().getHours();
const currentMinute = new Date().getMinutes();
const currTimeElement = document.getElementById("currenttime");
currTimeElement.innerText = currTime;

// typing effect
const text = "SYSTEM BIOS v4.01\n\nLoading portfolio.exe...";
const textElement = document.querySelector(".text");
const loading = document.querySelector(".loading");
const main = document.querySelector(".main");

let i = 0;

function typeText() {
    if (i < text.length) {
        textElement.textContent += text[i];
        i++;
        let delay;
        if (text[i] === "\n") {
            delay = 300;
        } else {
            delay = Math.random() * 40 + 25;
        }
        setTimeout(typeText, delay);
    } else {
        setTimeout(() => {
            loading.style.display = "none";
            main.style.display = "block";
        }, 1000);
    }
}

typeText();

// loading photos

const cloudName = "gkqoufxm";

async function loadPhotos() {
    try {
        const response = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/website.json`);
        const data = await response.json();
        const gallery = document.getElementById("photos");        
        data.resources.forEach(resource => {
            const container = document.createElement("div");
            container.classList.add("photo");
            container.innerHTML = `
            <a href="https://res.cloudinary.com/${cloudName}/image/upload/${resource.public_id}.${resource.format}" target="_blank"><img title="${resource.public_id}" src="https://res.cloudinary.com/${cloudName}/image/upload/${resource.public_id}.${resource.format}" alt=""></a><br>
            <p>Poster.png</p>
            `;
            gallery.appendChild(container);
        });

    } catch (error) {
        console.error("Could not load posters: ", error);
    }
}

loadPhotos();

// loading videos

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQNLQ0BUlVXSgbkF00UG38G2ofJWvo1nj7IE0XcfIbdvura-dlibLs3XBNVMLxeQmpIy_zNUSvUIOlo/pub?gid=0&single=true&output=csv";

const container1 = document.getElementById("videos1");
const container2 = document.getElementById("videos2");
function parseCSV(text) {
    let rows = text.split("\n");
    for (let i = 0; i < rows.length; i++) {
        rows[i] = rows[i].split(",").map(r => r.trim());
    }
    // console.log(rows);
    return rows;
}
function getYouTubeID(url) {
    try {
        const parsedURL = new URL(url);
        if (parsedURL.hostname.includes("youtube.com")) {
            return parsedURL.searchParams.get("v");
        }
        if (parsedURL.hostname === "youtu.be") {
            return parsedURL.pathname.substring(1);
        }
    } catch (error) {
        console.error("URL Error");
    }
    return null;
}

async function loadVideos() {
    try {
        const response = await fetch(sheetURL);
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        // console.log(rows);
        const headerRow = rows[0];
        const titleIx = headerRow.indexOf("title");
        const urlIx = headerRow.indexOf("url");
        const tagIx = headerRow.indexOf("tag");

        rows.slice(1).forEach(e => {
            const title = e[titleIx];
            const url = e[urlIx];
            const tag = e[tagIx];
            if (!title || !url || !tag) return;
            const videoID = getYouTubeID(url);
            if (!videoID) return;
            if (tag.toLowerCase() === "oyeomi") {
                createVideoCard(container1, videoID, title);
            }
            if (tag.toLowerCase() === "others") {
                createVideoCard(container2, videoID, title);
            }
        });
    } catch (error) {
        console.error("Error loading videos");
    }
}

function createVideoCard(container, videoID, title) {

    const card = document.createElement("div");
    card.className = "video";
    card.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${videoID}" target="_blank"> 
    <img src="https://img.youtube.com/vi/${videoID}/maxresdefault.jpg" alt="${title}">
    <button>&#9654;</button>
    <p>${title}.mp4</p>
    </a>
    `;

    container.appendChild(card);
}

loadVideos();