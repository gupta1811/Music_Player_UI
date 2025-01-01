let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updatetimer;

const music_list=[
    {
    img :'1.jpg',
    name : 'dont look',
    artist : 'Karan Aujla',
    music : 'Dont Look.mp3'

},
{
    img :'2.jpg',
    name : 'G.O.A.T',
    artist : 'Diljit Dosanjh',
    music : 'G O A T.mp3'

},
{
    img :'3.jpg',
    name : 'ASTARR',
    artist : 'Prem Dhillon',
    music : 'ASTARR.mp3'

},
{
    img :'4.jpg',
    name : 'Brats',
    artist : 'Arjan dhillon',
    music : 'Brats.mp3'

}
];

loadTrack(track_index);

function loadTrack(track_index) {
    clearInterval(updatetimer);
    reset();

    curr_track.src = music_list[track_index].music; // Load new track
    curr_track.load(); // Prepare the track
    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

    updatetimer = setInterval(setUpdate, 1000); // Update seek slider
    curr_track.addEventListener('ended', nextTrack); // Handle automatic track switch
    random_bg_color(); // Update background
}



function random_bg_color(){
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e']
    let a;

    function populate(a){
        for(let i=0;i<6;i++){
            let x= Math.round(Math.random()*14);
            let y = hex[x];
            a+=y;
        }
        return a;
    }
    let color1 = populate('#');
    let color2 = populate('#');
    var angle = 'to right';

    let gradient = 'linear-gradient'(' +angle+','+color1+','+color2+');
    document.body.style.background = gradient;
}

function reset(){
    curr_time.textContent="00:00";
    total_duration.textContent="00:00";
    seek_slider.value = 0;
}

function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}
function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    wave.classList.remove('loader');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack() {
    if (isRandom) {
        let random_index;
        do {
            random_index = Math.floor(Math.random() * music_list.length);
        } while (random_index === track_index); // Ensure a new random track is selected
        track_index = random_index;
    } else if (track_index < music_list.length - 1) {
        track_index += 1; // Move to the next track sequentially
    } else {
        track_index = 0; // Loop back to the first track
    }

    loadTrack(track_index); // Load the new track

    // Ensure the track starts playing immediately
    curr_track.addEventListener('loadeddata', () => {
        curr_track.play(); // Start playback
        isPlaying = true; // Update playing state
        playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>'; // Update play/pause button
        track_art.classList.add('rotate'); // Start rotation animation
        wave.classList.add('loader'); // Show wave animation
    });
}



function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume(){
    curr_track.volume = volume_slider.value / 100;
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}