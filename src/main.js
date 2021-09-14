import APlayer from '../node_modules/aplayer/dist/APlayer.min.js';
import bootstrap from 'bootstrap';
import $ from 'jquery';
import _ from 'lodash';
import '../assets/style.css';

// initialize player
const songlist = require("../songlist.json");
let currPlaylist = [];
let searchResult = [...songlist];
let currPage = 'home';
const currFilter = [];
const navItems = [
    {
        id: "nav-home",
        label: "Home",
        icon: "bi-house-door",
    },
    {
        id: "nav-search",
        label: "Search",
        icon: "bi-search",
    },
    {
        id: "nav-library",
        label: "Library",
        icon: "bi-archive",
    },
    {
        id: "nav-playlist",
        label: "Playlist",
        icon: "bi-collection-play",
    },
];

const ap = new APlayer({
    container: document.getElementById('aplayer'),
    audio: [],
    listMaxHeight: "80vh",
    fixed: true,
});

$("#aplayer").removeClass("aplayer-narrow");

// initialze nav
navItems.forEach(nav => {
    $(`#${nav.id}`).on('click', () => {
        $(`.content-${currPage}`).addClass('content-hide');
        $(`#nav-${currPage}`).removeClass('active');
        $(`#${nav.id}`).addClass('active');
        currPage = nav.id.split('-')[1];
        if (!$(".aplayer-list").hasClass('aplayer-list-hide')) {
            $(".aplayer-list").addClass('aplayer-list-hide');
        }
        onCurrPageChange();
    });
})

function onCurrPageChange() {
    switch(currPage) {
        case 'search': {
            $(`.content-search`).removeClass("content-hide");
            $("#searchResultList").empty();
            searchResult.forEach((song, index) => {
                $("#searchResultList").append(`
                    <li class="list-group-item">
                        <div>
                            <span class="search-list-item-index">${index + 1}.</span>
                            <span class="search-list-item-name">${song.name}</span>
                        </div>
                        <div>
                            <span class="search-list-item-artist">${song.artist}</span>
                            <a class="btn search-list-item-add" href="#" role="button" id="add-${index}">
                                <i class="bi bi-plus-circle"></i>
                            </a>
                        </div>
                    </li>
                `);
                $(`#add-${index}`).on('click', () => {
                    currPlaylist.push(song);
                    ap.list.add(song);
                });
            });
            return;
        }
        default: return;
    }
}

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
    searchResult = [...newSongList];
    if (searchResult.length === 0) {
        $("#noMusicText").removeClass("text-hidden");
    } else {
        $("#noMusicText").addClass("text-hidden");
    }
    onCurrPageChange();
}

function onSelectAll() {
    currFilter.forEach(filter => {
        $(`#${filter}`).removeClass("active");
    });
    currFilter.splice(0, currFilter.length);
    $("#noMusicText").addClass("text-hidden");
    $("#all").addClass("active");
    searchResult = [...songList];
    onCurrPageChange();
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
    $("#tagFilterRow").append(`<button class="btn btn-primary btn-sm ${index > 0 ? 'ms-1' : ''}" type="button" id="${tag}">${tag}</button>`);
    $(`#${tag}`).on('click', () => {
        onSelectFilter(tag);
    })
});

artistFilter.forEach((artist, index) => {
    $("#artistFilterRow").append(`<button class="btn btn-secondary btn-sm ${index > 0 ? 'ms-1' : ''}" type="button" id="${artist}">${artist}</button>`);
    $(`#${artist}`).on("click", () => {
        onSelectFilter(artist);
    });
});

$("#all").on('click', () => {
    onSelectAll();
});