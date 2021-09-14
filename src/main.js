import APlayer from '../node_modules/aplayer/dist/APlayer.min.js';
import bootstrap from 'bootstrap';
import $ from 'jquery';
import _ from 'lodash';

const songlist = require("../songlist.json");
const currFilter = [];

const ap = new APlayer({
    container: document.getElementById('aplayer'),
    audio: songlist,
    listMaxHeight: "80vh",
    fixed: true,
});

$("#aplayer").removeClass("aplayer-narrow");

function onSelectFilter(selectedFilter) {
    if ($("#all").hasClass("active")) {
        $("#all").removeClass("active");
    }
    if ($(`#${selectedFilter}`).hasClass("active")) {
        $(`#${selectedFilter}`).removeClass("active");
        _.remove(currFilter, filter => filter === selectedFilter);
    } else {
        $(`#${selectedFilter}`).addClass("active");
        currFilter.push(selectedFilter);
    }
    $('#listTitle').text(currFilter.length > 1
        ? currFilter.join(" + ") 
        : currFilter[0]);
    onFilterChange();
}

function onFilterChange() {
    if (currFilter.length === 0) {
        onSelectAll();
        return;
    }
    let newSongList = [...songlist];
    currFilter.forEach(filter => {
        newSongList = newSongList.filter(song => {
            return song.artist === filter || song.tags.includes(filter);
        });
    });
    ap.list.clear();
    ap.list.add(newSongList);
}

function onSelectAll() {
    currFilter.forEach(filter => {
        $(`#${filter}`).removeClass("active");
    });
    currFilter.splice(0, currFilter.length);
    $("#all").addClass("active");
    ap.list.clear();
    ap.list.add(songlist);
    $('#listTitle').text("All");
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
        onSelectFilter(tag);
    })
});

artistFilter.forEach((artist, index) => {
    $("#artistFilterRow").append(`<button class="btn btn-outline-secondary btn-sm ${index > 0 ? 'ms-1' : ''}" type="button" id="${artist}">${artist}</button>`);
    $(`#${artist}`).on("click", () => {
        onSelectFilter(artist);
    });
});

$("#all").on('click', () => {
    onSelectAll();
});