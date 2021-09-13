import APlayer from '../node_modules/aplayer/dist/APlayer.min.js';
import bootstrap from 'bootstrap';
import $ from 'jquery';
import _ from 'lodash';

const songlist = require("../songlist.json");
let currFilter = 'all';

const ap = new APlayer({
    container: document.getElementById('aplayer'),
    audio: songlist,
});

function onSelectTag(tagName) {
    $(`#${currFilter}`).removeClass("active");
    $(`#${tagName}`).addClass("active");
    $('#listTitle').text(tagName);
    currFilter = tagName;
}

const [tagFilters, artistFilter] = songlist.reduce((acc, curr) => {
    if (curr.tags && curr.tags.length > 0) {
        curr.tags.forEach(tag => {
            if (!acc[0].includes(tag)) {
                acc[0].push(tag);
            }
        });
    }
    if (curr.artist) {
        if (!acc[1].includes(curr.artist)) {
            acc[1].push(curr.artist)
        }
    }
    return acc;
}, [[], []]);

tagFilters.forEach((tag, index) => {
    $("#tagFilterRow").append(`<button class="btn btn-outline-primary btn-sm ${index > 0 ? 'ms-1' : ''}" type="button" id="${tag}">${tag}</button>`);
    $(`#${tag}`).on('click', () => {
        onSelectTag(tag);
        const newSongList = songlist.filter(song => {
            if (!song.tags) return false;
            return song.tags.includes(tag);
        });
        ap.list.clear();
        ap.list.add(newSongList);
    })
});

artistFilter.forEach((artist, index) => {
    $("#artistFilterRow").append(`<button class="btn btn-outline-primary btn-sm ${index > 0 ? 'ms-1' : ''}" type="button" id="${artist}">${artist}</button>`);
    $(`#${artist}`).on("click", () => {
        onSelectTag(artist);
        const newSongList = songlist.filter(song => {
            if (!song.artist) return false;
            return song.artist.toLowerCase() === artist.toLowerCase();
        });
        ap.list.clear();
        ap.list.add(newSongList);
    });
});

$("#all").on('click', () => {
    onSelectTag("all");
    ap.list.clear();
    ap.list.add(songlist);
});