
(function () {
    const MUSIC_FILE = "music/wedding-music.mp3";
    const STORAGE_KEY = "weddingMusicState";

    const audio = new Audio(MUSIC_FILE);
    audio.loop = true;
    audio.preload = "auto";

    let started = false;

    // Restore music state from previous page
    const savedState = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
    );

    if (savedState.playing) {
        audio.currentTime = savedState.time || 0;

        audio.play()
            .then(() => {
                started = true;
            })
            .catch(() => {
                console.log("Waiting for user interaction to resume music.");
            });
    }

    // Save playback position periodically
    audio.addEventListener("timeupdate", () => {
        if (started) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                playing: !audio.paused,
                time: audio.currentTime
            }));
        }
    });

    // Save state before navigating away
    window.addEventListener("pagehide", () => {
        if (started) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                playing: !audio.paused,
                time: audio.currentTime
            }));
        }
    });

    // Start music after the first user interaction
    function startMusic() {
        if (started) return;

        audio.play()
            .then(() => {
                started = true;
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    playing: true,
                    time: audio.currentTime
                }));
            })
            .catch(error => console.log(error));
    }

    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("scroll", startMusic, { once: true });

    // Optional global controls
    window.weddingMusic = {
        play: () => {
            audio.play();
            started = true;
        },
        pause: () => {
            audio.pause();
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                playing: false,
                time: audio.currentTime
            }));
        }
    };
})();
