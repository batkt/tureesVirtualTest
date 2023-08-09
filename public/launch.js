//do not change this js file, or you need to clear the cache of your browser
function get_cur_page() {
    var cur_page = window.location.href.split('?')[0];
    cur_page = cur_page.split('/');
    cur_page = cur_page[cur_page.length - 1];
    if (cur_page == "") cur_page = "login.htm";
    return cur_page;
}

function get_main_path() {
    var cur_page = get_cur_page();
    var page = window.location.href;
    if (page.indexOf("user_html") != -1) {
        return "../../../";
    }
    if (page.indexOf("mobile") != -1) {
        return "../../";
    }
    if (cur_page == "main.htm" || cur_page == "login.htm") {
        //in html dir
        return "";
    }
    else {
        //in htmldata dir
        return "../";
    }
}
function init(callback) {
    var main_path = get_main_path();
    $LAB.script(main_path + "js/init.js?version=" + version.web).wait(function () {
        init_impl(callback);
    });
}
var version = {
    web: "22.12.7.1",
    active: "1.6.1.3"
};
