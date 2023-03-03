function secretCode() {
    const pressed = [];
    const secretCode = 'secret';
    const mu = document.getElementById("muse")
    const playBtnElem = document.querySelector('.play');
    window.addEventListener('keyup',(e)=>{
        pressed.push(e.key);
        pressed.splice(-secretCode.length-1, pressed.length - secretCode.length)
        ;
        if(pressed.join('').includes(secretCode)){
            console.log('Get Rick Roll !');
            mu.src ="../music player/rickroll.mp3"
            const newLine = document.querySelector('audio');
            const audioElem = document.querySelector('audio');
            if (audioElem.pause){
                playBtnElem.className = 'pause';
            }
            audioElem.play()
            document.querySelector('header').style = 'background-image:  url(../src/rick.gif)';
        }
    });  
}
