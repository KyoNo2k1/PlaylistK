
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},

    songs: [
    {
        name: "Nicki x ac",
        singer: "Cuc Kim Hoang",
        path: "assets/Music/5.mp3",
        image: "./assets/Picture/5.jpg"
    },
    {
        name: "I can't finish our love song",
        singer: "Bootleg (ft. midnite tempo",
        path: "./assets/Music/1.mp3",
        image: "./assets/Picture/1.jpg"
    },
    {
        name: "Post Malone - Better Now",
        singer: "(80s version by Blanks!)",
        path: "./assets/Music/7.mp3",
        image: "./assets/Picture/7.jpg"
    },
    {
        name: "I didn't realize how empty my bed was until you left (slowed + reverb)",
        singer: "Alex Giger",
        path: "./assets/Music/8.mp3",
        image: "./assets/Picture/8.jpg"
    },
    {
        name: "Sleepy bonfire",
        singer: "exoh",
        path: "./assets/Music/2.mp3",
        image: "./assets/Picture/2.jpg"
    },
    {
        name: "Pure Imagination",
        singer: "Just A Gent",
        path: "./assets/Music/3.mp3",
        image: "./assets/Picture/3.jpg"
    },
    {
        name: "Pure imagination lofi guitar",
        singer: "Josh Lepulu on tik tok",
        path: "./assets/Music/4.mp3",
        image: "./assets/Picture/4.jpg"
    },
    {
        name: "Moonlight Romance",
        singer: "DENKI SAMA",
        path: "./assets/Music/6.mp3",
        image: "./assets/Picture/6.jpg"
    },
    {
        name: "Pure Imagination Lofi Hip Hop",
        singer: "Willy Wonka",
        path: "./assets/Music/9.mp3",
        image: "./assets/Picture/9.jpg"
    },
    {
        name: "World of imagination ",
        singer: "Shiloh",
        path: "./assets/Music/10.mp3",
        image: "./assets/Picture/10.jpg"
    },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
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
    playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        
    // X??? l?? CD quay / d???ng
    // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity
            });
        cdThumbAnimate.pause();

    // X??? l?? ph??ng to / thu nh??? CD
    // Handles CD enlargement / reduction
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
        };

    // X??? l?? khi click play
    // Handle when click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        };

    // Khi song ???????c play
    // When the song is played
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

    // Khi song b??? pause
    // When the song is pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

    // Khi ti???n ????? b??i h??t thay ?????i
    // When the song progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

    // X??? l?? khi tua song
    // Handling when seek
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

    // Khi next song
    // When next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

    // Khi prev song
    // When prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

    // X??? l?? b???t / t???t random song
    // Handling on / off random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom); //tham s??? th??? 2 boolean true th?? add ts1 false remove
        };

    // X??? l?? l???p l???i m???t song
    // Single-parallel repeat processing
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

    // X??? l?? next song khi audio ended
    // Handle next song when audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        };

    // L???ng nghe h??nh vi click v??o playlist
    // Listen to playlist clicks
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // X??? l?? khi click v??o song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

        // X??? l?? khi click v??o song option
        // Handle when clicking on the song option
                if (e.target.closest(".option")) {
        
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (newIndex === this.currentIndex);
            this.currentIndex = newIndex;
            this.loadCurrentSong();
    },
    start: function () {
    // G??n c???u h??nh t??? config v??o ???ng d???ng
    // Assign configuration from config to application
        this.loadConfig();

    // ?????nh ngh??a c??c thu???c t??nh cho object
    // Defines properties for the object
        this.defineProperties();

    // L???ng nghe / x??? l?? c??c s??? ki???n (DOM events)
    // Listening / handling events (DOM events)
        this.handleEvents();

    // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
    // Load the first song information into the UI when running the app
        this.loadCurrentSong();

    // Render playlist
        this.render();

    // Hi???n th??? tr???ng th??i ban ?????u c???a button repeat & random
    // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
};

app.start();
