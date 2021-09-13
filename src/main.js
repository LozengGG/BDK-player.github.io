//import '../node_modules/aplayer/dist/APlayer.min.css';
import APlayer from '../node_modules/aplayer/dist/APlayer.min.js';

const ap = new APlayer({
    container: document.getElementById('aplayer'),
    audio: [{
        name: 'NEXT COLOR PLANET',
        artist: 'Suisei',
        url: 'music/NEXT COLOR PLANET.mp3',
        cover: 'pic/NEXT COLOR PLANET.jpg'
    }]
});