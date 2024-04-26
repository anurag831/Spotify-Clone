console.log("lets write javascript");

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
        a = element.href.split("/songs/")[1]
        b = a.split(".")[0];
      songs.push(b);
    }
  }
  return songs;
}

async function main() {
  // Get the list of all the songs
  let songs = await getSongs();
  console.log(songs);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
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

  //Play the songs
  var audio = new Audio(songs[1]);
  // audio.play();

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}

main();
