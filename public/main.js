function get_boardversion_info (d_type, m_version, s_version) {
    get_device_capacity(function () {
        if (linkage_enable == 0) {
            $("#set_device").remove()
        }
        if (m_version != 8) {
            $("#set_sync").remove();
        }
    });
}

var settings_menu = null;
var management_menu = null;
var g_authority = 0;
function get_authority () {
    var cfg = {};
    cfg.type = "get_user_auth";
    var jsonstr = JSON.stringify(cfg);
    $.ajax({
        url: "getauth.php",
        type: "POST",
        data: jsonstr,
        timeout: 5000,
        error: function () {
            get_authority();
        },
        success: function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                var auth = json.body.authority;
                g_authority = auth;
                if (auth == 0)//管理员
                {
                }
                else if (auth == 1)//操作员
                {
                    if (g_cur_style == "blue") {
                        $("#management_menu li:contains('用户管理')").remove();
                    } else if (g_style_time == "old") {
                        $("#menu #system").remove();
                    }
                    else {
                        $("#menu li:contains('用户管理')").remove();
                    }
                }
                else//观察员
                {
                    if (g_style_time == "old") {
                        $("#menu>li:not('#IvsConfig')").remove();
                    }
                    $("#settings").remove();
                    $("a[href=#settings]").parent().remove();
                    $("#support").remove();
                    $("a[href=#support]").parent().remove();
                    if (g_cur_style == "blue") {
                        $("#management").remove();
                        $("a[href=#management]").parent().remove();
                    }
                }
                var ie = checkIeVersion();
                if (!ie.isIE) {
                    $("#set_local").remove();
                }
                $("#menu iframe").each(function () {
                    $(this).height($(this).siblings("ul").height());
                })
            }
        }
    })
}
function get_antuo () {
    var cfg = {};
    cfg.type = "get_device_info";

    var jsonstr = JSON.stringify(cfg);
    $.ajax({
        type: "POST",
        dataType: "text",
        data: jsonstr,
        url: "systemjson.php",
        success: function (ajaxdata) {
            var jsondata = eval("(" + ajaxdata + ")");
            if (jsondata.state == 200) {
                var jd = jsondata.body;
                try {
                    var oem_info = jd.oem_info;
                    var oem = oem_info.split(".")[0];
                    if (oem == "08") {
                        $("#set_storage").remove();
                        $("#preview_picture").remove();
                    } else {
                        $("#business").remove();
                        $("#replay").remove();
                        $("#antuo_storage").remove();
                    }
                } catch (e) {
                    $("#business").remove();
                    $("#replay").remove();
                    $("#antuo_storage").remove();
                }
            }
        }
    })
}
function get_sd_info (callback) {
    var cfg = {};
    cfg.type = "sas_get_sd_stat";
    cfg.module = "SAS_CACHE_REQUEST";
    post(cfg, function (jsondata) {
        var json = jsondata.body;
        var state = json.state;
        if (state != 0) {
            $("#preview_picture").hide();
            $("#business").show();
            $("#query_data").prepend($("#business"));
        } else {
            $("#preview_picture").show();
            $("#business").hide();
            $("#query_data").prepend($("#preview_picture"));
        }
        if (callback) {
            callback();
        }
    })
}
function device_support () {
    if (g_d_type == 3 && g_m_version == 9) {
        //CPRO
        get_antuo();
    } else {
        //RX
        $("#set_storage").remove();
    }
}
function version_setup () {
    get_device_type();
    device_support();
    get_device_support_onvif();
    get_authority();
    init_title();
    get_etc_support(function () {
        get_board('main_title');
    });
    settings_menu = new sidebar_menu("#menu");
    if (g_cur_style == "blue") {
        management_menu = new sidebar_menu("#management_menu");
    }
}

function logout () {
    var str = "";
    var href = location.href;
    if (href.match(/userdata=pdns/)) {
        str = "?userdata=pdns";
    }
    $.get("logout.php", function (ajaxdata) {
        top.location.href = "login.htm" + str;
    });
}
function fit_window_size () {
    var content_boundary = get_boundary("#content", true);
    var height_all = document.documentElement.clientHeight - 63;
    var width_all = document.documentElement.clientWidth - content_boundary.w;
    $("#content").height(height_all).width(width_all);
    $("#bluebar").width(width_all + 80);
}
function init_window_size () {
    fit_window_size();
    $(window).on("resize", fit_window_size);
}
//增加自定义菜单
function userchargeenable () {
    $.ajax({
        url: get_main_path() + "vb.htm?userchargeenable",
        success: function (ajaxdata) {
            if ("OK" != ajaxdata.slice(0, 2)) return false;
            var slicestring = ajaxdata.substring(ajaxdata.indexOf("=") + 1);
            slicestring = slicestring.split(":");
            var menuname = Utf8.decode(Base64.decode(slicestring[1]));
            if (slicestring[0] == 0 || menuname == "error_name") {
                return;
            }
            var str = "<li><a href=\"javascript:void(0);\" onclick=\"onLinkClick('htmldata/user_html/web_root/index.html?index')\">" + menuname.substring(0, 8) + "</a></li>";
            $("#basicconfig").after(str);
            $("a").focus(function () { $(this).blur(); });
        }
    });
}
function init_main (callback) {
    $(function () {
        get_boardversion_info(g_d_type, g_m_version, g_s_version);
        init_window_size();
        //退出登录
        version_setup();
        userchargeenable();
        //--去除虚线框--
        $("a").focus(function () { $(this).blur(); });
        $("#logout").click(logout);
        $(".nav_left > li > a").click(function () {
            $(".nav_left > li > .active").removeClass("active");
            $(this).addClass("active");
        });
        $(".nav-sidebar > li > a").live("click", function () {
            $(".nav-sidebar > li > .active").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("id");
            if (id == "advance_a") {
                $(".sidebar_left").show();
                $(".sidebar_left ul").hide();
                $("#advance").show();
                $("#content").removeClass("content_no_sidebar");
                $("#advance li").eq(0).find("a").click();
                ////////////////////cmy
                if (is_C3) {  //c3
                    $("#set_recog").hide(); //c3二次识别隐藏
                }
                //////////////////////////
            } else if (id == "maintain_a") {
                $(".sidebar_left").show();
                $(".sidebar_left ul").hide();
                $("#maintain").show();
                $("#content").removeClass("content_no_sidebar");
                $("#maintain li").eq(0).find("a").click();
            } else if (id == "data_a") {
                $(".sidebar_left").show();
                $(".sidebar_left ul").hide();
                $("#content").removeClass("content_no_sidebar");
                if (g_d_type == 3 && g_m_version == 9) {
                    //CPRO
                    $("#query_data").show();
                    $("#query_data li").eq(0).find("a").click();
                } else {
                    //RX
                    // get_sd_info(function () {
                    $("#query_data").show();
                    $("#query_data li").eq(0).find("a").click();
                    // });
                }
                if (is_C3A) {
                    $("#replay").hide();
                }
            } else {
                $(".sidebar_left").hide();
                $("#advance").hide();
                $("#maintain").hide();
                $("#content").addClass("content_no_sidebar");
            }
        });
        var page = location.href.split("?")[1];
        if (page && page != "userdata=pdns") {
            //配置工具通过?访问，删除菜单栏
            is_config_tool = true;
            $(".navbar").remove();
            $(".navbar_iframe").remove();
            $("#pagebody").css("margin-top", "0px");
            onLinkClick("htmldata/" + page + ".htm");
        } else {
            onLinkClick("htmldata/IvsConfig.htm");
        }
    });
    if (callback != undefined) callback();
}
