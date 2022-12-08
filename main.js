const heading = document.querySelector("header h2");
const cdThumb = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const getCD = document.querySelector(".cd");
const cdWidth = getCD.offsetWidth;
const playBtn = document.querySelector(".btn-toggle-play");
const player = document.querySelector(".player");
const progress = document.querySelector("#progress");
const nextBtn = document.querySelector(".btn-next");
const prevBtn = document.querySelector(".btn-prev");
const randomBtn = document.querySelector(".btn-random");
const repeatBtn = document.querySelector(".btn-repeat");
const getSong = document.querySelector(".song");
const playList = document.querySelector(".playlist");
const randomIndex = Math.floor(Math.random() * 10);

const PLAYER_STORAGE_KEY = "My_User";
const app = {
  currentIndex: randomIndex,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  //save to localstorage
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app.config));
  },
  songs: [
    {
      id: 0,
      name: "Cưới thôi",
      singer: " Masew x Masiu x B Ray x TAP",
      path: "./assets/songs/cuoithoi.mp3",
      image:
        "https://i.ytimg.com/vi/_8ldAdQd9WU/mqdefault.jpg",
    },
    {
      id: 1,
      name: "Có không giữ mất đừng tìm",
      singer: "Trúc nhân",
      path: "./assets/songs/Co Khong Giu Mat Dung Tim - Truc Nhan.mp3",
      image: "https://i.ytimg.com/vi/kdVeYgGtO3Q/maxresdefault.jpg",
    },
    {
      id: 2,
      name: "I Love You So",
      singer: "The Walters",
      path: "./assets/songs/I Love You So.mp3",
      image: "https://i.ytimg.com/vi/b6_L-rwDYiQ/maxresdefault.jpg",
    },
    {
      id: 3,
      name: "Love Like You",
      singer: "RM",
      path: "./assets/songs/I Love You So.mp3",
      image:
        "https://c-fa.cdn.smule.com/rs-s77/arr/0b/76/12226343-20a0-4fd6-b6b1-e92cbafec7e5_1024.jpg",
    },
    {
      id: 4,
      name: "This December",
      singer: "Ricky Montgomery",
      path: "./assets/songs/This December.mp3",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/66/5d/d4/665dd470-e8c1-d82c-ecd6-ae83e3c9162f/093624883357.jpg/1200x1200bf-60.jpg",
    },
    {
      id: 5,
      name: "Can You Feel My Heart",
      singer: "Bring Me The Horizon",
      path: "./assets/songs/Can You Feel My Heart.mp3",
      image: "https://i1.sndcdn.com/artworks-000057264108-1ojfl4-t500x500.jpg",
    },
    {
      id: 6,
      name: "Heathens x Stranger Things",
      singer: "21 Pilots",
      path: "./assets/songs/Heathens x Stranger Things.mp3",
      image: "https://i.ytimg.com/vi/nd2-q-WL07w/maxresdefault.jpg",
    },
    {
      id: 7,
      name: "Silhouette",
      singer: "KANA-BOON",
      path: "./assets/songs/Silhouette.mp3",
      image: "https://i1.sndcdn.com/artworks-000130128696-g9k99v-t500x500.jpg",
    },
    {
      id: 8,
      name: "Until I Found You",
      singer: "Stephen Sanchez",
      path: "./assets/songs/Until I Found You.mp3",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/64/d2/c5/64d2c511-67f4-ae09-5153-d39c3da413a3/21UMGIM75467.rgb.jpg/1200x1200bf-60.jpg",
    },
    {
      id: 9,
      name: "Halo",
      singer: "Beyoncé",
      path: "./assets/songs/Halo.mp3",
      image:
        "https://m.media-amazon.com/images/M/MV5BYjlhYjY0YzktYjUzYS00OGQyLTg3OGMtYTFmZjgwMzQyMDVkXkEyXkFqcGdeQXVyNjE0ODc0MDc@._V1_.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map(function (song, index) {
      return `
                <div class="song ${
                  index === app.currentIndex ? "active" : ""
                } " data-index = "${index}">
                    
                    <div class="thumb" style="background-image: url('${
                      song.image
                    }')" >
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                   
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
    });

    document.querySelector(".playlist").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    //scroll top
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;

      const newCDWidth = cdWidth - scrollTop;

      if (newCDWidth >= 0) {
        getCD.style.width = newCDWidth + "px";
      } else {
        getCD.style.width = 0 + "px";
      }

      getCD.style.opacity = newCDWidth / cdWidth;
    };
    // pause play
    function pauseAudio() {
      audio.pause();
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    }

    function playAudio() {
      audio.play();
      player.classList.add("playing");
      cdThumbAnimate.play();
    }

    playBtn.addEventListener("click", function () {
      if (document.querySelector(".player.playing")) {
        //pause
        pauseAudio();
      } else {
        //play
        playAudio();
      }
    });

    //check progress
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime * 100) / audio.duration
        );
        progress.value = progressPercent;
      }
    };

    //forward
    progress.onchange = function (event) {
      const seekTime = (audio.duration * event.target.value) / 100;
      audio.currentTime = seekTime;
    };

    //cd rotate
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    //next song
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
        playAudio();
      } else {
        app.nextSong();
        playAudio();
        app.scrollToActiveSong();
      }
    };
    //prev song
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
        playAudio();
      } else {
        app.prevSong();
        playAudio();
        app.scrollToActiveSong();
      }
    };
    //enable random song
    randomBtn.onclick = function (e) {
      app.isRandom = !app.isRandom;
      app.isRepeat = false;
      randomBtn.classList.toggle("active");
      repeatBtn.classList.remove("active");
    };

    //move to next song when ended
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //enable repeat
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active");
      (app.isRandom = false), randomBtn.classList.remove("active");
    };

    //open music when click
    playList.onclick = function (event) {
      var getSong = event.target.closest(".song");
      var getOption = event.target.closest(".option");

      if (getOption) {
        alert("We are developing this feature!");
      } else if (!getSong.classList.contains(".active")) {
        app.currentIndex = Number(getSong.getAttribute("data-index"));
        app.loadCurrentSong();
        app.render();
        playAudio();
      }
    };
  },

  nextSong: function () {
    app.currentIndex++;
    if (app.currentIndex >= app.songs.length) {
      app.currentIndex = 0;
    }

    this.loadCurrentSong();
    this.render();
  },

  prevSong: function () {
    app.currentIndex--;
    if (app.currentIndex < 0) {
      app.currentIndex = app.songs.length - 1;
    }
    this.render();
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(function () {
      document.querySelector(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * app.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;

    this.loadCurrentSong();
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    app.isRandom = app.config.isRandom;
    app.isRepeat = app.config.isRepeat;
  },

  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
