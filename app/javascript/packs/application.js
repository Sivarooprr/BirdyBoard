// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

require("bootstrap")
require("../stylesheets/application")
document.addEventListener("turbolinks:load", function() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="popover"]').popover()
    })
})

global.toastr = require("toastr")
global.moment = require("moment")
require("@fortawesome/fontawesome-free/js/all")

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

$(document).ready(function() {
    $('.time_string').each(function() {
        this.textContent = moment(this.textContent).format('lll');
    });
    // $('.time-string-ago').each(function () {
    //     // console.log(this.innerText);
    //     this.textContent = moment(this.innerText).fromNow();
    // });
});
document.addEventListener("turbolinks:load", function() {
    $('.time_string').each(function() {
        this.textContent = moment(this.textContent).format('lll');
    });
    $('.time-string-ago').each(function () {
        // console.log(this.innerText);
        this.textContent = moment(this.innerText).fromNow();
    });
    $('.time_string_span').each(function() {
        this.textContent = moment(this.innerText).format('lll');
    });
});

// document.addEventListener("turbolinks:before-cache", function() {
//     var tables = $.fn.dataTable.fnTables(true);
//     $(tables).each(function () {
//         $(this).dataTable().fnDestroy();
//     });
// });

require('./utils')