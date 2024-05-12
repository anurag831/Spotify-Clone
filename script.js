// console.log("lets write javascript");

let currentSong = new Audio();
let songs;
let currfolder;

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/songs/${folder}`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      // console.log(element);
      a = element.href.split(`/${folder}/`)[1];
      b = a.split(".")[0];
      songs.push(b);
    }
  }

  //Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      ` <li><img src="music.svg" alt="" class="invert">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Anurag</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="play_music.svg" alt="" class="invert">
                            </div>
         </li>`;
  }

  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `songs/${currfolder}/` + track + ".mp3";
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function convertSecondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes} : ${formattedSeconds}`;
}

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").splice(-2)[0];
      // Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response);
      cardcContainer.innerHTML =
        cardcContainer.innerHTML +
        `<div data-folder = "${folder}" class="card">
      <div class="play">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <!-- Green circular background -->
              <circle cx="50" cy="50" r="45" fill="#4CAF50" />
              <!-- Play triangle -->
              <polygon points="35,25 80,50 35,75" fill="#000" />
          </svg>
      </div>
      <div class = "card_img"><img src="/songs/${folder}/cover.jpeg" alt=""></div>
      <h2>${response.title}</h2>
      <p>${response.description}</p>
  </div>`;
    }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // console.log(item.currentTarget.dataset.folder);
      songs = await getSongs(`${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  // Get the list of all the songs
  songs = await getSongs(`ncs`);
  playMusic(songs[0], true);

  // Display all the albums on the page
  displayAlbums();

  // Attach an event listener to play, previous and next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // Listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".songtime"
    ).innerHTML = `${convertSecondsToMinutesAndSeconds(
      currentSong.currentTime
    )} / ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event Listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an evetn listener for previous and next
  previous.addEventListener("click", () => {
    console.log("previous clicked");
    console.log(currentSong);
    let index = songs.indexOf(
      currentSong.src.split("/").slice(-1)[0].split(".")[0]
    );
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an evetn listener for previous and next
  next.addEventListener("click", () => {
    console.log("next clicked");
    let index = songs.indexOf(
      currentSong.src.split("/").slice(-1)[0].split(".")[0]
    );
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add an event listener to volume
  document.querySelector(".range").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });
}

main();
