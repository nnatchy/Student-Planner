(() => {
    const audioElem = document.querySelector('audio');
    const playBtnElem = document.querySelector('.play');
    const slider = document.querySelector('input');
    const progressBar = document.querySelector("progress");
    const sliderValue = document.querySelector(".sliderValue");
    audioElem.volume = 0.2
    slider.oninput = (() => {
        progressBar.value = slider.value;
        sliderValue.innerHTML = slider.value;
        audioElem.volume = slider.value / 100;
    });

    
    function onClick() {
        if (audioElem.paused) {
            audioElem.play();
            playBtnElem.className = 'pause';
        } else {
            audioElem.pause();
            playBtnElem.className = 'play';
        }
    
    }

    function run() {
        playBtnElem.addEventListener('click', onClick);
    }
    
    run();
})();