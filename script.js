// console.log("lets write javascript");
let currentSong = new Audio();

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      a = element.href.split("/songs/")[1];
      b = a.split(".")[0];
      songs.push(b);
    }
  }
  return songs;
}

const playMusic = (track)=>{
  // let audio = new Audio("/songs/" + track + ".mp3");
  currentSong.src = "/songs/" + track + ".mp3"
  currentSong.play();
}

async function main() {
  

  // Get the list of all the songs
  let songs = await getSongs();

  //Show all the songs in the playlist
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

  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML);
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    });
  });

  // Attach an event listener to play, previous and next
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "pause.svg"
    }
    else{
      currentSong.pause();
      play.src = play.svg
    }
  })
}

main();
