var close_json = {};
var g_cur_channel = 0;
var car_color_arr = ["unknown", "blue", "yellow", "white", "black", "green", "olivine"];
var car_type_arr = ["unknown_license", "blue_car", "black_car", "single_row_yellow", "double_row_yellow", "patrol_wagon", "wj_license", "non_standard_license", "single_military_vehicle", "double_military_vehicle", "diplomatic_mission_license", "Hong_Kong_license", "agricultural_vehicle", "coach_license", "Macao_license", "double_wj_license", "PAP_Corps_license", "double_PAP_Corps_license", "civil_aviation", "new_energy", "large_scale_new_energy", "emergency", "consulate", "new_small_car", "new_small_energy", "airport", "", "", "", "", "", "unlicensed_cars"];
var g_lamp_io_out = -1;
var g_lamp_io_in = -1;
var g_gp_io = -1;
var vzio_check = [false, false, false, false, false, false];
function isNotUndefinedOrNull(value) {
    return (value != undefined && value != null);
}
function dg_json_ajax(req, callback) {
    $.ajax({
        type: "POST",
        url: "dgjson.php",
        data: JSON.stringify(req),
        success: function (data) {
            if (precheck(data)) return false;
            callback(data);
        },
        dataType: "text"
    });
}
Date.prototype.format = function (format) //author: meizz
{
    var o = {
        "M+": this.getMonth() + 1, //month
        "D+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(Y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
function get_ivs_i2s(val1, val2) {
    var result = parseInt((val1 << 14) / val2);
    return result;
}

function get_ivs_s2i(val1, val2) {
    var result = parseInt((val1 * val2 + (1 << 13)) >> 14);
    return result;
}
//启用 禁用的颜色改变
function ele_change(enable, ele) {
    if (enable == 1) {
        $("." + ele).removeClass("disabled_color");
        $("." + ele + " *:not('select,option')").removeAttr("disabled");
        $("." + ele + " select").selectmenu("enable");
        if (ele == "led_time_tr") {
            $(".jslider-pointer").show();
        }
    } else {
        $("." + ele).addClass("disabled_color");
        $("." + ele + " *:not('select,option')").attr("disabled", "disabled");
        $("." + ele + " select").selectmenu("disable");
        if (ele == "led_time_tr") {
            $(".jslider-pointer").hide();
        }
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//IvsConfig
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var IvsConfig = new function () {
    var car_body_color = ["av_color_white", "av_color_silver", "av_color_yellow", "av_color_pink", "av_color_red", "av_color_green", "av_color_blue", "av_color_brown", "av_color_black", "av_color_gray", "av_color_unknown"]
    var color_arr = ["#fff", "#fbffc3", "#ebff00", "#ffba00", "#ff9000", "#ff7900", "#dc5902", "#dc3002"];
    var text_str = "藏川鄂甘赣贵桂黑沪吉冀津晋京辽鲁蒙闽宁青琼陕苏皖湘新渝豫粤云浙学警领使港澳0123456789ABCDEFGHJKLMNPQRSTUVWXYZ武民航0123456789X应急挂机场电";
    var car_logo = [
        'av_car_manu_byd',
        'av_car_manu_yiqi',
        'av_car_manu_mini',
        'av_car_manu_roewe',
        'av_car_manu_jeep',
        'av_car_manu_toyota',
        'av_car_manu_suzuki',
        'av_car_manu_changan',
        'av_car_manu_citroen',
        'av_car_manu_chevrolet',
        'av_car_manu_greatwall',
        'av_car_manu_cadillac',
        'av_car_manu_honda',
        'av_car_manu_wuling',
        'av_car_manu_lexus',
        'av_car_manu_ford',
        'av_car_manu_dongfeng',
        'av_car_manu_volvo',
        'av_car_manu_volkswagen',
        'av_car_manu_futian',
        'av_car_manu_beiqi',
        'av_car_manu_geely',
        'av_car_manu_chery',
        'av_car_manu_zhonghua',
        'av_car_manu_skoda',
        'av_car_manu_subaru',
        'av_car_manu_guangqi',
        'av_car_manu_mitsubishi',
        'av_car_manu_haima',
        'av_car_manu_hyundai',
        'av_car_manu_mingjue',
        '',
        'av_car_manu_benz',
        'av_car_manu_baojun',
        'av_car_manu_land_rover',
        'av_car_manu_buick',
        'av_car_manu_haval',
        'av_car_manu_kia',
        'av_car_manu_nissan',
        'av_car_manu_jiangling',
        'av_car_manu_mazda',
        'av_car_manu_jianghuai',
        'av_car_manu_audi',
        'av_car_manu_dongnan',
        'av_car_manu_peugeot',
        'av_car_manu_jinbei',
        'av_car_manu_bmw',
        'av_car_manu_porsche',
        'av_car_manu_windgallop',
        'av_car_manu_shuanghuan',
        'av_car_manu_zxauto',
        'av_car_manu_fial',
        'av_car_manu_dayun',
        'av_car_manu_hawtai',
        '',
        'av_car_manu_leopaard',
        '',
        '',
        '',
        'av_car_manu_kama',
        'av_car_manu_zhongshun',
        'av_car_manu_bentley',
        'av_car_manu_changhe',
        'av_car_manu_chrysler',
        'av_car_manu_maxus',
        'av_car_manu_luxgen',
        'av_car_manu_maple',
        '',
        '',
        'av_car_manu_sanyheavyindustry',
        'av_car_manu_dodge',
        'av_car_manu_acura',
        'av_car_manu_karry',
        'av_car_manu_zotye',
        '',
        'av_car_manu_renault',
        '',
        'av_car_manu_shanxiauto',
        'av_car_manu_cnhtc',
        'av_car_manu_ankai',
        'av_car_manu_opel',
        'av_car_manu_jaguar',
        'av_car_manu_landwind',
        'av_car_manu_isuzu',
        'av_car_manu_huanghai',
        'av_car_manu_iveco',
        '',
        'av_car_manu_hualing',
        'av_car_manu_tjolauto',
        'av_car_manu_zhongtong',
        '',
        'av_car_manu_kinglong',
        'av_car_manu_lotuscars',
        'av_car_manu_venucia',
        'av_car_manu_hengtong',
        'av_car_manu_everus',
        'av_car_manu_beiben',
        '',
        '',
        'av_car_manu_yuejin',
        'av_car_manu_lifan',
        '',
        '',
        'av_car_manu_feidie',
        '',
        'av_car_manu_hafei',
        'av_car_manu_goldendragon',
        'av_car_manu_yutong',
        'av_car_manu_infiniti',
        'av_car_manu_lincoln',
        'av_car_manu_DS',
        '',
        'av_car_manu_Maserati',
        'av_car_manu_tesla',
        'av_car_manu_LK',
        'av_car_manu_Lamborghini',
        'av_car_manu_Rolls_Royce',
        'av_car_manu_foday',
        'av_car_manu_YM',
        'av_car_manu_WEY',
        'av_car_manu_FQQT',
        'av_car_manu_HQ',
        'av_car_manu_GZ',
        'av_car_manu_JL',
        'av_car_manu_QQY',
        'av_car_manu_KY',
        'av_car_manu_HG',
        'av_car_manu_HT',
        'av_car_manu_HM',
        'av_car_manu_CGQC',
        'av_car_manu_JT',
        'av_car_manu_BSQC',
        'av_car_manu_HTQC',
        'av_car_manu_HZQC',
        'av_car_manu_JMQC',
        'av_car_manu_DCQC',
        'av_car_manu_XPQC',
        'av_car_manu_BW',
        'av_car_manu_WMQC',
        'av_car_manu_LXQC',
        'av_car_manu_WL',
        'av_car_manu_LPQC',
        'av_car_manu_Ferrari',
        'av_car_manu_Forland',
        'av_car_manu_HCXY',
        'av_car_manu_FJQC',
        'av_car_manu_XTQC',
        'av_car_manu_Exeed',
        'av_car_manu_smart',
        'av_car_manu_RC',
        'av_car_manu_HY'
    ];

    function test_ip(ip) {
        var addr = ip.split('.');
        if (addr.length != 4) return false;
        for (var i = 0; i < 4; i++) {
            if (addr[i].length > 3) return false;
            var val = parseInt(addr[i]);
            if (isNaN(val) || val < 0 || val > 255) return false;
        }
        return true;
    }
    var userdefinedcfg = "";

    function set_hint() {
        var pos = $("#plate_pos").check_val() ? "1" : "0";
        var data = $("#auto_focus").check_val() ? "1" : "0";
        if (userdefinedcfg == "") {
            userdefinedcfg = "0010";
        }
        var str2 = userdefinedcfg.substring(0, 1);
        var str = pos + str2 + data + '0';
        $.get("vb.htm?userdefinedcfg=" + str, function (ajaxdata) {
            default_ajax_handler(ajaxdata);
        });
    }
    //变倍自动聚焦
    function get_auto_focus_status() {
        $.get("vb.htm?paratest=userdefinedcfg", function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
            if ("OK" != ajaxdata.slice(0, 2)) return false;
            var status = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
            userdefinedcfg = status;
            if (status == "") {
                $.get("vb.htm?userdefinedcfg=0010", function (ajaxdata) {
                    get_auto_focus_status();
                });
                return false;
            }
            var s_arr = status.split("");
            $("#auto_focus").check_val(s_arr[2] == 1);
            var hint = 0;
            if (s_arr.length == 4) {
                hint = s_arr[3];
            }
            $("#hint_enable").check_val(hint == 1);
            $("#plate_pos").check_val(s_arr[0] == 1);
            if (s_arr[0] == 1) {
                $("#best_size").show();
            }
        })
    }

    function set_auto_focus_status() {
        var data = $("#auto_focus").check_val() ? "1" : "0";
        $.get("vb.htm?userdefinedcfg3=" + data, function (ajaxdata) {
            default_ajax_handler(ajaxdata);
        })
    }

    function autofocusatfterzoom() {
        $.get("vb.htm?autofocusatfterzoom", function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
        });
    }

    var focal_down = false;
    function btn_mousedown() {
        focal_down = true;
        var value = $(this).attr("focalValue");
        $.get("vb.htm?focusandzoom=" + value, function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
        });
    }
    function btn_mouseup() {
        if (!focal_down) {
            return;
        }
        focal_down = false;
        var value = $(this).attr("focalValue");
        var status = $("#auto_focus").check_val();
        $.get("vb.htm?focusandzoom=0", function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
            if ((value == 3 || value == 4) && status) {
                autofocusatfterzoom();
            }
        });
    }
    function init_slider(name, min, max, step, callback) {
        var mid = 50;
        var min_val = 0;
        var max_val = 0;
        if (!min) {
            min_val = 0;
        } else {
            min_val = min;
        }
        if (!max) {
            max_val = 100;
        } else {
            max_val = max;
        }
        var slider_name = "#" + name + "_slider";
        var text_name = "#" + name + "_text";
        $(slider_name).slider({
            range: "min",
            value: mid,
            min: min_val,
            max: max_val,
            step: step,
            change: function (event, ui) {
                $(text_name).html(ui.value + 'X');
            },
            slide: function (event, ui) {
                $(text_name).html(ui.value + 'X');
                if (callback) {
                    return callback();
                }
            }
        });
        $(text_name).html($(slider_name).slider("value"));
    }
    function set_slider_val(name, val) {
        $("#" + name + "_slider").slider('value', val);
    }
    var g_digital_zoom = 1
    function get_digital_zoom() {
        var cfg = {}
        cfg.type = "get_avs_focus_prm";
        cfg.module = "AVS_REQUEST_MESSAGE";
        post(cfg, function (res) {
            var body = res.body
            g_digital_zoom = body.digital_zoom
            // set_slider_val('digital', g_digital_zoom)
        })
    }
    function digital_zoom() {
        // var g_digital_zoom = parseFloat($("#digital_text").html().split('X')[0])
        var cfg = {}
        cfg.type = "set_avs_focus_prm";
        cfg.module = "AVS_REQUEST_MESSAGE";
        cfg.body = {}
        cfg.body.auto_focus = 0
        cfg.body.digital_ptz_enable = false
        cfg.body.digital_zoom = g_digital_zoom
        cfg.body.focus_step = 0
        cfg.body.focus_type = 0
        cfg.body.digital_ptz_window_size = {}
        cfg.body.digital_ptz_window_size.height = 0
        cfg.body.digital_ptz_window_size.width = 0
        cfg.body.digital_ptz_window_size.x = 0
        cfg.body.digital_ptz_window_size.y = 0
        post(cfg, function (res) { })
    }
    function set_ptz(dir, degree) {
        var cfg = {}
        cfg.type = "set_cloud_ctrl";
        cfg.module = "BUS_REQUEST_MESSAGE";
        cfg.body = {}
        cfg.body.dir = dir
        cfg.body.degree = degree
        post_async(cfg, function () { })
    }
    var ptz_down = false;
    function ptz_mousedown() {
        ptz_down = true;
        var value = parseInt($(this).attr("ptz_type"));
        set_ptz(value, 2)
    }
    function ptz_mouseup() {
        if (!ptz_down) {
            return;
        }
        ptz_down = false;
        var value = parseInt($(this).attr("ptz_type"));
        var dir = 128;
        if (value == 2 || value == 4) {
            dir = 8
        } else if (value == 16 || value == 32) {
            dir = 64
        }
        set_ptz(dir, 0)
    }

    function fast_focus() {
        $.get("vb.htm?autofocus", function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
        });
    }

    function get_led_ctrl_prop() {
        var json = {};
        json.type = "AVS_GET_LED_PROP";

        var jsonstr = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body.led_level;
                var levels = jsondata.types;
                new_get_led_cfg(levels);
            }
        });
    }

    function new_get_led_cfg(levels) {
        var json = {};
        json.type = "AVS_GET_LED_CTRL";

        var jsonstr = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body;
                var mode = jsondata.led_mode;
                var option = "";
                for (var i = 0; i < levels.length; i++) {
                    option += "<option value='" + levels[i].type + "'>" + Base64.decode(levels[i].content, true) + "</optioon>";
                }
                if (jsondata.time_ctrl) {
                    var arr = jsondata.time_ctrl;
                    var level1 = arr[0].led_level;
                    var level2 = arr[1].led_level;
                    var level3 = arr[2].led_level;
                    // if (!arr[0].timectrl_enable) {
                    //     level1 = -1;
                    // }
                    // if (!arr[1].timectrl_enable) {
                    //     level2 = -1;
                    // }
                    // if (!arr[2].timectrl_enable) {
                    //     level3 = -1;
                    // }
                    var st = arr[1].time_begin;
                    var et = arr[1].time_end;
                    var sts = st.split(":");
                    var ets = et.split(":");
                    var val1 = parseInt(sts[0], 10) * 60 + parseInt(sts[1], 10);
                    var val2 = parseInt(ets[0], 10) * 60 + parseInt(ets[1], 10);
                    $("#led_time").jslider("value", val1, val2);
                    if (val1 == val2) {
                        if (val1 == 1440) {
                            $(".jslider-pointer").css("z-index", "2");
                            $(".jslider-pointer-to").css("z-index", "0");
                        } else if (val1 == 0) {
                            $(".jslider-pointer").css("z-index", "0");
                            $(".jslider-pointer-to").css("z-index", "2");
                        }
                    }
                }
                $("#light_sel").select_val(mode);
                $(".jslider-bg").height(26);
                $(".jslider-bg i").css({
                    "font-style": "normal",
                    "font-size": "12px",
                    "overflow": "hidden",
                    "background": "none"
                }).height(26);
                $(".jslider-bg").append("<span class='s_l_p sp'><select class='s_l'></select></span>");
                $(".jslider-bg").append("<span class='s_v_p sp'><select class='s_v'></select></span>");
                $(".jslider-bg").append("<span class='s_r_p sp'><select class='s_r'></select></span>");
                $(".jslider-bg select").append(option);
                init_selectmenu(".jslider-bg select", 50, 150, function (e, object) {
                    $(e.target).siblings("span").css("background", color_arr[parseInt(object.value) + 1]);
                    new_set_led_cfg();
                });
                $(".jslider-bg select").selectmenu({
                    position: { my: "left top-150", at: "left top", collision: "flipfit" }
                });
                $(".s_l").select_val(level1);
                $(".s_v").select_val(level2);
                $(".s_r").select_val(level3);
                $(".s_l").siblings("span").css("background", color_arr[level1 + 1]);
                $(".s_v").siblings("span").css("background", color_arr[level2 + 1]);
                $(".s_r").siblings("span").css("background", color_arr[level3 + 1]);
                $(".jslider-bg .sp > span").css({
                    "postion": "absolute",
                    "top": "0",
                    "left": "0",
                    "border-radius": "0px"
                });
                $(".jslider-bg .s_r_p span").css({
                    "right": "0"
                });
                led_time_show();
                if (mode == 3) {
                    ele_change(1, "led_time_tr");
                } else {
                    ele_change(0, "led_time_tr");
                }
                init_select_width($("#led_time").jslider("prc"));
            }
        });
    }

    function get_time(value) {
        var hours = Math.floor(value / 60);
        var mins = (value - hours * 60);
        return (hours < 10 ? "0" + hours : hours) + ":" + (mins == 0 ? "00" : mins) + ":00";
    }

    function new_set_led_cfg() {
        var cfg = {};
        cfg.type = "AVS_SET_LED_CTRL";
        cfg.body = {};
        var mode = parseInt($("#light_sel").select_val());
        if (mode) {
            var val = $("#led_time").val();
            var time = val.split(";");
            var time1 = get_time(time[0]);
            var time2 = get_time(time[1]);
            var s_l = parseInt($(".s_l").select_val());
            var s_v = parseInt($(".s_v").select_val());
            var s_r = parseInt($(".s_r").select_val());
            var arr = [];
            for (var i = 0; i < 3; i++) {
                var json = {};
                if (i == 0) {
                    json.time_begin = "00:00:00";
                    json.time_end = time1;
                    if (s_l != -1) {
                        json.timectrl_enable = true;
                    } else {
                        json.timectrl_enable = false;
                    }
                    json.led_level = s_l;
                } else if (i == 1) {
                    json.time_begin = time1;
                    json.time_end = time2;
                    json.timectrl_enable = true;
                    if (s_v != -1) {
                        json.timectrl_enable = true;
                    } else {
                        json.timectrl_enable = false;
                    }
                    json.led_level = s_v;
                } else {
                    json.time_begin = time2;
                    json.time_end = "24:00:00";
                    json.timectrl_enable = true;
                    if (s_r != -1) {
                        json.timectrl_enable = true;
                    } else {
                        json.timectrl_enable = false;
                    }
                    json.led_level = s_r;
                }
                json.id = i;
                arr.push(json);
            }
            cfg.body.time_ctrl = arr;
        }
        cfg.body.led_mode = mode;
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    show_informer();
                }
            }
        });

    }

    var res_resolution = null;
    function new_get_video_support() {
        var cfg = {};
        cfg.type = "AVS_GET_ALG_RESULT_PROP";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body;
                res_resolution = jsondata.snap_resolution.types;
                get_size_and_res();
            }
        });
    }
    var img_size_width = 1920;
    function set_img_size_ax(snap_resolution) {
        for (var i = 0; i < res_resolution.length; i++) {
            if (res_resolution[i].type == snap_resolution) {
                var size = Base64.decode(res_resolution[i].content, true)
                img_size_width = parseInt(size.split("*")[0]);
                // var ax = GetAX("ax");
                // if (!ax) return;
                // var req = {};
                // req.img_width = img_size_width;
                // var encoded = $.toJSON(req);
                // ax.QueryCmd("PlateSetImgSize", encoded, "1", function (response_data) {

                // });
            }
        }
    }
    function get_size_and_res() {
        var cfg = {};
        cfg.type = "AVS_GET_ALG_RESULT_PARAM";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body;
                var snap_resolution = jsondata.snap_resolution;
                set_img_size_ax(snap_resolution);
            }
        });
    }
    function set_province() {
        var province = parseInt($("#preinstall_province").select_val())
        var cfg = {}
        cfg.type = "set_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.param = {}
        cfg.body.param.vehicle_inoutlet_event = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.province = province
        post(cfg, function () {
            get_province()
            show_informer()
        })
    }
    function get_province() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var province = res.body.param.vehicle_inoutlet_event.attr_rec_prm.province

            $("#preinstall_province").select_val(province)
        })
    }
    function new_attr_rec_prm() {
        var cfg = {}
        cfg.type = "get_alg_prop"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.alg_prop_type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var province = res.body.prop.vehicle_inoutlet_event.attr_rec_prm.province.types;
            var arr = [];
            for (var i = 0; i < province.length; i++) {
                arr[i] = Base64.decode(province[i].content, true) + "-" + province[i].type;
            }
            arr.sort(function (strA, strB) {
                return strA.localeCompare(strB);
            });
            var strz = "";
            var option_str = "<option value='-1'>无</option>";
            for (var i = 0; i < arr.length; i++) {
                if (i == 0) {
                    strz += "<option value='" + arr[i].split("-")[1] + "'>" + arr[i].split("-")[0] + "</option>";
                } else {
                    option_str += "<option value='" + arr[i].split("-")[1] + "'>" + arr[i].split("-")[0] + "</option>";
                }
            }
            option_str += strz;
            $("#preinstall_province").html(option_str);
            init_selectmenu("#preinstall_province", 115, 195, function () {
                set_province()
            });
            get_province()
        })
    }
    function get_boardversion_info(type, m_version, s_version) {
        get_device_capacity(function () {
            if (m_version == 8) {
                $(".overseas_remove_module").remove();
            } else {
                new_attr_rec_prm();
            }
            if (moto_num == 0) {
                $(".observer").remove();
                $("#focus_span").remove();
                if (!is_C3A) {
                    get_digital_zoom()
                    init_slider('digital', 1, 2, 0.1, function () {
                        digital_zoom()
                    })
                }
            }
            var v = "0X" + g_boardversion.toString(16).toUpperCase();
            if (v != '0X305A' && v != '0X4003' && !is_R5_ptz) {
                $(".avs_zoom").remove();
            }
            if (is_C3) {
                $(".car_color").remove();
                $(".ptz_tr").remove();
            }
            if (is_C3A) {
                $(".ptz_tr").remove();
                $(".avs_zoom").remove();
                $(".car_color").remove();
            }
            if (is_R5) {
                $(".ptz_tr").remove();
            }
        });
    }
    var old_group_data = null;

    function get_device_group() {
        var req = {};
        req.type = "get_group_cfg";

        $.ajax({
            type: "POST",
            url: "dgjson.php",
            data: JSON.stringify(req),
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json_data;
                try {
                    json_data = eval("(" + ajaxdata + ")");
                } catch (e) {
                    return false;
                }
                if (!json_data.vzid || !json_data.group_cfg) {
                    return false;
                }
                old_group_data = json_data;
                $("#alleyway").select_val(json_data["vzid"].type);
            },
            dataType: "text"
        });
    }

    function set_device_group() {
        var alleyway = $("#alleyway").select_val();
        var req = old_group_data;
        req.type = "set_group_cfg";
        req.vzid.type = alleyway;

        $.ajax({
            type: "POST",
            url: "dgjson.php",
            data: JSON.stringify(req),
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    show_informer();
                }
            },
            dataType: "text"
        });
    }

    function get_max_size() {
        var windowW = $(window).width();
        var windowH = $(window).height();
        var imgWidth, imgHeight;

        var w, h;
        var realWidth = windowW;
        var realHeight = realWidth * 9 / 16;
        if (realHeight > windowH) {
            realWidth = windowH * 16 / 9;
            realHeight = windowH;
        }

        if (realWidth > windowW) {
            realWidth = windowW;
            w = 0;
        } else {
            w = (windowW - realWidth) / 2;
        }
        if (realHeight > windowH) {
            realHeight = windowH;
            h = 0;
        } else {
            h = (windowH - realHeight) / 2;
        }
        return {
            "rw": realWidth,
            "rh": realHeight,
            "w": w,
            "h": h
        };
    }

    function showbigimg(outerdiv, innerdiv, bigimg, _this) {
        var src = _this.attr("src");
        $("#bigimg").attr("src", src);

        var json = get_max_size();
        var realWidth = json.rw;
        var realHeight = json.rh;
        var w = json.w;
        var h = json.h;

        $(bigimg).css("width", realWidth);
        $(bigimg).css("height", realHeight);

        $(innerdiv).css({
            "top": h,
            "left": w
        });
        $(outerdiv).show();
        $("#innerdiv").show();

        $(outerdiv).dblclick(function () {
            $(outerdiv).hide();
            $("#innerdiv").hide();
            $("#name_innerdiv").hide();
            $("#ip_innerdiv").hide();
        });
    }

    function led_time_show() {
        $("#led_time_tr").show();
        $(".jslider").show();
    }

    function led_time_hide() {
        $("#led_time_tr").hide();
        $(".jslider").hide();
    }

    //video
    var radius = 3;
    //清除canvas
    function clearCanvas() {
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        var width = $("#myCanvas").attr("width");
        var height = $("#myCanvas").attr("height");
        ctx.clearRect(0, 0, width, height);
    }
    function drawArrow(fromX, fromY, toX, toY, theta, headlen, width) {
        // 计算各角度和对应的P2,P3坐标
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        var str = "ctx.beginPath();";

        var arrowX = toX + topX,
            arrowY = toY + topY;
        str += "ctx.moveTo(" + arrowX + ", " + arrowY + ");";
        str += "ctx.lineTo(" + toX + ", " + toY + ");";
        arrowX = toX + botX;
        arrowY = toY + botY;
        str += "ctx.lineTo(" + arrowX + ", " + arrowY + ");";
        str += "ctx.lineWidth = " + width + ";";
        str += "ctx.stroke();ctx.restore();";
        return str;
    }
    function get_center_coord(x, y) {
        var xUP = (x[0] + x[1]) >> 1;
        var yUP = (y[0] + y[1]) >> 1;
        var xDN = (x[2] + x[3]) >> 1;
        var yDN = (y[2] + y[3]) >> 1;
        if (yUP > yDN) {
            var temp = xUP;
            xUP = xDN;
            xDN = temp;
            temp = yUP;
            yUP = yDN;
            yDN = temp;
        }
        if (g_direction == 1) {
            return get_coord_arr({ x: xUP, y: yUP }, { x: xDN, y: yDN });
        } else {
            return get_coord_arr({ x: xDN, y: yDN }, { x: xUP, y: yUP });
        }

    }
    function get_middle_coord(p1, p2) {
        var json = {};
        json.x = (p1.x + p2.x) / 2;
        json.y = (p1.y + p2.y) / 2;
        return json;
    }
    function get_coord_arr(p1, p5) {
        var p3 = get_middle_coord(p1, p5);
        var p2 = get_middle_coord(p1, p3);
        var p4 = get_middle_coord(p3, p5);
        var arr = [];
        arr.push(p1, p2, p3, p4, p5);
        return arr;
    }
    //绘制
    function draw_area() {
        clearCanvas();
        if (!g_coil_data || !g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
        }
        if (g_coil_data['body']['virtualloop']['virtualloop_num'] == 0) {
            g_coil_data.body.virtualloop.loop = []
            var loop = {}
            loop.enable = false
            loop.point = []
            g_coil_data.body.virtualloop.loop.push(loop)
            g_coil_data['body']['virtualloop']['virtualloop_num'] == 1
        }
        //绘制线圈
        var coil_point = g_coil_data.body.virtualloop.loop[0].point;
        var coil_enable = g_coil_data.body.virtualloop.loop[0].enable;
        var virtualloop_num = g_coil_data.body.virtualloop.virtualloop_num;
        var str = "";
        str += "var c = document.getElementById('myCanvas');var ctx = c.getContext('2d');ctx.lineWidth='1';";
        str += "ctx.strokeStyle = '#02ea2d';"
        str += "ctx.fillStyle = 'rgba(255,0,0,0.1)';";
        str += "ctx.font = 'bold 12px Arial';";
        if (coil_point.length > 0 && coil_enable && virtualloop_num > 0) {
            str += "ctx.beginPath();";
            for (var i = 0; i < coil_point.length; i++) {
                $("#canvas_container .coil[index='" + i + "']").css({
                    "left": coil_point[i].x - radius,
                    "top": coil_point[i].y - radius
                });
                if (i == 0) {
                    str += "ctx.fillStyle = '#33faff';";
                    str += "ctx.font = 'bold 12px Arial';";
                    str += "ctx.fillText('" + $.i18n.prop('virtual_coil') + "'," + coil_point[i].x + "," + (coil_point[i].y - 5) + ");";
                    str += "ctx.fillStyle = 'rgba(255,0,0,0.1)';";
                }
                str += "ctx.lineTo(" + coil_point[i].x + "," + coil_point[i].y + ");";
                if (i == coil_point.length - 1) {
                    str += "ctx.lineTo(" + coil_point[0].x + "," + coil_point[0].y + ");";
                }
            }
            str += "ctx.stroke();ctx.fill();";
        }
        //绘制区域
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        var area_enable = g_area_data.body.recognition_area.polygon[0].enable;
        var polygon_num = g_area_data.body.recognition_area.polygon_num;
        if (area_point.length > 0 && area_enable && polygon_num > 0) {
            str += "ctx.beginPath();";
            for (var i = 0; i < area_point.length; i++) {
                $("#canvas_container .area[index='" + i + "']").css({
                    "left": area_point[i].x - radius,
                    "top": area_point[i].y - radius
                });
                str += "ctx.lineTo(" + area_point[i].x + "," + area_point[i].y + ");";
                if (i == area_point.length - 1) {
                    str += "ctx.lineTo(" + area_point[0].x + "," + area_point[0].y + ");";
                }
                if (i == 0) {
                    str += "ctx.fillStyle = '#33faff';";
                    str += "ctx.font = 'bold 12px Arial';";
                    str += "ctx.fillText('" + $.i18n.prop('identify_areas') + "'," + area_point[i].x + "," + (area_point[i].y - 5) + ");";
                }
            }
            str += "ctx.stroke();";
        }
        //绘制通行方向
        if (coil_point.length > 0 && coil_enable && virtualloop_num > 0 && g_direction != 0) {
            var x = [], y = [];
            for (var i = 0; i < 4; i++) {
                x[i] = coil_point[i].x;
                y[i] = coil_point[i].y;
            }
            var arrows_arr = get_center_coord(x, y);
            for (var i = 0; i < arrows_arr.length - 1; i++) {
                str += drawArrow(arrows_arr[i].x, arrows_arr[i].y, arrows_arr[i + 1].x, arrows_arr[i + 1].y, 45, 10, 1);
            }
        }
        eval(str);
    }
    //获取两点的距离
    function getLength(a, b) {
        var disx = parseInt(a.x) - parseInt(b.x);
        var disy = parseInt(a.y) - parseInt(b.y);
        var num = (disx * disx) + (disy * disy); //平方和
        return parseInt(Math.sqrt(num));
    }
    //判断两条线段是否相交
    function lineIsCross(ptMa, ptMb, ptNa, ptNb) {
        var dbV1, dbV2, dbV3, dbV4;
        dbV1 = (ptMb.x - ptMa.x) * (ptNb.y - ptMa.y) - (ptMb.y - ptMa.y) * (ptNb.x - ptMa.x);
        dbV2 = (ptMb.x - ptMa.x) * (ptNa.y - ptMa.y) - (ptMb.y - ptMa.y) * (ptNa.x - ptMa.x);
        var dbResult1 = dbV1 * dbV2;
        if (dbResult1 >= 0) {
            return false;
        }
        dbV3 = (ptNb.x - ptNa.x) * (ptMb.y - ptNa.y) - (ptNb.y - ptNa.y) * (ptMb.x - ptNa.x);
        dbV4 = (ptNb.x - ptNa.x) * (ptMa.y - ptNa.y) - (ptNb.y - ptNa.y) * (ptMa.x - ptNa.x);
        var dbResult2 = dbV3 * dbV4;
        if (dbResult2 >= 0) {
            return false;
        }
        return true;
    }
    //点在直线上
    function inline(line_a, line_b, p) {
        return getLength(line_a, line_b) == getLength(line_a, p) + getLength(line_b, p);
    }

    function editIsCross(nPtIndex, ptMouse, point) {
        // 小于三个点的图形不会有交错
        var nSize = point.length;
        if (nSize < 3) {
            return false;
        }
        var nMaxIndex = nSize - 1;
        var bCross = false;
        var bCross1, bCross2;
        var ptEdge1Start, ptEdge1End;
        var ptEdge2Start, ptEdge2End;
        var ptStart, ptEnd;
        // 移动起点
        if (nPtIndex == 0) {
            ptStart = point[1];
            ptEnd = ptStart;
            // 第一条边
            ptEdge1Start = point[nMaxIndex - 1];
            ptEdge1End = ptMouse;
            // 第二条边
            ptEdge2Start = ptMouse;
            ptEdge2End = point[nPtIndex + 1];
            for (var i = 2; i < nMaxIndex; i++) {
                ptEnd = point[i];
                bCross1 = lineIsCross(ptEdge1Start, ptEdge1End, ptStart, ptEnd);
                bCross2 = lineIsCross(ptEdge2Start, ptEdge2End, ptStart, ptEnd);
                if (bCross1 || bCross2) {
                    bCross = true;
                    break;
                }
                ptStart = ptEnd;
            }
        } // 移动终点
        else if (nPtIndex == nMaxIndex) {
            ptStart = point[0];
            ptEnd = ptStart;
            // 第一条边
            ptEdge1Start = point[nMaxIndex - 1];
            ptEdge1End = ptMouse;
            for (var i = 1; i < nMaxIndex; i++) {
                ptEnd = point[i];
                bCross = lineIsCross(ptEdge1Start, ptEdge1End, ptStart, ptEnd);
                if (bCross) {
                    break;
                }
                ptStart = ptEnd;
            }
        } else {
            ptStart = point[0];
            ptEnd = ptStart;
            // 第一条边
            ptEdge1Start = point[nPtIndex - 1];
            ptEdge1End = ptMouse;
            // 第二条边
            ptEdge2Start = ptMouse;
            ptEdge2End = point[nPtIndex + 1];
            for (var i = 1; i < nSize; i++) {
                ptEnd = point[i];
                if ((i == nPtIndex) || (i == (nPtIndex + 1))) {
                    ptStart = ptEnd;
                    continue;
                }
                bCross1 = lineIsCross(ptEdge1Start, ptEdge1End, ptStart, ptEnd);
                bCross2 = lineIsCross(ptEdge2Start, ptEdge2End, ptStart, ptEnd);
                if (bCross1 || bCross2) {
                    bCross = true;
                    break;
                }
                ptStart = ptEnd;
            }
        }
        return bCross;
    }
    //点在多边形区域内
    function rayCasting(p, poly) {
        var px = p.x,
            py = p.y,
            flag = false;
        for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
            var sx = poly[i].x,
                sy = poly[i].y,
                tx = poly[j].x,
                ty = poly[j].y
            // 点与多边形顶点重合
            if ((sx === px && sy === py) || (tx === px && ty === py)) {
                return true;
            }
            // 判断线段两端点是否在射线两侧
            if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
                // 线段上与射线 Y 坐标相同的点的 X 坐标
                var x = sx + (py - sy) * (tx - sx) / (ty - sy)
                // 点在多边形的边上
                if (x === px) {
                    return true;
                }
                // 射线穿过多边形的边界
                if (x > px) {
                    flag = !flag;
                }
            }
        }
        // 射线穿过多边形边界的次数为奇数时点在多边形内
        return flag;
    }
    var g_coil_data = null;

    function prase_coil(ajaxdata) {
        if (precheck(ajaxdata)) {
            return false;
        }
        var jsondata = eval("(" + ajaxdata + ")");
        if (jsondata.state == 200) {
            g_coil_data = jsondata;
            jsondata = jsondata.body;
            var virtualloop = jsondata.virtualloop;
            var virtualloop_num = virtualloop.virtualloop_num;
            if (virtualloop_num == 0) {
                $("#del_coil").val($.i18n.prop("create_virtual_coil")).attr("state", "create");
                return
            }
            var enable = virtualloop.loop[0].enable;
            if (enable) {
                $(".coil_tr").show();
            } else {
                $(".coil_tr").hide();
            }
            var point = virtualloop.loop[0].point;
            var point_enable = virtualloop.loop[0].enable;
            if (!point_enable) {
                $("#del_coil").val($.i18n.prop("create_virtual_coil")).attr("state", "create");
            } else {
                $("#del_coil").attr("state", "delete");
            }
            var cv_width = parseInt($("#myCanvas").attr("width"));
            var cv_height = parseInt($("#myCanvas").attr("height"));
            var circle_str = "";
            for (var i = 0; i < point.length; i++) {
                point[i].x = get_ivs_s2i(point[i].x, cv_width);
                point[i].y = get_ivs_s2i(point[i].y, cv_height);
                circle_str += "<div class='circle coil' index='" + i + "'></div>";
            }
            $("#canvas_container").append(circle_str);
        }
    }

    function get_coil() {
        var cfg = {};
        cfg.type = "AVS_GET_VIRLOOP_PRM";
        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                //var ajaxdata = '{"type":"AVS_SET_VIRLOOP_PARAM","body":{"virtualloop":{"max_plate_width":400,"min_plate_width":45,"dir":0,"trigger_gap":10,"virtualloop_num":1,"loop":[{"id":0,"enable":true,"point_num":4,"point":[{"x":140,"y":120},{"x":400,"y":120},{"x":400,"y":140},{"x":160,"y":140}]}]}},"state":200,"error_msg":"Error Msg"}';
                prase_coil(ajaxdata);
            }
        });
    }
    var coil_state = 0;

    function set_coil() {
        if (!g_coil_data) {
            return;
        }
        if (g_coil_data['body']['virtualloop']['virtualloop_num'] == 0) {
            g_coil_data.body.virtualloop.loop = []
            var loop = {}
            loop.enable = false
            loop.point = []
            g_coil_data.body.virtualloop.loop.push(loop)
            g_coil_data['body']['virtualloop']['virtualloop_num'] == 1
        }
        var g_vl = g_coil_data.body.virtualloop;
        var g_loop = g_vl.loop[0];
        var g_point = g_loop.point;
        var cv_width = parseInt($("#myCanvas").attr("width"));
        var cv_height = parseInt($("#myCanvas").attr("height"));
        var cfg = {};
        cfg.type = "AVS_SET_VIRLOOP_PRM";
        cfg.body = {};
        var vl = {};
        cfg.body.virtualloop = vl;
        vl.max_plate_width = g_vl.max_plate_width;
        vl.min_plate_width = g_vl.min_plate_width;
        vl.dir = g_vl.dir;
        vl.trigger_gap = g_vl.trigger_gap;
        vl.loop = [];
        var json = {};
        json.id = g_loop.id;
        json.enable = g_loop.enable;
        json.point_num = g_loop.point.length;
        json.point = [];
        for (var i = 0; i < g_point.length; i++) {
            var p = {};
            p.x = get_ivs_i2s(g_point[i].x, cv_width);
            p.y = get_ivs_i2s(g_point[i].y, cv_height);
            json.point.push(p);
        }
        vl.loop.push(json);
        if (json.point.length != 0) {
            vl.virtualloop_num = vl.loop.length;
            json.enable = true;
            $(".coil_tr").show();
        } else {
            vl.virtualloop_num = 0;
            json.enable = false;
            $(".coil_tr").hide();
        }
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    coil_state = 1;
                } else {
                    coil_state = 2;
                }
            }
        });
    }
    var g_area_data = null;

    function prase_area(ajaxdata) {
        if (precheck(ajaxdata)) {
            return false;
        }
        var jsondata = eval("(" + ajaxdata + ")");
        if (jsondata.state == 200) {
            g_area_data = jsondata;
            jsondata = jsondata.body;
            var area = jsondata.recognition_area;
            var polygon_num = area.polygon_num;
            if (polygon_num == 0) {
                $("#del_area").val($.i18n.prop("create_identification_area")).attr("state", "create");
                return
            }
            var point = area.polygon[0].point;
            var point_enable = area.polygon[0].enable;
            if (!point_enable) {
                $("#del_area").val($.i18n.prop("create_identification_area")).attr("state", "create");
            } else {
                $("#del_area").attr("state", "delete");
            }
            var cv_width = parseInt($("#myCanvas").attr("width"));
            var cv_height = parseInt($("#myCanvas").attr("height"));
            var circle_str = "";
            for (var i = 0; i < point.length; i++) {
                point[i].x = get_ivs_s2i(point[i].x, cv_width);
                point[i].y = get_ivs_s2i(point[i].y, cv_height);
                circle_str += "<div class='circle area' index='" + i + "'></div>";
            }
            $("#canvas_container").append(circle_str);
        }
    }

    function get_area() {
        var cfg = {};
        cfg.type = "AVS_GET_RECO_PRM";
        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                //var ajaxdata = '{"type":"AVS_SET_RECO_PRM","body":{"recognition_area":{"polygon_num":1,"polygon":[{"id":1,"enable":true,"point_num":4,"point":[{"x":409,"y":409},{"x":122,"y":409},{"x":139,"y":139},{"x":245,"y":139}]}]}},"state":200,"error_msg":"Error Msg"}';
                prase_area(ajaxdata);
            }
        });
    }
    var area_state = 0;

    function set_area() {
        if (!g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        var g_ra = g_area_data.body.recognition_area;
        var g_polygon = g_ra.polygon[0];
        var g_point = g_polygon.point;
        var cv_width = parseInt($("#myCanvas").attr("width"));
        var cv_height = parseInt($("#myCanvas").attr("height"));
        var cfg = {};
        cfg.type = "AVS_SET_RECO_PRM";
        cfg.body = {};
        var ra = {};
        cfg.body.recognition_area = ra;
        ra.polygon = [];
        var json = {};
        json.id = g_polygon.id;
        json.enable = g_polygon.enable;
        json.point_num = g_polygon.point.length;
        json.point = [];
        for (var i = 0; i < g_point.length; i++) {
            var p = {};
            p.x = get_ivs_i2s(g_point[i].x, cv_width);
            p.y = get_ivs_i2s(g_point[i].y, cv_height);
            json.point.push(p);
        }
        ra.polygon.push(json);
        if (json.point.length != 0) {
            json.enable = true;
            ra.polygon_num = ra.polygon.length;
        } else {
            json.enable = false;
            ra.polygon_num = 0;
        }
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    area_state = 1;
                } else {
                    area_state = 2;
                }
            }
        });
    }
    var circle_down = false;
    var downobj = null;
    var old_position = null;
    var coil_down = false;
    var area_down = false;
    //点击圆点事件
    function circle_mousedown() {
        if (downobj) {
            downobj.css("background-color", "red");
            downobj = null;
        }
        circle_down = true;
        downobj = $(this);
        $(this).css("background-color", "green");
        return false;
    }
    //点击区域事件
    function canvas_mousedown(event) {
        if (downobj) {
            downobj.css("background-color", "red");
            downobj = null;
        }
        var e = event || window.event;
        if (!g_coil_data || !g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        if (g_coil_data['body']['virtualloop']['virtualloop_num'] == 0) {
            g_coil_data.body.virtualloop.loop = []
            var loop = {}
            loop.enable = false
            loop.point = []
            g_coil_data.body.virtualloop.loop.push(loop)
            g_coil_data['body']['virtualloop']['virtualloop_num'] == 1
        }
        var coil_point = g_coil_data.body.virtualloop.loop[0].point;
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        var p_l = $("#video_outer").offset().left;
        var p_t = $("#video_outer").offset().top;
        var x = e.pageX - p_l;
        var y = e.pageY - p_t;
        var p = {
            "x": x,
            "y": y
        };
        old_position = p;
        if (rayCasting(p, coil_point)) {
            coil_down = true;
            draw_area();
            return;
        }
        if (rayCasting(p, area_point)) {
            area_down = true;
            draw_area();
            return;
        }
        return false;
    }
    //松开鼠标事件
    function mouseup() {
        if (circle_down) {
            circle_down = false;
        }
        if (coil_down) {
            coil_down = false;
            draw_area();
        }
        if (area_down) {
            area_down = false;
            draw_area();
        }
    }
    function check_img_mode() {
        if (g_d_type == 2 && g_m_version == 4 || g_d_type == 3 && g_m_version == 6) {
            var mode = $("#long_focus").check_val();
            if (mode) {
                $("#wide_angle").check_val(true);
                set_img_mode();
                $("#mode_change_hint").show();
                setTimeout(function () {
                    $("#mode_change_hint").hide();
                }, 3000);
            }
        }
    }
    function canvas_mousemove(event) {
        if (!g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        var e = event || window.event;
        if (($(e.target).attr('id') != 'video_outer' && $(e.target).parents('#video_outer').length == 0) || $(e.target).hasClass('area')) {
            $("#add_circle").hide();
            return false
        }
        var p_l = $("#video_outer").offset().left;
        var p_t = $("#video_outer").offset().top;
        var x = e.pageX - p_l;
        var y = e.pageY - p_t;
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        var flag = false;
        if (area_point.length < 9) {
            var p = {
                "x": x,
                "y": y
            };
            for (var i = 0; i < area_point.length - 1; i++) {
                var s = {
                    "x": area_point[i].x,
                    "y": area_point[i].y
                };
                var e = {
                    "x": area_point[i + 1].x,
                    "y": area_point[i + 1].y
                };
                var n_s = {
                    "x": area_point[i].x - 1,
                    "y": area_point[i].y - 1
                };
                var n_e = {
                    "x": area_point[i + 1].x - 1,
                    "y": area_point[i + 1].y - 1
                };
                var p_s = {
                    "x": area_point[i].x + 1,
                    "y": area_point[i].y + 1
                };
                var p_e = {
                    "x": area_point[i + 1].x + 1,
                    "y": area_point[i + 1].y + 1
                };
                if (inline(s, e, p) || inline(n_s, n_e, p) || inline(p_s, p_e, p)) {
                    flag = true;
                    break;
                }
                if (i == 0) {
                    var e = {
                        "x": area_point[area_point.length - 1].x,
                        "y": area_point[area_point.length - 1].y
                    };
                    var n_e = {
                        "x": area_point[area_point.length - 1].x - 1,
                        "y": area_point[area_point.length - 1].y - 1
                    };
                    var p_e = {
                        "x": area_point[area_point.length - 1].x + 1,
                        "y": area_point[area_point.length - 1].y + 1
                    };
                    if (inline(s, e, p) || inline(n_s, n_e, p) || inline(p_s, p_e, p)) {
                        flag = true;
                        break;
                    }
                }
            }
        }
        if (flag) {
            $("#add_circle").css({ 'left': x, 'top': y + 20 }).show();
        } else {
            $("#add_circle").hide();
        }
    }
    //移动鼠标事件
    function mousemove(event) {
        var e = event || window.event;
        canvas_mousemove(event);
        if (!circle_down && !coil_down && !area_down) {
            return false;
        }
        if (!g_coil_data || !g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        if (g_coil_data['body']['virtualloop']['virtualloop_num'] == 0) {
            g_coil_data.body.virtualloop.loop = []
            var loop = {}
            loop.enable = false
            loop.point = []
            g_coil_data.body.virtualloop.loop.push(loop)
            g_coil_data['body']['virtualloop']['virtualloop_num'] == 1
        }
        var p_l = $("#video_outer").offset().left;
        var p_t = $("#video_outer").offset().top;
        var x = e.pageX - p_l;
        var y = e.pageY - p_t;
        var coil_point = g_coil_data.body.virtualloop.loop[0].point;
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        var cancas = $("#myCanvas");
        var canvas_wh = {
            "width": parseInt(cancas.attr("width")),
            "height": parseInt(cancas.attr("height"))
        }

        if (circle_down) {
            check_img_mode();
            var parent = downobj.parent();

            if (x > parent.width()) {
                x = parent.width();
            }
            if (x < 0) {
                x = 0;
            }
            if (y > parent.height()) {
                y = parent.height();
            }
            if (y < 0) {
                y = 0;
            }
            if (!downobj) {
                return false;
            }
            var index = parseInt(downobj.attr("index"));
            var cur_point = null;
            if (downobj.hasClass("coil")) {
                cur_point = coil_point;
            } else if (downobj.hasClass("area")) {
                cur_point = area_point;
            }
            var new_cur_point = [];
            for (var i = 0; i < cur_point.length; i++) {
                new_cur_point.push(cur_point[i]);
            }
            new_cur_point.push(cur_point[0]);
            if (editIsCross(index, {
                "x": x,
                "y": y
            }, new_cur_point)) {
                return;
            }
            downobj.css({
                "left": x - radius,
                "top": y - radius
            });
            cur_point[index].x = x;
            cur_point[index].y = y;
            draw_area();
            $("#set_rule").removeAttr("disabled").removeClass("ui-state-disabled");
        } else if (coil_down) {
            check_img_mode();
            var diff_x = x - old_position.x;
            var diff_y = y - old_position.y;
            old_position.x = x;
            old_position.y = y;
            var flag = false;
            for (var i = 0; i < coil_point.length; i++) {
                var n_x = coil_point[i].x + diff_x;
                var n_y = coil_point[i].y + diff_y;
                if (n_x > canvas_wh.width) {
                    flag = true;
                    break;
                }
                if (n_x < 0) {
                    flag = true;
                    break;
                }
                if (n_y > canvas_wh.height) {
                    flag = true;
                    break;
                }
                if (n_y < 0) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                return;
            }

            for (var i = 0; i < coil_point.length; i++) {
                coil_point[i].x = coil_point[i].x + diff_x;
                coil_point[i].y = coil_point[i].y + diff_y;
            }
            draw_area();
            $("#set_rule").removeAttr("disabled").removeClass("ui-state-disabled");
        } else if (area_down) {
            check_img_mode();
            var diff_x = x - old_position.x;
            var diff_y = y - old_position.y;
            old_position.x = x;
            old_position.y = y;
            var flag = false;
            for (var i = 0; i < area_point.length; i++) {
                var n_x = area_point[i].x + diff_x;
                var n_y = area_point[i].y + diff_y;
                if (n_x > canvas_wh.width) {
                    flag = true;
                    break;
                }
                if (n_x < 0) {
                    flag = true;
                    break;
                }
                if (n_y > canvas_wh.height) {
                    flag = true;
                    break;
                }
                if (n_y < 0) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                return;
            }
            for (var i = 0; i < area_point.length; i++) {
                area_point[i].x = area_point[i].x + diff_x;
                area_point[i].y = area_point[i].y + diff_y;
            }
            draw_area();
            $("#set_rule").removeAttr("disabled").removeClass("ui-state-disabled");
        }
        return false;
    }

    function canvas_dblclick(event) {
        var flag = false;
        if (downobj) {
            downobj.css("background-color", "red");
            downobj = null;
        }
        if (!g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        if (area_point.length < 9) {
            var e = event || window.event;
            var p_l = $("#video_outer").offset().left;
            var p_t = $("#video_outer").offset().top;
            var x = e.pageX - p_l;
            var y = e.pageY - p_t;
            var p = {
                "x": x,
                "y": y
            };
            var index = 0;
            for (var i = 0; i < area_point.length - 1; i++) {
                var s = {
                    "x": area_point[i].x,
                    "y": area_point[i].y
                };
                var e = {
                    "x": area_point[i + 1].x,
                    "y": area_point[i + 1].y
                };
                var n_s = {
                    "x": area_point[i].x - 1,
                    "y": area_point[i].y - 1
                };
                var n_e = {
                    "x": area_point[i + 1].x - 1,
                    "y": area_point[i + 1].y - 1
                };
                var p_s = {
                    "x": area_point[i].x + 1,
                    "y": area_point[i].y + 1
                };
                var p_e = {
                    "x": area_point[i + 1].x + 1,
                    "y": area_point[i + 1].y + 1
                };
                if (inline(s, e, p) || inline(n_s, n_e, p) || inline(p_s, p_e, p)) {
                    flag = true;
                    index = (i + 1);
                    break;
                }
                if (i == 0) {
                    var e = {
                        "x": area_point[area_point.length - 1].x,
                        "y": area_point[area_point.length - 1].y
                    };
                    var n_e = {
                        "x": area_point[area_point.length - 1].x - 1,
                        "y": area_point[area_point.length - 1].y - 1
                    };
                    var p_e = {
                        "x": area_point[area_point.length - 1].x + 1,
                        "y": area_point[area_point.length - 1].y + 1
                    };
                    if (inline(s, e, p) || inline(n_s, n_e, p) || inline(p_s, p_e, p)) {
                        flag = true;
                        index = area_point.length;
                        break;
                    }
                }
            }
        }
        if (flag) {
            var circle_str = "<div class='circle area' index='" + index + "'></div>";
            $("#canvas_container .area").each(function () {
                var cur_index = parseInt($(this).attr("index"));
                if (cur_index >= index) {
                    $(this).attr("index", (cur_index + 1));
                }
            });
            $("#canvas_container").append(circle_str);
            if (index == area_point.length) {
                area_point.push(p);
            } else {
                area_point.splice(index, 0, p);
            }
            draw_area();
            $("#set_rule").removeAttr("disabled").removeClass("ui-state-disabled");
        } else {
            show_max_video();
        }
    }
    function circle_dblclick(event) {
        var e = event || window.event;
        if (!g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        if (area_point.length > 4) {
            var index = parseInt($(e.target).attr("index"));
            $("#canvas_container .area[index='" + index + "']").remove();
            $("#canvas_container .area").each(function () {
                var cur_index = parseInt($(this).attr("index"));
                if (cur_index >= index) {
                    $(this).attr("index", (cur_index - 1));
                }
            });
            area_point.splice(index, 1);
            draw_area();
            $("#set_rule").removeAttr("disabled").removeClass("ui-state-disabled");
        }
        $("#del_circle").hide();
    }
    function get_pos(str, new_energy) {
        var all_text_arr = text_str.split("");
        var index = 87;
        if (new_energy) {
            for (var i = all_text_arr.length; i > 0; i--) {
                if (str == all_text_arr[i]) {
                    index = i;
                    break;
                }
            }
        } else {
            for (var i = 0; i < all_text_arr.length; i++) {
                if (str == all_text_arr[i]) {
                    index = i;
                    break;
                }
            }
        }
        var row = parseInt(index / 8);
        var col = index % 8;
        var x = col * text_width;
        var y = row * text_height;
        return {
            "x": x,
            "y": y
        };
    }
    var cur_id = -1;
    var text_width = 14;
    var text_height = 32;

    function img_src(src, type, color) {
        $("#big_img").attr("src", src);
        if ((type == 0 || type == 31) && color == 0) {
            $("#small_img_path").attr("src", "js/FileTree/images/black.jpg");
        } else {
            $("#small_img_path").attr("src", src);
        }
        if (type == 0 && color == 0) {
            $("#car_head").attr("src", "js/FileTree/images/black.jpg");
        } else {
            $("#car_head").attr("src", src);
        }
    }
    function get_img(id, callback) {
        var cfg = {}
        cfg.type = "STORE_READ_IMG_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        cfg.body = {}
        cfg.body.id = id;
        post(cfg, function (res) {
            var src = res.body.image_path + '?' + new Date().getTime();
            if (callback) {
                callback(src)
            }
        })
    }
    function prase_data(json, is_click) {
        var pr = json.body.PlateResult;
        var white_list_info = pr.white_list_info
        var tp = pr.uBitsTrigType;
        var l_width = pr['plate_true_width'];
        // var l_width = parseInt(pr.plate_right - pr.plate_left)
        // if ((g_d_type == 3 && (g_m_version == 9 || g_m_version == 26)) || (g_d_type == 5 && g_m_version == 1)) {
        //   l_width = parseInt(l_width * 2304 / img_size_width);
        // } else {
        //   l_width = parseInt(l_width * 1920 / img_size_width);
        // }
        if (!is_click) {
            var tp_str = "";
            if (tp == 1) {
                tp_str = $.i18n.prop("stable_recognition");
            } else if (tp == 2) {
                tp_str = $.i18n.prop("external_trigger");
            } else if (tp == 4) {
                tp_str = $.i18n.prop("manual_trigger");
            } else if (tp == 8) {
                tp_str = $.i18n.prop("virtual_ground_coil");
            }
            var fake_str = "";
            if (enable_fake_plate == 1 && pr.is_fake_plate == 1) {
                fake_str = $.i18n.prop("fake") + ":";
            }
            var brand_str = 'av_car_manu_unknown';
            var brand = pr.car_brand.brand;
            if (brand < car_logo.length) {
                brand_str = car_logo[brand];
            }
            var car_color_str = "";
            if (is_R3) {
                var car_color = pr.car_color;
                if (car_color >= car_body_color.length) {
                    car_color = car_body_color.length - 1;
                }
                car_color_str = "<td>" + $.i18n.prop(car_body_color[car_color]) + "</td>";
            }
            var white_str = $.i18n.prop('Temporary')
            if (white_list_info == 1) {
                white_str = $.i18n.prop('monthly')
            } else if (white_list_info == 9) {
                white_str = $.i18n.prop('special_license')
            }
            var car_type_color = "<td>" + $.i18n.prop(car_type_arr[pr.nType]) + "</td><td>" + $.i18n.prop(car_color_arr[pr.color]) + "</td>";
            var str = "<tr class='ui-state-active' data='" + JSON.stringify(json) + "'><td>" + pr.trigger_time + "</td><td>" + fake_str + pr.license + "</td>" + car_type_color + "<td>" + l_width + $.i18n.prop("pixel") + "</td><td>" + white_str + "</td><td>" + tp_str + "</td><td>" + $.i18n.prop(brand_str) + "</td>" + car_color_str + "</tr>";
            $("#rec_tb tbody tr").removeClass("ui-state-active");
            $("#rec_tb tbody").append(str);
            var length = $("#rec_tb tbody tr").length;
            if (length > 10) {
                var num = length - 10;
                $("#rec_tb tbody tr:lt(" + num + ")").remove();
            }
        }
        //加载大图片
        var src = "";
        if (!is_click) {
            src = "snapshot/last_ivs_result.jpg?" + new Date().getTime();
            img_src(src, pr.nType, pr.color);
        } else {
            get_img(pr.image_path, function (src) {
                $("#car_head").attr("src", src);
                $("#big_img").attr("src", src);
                $("#small_img_path").attr("src", src);
            })
        }
        if (!src) {
            src = "js/FileTree/images/black.jpg";
        }
        var big_img_load = false;
        $("#big_img").load(function () {
            if (big_img_load) {
                return;
            }
            $("#big_img").unbind("load");
            big_img_load = true;
            var naturalWidth = getNatural($("#big_img").get(0)).width;
            var width = Math.ceil(l_width * 1920 / naturalWidth);
            load = true;
            var check = $("#hint_enable").check_val();
            if (check && !is_click) {
                if (width > 0 && width < 180) {
                    $("#debug_hint").html($.i18n.prop("license_small_hint"));
                } else if (width >= 180 && width <= 220) {
                    $("#debug_hint").html($.i18n.prop("license_hint"));
                } else if (width > 220) {
                    $("#debug_hint").html($.i18n.prop("license_big_hint"));
                }
            } else {
                $("#debug_hint").html("");
            }
        });
        //加载车牌图片
        var p_t = pr.plate_top;
        var p_b = pr.plate_bottom;
        var p_l = pr.plate_left;
        var p_r = pr.plate_right;
        var load_plate = false;
        var plate_height = p_b - p_t;
        var plate_width = p_r - p_l;
        if ((pr.nType == 0 || pr.nType == 31) && pr.color == 0) {
            $("#small_img_path").attr("src", "js/FileTree/images/black.jpg");
        } else {
            $("#small_img_path").load(function () {
                if (!load_plate) {
                    $("#small_img_path").unbind("load");
                    load_plate = true;
                    var naturalWidth = getNatural($("#small_img_path").get(0)).width;
                    var naturalHeight = getNatural($("#small_img_path").get(0)).height;
                    var con_width = $("#small_img_path_div").width();
                    var con_height = $("#small_img_path_div").height();
                    var cur_width = naturalWidth * con_width / plate_width;
                    var cur_height = naturalHeight * con_height / plate_height;
                    var cur_top = 0 - cur_height * p_t / naturalHeight;
                    var cur_left = 0 - cur_width * p_l / naturalWidth;
                    $("#small_img_path").css({
                        "width": cur_width,
                        "height": cur_height,
                        "margin-top": cur_top,
                        "margin-left": cur_left
                    });
                }
            });
        }
        //加载车头图片
        var h_t = pr.car_head_top;
        var h_b = pr.car_head_bottom;
        var h_l = pr.car_head_left;
        var h_r = pr.car_head_right;
        var load_head = false;
        if (pr.nType == 0 && pr.color == 0) {
            $("#car_head").attr("src", "js/FileTree/images/black.jpg");
        } else {
            $("#car_head").load(function () {
                if (!load_head) {
                    $("#car_head").unbind("load");
                    load_head = true;
                    var naturalWidth = getNatural($("#car_head").get(0)).width;
                    var naturalHeight = getNatural($("#car_head").get(0)).height;
                    var con_width = $("#car_head_div").width();
                    var con_height = $("#car_head_div").height();
                    if (h_t == 0 && h_b == 0 && h_l == 0 && h_r == 0) {
                        var rate = naturalHeight / naturalWidth;
                        var extern_width = plate_width / 1.5;
                        var extern_height = ((extern_width * 2 + plate_width) * rate - plate_height) / 2;

                        h_t = p_t - extern_height;
                        if (h_t < 0) {
                            h_t = 0;
                        }
                        h_b = p_b + extern_height;
                        if (h_b > naturalHeight) {
                            h_b = naturalHeight;
                        }
                        h_l = p_l - extern_width;
                        if (h_l < 0) {
                            h_l = 0;
                        }
                        h_r = p_r + extern_width;
                        if (h_t > naturalWidth) {
                            h_t = naturalWidth;
                        }
                    }
                    var head_height = h_b - h_t;
                    var head_width = h_r - h_l;
                    var cur_width = naturalWidth * con_width / head_width;
                    var cur_height = naturalHeight * con_height / head_height;
                    var cur_top = 0 - cur_height * h_t / naturalHeight;
                    var cur_left = 0 - cur_width * h_l / naturalWidth;
                    if (con_width - cur_width > cur_left) {
                        cur_left = con_width - cur_width;
                    }
                    if (con_height - cur_height > cur_top) {
                        cur_top = con_height - cur_height;
                    }
                    if (cur_top > 0) {
                        cur_top = 0;
                    }
                    if (cur_left > 0) {
                        cur_left = 0;
                    }
                    $("#car_head").css({
                        "width": cur_width,
                        "height": cur_height,
                        "margin-top": cur_top,
                        "margin-left": cur_left
                    });
                }
            });
        }
        //加载模拟车牌
        var license = pr.license;
        var license_ext_type = pr.license_ext_type;
        var plate_type_img = "";
        var bg_img = "";
        var plate_color = pr.color;
        if (plate_color == 0 && (pr.is_fake_plate == 0 || pr.nType == 31)) {
            $("#simulate").attr("src", 'js/FileTree/images/black.jpg');
            $("#simulate_inner").html("");
            return;
        }
        if (plate_color == 1) {
            plate_type_img = "civil_blue.png";
            bg_img = "civil_white_db.png?" + new Date().getTime();
        } else if (plate_color == 2) {
            plate_type_img = "civil_yellow.png";
            bg_img = "civil_black_db.png?" + new Date().getTime();
        } else if (plate_color == 3) {
            plate_type_img = "civil_white.jpg";
            bg_img = "civil_black_db.png?" + new Date().getTime();
        } else if (plate_color == 4) {
            plate_type_img = "civil_black.jpg";
            bg_img = "civil_white_db.png?" + new Date().getTime();
        } else if (plate_color == 5 && (pr.nType == 18 || pr.nType == 25)) {
            plate_type_img = "civil_green.png";
            bg_img = "civil_white_db.png?" + new Date().getTime();
        } else if (plate_color == 5 && (pr.nType == 19 || pr.nType == 7 || pr.nType == 20)) {
            plate_type_img = "civil_new_energy.png";
            bg_img = "civil_black_db.png?" + new Date().getTime();
        } else if (plate_color == 6 && pr.nType == 20) {
            plate_type_img = "civil_big_new_energy.png";
            bg_img = "civil_black_db.png?" + new Date().getTime();
        }
        if (pr.nType == 23 || pr.nType == 24) {
            bg_img = "civil_black_db.png?" + new Date().getTime();
            if (pr.nType == 23) {
                if (license_ext_type == 1) {
                    plate_type_img = "new_car_A_F.jpg";
                } else if (license_ext_type == 2) {
                    plate_type_img = "new_car_A_Y.jpg";
                } else if (license_ext_type == 3) {
                    plate_type_img = "new_car_A_G.jpg";
                }
            } else if (pr.nType == 24) {
                if (license_ext_type == 1) {
                    plate_type_img = "new_car_B_F.jpg";
                } else if (license_ext_type == 2) {
                    plate_type_img = "new_car_B_Y.jpg";
                } else if (license_ext_type == 3) {
                    plate_type_img = "new_car_B_G.jpg";
                }
            }
        }
        // if (pr.is_fake_plate == 1) {
        //     plate_type_img = "civil_red.png";
        //     bg_img = "civil_white_db.png";
        // }
        var ba_img_src = "style/common/" + bg_img;
        var plate_type_img_src = "style/common/" + plate_type_img;
        $("#simulate").attr("src", plate_type_img_src);
        if (license.substring(0, 2) == "WJ") {
            var str = "";
            if (license.length == 7) {
                str = " ";
            }
            license = "武" + str + license.substring(2, license.length);
        }
        var span_str = "";
        var is_new_energy = 0;
        if (pr.nType == 19 || pr.nType == 20 || pr.nType == 21 || pr.nType == 7) {
            is_new_energy = 1;
        }
        if (g_d_type == 3 && g_m_version == 8) {
            license = license.split("");
            var font_size = (148 / license.length) * 1.5;
            if (font_size > 30) {
                font_size = 30;
            }
            var num = 0;
            for (var i = 0; i < license.length; i++) {
                if (license[i] == "W" || license[i] == "M") {
                    num++;
                }
            }
            font_size -= num;
            span_str += "<span style='color:#fff;font-size:" + font_size + "px;line-height:32px;'>" + pr.license + "</span>";
            $("#simulate_inner").html(span_str);
        } else {
            license = license.replace(/O/g, "0");
            license = license.split("");
            var old_img_src = ba_img_src;
            for (var i = 0; i < license.length; i++) {
                var pos = get_pos(license[i], is_new_energy);
                if (license[i] == "警" || license[i] == "武" || license[i] == "应" || license[i] == "急" || (pr.nType == 21 && (license[i] == "X" || license[i] == "S") && i == 1) || ((pr.nType == 8 || pr.nType == 9) && (i == 0 || i == 1))) {
                    ba_img_src = "style/common/civil_red_db.png?" + new Date().getTime();
                } else {
                    if (i > 0 && license[i - 1] != "武") {
                        ba_img_src = old_img_src;
                    }
                }
                var class_str = "";
                if (i == 0) {
                    class_str = "class='one'";
                } else if (i == 1) {
                    class_str = "class='two'";
                } else if (i == 4) {
                    class_str = "class='four'";
                } else if (i == license.length - 1) {
                    class_str = "class='last'";
                }
                var pos_x = 0 - pos.x;
                var pos_y = 0 - pos.y;
                ba_img_src = ba_img_src + "?" + version.web;
                span_str += "<span " + class_str + " style='background-image:url(" + ba_img_src + ");width:" + text_width + "px;height:" + text_height + "px;background-position:" + pos_x + "px " + pos_y + "px;'></span>";
            }
            $("#simulate_inner").html(span_str);
            var margin_right = "0px";
            var two_margin = "0px";
            if (license.length == 7) {
                margin_right = "5px";
                two_margin = "15px";
            } else {
                margin_right = "2px";
                two_margin = "14px";
            }
            if (pr.nType == 23) {
                margin_right = "3px";
                two_margin = "3px";
                $("#simulate_inner .two").addClass('transform')
            } else {
                $("#simulate_inner .two").removeClass('transform')
            }
            $("#simulate_inner span").css({
                "margin-right": margin_right
            });
            if (pr.nType == 21) {
                $("#simulate_inner .one").css("margin-right", two_margin);
            } else if (pr.nType == 23) {
                $("#simulate_inner .four").css("margin-right", '6px');
            } else {
                $("#simulate_inner .two").css("margin-right", two_margin);
            }
            $("#simulate_inner .last").css("margin-right", "0px");
            $("#simulate_inner .transform").css({ 'transform': 'scale(.6,.6)', 'position': 'relative', 'top': '6px' });
        }
    }
    function get_rec_result() {
        if (!get_rec_result_flag) {
            return;
        }
        var time1 = new Date().getTime();
        var cfg = {}
        cfg.result_id = cur_id
        var data = JSON.stringify(cfg)
        $.ajax({
            type: 'GET',
            url: "ivs_result.php",
            timeout: 5000,
            data: data,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var time2 = new Date().getTime();
                var time = time2 - time1;
                if (time > 500) {
                    get_rec_result();
                } else {
                    var t = setTimeout(function () {
                        get_rec_result();
                        clearTimeout(t);
                    }, 500 - time);
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    if (!json['body']) {
                        return
                    }
                    if (!json['body']['sn']) {
                        return
                    }
                    if (json['body']['sn'] != g_device_sn) {
                        return
                    }

                    var result_id = json.body.result_id;
                    if (result_id <= cur_id) {
                        return;
                    }
                    if (cur_id == -1 && result_id != 1) {
                        cur_id = result_id
                        return
                    }
                    cur_id = result_id;
                    prase_data(json, 0);
                }
            },
            error: function () {
                if (cur_id == 0) {
                    cur_id = 1;
                }
                var time2 = new Date().getTime();
                var time = time2 - time1;
                if (time > 500) {
                    get_rec_result();
                } else {
                    var t = setTimeout(function () {
                        get_rec_result();
                        clearTimeout(t);
                    }, 500 - time);
                }
            }
        });
    }

    function trigger() {
        $.ajax({
            type: 'GET',
            url: "avstrigger.php",
            timeout: 5000,
            success: function (ajaxdata) {
                if (ajaxdata == "ok") {
                    var rec_timer = setTimeout(function () {
                        clearTimeout(rec_timer);
                    }, 200);
                }
            }
        });
    }

    function get_json(stream_id, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].stream_id == stream_id) {
                return arr[i];
            }
        }
    }

    function set_best_size(width) {
        // var video_w = $("#video_outer").width();
        // var video_h = $("#video_outer").height();
        // var cur_size_w = width * 200 / 1920;
        // var img_w = video_w * cur_size_w / width;
        // var pos_x = (video_w - img_w) / 2;
        // var pos_y = get_ivs_s2i(12000, video_h);
        // $("#best_size").width(img_w).css({
        //   "left": pos_x,
        //   "top": pos_y
        // });
        var video_w = $("#video_outer").width();
        var video_h = $("#video_outer").height();
        var scale = video_w * 1.5 / width;
        var img_w = 120 * scale;
        var pos_x = (video_w - img_w) / 2;
        var pos_y = video_h * 0.7;
        $("#best_size").width(img_w).css({
            "left": pos_x,
            "top": pos_y
        });
    }
    var g_video_size;

    function new_get_video_para(all_size) {
        var cfg = {};
        cfg.type = "AVS_GET_ENCODE_PARAM";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body;
                var default_stream = jsondata.default_stream;
                var encode_param = jsondata.encode_param;
                var json = get_json(default_stream, encode_param);
                var res = json.resolution;
                var width = parseInt(all_size[res].split("*")[0]);
                if (width == 1920) {
                    $("#best_size").attr("src", "style/common/1920.bmp");
                } else {
                    $("#best_size").attr("src", "style/common/1080.bmp");
                }
                g_video_size = width;
                set_best_size(g_video_size);
            }
        });
    }

    function new_get_video_size() {
        var cfg = {};
        cfg.type = "AVS_GET_ENCODE_PROP";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body;
                jsondata = jsondata.encode_param[0];
                //分辨率
                var resolution = jsondata.resolution.types;
                var json = {};
                for (var i = 0; i < resolution.length; i++) {
                    json[resolution[i].type] = resolution[i].content;
                }
                new_get_video_para(json);
            }
        });
    }
    var is_max = false;

    function show_max_video() {
        var rw = $(window).width();
        var rh = $(window).height();
        var h = 0;
        var w = 0;

        if (!is_max) {
            $("#myCanvas").attr("height", rh).attr("width", rw);
            $("#video_outer").height(rh).width(rw).css({
                "position": "fixed",
                "left": w,
                "top": h,
                "z-index": 999
            });
            IvsConfig.ivs_window_resize();
        } else {
            $("#video_outer").css({
                "position": "relative",
                "left": 0,
                "top": 0,
                "width": "100%",
                "z-index": 1
            });
            window.onresize();
            IvsConfig.ivs_window_resize();
        }
        is_max = !is_max;
    }

    this.ivs_window_resize = function () {
        if (!g_coil_data || !g_video_size || !g_area_data) {
            return;
        }
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        if (g_coil_data['body']['virtualloop']['virtualloop_num'] == 0) {
            g_coil_data.body.virtualloop.loop = []
            var loop = {}
            loop.enable = false
            loop.point = []
            g_coil_data.body.virtualloop.loop.push(loop)
            g_coil_data['body']['virtualloop']['virtualloop_num'] == 1
        }
        set_best_size(g_video_size);
        var width = $("#myCanvas").attr("width");
        var height = $("#myCanvas").attr("height");
        $("#mode_change_hint").css("top", (height / 2));
        var sv_y = height / old_height;
        var sv_x = width / old_width;
        var coil_point = g_coil_data.body.virtualloop.loop[0].point;
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        for (var i = 0; i < coil_point.length; i++) {
            coil_point[i].x = coil_point[i].x * sv_x;
            coil_point[i].y = coil_point[i].y * sv_y;
        }
        for (var i = 0; i < area_point.length; i++) {
            area_point[i].x = area_point[i].x * sv_x;
            area_point[i].y = area_point[i].y * sv_y;
        }
        old_width = width;
        old_height = height;
        draw_area();
        if (player.player != null) {
            player.player.resize();
        }
    }

    function online() {
        if (!online_flag) {
            return;
        }
        var time1 = new Date().getTime();
        var cfg = {};
        cfg.type = "get_user_auth";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getauth.php",
            data: jsonstr,
            timeout: 5000,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var time2 = new Date().getTime();
                var time = time2 - time1;
                if (time > 5000) {
                    online();
                } else {
                    var t = setTimeout(function () {
                        online();
                        clearTimeout(t);
                    }, 5000 - time);
                }
            },
            error: function () {
                is_offline = true;
                var time2 = new Date().getTime();
                var time = time2 - time1;
                if (time > 5000) {
                    online();
                } else {
                    var t = setTimeout(function () {
                        online();
                        clearTimeout(t);
                    }, 5000 - time);
                }
            }
        });
    }
    function get_img_mode() {
        var cfg = {};
        cfg.type = "AVS_GET_IMG_MODE_PRM";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "/avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    init_img(jsondata);
                }
            }
        })
    }
    function set_img_mode() {
        var small_image = $("#small_image").check_val() ? 1 : 0;
        var deep_image = $("#deep_image").check_val() ? 1 : 0;
        var cfg = {};
        cfg.type = "AVS_SET_IMG_MODE_PRM";
        cfg.body = {};
        if ($("#wide_angle").check_val()) {
            cfg.body.image_mode = 0;
        } else if ($("#long_focus").check_val()) {
            cfg.body.image_mode = 1;
        }
        cfg.body.small_image = small_image;
        cfg.body.deep_image = deep_image;
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "/avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
            }
        })
    }
    var old_width, old_height;
    var default_coil = [{
        "x": 2400,
        "y": 12000
    }, {
        "x": 13984,
        "y": 12000
    }, {
        "x": 15984,
        "y": 14000
    }, {
        "x": 400,
        "y": 14000
    }];
    var default_area = [{
        "x": 1280,
        "y": 2389
    }, {
        "x": 15052,
        "y": 2389
    }, {
        "x": 16140,
        "y": 15928
    }, {
        "x": 204,
        "y": 15928
    }];
    var go_on = true;
    var is_offline = false;
    this.get_result_by_id = function (id) {
        var json = {};
        json.type = "get_ivs_rec_byid";
        json.id = id;

        var jsonstr = JSON.stringify(json);
        $.ajax({
            type: 'GET',
            url: "vb.htm?getivsrecordbyid=" + jsonstr,
            timeout: 5000,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    prase_data(json, 1);
                }
            }
        });
    }
    function init_select_width(prc) {
        var left = parseInt($(".jslider-bg>.v").css("left").split("px")[0]);
        var width = $(".jslider-bg>.v").width();
        var p_width = $(".jslider-bg").width();
        if (prc) {
            p_width = 320;
            left = parseInt(p_width * parseInt(prc.split(";")[0]) / 100);
            width = parseInt(p_width * parseInt(prc.split(";")[1]) / 100 - left);
            if (left + width > p_width) {
                width = p_width - left;
            }
            $(".jslider-value").css("margin-left", "-13.5px");
        }
        if (left <= 1) {
            $(".jslider-bg .s_l_p>span").hide();
        } else {
            $(".jslider-bg .s_l_p>span").show();
            $(".jslider-bg .sp .s_l").selectmenu("option", "width", left);
        }
        if (left + width >= p_width - 1) {
            $(".jslider-bg .s_r_p>span").hide();
        } else {
            $(".jslider-bg .s_r_p>span").show();
            $(".jslider-bg .sp .s_r").selectmenu("option", "width", p_width - left - width);
        }
        if (width == 0) {
            $(".jslider-bg .s_v_p>span").hide();
        } else {
            $(".jslider-bg .s_v_p>span").show();
            $(".jslider-bg .sp .s_v").selectmenu("option", "width", width);
        }
    }
    function init_ax() {
        var page = 3;
        init_activex_new("#live", page, 1, function () {
            if (g_style_time == "old" || g_style_time == "hrzx") {
                $("#ivs_parameter").css("visibility", "visible");
            } else {
                $("#set_par_td").remove();
            }
            activex_play_new(0, 0);
        });
    }
    function init_jslider() {
        $("#led_time").jslider({
            from: 0,
            to: 1440,
            step: 15,
            dimension: '',
            scale: ['00:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'],
            limits: false,
            calculate: function (value) {
                var hours = Math.floor(value / 60);
                var mins = (value - hours * 60);
                return (hours < 10 ? "0" + hours : hours) + ":" + (mins == 0 ? "00" : mins);
            },
            onstatechange: function () {
                init_select_width();
            }
        });
    }
    function get_board() {
        var ajaxdata = g_hwinfo.split("^");
        var oem = ajaxdata[4].split('.');
        if (oem[0] == "04") {
            $(".var_tabs_sp > p").css({
                "background": "#1775f3",
                "color": "#fff"
            });
            $(".bg").css({
                "background": "#cfcfcf",
                "color": "#333333"
            });
            $(".img_right p").css({
                "background": "#1775f3",
                "color": "#fff"
            });
            $("#img_left span").css({
                "background": "#1775f3",
                "color": "#fff"
            });
            $("#debug_hint").css("background", "#a9a9a9");
        }
    }
    function light_change() {
        var light = parseInt($("#light_sel").select_val());
        if (light == 3) {
            ele_change(1, "led_time_tr");
        } else {
            ele_change(0, "led_time_tr");
        }
        new_set_led_cfg();
    }
    function del_coil() {
        $("#set_rule").removeAttr("disabled").removeClass("ui-state-disabled");
        if (g_coil_data['body']['virtualloop']['virtualloop_num'] == 0) {
            g_coil_data.body.virtualloop.loop = []
            var loop = {}
            loop.enable = false
            loop.point = []
            g_coil_data.body.virtualloop.loop.push(loop)
            g_coil_data['body']['virtualloop']['virtualloop_num'] == 1
        }
        var coil_point = g_coil_data.body.virtualloop.loop[0].point;
        var val = $(this).attr("state");
        if (val == "delete") {
            $(this).val($.i18n.prop("create_virtual_coil")).attr("state", "create");
            coil_point.splice(0, coil_point.length);
            g_coil_data.body.virtualloop.loop[0].enable = false;
            g_coil_data.body.virtualloop.virtualloop_num = 0;
            $("#canvas_container .coil").remove();
            draw_area();
        } else {
            check_img_mode();
            $(this).val($.i18n.prop("delete_virtual_coil")).attr("state", "delete");
            coil_point.splice(0, coil_point.length);
            for (var i = 0; i < default_coil.length; i++) {
                coil_point.push(default_coil[i]);
            }
            g_coil_data.body.virtualloop.loop[0].enable = true;
            g_coil_data.body.virtualloop.virtualloop_num = 1;
            prase_coil(JSON.stringify(g_coil_data));
            draw_area();
        }
    }
    function del_area() {
        $("#set_rule").removeAttr("disabled").removeClass("ui-state-disabled");
        if (g_area_data['body']['recognition_area']['polygon_num'] == 0) {
            g_area_data.body.recognition_area.polygon = []
            var polygon = {}
            polygon.enable = false
            polygon.point = []
            g_area_data.body.recognition_area.polygon.push(polygon)
            g_area_data['body']['recognition_area']['polygon_num'] == 1
        }
        var area_point = g_area_data.body.recognition_area.polygon[0].point;
        var val = $(this).attr("state");
        if (val == "delete") {
            $(this).val($.i18n.prop("create_identification_area")).attr("state", "create");
            area_point.splice(0, area_point.length);
            g_area_data.body.recognition_area.polygon[0].enable = false;
            g_area_data.body.recognition_area.polygon_num = 0;
            $("#canvas_container .area").remove();
            draw_area();
        } else {
            check_img_mode();
            $(this).val($.i18n.prop("delete_identified_area")).attr("state", "delete");
            area_point.splice(0, area_point.length);
            for (var i = 0; i < default_area.length; i++) {
                area_point.push(default_area[i]);
            }
            g_area_data.body.recognition_area.polygon[0].enable = true;
            g_area_data.body.recognition_area.polygon_num = 1;
            prase_area(JSON.stringify(g_area_data));
            draw_area();
        }
    }
    function set_rule() {
        if (g_authority == 2) {
            show_informer_text($.i18n.prop("save_failed"));
            return;
        }
        $(this).attr("disabled", "disabled").addClass("ui-state-disabled");
        set_coil();
        set_area();
        var save_timer = setInterval(function () {
            if (area_state != 0 && coil_state != 0) {
                clearInterval(save_timer);
                if (coil_state == 1 && area_state == 1) {
                    show_informer($.i18n.prop("save_success"));
                } else if (coil_state == 1 && area_state == 2) {
                    show_informer_text($.i18n.prop("area_save_failed"));
                } else if (coil_state == 2 && area_state == 1) {
                    show_informer_text($.i18n.prop("coil_save_failed"));
                } else {
                    show_informer_text($.i18n.prop("save_failed"));
                }
                area_state = 0;
                coil_state = 0;
            }
        }, 100);
    }
    function trigger_click() {    //手动触发
        $(this).attr("disabled", "disabled");
        var dis_timer = setTimeout(function () {
            clearTimeout(dis_timer);
            $("#trigger_btn").removeAttr("disabled");
        }, 500);
        trigger();
    }
    function set_auth(callback) {
        var cfg = {};
        cfg.type = "get_user_auth";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            url: "getauth.php",
            type: "POST",
            data: jsonstr,
            timeout: 5000,
            error: function () {
                set_auth();
            },
            success: function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    var auth = json.body.authority;
                    g_authority = auth;
                    if (auth == 0) //管理员
                    {
                        $("#tabs .nav .install a").click();
                    } else if (auth == 1) //操作员
                    {
                        $("#tabs .nav .install a").click();
                    } else //观察员
                    {
                        $("#cfg_container").remove();
                        $(".observer").remove();
                    }
                }
            }
        })
    }

    //获取识别参数
    function geteventruleexhtm() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 0
        cfg.body.type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var cross_direction = res.body.param.vehicle_inoutlet_event.cross_direction
            g_direction = cross_direction;
            $("#direction_sel").select_val(cross_direction);
            if (g_area_data && g_coil_data) {
                draw_area();
            }
        })
    }

    function seteventruleexhtm() {
        var direction = $("#direction_sel").select_val();
        var cfg = {}
        cfg.type = "set_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 65535
        cfg.body.param = {}
        cfg.body.param.vehicle_inoutlet_event = {}
        cfg.body.param.vehicle_inoutlet_event.cross_direction = parseInt(direction)
        post(cfg, function (res) {
            show_informer()
            geteventruleexhtm();
            set_ax_direction(direction);
        })
    }

    // function geteventruleexhtm (flag, callback) {
    //   var senddata = "0";
    //   $.ajax({
    //     type: "POST",
    //     url: "geteventruleexhtm.php",
    //     data: senddata,
    //     success: function (ajaxdata) {
    //       if (precheck(ajaxdata)) {
    //         return false;
    //       }
    //       if ("OK" != ajaxdata.slice(0, 2)) return false;
    //       ajaxdata = ajaxdata.split("\n")[0];
    //       rec_cfg = ajaxdata.split("=")[1];
    //       if (callback) {
    //         callback();
    //       }
    //       if (!flag) {
    //         var datas = rec_cfg.split(":");
    //         $("#direction_sel").select_val(datas[5]);
    //         g_direction = parseInt(datas[5]);
    //         if (g_area_data && g_coil_data) {
    //           draw_area();
    //         }
    //       }
    //     },
    //     dataType: "text"
    //   });
    // }
    //设置识别参数
    // function seteventruleexhtm () {
    //   var direction = $("#direction_sel").select_val();
    //   var senddata = rec_cfg.substring(0, rec_cfg.lastIndexOf(":")) + ":" + direction;
    //   $.ajax({
    //     type: "POST",
    //     url: "seteventruleexhtm.php",
    //     data: senddata,
    //     success: function (ajaxdata) {
    //       default_ajax_handler(ajaxdata);
    //       geteventruleexhtm();
    //       set_ax_direction(direction);
    //     },
    //     dataType: "text"
    //   });
    // }
    function edit_ip() {
        SetNetPort.basis.new_get_netip();
        $(".outerdiv").show();
        $("#ip_innerdiv").show();
    }
    function new_ip_cancel() {
        $(".outerdiv").hide();
        $("#ip_innerdiv").hide();
    }
    function edit_title() {
        Support.get_title();
        $(".outerdiv").show();
        $("#name_innerdiv").show();
    }
    function title_cancel() {
        $(".outerdiv").hide();
        $("#name_innerdiv").hide();
    }
    var get_rec_result_flag = true;
    var online_flag = true;
    var g_direction = 0;
    var enable_fake_plate = 0;
    function init_para() {
        get_rec_result_flag = true;
        online_flag = true;
        go_on = true;
        is_offline = false;
        is_max = false;
        circle_down = false;
        downobj = null;
        old_position = null;
        coil_down = false;
        area_down = false;
        area_state = 0;
        coil_state = 0;
        g_direction = 0;
        enable_fake_plate = 0;
    }
    function set_ax_direction(value) {
        var ax = GetAX("ax");
        if (!ax) return;
        ax.QueryCmd("SetDirection", value, "1", function (data) { });
    }
    function get_distinguish_type() {
        var cmd, len, data;

        cmd = 8;
        data = "0";
        len = data.length;
        var base64 = Base64.encode(data);
        var senddata = cmd + ":" + len + ":" + base64;
        $.ajax({
            type: "POST",
            url: "getivsctrl.php",
            data: senddata,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                var decode = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                decode = decode.split(":");
                decode = Base64.decode(decode[2]);
                decode = parseInt(decode);

                enable_fake_plate = (decode & (1 << 29)) > 0 ? 1 : 0;
                var ax = GetAX("ax");
                if (!ax) return;
                ax.QueryCmd("SetFakePlate", enable_fake_plate, "1", function () { });
            },
            dataType: "text"
        });
    }
    function get_ntp() {
        var cfg = {};
        cfg.type = "ss_get_ntp_cfg";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    var time_str = json.body.enable == 1 ? $.i18n.prop("NTP_time") : $.i18n.prop("local_time");
                    $("#time_mode").html(time_str);
                }
            }
        })
    }
    function setSysTime() {
        g_device_time += 1000;
        var sys_date = new Date(g_device_time);
        var sd = sys_date.format("YYYY-MM-DD hh:mm:ss");
        $("#sysDate").html(sd);
    }
    var systime_timer = null;
    function get_server_datatime() {
        $.get("vb.htm", { getdate: "", gettime: "" }, function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
            var response = ajaxdata.split("\n");
            var msgdate = parse_ajax_data(response[0]);
            msgdate = msgdate.split("-");
            var year = msgdate[0];
            var month = msgdate[1] - 1;
            var date = msgdate[2];
            var msgtime = parse_ajax_data(response[1]);
            msgtime = msgtime.split(":");
            var hours = msgtime[0];
            var minutes = msgtime[1];
            var seconds = msgtime[2];
            var sys_date = new Date(year, month, date, hours, minutes, seconds);
            g_device_time = sys_date.getTime();
            setSysTime();
            if (systime_timer == null) {
                systime_timer = setInterval(setSysTime, 1000);
            }
        });
    }
    function circle_mouseenter(event) {
        var e = event || window.event;
        if (!$(e.target).hasClass('area') || $("#canvas_container .area").length <= 4) {
            return false
        }
        var p_l = $("#video_outer").offset().left;
        var p_t = $("#video_outer").offset().top;
        var x = e.pageX - p_l;
        var y = e.pageY - p_t + 20;
        $("#del_circle").css({ 'left': x, 'top': y }).show();
    }
    function circle_mouseleave() {
        $("#del_circle").hide();
    }

    function zoom_add() {
        if (g_digital_zoom < 2) {
            g_digital_zoom += 0.1
            g_digital_zoom = Math.floor(g_digital_zoom * 100) / 100
            g_digital_zoom = g_digital_zoom > 2 ? 2 : g_digital_zoom
            digital_zoom()
        }
    }
    function zoom_sub() {
        if (g_digital_zoom > 1) {
            g_digital_zoom -= 0.1
            g_digital_zoom = Math.floor(g_digital_zoom * 100) / 100
            g_digital_zoom = g_digital_zoom < 1 ? 1 : g_digital_zoom
            digital_zoom()
        }
    }
    var zoom_timer = null
    function zoom_mousedown() {
        var id = $(this).attr('id')
        if (id == 'zoom_add') {
            zoom_add()
            zoom_timer = setInterval(function () {
                zoom_add()
            }, 300)
        } else {
            zoom_sub()
            zoom_timer = setInterval(function () {
                zoom_sub()
            }, 300)
        }
    }
    function zoom_mouseup() {
        clearInterval(zoom_timer)
    }
    this.init = function () {
        init_para();
        init_ax();
        if (g_style_time == "new") {
            $("#live_tb").css("margin", "0");
            return;
        }
        set_auth();
        get_boardversion_info(g_d_type, g_m_version, g_s_version);
        get_board();
        get_distinguish_type();
        $("#trigger_btn").click(trigger_click);
        online();
        if (!ie.isIE || (is_C3 && is_pdns)) {
            new_get_video_support();
            player = new VideoPlayer()
            player.get_video_src("flvVideo", "video", 1)
            var video_load = false;
            $("#video").load(function () {
                if (is_offline) {
                    is_offline = false;
                }
                if (!video_load) {
                    video_load = true;
                    get_coil();
                    get_area();
                    var ck_timer = setInterval(function () {
                        if (g_area_data && g_coil_data) {
                            clearInterval(ck_timer);
                            draw_area();
                        }
                    }, 100);
                }
            });
            get_rec_result();
        }
        if (g_authority == 2) {
            return;
        }
        init_jslider();
        $(".jslider-pointer").unbind("mouseup");
        $(".jslider-pointer").mouseup(function () {
            new_set_led_cfg();
        });
        led_time_hide();
        SetNetPort.basis.new_get_netip();
        get_device_group();
        get_led_ctrl_prop();
        geteventruleexhtm();
        Support.get_title();
        Support.get_device_info();
        WhiteList.get_white_list_check_method(1);
        init_selectmenu("#direction_sel,#light_sel,#alleyway", 115, 195);
        $("#preinstall_province").selectmenu({
            position: { my: "left top-194", at: "left top", collision: "flipfit" }
        });
        $("#direction_sel").on("selectmenuchange", function () {
            // geteventruleexhtm(1, function () {
            seteventruleexhtm();
            // });
        });
        $("#light_sel").on("selectmenuchange", light_change);
        $(".focallength").mousedown(btn_mousedown);
        $(".focallength").mouseup(btn_mouseup);
        $(".focallength").mouseout(btn_mouseup);
        $(".focallength").css("width", "30px");
        $(".ptz").mousedown(ptz_mousedown);
        $(".ptz").mouseup(ptz_mouseup);
        $(".ptz").mouseout(ptz_mouseup);
        $("#fast_focus").click(fast_focus);
        $("#auto_focus").change(function () {
            set_hint();
        });
        $("#edit_ip").click(edit_ip);
        $("#new_ip_cancel").click(new_ip_cancel);
        $("#edit_title").click(edit_title);
        $("#title_cancel").click(title_cancel);
        $("#title_submit").click(function () {
            Support.set_title();
            title_cancel();
        });
        $("#alleyway").on("selectmenuchange", set_device_group);
        $("#big_img").dblclick(function () {
            var _this = $(this);
            showbigimg(".outerdiv", "#innerdiv", "#bigimg", _this);
        });
        $("#new_ip_submit").click(function () {
            SetNetPort.basis.new_set_netip();
            new_ip_cancel();
        });
        get_server_datatime();
        get_ntp();
        $("#edit_time").click(function () {
            $(".sidebar_left").show();
            $(".sidebar_left ul").hide();
            $("#maintain").show();
            $("#content").removeClass("content_no_sidebar");
            $(".nav-sidebar > li > .active").removeClass("active");
            $("#maintain_a").addClass("active");
            $("#set_time a").click();
        });
        $(".zoom_btn").mousedown(zoom_mousedown);
        $(".zoom_btn").mouseup(zoom_mouseup);
        $(".zoom_btn").mouseout(zoom_mouseup);
        if (!ie.isIE || (is_C3 && is_pdns)) {
            $("#focus_btn").click(function () {
                var name = $(this).attr("name");
                if (name == "s") {
                    $(this).attr("name", "z").removeClass("left_icon").addClass("right_icon");
                    $(this).siblings().css("display", "inline-block");
                } else {
                    $(this).attr("name", "s").removeClass("right_icon").addClass("left_icon");
                    $(this).siblings().css("display", "none");
                }
            });
            $("#set_rule").attr("disabled", "disabled").addClass("ui-state-disabled");
            new_get_video_size();
            $("#plate_pos").change(function () {
                var val = $(this).check_val() ? 1 : 0;
                if (val == 1) {
                    $("#best_size").show();
                } else {
                    $("#best_size").hide();
                }
                set_hint();
            });
            $(document).on("mousedown", ".circle", circle_mousedown);
            $(document).on("mouseenter", ".circle", circle_mouseenter);
            $(document).on("mouseleave", ".circle", circle_mouseleave);
            $(document).on("dblclick", ".circle", circle_dblclick);
            $(document).on("mouseup", mouseup);
            $(document).on("mousemove", mousemove);
            // $(document).mouseup(mouseup);
            // $(document).mousemove(function (e) {
            //   mousemove(e);
            // });
            // document.onkeydown = function (e) {
            //   var theEvent = window.event || e;
            //   var code = theEvent.keyCode || theEvent.which;
            //   if (code == 46) {
            //     keydown_del();
            //   }
            // }
            $("#myCanvas").mousedown(canvas_mousedown);
            $("#myCanvas").dblclick(canvas_dblclick);
            $("#del_coil").click(del_coil);
            $("#del_area").click(del_area);
            $("#set_rule").click(function () {
                set_rule(g_authority);
            });
            $(document).on("click", "#rec_tb tbody tr", function () {
                $("#rec_tb tbody .ui-state-active").removeClass("ui-state-active");
                $(this).addClass("ui-state-active");
                var json_str = $(this).attr("data");
                prase_data(JSON.parse(json_str), 1);
            });
            old_width = $("#myCanvas").attr("width");
            old_height = $("#myCanvas").attr("height");
            get_auto_focus_status()
        }
    }
    this.close = function () {
        get_rec_result_flag = false;
        online_flag = false;
        if (!ie.isIE) {
            player.stop_video()
        } else {
            stop_video();
        }
        clearInterval(systime_timer);
        systime_timer = null;
        $(document).off("click", "#rec_tb tbody tr");
        $(document).off("mousedown", ".circle");
        $(document).off("mouseenter", ".circle");
        $(document).off("mouseleave", ".circle");
        $(document).off("dblclick", ".circle");
        $(document).off("mouseup", mouseup);
        $(document).off("mousemove", mousemove);
        clearInterval(zoom_timer)
    }
    close_json["IvsConfig"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//PlatePictureView
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var PlatePictureView = new function () {
    function showbigimg(outerdiv, innerdiv, bigimg, _this) {
        var src = _this.attr("src");
        $("#bigimg").attr("src", src);

        var windowW = $(window).width();
        var windowH = $(window).height();

        var w, h;
        var realWidth = windowW;
        var realHeight = realWidth * 9 / 16;
        if (realHeight > windowH) {
            realWidth = windowH * 16 / 9;
            realHeight = windowH;
        }



        if (realWidth > windowW) {
            realWidth = windowW;
            w = 0;
        }
        else {
            w = (windowW - realWidth) / 2;
        }

        if (realHeight > windowH) {
            realHeight = windowH;
            h = 0;
        }
        else {
            h = (windowH - realHeight) / 2;
        }

        $(bigimg).css("width", realWidth);
        $(bigimg).css("height", realHeight);

        $(innerdiv).css({ "top": h, "left": w });
        $(outerdiv).fadeIn("fast");

        $(outerdiv).dblclick(function () {
            $(this).fadeOut("fast");
        });
    }

    function downloadnow() {
        var src = "/mmc/plate.tar";
        //window.open(src);
        window.location.href = src;
    }

    var g_pic_this = null;

    function showimg(file, type, pic_this, sd_index) {
        var cap = sd_index + "/VzIPCCap/" + file;
        var url_cap = encodeURI(cap);

        if (type == 0)//file
        {
            $("#picture_img").attr("src", url_cap);
            $("#text_content").attr("src", cap);
            if (g_pic_this) {
                g_pic_this.css("background", "");
            }
            pic_this.css("background", "#FFBB77");
            g_pic_this = pic_this;
        }
        else if (type == 1)//directory
        {

        }
        $("#text_content").val(file);
    }

    function get_css_value(e, property) {
        var val = parseInt($(e).css(property).split("px")[0]);
        if (isNaN(val)) val = 0;
        return val;
    }
    function get_boundary(e, with_margin) {
        var padding_top = get_css_value(e, "padding-top");
        var padding_bottom = get_css_value(e, "padding-bottom");
        var padding_left = get_css_value(e, "padding-left");
        var padding_right = get_css_value(e, "padding-right");
        var margin_top = get_css_value(e, "margin-top");
        var margin_bottom = get_css_value(e, "margin-bottom");
        var margin_left = get_css_value(e, "margin-left");
        var margin_right = get_css_value(e, "margin-right");
        var w = padding_left + padding_right;
        var h = padding_top + padding_bottom;
        if (with_margin) {
            w += margin_left + margin_right;
            h += margin_top + margin_bottom;
        }
        return {
            w: w,
            h: h
        };
    }

    function getWindowWidth() {
        if (window.innerWidth) {
            return window.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientWidth != 0) {
            return document.documentElement.clientWidth;
        }
        else if (document.body) {
            return document.body.clientWidth;
        }

        return 0;
    };

    function getWindowHeight() {
        if (window.innerHeight) {
            return window.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight != 0) {
            return document.documentElement.clientHeight;
        }
        else if (document.body) {
            return document.body.clientHeight;
        }

        return 0;
    };

    function get_size_availble() {
        var w = getWindowWidth();
        var h = getWindowHeight();
        var cur_page = get_cur_page();
        var body_boundary = get_boundary("body", true);
        w -= body_boundary.w;
        h -= body_boundary.h;
        return {
            w: w,
            h: h
        };
    }

    function fit_window_size(func_get_size_availble, x_rate, y_rate, side_bar_width, top_bar_height) {
        var body_boundary = get_boundary("body", true);
        var size_availble = func_get_size_availble();

        var min_height = 400;
        var max_height = 720;

        var height = size_availble.h - top_bar_height;
        var width = Math.floor(height / y_rate * x_rate + side_bar_width);
        var window_width = size_availble.w;
        if (g_style_time == "hrzx") {
            window_width = $("#pagecontainer").width() - 140;
        }

        if (width > window_width) {
            width = window_width;
            height = Math.floor((width - side_bar_width) / x_rate * y_rate) + top_bar_height;
        }
        else {
            height += top_bar_height;
        }

        if (height > max_height) {
            height = max_height;
        }
        if (height < min_height) {
            height = min_height;
        }
        width = Math.floor(height / y_rate * x_rate + side_bar_width);

        var pic_left = Math.round((window_width - width + body_boundary.w) / 2);
        var pic_right = pic_left + side_bar_width + 40;
        var side_right = pic_left;

        if (pic_left < 0) {
            pic_right = 2 * pic_left + side_bar_width + 40;
            side_right = 2 * pic_left;
            pic_left = 0;
        }

        if ($("#picture").height() != height) {
            $("#picture").height(height);
        }
        $("#picture").width(height * 16 / 9);
        if ($("#picside").height() != height) {
            $("#picside").height(height);
        }

        var up_height;
        if (g_style_time == "old") {
            up_height = 228;
        }
        else {
            up_height = 245;
        }
        var file_tree_height = height - up_height;
        if ($("#myfileTree").height() != file_tree_height) {
            $("#myfileTree").height(file_tree_height);
        }
    }

    function update_download_state(state) {
        if (state == "download") {
            $("#download").val($.i18n.prop("download")).attr("state", "download");
        } else if (state == "stop") {
            $("#download").val($.i18n.prop("stop")).attr("state", "stop");
        }
    }
    function init_window_size() {
        var x_rate = 16;
        var y_rate = 9;
        window.onresize = function () {
            fit_window_size(get_size_availble, x_rate, y_rate, 400, 0);
        };
        window.onresize();
    }
    function get_device_info() {
        var plate = $("#plate").val();
        var start_time = $("#start_time").val();
        var end_time = $("#end_time").val();
        var cfg = {};
        cfg.type = "get_diskinfo";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: 'POST',
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                var dev_arr = json.body;
                var index = 3;
                if (dev_arr) {
                    for (var i = 0; i < dev_arr.length; i++) {
                        var dev_parts = dev_arr[i].devparts;
                        for (var j = 0; j < dev_parts.length; j++) {
                            var num = dev_parts[j].partstate;
                            if (num != 5) {
                                index = 1;
                            }
                        }
                    }
                } else {
                    index = 1;
                }
                $('#myfileTree').fileTree({ "plate": plate, "start_time": start_time, "end_time": end_time, "start_img": start_img, "sd_index": index, "search_num": 1000 }, function (file, type, pic_this, sd_index) {
                    showimg(file, type, pic_this, sd_index);
                });
            }
        })
    }
    var start_img = null;
    function search() {
        var plate = $("#plate").val();
        var start_time = $("#start_time").val();
        var end_time = $("#end_time").val();
        var r_start_time = start_time;
        var r_end_time = end_time;
        var s_t = new Date(r_start_time.replace(/_/g, "/")).getTime();
        var e_t = new Date(r_end_time.replace(/_/g, "/")).getTime();
        if (s_t > e_t) {
            show_informer_text($.i18n.prop('start_time_cannot_exceed_end_time'));
            return;
        }
        get_device_info();
    }
    function init_time() {
        var data = new Date();
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = data.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var s_t = year + "_" + month + "_" + day + " 00:00:00";
        var e_t = year + "_" + month + "_" + day + " 23:59:59";
        $("#start_time").val(s_t);
        $("#end_time").val(e_t);
    }
    var status_timer_by_id = null;
    var status_timer = null;
    function get_download_status() {
        var ax = GetAX("ax");
        if (!ax) return;
        status_timer = setInterval(function () {
            ax.QueryCmd("QueryAllDownloadStatus", "", "1", function (data) {
                var json = JSON.parse(data);
                var finished = json.finished;
                var total_count = json.total_count;
                var success_count = json.success_count;
                var failed_count = json.failed_count;
                $("#download_status").html($.i18n.prop('total') + " " + total_count + "," + $.i18n.prop("download_success") + " " + success_count + "," + $.i18n.prop("download_failed") + " " + failed_count);
                if (finished) {
                    downloading_all = false;
                    clearInterval(status_timer);
                    update_download_state("download");
                }
            });
        }, 1000);
    }
    function get_download_status_by_id(id) {
        var ax = GetAX("ax");
        if (!ax) return;
        status_timer_by_id = setInterval(function () {
            var cfg = {};
            cfg.id = id;
            var jsonstr = JSON.stringify(cfg);
            ax.QueryCmd("QueryDownloadStatusByID", jsonstr, "1", function (data) {
                var json = JSON.parse(data);
                var status = json.stauts;
                var str = "";
                if (status == 0) {
                    str = $.i18n.prop("download_failed");
                } else if (status == 1) {
                    str = $.i18n.prop("download_success");
                }
                $("#download_status").html(str);
                clearInterval(status_timer_by_id);
                downloading_all = false;
                update_download_state("download");
            });
        }, 1000);
    }
    var downloading_all = false;
    function download() {
        if (downloading_all) {
            return;
        }
        var text_content = $("#text_content").val();
        var rec_id = 0;
        $("#download_status").html($.i18n.prop('downloading'));
        downloading_all = true;
        var json = {};
        var check_arr = [];
        var folder_name = "";
        if (text_content.indexOf("/") != -1) {
            var src = $("#text_content").attr("src");
            folder_name = text_content.split("/")[0];
            rec_id = 1;
            var name = Base64.encode(src, true);
            var json = {};
            json.id = rec_id;
            json.imgName = name;
            check_arr.push(json);
        } else {
            folder_name = text_content;
            var num = 10;
            $("#myfileTree > ul > li > a[rel='" + text_content + "']").siblings("ul").each(function () {
                $(this).find("a").each(function () {
                    var sd_index = $(this).attr("sd_index");
                    num++;
                    var name = Base64.encode(sd_index + "/VzIPCCap/" + $(this).attr("rel"), true);
                    var json = {};
                    json.id = num;
                    json.imgName = name;
                    check_arr.push(json);
                });
            })
        }
        if (check_arr.length == 0) {
            show_informer_text($.i18n.prop('select_download_img'));
            return;
        }
        var ax = GetAX("ax");
        if (!ax) return;
        var req = {};
        req.img_ids = check_arr;
        req.folder_name = folder_name;
        var encoded = $.toJSON(req);
        ax.QueryCmd("PlateImgDownload", encoded, "1", function (response_data) {
            if (response_data == "OK") {
                if (!rec_id) {
                    get_download_status();
                } else {
                    get_download_status_by_id(parseInt(rec_id));
                }
            } else {
                downloading_all = false;
                update_download_state("download");
                $("#download_status").html("");
            }
        });
    }
    function download_click() {
        var text_content = $("#text_content").val();
        if (text_content == "") {
            show_informer_text($.i18n.prop('select_download_img'));
            return;
        }
        var val = $(this).attr("state");
        if (val == "download") {
            if (!ie.isIE) {
                show_informer_text($.i18n.prop('use_Internet_explorer'));
                return;
            }
            download();
            update_download_state("stop");
        } else if (val == "stop") {
            downloading_all = false;
            clearInterval(status_timer);
            clearInterval(status_timer_by_id);
            update_download_state("download");
            var ax = GetAX("ax");
            if (!ax) return;
            ax.QueryCmd("StopImgDownload", "", "1", function (response_data) { });
        }
    }
    this.init = function () {
        downloading_all = false;
        status_timer_by_id = null;
        status_timer = null;
        init_activex_new("#live", 5, 0);
        init_window_size();
        $("#picture_img").dblclick(function () {
            var _this = $(this);
            showbigimg("#outerdiv", "#innerdiv", "#bigimg", _this);
        });
        init_time();
        $("#search").click(function () {
            $("#text_content").val("");
            search();
            $(this).attr("disabled", "disabled");
            var search_btn_dis = setTimeout(function () {
                $("#search").removeAttr("disabled");
                clearTimeout(search_btn_dis);
            }, 1000);
        });
        $("#download").click(download_click);
    }
    this.close = function () {
        clearInterval(status_timer);
        clearInterval(status_timer_by_id);
        stop_video();
    }
    close_json["PlatePictureView"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetAlarm
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
// var SetAlarm = new function () {
//   var g_gpio = null;
//   function evs_get_gpioin () {
//     var cfg = {};
//     cfg.type = "evs_get_gpioin_func";
//     cfg.module = "EVS_BUS_REQUEST";
//     post(cfg, function (jsondata) {
//       g_gpio = jsondata.body;
//       for (var i = 0; i < g_gpio.length; i++) {
//         if (g_gpio[i].is_enable == 1) {
//           if (g_gpio[i].msg_module == 'PS_TALK_REQUESTION') {
//             $("#out_io" + (g_gpio[i].source + 1)).check_disabled(true);
//           }
//         }
//       }
//     })
//   }
//   this.new_get_video_support = function () {
//     var cfg = {};
//     cfg.type = "AVS_GET_ALG_RESULT_PROP";

//     var jsonstr = JSON.stringify(cfg);
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       dateType: "text",
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         var jsondata = eval("(" + ajaxdata + ")");
//         jsondata = jsondata.body;
//         var snap_resolution = jsondata.snap_resolution.types;
//         var size_text = "";
//         for (var i = 0; i < snap_resolution.length; i++) {
//           size_text += "<option value=\"" + snap_resolution[i].type + "\">" + snap_resolution[i].content + "</option>";
//         }
//         $("#img_size").html(size_text);
//         init_selectmenu("#img_size", 200, 150);
//         var province = jsondata.province.types;
//         var arr = [];
//         for (var i = 0; i < province.length; i++) {
//           arr[i] = Base64.decode(province[i].content, true) + "-" + province[i].type;
//         }
//         arr.sort(function (strA, strB) {
//           return strA.localeCompare(strB);
//         });
//         var strz = "";
//         var option_str = "<option value='-1'>无</option>";
//         for (var i = 0; i < arr.length; i++) {
//           if (i == 0) {
//             strz += "<option value='" + arr[i].split("-")[1] + "'>" + arr[i].split("-")[0] + "</option>";
//           } else {
//             option_str += "<option value='" + arr[i].split("-")[1] + "'>" + arr[i].split("-")[0] + "</option>";
//           }
//         }
//         option_str += strz;
//         $("#preinstall_province").html(option_str);
//         init_selectmenu("#preinstall_province", 115, 195, function () {
//           SetAlarm.set_size_and_res();
//         });
//         SetAlarm.get_size_and_res();
//       }
//     });
//   }

//   this.get_size_and_res = function () {
//     var cfg = {};
//     cfg.type = "AVS_GET_ALG_RESULT_PARAM";

//     var jsonstr = JSON.stringify(cfg);
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       dateType: "text",
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         var jsondata = eval("(" + ajaxdata + ")");
//         jsondata = jsondata.body;
//         var snap_resolution = jsondata.snap_resolution;
//         var snap_image_quality = jsondata.snap_image_quality;
//         var province = jsondata.province;
//         var fake_threshold = jsondata.fake_threshold;
//         var result_delay = jsondata.result_delay;
//         $("#centerserver_image_quality").select_val(snap_image_quality);
//         $("#img_size").select_val(snap_resolution);
//         $("#preinstall_province").select_val(province);
//         $("#fake_threshold").select_val(fake_threshold);
//         $("#result_delay").val(result_delay);
//       }
//     });
//   }

//   this.set_size_and_res = function () {
//     var snap_image_quality = parseInt($("#centerserver_image_quality").select_val());
//     var snap_resolution = parseInt($("#img_size").select_val());
//     var province = parseInt($("#preinstall_province").select_val());
//     var fake_threshold = parseInt($("#fake_threshold").select_val());
//     var cfg = {};
//     cfg.type = "AVS_SET_ALG_RESULT_PARAM";
//     cfg.body = {};
//     if (!isNaN(snap_resolution)) {
//       cfg.body.snap_resolution = snap_resolution;
//     }
//     if (!isNaN(snap_image_quality)) {
//       cfg.body.snap_image_quality = snap_image_quality;
//     }
//     if (!isNaN(province)) {
//       cfg.body.province = province;
//     }
//     if (!isNaN(fake_threshold)) {
//       cfg.body.fake_threshold = fake_threshold;
//     }
//     if (g_d_type == 3 && g_m_version == 8) {
//       var result_delay = parseInt($("#result_delay").select_val());
//       if (isNaN(result_delay) || result_delay < 0 || result_delay > 5000) {
//         show_informer_text($.i18n.prop("range") + " 0~5000");
//         return;
//       }
//       if (!isNaN(result_delay)) {
//         cfg.body.result_delay = result_delay;
//       }
//     }
//     var jsonstr = JSON.stringify(cfg);
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       dateType: "text",
//       success: function (ajaxdata) {
//         var jsondata = eval("(" + ajaxdata + ")");
//         if (jsondata.state == 200) {
//           show_informer();
//         }
//       }
//     });
//   }
//   var g_platefilter = null;
//   //获取输出类型
//   function get_platefiltermode () {
//     var cmd, len, data;

//     cmd = 4;
//     data = "0";
//     len = data.length;
//     var base64 = Base64.encode(data);
//     var senddata = cmd + ":" + len + ":" + base64;
//     $.ajax({
//       type: "POST",
//       url: "getivsctrl.php",
//       data: senddata,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         if ("OK" != ajaxdata.slice(0, 2)) return false;
//         var decode = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
//         decode = decode.split(":");
//         decode = Base64.decode(decode[2]);
//         decode = parseInt(decode);
//         g_platefilter = decode;
//         var mask = 0x1;

//         var bOutStable = decode & mask;
//         var bOutVloop = decode & (mask << 1);
//         var bOutIo1 = decode & (mask << 4);
//         var bOutIo2 = decode & (mask << 5);
//         var bOutIo3 = decode & (mask << 6);
//         var bOutIo4 = decode & (mask << 7);

//         $("#stable").check_val(bOutStable > 0);
//         $("#vloop").check_val(bOutVloop > 0);
//         $("#out_io1").check_val(bOutIo1 > 0);
//         $("#out_io2").check_val(bOutIo2 > 0);
//         $("#out_io3").check_val(bOutIo3 > 0);
//         $("#out_io4").check_val(bOutIo4 > 0);
//         if (bOutIo1 > 0) {
//           $("#talk_out_io1").check_disabled(true);
//         }
//         if (bOutIo2 > 0) {
//           $("#talk_out_io2").check_disabled(true);
//         }
//         if (bOutIo3 > 0) {
//           $("#talk_out_io3").check_disabled(true);
//         }
//         if (bOutIo4 > 0) {
//           $("#talk_out_io4").check_disabled(true);
//         }
//       },
//       dataType: "text"
//     });
//   }
//   //设置输出类型
//   function set_platefiltermode () {
//     var cmd, len, data;
//     cmd = 5;
//     var bOutStable = $("#stable").check_val() ? "1" : "0";
//     var bOutVloop = $("#vloop").check_val() ? "1" : "0";
//     var bOutIo1 = $("#out_io1").check_val() ? "1" : "0";
//     var bOutIo2 = $("#out_io2").check_val() ? "1" : "0";
//     var bOutIo3 = $("#out_io3").check_val() ? "1" : "0";
//     var bOutIo4 = $("#out_io4").check_val() ? "1" : "0";
//     var platefilter = parseInt(bOutStable) | (parseInt(bOutVloop) << 1) | (parseInt(bOutIo1) << 4) | (parseInt(bOutIo2) << 5) | (parseInt(bOutIo3) << 6) | (parseInt(bOutIo4) << 7);

//     if (g_platefilter == platefilter) {
//       return false;
//     }

//     data = platefilter.toString();
//     len = data.length;
//     var base64 = Base64.encode(data);
//     var senddata = cmd + ":" + len + ":" + base64;

//     var data = cmd + ":" + len + ":" + base64;
//     $.ajax({
//       type: "POST",
//       url: "ivsctrl.php",
//       data: senddata,
//       success: function (ajaxdata) {
//         default_ajax_handler(ajaxdata);
//         g_platefilter = platefilter;
//         get_platefiltermode();
//       },
//       dataType: "text"
//     });
//   }

//   var g_distinguish_type = 0;
//   //获取识别类型
//   function get_distinguish_type () {
//     var cmd, len, data;

//     cmd = 8;
//     data = "0";
//     len = data.length;
//     var base64 = Base64.encode(data);
//     var senddata = cmd + ":" + len + ":" + base64;
//     $.ajax({
//       type: "POST",
//       url: "getivsctrl.php",
//       data: senddata,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         if ("OK" != ajaxdata.slice(0, 2)) return false;
//         var decode = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
//         decode = decode.split(":");
//         decode = Base64.decode(decode[2]);
//         decode = parseInt(decode);
//         g_distinguish_type = decode;

//         $("#blue").check_val((decode & (1 << 1)) > 0);
//         $("#yellow").check_val(((decode & (1 << 3)) || (decode & (1 << 4))) > 0);
//         $("#black").check_val((decode & (1 << 2)) > 0);
//         $("#coach").check_val((decode & (1 << 13)) > 0);
//         $("#police").check_val((decode & (1 << 5)) > 0);
//         $("#armpol").check_val(((decode & (1 << 6)) || (decode & (1 << 15))) > 0);
//         $("#army").check_val(((decode & (1 << 8)) || (decode & (1 << 9))) > 0);
//         $("#hongkongmacao").check_val(((decode & (1 << 11)) || (decode & (1 << 14))) > 0);
//         $("#embassy").check_val((decode & (1 << 10)) > 0);
//         $("#ca").check_val((decode & (1 << 18)) > 0);
//         $("#newEnergy").check_val(((decode & (1 << 19)) > 0) || ((decode & (1 << 20)) > 0));
//         $("#emergency").check_val((decode & (1 << 21)) != 0);
//         $("#consulate").check_val((decode & (1 << 22)) != 0);
//         $("#new_small_car").check_val((decode & (1 << 23)) != 0);
//         $("#airport").check_val((decode & (1 << 25)) != 0);
//         $("#unlicensed_car_triggered").check_val((decode & (1 << 31)) != 0);
//         $("#license_anti_counterfeit").check_val((decode & (1 << 29)) != 0);
//         var enable = (decode & (1 << 29)) != 0 ? 1 : 0;
//         ele_change(enable, "anti_disabled");
//       },
//       dataType: "text"
//     });
//   }
//   //设置识别类型
//   function set_distinguish_type () {
//     var cmd, len, data;
//     cmd = 7;
//     var distinguish_type = 0;
//     if ($("#blue").check_val()) {
//       distinguish_type = distinguish_type | (1 << 1);
//     }
//     if ($("#yellow").check_val()) {
//       distinguish_type = distinguish_type | (1 << 3);
//       distinguish_type = distinguish_type | (1 << 4);
//     }
//     if ($("#black").check_val()) {
//       distinguish_type = distinguish_type | (1 << 2);
//     }
//     if ($("#coach").check_val()) {
//       distinguish_type = distinguish_type | (1 << 13);
//     }
//     if ($("#police").check_val()) {
//       distinguish_type = distinguish_type | (1 << 5);
//     }
//     if ($("#armpol").check_val()) {
//       distinguish_type = distinguish_type | (1 << 6);
//       distinguish_type = distinguish_type | (1 << 15);
//     }
//     if ($("#army").check_val()) {
//       distinguish_type = distinguish_type | (1 << 8);
//       distinguish_type = distinguish_type | (1 << 9);
//     }
//     if ($("#hongkongmacao").check_val()) {
//       distinguish_type = distinguish_type | (1 << 11);
//       distinguish_type = distinguish_type | (1 << 14);
//     }
//     if ($("#embassy").check_val()) {
//       distinguish_type = distinguish_type | (1 << 10);
//     }
//     if ($("#ca").check_val()) {
//       distinguish_type = distinguish_type | (1 << 18);
//     }
//     if ($("#newEnergy").check_val()) {
//       distinguish_type = distinguish_type | (1 << 19);
//       distinguish_type = distinguish_type | (1 << 20);
//     }
//     if ($("#emergency").check_val()) {
//       distinguish_type = distinguish_type | (1 << 21);
//     }
//     if ($("#consulate").check_val()) {
//       distinguish_type = distinguish_type | (1 << 22);
//     }
//     if ($("#new_small_car").check_val()) {
//       distinguish_type = distinguish_type | (1 << 23);
//     }
//     if ($("#airport").check_val()) {
//       distinguish_type = distinguish_type | (1 << 25);
//     }
//     if ($("#unlicensed_car_triggered").check_val()) {
//       distinguish_type = distinguish_type | (1 << 31);
//     }
//     if ($("#license_anti_counterfeit").check_val()) {
//       distinguish_type = distinguish_type | (1 << 29);
//     }
//     if (g_distinguish_type == distinguish_type) {
//       return false;
//     }

//     data = distinguish_type.toString();
//     len = data.length;
//     var base64 = Base64.encode(data);
//     var senddata = cmd + ":" + len + ":" + base64;

//     var data = cmd + ":" + len + ":" + base64;
//     $.ajax({
//       type: "POST",
//       url: "ivsctrl.php",
//       data: senddata,
//       success: function (ajaxdata) {
//         default_ajax_handler(ajaxdata);
//         g_distinguish_type = distinguish_type;
//         get_distinguish_type();
//       },
//       dataType: "text"
//     });
//   }
//   function get_car_info_support () {
//     var cfg = {}
//     cfg.type = 'get_car_info_support'
//     var jsonstr = JSON.stringify(cfg)
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         var res = eval("(" + ajaxdata + ")");
//         var body = res.body
//         var car_brand_support = body.car_brand_support
//         var car_type_support = body.car_type_support
//         var car_color_support = body.car_color_support
//         $("#output_car_logo_car_style").check_val(car_brand_support == 1);
//         $("#identify_vehicle_type").check_val(car_type_support == 1);
//         $("#identify_body_color").check_val(car_color_support == 1);
//       }
//     });
//   }
//   function set_car_info_support () {
//     var car_brand_support = $("#output_car_logo_car_style").check_val() ? 1 : 0
//     var car_type_support = $("#identify_vehicle_type").check_val() ? 1 : 0
//     var car_color_support = $("#identify_body_color").check_val() ? 1 : 0
//     var cfg = {}
//     cfg.type = "set_car_info_support"
//     cfg.body = {}
//     cfg.body.car_brand_support = car_brand_support
//     cfg.body.car_type_support = car_type_support
//     cfg.body.car_color_support = car_color_support
//     var jsonstr = JSON.stringify(cfg)
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         var res = eval("(" + ajaxdata + ")");
//         if (res.state == 200) {
//           show_informer();
//           get_car_info_support();
//         }
//       }
//     });
//   }
//   var coil_enable = "1";
//   var area_enable = "1";
//   var plate_width_s;
//   var plate_width_l;
//   var trigger_interval_time;
//   var direction;
//   var trigger_delay;
//   var enable = 0;
//   //获取识别参数
//   function geteventruleexhtm () {
//     var senddata = "0";
//     $.ajax({
//       type: "POST",
//       url: "geteventruleexhtm.php",
//       data: senddata,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         if ("OK" != ajaxdata.slice(0, 2)) return false;
//         ajaxdata = ajaxdata.split("\n")[0];
//         ajaxdata = ajaxdata.split("=")[1];
//         var datas = ajaxdata.split(":");

//         enable = datas[0];
//         if (enable == 0) {
//           $(".coil_tr").hide();
//         } else {
//           $(".coil_tr").show();
//         }
//         plate_width_s = datas[2];
//         plate_width_l = datas[3];
//         trigger_interval_time = datas[4];
//         direction = datas[5];
//         $("#plate_width_s").val(plate_width_s);
//         $("#plate_width_l").val(plate_width_l);
//         $("#trigger_interval_time").val(trigger_interval_time);
//         // $("#direction_sel").select_val(datas[5]);
//       },
//       dataType: "text"
//     });
//   }
//   //设置识别参数
//   function seteventruleexhtm () {
//     var pw_s = parseInt($("#plate_width_s").val());
//     var pw_l = parseInt($("#plate_width_l").val());
//     // direction = $("#direction_sel").select_val();
//     var ti_time = parseInt($("#trigger_interval_time").val());
//     if (isNaN(ti_time) || ti_time < 1 || ti_time > 255) {
//       show_informer_text($.i18n.prop("same_license_hint") + " 1~255");
//       $("#trigger_interval_time").val(trigger_interval_time);
//       return;
//     }
//     if (isNaN(pw_s) || isNaN(pw_l) || pw_s < 45 || pw_s > 600 || pw_l < 45 || pw_l > 600) {
//       show_informer_text($.i18n.prop("license_width_hint") + " 45~600");
//       $("#plate_width_s").val(plate_width_s);
//       $("#plate_width_l").val(plate_width_l);
//       return;
//     }
//     if (pw_l < pw_s) {
//       show_informer_text($.i18n.prop("license_width_max_min"));
//       $("#plate_width_s").val(plate_width_s);
//       $("#plate_width_l").val(plate_width_l);
//       return;
//     }
//     var senddata = coil_enable + ":" + area_enable + ":" + pw_s + ":" + pw_l + ":" + ti_time + ":" + direction;
//     $.ajax({
//       type: "POST",
//       url: "seteventruleexhtm.php",
//       data: senddata,
//       success: function (ajaxdata) {
//         default_ajax_handler(ajaxdata);
//         geteventruleexhtm();
//       },
//       dataType: "text"
//     });
//   }
//   var g_duration = 60;
//   var g_none_duration = 10;
//   var g_max_duration = 60;
//   function get_capture_prm () {
//     var cfg = {};
//     cfg.type = "AVS_GET_CAPTURE_PRM";
//     var jsonstr = JSON.stringify(cfg);
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         var jsondata = eval("(" + ajaxdata + ")");
//         jsondata = jsondata.body;
//         var mode = jsondata.mode;
//         hide_option(mode);
//         g_duration = jsondata.duration;
//         g_none_duration = jsondata.none_duration;
//         g_max_duration = jsondata.max_duration;
//         $("#capture_mode").select_val(mode);
//         $("#capture_duration").val(g_duration);
//         $("#none_duration").val(g_none_duration);
//         $("#max_duration").val(g_max_duration);
//       },
//       dataType: "text"
//     });
//   }
//   function set_capture_prm () {
//     var mode = parseInt($("#capture_mode").select_val());
//     var duration = parseInt($("#capture_duration").val());
//     var none_duration = parseInt($("#none_duration").val());
//     var max_duration = parseInt($("#max_duration").val());
//     if (isNaN(duration) || duration < 3 || duration > 600) {
//       $("#capture_duration").val(g_duration);
//       duration = g_duration;
//     }
//     if (isNaN(none_duration) || none_duration < 3 || none_duration > 600) {
//       $("#none_duration").val(g_none_duration);
//       none_duration = g_none_duration;
//     }
//     if (isNaN(max_duration) || max_duration < 30 || max_duration > 600) {
//       $("#max_duration").val(g_max_duration);
//       max_duration = g_max_duration;
//     }
//     var cfg = {};
//     cfg.type = "AVS_SET_CAPTURE_PRM";
//     cfg.body = {};
//     cfg.body.mode = mode;
//     cfg.body.duration = duration;
//     cfg.body.none_duration = none_duration;
//     cfg.body.max_duration = max_duration;
//     var jsonstr = JSON.stringify(cfg);
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       success: function (ajaxdata) {
//         var jsondata = eval("(" + ajaxdata + ")");
//         if (jsondata.state == 200) {
//           show_informer();
//           get_capture_prm();
//         }
//       },
//       dataType: "text"
//     });
//   }
//   function get_boardversion_info (type, m_version, s_version) {
//     get_device_capacity(function () {
//       if (m_version == 8) {
//         $(".overseas_remove_module").remove();
//         init_duration();
//       } else if (m_version == 9) {
//         $(".overseas_show_module").remove();
//         get_distinguish_type();
//         init_duration();
//       } else {
//         $(".overseas_show_module").remove();
//         get_distinguish_type();
//         init_duration();
//       }
//       if (m_version == 9) {
//         $(".cpro_disabled").hide();
//       }
//       if (is_C3) {  ////c3隐藏
//         $("#C3_hide_body_color").hide();
//       }
//       if (is_C3A) {
//         $(".c3a_hide").hide()
//       }
//     });
//   }
//   function hide_option (val) {
//     if (val == 0) {
//       $(".other_option").hide();
//       $(".trigger_coil_option").hide();
//     } else if (val == 3) {
//       $(".trigger_coil_option").show();
//       $(".other_option").show();
//     } else {
//       $(".other_option").show();
//       $(".trigger_coil_option").hide();
//     }
//   }
//   function init_duration () {
//     init_selectmenu("#capture_mode", 200, 150, function (e, o) {
//       var val = parseInt(o.value);
//       hide_option(val);
//       set_capture_prm();
//     });
//     $("#capture_duration").change(function () {
//       set_capture_prm();
//     })
//     $("#none_duration").change(function () {
//       set_capture_prm();
//     })
//     $("#max_duration").change(function () {
//       set_capture_prm();
//     })
//     get_capture_prm();
//   }
//   function get_filtfakeplate () {
//     $.get('vb.htm?paratest=filtfakeplate', function (ajaxdata) {
//       if (precheck(ajaxdata)) {
//         return false;
//       }
//       var response = ajaxdata.split("\n");
//       var val = parse_ajax_data(response[0]);
//       if (val == 0) {
//         $("#alarm").check_val(true);
//       } else {
//         $("#filter").check_val(true);
//       }
//     })
//   }
//   function set_filtfakeplate () {
//     var filtfakeplate = 0;
//     if ($("#filter").check_val()) {
//       filtfakeplate = 1
//     }
//     $.get('vb.htm?filtfakeplate=' + filtfakeplate, function (ajaxdata) {
//       default_ajax_handler(ajaxdata);
//     })
//   }
//   function get_new_energy_plate_support () {
//     var cfg = {};
//     cfg.type = "get_new_energy_plate_support";
//     var jsonstr = JSON.stringify(cfg);
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         var jsondata = eval("(" + ajaxdata + ")");
//         jsondata = jsondata.body;
//         var support = jsondata.support;
//         $("#new_energy_plate_support").check_val(support == 1);
//       },
//       dataType: "text"
//     });
//   }
//   function set_new_energy_plate_support () {
//     var support = $("#new_energy_plate_support").check_val() ? 1 : 0;
//     var cfg = {};
//     cfg.type = "set_new_energy_plate_support";
//     cfg.body = {}
//     cfg.body.support = support;
//     var jsonstr = JSON.stringify(cfg);
//     $.ajax({
//       type: "POST",
//       url: "avsjson.php",
//       data: jsonstr,
//       success: function (ajaxdata) {
//         if (precheck(ajaxdata)) {
//           return false;
//         }
//         var jsondata = eval("(" + ajaxdata + ")");
//         if (jsondata.state == 200) {
//           show_informer();
//           get_new_energy_plate_support();
//         }
//       },
//       dataType: "text"
//     });
//   }
//   this.init = function () {
//     get_boardversion_info(g_d_type, g_m_version, g_s_version);
//     init_selectmenu("#direction_sel,#centerserver_image_quality,#preinstall_province", 200, 150);
//     init_selectmenu("#fake_threshold", 100, 150, SetAlarm.set_size_and_res);
//     $(".trigger").change(function () {
//       set_platefiltermode();
//     });
//     $("input[type='text']").css("width", "40px");
//     // $("#direction_sel").on("selectmenuchange", seteventruleexhtm);
//     $("#trigger_interval_time").change(seteventruleexhtm);
//     $("#plate_width_s").change(seteventruleexhtm);
//     $("#plate_width_l").change(seteventruleexhtm);
//     $("#discern_plate input").change(set_distinguish_type);
//     $(".distinguish input[type='checkbox']").change(function () {
//       var enable = $("#license_anti_counterfeit").check_val() ? 1 : 0;
//       ele_change(enable, "anti_disabled");
//       set_distinguish_type();
//     });
//     $(".carinfo input[type='checkbox']").change(function () {
//       set_car_info_support();
//     });
//     $(".distinguish input[type='radio']").change(function () {
//       set_filtfakeplate();
//     });
//     $("#centerserver_image_quality").on("selectmenuchange", SetAlarm.set_size_and_res);
//     $("#img_size").on("selectmenuchange", SetAlarm.set_size_and_res);
//     $("#result_delay").change(SetAlarm.set_size_and_res);
//     $("#new_energy_plate_support").change(set_new_energy_plate_support);
//     evs_get_gpioin();
//     get_platefiltermode();
//     geteventruleexhtm();
//     SetAlarm.new_get_video_support();
//     get_filtfakeplate();
//     get_new_energy_plate_support();
//     get_car_info_support();
//   }
// }
var SetAlarm = new function () {
    function get_alg_prop(callback) {
        var cfg = {}
        cfg.type = "get_alg_prop"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 1
        cfg.body.alg_chn = 0
        post(cfg, function (res) {
            var option_type = ""
            var types = res.body.prop.vehicle_inoutlet_event.continuous_capture.trigger_type.types
            for (var i = 0; i < types.length; i++) {
                option_type += "<option value='" + types[i].type + "'>" + Base64.decode(types[i].content, true) + "</option>"
            }
            $("#capture_mode").html(option_type)

            // var plate_rec_type = res.body.prop.vehicle_inoutlet_event.attr_rec_prm.plate_rec_type
            // var types = plate_rec_type.types
            // var plate_tr = ''
            // var str_num = 0
            // for(var i = 0; i <types.length; i ++){
            //   if(types[i].type !== 0 && types[i].type !== 67108864 && types[i].type !== 134217728){
            //     var td = "<td class='common_width' valign='top'><input type='checkbox' state='" + types[i].type +"' id='" + types[i].type + "'/><label for='" + types[i].type + "'>" +Base64.decode(types[i].content,true)  + "</label></td>"
            //     str_num ++
            //     if(str_num % 4 == 1){
            //       if(plate_tr == ''){
            //         plate_tr += '<tr>'
            //       }else{
            //         plate_tr += '</tr><tr>'
            //       }
            //     }
            //     plate_tr += td
            //   }
            // }
            // plate_tr += '</tr>'
            // $("#discern_plate").html(plate_tr)
            // init_checkbox("#discern_plate input[type='checkbox']")

            var quality_min = res.body.prop.result_prm.image_quality.min
            var quality_max = res.body.prop.result_prm.image_quality.max
            var quality_option = ""
            for (var i = quality_min; i <= quality_max; i += 10) {
                quality_option += "<option value = '" + i + "'>" + i + "%" + "</option>"
            }
            $("#centerserver_image_quality").html(quality_option)
        })

        var vfg = {}
        vfg.type = "get_alg_prop"
        vfg.module = "ALG_REQUEST_MESSAGE"
        vfg.body = {}
        vfg.body.rule_chn = 0
        vfg.body.alg_chn = 0
        vfg.body.alg_prop_type = "result_prm"
        post(vfg, function (res) {
            var snap_option = ""
            var types = res.body.prop.result_prm.image_resolution.types
            for (var i = 0; i < types.length; i++) {
                snap_option += "<option value='" + types[i].type + "'>" + Base64.decode(types[i].content, true) + "</option>"
            }
            $("#img_size").html(snap_option)

            if (callback) {
                callback()
            }
        })

    }
    function evs_get_gpioin() {
        var cfg = {};
        cfg.type = "evs_get_gpioin_func";
        cfg.module = "EVS_BUS_REQUEST";
        post(cfg, function (jsondata) {
            g_gpio = jsondata.body;
            for (var i = 0; i < g_gpio.length; i++) {
                if (g_gpio[i].is_enable == 1) {
                    if (g_gpio[i].msg_module == 'PS_TALK_REQUESTION') {
                        $("#out_io" + (g_gpio[i].source + 1)).check_disabled(true);
                    }
                }
            }
        })
    }
    function get_size_alg_prm() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 0
        cfg.body.type = "result_prm"
        post(cfg, function (res) {
            var result_prm = res.body.param.result_prm
            var image_quality = result_prm.image_quality
            var image_resolution = result_prm.image_resolution
            $("#centerserver_image_quality").select_val(image_quality)
            $("#img_size").select_val(image_resolution)
        })
    }
    function set_size_alg_prm() {
        var image_quality = parseInt($("#centerserver_image_quality").select_val());
        var image_resolution = parseInt($("#img_size").select_val());
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {};
        cfg.body.rule_chn = 65535
        cfg.body.alg_chn = 0
        cfg.body.param = {}
        cfg.body.param.result_prm = {}
        if (!isNaN(image_resolution)) {
            cfg.body.param.result_prm.image_resolution = image_resolution
        }
        if (!isNaN(image_quality)) {
            cfg.body.param.result_prm.image_quality = image_quality
        }
        post(cfg, function (res) {
            show_informer()
            get_size_alg_prm()
        })

    }
    var g_platefilter = null;
    //获取输出类型
    function get_platefiltermode() {
        var cfg = {}
        cfg.type = "get_trigger_mode"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 65535
        // cfg.body.alg_chn = 0
        // cfg.body.type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            // var decode = res.body.param.vehicle_inoutlet_event.trigger_mode
            var decode = res.body.trigger_mode
            g_platefilter = decode;
            var mask = 0x1;
            var bOutVloop = decode & mask;
            var bOutStable = decode & (mask << 1);
            var bOutIo1 = decode & (mask << 4);
            var bOutIo2 = decode & (mask << 5);
            var bOutIo3 = decode & (mask << 6);
            var bOutIo4 = decode & (mask << 7);

            $("#stable").check_val(bOutStable > 0);
            $("#vloop").check_val(bOutVloop > 0);
            $("#out_io1").check_val(bOutIo1 > 0);
            $("#out_io2").check_val(bOutIo2 > 0);
            $("#out_io3").check_val(bOutIo3 > 0);
            $("#out_io4").check_val(bOutIo4 > 0);
            if (bOutIo1 > 0) {
                $("#talk_out_io1").check_disabled(true);
            }
            if (bOutIo2 > 0) {
                $("#talk_out_io2").check_disabled(true);
            }
            if (bOutIo3 > 0) {
                $("#talk_out_io3").check_disabled(true);
            }
            if (bOutIo4 > 0) {
                $("#talk_out_io4").check_disabled(true);
            }
        })
    }
    function set_platefiltermode() {
        var bOutStable = $("#stable").check_val() ? "1" : "0";
        var bOutVloop = $("#vloop").check_val() ? "1" : "0";
        var bOutIo1 = $("#out_io1").check_val() ? "1" : "0";
        var bOutIo2 = $("#out_io2").check_val() ? "1" : "0";
        var bOutIo3 = $("#out_io3").check_val() ? "1" : "0";
        var bOutIo4 = $("#out_io4").check_val() ? "1" : "0";
        var platefilter = parseInt(bOutVloop) | (parseInt(bOutStable) << 1) | (parseInt(bOutIo1) << 4) | (parseInt(bOutIo2) << 5) | (parseInt(bOutIo3) << 6) | (parseInt(bOutIo4) << 7);
        if (g_platefilter == platefilter) {
            return false;
        }
        var cfg = {}
        cfg.type = "set_trigger_mode"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.rule_chn = 65535
        cfg.body = {}
        // cfg.body.alg_chn = 0
        // cfg.body.rule_chn = 65535
        cfg.body.trigger_mode = platefilter
        // cfg.body.param = {}
        // cfg.body.param.vehicle_inoutlet_event = {}
        // cfg.body.param.vehicle_inoutlet_event.trigger_mode = platefilter
        post(cfg, function (res) {
            show_informer()
            get_platefiltermode()
        })
    }
    var g_distinguish_type = 0;
    //获取识别类型
    function get_distinguish_type() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.alg_prm_type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var decode = res.body.param.vehicle_inoutlet_event.attr_rec_prm.plate_rec_type
            g_distinguish_type = decode
            // $("#discern_plate input[type=checkbox]").each(function(){
            //   var state = parseInt($(this).attr("state"));
            //   var val = plate_rec_type & state;
            //   $(this).check_val(val != 0)
            // })
            $("#blue").check_val((decode & 2) > 0);
            $("#yellow").check_val(((decode & 8) || (decode & 16)) > 0);
            $("#black").check_val((decode & 4) > 0);
            $("#coach").check_val((decode & 8192) > 0);
            $("#police").check_val((decode & 32) > 0);
            $("#armpol").check_val(((decode & 64) || (decode & 32768) || (decode & 65536) || (decode & 131072)) > 0)
            $("#army").check_val(((decode & 256) || (decode & 512)) > 0);;
            $("#hongkongmacao").check_val(((decode & 2048) || (decode & 16384)) > 0);
            $("#embassy").check_val((decode & 1024) > 0);
            $("#ca").check_val((decode & 262144) > 0);
            $("#newEnergy").check_val(((decode & 524288) > 0) || ((decode & 1048576) > 0));
            $("#emergency").check_val((decode & 2097152) > 0);
            $("#consulate").check_val((decode & 4194304) > 0);
            $("#new_small_car").check_val((decode & 8388608) || (decode & 16777216) > 0);
            $("#airport").check_val((decode & 33554432) > 0)
            $("#non_standard_plate").check_val((decode & 128) > 0)
            $("#unlicensed_car_triggered").check_val((decode & 2147483648) != 0)
            $("#license_anti_counterfeit").check_val((decode & 536870912) != 0)
            var enable = ((decode & 536870912) != 0) ? 1 : 0;
            ele_change(enable, "anti_disabled");
        })


    }
    //设置识别类型
    function set_distinguish_type() {
        var cfg = {}
        cfg.type = "set_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 65535
        cfg.body.param = {}
        cfg.body.param.vehicle_inoutlet_event = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm = {}
        var distinguish_type = 0;
        // $("#discern_plate input[type='checkbox']").each(function () {
        //   var state = parseInt($(this).attr("state"));
        //   var val = $(this).check_val();
        //   if (val) {
        //     plate_rec_type = plate_rec_type | state;
        //   }
        // })
        if ($("#blue").check_val()) {
            distinguish_type = distinguish_type | 2;
        }
        if ($("#yellow").check_val()) {
            distinguish_type = distinguish_type | 8;
            distinguish_type = distinguish_type | 16;
        }
        if ($("#black").check_val()) {
            distinguish_type = distinguish_type | 4;
        }
        if ($("#coach").check_val()) {
            distinguish_type = distinguish_type | 8192;
        }
        if ($("#police").check_val()) {
            distinguish_type = distinguish_type | 32;
        }
        if ($("#armpol").check_val()) {
            distinguish_type = distinguish_type | 64;
            distinguish_type = distinguish_type | 32768;
            distinguish_type = distinguish_type | 65536;
            distinguish_type = distinguish_type | 131072;
        }
        if ($("#army").check_val()) {
            distinguish_type = distinguish_type | 256;
            distinguish_type = distinguish_type | 512;
        }
        if ($("#hongkongmacao").check_val()) {
            distinguish_type = distinguish_type | 2048;
            distinguish_type = distinguish_type | 16384;
        }
        if ($("#embassy").check_val()) {
            distinguish_type = distinguish_type | 1024;
        }
        if ($("#ca").check_val()) {
            distinguish_type = distinguish_type | 262144;
        }
        if ($("#newEnergy").check_val()) {
            distinguish_type = distinguish_type | 524288;
            distinguish_type = distinguish_type | 1048576;
        }
        if ($("#emergency").check_val()) {
            distinguish_type = distinguish_type | 2097152;
        }
        if ($("#consulate").check_val()) {
            distinguish_type = distinguish_type | 4194304;
        }
        if ($("#new_small_car").check_val()) {
            distinguish_type = distinguish_type | 8388608;
            distinguish_type = distinguish_type | 16777216;
        }
        if ($("#airport").check_val()) {
            distinguish_type = distinguish_type | 33554432;
        }
        if ($("#non_standard_plate").check_val()) {
            distinguish_type = distinguish_type | 128;
        }
        var unlicensed_car_triggered = $("#unlicensed_car_triggered").check_val() ? 2147483648 : 0
        var license_anti_counterfeit = $("#license_anti_counterfeit").check_val() ? 536870912 : 0
        distinguish_type = distinguish_type | unlicensed_car_triggered;
        distinguish_type = distinguish_type | license_anti_counterfeit;
        if (g_distinguish_type == distinguish_type) {
            return false;
        }
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.plate_rec_type = distinguish_type
        post(cfg, function (res) {
            show_informer()
            g_distinguish_type = distinguish_type;
            get_distinguish_type()
        })
    }
    function get_car_info_support() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.alg_prm_type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var attr_rec_prm = res.body.param.vehicle_inoutlet_event.attr_rec_prm
            var car_logo_enable = attr_rec_prm.car_logo_enable
            var car_color_enable = attr_rec_prm.car_color_enable
            var car_type_enable = attr_rec_prm.car_type_enable
            $("#output_car_logo_car_style").check_val(car_logo_enable == 1)
            $("#identify_vehicle_type").check_val(car_type_enable == 1)
            $("#identify_body_color").check_val(car_color_enable == 1)
        })
    }
    function set_car_info_support() {
        var car_logo_enable = $("#output_car_logo_car_style").check_val() ? 1 : 0
        var car_type_enable = $("#identify_vehicle_type").check_val() ? 1 : 0
        var car_color_enable = $("#identify_body_color").check_val() ? 1 : 0
        var cfg = {}
        cfg.type = "set_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 65535
        cfg.body.param = {}
        cfg.body.param.vehicle_inoutlet_event = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.car_logo_enable = car_logo_enable
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.car_color_enable = car_color_enable
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.car_type_enable = car_type_enable
        post(cfg, function (res) {
            show_informer()
            get_car_info_support()
        })
    }
    var plate_width_min;
    var plate_width_max;
    var trigger_interval_time;
    //获取识别参数
    function geteventruleexhtm() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var attr_rec_prm = res.body.param.vehicle_inoutlet_event.attr_rec_prm
            var plate_width = attr_rec_prm.plate_width
            plate_width_min = plate_width.min
            plate_width_max = plate_width.max
            $("#plate_width_s").val(plate_width_min)
            $("#plate_width_l").val(plate_width_max)

            var depolyment_time = res.body.param.vehicle_inoutlet_event
            trigger_interval_time = depolyment_time.trigger_interval
            $("#trigger_interval_time").val(trigger_interval_time)
        })
    }


    function seteventruleexhtm() {
        var pw_s = parseInt($("#plate_width_s").val());
        var pw_l = parseInt($("#plate_width_l").val());
        // direction = $("#direction_sel").select_val();
        var ti_time = parseInt($("#trigger_interval_time").val());
        if (isNaN(ti_time) || ti_time < 1 || ti_time > 255) {
            show_informer_text($.i18n.prop("same_license_hint") + " 1~255");
            $("#trigger_interval_time").val(trigger_interval_time);
            return;
        }

        if (isNaN(pw_s) || isNaN(pw_l) || pw_s < 45 || pw_s > 600 || pw_l < 45 || pw_l > 600) {
            show_informer_text($.i18n.prop("license_width_hint") + " 45~600");
            $("#plate_width_s").val(plate_width_min);
            $("#plate_width_l").val(plate_width_max);
            return;
        }
        if (pw_l < pw_s) {
            show_informer_text($.i18n.prop("license_width_max_min"));
            $("#plate_width_s").val(plate_width_min);
            $("#plate_width_l").val(plate_width_max);
            return;
        }
        var cfg = {}
        cfg.type = "set_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 65535
        cfg.body.alg_chn = 0
        cfg.body.param = {}
        cfg.body.param.vehicle_inoutlet_event = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.plate_width = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.plate_width.min = pw_s
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.plate_width.max = pw_l
        cfg.body.param.vehicle_inoutlet_event.trigger_interval = ti_time
        post(cfg, function (res) {
            show_informer()
            geteventruleexhtm()
        })

    }
    var g_plate_delay = 2
    function getdelaytime() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 1
        cfg.body.alg_chn = 0
        cfg.body.type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var vehicle_inoutlet_event = res.body.param.vehicle_inoutlet_event
            g_plate_delay = vehicle_inoutlet_event.no_plate_delay
            $("#license_plate_delay").val(g_plate_delay)
        })
    }

    function setdelaytime() {
        var no_plate_delay = parseInt($("#license_plate_delay").val())
        if (isNaN(no_plate_delay) || no_plate_delay < 0 || no_plate_delay > 10) {
            show_informer_text($.i18n.prop("license_plate_delay_interval") + "0~10s")
            $("#capture_duration").val(g_plate_delay);
            no_plate_delay = g_plate_delay;
            return;
        }
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {};
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = 65535;
        cfg.body.param = {};
        cfg.body.param.vehicle_inoutlet_event = {};
        cfg.body.param.vehicle_inoutlet_event.no_plate_delay = no_plate_delay
        post(cfg, function () {
            getdelaytime()
            show_informer()
        })
    }

    var g_duration = 60;
    var g_none_duration = 10;
    var g_max_duration = 60;
    function get_capture_prm() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var continuous_capture = res.body.param.vehicle_inoutlet_event.continuous_capture
            var trigger_type = continuous_capture.trigger_type
            hide_option(trigger_type)
            g_duration = continuous_capture.trigger_interval
            g_none_duration = continuous_capture.no_plate_interval
            g_max_duration = continuous_capture.max_capture_time
            $("#capture_mode").select_val(trigger_type)
            $("#capture_duration").val(g_duration);
            $("#none_duration").val(g_none_duration)
            $("#max_duration").val(g_max_duration)
        })
    }
    function set_capture_prm() {
        var mode = parseInt($("#capture_mode").select_val());
        var duration = parseInt($("#capture_duration").val());
        var none_duration = parseInt($("#none_duration").val());
        var max_duration = parseInt($("#max_duration").val());
        if (isNaN(duration) || duration < 3 || duration > 600) {
            $("#capture_duration").val(g_duration);
            duration = g_duration;
        }
        if (isNaN(none_duration) || none_duration < 3 || none_duration > 600) {
            $("#none_duration").val(g_none_duration);
            none_duration = g_none_duration;
        }
        if (isNaN(max_duration) || max_duration < 30 || max_duration > 600) {
            $("#max_duration").val(g_max_duration);
            max_duration = g_max_duration;
        }
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {};
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = 65535;
        cfg.body.param = {};
        cfg.body.param.vehicle_inoutlet_event = {};
        cfg.body.param.vehicle_inoutlet_event.continuous_capture = {}
        cfg.body.param.vehicle_inoutlet_event.continuous_capture.trigger_type = mode
        cfg.body.param.vehicle_inoutlet_event.continuous_capture.trigger_interval = duration
        cfg.body.param.vehicle_inoutlet_event.continuous_capture.no_plate_interval = none_duration
        cfg.body.param.vehicle_inoutlet_event.continuous_capture.max_capture_time = max_duration
        post(cfg, function (res) {
            show_informer()
            get_capture_prm()
        })

    }
    function get_boardversion_info(type, m_version, s_version) {
        get_device_capacity(function () {
            if (m_version == 8) {
                $(".overseas_remove_module").remove();
                init_duration();
            } else if (m_version == 9) {
                $(".overseas_show_module").remove();
                get_distinguish_type();
                init_duration();
            } else {
                $(".overseas_show_module").remove();
                get_distinguish_type();
                init_duration();
            }
            if (m_version == 9) {
                $(".cpro_disabled").hide();
            }
            if (is_C3) {  ////c3隐藏
                $("#C3_hide_body_color").hide();
            }
            if (is_C3A) {
                $(".c3a_hide").hide()
            }
        });
    }
    function hide_option(val) {
        if (val == 1) {
            $(".other_option").hide();
            $(".trigger_coil_option").hide();
        } else if (val == 4) {
            $(".trigger_coil_option").show();
            $(".other_option").show();
        } else {
            $(".other_option").show();
            $(".trigger_coil_option").hide();
        }
    }
    function init_duration() {
        init_selectmenu("#capture_mode", 200, 150, function (e, o) {
            var val = parseInt(o.value);
            hide_option(val);
            set_capture_prm();
        });
        $("#capture_duration").change(function () {
            set_capture_prm();
        })
        $("#none_duration").change(function () {
            set_capture_prm();
        })
        $("#max_duration").change(function () {
            set_capture_prm();
        })
        get_capture_prm();
    }
    function set_outputplate() {
        var switch_0_police = 0
        if ($("#plate_word").check_val()) {
            switch_0_police = 1
        }
        // var switch_6_to_5 = 0
        // if ($("#output_green").check_val()) {
        //   switch_6_to_5 = 1
        // }
        var cfg = {}
        cfg.type = "set_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 65535
        cfg.body.param = {}
        cfg.body.param.vehicle_inoutlet_event = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm = {}
        cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.switch_0_police = switch_0_police
        // cfg.body.param.vehicle_inoutlet_event.attr_rec_prm.switch_6_to_5 = switch_6_to_5
        post(cfg, function (res) {
            show_informer()
            get_outputplate()
        })
    }
    function get_outputplate() {
        var cfg = {}
        cfg.type = "get_alg_prm"
        cfg.module = "ALG_REQUEST_MESSAGE"
        cfg.body = {}
        cfg.body.rule_chn = 0
        cfg.body.alg_chn = 0
        cfg.body.alg_prm_type = "vehicle_inoutlet_event"
        post(cfg, function (res) {
            var attr_rec_prm = res.body.param.vehicle_inoutlet_event.attr_rec_prm
            var switch_0_police = attr_rec_prm.switch_0_police
            if (switch_0_police == 0) {
                $("#plate_num").check_val(true);
            } else {
                $("#plate_word").check_val(true);
            }
            // var switch_6_to_5 = attr_rec_prm.switch_6_to_5
            // if (switch_6_to_5 == 0) {
            //   $("#output_olivine").check_val(true);
            // } else {
            //   $("#output_green").check_val(true);
            // }
        })

    }
    function get_filtfakeplate() {
        $.get('vb.htm?paratest=filtfakeplate', function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
            var response = ajaxdata.split("\n");
            var val = parse_ajax_data(response[0]);
            if (val == 0) {
                $("#alarm").check_val(true);
            } else {
                $("#filter").check_val(true);
            }
        })
    }
    function set_filtfakeplate() {
        var filtfakeplate = 0;
        if ($("#filter").check_val()) {
            filtfakeplate = 1
        }
        $.get('vb.htm?filtfakeplate=' + filtfakeplate, function (ajaxdata) {
            default_ajax_handler(ajaxdata);
        })
    }
    this.init = function () {
        get_boardversion_info(g_d_type, g_m_version, g_s_version);
        init_selectmenu("#direction_sel,#img_size,#centerserver_image_quality,#preinstall_province", 200, 150);
        $(".trigger").change(function () {
            set_platefiltermode();
        });
        $("input[type='text']").css("width", "40px");
        $("#trigger_interval_time").change(seteventruleexhtm);
        $("#plate_width_s").change(seteventruleexhtm);
        $("#plate_width_l").change(seteventruleexhtm);
        $("#license_plate_delay").change(setdelaytime);
        // $("#discern_plate input").change(set_distinguish_type)
        $(document).on("change", "#discern_plate input[type='checkbox']", set_distinguish_type);
        $(".distinguish input[type='checkbox']").change(function () {
            var enable = $("#license_anti_counterfeit").check_val() ? 1 : 0;
            ele_change(enable, "anti_disabled");
            set_distinguish_type();
        });
        $(".carinfo input[type='checkbox']").change(function () {
            set_car_info_support();
        });
        $(".distinguish input[type='radio']").change(function () {
            set_filtfakeplate();
        });

        $(".distinguish input[type='radio']").change(function () {
            set_filtfakeplate();
        });
        $(".output_message input[type='radio']").change(function () {
            set_outputplate();
        });
        $(".new_energy_plate input[type='radio']").change(function () {
            set_outputplate();
        });
        $("#centerserver_image_quality").on("selectmenuchange", set_size_alg_prm);
        $("#img_size").on("selectmenuchange", set_size_alg_prm);
        //     $("#result_delay").change(set_size_alg_prm);
        get_alg_prop(function () {
            evs_get_gpioin();
            get_capture_prm()
            get_platefiltermode();
            geteventruleexhtm();
            getdelaytime();
            get_size_alg_prm();
            get_outputplate();
            get_filtfakeplate();
            get_car_info_support();
            get_distinguish_type()
        })

    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//WhiteList
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var WhiteList = new function () {
    function parse_config_info(cfg, flag) {
        if (flag) {
            if (isNotUndefinedOrNull(cfg.offline_status) && (cfg.offline_status == 1))
                $("#offline_status").html($.i18n.prop("on_line"));
            else
                $("#offline_status").html($.i18n.prop("off_line"));
            return;
        }
        // offline status
        $("#cur_offline_status").css("color", "Green");
        if (isNotUndefinedOrNull(cfg.offline_status) && (cfg.offline_status == 1))
            $("#cur_offline_status").html($.i18n.prop("current_camera_online"));
        else
            $("#cur_offline_status").html($.i18n.prop("current_camera_offline"));

        //whitelist_enable set
        if (isNotUndefinedOrNull(cfg.filter_enable)) {
            if (cfg.filter_enable == 1) $("#whitelist_enable").check_val(true);
            else if (cfg.filter_enable == 2) $("#whitelist_disable").check_val(true);
            else $("#whitelist_auto").check_val(true);
        }

        // white list update,time check
        if (isNotUndefinedOrNull(cfg.white_list_flag) && (cfg.white_list_flag == 1)) {
            // compare time with cam
            var dev_time = cfg.dev_time;
            var mydate = new Date();
            if ((mydate.getFullYear() != dev_time.time_year || mydate.getMonth() + 1 != dev_time.time_mon ||
                mydate.getDate() != dev_time.time_day || mydate.getHours() != dev_time.time_hour ||
                mydate.getMinutes() != dev_time.time_min)) {
                $("#time_hint").css("visibility", "visible");
            }
        }
    }

    this.get_white_list_check_method = function (flag) {
        var cfg = {};
        cfg.type = "get_wl_check_status";
        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: 'POST',
            url: "dboprnew.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    parse_config_info(json.body, flag);
                }
            }
        })
    }

    function set_white_list_check_method() {
        var body = {};

        if ($("#whitelist_enable").check_val()) body.filter_enable = 1;
        else if ($("#whitelist_disable").check_val()) body.filter_enable = 2;
        else body.filter_enable = 0;
        var cfg = {};
        cfg.type = "set_wl_check_status";
        cfg.body = body;
        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: 'POST',
            url: "dboprnew.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    show_informer();
                }
            }
        })

    }

    function fuzzy_parse_config_info(json) {
        var cfg = json;
        //fuzzy_query set
        if (isNotUndefinedOrNull(cfg.fuzzy_query_type)) {
            if (cfg.fuzzy_query_type == 2) {
                $("#fuzzy_normal_cc").check_val(true);
            } else if (cfg.fuzzy_query_type == 1) {
                $("#fuzzy_similar_cc").check_val(true);
                $("#lb_algin").addClass("disabled_color");
                $("#lb_algin input").attr("disabled", "disabled");
            } else {
                $("#fuzzy_accurate").check_val(true);
                $("#fuzzy_ignore_cc").attr("disabled", "disabled");
                $(".fuzzy_ignore").addClass("disabled_color");
                $("#lb_algin").addClass("disabled_color");
                $("#lb_algin input").attr("disabled", "disabled");
            }
        } else {
            $("#fuzzy_accurate").check_val(true);
        }
        if (isNotUndefinedOrNull(cfg.fuzzy_ignore_cc)) {
            if (cfg.fuzzy_ignore_cc == 1) $("#fuzzy_ignore_cc").check_val(true);
            else $("#fuzzy_ignore_cc").check_val(false);
        }
        if (isNotUndefinedOrNull(cfg.fuzzy_query_len)) {
            if (cfg.fuzzy_query_len == 1) {
                $("#fuzzy_query_len_1").check_val(true);
            } else if (cfg.fuzzy_query_len == 2) {
                $("#fuzzy_query_len_2").check_val(true);
            } else if (cfg.fuzzy_query_len == 3) {
                $("#fuzzy_query_len_3").check_val(true);
            } else {
                $("#fuzzy_query_len_0").check_val(true);
            }
        }
    }

    function get_fuzzy_query() {
        var cfg = {};
        cfg.type = "get_wl_fuzzy";
        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: 'POST',
            url: "dboprnew.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    fuzzy_parse_config_info(json.body);
                }
            }
        })
    }

    function set_fuzzy_query() {
        var body = {};

        if ($("#fuzzy_similar_cc").prop('checked')) body.fuzzy_query_type = 1;
        else if ($("#fuzzy_normal_cc").prop('checked')) body.fuzzy_query_type = 2;
        else body.fuzzy_query_type = 0;

        body.fuzzy_query_len = 0; //("#fuzzy_query_len").val();
        if ($("#fuzzy_query_len_1").prop('checked')) {
            body.fuzzy_query_len = 1;
        } else if ($("#fuzzy_query_len_2").prop('checked')) {
            body.fuzzy_query_len = 2;
        } else if ($("#fuzzy_query_len_3").prop('checked')) {
            body.fuzzy_query_len = 3;
        }
        //show_informer_text(cfg.fuzzy_query_len);

        body.fuzzy_ignore_cc = $("#fuzzy_ignore_cc").prop('checked') ? 1 : 0;

        var cfg = {};
        cfg.type = "set_wl_fuzzy";
        cfg.body = body;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: 'POST',
            url: "dboprnew.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    show_informer();
                }
            }
        })

    }
    function prase_wihte_list(json) {
        var arr = json.dldb_rec;
        var str = "";
        if (!arr) {
            $(".wl_tb tbody").html("");
            return;
        }
        for (var i = 0; i < arr.length; i++) {
            var enable = $.i18n.prop("disable");
            if (arr[i].enable == 1) {
                enable = $.i18n.prop("enable");
            }
            var black_list = $.i18n.prop("no");
            if (arr[i].need_alarm == 1) {
                black_list = $.i18n.prop("yes");
            }
            str += "<tr><td style='width:50px;'>" + (i + 1) + "</td><td style='width:150px;'>" + arr[i].plate + "</td><td style='width:50px;'>" + enable + "</td><td style='width:200px;'>" + arr[i].enable_time + "</td><td style='width:200px;'>" + arr[i].overdue_time + "</td><td style='width:150px;'>" + arr[i].seg_time_start + "-" + arr[i].seg_time_end + "</td><td style='width:80px;'>" + black_list + "</td><td style='width:100px;'>" + arr[i].context + "</td></tr>";
        }
        $(".wl_tb tbody").html(str);
    }
    function search_white_list(plate) {
        $("#wl_tb_lodding").show();
        var cfg = {};
        cfg.cmd = "white_list_operator";
        cfg.id = "999999";
        cfg.operator_type = "select_fuzzy";
        cfg.plate = plate;
        cfg.start_pos = (cur_page - 1) * page_size;
        cfg.select_count = page_size;

        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: 'POST',
            url: "dbopr.php",
            data: jsonstr,
            success: function (ajaxdata) {
                $("#wl_tb_lodding").hide();
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    prase_wihte_list(json);
                }
            }
        });
    }
    function search_white_list_count(plate) {
        var cfg = {};
        cfg.cmd = "white_list_operator";
        cfg.id = "999999";
        cfg.operator_type = "select_count_by_plate";
        cfg.plate = plate;

        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: 'POST',
            url: "dbopr.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                total = json.total_count;
                all_page = Math.ceil(total / page_size);
                if (all_page == 0) {
                    cur_page = 0;
                } else {
                    cur_page = 1;
                }
                $("#all_page").html(all_page);
                $("#cur_page").html(cur_page);
                $("#total").html(total);
            }
        });
    }
    var total = 0, cur_page = 1, all_page = 0, page_size = 50, searched = false;
    function search() {
        var plate = $("#wl_plate").val();
        old_plate = plate;
        searched = true;
        cur_page = 1;
        $("#all_page").html("0");
        $("#cur_page").html("0");
        $("#total").html("0");
        search_white_list_count(old_plate);
        search_white_list(old_plate);
    }
    function pre_page() {
        if (!searched) {
            return;
        }
        if (cur_page <= 1) {
            show_informer_text($.i18n.prop("its_first_page"));
            return;
        }
        $("#check_all").check_val(false);
        cur_page -= 1;
        $("#cur_page").html(cur_page);
        search_white_list(old_plate);
    }
    function next_page() {
        if (!searched) {
            return;
        }
        if (cur_page >= all_page) {
            show_informer_text($.i18n.prop("its_last_page"));
            return;
        }
        $("#check_all").check_val(false);
        cur_page += 1;
        $("#cur_page").html(cur_page);
        search_white_list(old_plate);
    }
    function first_page() {
        if (!searched) {
            return;
        }
        if (all_page < 1) {
            return;
        }
        $("#check_all").check_val(false);
        cur_page = 1;
        $("#cur_page").html(cur_page);
        search_white_list(old_plate);
    }
    function last_page() {
        if (!searched) {
            return;
        }
        if (all_page == 0) {
            return;
        }
        $("#check_all").check_val(false);
        cur_page = all_page;
        $("#cur_page").html(cur_page);
        search_white_list(old_plate);
    }
    function goto_page() {
        if (!searched) {
            return;
        }
        var goto_page = parseInt($("#page").val());
        if (isNaN(goto_page) || goto_page <= 0 || goto_page > all_page) {
            show_informer_text($.i18n.prop("page_error"));
            return;
        }
        $("#check_all").check_val(false);
        cur_page = goto_page;
        $("#cur_page").html(cur_page);
        search_white_list(old_plate);
    }
    function clear() {
        searched = false;
        old_plate = "";
        $(".wl_tb tbody").html("");
        all_page = 0;
        cur_page = 1;
        total = 0;
        $("#all_page").html(all_page);
        $("#cur_page").html(cur_page);
        $("#total").html(total);
    }
    this.init = function () {
        $("input[name='fuzzy_query_type']").click(function () {
            if ($(this).attr("id") == "fuzzy_normal_cc") {
                $("#lb_algin").removeClass("disabled_color");
                $("#lb_algin input").removeAttr("disabled");
            } else {
                $("#lb_algin").addClass("disabled_color");
                $("#lb_algin input").attr("disabled", "disabled");
            }
            if ($(this).attr("id") == "fuzzy_accurate") {
                $("#fuzzy_ignore_cc").check_val(false);
                $("#fuzzy_ignore_cc").attr("disabled", "disabled");
                $(".fuzzy_ignore").addClass("disabled_color");
            } else {
                $("#fuzzy_ignore_cc").removeAttr("disabled");
                $(".fuzzy_ignore").removeClass("disabled_color");
            }
        });
        $("input[name='whitelist_en']").change(set_white_list_check_method);
        $("input[name='fuzzy_query_type']").change(set_fuzzy_query);
        $("input[name='fuzzy_query_len']").change(set_fuzzy_query);
        $("#fuzzy_ignore_cc").change(set_fuzzy_query);
        get_fuzzy_query();
        WhiteList.get_white_list_check_method();
        $("#pre_page").click(pre_page);
        $("#next_page").click(next_page);
        $("#first_page").click(first_page);
        $("#last_page").click(last_page);
        $("#goto_page").click(goto_page);
        $("#search_wl").click(search);
        $("#wl_plate").change(clear);
        create_tabs("#wl_tabs");
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Support
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Support = new function () {
    this.get_title = function () {
        var cfg = {};
        cfg.type = "ss_get_devname";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            dataType: "text",
            data: jsonstr,
            url: "systemjson.php",
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    var title = jsondata.body.title;
                    $("#title").val(Base64.decode(title, true));
                    $("#ivs_title").html(Base64.decode(title, true));
                }
            }
        })
    }

    this.set_title = function () {
        var title = $('#title').val();
        if (!/^[\u4E00-\u9FA5A-Za-z0-9_-]{0,20}$/.test(title)) {
            show_informer_text($.i18n.prop('device_name_error'));
            return false;
        }

        var titlenow = Base64.encode(title, true);
        var cfg = {};
        cfg.type = "ss_set_devname";
        cfg.body = {};
        cfg.body.title = titlenow;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            dataType: "text",
            data: jsonstr,
            url: "systemjson.php",
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    show_informer();
                    Support.get_title();
                }
            }
        })
    }
    this.get_device_info = function (flag) {
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
                    if (!flag) {
                        $("#version_td").html(jd.soft_ver);
                    } else {
                        $("#version").html(jd.soft_ver);
                        $("#systemversion").html(jd.system_ver);
                        var alg_ver = jd.alg_ver;
                        $("#algversion").html(alg_ver);
                        $("#serialno").html(jd.serial_num);
                        f_onCreateQrcode(jd.serial_num);
                        $("#qrcode table").css("margin", 0);
                        $("#mac_addrees").html(jd.mac_addr);
                        if (jd.ext_info) {
                            // $("#unit_type").html(jd.ext_info.product_num);
                            $("#hardware_version").html(jd.ext_info.product_type);
                        }
                        var user_app = jd.userapp_ver;
                        if (user_app == "0.0.0.0" || !user_app) {
                            $("#user_app_tr").hide();
                        } else {
                            $("#userapp_info").html(user_app);
                        }
                    }
                }
            }
        })
    }
    var qrcode;
    //生成二维码图像
    function f_onCreateQrcode(value) {
        if (value) {
            // 使用 API
            qrcode.clear();
            qrcode.makeCode(value);
        }
    }
    function set_device_type() {
        var device_type = $('#device_type').val();
        if (!/^[\u4E00-\u9FA5A-Za-z0-9_-]{0,20}$/.test(device_type)) {
            show_informer_text($.i18n.prop('device_type_error'));
            get_board('device_type');
            return false;
        }
        var cfg = {}
        cfg.type = 'set_web_saved_value'
        cfg.module = 'WEB_SELF_REQUEST'
        cfg.body = {}
        cfg.body.device_type = device_type
        post(cfg, function (res) {
            show_informer()
            get_board('main_title')
        })
    }
    this.init = function () {
        // 设置 qrcode 参数
        qrcode = new QRCode('qrcode', {
            text: 'xxxxxxxx-xxxxxxxx',
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        var v = "0X" + g_boardversion.toString(16).toUpperCase();
        $("#boardversion").html(v);
        get_board('device_type');
        $("#title").change(Support.set_title);
        Support.get_device_info(1);
        Support.get_title();
        $("#device_type").change(set_device_type)
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetDateTime
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var SetDateTime = new function () {
    var g_systime = 0;
    function settime() {
        g_systime += 1000;
        var local_date = new Date();
        var ld = local_date.format("YYYY-MM-DD hh:mm:ss");
        var sys_date = new Date(g_systime);
        var sd = sys_date.format("YYYY-MM-DD hh:mm:ss");
        if ($("#localdate").html() != ld) {
            $("#localdate").html(ld);
        }
        if ($("#serverdate").html() != sd) {
            $("#serverdate").html(sd);
        }
    }

    function set_g_systime(ajaxdata) {
        if (precheck(ajaxdata)) {
            return false;
        }
        response = ajaxdata.split("\n");
        var msgdate = parse_ajax_data(response[0]);
        msgdate = msgdate.split("-");
        var year = msgdate[0];
        var month = msgdate[1] - 1;
        var date = msgdate[2];
        var msgtime = parse_ajax_data(response[1]);
        msgtime = msgtime.split(":");
        var hours = msgtime[0];
        var minutes = msgtime[1];
        var seconds = msgtime[2];
        var sys_date = new Date(year, month, date, hours, minutes, seconds);
        g_systime = sys_date.getTime();
    }
    settime_timer = null;
    function get_server_date(ajaxdata) {
        if (precheck(ajaxdata)) {
            return false;
        }
        set_g_systime(ajaxdata);
        settime();
        if (settime_timer == null) {
            settime_timer = setInterval(settime, 1000);
        }
    }

    var g_ntp_server_name = null;
    var g_ntp_frequency = null;
    var g_ntp_enable = null;
    function get_ntp() {
        var cfg = {};
        cfg.type = "ss_get_ntp_cfg";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    json = json.body;
                    g_ntp_enable = json.enable;
                    g_ntp_server_name = json.server;
                    g_ntp_frequency = json.cycle;
                    $("#ntp_server_name").val(g_ntp_server_name);
                    $("#ntp_enable").check_val(g_ntp_enable == 1);
                    ele_change(g_ntp_enable, "ntp_disabled");
                    g_ntp_frequency = Math.floor(g_ntp_frequency / 60);
                    $("#ntp_frequency_minute").val(g_ntp_frequency);
                }
            }
        })
    }
    function set_ntp_cfg(enable, server, cycle) {
        var cfg = {};
        cfg.type = "ss_set_ntp_cfg";
        cfg.body = {};
        cfg.body.enable = enable;
        cfg.body.server = server;
        cfg.body.cycle = cycle;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    show_informer();
                }
            }
        })
    }
    function set_ntp() {
        var ntp_enable = $("#ntp_enable").check_val() ? 1 : 0;
        var ntp_server_name = $("#ntp_server_name").val();
        var ntp_frequency_minute = parseInt($("#ntp_frequency_minute").val());
        var reg_str = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
        if (ntp_enable == 1) {
            if (!reg_str.test(ntp_server_name)) {
                show_informer_text($.i18n.prop("address_error"));
                return;
            }
            if (isNaN(ntp_frequency_minute) || ntp_frequency_minute < 1 || ntp_frequency_minute > 1440) {
                show_informer_text($.i18n.prop("cycle_hint") + "1~1440");
                return;
            }
        }
        var ntp_frequency = ntp_frequency_minute * 60;
        if (ntp_server_name != g_ntp_server_name || ntp_frequency != g_ntp_frequency || ntp_enable != g_ntp_enable) {
            set_ntp_cfg(ntp_enable, ntp_server_name, ntp_frequency);
        }
    }

    function get_server_datatime() {
        $.get("vb.htm", { getdate: "", gettime: "" }, get_server_date);
    }
    function set_server_datatime(time) {
        var cfg = {};
        cfg.type = "ss_set_timing";
        cfg.body = {};
        cfg.body.datetime = time;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    $.get("vb.htm", { getdate: "", gettime: "" }, set_g_systime);
                }
            }
        })
    }
    function manual_set_date() {
        var time = $("#manualdate").val();
        if (time == "") {
            show_informer_text($.i18n.prop("please_select_time"));
            return;
        }
        set_server_datatime(time);
    }
    function local_set_date() {
        var time = $("#localdate").html();
        set_server_datatime(time);
    }
    var g_timezone = 0
    function get_timezone() {
        var cfg = {};
        cfg.type = "AVS_GET_ALG_RESULT_PARAM";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body;
                var time_zone = jsondata.time_zone;
                g_timezone = time_zone
                $("#plate_timezone").select_val(time_zone);
            }
        });
    }

    function set_timezone() {
        var timezone = $("#plate_timezone").select_val();
        var cfg = {};
        cfg.type = "AVS_SET_ALG_RESULT_PARAM";
        cfg.body = {};
        cfg.body.time_zone = parseInt(timezone);

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    show_informer();
                }
            }
        });
    }
    function get_sys_timezone() {
        var cfg = {};
        cfg.type = "get_timezone";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                jsondata = jsondata.body;
                var time_zone = jsondata.timezone;
                g_timezone = time_zone;
                $("#plate_timezone").select_val(time_zone);
            }
        });
    }

    function set_sys_timezone() {
        var timezone = $("#plate_timezone").select_val();
        var cfg = {};
        cfg.type = "set_timezone";
        cfg.body = {};
        cfg.body.timezone = parseInt(timezone);

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    show_informer();
                    get_sys_timezone();
                }
            }
        });
    }
    function init_time_zone() {
        if ((g_d_type == 3 && (g_m_version == 8 || g_m_version == 11 || g_m_version == 26)) || (g_d_type == 5 && g_m_version == 1)) {
            var time_zone_value = [{ 'value': -720, 'name': 'West' }, { 'value': -660, 'name': 'Midway' }, { 'value': -600, 'name': 'Hawaii' }, { 'value': -540, 'name': 'Alaska' }, { 'value': -480, 'name': 'Pacific' }, { 'value': -420, 'name': 'Mountain' }, { 'value': -360, 'name': 'Central' }, { 'value': -300, 'name': 'Eastern' }, { 'value': -240, 'name': 'Atlantic' }, { 'value': -180, 'name': 'Georgetown' }, { 'value': -120, 'name': 'Cairo' }, { 'value': -60, 'name': 'Azores' }, { 'value': 0, 'name': 'Dublin' }, { 'value': 60, 'name': 'Amsterdam' }, { 'value': 120, 'name': 'Athens' }, { 'value': 180, 'name': 'Baghdad' }, { 'value': 240, 'name': 'Baku' }, { 'value': 270, 'name': 'Kabul' }, { 'value': 300, 'name': 'Islamabad' }, { 'value': 330, 'name': 'Madras' }, { 'value': 360, 'name': 'Almaty' }, { 'value': 375, 'name': 'Rangoon' }, { 'value': 420, 'name': 'Bangkok' }, { 'value': 480, 'name': 'Beijing' }, { 'value': 540, 'name': 'Seoul' }, { 'value': 570, 'name': 'Adelaide' }, { 'value': 600, 'name': 'Sydney' }, { 'value': 660, 'name': 'Magadan' }, { 'value': 720, 'name': 'Auckland' }, { 'value': 780, 'name': 'Nukualofa' }]
            var time_zone_str = "";
            for (var i = 0; i < time_zone_value.length; i++) {
                if (i == 0 || i == 3) {
                    continue;
                } else {
                    time_zone_str += "<option value='" + time_zone_value[i].value + "'>" + $.i18n.prop("time_zone_" + time_zone_value[i].name) + "</option>";
                }
            }
            $("#plate_timezone").html(time_zone_str);
            init_selectmenu("#plate_timezone", 200, 150);
            get_sys_timezone();
        } else {
            init_selectmenu("#plate_timezone", 200, 150);
            get_timezone();
        }
    }
    function get_DST() {
        var cfg = {}
        cfg.type = "get_DST"
        var jsonstr = JSON.stringify(cfg)
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    var body = jsondata.body
                    var enable = body.DST_enable
                    var offset = body.DST_offset
                    var s_t = body.StartTime
                    var start_mon = s_t.dmon
                    var start_week = s_t.dweek
                    var start_day = s_t.dday
                    var start_hour = s_t.dhour
                    var e_t = body.EndTime
                    var end_mon = e_t.dmon
                    var end_week = e_t.dweek
                    var end_day = e_t.dday
                    var end_hour = e_t.dhour
                    $("#DST_enable").check_val(enable == 1)
                    $("#DST_offset").select_val(offset)
                    $("#start_mon").select_val(start_mon)
                    $("#start_week").select_val(start_week)
                    $("#start_day").select_val(start_day)
                    $("#start_hour").select_val(start_hour)

                    $("#end_mon").select_val(end_mon)
                    $("#end_week").select_val(end_week)
                    $("#end_day").select_val(end_day)
                    $("#end_hour").select_val(end_hour)
                    ele_change(enable, 'DST_disable')
                }
            }
        });
    }
    function set_DST() {
        var enable = $("#DST_enable").check_val() ? 1 : 0
        var offset = parseInt($("#DST_offset").select_val())
        var start_mon = parseInt($("#start_mon").select_val())
        var start_week = parseInt($("#start_week").select_val())
        var start_day = parseInt($("#start_day").select_val())
        var start_hour = parseInt($("#start_hour").select_val())

        var end_mon = parseInt($("#end_mon").select_val())
        var end_week = parseInt($("#end_week").select_val())
        var end_day = parseInt($("#end_day").select_val())
        var end_hour = parseInt($("#end_hour").select_val())
        if (enable == 1) {
            if (end_mon <= start_mon) {
                show_informer_text($.i18n.prop('mon_error'))
                return
            }
        }
        var cfg = {}
        cfg.type = "set_DST"
        var body = {}
        body.CurrentZONE = g_timezone
        body.DST_enable = enable
        body.DST_offset = offset
        var StartTime = {}
        StartTime.dmon = start_mon
        StartTime.dweek = start_week
        StartTime.dday = start_day
        StartTime.dhour = start_hour

        var EndTime = {}
        EndTime.dmon = end_mon
        EndTime.dweek = end_week
        EndTime.dday = end_day
        EndTime.dhour = end_hour
        body.StartTime = StartTime
        body.EndTime = EndTime
        cfg.body = body
        var jsonstr = JSON.stringify(cfg)
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    show_informer();
                    get_DST();
                }
            }
        });
    }
    var date_timer = null;
    this.init = function () {
        get_server_datatime();
        date_timer = setInterval(function () {
            get_server_datatime();
        }, 5000);
        get_ntp();
        $("#ntp_submit").click(set_ntp);
        $("#timezone_btn").click(function () {
            if ((g_d_type == 3 && (g_m_version == 8 || g_m_version == 11 || g_m_version == 26)) || (g_d_type == 5 && g_m_version == 1)) {
                set_sys_timezone();
                set_timezone();
            } else {
                set_timezone();
            }
        });
        $("#local_btn").click(local_set_date);
        $("#manual_btn").click(manual_set_date);
        $("#ntp_enable").change(function () {
            var enable = $(this).check_val();
            ele_change(enable, "ntp_disabled");
        });
        init_selectmenu("#DST_offset", 200, 150)
        init_selectmenu(".select_time select", 75, 150)
        $("#dst_submit").click(set_DST);
        $("#DST_enable").change(function () {
            var enable = $(this).check_val() ? 1 : 0
            ele_change(enable, 'DST_disable')
        })
        init_time_zone();
        get_DST();
    }
    this.close = function () {
        clearInterval(date_timer);
        date_timer = null;
        clearInterval(settime_timer);
        settime_timer = null;
    }
    close_json["SetDateTime"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetVideo
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var SetVideo = new function () {
    function init_slider(name, min, max, callback) {
        var mid = 50;
        var min_val = 0;
        var max_val = 0;
        if (!min) {
            min_val = 0;
        } else {
            min_val = min;
        }
        if (!max) {
            max_val = 100;
        } else {
            max_val = max;
        }
        var slider_name = "#" + name + "_slider";
        var text_name = "#" + name + "_text";
        $(slider_name).slider({
            range: "min",
            value: mid,
            min: min_val,
            max: max_val,
            change: function (event, ui) {
                $(text_name).html(ui.value);
            },
            slide: function (event, ui) {
                $(text_name).html(ui.value);
            },
            stop: function (event, ui) {
                if (callback) {
                    return callback();
                } else {
                    return video_source_config.set_video_param(name, parseInt(ui.value));
                }
            }
        });
        $(text_name).html($(slider_name).slider("value"));
    }
    function set_slider(name, val) {
        $("#" + name + "_slider").slider('value', val);
    }
    var new_main_stream_video_encoder_config = new function () {
        var g_bitrate = null;
        var g_frame_rate = null;
        var g_video_size = null;
        var g_mainencodetype = null;
        var g_ratecontrl = null;
        var g_imagequlity = null;
        var g_encodetypesupport = Array();

        function encodetype_change(value, channel) {
            if (g_encodetypesupport[value] == "JPEG") {
                $("#rate").selectmenu('disable');
                $("#image_quality").selectmenu('enable');
            }
            else {
                $("#rate").selectmenu('enable');
                var ratecontrl = $("#rate").select_val();
                if (ratecontrl == 0) {
                    $("#image_quality").selectmenu('disable');
                }
                else {
                    $("#image_quality").selectmenu('enable');
                }
            }
        }

        function rate_change(value, channel) {
            if (value == 0) {
                $("#image_quality").selectmenu('disable');
            }
            else {
                $("#image_quality").selectmenu('enable');
            }
        }

        function get_video_support(channel) {
            var request_string;
            request_string = "vb.htm?paratest=videosizexysupport." + channel + "&paratest=encodetypesupport." + channel;
            $.get(request_string, function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                response = ajaxdata.split("\n");
                var reso = parse_ajax_data(response[0]);
                reso = reso.split(";");
                var encode = parse_ajax_data(response[1]);
                encode = encode.split(";");

                var option_text = "";
                for (var i = 0; encode[i]; i++) {
                    var sp = encode[i].split(":");
                    g_encodetypesupport[sp[1]] = sp[0];
                    option_text += "<option value=\"" + sp[1] + "\">" + sp[0] + "</option>";
                }
                $("#encodetype").html(option_text);
                init_selectmenu("#encodetype", 200, 150, function (e, object) {
                    encodetype_change(object.value, g_cur_channel);
                });
                init_selectmenu("#rate", 200, 150, function (e, object) {
                    rate_change(object.value, g_cur_channel);
                });

                option_text = "";
                for (var i = 0; reso[i]; i++) {
                    var sp = reso[i].split(":");
                    option_text += "<option value=\"" + sp[1] + "\">" + sp[0] + "</option>";
                }
                $("#video_size").html(option_text);
                init_selectmenu("#video_size", 200, 150);
                get_video_para(channel);
                //new_get_video_para();
            });
        }

        function size(resolution, flag) {
            var size_text = "";
            for (var i = 0; i < resolution.length; i++) {
                if (flag == 0 || flag == 2) {
                    size_text += "<option value=\"" + resolution[i].type + "\">" + resolution[i].content + "</option>";
                } else {
                    if (resolution[i].type == 2 || resolution[i].type == 3 || resolution[i].type == 5) {
                        size_text += "<option value=\"" + resolution[i].type + "\">" + resolution[i].content + "</option>";
                    }
                }
            }
            $("#video_size").html(size_text);
            init_selectmenu("#video_size", 200, 150);
            $("#video_size").selectmenu("refresh");
        }
        function disabled_encode(stream) {
            if (stream == 2) {
                $("#encodetype option[value='0']").attr("disabled", "disabled");
                $("#encodetype option[value='1']").removeAttr("disabled");
                $("#encodetype option[value='3']").attr("disabled", "disabled");
            } else {
                $("#encodetype option[value='1']").attr("disabled", "disabled");
                $("#encodetype option[value='0']").removeAttr("disabled");
                $("#encodetype option[value='3']").removeAttr("disabled");
            }
        }
        var data_rate_min = 0;
        var data_rate_max = 0;
        var resolution;
        function get_encode_json(id, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].stream_id == id) {
                    return arr[i];
                }
            }
        }
        function load_encode_prop(jsondata) {
            //分辨率
            if (jsondata.resolution.enable) {
                $("#video_size_tr").show();
                resolution = jsondata.resolution.types;
                var size_text = "";
                for (var i = 0; i < resolution.length; i++) {
                    size_text += "<option value=\"" + resolution[i].type + "\">" + resolution[i].content + "</option>";
                }
                $("#video_size").html(size_text);
                init_selectmenu("#video_size", 200, 150);
                $("#video_size").selectmenu("refresh");
            } else {
                $("#video_size_tr").hide();
            }
            //编码
            if (jsondata.encode_type.enable) {
                $("#encodetype_tr").show();
                var encode_type = jsondata.encode_type.types;
                var encode_text = "";
                for (var i = 0; i < encode_type.length; i++) {
                    encode_text += "<option value=\"" + encode_type[i].type + "\">" + encode_type[i].content + "</option>";
                }
                $("#encodetype").html(encode_text);
                init_selectmenu("#encodetype", 200, 150, function (e, object) {
                    //encodetype_change(object.value, g_cur_channel);
                });
                $("#encodetype").selectmenu("refresh");
            } else {
                $("#encodetype_tr").hide();
            }
            //码率
            if (jsondata.rate_type.enable) {
                $("#rate_tr").show();
                var rate_type = jsondata.rate_type.types;
                var rate_type_text = "";
                for (var i = 0; i < rate_type.length; i++) {
                    rate_type_text += "<option value=\"" + rate_type[i].type + "\">" + Base64.decode(rate_type[i].content, true) + "</option>";
                }
                $("#rate").html(rate_type_text);
                init_selectmenu("#rate", 200, 150, function (e, object) {
                    rate_change(object.value, g_cur_channel);
                });
                $("#rate").selectmenu("refresh");
            } else {
                $("#rate_tr").hide();
            }
            //帧率
            if (jsondata.frame_rate.enable) {
                $("#frame_rate_tr").show();
                var frame_rate = jsondata.frame_rate;
                var min = frame_rate.min;
                var max = frame_rate.max;
                var frame_rate_txt = "";
                for (var i = min; i <= max; i++) {
                    frame_rate_txt += "<option value=\"" + i + "\">" + i + "</option>";
                }
                $("#frame_rate").html(frame_rate_txt);
                init_selectmenu("#frame_rate", 200, 150);
                $("#frame_rate").selectmenu("refresh");
            } else {
                $("#frame_rate_tr").hide();
            }
            //图像质量
            if (jsondata.video_quality.enable) {
                $("#image_quality_tr").show();
                var image_quality = jsondata.video_quality.types;
                var image_quality_txt = "";
                for (var i = 0; i < image_quality.length; i++) {
                    image_quality_txt += "<option value=\"" + image_quality[i].type + "\">" + Base64.decode(image_quality[i].content, true) + "</option>";
                }
                $("#image_quality").html(image_quality_txt);
                init_selectmenu("#image_quality", 200, 150);
                $("#image_quality").selectmenu("refresh");
            } else {
                $("#image_quality_tr").hide();
            }
        }
        var encode_param_arr;
        function new_get_video_support() {
            var cfg = {};
            cfg.type = "AVS_GET_ENCODE_PROP";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    jsondata = jsondata.body;
                    //码流
                    var stream_text = "";
                    var stream_type = jsondata.encode_stream.types;
                    for (var i = 0; i < stream_type.length; i++) {
                        stream_text += "<option value=\"" + stream_type[i].type + "\">" + Base64.decode(stream_type[i].content, true) + "</option>";
                    }
                    $("#default_stream").html(stream_text);
                    init_selectmenu("#default_stream", 200, 150, function (e, object) {
                        default_stream_change(object.value)
                    });
                    encode_param_arr = jsondata.encode_param;
                    new_get_video_para();
                }
            });
        }
        function default_stream_change(stream) {
            var json = get_encode_json(stream, encode_param_arr);
            load_encode_prop(json);
            stream_change(stream);
        }
        function get_video_para(channel) {
            var request_string;
            if (g_support_new_channel_api) {
                request_string = "vb.htm?paratest=bitrate." + channel + "&paratest=framerate." + channel + "&paratest=videosizexy." + channel + "&paratest=mainencodetype." + channel + "&paratest=ratecontrol." + channel + "&paratest=imagequality." + channel;
            }
            else {
                request_string = "vb.htm?paratest=bitrate1&paratest=framerate1&paratest=videosizexy";
            }
            $.get(request_string,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    g_bitrate = parse_ajax_data(response[0]);
                    g_frame_rate = parse_ajax_data(response[1]);
                    g_video_size = parse_ajax_data(response[2]);
                    g_mainencodetype = parse_ajax_data(response[3]);
                    g_ratecontrl = parse_ajax_data(response[4]);
                    g_imagequlity = parse_ajax_data(response[5]);

                    $("#bitrate1").val(g_bitrate);

                    $("#frame_rate").select_val(g_frame_rate - 1);
                    $("#video_size").select_val(g_video_size);
                    $("#encodetype").select_val(g_mainencodetype);
                    $("#rate").select_val(g_ratecontrl);
                    $("#image_quality").select_val(g_imagequlity);

                    encodetype_change(g_mainencodetype, channel);
                });
        }

        function get_json(stream_id, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].stream_id == stream_id) {
                    return arr[i];
                }
            }
        }

        function init_video_para(json) {
            $("#bitrate1").val(json.data_rate / 1000);
            $("#frame_rate").select_val(json.frame_rate);
            $("#video_size").select_val(json.resolution);
            $("#encodetype").select_val(json.encode_type);
            $("#rate").select_val(json.rate_type);
            $("#image_quality").select_val(json.video_quality);

            encodetype_change(json.encode_type);
        }

        function stream_change(val) {
            var json = get_json(val, encode_param);
            init_video_para(json);
        }
        var encode_param;
        var g_default_stream = 0
        function new_get_video_para() {
            var cfg = {};
            cfg.type = "AVS_GET_ENCODE_PARAM";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    jsondata = jsondata.body;
                    var default_stream = g_default_stream;
                    $("#default_stream").select_val(default_stream);
                    encode_param = jsondata.encode_param;
                    default_stream_change(default_stream)
                }
            });
        }

        function new_set_video_para() {
            var default_stream = parseInt($("#default_stream").select_val());
            var data_rate = parseInt($("#bitrate1").val());
            var frame_rate = parseInt($("#frame_rate").select_val());
            var resolution = parseInt($("#video_size").select_val());
            var encode_type = parseInt($("#encodetype").select_val());
            var rate_type = parseInt($("#rate").select_val());
            var video_quality = parseInt($("#image_quality").select_val());

            var json = get_encode_json(default_stream, encode_param_arr);
            data_rate_min = json.data_rate.min / 1000;
            data_rate_max = json.data_rate.max / 1000;

            if (isNaN(data_rate) || data_rate < data_rate_min || data_rate > data_rate_max) {
                show_informer_text($.i18n.prop("range") + data_rate_min + "-" + data_rate_max);
                return false;
            }
            g_default_stream = default_stream
            var cfg = {};
            cfg.type = "AVS_SET_ENCODE_PARAM";
            cfg.body = {};
            cfg.body.default_stream = default_stream;
            cfg.body.encode_param = [];
            var json = {};
            json.stream_id = default_stream;
            json.data_rate = data_rate * 1000;
            json.frame_rate = frame_rate;
            json.resolution = resolution;
            json.encode_type = encode_type;
            json.rate_type = rate_type;
            json.video_quality = video_quality;
            cfg.body.encode_param.push(json);

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                dateType: "text",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                        new_get_video_para();
                    }
                }
            });
        }

        function set_video_para(channel) {
            var video_size_sel = $("#video_size").select_val();
            var frame_rate = parseInt($("#frame_rate").select_val(), 10) + 1;
            var mainencodetype2 = $("#encodetype").select_val();
            var ratecontrl = $("#rate").select_val();
            var image = $("#image_quality").select_val();
            var bitrate = $("#bitrate1").val();
            if (mainencodetype2 == "0" && ratecontrl == "0") {
                if (isNaN(bitrate) || bitrate < 100 || bitrate > 4096) {
                    show_informer_text($.i18n.prop("range") + " 100-4096");
                    return false;
                }
            }

            var request_string = "vb.htm?";

            var hasnew = 0;

            if (bitrate != g_bitrate) {
                request_string += "bitrate=" + bitrate + "." + channel;
                hasnew = 1;
            }

            if (frame_rate != g_frame_rate) {
                if (hasnew) {
                    request_string += "&framerate=" + frame_rate + "." + channel;
                }
                else {
                    request_string += "framerate=" + frame_rate + "." + channel;
                    hasnew = 1;
                }
            }

            if (video_size_sel != g_video_size) {
                if (hasnew) {
                    request_string += "&videosizexy=" + video_size_sel + "." + channel;
                }
                else {
                    request_string += "videosizexy=" + video_size_sel + "." + channel;
                    hasnew = 1;
                }
            }

            if (mainencodetype2 != g_mainencodetype) {
                if (hasnew) {
                    request_string += "&mainencodetype=" + mainencodetype2 + "." + channel;
                }
                else {
                    request_string += "mainencodetype=" + mainencodetype2 + "." + channel;
                    hasnew = 1;
                }
            }

            if (ratecontrl != g_ratecontrl) {
                if (hasnew) {
                    request_string += "&ratecontrol=" + ratecontrl + "." + channel;
                }
                else {
                    request_string += "ratecontrol=" + ratecontrl + "." + channel;
                    hasnew = 1;
                }
            }

            if (image != g_imagequlity) {
                if (hasnew) {
                    request_string += "&imagequality=" + image + "." + channel;
                }
                else {
                    request_string += "imagequality=" + image + "." + channel;
                    hasnew = 1;
                }
            }
            if (hasnew) {
                $.get(request_string, function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                    get_video_para(channel);
                });
            }
        }

        function set_video_para_channel() {
            new_set_video_para();
            if (g_d_type == 3 && g_m_version == 9) {
                set_sei();
            }
        }
        function get_sei() {
            var cfg = {};
            cfg.type = "AVS_GET_MEDIALIB_PRM";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                dateType: "text",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        var sei = jsondata.body.sei;
                        $("#sei").select_val(sei);
                    }
                }
            });
        }
        function set_sei() {
            var sei = parseInt($("#sei").select_val());
            var cfg = {};
            cfg.type = "AVS_SET_MEDIALIB_PRM";
            cfg.body = {};
            cfg.body.sei = sei;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                dateType: "text",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                    }
                }
            });
        }
        var g_flv_enable_auth = false
        var g_mjpeg_enable_auth = false
        var g_flv_enable = false
        var g_mjpeg_enable = false
        function get_ws_stream_cfg() {
            var cfg = {}
            cfg.type = 'get_ws_stream_cfg'
            cfg.module = 'BUS_WEB_REQUEST'
            post(cfg, function (res) {
                var body = res.body
                g_flv_enable = body.flv_enable
                g_flv_enable_auth = body.flv_enable_auth
                g_mjpeg_enable = body.mjpeg_enable
                g_mjpeg_enable_auth = body.mjpeg_enable_auth
                if (g_flv_enable) {
                    $("#flv_enable").check_val(true)
                    $("#video_auth").check_val(g_flv_enable_auth)
                }
                if (g_mjpeg_enable) {
                    $("#mjpeg_enable").check_val(true)
                    $("#video_auth").check_val(g_mjpeg_enable_auth)
                }
            })
        }
        function set_ws_stream_cfg() {
            var flv_enable = false
            var flv_enable_auth = false
            var mjpeg_enable = false
            var mjpeg_enable_auth = false
            var video_auth = $("#video_auth").check_val()
            if ($("#flv_enable").check_val()) {
                flv_enable = true
                mjpeg_enable = false
                flv_enable_auth = video_auth
                mjpeg_enable_auth = g_mjpeg_enable_auth
            }
            if ($("#mjpeg_enable").check_val()) {
                flv_enable = false
                mjpeg_enable = true
                flv_enable_auth = g_flv_enable_auth
                mjpeg_enable_auth = video_auth
            }
            if (g_flv_enable != flv_enable || g_mjpeg_enable != mjpeg_enable || g_flv_enable_auth != flv_enable_auth || g_mjpeg_enable_auth != mjpeg_enable_auth) {
                var cfg = {}
                cfg.type = 'set_ws_stream_cfg'
                cfg.module = 'BUS_WEB_REQUEST'
                cfg.body = {}
                cfg.body.flv_enable = flv_enable
                cfg.body.flv_enable_auth = flv_enable_auth
                cfg.body.mjpeg_enable = mjpeg_enable
                cfg.body.mjpeg_enable_auth = mjpeg_enable_auth
                post(cfg, function (res) {
                    show_informer()
                    get_ws_stream_cfg()
                    if (!ie.isIE) {
                        if (player) {
                            player.stop_video();
                        }
                        player = new VideoPlayer()
                        player.get_video_src("flvVideo", "video", 1)
                    }
                })
            }
        }
        this.init = function () {
            g_default_stream = 0
            $("#video_submit").click(function () {
                var default_stream = parseInt($("#default_stream").select_val());
                var data_rate = parseInt($("#bitrate1").val());

                var json = get_encode_json(default_stream, encode_param_arr);
                data_rate_min = json.data_rate.min / 1000;
                data_rate_max = json.data_rate.max / 1000;

                if (isNaN(data_rate) || data_rate < data_rate_min || data_rate > data_rate_max) {
                    show_informer_text($.i18n.prop("range") + data_rate_min + "-" + data_rate_max);
                    return false;
                }
                set_video_para_channel()
                set_ws_stream_cfg()
            });
            new_get_video_support();
            if (g_d_type == 3 && g_m_version == 9) {
                init_selectmenu("#sei", 200, 150);
                $('.sei').show();
                get_sei();
            }
            $("input[name='video_stream']").click(function () {
                var id = $(this).attr('id')
                var stream = 1
                if (id == 'flv_enable') {
                    stream = 1
                    $("#video_auth").check_val(g_flv_enable_auth == 1)
                } else if (id == 'mjpeg_enable') {
                    stream = 2
                    $("#video_auth").check_val(g_mjpeg_enable_auth == 1)
                }
                $("#default_stream").select_val(stream)
                default_stream_change(stream)
            })
            get_ws_stream_cfg()
        }
    }
    var osd_config = new function () {
        function init_text_pos(op, custom) {
            var date = op.date;
            var datetime = op.datetime;
            var text = op.text;
            var x_pos = custom.x_pos;
            var y_pos = custom.y_pos;
            var custom_enable = false;
            for (var i = 0; i < custom.user_osd_param.length; i++) {
                if (custom.user_osd_param[i].display == 1) {
                    custom_enable = true;
                }
            }

            var dateFormat = date.date_format;
            var dateposition = date.pos;
            var timeFormat = datetime.time_format;
            var timeposition = datetime.pos;
            var nTextPosition = text.pos;
            var text_content = text.context;
            var textX = nTextPosition >>> 16 & 0xFFFF;
            var textY = nTextPosition & 0xFFFF;
            var dateX = dateposition >>> 16 & 0xFFFF;
            var dateY = dateposition & 0xFFFF;
            var timeX = timeposition >>> 16 & 0xFFFF;
            var timeY = timeposition & 0xFFFF;
            var live_w = $("#live").width();
            var live_h = $("#live").height();
            var font_size = Math.ceil(live_h * 36 / 1080);
            var h = parseInt(live_h * 12 / 1080);
            textX = get_ivs_s2i(get_ivs_i2s(textX, 704), live_w);
            dateX = get_ivs_s2i(get_ivs_i2s(dateX, 704), live_w);
            timeX = get_ivs_s2i(get_ivs_i2s(timeX, 704), live_w);
            dateY = get_ivs_s2i(get_ivs_i2s(dateY, 576), live_h);
            timeY = get_ivs_s2i(get_ivs_i2s(timeY, 576), live_h);
            textY = get_ivs_s2i(get_ivs_i2s(textY, 576), live_h);
            x_pos = get_ivs_s2i(get_ivs_i2s(x_pos, 100), live_w);
            y_pos = get_ivs_s2i(get_ivs_i2s(y_pos, 100), live_h);
            var local_date = new Date();
            var ld = local_date.format("MM/DD/YYYY");
            var lt = local_date.format("hh:mm:ss");
            if (date.enable == 1) {
                $("#date").show().css({ "left": dateX, "top": dateY, "font-size": font_size + "px", "line-height": (font_size + h * 2) + "px" }).html(ld);
            } else {
                $("#date").hide();
            }
            if (datetime.enable == 1) {
                $("#time").show().css({ "left": timeX, "top": timeY, "font-size": font_size + "px", "line-height": (font_size + h * 2) + "px" }).html(lt);
            } else {
                $("#time").hide();
            }
            if (text.enable == 1) {
                $("#text").show().css({ "left": textX, "top": textY, "font-size": font_size + "px", "line-height": (font_size + h * 2) + "px" }).html(Base64.decode(text_content, true));
            } else {
                $("#text").hide();
            }
            if (text.enable == 1) {
                $("#text").show().css({ "left": textX, "top": textY, "font-size": font_size + "px", "line-height": (font_size + h * 2) + "px" }).html(Base64.decode(text_content, true));
            } else {
                $("#text").hide();
            }
            if (custom_enable) {
                $("#user").show().css({ "left": x_pos, "top": y_pos, "font-size": font_size + "px", "line-height": (font_size + h * 2) + "px" });
            } else {
                $("#user").hide();
            }
        }
        function disabele_realtime(drawtarget) {
            if (drawtarget == 0) {
                $("#car_info").check_val(false);
                $("#car_info").attr("disabled", "disabled");
            } else {
                $("#car_info").removeAttr("disabled");
            }
        }
        var g_op = null;
        var g_custom = null;
        function new_get_alarm_drawmode() {
            var cfg = {};
            cfg.type = "AVS_GET_OSD_PARAM";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        jsondata = jsondata.body;
                        var rs = jsondata.realtime_show;
                        if (isNotUndefinedOrNull(rs.realtime_result)) {
                            $("#drawtarget").check_val(rs.realtime_result == 1);
                            disabele_realtime(rs.realtime_result);
                        }
                        if (isNotUndefinedOrNull(rs.virtualloop_area)) {
                            $("#drawrule").check_val(rs.virtualloop_area == 1);
                        }
                        // if (isNotUndefinedOrNull(rs.plate_pos)) {
                        //     $("#drawTrajectory").check_val(rs.plate_pos == 1);
                        // }
                        if (isNotUndefinedOrNull(rs.car_info)) {
                            $("#car_info").check_val(rs.car_info == 1);
                        }
                        if ((g_d_type == 3 && (g_m_version == 8 || g_m_version == 11 || g_m_version == 26)) || (g_d_type == 5 && g_m_version == 1)) {
                            if (isNotUndefinedOrNull(rs.extend_on_bottom)) {
                                $("#extend").select_val(rs.extend_on_bottom);
                            }
                        }
                        var op = jsondata.osd_param;
                        var date = op.date;
                        var datetime = op.datetime;
                        var text = op.text;

                        var dateFormat = date.date_format;
                        var dateposition = date.pos;
                        var timeFormat = datetime.time_format;
                        var timeposition = datetime.pos;
                        var nTextPosition = text.pos;
                        var text_content = text.context;
                        var textX = nTextPosition >>> 16 & 0xFFFF;
                        var textY = nTextPosition & 0xFFFF;
                        var dateX = dateposition >>> 16 & 0xFFFF;
                        var dateY = dateposition & 0xFFFF;
                        var timeX = timeposition >>> 16 & 0xFFFF;
                        var timeY = timeposition & 0xFFFF;
                        textX = get_ivs_s2i(get_ivs_i2s(textX, 704), 100);
                        dateX = get_ivs_s2i(get_ivs_i2s(dateX, 704), 100);
                        timeX = get_ivs_s2i(get_ivs_i2s(timeX, 704), 100);
                        dateY = get_ivs_s2i(get_ivs_i2s(dateY, 576), 100);
                        timeY = get_ivs_s2i(get_ivs_i2s(timeY, 576), 100);
                        textY = get_ivs_s2i(get_ivs_i2s(textY, 576), 100);
                        $("#date").attr("x", dateX).attr("y", dateY);
                        $("#time").attr("x", timeX).attr("y", timeY);
                        $("#text").attr("x", textX).attr("y", textY);
                        $("#date_enable").check_val(date.enable == 1);
                        $("#time_enable").check_val(datetime.enable == 1);
                        $("#text_enable").check_val(text.enable == 1);
                        enable_change(date.enable, "date");
                        enable_change(datetime.enable, "time");
                        enable_change(text.enable, "text");
                        $("#date_x").val(dateX);
                        $("#date_y").val(dateY);
                        $("#time_x").val(timeX);
                        $("#time_y").val(timeY);
                        $("#text_x").val(textX);
                        $("#text_y").val(textY);
                        $("#text_content").val(Base64.decode(text_content, true));
                        $("#date_format").select_val(dateFormat);
                        $("#time_format").select_val(timeFormat);
                        g_op = op;
                    }
                }
            });
        }
        var max_length = 60;
        function new_set_alarm_drawmode() {
            var drawtarget = $("#drawtarget").check_val() ? 1 : 0;
            disabele_realtime(drawtarget);
            var drawrule = $("#drawrule").check_val() ? 1 : 0;
            // var drawTrajectory = $("#drawTrajectory").check_val() ? 1 : 0;
            var car_info = $("#car_info").check_val() ? 1 : 0;
            var extend_on_bottom = parseInt($("#extend").select_val());

            var dstampenable = $("#date_enable").check_val() ? 1 : 0;
            var tstampenable = $("#time_enable").check_val() ? 1 : 0;
            var nTextEnable = $("#text_enable").check_val() ? 1 : 0;
            var textX = parseInt($("#text_x").val());
            var textY = parseInt($("#text_y").val());
            var text_content = $("#text_content").val();
            var re = /[\u4E00-\u9FA5]/g;
            var length = 0;
            if (text_content.match(re)) {
                length = text_content.match(re).length;
            }
            var text_length = text_content.length;
            var all_length = length * 2 + (text_length - length);
            if (all_length > max_length) {
                show_informer_text($.i18n.prop("osd_hint") + " 0~" + max_length);
                return;
            }

            var dateFormat = parseInt($("#date_format").select_val());
            var timeFormat = parseInt($("#time_format").select_val());
            var dateX = parseInt($("#date_x").val());
            var dateY = parseInt($("#date_y").val());
            var timeX = parseInt($("#time_x").val());
            var timeY = parseInt($("#time_y").val());

            if (isNaN(textX) || isNaN(textY) || isNaN(dateX) || isNaN(dateY) || isNaN(timeX) || isNaN(timeY) ||
                textX < 0 || textY < 0 || dateX < 0 || dateY < 0 || timeX < 0 || timeY < 0 ||
                textX > 100 || textY > 100 || dateX > 100 || dateY > 100 || timeX > 100 || timeY > 100) {
                show_informer_text($.i18n.prop("coord_hint") + " 0~100");
                return;
            }
            textX = get_ivs_s2i(get_ivs_i2s(textX, 100), 704);
            dateX = get_ivs_s2i(get_ivs_i2s(dateX, 100), 704);
            timeX = get_ivs_s2i(get_ivs_i2s(timeX, 100), 704);
            textY = get_ivs_s2i(get_ivs_i2s(textY, 100), 576);
            dateY = get_ivs_s2i(get_ivs_i2s(dateY, 100), 576);
            timeY = get_ivs_s2i(get_ivs_i2s(timeY, 100), 576);

            var textPosition = ((textX << 16) & 0xFFFF0000) + (textY & 0xFFFF);
            var datePosition = ((dateX << 16) & 0xFFFF0000) + (dateY & 0xFFFF);
            var timePosition = ((timeX << 16) & 0xFFFF0000) + (timeY & 0xFFFF);

            var cfg = {};
            cfg.type = "AVS_SET_OSD_PARAM";
            cfg.body = {};
            cfg.body.realtime_show = {};
            cfg.body.realtime_show.realtime_result = drawtarget;
            cfg.body.realtime_show.virtualloop_area = drawrule;
            // cfg.body.realtime_show.plate_pos = drawTrajectory;
            cfg.body.realtime_show.car_info = car_info;
            cfg.body.realtime_show.extend_on_bottom = extend_on_bottom;

            cfg.body.osd_param = {};
            cfg.body.osd_param.date = {}
            cfg.body.osd_param.date.enable = dstampenable;
            cfg.body.osd_param.date.pos = datePosition;
            cfg.body.osd_param.date.date_format = dateFormat;

            cfg.body.osd_param.datetime = {}
            cfg.body.osd_param.datetime.enable = tstampenable;
            cfg.body.osd_param.datetime.pos = timePosition;
            cfg.body.osd_param.datetime.time_format = timeFormat;

            cfg.body.osd_param.text = {}
            cfg.body.osd_param.text.enable = nTextEnable;
            cfg.body.osd_param.text.pos = textPosition;
            cfg.body.osd_param.text.context = Base64.encode(text_content, true);
            var jsonstr = JSON.stringify(cfg);

            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                        new_get_alarm_drawmode();
                    }
                }
            });
        }
        function set_osd_pos() {
            var flag = false;
            var re = /[\u4E00-\u9FA5]/g;
            for (var i = 0; i < 4; i++) {
                var txt = $("#custom_txt" + (i + 1)).val();
                var length = 0;
                if (txt.match(re)) {
                    length = txt.match(re).length;
                }
                var text_length = txt.length;
                var all_length = length * 2 + (text_length - length);
                if (all_length > max_length) {
                    show_informer_text($.i18n.prop("osd_hint") + " 0~" + max_length);
                    flag = true;
                    break;
                }
            }
            var text_content = $("#text_content").val();
            var length = 0;
            if (text_content.match(re)) {
                length = text_content.match(re).length;
            }
            var text_length = text_content.length;
            var all_length = length * 2 + (text_length - length);
            if (all_length > max_length) {
                show_informer_text($.i18n.prop("osd_hint") + " 0~" + max_length);
                flag = true;
            }
            if (flag) {
                return false;
            }
            if (!ie.isIE || (is_C3 && is_pdns)) {
                $(".txt").each(function () {
                    var id = $(this).attr("id");
                    var x = $(this).attr("x");
                    var y = $(this).attr("y");
                    $("#" + id + "_x").val(x);
                    $("#" + id + "_y").val(y);
                });
                set_custom_osd();
                new_set_alarm_drawmode();
            } else {
                var ax = GetAX("ax");
                if (!ax) return;
                ax.QueryCmd("OSDGetPos", "", "1", function (data) {
                    var json = eval("(" + data + ")");
                    for (var i in json) {
                        $("#" + i).val(json[i]);
                    }
                    set_custom_osd();
                    new_set_alarm_drawmode();
                })
            }
            g_op = null;
            g_custom = null;
            show_txt();
        }
        function enable_change(enable, ele) {
            if (enable == 1) {
                $("." + ele + "_disabled").removeClass("disabled_color");
                $("." + ele + "_disabled *").removeAttr("disabled");
                if (ele != "text") {
                    $("#" + ele + "_format").selectmenu("enable");
                }
            } else {
                $("." + ele + "_disabled").addClass("disabled_color");
                $("." + ele + "_disabled *").attr("disabled", "disabled");
                if (ele != "text") {
                    $("#" + ele + "_format").selectmenu("disable");
                }
            }
        }
        function get_custom_osd() {
            var cfg = {};
            cfg.type = "AVS_GET_OSD_USER_PRM";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    jsondata = jsondata.body.user_osd;
                    g_custom = jsondata;
                    var params = jsondata.user_osd_param;
                    var x_pos = jsondata.x_pos;
                    var y_pos = jsondata.y_pos;
                    $("#user_x").val(x_pos);
                    $("#user_y").val(y_pos);
                    $("#user").attr("x", x_pos).attr("y", y_pos);
                    for (var i = 0; i < params.length; i++) {
                        $("#custom" + (i + 1)).check_val(params[i].display == 1);
                        ele_change(params[i].display, "custom" + (i + 1));
                        $("#color" + (i + 1)).select_val(params[i].color);
                        $("#font" + (i + 1)).select_val(params[i].front_size);
                        $("#custom_txt" + (i + 1)).val(Base64.decode(params[i].text, true));
                    }
                }
            });
        }
        function set_custom_osd() {
            var custom_arr = [];
            for (var i = 0; i < 4; i++) {
                var txt = $("#custom_txt" + (i + 1)).val();
                var json = {};
                json.id = i;
                json.display = $("#custom" + (i + 1)).check_val() ? 1 : 0;
                json.color = parseInt($("#color" + (i + 1)).select_val());
                json.front_size = parseInt($("#font" + (i + 1)).select_val());
                json.text = Base64.encode(txt, true);
                custom_arr.push(json);
            }
            var x_pos = parseInt($("#user_x").val());
            var y_pos = parseInt($("#user_y").val());
            var cfg = {};
            cfg.type = "AVS_SET_OSD_USER_PRM";
            cfg.body = {};
            cfg.body.user_osd = {};
            cfg.body.user_osd.user_osd_param = custom_arr;
            cfg.body.user_osd.x_pos = x_pos;
            cfg.body.user_osd.y_pos = y_pos;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        get_custom_osd();
                    }
                }
            });
        }
        function show_txt() {
            var txt_timer = setInterval(function () {
                if (g_op && g_custom) {
                    init_text_pos(g_op, g_custom);
                    clearInterval(txt_timer);
                }
            }, 1000)
        }
        this.draw_txt = function () {
            if (g_op && g_custom) {
                init_text_pos(g_op, g_custom);
            }
        }
        this.init = function () {
            if (g_d_type === 3 && g_m_version === 9) {
                max_length = 30;
            }
            g_op = null;
            g_custom = null;
            init_selectmenu("#date_format,#time_format,#extend", 200, 150);
            init_selectmenu(".custom_osd select", 60, 150);
            $("#osd_submit").click(set_osd_pos);
            $("#osd_cfg_table input[type='checkbox']").change(function () {
                var enable = $(this).check_val() ? 1 : 0;
                var ele = $(this).attr("id").split("_")[0];
                enable_change(enable, ele);
            });
            $("#drawtarget").change(function () {
                var enable = $(this).check_val() ? 1 : 0;
                disabele_realtime(enable);
            })
            $(".custom_enable input[type='checkbox']").change(function () {
                var id = $(this).attr("id");
                var enable = $(this).check_val() ? 1 : 0;
                ele_change(enable, id);
            })
            get_custom_osd();
            new_get_alarm_drawmode();
            if (!ie.isIE || (is_C3 && is_pdns)) {
                $(window).on("resize", function () {
                    if (g_op && g_custom) {
                        init_text_pos(g_op, g_custom);
                    }
                });
                show_txt();
            }
        }
    }
    var video_source_config = new function () {
        function get_slider_val(name, channel) {
            $.get("vb.htm?paratest=" + name + "." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    val = parseInt(val, 10);
                    if (!isNaN(val)) $("#" + name + "_slider").slider('value', val);
                    else $("#" + name + "_slider").slider("option", "disabled", true);
                });
        }

        function set_slider_val(name, val, channel) {
            //			show_informer_text(name + ":" + val + ":" + channel);
            if ($("#" + name + "_slider").slider("option", "disabled")) return;
            var request_string;
            if (g_support_new_channel_api) {
                request_string = "vb.htm?" + name + "=" + val + "." + channel;
            }
            else {
                request_string = "vb.htm?" + name + "=" + val;
            }
            $.get(request_string,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                    get_slider_val(name, channel);
                });
        }

        function set_slider_val_channel(name, val) {
            set_slider_val(name, val, g_cur_channel);
        }

        function back_to_default_r() {
            var cfg = {};
            cfg.type = "AVS_SET_VIDEO_PARAM";
            cfg.body = {};
            cfg.body.video_param = {};
            cfg.body.video_param.brightness = brightness_default;
            cfg.body.video_param.contrast = contrast_default;
            cfg.body.video_param.saturation = saturation_default;
            cfg.body.video_param.max_gain = max_gain_default;
            cfg.body.video_param.max_exposure = max_exposure_default;
            // cfg.body.video_param.motion_comp = motion_comp_default;
            if (g_m_version != 6) {
                cfg.body.video_param.flip = flip_default;
            }

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                        get_video_param();
                    }
                }
            })
        }

        function back_to_default_channel() {
            back_to_default_r();
        }

        function get_flip(channel) {
            $.get("vb.htm?paratest=flip." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#flip").select_val(val);
                });
        }

        function set_flip(value, channel) {
            $.get("vb.htm?flip=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_nightmode(channel) {
            $.get("vb.htm?paratest=nightmode." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#nightmode").select_val(val);
                });
        }

        function set_nightmode(value, channel) {
            $.get("vb.htm?nightmode=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }
        //8127
        function get_image2a(channel) {
            $.get("vb.htm?paratest=img2a." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#aewb_vendor").select_val(val);
                });
        }

        function set_image2a(channel) {
            var val = $("#aewb_vendor").select_val();
            $.get("vb.htm?img2a=" + val + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_image2atype(channel) {
            $.get("vb.htm?paratest=img2atype." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#ae_enable").check_val((val & 0x0001) != 0);
                    $("#awb_enable").check_val((val & 0x0002) != 0);
                });
        }

        function set_image2atype(channel) {
            var v1 = ($("#ae_enable").check_val() ? 1 : 0) << 1;
            var v2 = ($("#awb_enable").check_val() ? 1 : 0);
            var val = (($("#ae_enable").check_val() ? 1 : 0) << 1) + (($("#awb_enable").check_val() ? 1 : 0));
            $.get("vb.htm?img2atype=" + val + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_awb(channel) {
            $.get("vb.htm?paratest=awb." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#awb").select_val(val);
                });
        }

        function set_awb(value, channel) {
            $.get("vb.htm?awb=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_hdrmode(channel) {
            $.get("vb.htm?paratest=hdrmode." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#hdrmode").select_val(val);
                });
        }

        function set_hdrmode(channel) {
            var value = $("#hdrmode").select_val();
            $.get("vb.htm?hdrmode=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_colorkiller(channel) {
            $.get("vb.htm?paratest=colorkiller." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#colorkiller").select_val(val);
                });
        }

        function set_colorkiller(value, channel) {
            $.get("vb.htm?colorkiller=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_frequency(channel) {
            $.get("vb.htm?paratest=frquency." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#frequency").select_val(val);
                });
        }

        function set_frequency(value, channel) {
            $.get("vb.htm?frquency=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function set_shutter(value, channel) {
            $.get("vb.htm?shutter=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_shutter(channel) {
            $.get("vb.htm?paratest=shutter." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#shutter").select_val(val);
                });
        }
        function set_maxexposuretime(value, channel) {
            $.get("vb.htm?maxexposuretime=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_maxexposuretime(channel) {
            $.get("vb.htm?paratest=maxexposuretime." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#shutter").select_val(val);
                });
        }
        function set_nfmode(value, channel) {
            var value = $("#nf_enable").select_val();//0 nsf,2 off
            $.get("vb.htm?nfmode=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_nfmode(channel) {
            $.get("vb.htm?paratest=nfmode." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#nf_enable").select_val(val);
                });
        }

        function set_nftsenable(value, channel) {
            $.get("vb.htm?nftsenable=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }

        function get_nftsenable(channel) {
            $.get("vb.htm?paratest=nftsenable." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#nftsenable").select_val(val);
                });
        }

        function set_nfstrength(value, channel) {
            $.get("vb.htm?denoise=" + value + "." + channel,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }



        function get_nfstrength(channel) {
            $.get("vb.htm?paratest=denoise." + channel,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#nfstrength").select_val(val);
                });
        }
        function get_showmodel() {
            $.get("vb.htm?getxlrswitch",
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    response = ajaxdata.split("\n");
                    var val = parse_ajax_data(response[0]);
                    $("#showmodel").select_val(val);
                })
        }
        function set_showmodel(val) {
            $.get("vb.htm?setxlrswitch=" + val,
                function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                });
        }
        var brightness_default = 0;
        var contrast_default = 0;
        var saturation_default = 0;
        var max_gain_default = 0;
        var max_exposure_default = 0;
        var flip_default = 0;
        // var motion_comp_default = 0;
        function get_video_param_support() {
            var cfg = {};
            cfg.type = "AVS_GET_VIDEO_PARAM_PROPERTY";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    jsondata = jsondata.body;
                    var brightness_min = jsondata.brightness.min;
                    var brightness_max = jsondata.brightness.max;
                    brightness_default = jsondata.brightness["default"];
                    init_slider("brightness", brightness_min, brightness_max);

                    var contrast_min = jsondata.contrast.min;
                    var contrast_max = jsondata.contrast.max;
                    contrast_default = jsondata.contrast["default"];
                    init_slider("contrast", contrast_min, contrast_max);

                    var saturation_min = jsondata.saturation.min;
                    var saturation_max = jsondata.saturation.max;
                    saturation_default = jsondata.saturation["default"];
                    init_slider("saturation", saturation_min, saturation_max);

                    var max_gain_min = jsondata.max_gain.min;
                    var max_gain_max = jsondata.max_gain.max;
                    max_gain_default = jsondata.max_gain["default"];
                    init_slider("max_gain", max_gain_min, max_gain_max);

                    var max_exposure = jsondata.max_exposure.types;
                    max_exposure_default = jsondata.max_exposure["default"];
                    var max_exposure_text = "";
                    for (var i = 0; i < max_exposure.length; i++) {
                        max_exposure_text += "<option value='" + max_exposure[i].type + "'>" + max_exposure[i].content + "</option>";
                    }
                    $("#shutter").html(max_exposure_text);
                    init_selectmenu("#shutter", 200, 150, function (e, object) {
                        video_source_config.set_video_param("max_exposure", parseInt(object.value));
                    });

                    var flip = jsondata.flip.types;
                    flip_default = jsondata.flip["default"];
                    var flip_text = "";
                    for (var i = 0; i < flip.length; i++) {
                        flip_text += "<option value='" + flip[i].type + "'>" + Base64.decode(flip[i].content, true) + "</option>";
                    }
                    $("#flip").html(flip_text);
                    init_selectmenu("#flip", 200, 150, function (e, object) {
                        video_source_config.set_video_param("flip", parseInt(object.value));
                    });

                    // var motion_comp = jsondata.motion_comp.types;
                    // motion_comp_default = jsondata.motion_comp["default"];
                    // var motion_comp_text = "";
                    // for (var i = 0; i < motion_comp.length; i++) {
                    //     motion_comp_text += "<option value='" + motion_comp[i].type + "'>" + Base64.decode(motion_comp[i].content, true) + "</option>";
                    // }
                    // $("#motion_comp").html(motion_comp_text);
                    // init_selectmenu("#motion_comp", 200, 150, function (e, object) {
                    //     video_source_config.set_video_param("motion_comp", parseInt(object.value));
                    // });
                    get_video_param();
                }
            });
        }
        function get_video_param() {
            var cfg = {};
            cfg.type = "AVS_GET_VIDEO_PARAM";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    var vp = jsondata.body.video_param;

                    var brightness = vp.brightness;
                    var contrast = vp.contrast;
                    var saturation = vp.saturation;
                    var max_gain = vp.max_gain;
                    var max_exposure = vp.max_exposure;
                    var flip = vp.flip;
                    // var motion_comp = vp.motion_comp;

                    set_slider("brightness", brightness);
                    set_slider("contrast", contrast);
                    set_slider("saturation", saturation);
                    set_slider("max_gain", max_gain);
                    $("#shutter").select_val(max_exposure);
                    $("#flip").select_val(flip);
                    // $("#motion_comp").select_val(motion_comp);
                }
            })
        }
        this.set_video_param = function (key, val) {
            var cfg = {};
            cfg.type = "AVS_SET_VIDEO_PARAM";
            cfg.body = {};
            cfg.body.video_param = {};
            cfg.body.video_param[key] = val;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                        get_video_param();
                    }
                }
            })
        }
        this.init = function () {
            get_device_type();
            $("#hue_slider").parent().parent().remove();
            $("#exposure_slider").parent().parent().remove();
            $("#sharpness_slider").parent().parent().remove();
            get_video_param_support();
            $("#back_to_default").click(back_to_default_channel);
        }
    }
    var voice_config = new function () {
        function get_platefiltermode() {
            var cmd, len, data;
            cmd = 4;
            data = "0";
            len = data.length;
            var base64 = Base64.encode(data);
            var senddata = cmd + ":" + len + ":" + base64;
            $.ajax({
                type: "POST",
                url: "getivsctrl.php",
                data: senddata,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    if ("OK" != ajaxdata.slice(0, 2)) return false;
                    var decode = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                    decode = decode.split(":");
                    decode = Base64.decode(decode[2]);
                    decode = parseInt(decode);
                    var mask = 0x1;
                    var bOutIo1 = decode & (mask << 4);
                    var bOutIo2 = decode & (mask << 5);
                    var bOutIo3 = decode & (mask << 6);
                    var bOutIo4 = decode & (mask << 7);

                    if (bOutIo1 > 0) {
                        $("#talk_out_io1").check_disabled(true);
                    }
                    if (bOutIo2 > 0) {
                        $("#talk_out_io2").check_disabled(true);
                    }
                    if (bOutIo3 > 0) {
                        $("#talk_out_io3").check_disabled(true);
                    }
                    if (bOutIo4 > 0) {
                        $("#talk_out_io4").check_disabled(true);
                    }
                },
                dataType: "text"
            });
        }
        var g_gpio = null;
        function evs_get_gpioin() {
            var cfg = {};
            cfg.type = "evs_get_gpioin_func";
            cfg.module = "EVS_BUS_REQUEST";
            post(cfg, function (jsondata) {
                g_gpio = jsondata.body;
                $("#talk_out_io0").check_val(true);
                for (var i = 0; i < g_gpio.length; i++) {
                    if (g_gpio[i].is_enable == 1) {
                        if (g_gpio[i].msg_module == 'PS_TALK_REQUESTION') {
                            $("#talk_out_io" + (g_gpio[i].source + 1)).check_val(true);
                        }
                    }
                }
            })
        }
        function evs_set_gpioin() {
            for (var i = 0; i < g_gpio.length; i++) {
                if ($("#talk_out_io" + (g_gpio[i].source + 1)).check_val()) {
                    g_gpio[i].is_enable = 1;
                    g_gpio[i].msg_type = {
                        "type": "AVS_TALK_REQUEST"
                    };
                    g_gpio[i].msg_module = 'PS_TALK_REQUESTION';
                } else {
                    if (g_gpio[i].msg_module == 'PS_TALK_REQUESTION') {
                        g_gpio[i].is_enable = 0;
                    }
                }
            }
            var cfg = {};
            cfg.type = "evs_set_gpioin_func";
            cfg.module = "EVS_BUS_REQUEST";
            cfg.body = g_gpio;
            post(cfg, function (jsondata) {
                show_informer();
                evs_get_gpioin();
            })
        }
        function get_audio_param() {
            var cfg = {};
            cfg.type = "AVS_GET_AUDIO_PRM";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "getvoiceinfo.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        var bd = jsondata.body;
                        var audio_input = bd.audio_input;
                        var audio_level = bd.audio_level;
                        var audio_out_level = bd.audio_out_level;
                        var noise_filter = bd.noise_filter;
                        set_slider("audio_level", audio_level);
                        set_slider("audio_out_level", audio_out_level);
                        $("#audio_input").select_val(audio_input);
                        $("#noise_filter").select_val(noise_filter);
                    }
                }
            })
        }
        function set_audio_param() {
            var audio_level = parseInt($("#audio_level_text").html());
            var audio_out_level = parseInt($("#audio_out_level_text").html());
            var audio_input = parseInt($("#audio_input").select_val());
            var noise_filter = parseInt($("#noise_filter").select_val());
            var cfg = {};
            cfg.type = "AVS_SET_AUDIO_PRM";
            cfg.body = {};
            cfg.body.audio_level = audio_level;
            cfg.body.audio_out_level = audio_out_level;
            cfg.body.audio_input = audio_input;
            cfg.body.noise_filter = noise_filter;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "getvoiceinfo.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                    }
                }
            })
        }
        function get_audio_param_support() {
            var cfg = {};
            cfg.type = "AVS_GET_AUDIO_PROP";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "getvoiceinfo.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        jsondata = jsondata.body;
                        var audio_level_min = jsondata.audio_level.min;
                        var audio_level_max = jsondata.audio_level.max;
                        init_slider("audio_level", audio_level_min, audio_level_max, set_audio_param);

                        var audio_out_level_min = jsondata.audio_out_level.min;
                        var audio_out_level_max = jsondata.audio_out_level.max;
                        init_slider("audio_out_level", audio_out_level_min, audio_out_level_max, set_audio_param);

                        var audio_input = jsondata.audio_input.types;
                        var audio_input_text = "";
                        for (var i = 0; i < audio_input.length; i++) {
                            audio_input_text += "<option value='" + audio_input[i].type + "'>" + Base64.decode(audio_input[i].content, true) + "</option>";
                        }
                        $("#audio_input").html(audio_input_text);
                        init_selectmenu("#audio_input", 200, 150, function (e, object) {
                            set_audio_param();
                        });

                        var noise_filter = jsondata.noise_filter.types;
                        var noise_filter_text = "";
                        for (var i = 0; i < noise_filter.length; i++) {
                            noise_filter_text += "<option value='" + noise_filter[i].type + "'>" + Base64.decode(noise_filter[i].content, true) + "</option>";
                        }
                        $("#noise_filter").html(noise_filter_text);
                        init_selectmenu("#noise_filter", 200, 150, function (e, object) {
                            set_audio_param();
                        });
                        get_audio_param();
                    }
                }
            });
        }
        this.init = function () {
            get_platefiltermode();
            $(".talk").change(evs_set_gpioin);
            SetPlateDeviceIO.gpio.get_addition_gpio();
            DeviceGroup.get_group_shared_io();
            evs_get_gpioin();
            get_audio_param_support();
        }
    }
    function get_boardversion_info(d_type, m_version, s_version) {
        get_device_capacity(function () {
            if (m_version == 9) {
                //CPRO删除扩展区域位置
                $("#extend_td").remove();
            }
            if (g_style_time == "new") {
                $("#li_for_voice_config").remove();
                $("#voice_config").remove();
            } else {
                if (audio_num == 0) {
                    $("#li_for_voice_config").remove();
                    $("#voice_config").remove();
                } else {
                    voice_config.init();
                }
            }
        });
    }
    var is_max = false;
    function show_max_video() {
        var rw = $(window).width();
        var rh = $(window).height();
        var h = 0;
        var w = 0;

        if (!is_max) {
            $("#live").height(rh).width(rw).css({ "position": "fixed", "left": w, "top": h, "z-index": 999 });
        } else {
            $("#live").css({ "position": "relative", "left": 0, "top": 0, "width": "100%" });
            window.onresize();
        }
        if (cur_osd) {
            osd_config.draw_txt()
        }
        is_max = !is_max;
        if (player != null) {
            player.resize();
        }
    }
    function init_para() {
        is_max = false;
    }
    var downobj = null;
    var old_x = 0;
    var old_y = 0;
    //点击文字事件
    function txt_mousedown(event) {
        var e = event || window.event;
        var p_l = $("#live").offset().left;
        var p_t = $("#live").offset().top;
        old_x = e.pageX - p_l;
        old_y = e.pageY - p_t;
        circle_down = true;
        downobj = $(this);
        return false;
    }
    //松开鼠标事件
    function txt_mouseup() {
        downobj = null;
    }
    function txt_mousemove(event) {
        var e = event || window.event;
        if (!downobj) {
            return false;
        }
        var p_l = $("#live").offset().left;
        var p_t = $("#live").offset().top;
        var x = e.pageX - p_l;
        var y = e.pageY - p_t;
        var left = parseInt(downobj.css("left").split("px")[0]);
        var top = parseInt(downobj.css("top").split("px")[0]);
        var c_x = x - old_x;
        var c_y = y - old_y;
        var new_top = top + c_y;
        var new_left = left + c_x;
        var live_h = $("#live").height();
        var live_w = $("#live").width();
        var obj_h = downobj.height();
        if (new_top < 0) {
            new_top = 0;
        }
        if (new_top > (live_h - obj_h)) {
            new_top = live_h - obj_h;
        }
        if (new_left < 0) {
            new_left = 0;
        }
        downobj.css({ "left": new_left, "top": new_top });
        old_x = x;
        old_y = y;
        var obj_x = get_ivs_s2i(get_ivs_i2s(new_left, live_w), 100);
        var obj_y = get_ivs_s2i(get_ivs_i2s(new_top, live_h), 100);
        downobj.attr("x", obj_x);
        downobj.attr("y", obj_y);
    }
    var cur_osd;
    var player = null
    this.init = function () {
        init_para();
        init_activex_new("#live", 1, 0, function () {
            activex_play_new(0, 0);
        });
        if (!ie.isIE || (is_C3 && is_pdns)) {
            player = new VideoPlayer()
            player.get_video_src("flvVideo", "video", 1)
            $("#live").dblclick(show_max_video);
            $(document).on("mousedown", ".txt", txt_mousedown);
            $(document).mouseup(txt_mouseup);
            $("#live").mousemove(txt_mousemove);
        }
        get_boardversion_info(g_d_type, g_m_version, g_s_version);
        new_main_stream_video_encoder_config.init();
        osd_config.init();
        video_source_config.init();
        create_tabs("#video_tabs");
        $("#video_tabs a").click(function () {
            var id = $(this).attr("id");
            if (id == "ods_a") {
                cur_osd = true
                if (!ie.isIE || (is_C3 && is_pdns)) {
                    osd_config.draw_txt()
                } else {
                    var ax = GetAX("ax");
                    if (!ax) return;
                    ax.QueryCmd("ShowOSD", "1", "1", function (data) {
                        var json = eval("(" + data + ")");
                        for (var i in json) {
                            $("#" + i).val(json[i]);
                        }
                        new_set_alarm_drawmode();
                    })
                }
            } else {
                cur_osd = false
                if (!ie.isIE || (is_C3 && is_pdns)) {
                    $(".txt").hide();
                } else {
                    var ax = GetAX("ax");
                    if (!ax) return;
                    ax.QueryCmd("ShowOSD", "0", "1", function (data) {
                        var json = eval("(" + data + ")");
                        for (var i in json) {
                            $("#" + i).val(json[i]);
                        }
                        new_set_alarm_drawmode();
                    })
                }
            }
        });
        $("#ods_a").click();
        cur_osd = true
    }
    this.close = function () {
        $(document).off("mousedown", ".txt");
        stop_video();
    }
    close_json["SetVideo"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetNetPort
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var SetNetPort = new function () {
    //取iframe的innerHTML
    function getIFrameContent(id) {
        var hidden_fr = document.getElementById(id);
        if (document.getElementById) {
            if (hidden_fr && !window.opera) {
                if (hidden_fr.contentDocument) {
                    return hidden_fr.contentDocument.body.innerHTML;
                } else if (hidden_fr.Document) {
                    return hidden_fr.Document.body.innerHTML;
                }
            }
        }
    }
    function _ip2int(ip) {
        var num = 0;
        ip = ip.split(".");
        num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
        num = num >>> 0;
        return num;
    }
    this.basis = new function () {
        var g_ip = null;
        var g_nm = null;
        var g_gw = null;
        var g_dns = null;

        var redirect_ip_timer = 0;
        var newloc = null;
        function redirect_ip_go() {
            clearTimeout(redirect_ip_timer);
            redirect_ip_timer = 0;
            $('#warning_text').html("");
            top.location.href = newloc;
        }
        function redirect_ip() {
            hide_informer();
            show_informer($.i18n.prop("ip_change_hint"), 100000);
            if (redirect_ip_timer == 0) {
                redirect_ip_timer = setTimeout(redirect_ip_go, 3000);
            }
        }
        function check_gateway(ip, nm, gw) {
            var ip_int = _ip2int(ip);
            var nm_int = _ip2int(nm);
            var gw_int = _ip2int(gw);
            if ((nm_int & ip_int) != (nm_int & gw_int)) {
                return false;
            }
            return true;
        }
        var g_http_port = null;
        var g_rtsp_port = null;
        this.new_get_netip = function () {
            var cfg = {};
            cfg.type = "get_net_and_port";
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    json = json.body;
                    g_ip = json.ip;
                    g_nm = json.netmask;
                    g_gw = json.gateway;
                    g_dns = json.dns;
                    g_dns2 = json.dns2;
                    g_http_port = json.http_port;
                    g_rtsp_port = json.rtsp_port;
                    $("#input_netip").val(g_ip);
                    $("#ivs_netip").html(g_ip);
                    $("#input_netmask").val(g_nm);
                    $("#input_gateway").val(g_gw);
                    $("#input_dnsip").val(g_dns);
                    $("#input_dnsip2").val(g_dns2);
                    $("#http_port").val(g_http_port);
                    $("#rtsp_port").val(g_rtsp_port);
                }
            });
        }
        function set_ip(ip, nm, gw, dns, dns2, http_port, rtsp_port) {
            var cfg = {};
            cfg.type = "set_net_and_port";
            cfg.body = {};
            cfg.body.ip = ip;
            cfg.body.netmask = nm;
            cfg.body.gateway = gw;
            cfg.body.dns = dns;
            cfg.body.dns2 = dns2;
            cfg.body.http_port = http_port;
            cfg.body.rtsp_port = rtsp_port;
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                        SetNetPort.basis.new_get_netip();
                    }
                }
            });
        }
        function get_net_ip_valid(ip, netmask, gw, callback) {
            var cfg = {}
            cfg.type = "get_net_ip_valid"
            cfg.body = {};
            cfg.body.ip = ip;
            cfg.body.netmask = netmask;
            cfg.body.gateway = gw;
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                timeout: 20000,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        var ipvalid = json.body.ipvalid;
                        if (ipvalid == 0) {
                            if (confirm($.i18n.prop('ip_hint'))) {
                                if (callback) {
                                    callback()
                                }
                            }
                        } else {
                            if (callback) {
                                callback()
                            }
                        }
                    }
                }
            });
        }
        this.new_set_netip = function () {
            var ip = $("#input_netip").val();
            var netmask = $("#input_netmask").val();
            var gw = $("#input_gateway").val();
            var dns = $("#input_dnsip").val();
            var dns2 = $("#input_dnsip2").val();
            if ($.trim(dns2) == "") {
                dns2 = "0.0.0.0";
            }
            var http_port = $("#http_port").val();
            var rtsp_port = $("#rtsp_port").val();
            if (isNaN(http_port) || (http_port < 1024 && http_port != 80) || http_port > 65535) {
                show_informer_text($.i18n.prop("port_error"));
                return false;
            }

            if (http_port == 49152 || http_port == 8000 || http_port == 8131 || http_port == 5291 || http_port == 5294 || http_port == 5295 || http_port == 2705 || http_port == 2707 || http_port == 3702 || http_port == 5310 || http_port == 5314 || http_port == 5320 || http_port == 5322 || http_port == 5566 || http_port == 5567 || http_port == 9080 || http_port == 22100 || http_port == 24100 || http_port == 27101 || http_port == 60606 || http_port == g_rtsp_port) {
                show_informer_text($.i18n.prop("port_used"));
                return false;
            }
            if (isNaN(rtsp_port) || (rtsp_port <= 1024 && rtsp_port != 554) || rtsp_port > 65535) {
                show_informer_text($.i18n.prop("port_error"));
                return false;
            }

            if (rtsp_port == 49152 || rtsp_port == 8000 || rtsp_port == 8131 || rtsp_port == 5291 || rtsp_port == 5294 || rtsp_port == 5295 || rtsp_port == 2705 || rtsp_port == 2707 || rtsp_port == 3702 || rtsp_port == 5310 || rtsp_port == 5314 || rtsp_port == 5320 || rtsp_port == 5322 || rtsp_port == 5566 || rtsp_port == 5567 || rtsp_port == 9080 || rtsp_port == 22100 || rtsp_port == 24100 || rtsp_port == 27101 || rtsp_port == 60606 || rtsp_port == g_http_port) {
                show_informer_text($.i18n.prop("port_used"));
                return false;
            }
            if (!test_ip(ip)) {
                show_informer_text($.i18n.prop("address_error"));
                $("#input_netip").val(g_ip);
                return false;
            }
            if (!test_ip(netmask)) {
                show_informer_text($.i18n.prop('network_mask_error'));
                return false;
            }
            if (!test_ip(gw)) {
                show_informer_text($.i18n.prop('gateway_error'));
                return false;
            }
            if (!test_ip(dns)) {
                show_informer_text($.i18n.prop('dns_error'));
                return false;
            }
            if (!test_ip(dns2)) {
                show_informer_text($.i18n.prop('dns2_error'));
                return false;
            }
            if (ip != g_ip || netmask != g_nm || gw != g_gw) {
                get_net_ip_valid(ip, netmask, gw, function () {
                    new_set_netip_submit();
                })
            } else {
                new_set_netip_submit();
            }
        }
        function new_set_netip_submit() {
            var ip = $("#input_netip").val();
            var netmask = $("#input_netmask").val();
            var gw = $("#input_gateway").val();
            var dns = $("#input_dnsip").val();
            var dns2 = $("#input_dnsip2").val();
            if ($.trim(dns2) == "") {
                dns2 = "0.0.0.0";
            }
            var http_port = $("#http_port").val();
            var rtsp_port = $("#rtsp_port").val();
            http_port = parseInt(http_port);
            rtsp_port = parseInt(rtsp_port);
            var send = false;
            if (ip != g_ip || netmask != g_nm || gw != g_gw || dns != g_dns || dns2 != g_dns2 || http_port != g_http_port || rtsp_port != g_rtsp_port) {
                send = true;
            }
            var ipchanged = false;
            if (ip != g_ip || http_port != g_http_port) {
                ipchanged = true;
            }

            if (send) {
                var href = top.location.href;
                if (!is_pdns || (is_pdns && !ipchanged)) {
                    set_ip(ip, netmask, gw, dns, dns2, http_port, rtsp_port);
                }
                if (ipchanged) {
                    var http_str = "http://";
                    if (!is_pdns) {
                        var str = "";
                        var href = location.href;
                        if (href.match(/userdata=pdns/)) {
                            str = "?userdata=pdns";
                        }
                        str = "/login.htm" + str;
                        newloc = http_str + ip + ":" + http_port + str;
                        redirect_ip();
                    } else {
                        get_new_addr(parseInt(http_port), function (data) {
                            set_ip(ip, netmask, gw, dns, dns2, http_port, rtsp_port);
                            newloc = http_str + data + "/" + g_device_sn + "/?userdata=pdns";
                            var url = http_str + data + "/" + g_device_sn + "/vb.htm?gethwinfo";
                            var get_timer = setInterval(function () {
                                $.ajax({
                                    type: "GET",
                                    url: url,
                                    timeout: 5000,
                                    success: function (ajaxdata) {
                                        clearInterval(get_timer);
                                        redirect_ip();
                                    }
                                });
                            }, 10000);
                        });
                    }
                }
            }
        }
        this.init = function () {
            $("#new_ip_submit").click(SetNetPort.basis.new_set_netip);
            SetNetPort.basis.new_get_netip();
        }
    }
    var cmd_timer = null;
    var cmd_flag = false;
    var diag = new function () {
        function get_cmd() {
            $.ajax({
                type: 'GET',
                url: "cmd_res?" + new Date().getTime(),
                timeout: 5000,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var str_arr = ajaxdata.split("\n");
                    var str = "";
                    for (var i = 0; i < str_arr.length; i++) {
                        str += str_arr[i];
                        str += "<br/>";
                    }
                    $("#cmd_container").html(str);
                    $("#cmd_container")[0].scrollTop = $("#cmd_container")[0].scrollHeight - $("#cmd_container").height();
                }
            });
        }
        function get_cmd_result() {
            cmd_timer = setInterval(function () {
                if (cmd_flag) {
                    get_cmd();
                }
            }, 100);
        }
        var killall = "killall ping traceroute nslookup";
        function execute(command, callback) {
            var cfg = {};
            cfg.type = "ss_help_network";
            cfg.body = {};
            cfg.body.cmd = command;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        if (callback) {
                            setTimeout(function () {
                                callback();
                            }, 1000)
                        }
                    }
                }
            });
        }
        var old_command = "";
        function execute_submit() {
            var command = $("#command").val();
            var re = /[\u4E00-\u9FA5]/g;
            if ((!command.match(/ping/) && !command.match(/traceroute/) && !command.match(/nslookup/)) || command.match(re) || !command.match(/^[^&*;']+$/)) {
                show_informer_text($.i18n.prop("only_support") + " ping、traceroute、nslookup");
                return;
            }
            cmd_flag = true;
            if (command.match(/ping/) && !command.match(/-w/)) {
                command += " -w 200";
            }
            stop_execute(command, function () {
                execute(command);
            });
        }
        function stop_execute(command, callback) {
            execute(killall, callback);
        }
        function stop_submit() {
            stop_execute(old_command);
            cmd_flag = false;
        }
        this.init = function () {
            $("#execute").click(execute_submit);
            $("#stop").click(stop_submit);
            get_cmd_result();
        }
    }
    var discover = new function () {
        function get_discover() {
            var cfg = {};
            cfg.type = "get_discover";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        var mode = json.body.discover_mode;
                        $("#discover_mode").select_val(mode);
                    }
                }
            });
        }
        function set_discover() {
            var mode = parseInt($("#discover_mode").select_val());
            var cfg = {};
            cfg.type = "set_discover";
            cfg.body = {};
            cfg.body.discover_mode = mode;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                        get_discover();
                    }
                }
            });
        }
        this.init = function () {
            init_selectmenu("#discover_mode", 250, 150);
            $("#discover_submit").click(set_discover);
            get_discover();
        }
    }
    var http_test_timer = null;
    var centerserver_tab = new function () {
        var g_centerserver_hostname = null;
        var g_centerserver_port = null;
        var g_centerserver_enable_ssl = null;
        var g_centerserver_ssl_port = null;
        var g_centerserver_timeout = null;
        var g_centerserver_enable = null;
        var g_centerserver_device_reg_uri = null;
        var g_centerserver_plate_enable = null;
        var g_centerserver_plate_retran = null;
        var g_centerserver_plate_uri = null;
        var g_centerserver_plateResultLevel = null;
        var g_centerserver_bSendImage = null;
        var g_centerserver_bSendSmallImage = null;
        var g_centerserver_gioin_enable = null;
        var g_centerserver_gioin_uri = null;
        var g_centerserver_serial_enable = null;
        var g_centerserver_serial_uri = null;
        var g_centerserver_hostname_alt = null;
        var g_centerserver_etc_enable = null;
        var g_centerserver_etc_uri = null;
        function offline_change(enable, ele) {
            if (enable == 1) {
                $("." + ele).removeClass("disabled_color");
                $("#httprepushnums_sel").selectmenu("enable");
            } else {
                $("." + ele).addClass("disabled_color");
                $("#httprepushnums_sel").selectmenu("disable");
            }
        }
        function get_http_config_all() {
            var json_req = {};
            json_req.type = "get_http_cfg";
            $.get("vb.htm?gethttpconfigall=" + JSON.stringify(json_req), function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;

                var json_data;
                ajaxdata = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                try {
                    json_data = eval("(" + ajaxdata + ")");
                    json_data = json_data.body;
                    var json_cs;
                    json_cs = json_data.centerserver;
                    g_centerserver_hostname = Base64.decode(json_cs.hostname, true);
                    g_centerserver_port = json_cs.port;
                    g_centerserver_enable_ssl = json_cs.enable_ssl;
                    g_centerserver_ssl_port = json_cs.ssl_port;
                    g_centerserver_timeout = json_cs.http_timeout;

                    $("#centerserver_hostname").val(g_centerserver_hostname);
                    $("#centerserver_port").val(g_centerserver_port);
                    $("#centerserver_enable_ssl").check_val(g_centerserver_enable_ssl == 1);
                    ele_change(g_centerserver_enable_ssl, "ssl_disabled");
                    $("#centerserver_ssl_port").val(g_centerserver_ssl_port);
                    $("#centerserver_timeout").val(g_centerserver_timeout);

                    var json_cs_dev_reg;
                    json_cs_dev_reg = json_data.cs_dev_reg;
                    var enable = 1;
                    if (json_cs_dev_reg.enable == 1) {
                        $("#centerserver_device_reg_enable2").check_val(true);
                    } else if (json_cs_dev_reg.enable == 2) {
                        $("#centerserver_device_reg_enable3").check_val(true);
                    } else {
                        enable = 0;
                        $("#centerserver_device_reg_enable1").check_val(true);
                    }
                    // show_delay_time(json_cs_dev_reg.enable)
                    // if(json_cs_dev_reg['resend_delay_time']){
                    //   $("#resend_delay_time").val(json_cs_dev_reg['resend_delay_time'])
                    // }
                    ele_change(enable, "poll_disabled");
                    g_centerserver_enable = json_cs_dev_reg.enable;
                    g_centerserver_device_reg_uri = Base64.decode(json_cs_dev_reg.uri, true);
                    $("#centerserver_device_reg_uri").val(g_centerserver_device_reg_uri);

                    var json_cs_plate;
                    json_cs_plate = json_data.cs_alarm_plate;
                    g_centerserver_plate_enable = json_cs_plate.enable;
                    g_centerserver_plate_uri = Base64.decode(json_cs_plate.uri, true);
                    g_centerserver_plateResultLevel = json_cs_plate.plate_rlt_level;
                    g_centerserver_bSendImage = json_cs_plate.big_img;
                    g_centerserver_bSendSmallImage = json_cs_plate.small_img;

                    g_centerserver_plate_retran = json_cs_plate.retransmission;
                    $("#centerserver_plate_enable").check_val(json_cs_plate.enable == 1);
                    ele_change(g_centerserver_plate_enable, "plate_disabled");
                    $("#centerserver_plate_retran").check_val(g_centerserver_plate_retran == 1);
                    $("#centerserver_plate_uri").val(g_centerserver_plate_uri);
                    $("#centerserver_plate_content_level").select_val(json_cs_plate.plate_rlt_level);
                    $("#centerserver_plate_send_image").check_val(json_cs_plate.big_img == 1);
                    $("#centerserver_plate_send_small_image").check_val(json_cs_plate.small_img == 1);

                    var json_cs_gioin;
                    json_cs_gioin = json_data.cs_alarm_gioin;
                    g_centerserver_gioin_enable = json_cs_gioin.enable;
                    g_centerserver_gioin_uri = Base64.decode(json_cs_gioin.uri, true);

                    $("#centerserver_gioin_enable").check_val(json_cs_gioin.enable == 1);
                    ele_change(g_centerserver_gioin_enable, "gioin_disabled");
                    $("#centerserver_gioin_uri").val(g_centerserver_gioin_uri);

                    var json_cs_serial;
                    json_cs_serial = json_data.cs_serial;
                    g_centerserver_serial_enable = json_cs_serial.enable;
                    g_centerserver_serial_uri = Base64.decode(json_cs_serial.uri, true);
                    $("#centerserver_serial_enable").check_val(json_cs_serial.enable == 1);
                    ele_change(g_centerserver_serial_enable, "serial_disabled");
                    $("#centerserver_serial_uri").val(g_centerserver_serial_uri);

                    if (g_etc_enable) {
                        var json_cs_etc;
                        json_cs_etc = json_data.cs_etc;
                        g_centerserver_etc_enable = json_cs_etc.enable;
                        g_centerserver_etc_uri = Base64.decode(json_cs_etc.uri, true);
                        $("#centerserver_etc_enable").check_val(json_cs_etc.enable == 1);
                        ele_change(g_centerserver_etc_enable, "etc_disabled");
                        $("#centerserver_etc_uri").val(g_centerserver_etc_uri);
                    }

                    var json_ssl_ca;
                    json_ssl_ca = json_data.ssl_ca;
                    var ca_enable = json_ssl_ca.ca_enable;
                    var cur_file_exist = json_ssl_ca.ca_file_exist;
                    var ssl_ca_str;
                    if (cur_file_exist == 1) {
                        file_exist = 1;
                        ssl_ca_str = $.i18n.prop("certificate_uploaded");
                        $("#prompt_text1").html(ssl_ca_str).css("color", "green");
                    } else {
                        file_exist = 0;
                        ssl_ca_str = $.i18n.prop("certificate_not_uploaded");
                        $("#prompt_text1").html(ssl_ca_str).css("color", "red");
                    }
                    if (ca_enable == 0) {
                        $("#anonymity").check_val(true);
                        $(".upload_tr").hide();
                    } else {
                        $("#credential").check_val(true);
                        $(".upload_tr").show();
                    }

                    $("#http_offline_enable").check_val(json_data.offline_status == 1);
                    $("#http_poll_enable").check_val(json_data.serv_poll_status == 1);
                    $("#httprepushnums_sel").select_val(json_data.repush_nums);

                    var ip_ext = "";
                    if (json_data.http_ip_ext != null) {
                        var IP_Ext_arr = json_data.http_ip_ext.IpExt;
                        for (var i = 0; i < IP_Ext_arr.length; i++) {
                            if (ip_ext != "") {
                                ip_ext += ";";
                            }
                            ip_ext += IP_Ext_arr[i].ipext;
                        }
                    }
                    g_centerserver_hostname_alt = ip_ext;
                    $("#centerserver_hostnamea_alt").val(ip_ext);

                    if (linkage_enable == 1) {
                        var proxy_http = json_data.proxy_http;
                        var g_bind_plate_enable = proxy_http.enable;
                        var g_bind_plate_uri = Base64.decode(proxy_http.uri, true);
                        var g_bind_bSendImage = proxy_http.big_img;
                        var g_bind_bSendSmallImage = proxy_http.small_img;

                        $("#bind_plate_enable").check_val(g_bind_plate_enable == 1);
                        ele_change(g_bind_plate_enable, "bind_plate_disabled");
                        $("#bind_plate_uri").val(g_bind_plate_uri);
                        $("#bind_plate_send_image").check_val(g_bind_bSendImage == 1);
                        $("#bind_plate_send_small_image").check_val(g_bind_bSendSmallImage == 1);
                    }
                } catch (e) {
                    return false;
                }

            });
        }
        function show_delay_time(enable) {
            if (enable == 2) {
                $(".resend_delay_time").show()
            } else {
                $(".resend_delay_time").hide()
            }
        }
        function set_http_config_all() {
            var json_cfg_req = {};
            json_cfg_req.type = "set_http_cfg";
            json_cfg_req.body = {};

            var hostname = $("#centerserver_hostname").val();
            var port = $("#centerserver_port").val();
            var enable_ssl = $("#centerserver_enable_ssl").check_val() ? 1 : 0;
            var ssl_port = $("#centerserver_ssl_port").val();
            var timeout = $("#centerserver_timeout").val();
            if (isNaN(port)) {
                show_informer_text($.i18n.prop("server_port_error"));
                // port = g_centerserver_port;
                return;
            }
            if (isNaN(ssl_port)) {
                show_informer_text($.i18n.prop("SSL_port_error"));
                // ssl_port = g_centerserver_ssl_port;
                return;
            }
            if (isNaN(timeout)) {
                show_informer_text($.i18n.prop("timeout_error"));
                // timeout = g_centerserver_timeout;
                return;
            }
            if (timeout < 1 || timeout > 30) {
                show_informer_text($.i18n.prop("time_out_length_tips") + " 1~30");
                // timeout = g_centerserver_timeout;
                return;
            }
            if (!test_ip(hostname) && !test_add(hostname)) {
                show_informer_text($.i18n.prop("server_address_error"));
                return;
            }
            var json_cs = {};
            json_cs.hostname = Base64.encode(hostname, true);
            json_cs.port = Number(port);
            json_cs.enable_ssl = Number(enable_ssl);
            json_cs.ssl_port = Number(ssl_port);
            json_cs.http_timeout = Number(timeout);
            json_cfg_req.body.centerserver = json_cs;

            var enable = 0;
            var resend_delay_time = 1;
            if ($("#centerserver_device_reg_enable2").check_val()) {
                enable = 1;
            } else if ($("#centerserver_device_reg_enable3").check_val()) {
                enable = 2;
                // resend_delay_time = $("#resend_delay_time").val()
                // if(isNaN(resend_delay_time) || resend_delay_time < 0 || resend_delay_time > 10){
                //   show_informer_text($.i18n.prop("resend_delay_time_tips") + " 0~10");
                //   return;
                // }
            } else {
                enable = 0;
            }
            var centerserver_device_reg_uri = $("#centerserver_device_reg_uri").val();
            var json_dev_reg = {};
            json_dev_reg.enable = enable;
            json_dev_reg.uri = Base64.encode(centerserver_device_reg_uri, true);
            // json_dev_reg.resend_delay_time = parseInt(resend_delay_time);
            json_cfg_req.body.cs_dev_reg = json_dev_reg;

            var centerserver_plate_enable = $("#centerserver_plate_enable").check_val() ? 1 : 0;
            var centerserver_plate_retran = $("#centerserver_plate_retran").check_val() ? 1 : 0;
            var centerserver_plate_clear_offline = 0;
            var centerserver_plate_uri = $("#centerserver_plate_uri").val();
            var plateResultLevel = $("#centerserver_plate_content_level").select_val();
            var bSendImage = $("#centerserver_plate_send_image").check_val() ? "1" : "0";
            var bSendSmallImage = $("#centerserver_plate_send_small_image").check_val() ? "1" : "0";
            var json_plate = {};
            if (0 == centerserver_plate_enable) {
                centerserver_plate_retran = 0;
            }
            if (g_centerserver_plate_retran != centerserver_plate_retran
                && 0 == centerserver_plate_retran) {
                if (confirm($.i18n.prop("disconnect_retransmission_confirm"))) {
                    centerserver_plate_clear_offline = 1;
                } else {
                    centerserver_plate_retran = 1;
                }
            }
            json_plate.clear_offline = centerserver_plate_clear_offline;
            json_plate.enable = centerserver_plate_enable;
            json_plate.retransmission = centerserver_plate_retran;
            json_plate.uri = Base64.encode(centerserver_plate_uri, true);
            json_plate.plate_rlt_level = Number(plateResultLevel);
            json_plate.big_img = Number(bSendImage);
            json_plate.small_img = Number(bSendSmallImage);
            json_cfg_req.body.cs_alarm_plate = json_plate;

            var centerserver_gioin_enable = $("#centerserver_gioin_enable").check_val() ? 1 : 0;
            var centerserver_gioin_uri = $("#centerserver_gioin_uri").val();
            var json_gioin = {};
            json_gioin.enable = centerserver_gioin_enable;
            json_gioin.uri = Base64.encode(centerserver_gioin_uri, true);
            json_cfg_req.body.cs_alarm_gioin = json_gioin;

            var centerserver_serial_enable = $("#centerserver_serial_enable").check_val() ? 1 : 0;
            var centerserver_serial_uri = $("#centerserver_serial_uri").val();
            var json_serial = {};
            json_serial.enable = centerserver_serial_enable;
            json_serial.uri = Base64.encode(centerserver_serial_uri, true);
            json_cfg_req.body.cs_serial = json_serial;

            if (g_etc_enable) {
                var centerserver_etc_enable = $("#centerserver_etc_enable").check_val() ? 1 : 0;
                var centerserver_etc_uri = $("#centerserver_etc_uri").val();
                var json_etc = {};
                json_etc.enable = centerserver_etc_enable;
                json_etc.uri = Base64.encode(centerserver_etc_uri, true);
                json_cfg_req.body.cs_etc = json_etc;
            }

            var centerserver_hostnamea_alt = $("#centerserver_hostnamea_alt").val();
            var json_ip_ext = {}
            json_ip_ext.IpExt = [];
            var ip_error = false;
            if (centerserver_hostnamea_alt != "") {
                var ip_arr = centerserver_hostnamea_alt.split(";");
                for (var i = 0; i < ip_arr.length; i++) {
                    if (!test_ip(ip_arr[i]) && !test_add(ip_arr[i])) {
                        show_informer_text($.i18n.prop("alternate_server_address_error"));
                        ip_error = true;
                        break;
                    } else {
                        var json = {};
                        json.ipext = ip_arr[i];
                        json_ip_ext.IpExt.push(json);
                    }
                }
            }
            if (!ip_error) {
                json_cfg_req.body.http_ip_ext = json_ip_ext;
            } else {
                return;
            }

            var ca_enable = 0;
            if ($("#anonymity").check_val()) {
                ca_enable = 0;
            } else if ($("#credential").check_val()) {
                ca_enable = 1;
            }
            if (ca_enable == 1 && file_exist == 0 && enable_ssl == 1) {
                show_informer_text($.i18n.prop("certificate_not_uploaded"));
                return;
            } else {
                var cfg_ssl_ca = {};
                cfg_ssl_ca.ca_enable = ca_enable;
                json_cfg_req.body.ssl_ca = cfg_ssl_ca;
            }

            json_cfg_req.body.offline_status = $("#http_offline_enable").check_val() ? 1 : 0;
            json_cfg_req.body.serv_poll_status = $("#http_poll_enable").check_val() ? 1 : 0;
            json_cfg_req.body.repush_nums = Number($("#httprepushnums_sel").select_val());

            if (linkage_enable == 1) {
                var bind_plate_enable = $("#bind_plate_enable").check_val() ? 1 : 0;
                var bind_plate_uri = $("#bind_plate_uri").val();
                var bind_bSendImage = $("#bind_plate_send_image").check_val() ? "1" : "0";
                var bind_bSendSmallImage = $("#bind_plate_send_small_image").check_val() ? "1" : "0";
                var bind_plate = {};
                bind_plate.enable = bind_plate_enable;
                bind_plate.uri = Base64.encode(bind_plate_uri, true);
                bind_plate.big_img = Number(bind_bSendImage);
                bind_plate.small_img = Number(bind_bSendSmallImage);
                json_cfg_req.body.proxy_http = bind_plate;
            }

            $.get("vb.htm?sethttpconfigall=" + JSON.stringify(json_cfg_req), function (ajaxdata) {
                default_ajax_handler(ajaxdata);
                get_http_config_all();
            });
        }
        var file_exist = 0;
        var loaded1 = true;
        function on_iframe_loaded1() {
            if (loaded1) {
                return;
            }
            loaded1 = true;
            var r;
            var error = false;
            try {
                r = getIFrameContent("hidden_frame1");
            }
            catch (error) {
                error = true;
            }
            if (r.match(/All upload success/)) {
                $("#prompt_text1").css("color", "Green");
                $("#prompt_text1").html($.i18n.prop("uploaded_success"));
                file_exist = 1;
            }
            else {
                $("#prompt_text1").css("color", "Red");
                $("#prompt_text1").html($.i18n.prop("uploaded_failed"));
            }
        }
        var iscrt1 = false;
        function fileChange1(target) {
            var path = $(target).val().split('\\').pop();
            if (path != "sslca.crt") {
                show_informer_text($.i18n.prop("certificate_error") + ",sslca.crt");
                iscrt1 = false;
            } else {
                iscrt1 = true;
            }
        }
        function get_http_test_state() {
            $.ajax({
                type: 'GET',
                url: "http_debug?" + new Date().getTime(),
                timeout: 5000,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var str_arr = ajaxdata.split("\n");
                    var str = "";
                    for (var i = 0; i < str_arr.length; i++) {
                        str += str_arr[i];
                        str += "<br/>";
                    }
                    $("#http_test_container").html(str);
                    // $("#http_test_container")[0].scrollTop = $("#http_test_container")[0].scrollHeight - $("#http_test_container").height();
                }
            });
        }
        function set_button_val(num) {
            if (num == 0) {
                $("#centerserver_test").val($.i18n.prop("stop_test")).attr("state", 0);
            } else {
                $("#centerserver_test").val($.i18n.prop("push_test")).attr("state", 1);
            }
        }
        function set_test_state() {
            var state = parseInt($("#centerserver_test").attr("state"));
            if (state == 1) {
                $("#http_test_container").html("");
                test_http_server(1, function () {
                    set_button_val(0);
                });
            } else {
                test_http_server(0, function () {
                    clearInterval(http_test_timer);
                    http_test_timer = null;
                    set_button_val(1);
                });
            }
        }
        function test_http_server(num, callback) {
            var cfg = {};
            cfg.type = "test_http_server";
            cfg.body = {};
            cfg.body.start_test = num;

            var jsonstr = JSON.stringify(cfg);
            $.get("vb.htm?testhttpserver=" + jsonstr, function (ajaxdata) {
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    if (!http_test_timer) {
                        http_test_timer = setInterval(get_http_test_state, 1000);
                    }
                }
                if (callback) {
                    callback();
                }
            });
        }
        this.init = function () {
            if (!g_etc_enable) {
                $('.push_etc_tr').remove()
            }
            if (!linkage_enable) {
                $('.bind_info').remove()
            }
            $("#file_input1").change(function () {
                fileChange1(this);
            });
            $("#file_input_btn1").click(function () {
                $("#file_input1").click();
                var path = $("#file_input1").val().split('\\').pop();
                $("#file_name1").html(path);
            });
            $("#frmUpload1").submit(function () {
                if (!$("#file_input1").val()) {
                    show_informer_text($.i18n.prop("certificate_error") + ",sslca.crt");
                    return false;
                }
                if (!iscrt1) {
                    show_informer_text($.i18n.prop("certificate_error") + ",sslca.crt");
                    return false;
                }
                // var file = document.getElementById("file_input1");
                // if (file.files[0].size.toFixed(1) > 129 * 1024) {
                //     show_informer_text($.i18n.prop("upload_size_hint") + " 128K");
                //     return false;
                // }
                loaded1 = false;
                $("#prompt_text1").css("color", "Red");
                $("#prompt_text1").html($.i18n.prop("upload_wait_hint"));

            });
            $("#hidden_frame1").on("load", on_iframe_loaded1);
            init_selectmenu('#centerserver_plate_content_level', 250, 150);
            init_selectmenu('#httprepushnums_sel', 250, 150);
            $("#httprepushnums_sel").selectmenu({
                position: { my: "left top-119", at: "left top", collision: "flipfit" }
            });
            $("#centerserver_submit").click(function () {
                set_http_config_all();
            });
            $("#centerserver_test").click(function () {
                set_test_state();
            });
            $(".verify").change(function () {
                if ($("#anonymity").check_val()) {
                    $(".upload_tr").hide();
                } else if ($("#credential").check_val()) {
                    $(".upload_tr").show();
                }
            });
            $("#centerserver_enable_ssl").change(function () {
                var enbele = $(this).check_val() ? 1 : 0;
                ele_change(enbele, "ssl_disabled");
            });
            $("input[name='centerserver_device_reg_enable']").change(function () {
                var enbele = 1;
                if ($("#centerserver_device_reg_enable1").check_val()) {
                    enbele = 0;
                }
                ele_change(enbele, "poll_disabled");
                // if($("#centerserver_device_reg_enable3").check_val()){
                //   enbele = 2;
                // }
                // show_delay_time(enbele)
            });
            $("#centerserver_plate_enable").change(function () {
                var enbele = $(this).check_val() ? 1 : 0;
                ele_change(enbele, "plate_disabled");
            });
            $("#bind_plate_enable").change(function () {
                var enbele = $(this).check_val() ? 1 : 0;
                ele_change(enbele, "bind_plate_disabled");
            });
            $("#centerserver_gioin_enable").change(function () {
                var enbele = $(this).check_val() ? 1 : 0;
                ele_change(enbele, "gioin_disabled");
            });
            $("#centerserver_serial_enable").change(function () {
                var enbele = $(this).check_val() ? 1 : 0;
                ele_change(enbele, "serial_disabled");
            });
            $("#centerserver_etc_enable").change(function () {
                var enbele = $(this).check_val() ? 1 : 0;
                ele_change(enbele, "etc_disabled");
            });
            get_http_config_all();
        }
    }
    var vpn = new function () {
        this.get_openvpn = function (flag) {
            var cfg = {};
            cfg.type = "ss_get_vpn_net";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    json = json.body;
                    var hostname = json.hostname;
                    var port = json.port;
                    var enable = json.enable;
                    var status = json.status;
                    if (status == 1) {
                        $("#openvpn_status").css("color", "Green");
                        $("#openvpn_status").html($.i18n.prop("connected"));
                    }
                    else {
                        $("#openvpn_status").css("color", "Gray");
                        $("#openvpn_status").html($.i18n.prop("ununited"));
                    }
                    if (!flag) {
                        $("#openvpn_hostname").val(hostname);
                        $("#openvpn_port").val(port);
                        $("#openvpn_enable").check_val(enable == 1);
                        ele_change(enable, "vpn_disabled");
                    }
                }
            })
        }

        function set_openvpn() {
            var hostname = $.trim($("#openvpn_hostname").val());
            var port = parseInt($("#openvpn_port").val());
            var enable = $("#openvpn_enable").check_val() ? 1 : 0;
            if (isNaN(port) || port < 0) {
                show_informer_text($.i18n.prop("port_error"));
                return;
            }
            if (!test_ip(hostname)) {
                show_informer_text($.i18n.prop("address_error"));
                return;
            }
            var cfg = {};
            cfg.type = "ss_set_vpn_net";
            cfg.body = {};
            cfg.body.enable = enable;
            cfg.body.hostname = hostname;
            cfg.body.port = port;
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                    }
                }
            })
        }
        var loaded = true;
        function on_iframe_loaded() {
            if (loaded) {
                return;
            }
            loaded = true;
            var r;
            var error = false;
            try {
                r = getIFrameContent("hidden_frame");
            }
            catch (error) {
                error = true;
            }
            if (r.match(/All upload success/)) {
                $("#prompt_text").css("color", "Green");
                $("#prompt_text").html($.i18n.prop("uploaded_success"));
            }
            else {
                $("#prompt_text").css("color", "Red");
                $("#prompt_text").html($.i18n.prop("uploaded_failed"));
            }
        }
        var iscrt = false;
        function fileChange(target) {
            var path = $(target).val().split('\\').pop();
            if (path != "ca.crt") {
                show_informer_text($.i18n.prop("certificate_error") + "ca.crt");
                iscrt = false;
            } else {
                iscrt = true;
            }
        }
        this.init = function () {
            $("#file_input").change(function () {
                fileChange(this);
            });
            $("#file_input_btn").click(function () {
                $("#file_input").click();
                var path = $("#file_input").val().split('\\').pop();
                $("#file_name").html(path);
            });
            $("#frmUpload").submit(function () {
                if (!$("#file_input").val()) {
                    show_informer_text($.i18n.prop("certificate_error") + " ca.crt");
                    return false;
                }
                if (!iscrt) {
                    show_informer_text($.i18n.prop("certificate_error") + " ca.crt");
                    return false;
                }
                // var file = document.getElementById("file_input");
                // if (file.files[0].size.toFixed(1) > 129 * 1024) {
                //     show_informer_text($.i18n.prop("upload_size_hint") + " 128K");
                //     return false;
                // }
                loaded = false;
                $("#prompt_text").css("color", "Red");
                $("#prompt_text").html($.i18n.prop("upload_wait_hint"));

            });
            $("#hidden_frame").on("load", on_iframe_loaded);
            $("#openvpn_submit").click(set_openvpn);
            $("#openvpn_enable").change(function () {
                var enable = $(this).check_val() ? 1 : 0;
                ele_change(enable, "vpn_disabled");
            });
            vpn.get_openvpn();
        }
    }
    var upnp = new function () {
        this.get_upnp_portmap = function (flag) {
            var cfg = {};
            cfg.type = "ss_get_upnp_net";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    json = json.body;
                    var rtspport = json.rtsp_port;
                    var httpport = json.http_port;
                    var enable = json.enable;
                    var status = json.status;
                    if (status == 1) {
                        $("#upnp_status").css("color", "Green");
                        $("#upnp_status").html($.i18n.prop("connected"));
                    }
                    else {
                        $("#upnp_status").css("color", "Gray");
                        $("#upnp_status").html($.i18n.prop("ununited"));
                    }
                    if (!flag) {
                        $("#upnp_enable").check_val(enable == 1);
                        ele_change(enable, "upnp_disabled");
                        $("#upnp_http_port").val(httpport);
                        $("#upnp_rtst_port").val(rtspport);
                    }
                }
            })
        }

        function set_upnp_portmap() {
            var upnp_enable = $("#upnp_enable").check_val() ? 1 : 0;
            var upnp_httpport = parseInt($("#upnp_http_port").val());
            var upnp_rtspport = parseInt($("#upnp_rtst_port").val());

            if (isNaN(upnp_httpport) || upnp_httpport < 0 || isNaN(upnp_rtspport) || upnp_rtspport < 0) {
                show_informer_text($.i18n.prop("port_error"));
                return;
            }
            var cfg = {};
            cfg.type = "ss_set_upnp_net";
            cfg.body = {};
            cfg.body.enable = upnp_enable;
            cfg.body.http_port = upnp_httpport;
            cfg.body.rtsp_port = upnp_rtspport;
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                    }
                }
            })
        }
        this.init = function () {
            $("#upnp_enable").change(function () {
                var enable = $(this).check_val() ? 1 : 0;
                ele_change(enable, "upnp_disabled");
            });
            $("#upnp_submit").click(set_upnp_portmap);
            upnp.get_upnp_portmap();
        }
    }
    var ddns = new function () {
        this.get_ddns = function (flag) {
            var cfg = {};
            cfg.type = "ss_get_ddns_net";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    json = json.body;
                    var ddns_enable = json.enable;
                    var ddns_brandurl = json.brandurl;
                    var ddns_name = json.name;
                    var ddns_user = json.username;
                    var ddns_pass = json.password;
                    var ddns_status = json.status;
                    if (ddns_status == 1) {
                        $("#ddns_status").css("color", "Green");
                        $("#ddns_status").html($.i18n.prop("connected"));
                    }
                    else {
                        $("#ddns_status").css("color", "Gray");
                        $("#ddns_status").html($.i18n.prop("ununited"));
                    }
                    if (!flag) {
                        $("#ddns_enable").check_val(ddns_enable == 1);
                        ele_change(ddns_enable, "ddns_disabled");
                        $("#ddns_brand").select_val(ddns_brandurl);
                        $("#ddns_name").val(ddns_name);
                        $("#ddns_user").val(ddns_user);
                        $("#ddns_pass").val(ddns_pass);
                    }
                }
            })
        }

        function set_ddns() {
            var ddns_enable = $("#ddns_enable").check_val() ? 1 : 0;
            var ddns_brand = $("#ddns_brand").select_val();
            var ddns_name = $.trim($("#ddns_name").val());
            var ddns_user = $.trim($("#ddns_user").val());
            var ddns_pass = $.trim($("#ddns_pass").val());

            if (ddns_enable == 1) {
                if (ddns_name == "") {
                    show_informer_text($.i18n.prop("domain_hint"));
                    return;
                }
                if (ddns_user == "") {
                    show_informer_text($.i18n.prop("enter_user_name"));
                    return;
                }
                if (ddns_pass == "") {
                    show_informer_text($.i18n.prop("user_pwd_null_tips"));
                    return;
                }
            }
            var cfg = {};
            cfg.type = "ss_set_ddns_net";
            cfg.body = {};
            cfg.body.enable = ddns_enable;
            cfg.body.brandurl = ddns_brand;
            cfg.body.name = ddns_name;
            cfg.body.username = ddns_user;
            cfg.body.password = ddns_pass;
            cfg.body.status = 0;
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "sys_request_message.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                    }
                }
            })
        }
        this.init = function () {
            init_selectmenu('#ddns_brand', 200, 150);
            $("#ddns_submit").click(set_ddns);
            $("#ddns_enable").change(function () {
                var enable = $(this).check_val() ? 1 : 0;
                ele_change(enable, "ddns_disabled");
            });
            ddns.get_ddns();
        }
    }
    var ftp = new function () {
        var g_ftp_ip = null;
        var g_ftp_port = null;
        var g_ftp_user = null;
        var g_ftp_pass = null;
        var g_ftp_path = null;
        var g_enableftp = null;
        function get_ftp() {
            var json_req = {};
            json_req.type = "get_ftp_cfg";
            $.get("vb.htm?gethttpconfigall=" + JSON.stringify(json_req), function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;

                var json_data;
                ajaxdata = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                try {
                    json_data = eval("(" + ajaxdata + ")");
                    json_data = json_data.body;
                    g_enableftp = json_data.enable;
                    g_ftp_ip = json_data.server_ip;
                    g_ftp_port = json_data.port;
                    g_ftp_user = json_data.username;
                    g_ftp_pass = json_data.password;
                    g_ftp_path = json_data.foldername;
                    $("#ftp_enable").check_val(g_enableftp == 1);
                    ele_change(g_enableftp, "ftp_disabled");
                    $("#ftp_ip").val(g_ftp_ip);
                    $("#ftp_port").val(g_ftp_port);
                    $("#ftp_user").val(g_ftp_user);
                    $("#ftp_pass").val(g_ftp_pass);
                    $("#ftp_path").val(g_ftp_path);
                } catch (e) {
                    return false;
                }
            });
        }

        function set_ftp() {
            var enable = $("#ftp_enable").check_val() ? 1 : 0;
            var ftp_ip = $("#ftp_ip").val();
            var ftp_port = $("#ftp_port").val();
            var ftp_user = $("#ftp_user").val();
            var ftp_pass = $("#ftp_pass").val();
            var ftp_path = $("#ftp_path").val();
            var reg_str = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            if (!reg_str.test(ftp_path)) {
                show_informer_text($.i18n.prop("path_error"));
                return;
            }

            if (ftp_ip != g_ftp_ip || ftp_port != g_ftp_port
                || ftp_user != g_ftp_user || ftp_pass != g_ftp_pass || ftp_path != g_ftp_path || enable != g_enableftp) {
                var map = {};
                map.body = {};
                map.body.enable = enable;
                map.body.server_ip = ftp_ip;
                map.body.port = Number(ftp_port);
                map.body.username = ftp_user;
                map.body.password = ftp_pass;
                map.body.foldername = ftp_path;
                map.type = "set_ftp_cfg";
                $.get("vb.htm?sethttpconfigall=" + JSON.stringify(map), function (ajaxdata) {
                    default_ajax_handler(ajaxdata);
                    get_ftp();
                });
            }
        }

        function ftp_test() {
            var ftp_ip = $("#ftp_ip").val();
            var ftp_port = $("#ftp_port").val();
            var ftp_user = $("#ftp_user").val();
            var ftp_pass = $("#ftp_pass").val();
            var ftp_path = $("#ftp_path").val();

            if (ftp_ip != g_ftp_ip || ftp_port != g_ftp_port
                || ftp_user != g_ftp_user || ftp_pass != g_ftp_pass || ftp_path != g_ftp_path) {
                show_informer_text($.i18n.prop("ftp_test_hint"));
                return false;
            }
            var json_req = {};
            json_req.type = "send_ftp_test_file";
            var jsonstr = JSON.stringify(json_req);

            $.ajax({
                type: "POST",
                data: jsonstr,
                url: "sendftptestfile.php",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    // if ("OK" != ajaxdata.slice(0, 2)) return false;

                    // var json_data;
                    // ajaxdata = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                    try {
                        json_data = eval("(" + ajaxdata + ")");
                        if (json_data.state_code == 200) {
                            var path = json_data.test_file;
                            var test = $.i18n.prop("send_to") + " " + path;
                            $("#ftp_test_msg").css("color", "Green");
                            $("#ftp_test_msg").html(test);
                            var test_msg_timer = setTimeout(function () {
                                $("#ftp_test_msg").html("");
                                clearTimeout(test_msg_timer);
                            }, 5000)
                        }
                    } catch (e) {
                        return false;
                    }
                }
            })
        }
        this.init = function () {
            $("#ftp_test").click(ftp_test);
            $("#ftp_submit").click(set_ftp);
            $("#ftp_enable").change(function () {
                var enable = $(this).check_val() ? 1 : 0;
                ele_change(enable, "ftp_disabled");
            });
            get_ftp();
        }
    }
    var g4 = new function () {
        function submit_g4_config() {
            var net_pri = 0;
            if ($("#net_priority_4g").check_val()) {
                net_pri = 1;
            }

            // check ip
            var ip = $("#cloud_server_add").val();
            if (!test_ip(ip)) {
                show_informer_text($.i18n.prop("address_error"));
                return;
            } else {
                var cfg = {};
                cfg.type = "set_4g_config";
                cfg.body = {};
                cfg.body.link_level = 1;
                cfg.body.cloud_addr = ip;
                cfg.body.net_priority = net_pri;
                var jsonstr = JSON.stringify(cfg);

                $.ajax({
                    type: 'POST',
                    url: "systemjson.php",
                    data: jsonstr,
                    success: function (ajaxdata) {
                        var json = eval("(" + ajaxdata + ")");
                        if (json.state == 200) {
                            show_informer();
                        }
                    }
                });
            }
        }

        function get_4g_config() {
            var cfg = {};
            cfg.type = "get_4g_config";
            var jsonstr = JSON.stringify(cfg);

            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        // set data
                        $("#cloud_server_add").val(json.body.cloud_addr);
                        if (0 == json.body.net_priority) {
                            $("#net_priority_wire").check_val(true);
                        } else {
                            $("#net_priority_4g").check_val(true);
                        }
                    }
                }
            });
        }


        var g4_link_state_flag = 0; // 1 断开连接状态标识  2 重新连接状态标识
        var is_show_step3 = true;

        function show_step3() {
            if (is_show_step3) {
                return;
            }
            $(".g4_step_3").show();
            is_show_step3 = true;
        }

        function hide_step3() {
            if (!is_show_step3) {
                return;
            }
            $(".g4_step_3").hide();
            is_show_step3 = false;
        }

        function show_stop_g4_link() {
            if (g4_link_state_flag == 1) {
                return;
            }
            //g4_reconnect
            g4_link_state_flag = 1;
        }

        function reconnect_g4_link() {
            if (g4_link_state_flag == 2) {
                return;
            }
            g4_link_state_flag = 2;
        }

        function stop_g4_link() {
            stop_link_flag = 2;
            var cfg = {};
            cfg.type = "stop_4g_server";
            $("#g4_call_way").html($.i18n.prop("manual_connection"))
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    stop_link_flag = 1;
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        $("#show_tip_msg").html("<font color=\"green\">" + $.i18n.prop("disconnected") + "</font>");
                    } else {
                        $("#show_tip_msg").html("<font color=\"red\">" + $.i18n.prop("disconnect_error") + "</font>");
                    }
                }
            });
        }

        var stop_link_flag = 1;
        var reconnect_link = 1;
        function reoperate_g4_link() {
            reconnect_link = 2;
            var cfg = {};
            cfg.type = "reconnect_4g_server";
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    reconnect_link = 1;
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        $("#show_tip_msg").html("<font color=\"green\">" + $.i18n.prop("reconnection") + "</font>");
                    } else {
                        $("#show_tip_msg").html("<font color=\"red\">" + $.i18n.prop("reconnection_error") + "</font>");
                    }
                }
            });
        }

        function operate_g4_server() {
            if (g4_link_state_flag == 1) {
                // 断开连接
                if (stop_link_flag == 1) {
                    stop_g4_link();
                }
            } else if (g4_link_state_flag == 2) {
                // 重新连接
                if (reconnect_link == 1) {
                    reoperate_g4_link();
                }
            }
        }
        var failed_num = 0;
        var failed_singal = 0;
        var failed_link = 0;
        var success_flag = false;
        function set_g4_show_state(json) {
            if (json.body.call_way == 1) {
                $("#g4_call_way").html($.i18n.prop("auto_connection"))
            }
            if (json.body.link_state == -1) {
                failed_link = 0;
                failed_num++;
                if (success_flag) {
                    if (failed_num >= 5) {
                        failed_num = 0;
                        $("#g4_link_state").html($.i18n.prop("g4_error"));
                        $("#g4_company").html($.i18n.prop("without"));
                        hide_step3();
                    }
                } else {
                    $("#g4_link_state").html($.i18n.prop("g4_error"));
                    $("#g4_company").html($.i18n.prop("without"));
                    hide_step3();
                }
            } else if (json.body.link_state == 0) {
                success_flag = true;
                failed_num = 0;
                failed_link++;
                if (failed_link >= 5) {
                    failed_link = 0;
                    $("#g4_link_state").html($.i18n.prop("no_card"));
                    hide_step3();
                }

            } else {
                success_flag = true;
                failed_num = 0;
                failed_link = 0;
                show_step3();
                var net_type = json.body.net_type;
                var type = $.i18n.prop("unknown");
                if (net_type == 1) {
                    type = "2G";
                } else if (net_type == 2) {
                    type = "3G";
                } else if (net_type == 3) {
                    type = "4G";
                }
                $("#g4_net_type").html(type);

                if (json.body.net_state == 2) {
                    $("#g4_net_state_way").html($.i18n.prop("access"));
                    show_stop_g4_link();
                } else if (json.body.net_state == 0) {
                    $("#g4_net_state_way").html($.i18n.prop("not_access"));
                    reconnect_g4_link();
                } else if (json.body.net_state == 1) {
                    $("#g4_net_state_way").html($.i18n.prop("connecting"));
                    $("#g4_reconnect").hide();
                    g4_link_state_flag = 0;
                }

                if (json.body.link_state == 1) {
                    $("#g4_link_state").html($.i18n.prop("card_ready"));
                    hide_step3();
                } else if (json.body.link_state == 2) {
                    $("#g4_link_state").html($.i18n.prop("network_regist_failed"));
                } else if (json.body.link_state == 3) {
                    $("#g4_link_state").html($.i18n.prop("network_registrat_successful"));
                } else if (json.body.link_state == 4) {
                    $("#g4_link_state").html($.i18n.prop("network_service_unavailable"));
                } else if (json.body.link_state == 5) {
                    $("#g4_link_state").html($.i18n.prop("network_service_available"));
                } else {
                    $("#g4_link_state").html($.i18n.prop("failed_get_status"));
                }
            }

            if (is_show_step3) {
                if (json.body.link_company == 0) {
                    $("#g4_company").html($.i18n.prop("without"));
                } else if (json.body.link_company == 1) {
                    $("#g4_company").html($.i18n.prop("China_Mobile"));
                } else if (json.body.link_company == 2) {
                    $("#g4_company").html($.i18n.prop("China_Unicom"));
                } else if (json.body.link_company == 3) {
                    $("#g4_company").html($.i18n.prop("China_Telecom"));
                } else {
                    $("#g4_company").html($.i18n.prop("failed_get_status"));
                }
                var singal = json.body.singal_state;
                if (0 <= singal && singal < 10) {
                    $("#g4_singl_way").html($.i18n.prop("feeble") + " " + singal);
                    failed_singal = 0;
                } else if (10 <= singal && singal <= 25) {
                    $("#g4_singl_way").html($.i18n.prop("middle") + " " + singal);
                    failed_singal = 0;
                } else if (25 < singal && singal <= 31) {
                    $("#g4_singl_way").html($.i18n.prop("better") + " " + singal);
                    failed_singal = 0;
                } else if (99 == singal) {
                    failed_singal++;
                    if (failed_singal >= 5) {
                        failed_singal = 0;
                        $("#g4_singl_way").html($.i18n.prop("without"));
                    }
                }
                var iccid = json.body["4g_iccid"];
                if (iccid != "") {
                    $("#g4_iccid").html(iccid);
                } else {
                    $("#g4_iccid").html($.i18n.prop("without"));
                }
                var ip = json.body["ip"];
                $("#g4_ip").html(ip);
                var imei = json.body["imei"];
                $("#g4_imei").html(imei);
            }

            $("#show_tip_msg").html("");
        }

        this.check_g4_status = function () {
            var cfg = {};
            cfg.type = "get_4g_cur_state";
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        set_g4_show_state(json);
                    } else {
                        $("#g4_link_state").html($.i18n.prop("no_card"));
                        hide_step3();
                    }

                }
            });
        }
        function get_apn() {
            var cfg = {};
            cfg.type = "get_apn_config";
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        var body = json.body
                        apnaddr = body.apnaddr
                        username = body.username
                        passwd = body.passwd
                        authentication = body.authentication
                        $("#apn_apnaddr").val(apnaddr)
                        $("#apn_username").val(username)
                        $("#apn_pwd").val(passwd)
                        $("#apn_auth").select_val(authentication)
                        var enable = authentication == 0 ? 0 : 1
                        ele_change(enable, "apn_tr");
                    }
                }
            })
        }
        function set_apn() {
            var apnaddr = $("#apn_apnaddr").val()
            var username = $("#apn_username").val()
            var passwd = $("#apn_pwd").val()
            var authentication = parseInt($("#apn_auth").select_val())
            var reg = /(^\s+)|(\s+$)|\s+/g;
            var re = /[\u4E00-\u9FA5]/g;
            if (apnaddr.length > 60 || apnaddr.length == 0 || reg.test(apnaddr) || re.test(apnaddr)) {
                show_informer_text($.i18n.prop('apn_addr_error'));
                return;
            }
            if (username.length > 60 || re.test(username)) {
                show_informer_text($.i18n.prop('apn_username_error'));
                return;
            }
            if (passwd.length > 60 || re.test(passwd)) {
                show_informer_text($.i18n.prop('apn_passwd_error'));
                return;
            }
            var cfg = {};
            cfg.type = "set_apn_config";
            cfg.body = {}
            cfg.body.apnaddr = apnaddr
            cfg.body.username = username
            cfg.body.passwd = passwd
            cfg.body.authentication = authentication
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "systemjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                        get_apn()
                    }
                }
            })
        }
        this.init = function () {
            is_show_step3 = true;
            $("#g4_config_submit").click(submit_g4_config);
            $("#g4_reconnect").click(operate_g4_server);
            init_selectmenu('#apn_auth', 200, 150, function (e, o) {
                var enable = parseInt(o.value) == 0 ? 0 : 1
                ele_change(enable, "apn_tr");
            });
            $("#apn_submit").click(set_apn);
            get_apn();
            get_4g_config();
            hide_step3();
            g4.check_g4_status();
        }
    }
    var pdns = new function () {
        this.get_pdns = function (flag) {
            var cfg = {};
            cfg.type = "get_stp_conf";

            var jsonstr = JSON.stringify(cfg);

            $.ajax({
                url: "stp.php",
                type: "POST",
                data: jsonstr,
                dataType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        g_pdns_data = json;
                        var body = json.body;
                        var connected = body.connected;
                        if (connected == 2) {
                            $("#pdns_state").css("color", "green").html($.i18n.prop("connected"));
                        } else if (connected == 1) {
                            $("#pdns_state").css("color", "gray").html($.i18n.prop("connecting"));
                        } else {
                            $("#pdns_state").css("color", "red").html($.i18n.prop("ununited"));
                        }
                        if (!flag) {
                            $("#enable_stp").check_val(body.enabled == 1);
                            ele_change(body.enabled, "pdns_disabled");
                            $("#pdns_addr").val(body.addr);
                        }
                    }
                }
            });
        }
        function set_pdns() {
            var addr = $("#pdns_addr").val();
            var enable = $("#enable_stp").check_val() ? 1 : 0;
            if (!test_url(addr)) {
                show_informer_text($.i18n.prop("address_error"));
                return;
            }
            if (addr == 'https://www.vzicar.com') {
                show_informer_text($.i18n.prop("pdns_address_error"));
                return;
            }
            var cfg = {};
            cfg.type = "set_stp_conf";
            cfg.body = {};
            cfg.body.enabled = enable;
            cfg.body.addr = addr;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                url: "stp.php",
                type: "POST",
                data: jsonstr,
                dataType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                    } else {
                        show_informer_text($.i18n.prop("save_failed"));
                    }
                }
            });
        }
        this.init = function () {
            $("#pdns_btn").click(set_pdns);
            $("#enable_stp").change(function () {
                var enable = $(this).check_val() ? 1 : 0;
                ele_change(enable, "pdns_disabled");
            });
            pdns.get_pdns();
        }
    }
    var http_mqtt = new function () {
        var oss_info_obj = {}
        function is_sn_change(is_sn) {
            if (is_sn == 1) {
                $("div.font_unit").removeClass('hide_span')
            } else {
                $("div.font_unit").addClass('hide_span')
            }
        }
        function get_mqtt_cfg() {
            var cfg = {}
            cfg.method = "MQTT_CONFIG_ALL"
            cfg.module = "MQTT_CONFIG_ALL"
            cfg.type = "get_mqtt_cfg"
            post(cfg, function (res) {
                var custom_mqtt_enable = res.body.enable
                $("#custom_mqtt_enable").check_val(custom_mqtt_enable == 1)
                ele_change(custom_mqtt_enable, 'mqtt_div')
                var base_cfg = res.body.base_cfg
                var client_id = base_cfg.client_id
                var heart_interval = base_cfg.heart_interval
                var server_addr = base_cfg.server_addr
                var server_port = base_cfg.server_port
                var server_pwd = base_cfg.server_pwd
                var server_username = base_cfg.server_username
                var timeout = base_cfg.timeout
                var is_sn = base_cfg.is_sn
                var check_off_line = base_cfg.check_off_line
                $("#server_addr").val(server_addr)
                $("#server_port").val(server_port)
                $("#server_username").val(server_username)
                $("#server_pwd").val(server_pwd)
                $("#client_id").val(client_id)
                $("#timeout").val(timeout)
                $("#heart_interval").val(heart_interval)
                $("#is_sn").check_val(is_sn == 1)
                $("#check_off_line").check_val(check_off_line == 1)
                is_sn_change(is_sn)
                var oss_cfg = res.body.oss_cfg
                var oss_info = oss_cfg.oss_info
                var oss_id = oss_cfg.oss_id
                var pic_mode = oss_cfg.pic_mode
                var upmode = 0
                if (pic_mode == "oss") {
                    $(".oss_tr").show()
                    upmode = 1
                } else {
                    $(".oss_tr").hide()
                    upmode = 2
                }
                for (var i = 0; i < oss_info.length; i++) {
                    var oss_addr = oss_info[0].oss_addr
                    var oss_username = oss_info[0].oss_username
                    var oss_pwd = oss_info[0].oss_pwd
                    var oss_bucket = oss_info[0].oss_bucket
                    oss_info_obj = oss_info[0]
                }
                var picture = oss_cfg.picture
                var bigpic_enable = picture.bigpic_enable
                var smallpic_enable = picture.smallpic_enable
                $("#upmode").select_val(upmode)
                $("#storage_mode").select_val(oss_id)
                $("#bigpic_enable").check_val(bigpic_enable == 1)
                $("#smallpic_enable").check_val(smallpic_enable == 1)
                $("#oss_addr").val(oss_addr)
                $("#oss_username").val(oss_username)
                $("#oss_pwd").val(oss_pwd)
                $("#oss_bucket").val(oss_bucket)


            })
        }
        function set_mqtt_cfg(callback) {
            var enable = $("#custom_mqtt_enable").check_val() ? 1 : 0
            var server_addr = $("#server_addr").val()
            // var reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            // if (!reg.test(server_addr) && server_addr !== '') {
            //   show_informer_text($.i18n.prop("server_address_error"));
            //   return false;
            // }
            if (!test_ip(server_addr) && !test_add(server_addr)) {
                show_informer_text($.i18n.prop("server_address_error"));
                return;
            }
            var server_port = $("#server_port").val()
            if (isNaN(server_port) || server_port == '') {
                show_informer_text($.i18n.prop('port_error_number'))
                return false;
            }
            var server_username = $("#server_username").val()
            var server_pwd = $("#server_pwd").val()
            var client_id = $("#client_id").val()
            var timeout = $("#timeout").val()

            if (isNaN(timeout) || timeout < 1 || timeout > 30) {
                show_informer_text($.i18n.prop('timeout_iserror'))
                return false;
            }
            var heart_interval = $("#heart_interval").val()
            if (isNaN(heart_interval) || heart_interval < 1 || heart_interval > 180) {
                show_informer_text($.i18n.prop('heart_interval_error'))
                return false;
            }
            var upmode = parseInt($("#upmode").select_val())
            var oss_id = parseInt($("#storage_mode").select_val())
            var bigpic_enable = $("#bigpic_enable").check_val() ? 1 : 0
            var smallpic_enable = $("#smallpic_enable").check_val() ? 1 : 0
            var oss_addr = $("#oss_addr").val()
            var oss_username = $("#oss_username").val()
            var oss_pwd = $("#oss_pwd").val()
            var oss_bucket = $("#oss_bucket").val()
            var is_sn = $("#is_sn").check_val() ? 1 : 0
            var check_off_line = $("#check_off_line").check_val() ? 1 : 0
            is_sn_change(is_sn)
            var cfg = {}
            cfg.method = "MQTT_CONFIG_ALL"
            cfg.module = "MQTT_CONFIG_ALL"
            cfg.type = "set_mqtt_cfg"
            var body = {}
            body.enable = enable
            var pic_mode = ""
            if (upmode == 1) {
                pic_mode = "oss"
            } else if (upmode == 2) {
                pic_mode = "mqtt"
            }

            var base_cfg = {}
            base_cfg.server_addr = server_addr
            base_cfg.server_port = parseInt(server_port)
            base_cfg.server_username = server_username
            base_cfg.server_pwd = server_pwd
            base_cfg.client_id = client_id
            base_cfg.timeout = parseInt(timeout)
            base_cfg.heart_interval = parseInt(heart_interval)
            base_cfg.is_sn = is_sn
            base_cfg.check_off_line = check_off_line
            var oss_cfg = {}
            oss_cfg.oss_id = oss_id
            var oss_info = {}
            oss_info.oss_addr = oss_addr
            oss_info.oss_username = oss_username
            oss_info.oss_pwd = oss_pwd
            oss_info.oss_bucket = oss_bucket
            oss_info.oss_id = oss_info_obj.oss_id
            oss_info.oss_key = oss_info_obj.oss_key
            oss_info.oss_secret = oss_info_obj.oss_secret
            oss_cfg.oss_info = oss_info
            oss_cfg.pic_mode = pic_mode
            var picture = {}
            picture.bigpic_enable = bigpic_enable
            picture.smallpic_enable = smallpic_enable
            oss_cfg.picture = picture
            cfg.body = body
            cfg.body.base_cfg = base_cfg
            cfg.body.oss_cfg = oss_cfg
            post(cfg, function (res) {
                if (callback) {
                    callback()
                }
                get_mqtt_cfg()
            })
        }
        function get_oss_platform_list() {
            var cfg = {}
            cfg.method = "MQTT_CONFIG_ALL"
            cfg.module = "MQTT_CONFIG_ALL"
            cfg.type = "get_oss_platform_list"
            post(cfg, function (res) {
                var oss_type = res.body.oss_type
                var oss_option = ""

                for (var i = 0; i < oss_type.length; i++) {
                    oss_option += "<option value='" + oss_type[i].oss_id + "'>" + Base64.decode(oss_type[i].oss_name, true) + "</optioon>";
                }
                $("#storage_mode").html(oss_option)
                get_mqtt_cfg()

            })
        }
        var init_top_list = []
        function get_mqtt_topic_list() {
            var cfg = {}
            cfg.method = "MQTT_CONFIG_ALL"
            cfg.module = "MQTT_CONFIG_ALL"
            cfg.type = "get_mqtt_topic_list"
            post(cfg, function (res) {

                var top_list = res.body.top_list
                init_top_list = top_list
                var str = ''
                for (var i = 0; i < top_list.length; i++) {
                    var name = Base64.decode(top_list[i].name, true)
                    var n = name.substring(0, 2)
                    var checked = ''
                    if (top_list[i].enable == 1) {
                        checked = "checked='checked'"
                    }

                    if (n == '订阅') {
                        str += "<tr index='" + i + "'><td class='common_width'><input type='checkbox' " + checked + " id='topic_enable" + i + "'/><label for='topic_enable" + i + "'>" + name + "</label></td><td></td><td><div class='font_unit'><span class='sn_span'>" + g_device_sn + "</span><input class='sub text' type= 'text' value='" + top_list[i].sub + "' /></div></td></tr>"
                    } else {
                        str += "<tr index='" + i + "'><td rowspan='2' class='common_width' valign='top' style='padding-top:15px;'><input type='checkbox' " + checked + " id='topic_enable" + i + "'/><label for='topic_enable" + i + "'>" + name + "</label></td><td style='width:50px;'>发布</td><td><div class='font_unit'><span class='sn_span'>" + g_device_sn + "</span><input class='pub text' type='text' value='" + top_list[i].pub + "' /></div></td></tr><tr index='" + i + "'><td>回执</td><td><div class='font_unit'><span>" + g_device_sn + "</span><input class='sub text' type='text' value='" + top_list[i].sub + "' /></div></td></tr>"
                    }
                    $('.top_table tbody').html(str)
                    init_checkbox('.top_table tbody input[type=checkbox]');
                }
            })
        }


        function set_mqtt_topic_list() {
            var cfg = {}
            cfg.method = "MQTT_CONFIG_ALL"
            cfg.module = "MQTT_CONFIG_ALL"
            cfg.type = "set_mqtt_topic_list"
            cfg.body = {}
            cfg.body.top_list = init_top_list
            post(cfg, function (res) {
                show_informer()
                // get_mqtt_topic_list()
            })
        }

        this.init = function () {
            init_selectmenu("#upmode", 200, 150, function (e, o) {
                if (o.value == 1) {
                    $(".oss_tr").show()
                } else if (o.value == 2) {
                    $(".oss_tr").hide()
                }
            });
            init_selectmenu("#storage_mode", 200, 150);

            $("#basic_config").accordion({
                collapsible: true,
                heightStyle: "content"
            });
            $("#topic_config").accordion({
                collapsible: true,
                active: 999, //默认收起
                heightStyle: "content"
            });
            $("#pic_config").accordion({
                collapsible: true,
                heightStyle: "content"
            });
            $("#custom_mqtt_enable").change(function () {
                var custom_mqtt_enable = $(this).check_val() ? 1 : 0
                ele_change(custom_mqtt_enable, 'mqtt_div')
            })
            $("#is_sn").change(function () {
                var is_sn = $(this).check_val() ? 1 : 0
                is_sn_change(is_sn)
            })
            get_mqtt_topic_list()
            get_oss_platform_list()
            $("#save_picconfig").click(function () {
                var flag = false
                $(".top_table tbody tr").each(function () {
                    var index = $(this).attr('index')
                    var check_ele = $(this).find('input[type="checkbox"]')
                    if (check_ele.length != 0) {
                        var enable = check_ele.check_val() ? 1 : 0
                        init_top_list[index].enable = enable
                    }
                    var sub_ele = $(this).find('.sub')
                    if (sub_ele.length != 0) {
                        var sub = sub_ele.val()
                        init_top_list[index].sub = sub
                    }
                    var pub_ele = $(this).find('.pub')
                    if (pub_ele.length != 0) {
                        var pub = pub_ele.val()
                        init_top_list[index].pub = pub
                    }
                    if (init_top_list[index].sub == init_top_list[index].pub) {
                        show_informer_text($.i18n.prop('config_error'))
                        flag = true
                    }
                })
                if (flag) {
                    return flag;
                }
                set_mqtt_cfg(function () {
                    set_mqtt_topic_list()
                })
            })
        }
    }
    var check_wifi_timer = null;
    var wifi = new function () {
        var g_wifi_pwd = null;
        this.get_wifiparam = function (flag) {
            var cfg = {};
            cfg.type = "get_wifiparam";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        jsondata = jsondata.body;
                        var ip = jsondata.ip;
                        var status = jsondata.status;
                        var essid = jsondata.essid;
                        var pwd = jsondata.password;
                        g_wifi_pwd = pwd;
                        var encrypt = jsondata.encrypt;
                        var str = "";
                        if (status == 0) {
                            str = $.i18n.prop("ununited");
                        } else if (status == 1) {
                            str = $.i18n.prop("connected");
                        }
                        $("#wifi_status").html(str);
                        if (!flag) {
                            $("#wifi_ip").html(ip);
                            $("#wifi_ssid").val(essid);
                            $("#wifi_pwd").val(pwd);
                            $("#safety_mode").select_val(encrypt);
                            if (encrypt == 0) {
                                $("#wifi_pwd_tr").hide();
                            }
                        }
                    }
                }
            });
        }
        function set_wifiparam() {
            var ip = $("#wifi_ip").html();
            var essid = $.trim($("#wifi_ssid").val());
            var pwd = $.trim($("#wifi_pwd").val());
            var encrypt = parseInt($("#safety_mode").select_val());
            if (essid == "") {
                show_informer_text($.i18n.prop("SSID_cannot_empty"));
                return;
            }
            if (essid.length < 1 || essid.length > 30) {
                show_informer_text($.i18n.prop("range") + "1~30");
                return;
            }
            if (pwd.length < 8 || pwd.length > 30) {
                show_informer_text($.i18n.prop("user_pwd_length_tips") + " 8~30");
                $("#wifi_pwd").val(g_wifi_pwd);
                return;
            }
            var cfg = {};
            cfg.type = "set_wifiparam";
            cfg.body = {};
            cfg.body.encrypt = encrypt;
            cfg.body.essid = essid;
            cfg.body.password = pwd;
            cfg.body.ip = ip;

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                        wifi.get_wifiparam();
                    }
                }
            });
        }
        function get_wifiproperty() {
            var cfg = {};
            cfg.type = "get_wifiproperty";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "systemjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        var types = jsondata.body.encrypt_types.types;
                        var encrypt_text = "";
                        for (var i = 0; i < types.length; i++) {
                            encrypt_text += "<option value=\"" + types[i].type + "\">" + Base64.decode(types[i].content, true) + "</option>";
                        }
                        $("#safety_mode").html(encrypt_text);
                        init_selectmenu("#safety_mode", 200, 150, function (e, object) {
                            if (object.value == 0) {
                                $("#wifi_pwd_tr").hide();
                            } else {
                                $("#wifi_pwd_tr").show();
                            }
                        });
                        wifi.get_wifiparam();
                    }
                }
            });
        }
        this.init = function () {
            get_wifiproperty();
            $("#wifi_btn").click(set_wifiparam);
            init_selectmenu('#safety_mode', 200, 150);
            init_selectmenu('#ip_type', 200, 150);
        }
    }
    var pro_1400 = new function () {
        this.get_http_t1400_cfg = function (flag) {
            var cfg = {};
            cfg.type = "get_http_t1400_cfg";
            cfg.module = "HTTPSENDER_GAT1400_CONFIG_ALL";
            post(cfg, function (res) {
                json = res.body;
                var connected = json.connected
                if (connected == 2) {
                    $("#gat_state").css("color", "green").html($.i18n.prop("connected"));
                } else if (connected == 1) {
                    $("#gat_state").css("color", "gray").html($.i18n.prop("connecting"));
                } else {
                    $("#gat_state").css("color", "red").html($.i18n.prop("ununited"));
                }
                if (!flag) {
                    var enable = json.enable;
                    ele_change(enable, "disabled_pro_1400");
                    var port = json.server_port;
                    var timeout = json.timeout;
                    var ip = Base64.decode(json.server_ip, true);
                    var server_auth = json.server_auth
                    server_auth = AesCtr.decrypt(server_auth, '天天', 128);
                    server_auth = server_auth.split(':');
                    var username = server_auth[0];
                    var password = server_auth[1];
                    var reg_url = Base64.decode(json.register_uri, true);
                    var unreg_url = Base64.decode(json.unregister_uri, true);
                    var motor_vehicles_uri = Base64.decode(json.motor_vehicles_uri, true);
                    var heart_url = Base64.decode(json.heartbeat_uri, true);
                    var device_id = Base64.decode(json.device_id, true);
                    $("#enable_1400").check_val(enable == 1);
                    $("#port_1400").val(port);
                    $("#timeout_1400").val(timeout);
                    $("#ip_1400").val(ip);
                    $("#username_1400").val(username);
                    $("#password_1400").val(password);
                    $("#reg_url_1400").val(reg_url);
                    $("#unreg_url_1400").val(unreg_url);
                    $("#plate_post_url_1400").val(motor_vehicles_uri);
                    $("#heart_url_1400").val(heart_url);
                    $("#device_id_1400").val(device_id);
                }
            })
        }
        function set_http_t1400_cfg() {
            var enable = $("#enable_1400").check_val() ? 1 : 0;
            var port = $("#port_1400").val();
            var timeout = $("#timeout_1400").val();
            var ip = $("#ip_1400").val();
            var username = $("#username_1400").val();
            var password = $("#password_1400").val();
            var reg_url = $("#reg_url_1400").val();
            var unreg_url = $("#unreg_url_1400").val();
            var plate_post_url = $("#plate_post_url_1400").val();
            var heart_url = $("#heart_url_1400").val();
            var device_id = $("#device_id_1400").val();
            if (isNaN(port)) {
                show_informer_text("端口号错误");
                return false;
            }
            if (isNaN(timeout)) {
                show_informer_text("超时时间错误");
                return false;
            }
            if (!test_ip(ip) && !test_add(ip)) {
                show_informer_text("服务器地址错误");
                return false;
            }
            if (reg_url == "") {
                show_informer_text("注册地址不能为空");
                return false;
            }
            if (unreg_url == "") {
                show_informer_text("取消注册地址不能为空");
                return false;
            }
            if (plate_post_url == "") {
                show_informer_text("车牌推送地址不能为空");
                return false;
            }
            if (heart_url == "") {
                show_informer_text("心跳地址不能为空");
                return false;
            }
            if (device_id == "") {
                show_informer_text("设备ID不能为空");
                return false;
            }
            if (username == "") {
                show_informer_text("用户名不能为空");
                return false;
            }
            if (password == "") {
                show_informer_text("密码不能为空");
                return false;
            }
            var server_auth = username + ":" + password;
            server_auth = AesCtr.encrypt(server_auth, '天天', 128);
            var cfg = {};
            cfg.type = "set_http_t1400_cfg";
            cfg.module = 'HTTPSENDER_GAT1400_CONFIG_ALL';
            var body = {}
            body.enable = enable;
            body.server_port = parseInt(port);
            body.timeout = parseInt(timeout);
            body.server_ip = Base64.encode(ip, true);
            body.server_auth = server_auth;
            body.register_uri = Base64.encode(reg_url, true);
            body.unregister_uri = Base64.encode(unreg_url, true);
            body.motor_vehicles_uri = Base64.encode(plate_post_url, true);
            body.heartbeat_uri = Base64.encode(heart_url, true);
            body.device_id = Base64.encode(device_id, true);
            cfg.body = body;
            post(cfg, function () {
                show_informer();
            })
        }
        this.init = function () {
            $("#enable_1400").change(function () {
                var enable = $(this).check_val();
                ele_change(enable, "disabled_pro_1400");
            });

            $('#submit_1400').click(set_http_t1400_cfg)
            this.get_http_t1400_cfg();
        }
    }
    // 新增gb28181
    var gb28181 = new function () {
        function get_gb28181_config() { //获取gb28181配置
            var cfg = {};
            cfg.type = "get_gb28181_config";
            cfg.module = "BUS_GB28181_REQUEST";
            post(cfg, function (json) {
                var data = json.body;
                var enable = data["switch"];
                ele_change(enable, "disabled_gb");
                var access_type = data.access_type;
                var native_port = data.native_port;
                var sip_server_id = data.sip_server_id;
                var sip_server_region = data.sip_server_region;
                var sip_server_address = data.sip_server_address;
                var sip_server_port = data.sip_server_port;
                var sip_username = data.sip_username;
                var sip_authen_id = data.sip_authen_id;
                var sip_pwd = data.sip_pwd;
                var reg_validity = data.reg_validity;
                var heart_time = data.heart_time;
                var stream_index = data.stream_index;
                var expired_times = data.expired_times;
                var trans_protocol = data.trans_protocol;
                var reg_interval = data.reg_interval;
                var alarm_channel = data.alarm_channel;
                var alarm_code = data.alarm_code;
                var alarm_level = data.alarm_level;
                var channel_code = data.channel_code;
                $("#switch").check_val(enable == 1);
                $("#access_type").select_val(access_type);
                $("#native_port").val(native_port);

                $("#sip_server_id").val(sip_server_id);
                $("#sip_server_region").val(sip_server_region);
                $("#sip_server_address").val(sip_server_address);
                $("#sip_server_port").val(sip_server_port);
                $("#sip_username").val(sip_username);
                $("#sip_authen_id").val(sip_authen_id);
                $("#sip_pwd").val(sip_pwd);
                $("#re_sip_pwd").val(sip_pwd);
                $("#reg_validity").val(reg_validity);
                $("#heart_time").val(heart_time);
                $("#stream_index").select_val(stream_index);
                $("#trans_protocol").select_val(trans_protocol);
                $("#expired_times").val(expired_times);
                $("#reg_interval").val(reg_interval);
                $("#alarm_channel").select_val(alarm_channel);
                $("#alarm_code").val(alarm_code);
                $("#alarm_level").select_val(alarm_level);
                $("#channel_code").val(channel_code);
            })
        }
        function set_gb28181_config() {
            var enable = $("#switch").check_val();
            var access_type = parseInt($("#access_type").select_val());
            var native_port = parseInt($("#native_port").val());
            if (isNaN(native_port) || native_port < 1024 || native_port > 65535) {
                show_informer_text($.i18n.prop('sip_port_error'));
                return;
            }
            var sip_server_id = $("#sip_server_id").val();
            if (sip_server_id == "") {
                show_informer_text($.i18n.prop('sip_server_id_error'));
                return;
            }
            var sip_server_region = $("#sip_server_region").val();
            if (sip_server_region == "") {
                show_informer_text($.i18n.prop('sip_server_region_error'));
                return;
            }
            var sip_server_address = $("#sip_server_address").val();
            if (sip_server_address == "" || !test_ip(sip_server_address)) {
                show_informer_text($.i18n.prop('sip_server_error'));
                return;
            }
            var sip_server_port = parseInt($("#sip_server_port").val());
            if (isNaN(sip_server_port) || sip_server_port < 1024 || sip_server_port > 65536) {
                show_informer_text($.i18n.prop('sip_server_port_error'));
                return;
            }
            var sip_username = $("#sip_username").val();
            if (sip_username == "") {
                show_informer_text($.i18n.prop('sip_name_error'));
                return;
            }
            var sip_authen_id = $("#sip_authen_id").val();
            if (sip_authen_id == "") {
                show_informer_text($.i18n.prop('sip_user_id_error'));
                return;
            }
            var sip_pwd = $("#sip_pwd").val();
            var re_sip_pwd = $("#re_sip_pwd").val();
            if (sip_pwd == "" || re_sip_pwd == "") {
                show_informer_text($.i18n.prop('sip_user_pwd_error'));
                return;
            }
            if (sip_pwd != re_sip_pwd) {
                show_informer_text($.i18n.prop('entered_passwords_differ'));
                return;
            }
            var reg_validity = parseInt($("#reg_validity").val());
            if (isNaN(reg_validity) || reg_validity < 60 || reg_validity > 3600) {
                show_informer_text($.i18n.prop('Registration_period') + " 60~3600");
                return;
            }
            var heart_time = parseInt($("#heart_time").val());
            if (isNaN(heart_time) || heart_time < 1 || heart_time > 60) {
                show_informer_text($.i18n.prop('Heartbeat_cycle_number') + " 1~60");
                return;
            }
            var stream_index = parseInt($("#stream_index").select_val());
            var trans_protocol = parseInt($("#trans_protocol").select_val());
            var expired_times = parseInt($("#expired_times").val());
            if (isNaN(expired_times) || expired_times < 1 || expired_times > 10) {
                show_informer_text($.i18n.prop('Heartbeat_timeout_number') + " 1~10");
                return;
            }
            var reg_interval = parseInt($("#reg_interval").val());
            if (isNaN(reg_interval) || reg_interval < 5 || reg_interval > 1800) {
                show_informer_text($.i18n.prop('Registration_interval_error') + " 5~1800");
                return;
            }
            var alarm_channel = parseInt($("#alarm_channel").select_val());
            var alarm_level = parseInt($("#alarm_level").select_val());
            var alarm_code = $("#alarm_code").val();
            var channel_code = $("#channel_code").val();
            if (channel_code == "") {
                show_informer_text($.i18n.prop('channel_number_null'));
                return;
            }
            var cfg = {};
            cfg.type = "set_gb28181_config";
            cfg.module = "BUS_GB28181_REQUEST";
            var json = {};
            json["switch"] = enable;
            json.access_type = access_type;
            json.native_port = native_port;
            json.sip_server_id = sip_server_id;
            json.sip_server_region = sip_server_region;
            json.sip_server_address = sip_server_address;
            json.sip_server_port = sip_server_port;
            json.sip_username = sip_username;
            json.sip_authen_id = sip_authen_id;
            json.sip_pwd = sip_pwd;
            json.reg_validity = reg_validity;
            json.heart_time = heart_time;
            json.stream_index = stream_index;
            json.trans_protocol = trans_protocol;
            json.reg_interval = reg_interval;
            json.expired_times = expired_times;
            json.alarm_channel = alarm_channel;
            json.alarm_code = alarm_code;
            json.alarm_level = alarm_level;
            json.channel_code = channel_code;
            cfg.body = json;
            post(cfg, function () {
                show_informer();
            })
        }
        this.init = function () {
            $("#switch").change(function () {
                var enable = $(this).check_val();
                ele_change(enable, "disabled_gb28181");
            });
            init_selectmenu("#access_type,#stream_index,#trans_protocol,#alarm_channel,#alarm_level", 200, 150)
            $("#gb_submit").click(set_gb28181_config);//保存配置按钮--gb28181
            get_gb28181_config();
        }
    }
    function get_boardversion_info() {
        get_device_capacity(function () {
            if (e4g_num == 0 || is_C3) {
                $("#4g_li").remove();
                $("#4g").remove();
            }
            if (stp_num == 0) {
                $("#pdns_li").remove();
                $("#pdns").remove();
            }
            if (wifi_num == 0) {
                $("#wifi_li").remove();
                $("#wifi").remove();
            }
            if (onenet_num == 0) {
                $("#onenet_li").remove();
                $("#onenet").remove();
            }
            // if (is_A300) {
            //   $("#pro_1400_li").remove();
            //   $("#pro_1400").remove();
            // }
            if (parent.cur_old_obj == "http") {
                centerserver_tab.init();
                ftp.init();
                vpn.init();
                if (stp_num == 1) {
                    pdns.init();
                }
                pro_1400.init();
                // gb28181.init();
                http_mqtt.init()
            } else if (parent.cur_old_obj == "port") {
                SetNetPort.basis.init();
                ddns.init();
                upnp.init();
                diag.init();
                discover.init();
                mtu.init();
                if (e4g_num == 1 && g_s_version != 0) {
                    g4.init();
                }
                if (wifi_num == 1) {
                    wifi.init();
                }
                if (onenet_num == 1) {
                    onenet.init();
                }
            } else {
                centerserver_tab.init();
                ftp.init();
                vpn.init();
                if (stp_num == 1) {
                    pdns.init();
                }
                SetNetPort.basis.init();
                ddns.init();
                upnp.init();
                diag.init();
                discover.init();
                mtu.init();
                if (e4g_num == 1 && g_s_version != 0) {
                    g4.init();
                }
                if (wifi_num == 1) {
                    wifi.init();
                }
                if (onenet_num == 1) {
                    onenet.init();
                }
                pro_1400.init();
                // gb28181.init();
                http_mqtt.init()
            }
        });
    }
    function judge_style() {
        if (g_style_time == "old" || g_style_time == "hrzx" || (ie.isIE && (ie.version <= 10 || (ie.emulatedversion != null && ie.emulatedversion <= 10)))) {
            $("#file_input_btn").hide();
            $("#file_name").hide();
            $("#file_input").show();
            $("#file_input_btn1").hide();
            $("#file_name1").hide();
            $("#file_input1").show();
        }
        if (g_style_time == "old") {
            $("#file_input_btn").css("width", "70px");
            $("#file_input_btn").css("font-size", "12px");
            if (parent.cur_old_obj == "port") {
                $("#http_li").remove();
                $("#http").remove();
                $("#http_mqtt_li").remove()
                $("#http_mqtt").remove()
                $("#http_test_li").remove();
                $("#http_test").remove();
                $("#ftp_li").remove();
                $("#ftp").remove();
                $("#pdns_li").remove();
                $("#pdns").remove();
                $("#vpn_li").remove();
                $("#vpn").remove();
                $("#pro_1400_li").remove();
                $("#pro_1400").remove();
                $("#gb28181_li").remove();
                $("#gb28181").remove();
            } else if (parent.cur_old_obj == "http") {
                $("#net_tabs>ul>li").not("#http_li,#http_mqtt_li,#http_test_li,#ftp_li,#pdns_li,#vpn_li,#pro_1400_li,#gb28181_li").remove();
                $("#net_tabs>div").not("#http,#http_mqtt,#http_test,#ftp,#pdns,#vpn,#pro_1400,#gb28181").remove();
                // $("#net_tabs>ul>li").not("#http_li,#http_test_li,#ftp_li,#pdns_li,#vpn_li,#pro_1400_li").remove();
                // $("#net_tabs>div").not("#http,#http_test,#ftp,#pdns,#vpn,#pro_1400").remove();
                $("#http_center tr:not(.small_title)").prepend("<td style='min-width:15px'></td>");
                $(".small_title").show();
                $("#indent_td").css("min-width", "15px");
            }
        }
    }
    var check_g3_status_timer = null;
    var tab_active = 0;
    function check_link_status_start() {
        if (!check_g3_status_timer) {
            check_g3_status_timer = setInterval(function () {
                if (tab_active == 1) {
                    upnp.get_upnp_portmap(1);
                } else if (tab_active == 2) {
                    ddns.get_ddns(1);
                } else if (tab_active == 3) {
                    vpn.get_openvpn(1);
                } else if (tab_active == 4) {
                    pdns.get_pdns(1);
                } else if (tab_active == 5) {
                    g4.check_g4_status();
                } else if (tab_active == 6) {
                    wifi.get_wifiparam();
                } else if (tab_active == 7) {
                    pro_1400.get_http_t1400_cfg(1)
                }
            }, 5000);
        }
    }
    var mtu = new function () {
        function get_mtu() {
            var cfg = {};
            cfg.type = "get_net_mtu";

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "mtujson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        json = json.body;
                        var mtu = json.mtu;
                        $("#mtu_input").val(mtu);
                    }
                }
            })
        }
        function set_mtu() {
            var mtu = $("#mtu_input").val();
            if (isNaN(mtu) || mtu < 500 || mtu > 1500) {
                show_informer_text($.prop('range') + ' 500 ~ 1500')
                return
            }
            var cfg = {};
            cfg.type = "set_net_mtu";
            cfg.body = {};
            cfg.body.mtu = parseInt(mtu);

            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "mtujson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                        get_mtu();
                    }
                }
            })
        }
        this.init = function () {
            $("#mtu_submit").click(set_mtu);
            get_mtu();
        }
    }
    var onenet = new function () {
        function get_onenet() {
            var cfg = {};
            cfg.type = "get_onenet_prm";
            cfg.module = "ONENET_REQUEST_MSG";
            post(cfg, function (res) {
                var body = res.body
                var onenet = body.onenet
                var enable = onenet.enable
                var mqttport = onenet.mqttport
                var mqttserver = onenet.mqttserver
                var productid = onenet.productid
                var key = onenet.key
                var push_property = body.push_property
                var time_span = push_property.time_span
                var location = push_property.location
                var location_enable = location.enable
                var altitude = location.altitude
                var coordinate = location.coordinate
                var latitude = location.latitude
                var longitude = location.longitude
                var software_enable = push_property.software.enable
                var sn_enable = push_property.sn.enable
                $("#onenet_enable").check_val(enable == 1)
                $("#mqttport").val(mqttport)
                $("#mqttserver").val(mqttserver)
                $("#productid").val(productid)
                $("#onenet_key").val(key)
                $("#time_span").val(time_span)
                $("#location_enable").check_val(location_enable == 1)
                $("#altitude").val(altitude)
                $("#coordinate").select_val(coordinate)
                $("#latitude").val(latitude)
                $("#longitude").val(longitude)
                $("#software_enable").check_val(software_enable == 1)
                $("#sn_enable").check_val(sn_enable == 1)
                ele_change(location_enable, 'disable_pos')
                ele_change(enable, 'disable_onenet')
            })

        }
        function set_onenet() {
            var enable = $("#onenet_enable").check_val() ? 1 : 0
            var mqttport = $("#mqttport").val()
            var mqttserver = $("#mqttserver").val()
            var productid = $("#productid").val()
            var onenet_key = $("#onenet_key").val()
            var time_span = $("#time_span").val()
            var location_enable = $("#location_enable").check_val() ? 1 : 0
            var altitude = $("#altitude").val()
            var coordinate = parseInt($("#coordinate").select_val())
            var latitude = $("#latitude").val()
            var longitude = $("#longitude").val()
            var software_enable = $("#software_enable").check_val() ? 1 : 0
            var sn_enable = $("#sn_enable").check_val() ? 1 : 0

            if (isNaN(mqttport)) {
                show_informer_text('MQTT端口必须是数字')
                return
            }
            if (isNaN(time_span) || time_span < 0 || time_span > 3600) {
                show_informer_text('上报间隔范围0~3600')
                return
            }
            if (isNaN(altitude) || altitude < 0 || altitude > 9999) {
                show_informer_text('高度范围0~9999')
                return
            }
            if (isNaN(latitude) || latitude < -90 || latitude > 90) {
                show_informer_text('纬度范围-90~90')
                return
            }
            if (isNaN(longitude) || longitude < -180 || longitude > 180) {
                show_informer_text('经度范围-180~180')
                return
            }

            var cfg = {};
            cfg.type = "set_onenet_prm";
            cfg.module = "ONENET_REQUEST_MSG";
            var body = {}
            body.onenet = {}
            body.onenet.enable = enable
            body.onenet.mqttport = parseInt(mqttport)
            body.onenet.mqttserver = mqttserver
            body.onenet.productid = productid
            body.onenet.key = onenet_key

            body.push_property = {}
            body.push_property.time_span = parseInt(time_span)

            var location = {}
            location.enable = location_enable
            location.altitude = parseInt(altitude)
            location.coordinate = coordinate
            location.latitude = parseFloat(parseFloat(latitude).toFixed(2))
            location.longitude = parseFloat(parseFloat(longitude).toFixed(2))
            body.push_property.location = location

            body.push_property.software = {}
            body.push_property.software.enable = software_enable

            body.push_property.sn = {}
            body.push_property.sn.enable = sn_enable

            cfg.body = body
            post(cfg, function () {
                show_informer()
                get_onenet()
            })
        }
        this.init = function () {
            init_selectmenu("#coordinate", 200, 150)
            $("#onenet_enable").change(function () {
                var enable = $(this).check_val() ? 1 : 0
                ele_change(enable, 'disable_onenet')
            })
            $("#location_enable").change(function () {
                var enable = $(this).check_val() ? 1 : 0
                ele_change(enable, 'disable_pos')
            })
            $("#onenet_submit").click(set_onenet);
            get_onenet();
        }
    }
    this.init = function () {
        judge_style();
        get_boardversion_info(g_boardversion);
        //jq-ui1.10支持tabs.tabs( "refresh" )，但selectmenu不支持1.10，所以只能现在创建
        //必须等ajax完成才建立tab
        create_tabs('#net_tabs');
        $("#net_tabs > ul > li").click(function () {
            var num = $(this).attr("num");
            if (num) {
                tab_active = parseInt(num);
            } else {
                tab_active = 0;
            }
        });
        check_link_status_start();
    }
    this.close = function () {
        clearInterval(check_wifi_timer);
        check_wifi_timer = null;
        clearInterval(cmd_timer);
        cmd_timer = null;
        cmd_flag = false;
        clearInterval(check_g3_status_timer);
        check_g3_status_timer = null;
        clearInterval(http_test_timer);
        http_test_timer = null;
    }
    close_json["SetNetPort"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetPlateDeviceIO
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var SetPlateDeviceIO = new function () {
    var cur_device_type = "";
    function get_device_type(callback) {
        var req = {};
        req.type = "get_group_cfg";

        $.ajax({
            type: "POST",
            url: "dgjson.php",
            data: JSON.stringify(req),
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json_data;
                try {
                    json_data = eval("(" + ajaxdata + ")");
                } catch (e) {
                    return false;
                }
                if (!json_data.vzid || !json_data.group_cfg) {
                    return false;
                }
                var type = json_data["vzid"].type;
                cur_device_type = type;
                if (callback) {
                    callback();
                }
            },
            dataType: "text"
        });
    }
    function get_boardversion_info(d_type, m_version, s_version) {
        get_device_capacity(function () {
            if (m_version == 8) {
                SetSync.get_sync();
            } else {
                $("#wait_opening_tr").remove();
            }
        });
    }

    var trigger_output_tab = new function () {
        var vzio_arr = [56, 40, 150, 171, 177, 173];
        function check_io(io) {
            for (var i = 0; i < vzio_arr.length; i++) {
                if (vzio_arr[i] == io) {
                    vzio_check[i] = true
                }
            }
        }
        function parse_config_info(json) {
            var cfg;
            var filters = ["default", "whitelist", "not_whitelist", "no_licence", "blacklist"];
            var input_value_list = [54, 55];
            var output_value_list = [40, 56, 177, 173, 1485, 2485, 3485, 8131, 150, 171];
            vzio_check = [false, false, false, false, false, false];
            try {
                cfg = jQuery.parseJSON(json);
            } catch (e) {
                return null;
            }

            $("#tabs-1 input[type=checkbox]").check_val(false);
            //set whitelist
            if (isNotUndefinedOrNull(cfg.white_list)) {
                $.each(cfg.white_list, function (io_index, io_val) {
                    var tg = $("[vzfilter='whitelist'][vzio=" + io_val + "]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='whitelist'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set not-whitelist
            if (isNotUndefinedOrNull(cfg.not_white_list)) {
                $.each(cfg.not_white_list, function (io_index, io_val) {
                    var tg = $("[vzfilter='whitelist'][vzio=" + io_val + "]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='not_whitelist'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set no_licence
            if (isNotUndefinedOrNull(cfg.no_licence)) {
                $.each(cfg.no_licence, function (io_index, io_val) {
                    var tg = $("[vzfilter='whitelist'][vzio=" + io_val + "]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='no_licence'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set black list
            if (isNotUndefinedOrNull(cfg.black_list)) {
                $.each(cfg.black_list, function (io_index, io_val) {
                    //var tg = $("[vzfilter='whitelist'][vzio="+io_val+"]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='blacklist'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set special_plates
            if (isNotUndefinedOrNull(cfg.special_plates)) {
                $.each(cfg.special_plates, function (io_index, io_val) {
                    //var tg = $("[vzfilter='whitelist'][vzio="+io_val+"]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='special_plates'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set in1
            if (isNotUndefinedOrNull(cfg.ext_ioctl1)) {
                $.each(cfg.ext_ioctl1, function (io_index, io_val) {
                    //var tg = $("[vzfilter='ext_ioctl1'][vzio="+io_val+"]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='ext_ioctl1'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set in2
            if (isNotUndefinedOrNull(cfg.ext_ioctl2)) {
                $.each(cfg.ext_ioctl2, function (io_index, io_val) {
                    //var tg = $("[vzfilter='whitelist'][vzio="+io_val+"]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='ext_ioctl2'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set in3
            if (isNotUndefinedOrNull(cfg.ext_ioctl3)) {
                $.each(cfg.ext_ioctl3, function (io_index, io_val) {
                    //var tg = $("[vzfilter='whitelist'][vzio="+io_val+"]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='ext_ioctl3'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set in4
            if (isNotUndefinedOrNull(cfg.ext_ioctl4)) {
                $.each(cfg.ext_ioctl4, function (io_index, io_val) {
                    //var tg = $("[vzfilter='whitelist'][vzio="+io_val+"]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='ext_ioctl4'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            //set offline_alarm
            if (isNotUndefinedOrNull(cfg.offline_alarm)) {
                $.each(cfg.offline_alarm, function (io_index, io_val) {
                    //var tg = $("[vzfilter='whitelist'][vzio="+io_val+"]");
                    if (jQuery.inArray(io_val, output_value_list) != -1) {
                        $("[vzfilter='offline_alarm'][vzio=" + io_val + "]").check_val(true);
                    }
                    check_io(io_val)
                });
            }

            // set enable fake
            if (isNotUndefinedOrNull(cfg.enable_fake_plate)) {
                $("#bx_plate_id").check_val(cfg.enable_fake_plate == 0);
            }
            for (var i = 0; i < vzio_check.length; i++) {
                if (vzio_check[i]) {
                    $("#flicker_out" + (i + 1)).check_disabled(true);
                }
            }
        }

        this.get_trigger_output = function () {
            $.get("vb.htm?getlinkagecfg",
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    parse_config_info(ajaxdata.split("=")[1]);
                });
        }

        function set_trigger_output() {
            var cfg = {};
            var arr = new Array();

            arr = [];
            $("[vzfilter='whitelist']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.white_list = arr;

            arr = [];
            $("[vzfilter='not_whitelist']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.not_white_list = arr;

            arr = [];
            $("[vzfilter='no_licence']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.no_licence = arr;

            arr = [];
            $("[vzfilter='blacklist']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.black_list = arr;

            arr = [];
            $("[vzfilter='special_plates']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.special_plates = arr;

            arr = [];
            $("[vzfilter='ext_ioctl1']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.ext_ioctl1 = arr;

            arr = [];
            $("[vzfilter='ext_ioctl2']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.ext_ioctl2 = arr;

            arr = [];
            $("[vzfilter='ext_ioctl3']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.ext_ioctl3 = arr;

            arr = [];
            $("[vzfilter='ext_ioctl4']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.ext_ioctl4 = arr;

            arr = [];
            $("[vzfilter='offline_alarm']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.offline_alarm = arr;

            if ($("#bx_plate_id").check_val()) {
                cfg.enable_fake_plate = 0;
            } else {
                cfg.enable_fake_plate = 1;
            }

            var jsonstr = JSON.stringify(cfg);
            $.get("vb.htm?setlinkagecfg=" + jsonstr, function (ajaxdata) {
                default_ajax_handler(ajaxdata);
                for (var i = 0; i < 6; i++) {
                    $("#flicker_out" + (i + 1)).check_enable(true);
                }
                trigger_output_tab.get_trigger_output();
                SetPlateDeviceIO.gpio.get_addition_gpio();
            });
        }
        this.init = function () {
            $("#cfgtable td").attr("align", "center");
            $("#submit_ioconfig_tabs1").click(function () {
                if (g_device_sync == 1) {
                    show_informer_text($.i18n.prop("sync_hint"));
                } else {
                    set_trigger_output();
                }
            });
            trigger_output_tab.get_trigger_output();
        }
    }

    var uart_tab_s = new function () {
        var g_baudrate = null;
        var g_parity = null;
        var g_databits = null;
        var g_stopbit = null;
        //检查值是否是一个选项
        function get_uart(channel) {
            var request_string;
            request_string = "vb.htm?paratest=uart." + channel;
            $.get(request_string, function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                var slicestring = ajaxdata.slice(ajaxdata.indexOf("=") + 1);
                var decode = Base64.decode(slicestring);
                decode = decode.split(":");
                g_baudrate = decode[0];
                g_parity = decode[1];
                g_databits = decode[2];
                g_stopbit = decode[3];
                $('#ptz_baudrate' + channel).select_val(g_baudrate);
                $('#ptz_parity' + channel).select_val(g_parity);
                $('#ptz_databits' + channel).select_val(g_databits);
                $('#ptz_stopbit' + channel).select_val(g_stopbit);
            });
        }

        function set_uart(channel) {
            var baudrate = $("#ptz_baudrate" + channel).select_val();
            var parity = $("#ptz_parity" + channel).select_val();
            var databits = $("#ptz_databits" + channel).select_val();
            var stopbit = $("#ptz_stopbit" + channel).select_val();

            var data = baudrate + ":" +
                +parity + ":" + databits + ":" + stopbit;
            //show_informer_text(data);
            var base64 = Base64.encode(data);
            var request_string;
            request_string = "vb.htm?uart=" + base64 + "." + channel;
            //show_informer_text(request_string);
            $.get(request_string, function (ajaxdata) {
                default_ajax_handler(ajaxdata);
            });
        }

        function load_cur_channel(channel) {
            get_uart(channel);
        }

        function init_channels() {
            for (var i = 0; i < channel_num; i++) {
                $("#uart" + i).css("display", "inline-block");
                load_cur_channel(i);
            }
        }

        this.init = function () {
            $("#goto_dsp").click(function () {
                onLinkClick("htmldata/SetPlateDeviceIO.htm?dsp", function () {
                    $("#dsp_li a").click();
                    $("#set_dsp").siblings().find("a").removeClass("active");
                    $("#set_dsp a").addClass("active");
                });
            });
            $(".uart_submit").click(function () {
                if (g_device_sync == 1) {
                    show_informer_text($.i18n.prop("sync_hint"));
                } else {
                    var num = $(this).attr("number");
                    set_uart(num);
                }
            });
            init_channels();
        }
    }

    var serial_out_tab = new function () {
        var g_tr_pos;
        var voice_json = {
            "in": {
                "prefix": "",
                "suffix": "",
                "inc_license": true
            },
            "out": {
                "prefix": "",
                "suffix": "",
                "inc_license": true
            },
            "na": {
                "prefix": "",
                "suffix": "",
                "inc_license": true
            },
            "iw": {
                "prefix": "",
                "suffix": "",
                "remain": 0,
                "inc_license": true
            }
        };
        //var g_demostr;
        function check_item_set(n, name) {
            if (typeof (n[name]) != "undefined" && n[name] != null) {
                c = $("#comm_" + name);
                var fmt = $("#comm_" + name + "_fmt");
                val = n[name];

                $("#comm_" + name).check_val(true);

                if (name == "license" && val == 1) {
                    $("#comm_encryption_fmt").select_val(val);
                    update_demotext();
                }

                /*if(name =="header") g_demostr+=val;
        else if(name =="checksum") g_demostr+="FF";
        else if(name =="edian") g_demostr;
        else g_demostr+=$("#comm_"+name).attr("dmvalue");*/

                var tr_current = c.parent().parent();
                tr_current.insertAfter(g_tr_pos);
                g_tr_pos = tr_current;

                if (!jQuery.isEmptyObject(fmt)) {
                    if (fmt.is("select")) fmt.select_val(val);
                    else fmt.val(val);
                }
                return true;
            } else {
                return false;
            }
        }

        function parse_comm_config(cfg) {
            var itemname = ["enable", "license", "licensecolor", "licensetype", "confidence", "direction", "rect", "trigger", "carcolor", "time", "duetime", "wlresult", "out", "sn", "ciphertext", "id", "carlogo"];
            g_tr_pos = $("#tr_header");

            var header, end, checkbegin, checkend, checksum, edian, encode;
            $.each(cfg, function (i, n) {
                if (isNotUndefinedOrNull(n["header"])) {
                    header = n["header"];
                } else if (isNotUndefinedOrNull(n["end"])) {
                    end = n["end"];
                } else if (isNotUndefinedOrNull(n["checkbegin"])) {
                    checkbegin = n["checkbegin"];
                } else if (isNotUndefinedOrNull(n["checkend"])) {
                    checkend = n["checkend"];
                } else if (isNotUndefinedOrNull(n["checksum"])) {
                    checksum = n["checksum"];
                } else if (isNotUndefinedOrNull(n["edian"])) {
                    edian = n["edian"];
                } else if (isNotUndefinedOrNull(n["encode"])) {
                    encode = n["encode"];
                } else if (isNotUndefinedOrNull(n["voice"])) {
                    $("#comm_voice").check_val(true);
                    voice_json = n["voice"];
                    init_default_voice();
                } else if (isNotUndefinedOrNull(n["ne_compatible"])) {
                    $("#comm_ne_compatible").select_val(n["ne_compatible"]);
                } else {
                    for (var key in itemname) {
                        if (check_item_set(n, itemname[key]) == true) break;
                    }
                }
            });

            $("#comm_header_fmt").val(header);
            $("#comm_end_fmt").val(end);
            $('#comm_checksum_fmt').select_val(checksum);
            $('#comm_edian_fmt').select_val(edian);
            $('#comm_encode_fmt').select_val(encode);

            update_demotext_and_selections();

            var checkbegin_val = checkbe_value_to_key(checkbegin, checkend);
            var checkend_val = checkbe_value_to_key2(checkbegin, checkend);

            $('#comm_checkbegin_fmt').select_val(checkbegin_val["begin"]);
            $('#comm_checkend_fmt').select_val(checkend_val["end"]);
        }
        var g_cfg_table_cur_index = -1;

        function select_comm_cfg_table_item(index, cl) {
            if (index < 0) return false;
            index += 1;
            //show_informer_text(index+"*"+g_cfg_table_cur_index);

            var tr_item = $("#comm_cfg_tbl tr");
            if (tr_item.eq(index).length == 0) return false;
            if (g_cfg_table_cur_index != -1 && g_cfg_table_cur_index < tr_item.length) {
                tr_item.eq(g_cfg_table_cur_index).removeClass("ui-state-active");
            }
            tr_item.eq(index).addClass("ui-state-active");
            g_cfg_table_cur_index = index;
        }

        function cfg_table_moveup() {
            var cur_index = g_cfg_table_cur_index;
            if (cur_index == -1) {
                show_informer_text($.i18n.prop("move_hint"));
                return false;
            }
            var max_index = $("#comm_cfg_tbl tr").length - 2;
            if (cur_index >= max_index) return false;
            var index_new = cur_index - 1;
            if (cur_index == index_new || index_new < 2 || index_new >= max_index) return false;
            var tr_item = $("#comm_cfg_tbl tr");
            var current_item = tr_item.eq(cur_index);
            var next_item = tr_item.eq(index_new);
            next_item.insertAfter(current_item);
            g_cfg_table_cur_index = index_new;
        }

        function cfg_table_movedown() {
            var cur_index = g_cfg_table_cur_index;
            if (cur_index == -1) {
                show_informer_text($.i18n.prop("move_hint"));
                return false;
            }
            var max_index = $("#comm_cfg_tbl tr").length - 2;
            if (cur_index <= 1) return false;
            var index_new = cur_index + 1;

            if (cur_index == index_new || index_new < 2 || index_new >= max_index) return false;
            var tr_item = $("#comm_cfg_tbl tr");
            var current_item = tr_item.eq(cur_index);
            var next_item = tr_item.eq(index_new);
            current_item.insertAfter(next_item);
            g_cfg_table_cur_index = index_new;
        }

        function setchecked(id, val) {
            setchecked_obj($("#" + id), val);
        }

        function setchecked_obj(obj, val) {
            obj.check_val(val);
        }

        function set_check_list(items) {
            //to-do check valid
            $("input[usedfor='comm_cfg']:checked").each(function (itm) {
                setchecked_obj($(this), false);
            });
            var tr_pos = $("#tr_header");
            $.each(items, function (i, n) {
                var c = $("#" + n);
                if (!jQuery.isEmptyObject(c)) {
                    setchecked_obj(c, true);
                    var tr_current = c.parent().parent();
                    tr_current.insertAfter(tr_pos);
                    tr_pos = tr_current;
                }
            });
        }

        function gen_comm_cfg_key_str(call_back, call_back2) {
            var dmestr = $("#comm_header_fmt").val();
            $("input[usedfor='comm_cfg']:checked").each(function (itm) {
                var id = $(this)[0].id;

                if (call_back) {
                    call_back($(this), dmestr);
                }
                if (id == "comm_time" || id == "comm_duetime") {
                    var fmt = $("#" + id + "_fmt").select_val();
                    if (fmt == "1") {
                        dmestr += "20150707132529";
                    } else if (fmt == "2") {
                        dmestr += "150707132529";
                    } else if (fmt == "3") {
                        dmestr += "29251307072015";
                    } else if (fmt == "4") {
                        dmestr += "292513070715";
                    } else if (fmt == "5") {
                        dmestr += "20150707";
                    } else if (fmt == "6") {
                        dmestr += "150707";
                    } else if (fmt == "7") {
                        dmestr += "2015070713252932";
                    } else {
                        dmestr += "20150707";
                    }
                } else {
                    dmestr += $(this).attr("dmvalue");
                }
                if (call_back2) {
                    call_back2($(this), dmestr);
                }
            });
            if ($("#comm_checksum_fmt").select_val() != "none") dmestr += "FF";
            dmestr += $("#comm_end_fmt").val();
            if ($("#comm_voice").is(":checked")) {
                dmestr += $("#comm_voice").attr("dmvalue");
            }
            return dmestr;
        }

        function checkbe_value_to_key(begin_val, end_val) {
            var values = {};
            gen_comm_cfg_key_str(function (item, dmestr) {
                if (begin_val == dmestr.length / 2) {
                    values["begin"] = item[0].id;
                }
                if (end_val == dmestr.length / 2) {
                    values["end"] = item[0].id;
                }
            }, null);
            return values;
        }

        function checkbe_value_to_key2(begin_val, end_val) {
            var values2 = {};
            gen_comm_cfg_key_str(null, function (item, dmestr) {
                if (begin_val == dmestr.length / 2) {
                    values2["begin"] = item[0].id;
                }
                if (end_val == dmestr.length / 2) {
                    values2["end"] = item[0].id;
                }
            });
            return values2;
        }

        function checkbe_key_to_value(values) {
            gen_comm_cfg_key_str(function (item, dmestr) {
                var id = item[0].id;
                if (isNotUndefinedOrNull(values[id])) {
                    values[id] = dmestr.length / 2;
                }
            }, null);
            return values;
        }

        function checkbe_key_to_value2(values2) {
            gen_comm_cfg_key_str(null, function (item, dmestr) {
                var id = item[0].id;
                if (isNotUndefinedOrNull(values2[id])) {
                    values2[id] = dmestr.length / 2;
                }
            });
            return values2;
        }

        function set_default_encryption() {
            $("#comm_encryption_fmt").select_val(0);
            $("#tr_license td:eq(2)").html("7 " + $.i18n.prop("byte"));
            $("#comm_license").attr("dmvalue", "00413132333435");
        }

        function update_demotext_and_selections() {
            var option_text_begin = "";
            var option_text_end = "";
            var i = 0;
            var value_begin = 0;
            var value_end = 0;

            if (!$("#comm_license").is(":checked")) {
                set_default_encryption();
            }

            var dmestr = gen_comm_cfg_key_str(function (item, str) {
                var id = item[0].id;
                var name = item[0].name;
                if (i == 0) {
                    value_begin = id;
                }
                value_end = id;
                option_text_begin += "<option value=\"" + id + "\">" + name + "</option>";
                option_text_end += "<option value=\"" + id + "\">" + name + "</option>";
                i++;
            }, null);

            $("#demodisplay").html(dmestr);

            if (option_text_begin == "") {
                option_text_begin = "<option value=\"-1\" disabled=\"disabled\">无</option>";
            }
            if (option_text_end == "") {
                option_text_end = "<option value=\"-1\" disabled=\"disabled\">无</option>";
            }

            $("#comm_checkbegin_fmt").html(option_text_begin);
            $("#comm_checkend_fmt").html(option_text_end);
            $("#comm_checkbegin_fmt").selectmenu("refresh");
            $("#comm_checkend_fmt").selectmenu("refresh");
            $('#comm_checkbegin_fmt').select_val(value_begin);
            $('#comm_checkend_fmt').select_val(value_end);
        }

        function set_default_cfg() {
            $("#comm_header_fmt").val("BB88");
            $("#comm_end_fmt").val("33");
            $('#comm_checkbegin_fmt').select_val(0);
            $('#comm_checkend_fmt').select_val(0);
            $('#comm_checksum_fmt').select_val("xor");
            $('#comm_edian_fmt').select_val("little");
            set_default_encryption();
            $('#comm_encode_fmt').select_val(1);
            var tr_item = $("#comm_cfg_tbl tr");
            if (g_cfg_table_cur_index != -1 && g_cfg_table_cur_index < tr_item.length) {
                tr_item.eq(g_cfg_table_cur_index).removeClass("ui-state-active");
                g_cfg_table_cur_index = -1;
            }
        }

        function set_comm_simple_cfg() {
            set_default_cfg();
            var items = ["comm_enable", "comm_licensecolor", "comm_license"];
            set_check_list(items);
            //show_informer_text("2");
            update_demotext_and_selections();
        }

        function set_comm_normal_cfg() {
            set_default_cfg();
            var items = ["comm_enable", "comm_license", "comm_licensecolor", "comm_confidence", "comm_sn", "comm_wlresult"];
            set_check_list(items);
            //show_informer_text("3");
            update_demotext_and_selections();
        }

        function set_comm_all_cfg() {
            $("#comm_header_fmt").val("BB88");
            $("#comm_end_fmt").val("33");
            $('#comm_checkbegin_fmt').select_val(0);
            $('#comm_checkend_fmt').select_val(0);
            $('#comm_checksum_fmt').select_val("xor");
            $('#comm_edian_fmt').select_val("little");
            $("input[usedfor='comm_cfg']").each(function (itm) {
                setchecked_obj($(this), true);
            });
            //show_informer_text("4");
            update_demotext_and_selections();
        }
        //function set_comm_all_cfg() {
        //    $("input[usedfor='comm_cfg']").each(function (itm) {
        //        setchecked_obj($(this), true);
        //    });
        //    //show_informer_text("5");
        //    update_demotext_and_selections();
        //}
        function make_json_item_comm(item, fmt) {
            var key = item.substr(5);
            var obj = new Object();
            obj[key] = fmt;
            return obj;
        }

        function make_json_item(item, fmt) {
            if (fmt == "") fmt = "0";
            var key = item.substr(5);
            var obj = new Object();
            obj[key] = fmt;
            return obj;
        }

        function make_json_item_end(item, fmt) {
            if (fmt == "") fmt = "0";
            var key = item.substr(5);
            var obj = new Object();
            obj[key] = fmt;
            return obj;
        }

        function set_comm_push_config(cfg) {
            //添加头，校验，大小端
            var header = $("#comm_header_fmt").val();
            //if (header == "") return false;
            var patt = new RegExp("[^a-fA-F0-9]");
            var ret_test = patt.test(header);

            if (header != "" && (ret_test || header.length % 2 != 0)) {
                show_informer_text($.i18n.prop("mark_head_error"));
                return "";
            }

            var arr = Array();

            arr.push(make_json_item_comm("comm_header", header));
            var demostr = header;

            $("input[usedfor='comm_cfg']:checked").each(function (index) {
                keyid = $(this)[0].id;
                if (jQuery.type(keyid) == "string") {
                    fmt = 0;
                    if (keyid == "comm_time") {
                        fmt = $("#comm_time_fmt").val();
                    } else if (keyid == "comm_duetime") {
                        fmt = $("#comm_duetime_fmt").val();
                    } else if (keyid == "comm_license") {
                        fmt = $("#comm_encryption_fmt").val();
                    }
                    arr.push(make_json_item(keyid, fmt));
                }
            });

            var check_begin = {};
            var check_end = {};
            check_begin[$("#comm_checkbegin_fmt").val()] = 0;
            check_begin[$("#comm_checkend_fmt").val()] = 0;
            check_end[$("#comm_checkbegin_fmt").val()] = 0;
            check_end[$("#comm_checkend_fmt").val()] = 0;

            check_begin = checkbe_key_to_value(check_begin);
            check_end = checkbe_key_to_value2(check_end);

            var checkbegin = check_begin[$("#comm_checkbegin_fmt").val()];
            var checkend = check_end[$("#comm_checkend_fmt").val()];
            if (checkbegin >= checkend && checkbegin != 0 && checkend != 0) {
                show_informer_text($.i18n.prop("check_bit_error"));
                return false;
            }
            arr.push(make_json_item("comm_checkbegin", checkbegin.toString()));
            arr.push(make_json_item("comm_checkend", checkend.toString()));
            arr.push(make_json_item_comm("comm_checksum", $("#comm_checksum_fmt").val()));
            var end = $("#comm_end_fmt").val();
            //if(end =="")return false;
            //var patt = new RegExp("[^a-fA-F0-9]");
            var ret_end_test = patt.test(end);
            if (ret_end_test || end.length % 2 != 0) {
                show_informer_text($.i18n.prop("mark_tail_error"));
                return "";
            }
            arr.push(make_json_item_comm("comm_end", end));
            arr.push(make_json_item("comm_encode", $("#comm_encode_fmt").val()));
            arr.push(make_json_item_comm("comm_edian", $("#comm_edian_fmt").val()));
            var tr_item = $("#comm_cfg_tbl tr");
            if (g_cfg_table_cur_index != -1 && g_cfg_table_cur_index < tr_item.length) {
                tr_item.eq(g_cfg_table_cur_index).removeClass("ui-state-active");
            }
            if ($("#comm_voice").is(":checked")) {
                arr.push(make_json_item_comm("comm_voice", voice_json));
            }
            var ne_compatible = $("#comm_ne_compatible").select_val();
            arr.push(make_json_item_comm("comm_ne_compatible", ne_compatible));

            cfg.comm_push_cfg = arr;
            return true;
        }

        function parse_config_info(cfg) {
            if (isNotUndefinedOrNull(cfg.comm_push_cfg)) {
                parse_comm_config(cfg.comm_push_cfg);
            }
        }

        function get_serial_out() {
            var cfg = {};
            cfg.type = "get_rs485_push";
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "bbjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state_code == 200) {
                        $("#deal_tb").show();
                        var body = json.body;
                        parse_config_info(body);
                    }
                }
            });
        }

        function parse_data(ajaxdata, sp, flag) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state_code == 200) {
                var body = json.body;
                var deal = body.screen_ctrl_pro_type;
                $("#deal_mode").select_val(deal);
                if (!flag) {
                    show_deal(deal);
                }
                if (deal != 0) {
                    var num = 1;
                    var usp = body.use_serial_port;
                    var startmode = body.screen_isopen;
                    $("#use_serial_port").select_val(usp);
                    $("#start_mode1").select_val(startmode);


                    var fc = body.free_cfg;
                    for (var i = 0; i < fc.length; i++) {
                        var s_m = fc[i].show_mode;
                        if (i == 0) {
                            $("#bf_content" + (i + num) + "_enable").check_val((s_m & 1) > 0);
                            var content = fc[i].show_content;
                            if (content != "") {
                                content = Base64.decode(content, true);
                            }
                            $("#bf_content" + (i + num)).val(content);
                        } else if (i == 1) {
                            $("#bf_time" + (i + num) + "_enable").check_val((s_m & (1 << 1)) > 0);
                            $("#bf_parking" + (i + num) + "_enable").check_val((s_m & (1 << 2)) > 0);
                        }
                    }
                    var bc = body.busy_cfg;
                    for (var i = 0; i < bc.length; i++) {
                        var s_m = bc[i].show_mode;
                        if (i == 0) {
                            $("#bb_content" + (i + num) + "_enable").check_val((s_m & 1) > 0);
                            var content = bc[i].show_content;
                            if (content != "") {
                                content = Base64.decode(content, true);
                            }
                            $("#bb_content" + (i + num)).val(content);
                        } else if (i == 1) {
                            $("#bb_plate" + (i + num) + "_enable").check_val((s_m & (1 << 3)) > 0);
                            if (sp == "output") {
                                $("#bb_time" + (i + num) + "_enable").check_val((s_m & (1 << 5)) > 0);
                                $("#bb_money" + (i + num) + "_enable").check_val((s_m & (1 << 6)) > 0);
                            }
                        }
                    }
                }
                show_led_txt();
            }
        }
        function change_hide(hidden_mode) {
            if (hidden_mode == 3 || hidden_mode == 7 || hidden_mode == 15 || hidden_mode == 62 || hidden_mode == 31 || hidden_mode == 38 || hidden_mode == 39 || hidden_mode == 166 || hidden_mode == 294 || hidden_mode == 135 || hidden_mode == 263) {
                $(".no_white_List").show(); //让非白名单选择框显示
            } else {
                $(".no_white_List").hide();
            }

        }

        function parse_data_c(ajaxdata, sp, flag) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state_code == 200) {
                var body = json.body;
                var deal = body.screen_ctrl_pro_type;
                $("#deal_mode").select_val(deal);

                if (!flag) {
                    show_deal(deal);
                }
                if (deal != 0) {
                    var num = 1;
                    if (deal == 1 || deal == 2) {
                        num = 0;
                    }
                    var usp = body.use_serial_port;
                    var startmode = body.screen_isopen;
                    $("#use_serial_port").select_val(usp);
                    $("#start_mode1").select_val(startmode);


                    var fc = body.free_cfg;
                    for (var i = 0; i < fc.length; i++) {
                        var s_m = fc[i].show_mode;
                        $("#cf_time" + (i + num) + "_enable").check_val((s_m & (1 << 1)) > 0);
                        $("#cf_content" + (i + num) + "_enable").check_val((s_m & 1) > 0);
                        var content = fc[i].show_content;
                        if (content != "") {
                            content = Base64.decode(content, true);
                        }
                        $("#cf_content" + (i + num)).val(content);
                        if (deal == 1 || deal == 2) {
                            $("#cf_parking" + (i + num) + "_enable").check_val((s_m & (1 << 2)) > 0);
                        }
                        if (deal == 4 || deal == 8) {
                            var color = fc[i].show_color;
                            $("#cf_color" + (i + num)).select_val(color);
                        }
                    }
                    var bc = body.busy_cfg;
                    for (var i = 0; i < bc.length; i++) {
                        var s_m = bc[i].show_mode;
                        $("#cb_content" + (i + num) + "_enable").check_val((s_m & 1) > 0);
                        $("#cb_plate" + (i + num) + "_enable").check_val((s_m & (1 << 3)) > 0);
                        $("#cb_type" + (i + num) + "_enable").check_val((s_m & (1 << 4)) > 0);
                        if (sp == "output") {
                            $("#cb_time" + (i + num) + "_enable").check_val((s_m & (1 << 5)) > 0);
                            $("#cb_money" + (i + num) + "_enable").check_val((s_m & (1 << 6)) > 0);
                        }
                        var content = bc[i].show_content;
                        if (content != "") {
                            content = Base64.decode(content, true);
                        }
                        $("#cb_content" + (i + num)).val(content);
                        if (deal == 4 || deal == 8) {
                            var color = bc[i].show_color;
                            $("#cb_color" + (i + num)).select_val(color);
                            if (deal == 8) {
                                $("#cb_t" + (i + num) + "_enable").check_val((s_m & (1 << 1)) > 0);
                            }
                        }
                    }
                    if (deal != 1 && deal != 2) {
                        var voice = body.voice_cfg;
                        $(".strategy").select_val(voice.voice_mode);
                        change_hide(voice.voice_mode);
                        $("#greeting").select_val(voice.voice_welcom);
                        $("#dsp_tag").select_val(voice.voice_tag);
                        //加两个字段:非白名单
                        ($("#monthly_greet").select_val(voice.temporary_voice_welcome));
                        ($("#monthly_tag").select_val(voice.temporary_voice_tag));

                        if (deal == 4) {
                            var mac_cfg = body.mac_cfg;
                            // $("#use_mac_addr").val(mac_cfg.mac_addr);
                            $("#use_mac_pwd").val(mac_cfg.mac_pwd);
                        }
                        if (deal == 4 || deal == 6 || deal == 7 || deal == 8 || deal == 9) {
                            set_slider_val("voice", voice.voice_volume);
                            if (deal == 7 || deal == 8 || deal == 9) {
                                var line_num = body.line_num;
                                $("#line_num").select_val(line_num);
                                show_tr(line_num);
                                if (deal == 7 || deal == 8) {
                                    var voice_sync_screen = 0
                                    if (body['voice_sync_screen']) {
                                        voice_sync_screen = body.voice_sync_screen
                                    }
                                    $('#voice_sync_screen').check_val(voice_sync_screen == 1)
                                    voice_sync_screen_change(voice_sync_screen);
                                    if (deal == 7) {
                                        var muticast_ip = body.muticast_ip
                                        $("#muticast_ip").val(muticast_ip)
                                    }
                                }
                            }
                        }
                    }
                    if (deal == 3 || deal == 6 || deal == 10) {
                        var direction = body.show_direction;
                        $("#direction").select_val(direction);
                    }
                }
                if (deal == 1 || deal == 2) {
                    show_led_txt();
                } else {
                    show_led_txt_c(deal);
                }
            }
        }

        function parse_data_d(ajaxdata, flag) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state_code == 200) {
                var body = json.body;
                var deal = body.screen_ctrl_pro_type;
                $("#deal_mode").select_val(deal);
                if (!flag) {
                    show_deal(deal);
                }
                if (deal != 0) {
                    var usp = body.use_serial_port;
                    var startmode = (body.screen_isopen > 0) ? 1 : 0;
                    $("#use_serial_port").select_val(usp);
                    $("#start_mode2").select_val(startmode);
                }
            }
        }
        var old_deal = 0;
        var old_data = null;

        function get_led_ctrl_cfg(sp) {
            var cfg = {};
            cfg.type = "get_led_ctrl_cfg";

            var jsonstr = JSON.stringify(cfg);

            $.ajax({
                type: 'POST',
                url: "bbjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state_code == 200) {
                        $("#deal_tb").show();
                        var body = json.body;
                        var deal = body.screen_ctrl_pro_type;

                        //默认为A协议,没有voice_cfg这些字段,网页适配
                        if (body['voice_cfg'] != undefined) {
                            //获取值后是否让非白名单问候语显示
                            var no_whitelist_mode = body.voice_cfg.voice_mode;
                            change_hide(no_whitelist_mode);
                        } else {
                            $(".no_white_List").hide();
                        }

                        old_deal = deal;
                        if (deal == 1 || deal == 2) {
                            parse_data(ajaxdata, sp);
                        } else if (deal == 3 || deal == 4 || deal == 6 || deal == 7 || deal == 8 || deal == 9 || deal == 10) {
                            parse_data_c(ajaxdata, sp);
                        } else if (deal == 5) {
                            parse_data_d(ajaxdata);
                        } else if (deal == 0) {
                            show_deal(deal);
                        }

                        old_data = ajaxdata;
                    }
                }
            });
        }

        function clear_option() {
            $("#start_mode1").select_val(2);
            $("#start_mode2").select_val(1);

            $("#use_serial_port").select_val(0)
            $("#bf_content_enable").check_val(false);
            $("#bf_content").val("");
            $("#bf_time_enable").check_val(false);
            $("#bf_parking_enable").check_val(false);

            $("#bb_content_enable").check_val(false);
            $("#bb_content").val("");
            $("#bb_plate_enable").check_val(false);
            $("#bb_time_enable").check_val(false);
            $("#bb_money_enable").check_val(false);
            show_led_txt();
        }

        function clear_option_c(deal) {
            $("#use_serial_port").select_val(0)
            $("#start_mode1").select_val(2);
            $("#start_mode2").select_val(1);
            for (var i = 1; i < 5; i++) {
                $("#cf_time" + i + "_enable").check_val(false);
                $("#cf_content" + i + "_enable").check_val(false);
                $("#cf_content" + i).val("");

                $("#cb_content" + i + "_enable").check_val(false);
                $("#cb_plate" + i + "_enable").check_val(false);
                $("#cb_type" + i + "_enable").check_val(false);
                $("#cb_content" + i).val("");
                $("#cb_t" + i + "_enable").check_val(false);
                if (old_type == "output") {
                    $("#cb_time" + i + "_enable").check_val(false);
                    $("#cb_money" + i + "_enable").check_val(false);
                }
            }
            $("#dsp_" + cur_device_type).select_val(0);
            $(".no_white_List").hide();
            $("#greeting").select_val(1);
            $("#dsp_tag").select_val(4);
            $("#line_num").select_val(2);
            if (deal == 3 || deal == 4 || deal == 6 || deal == 10) {
                show_tr(4);
            } else {
                show_tr(2);
            }
            set_slider_val("voice", 0);
            var deal = parseInt($("#deal_mode").select_val());
            show_led_txt_c(deal);
        }

        function set_slider_val(name, val) {
            $("#" + name + "_slider").slider('value', val);
        }

        function init_slider(name) {
            var slider_name = "#" + name + "_slider";
            var text_name = "#" + name + "_text";
            $(slider_name).slider({
                range: "min",
                value: 0,
                min: 0,
                max: 9,
                change: function (event, ui) {
                    $(text_name).html(ui.value);
                },
                slide: function (event, ui) {
                    $(text_name).html(ui.value);
                }
            });
            $(text_name).html($(slider_name).slider("value"));
        }
        function check_led_ctrl_cfg_param() {
            var f_show_enable = $("#bf_content1_enable").check_val() ? 1 : 0;
            var f_show_content = $.trim($("#bf_content1").val());
            if (f_show_enable && f_show_content == "") {
                show_informer_text($.i18n.prop("display_content_empty"));
                return false;
            }
            var f_show_length = 0;
            if (f_show_content.match(re)) {
                f_show_length = f_show_content.match(re).length;
            }
            var f_show_n_length = 0;
            if (f_show_content.match(re_num)) {
                f_show_n_length = f_show_content.match(re_num).length;
            }

            var text_length = f_show_content.length;
            var all_length = f_show_length * 3 + f_show_n_length + (text_length - f_show_length - f_show_n_length) * 3;
            if (all_length > 31) {
                show_informer_text($.i18n.prop("content_exceed_limit"));
                return false;
            }
            var b_show_enable = $("#bb_content1_enable").check_val() ? 1 : 0;
            var b_show_content = $.trim($("#bb_content1").val());
            if (b_show_enable && b_show_content == "") {
                show_informer_text($.i18n.prop("display_content_empty"));
                return false;
            }
            var b_show_length = 0;
            if (b_show_content.match(re)) {
                b_show_length = b_show_content.match(re).length;
            }
            var b_show_n_length = 0;
            if (b_show_content.match(re_num)) {
                b_show_n_length = b_show_content.match(re_num).length;
            }
            var text_length = b_show_content.length;
            var all_length = b_show_length * 3 + b_show_n_length + (text_length - b_show_length - b_show_n_length) * 3;
            if (all_length > 31) {
                show_informer_text($.i18n.prop("content_exceed_limit"));
                return false;
            }
            return true;
        }
        var re = /[\u4E00-\u9FA5]/g;
        var re_num = /[A-Za-z0-9]/g;
        function set_led_ctrl_cfg() {
            var screen_ctrl_pro_type = parseInt($("#deal_mode").select_val());
            var screen_passageway = $("#screen_passageway").html();
            var startmode;
            startmode = parseInt($("#start_mode1").select_val());

            var use_serial_port = parseInt($("#use_serial_port").select_val());
            var f_show_enable = $("#bf_content1_enable").check_val() ? 1 : 0;
            var f_show_content = $.trim($("#bf_content1").val());
            if (f_show_content != "") {
                f_show_content = Base64.encode(f_show_content, true);
            }
            var f_show_curr_time = $("#bf_time2_enable").check_val() ? 1 : 0;
            var f_show_free_stall = $("#bf_parking2_enable").check_val() ? 1 : 0;

            var b_show_enable = $("#bb_content1_enable").check_val() ? 1 : 0;
            var b_show_content = $.trim($("#bb_content1").val());
            if (b_show_content != "") {
                b_show_content = Base64.encode(b_show_content, true);
            }
            var b_show_plate = $("#bb_plate2_enable").check_val() ? 1 : 0;
            var show_park_time = $("#bb_time2_enable").check_val() ? 1 : 0;
            var show_pay_money = $("#bb_money2_enable").check_val() ? 1 : 0;
            var cfg = {};
            cfg.type = "set_led_ctrl_cfg";
            cfg.body = {};
            cfg.body.screen_ctrl_pro_type = screen_ctrl_pro_type;
            if (screen_ctrl_pro_type == 1 || screen_ctrl_pro_type == 2) {
                //cfg.body.screen_passageway = screen_passageway;
                cfg.body.use_serial_port = use_serial_port;
                cfg.body.screen_isopen = startmode;
                cfg.body.free_cfg = [];
                cfg.body.busy_cfg = [];

                var f_json_1 = {};
                f_json_1.show_content = f_show_content;
                f_json_1.show_mode = f_show_enable;
                cfg.body.free_cfg.push(f_json_1);

                var f_json_2 = {};
                f_json_2.show_mode = f_show_curr_time << 1 | f_show_free_stall << 2;
                cfg.body.free_cfg.push(f_json_2);

                var b_json_1 = {};
                b_json_1.show_mode = b_show_enable;
                b_json_1.show_content = b_show_content;
                cfg.body.busy_cfg.push(b_json_1);

                var b_json_2 = {};
                var b_show_park_time = 0;
                var b_show_pay_money = 0;
                if (old_type == "output") {
                    b_show_park_time = show_park_time;
                    b_show_pay_money = show_pay_money;
                }
                b_json_2.show_mode = b_show_plate << 3 | b_show_park_time << 5 | b_show_pay_money << 6;
                cfg.body.busy_cfg.push(b_json_2);
            }

            var jsonstr = JSON.stringify(cfg);

            $.ajax({
                type: 'POST',
                url: "bbjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state_code == 200) {
                        show_informer();
                        get_led_ctrl_cfg(old_type);
                    }
                }
            });
        }
        function check_led_ctrl_cfg_c_param() {
            var flag = true;
            for (var i = 1; i < 5; i++) {
                var f_content_enable = $("#cf_content" + i + "_enable").check_val() ? 1 : 0;
                var f_content = $.trim($("#cf_content" + i).val());
                if (f_content_enable && f_content == "") {
                    show_informer_text($.i18n.prop("display_content_empty"));
                    flag = false;
                    break;
                }
                var f_length = 0;
                if (f_content.match(re)) {
                    f_length = f_content.match(re).length;
                }
                var f_n_length = 0;
                if (f_content.match(re_num)) {
                    f_n_length = f_content.match(re_num).length;
                }
                var text_length = f_content.length;
                var all_length = f_length * 3 + f_n_length + (text_length - f_length - f_n_length) * 3;
                if (all_length > 31) {
                    show_informer_text($.i18n.prop("content_exceed_limit"));
                    flag = false;
                    break;
                }

                var b_content_enable = $("#cb_content" + i + "_enable").check_val() ? 1 : 0;
                var b_content = $.trim($("#cb_content" + i).val());
                if (b_content_enable && b_content == "") {
                    show_informer_text($.i18n.prop("display_content_empty"));
                    flag = false;
                    break;
                }
                var b_length = 0;
                if (b_content.match(re)) {
                    b_length = b_content.match(re).length;
                }
                var b_n_length = 0;
                if (b_content.match(re_num)) {
                    b_n_length = b_content.match(re_num).length;
                }
                var text_length = b_content.length;
                var all_length = b_length * 3 + b_n_length + (text_length - b_length - b_n_length) * 3;
                if (all_length > 31) {
                    show_informer_text($.i18n.prop("content_exceed_limit"));
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        function set_led_ctrl_cfg_c() {
            var screen_ctrl_pro_type = parseInt($("#deal_mode").select_val());

            var use_serial_port = parseInt($("#use_serial_port").select_val());
            var startmode;
            startmode = parseInt($("#start_mode1").select_val());
            var strategy = parseInt($("#dsp_" + cur_device_type).select_val());
            var greetings = parseInt($("#greeting").select_val());
            var tag = parseInt($("#dsp_tag").select_val());
            //新增非白名单两个字段
            var Temporary_welcom = parseInt($("#monthly_greet").select_val());
            var Temporary_tag = parseInt($("#monthly_tag").select_val());

            var cfg = {};
            cfg.type = "set_led_ctrl_cfg";
            cfg.body = {};
            cfg.body.screen_ctrl_pro_type = screen_ctrl_pro_type;
            if (screen_ctrl_pro_type == 3 || screen_ctrl_pro_type == 4 || screen_ctrl_pro_type == 6 || screen_ctrl_pro_type == 7 || screen_ctrl_pro_type == 8 || screen_ctrl_pro_type == 9 || screen_ctrl_pro_type == 10) {
                cfg.body.use_serial_port = use_serial_port;
                cfg.body.screen_isopen = startmode;

                cfg.body.free_cfg = [];
                cfg.body.busy_cfg = [];
                for (var i = 1; i < 5; i++) {
                    var f_time_enable = $("#cf_time" + i + "_enable").check_val() ? 1 : 0;
                    var f_content_enable = $("#cf_content" + i + "_enable").check_val() ? 1 : 0;
                    var f_content = $.trim($("#cf_content" + i).val());
                    if (f_content != "") {
                        f_content = Base64.encode(f_content, true);
                    }
                    var f_json = {};
                    f_json.show_mode = f_content_enable | f_time_enable << 1;
                    f_json.show_content = f_content;
                    if (screen_ctrl_pro_type == 4 || screen_ctrl_pro_type == 8) {
                        var color = parseInt($("#cf_color" + i).select_val())
                        f_json.show_color = color;
                    }
                    cfg.body.free_cfg.push(f_json);

                    var b_plate_enable = $("#cb_plate" + i + "_enable").check_val() ? 1 : 0;
                    var b_type_enable = $("#cb_type" + i + "_enable").check_val() ? 1 : 0;
                    var b_content_enable = $("#cb_content" + i + "_enable").check_val() ? 1 : 0;
                    var b_content = $.trim($("#cb_content" + i).val());
                    var b_time_enable = 0;
                    var b_money_enable = 0;
                    var b_t_enable = 0;
                    if (screen_ctrl_pro_type == 8) {
                        b_t_enable = $("#cb_t" + i + "_enable").check_val() ? 1 : 0;
                    }
                    if (old_type == "output") {
                        b_time_enable = $("#cb_time" + i + "_enable").check_val() ? 1 : 0;
                        b_money_enable = $("#cb_money" + i + "_enable").check_val() ? 1 : 0;
                    }
                    if (b_content != "") {
                        b_content = Base64.encode(b_content, true);
                    }
                    var b_json = {};
                    b_json.show_mode = b_content_enable | b_t_enable << 1 | b_plate_enable << 3 | b_type_enable << 4 | b_time_enable << 5 | b_money_enable << 6;
                    b_json.show_content = b_content;
                    if (screen_ctrl_pro_type == 4 || screen_ctrl_pro_type == 8) {
                        var color = parseInt($("#cb_color" + i).select_val())
                        b_json.show_color = color;
                    }
                    cfg.body.busy_cfg.push(b_json);
                }

                cfg.body.voice_cfg = {};
                cfg.body.voice_cfg.voice_mode = strategy;
                cfg.body.voice_cfg.voice_welcom = greetings;
                cfg.body.voice_cfg.voice_tag = tag;
                cfg.body.voice_cfg.temporary_voice_welcome = Temporary_welcom;
                cfg.body.voice_cfg.temporary_voice_tag = Temporary_tag;


                if (screen_ctrl_pro_type == 4 || screen_ctrl_pro_type == 6 || screen_ctrl_pro_type == 7 || screen_ctrl_pro_type == 8 || screen_ctrl_pro_type == 9) {
                    var voice = parseInt($("#voice_text").html());
                    cfg.body.voice_cfg.voice_volume = voice;
                    if (screen_ctrl_pro_type == 4) {
                        cfg.body.mac_cfg = {};
                        // cfg.body.mac_cfg.mac_addr = parseInt($("#use_mac_addr").val());
                        cfg.body.mac_cfg.mac_pwd = parseInt($("#use_mac_pwd").val());
                    } else if (screen_ctrl_pro_type == 7 || screen_ctrl_pro_type == 8 || screen_ctrl_pro_type == 9) {
                        cfg.body.line_num = parseInt($("#line_num").select_val());
                        if (screen_ctrl_pro_type == 7 || screen_ctrl_pro_type == 8) {
                            cfg.body.voice_sync_screen = $("#voice_sync_screen").check_val() ? 1 : 0
                            if (screen_ctrl_pro_type == 7) {
                                cfg.body.muticast_ip = $("#muticast_ip").val();
                            }
                        }
                    }
                }
                if (screen_ctrl_pro_type == 3 || screen_ctrl_pro_type == 6 || screen_ctrl_pro_type == 10) {
                    var direction = parseInt($("#direction").select_val());
                    cfg.body.show_direction = direction;
                }
            }

            var jsonstr = JSON.stringify(cfg);

            $.ajax({
                type: 'POST',
                url: "bbjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state_code == 200) {
                        show_informer();
                        get_led_ctrl_cfg(old_type);
                    }
                }
            });
        }

        function set_led_ctrl_cfg_d() {
            var cfg = {};
            cfg.type = "set_led_ctrl_cfg";
            cfg.body = {};
            cfg.body.screen_ctrl_pro_type = parseInt($("#deal_mode").select_val());
            cfg.body.use_serial_port = parseInt($("#use_serial_port").select_val());
            cfg.body.screen_isopen = parseInt($("#start_mode2").select_val());

            var jsonstr = JSON.stringify(cfg);

            $.ajax({
                type: 'POST',
                url: "bbjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state_code == 200) {
                        show_informer();
                        get_led_ctrl_cfg(old_type);
                    }
                }
            });
        }

        function set_serial_out() {
            var cfg = {};
            cfg.type = "set_rs485_push";
            cfg.body = {};
            if (!set_comm_push_config(cfg.body)) return;
            set_led_ctrl_cfg();
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: 'POST',
                url: "bbjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state_code == 200) {
                        show_informer();
                    }
                }
            });
        }

        function update_demotext() {
            if ($("#comm_encryption_fmt").val() == "0") {
                $("#tr_license td:eq(2)").html("7 " + $.i18n.prop("byte"));
                $("#comm_license").attr("dmvalue", "00413132333435");
            } else if ($("#comm_encryption_fmt").val() == "1") {
                $("#tr_license td:eq(2)").html("16 " + $.i18n.prop("byte"));
                $("#comm_license").attr("dmvalue", "0908070605040302010A0B0C0D0E0F10");
            }
            if ($("#comm_license").is(":checked")) {
                update_demotext_and_selections();
            }
        }

        function update_prefix_and_suffix() {
            var type = $("#comm_voice_fmt").val();
            if (type == "iw") {
                $("#hide_remain_tr").show();
                $("#comm_remain_fmt").select_val(voice_json[type]["remain"]);
            } else {
                $("#hide_remain_tr").hide();
            }
            if (voice_json) {
                $("#comm_prefix_fmt").val(Base64.decode(voice_json[type]["prefix"], true));
                $("#comm_suffix_fmt").val(Base64.decode(voice_json[type]["suffix"], true));
                $("#comm_inc").check_val(voice_json[type]["inc_license"]);
            }
        }

        function set_curtype_voice() {
            if (this.value.length > 36) {
                show_informer_text($.i18n.prop("voive_length_hint") + " 36");
            } else {
                var type = $("#comm_voice_fmt").val();
                voice_json[type][$(this).attr("name")] = Base64.encode(this.value, true);
            }
        }

        function update_remain() {
            voice_json["iw"]["remain"] = parseInt($("#comm_remain_fmt").val());
        }

        function update_inc_license() {
            var type = $("#comm_voice_fmt").val();
            voice_json[type]["inc_license"] = $("#comm_inc").is(":checked") ? true : false;
        }

        function init_default_voice() {
            var isAllEmpty = true;
            var strArr = ["in", "out", "na", "iw"];
            for (var i = 0; i < strArr.length; i++) {
                var obj = strArr[i];
                if (voice_json[obj]["prefix"] != "" || voice_json[obj]["suffix"] != "") {
                    $("#comm_voice_fmt").select_val(obj);
                    $("#comm_prefix_fmt").val(Base64.decode(voice_json[obj]["prefix"], true));
                    $("#comm_suffix_fmt").val(Base64.decode(voice_json[obj]["suffix"], true));
                    $("#comm_remain_fmt").select_val(voice_json["iw"]["remain"]);
                    usable_voice();
                    $("#comm_inc").check_val(voice_json[obj]["inc_license"]);
                    isAllEmpty = false;
                    break;
                }
            }
            if (isAllEmpty) {
                $("#comm_voice_fmt").select_val("in");
                $("#comm_prefix_fmt").val(Base64.decode(voice_json["in"]["prefix"], true));
                $("#comm_suffix_fmt").val(Base64.decode(voice_json["in"]["suffix"], true));
                $("#comm_remain_fmt").select_val(voice_json["iw"]["remain"]);
                usable_voice();
                $("#comm_inc").check_val(voice_json["in"]["inc_license"]);
            }
        }

        function usable_voice() {
            $("#comm_voice_fmt").selectmenu("enable");
            $("#comm_prefix_fmt").removeAttr("disabled");
            $("#comm_suffix_fmt").removeAttr("disabled");
            $("#comm_inc").removeAttr("disabled");
            $("#hide_remain_tr").hide();
        }

        function disable_voice() {
            $("#comm_voice_fmt").selectmenu("disable");
            $("#comm_prefix_fmt").attr("disabled", "disabled");
            $("#comm_suffix_fmt").attr("disabled", "disabled");
            $("#comm_inc").attr("disabled", "disabled");
            $("#comm_inc").check_val(false);
            $("#hide_remain_tr").hide();
        }

        function update_state() {
            if ($("#comm_voice").is(":checked")) {
                init_default_voice();
            } else {
                disable_voice();
            }
            update_demotext_and_selections();
        }

        function getTextWidth(str) {
            var re = /[\u4E00-\u9FA5]/g;
            var length = 0;
            if (str.match(re)) {
                length = str.match(re).length;
            }
            var w = (length * 30) + (str.length - length) * 20;
            return w;
        }

        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            if (hour >= 1 && hour <= 9) {
                hour = "0" + hour;
            }
            if (min >= 0 && min <= 9) {
                min = "0" + min;
            }
            if (sec >= 0 && sec <= 9) {
                sec = "0" + sec;
            }
            var currentdate = hour + seperator2 + min + seperator2 + sec;
            return currentdate;
        }

        function show_led_txt() {
            var led_status = parseInt($("#led_status").select_val());
            var first_str = "";
            var last_str = "";
            if (led_status == 0) {
                if ($("#bf_content1_enable").check_val()) {
                    first_str = $("#bf_content1").val();
                }
                var time = getNowFormatDate();
                var parking = $.i18n.prop("led_parking") + " 10";
                if ($("#bf_time2_enable").check_val()) {
                    last_str += time;
                }
                if ($("#bf_parking2_enable").check_val()) {
                    last_str += parking;
                }
            } else {
                if ($("#bb_content1_enable").check_val()) {
                    first_str = $("#bb_content1").val();
                }
                var plate = "CACF678";
                var time = $.i18n.prop("led_time");
                var money = $.i18n.prop("led_money");
                if ($("#bb_plate2_enable").check_val()) {
                    last_str += plate;
                }
                if ($("#bb_time2_enable").check_val()) {
                    last_str += time;
                }
                if ($("#bb_money2_enable").check_val()) {
                    last_str += money;
                }
            }
            $("#first_txt").html(first_str);
            $("#last_txt").html(last_str);
            $(".roll_txt").css("margin-left", "0px");
        }

        function show_led_txt_c(deal) {
            var select_deal = parseInt($("#deal_mode").select_val());
            var led_status = parseInt($("#led_status_c").select_val());
            var txt1 = "";
            var txt2 = "";
            var txt3 = "";
            var txt4 = "";
            var color1 = 1;
            var color2 = 1;
            var color3 = 1;
            var color4 = 1;
            var color_arr = ["red", "red", "green", "yellow"];
            if (led_status == 0) {
                var time = getNowFormatDate();
                for (var i = 1; i < 5; i++) {
                    if ($("#cf_time" + i + "_enable").check_val()) {
                        var f_time = "txt" + i + "+=time;"
                        eval(f_time);
                    }
                    if ($("#cf_content" + i + "_enable").check_val()) {
                        var content = $("#cf_content" + i).val();
                        var f_content = "txt" + i + "+=content;";
                        eval(f_content);
                    }
                    if (select_deal == 4 || select_deal == 8) {
                        var color = parseInt($("#cf_color" + i).val());
                        var f_color = "color" + i + "=color_arr[color];";
                        eval(f_color);
                    }
                }
            } else {
                var plate = "CACF678";
                var type = $.i18n.prop("blue_car");
                var time = $.i18n.prop("led_time");
                var money = $.i18n.prop("led_money");
                var t = getNowFormatDate();
                for (var i = 1; i < 5; i++) {
                    if (select_deal == 8) {
                        if ($("#cb_t" + i + "_enable").check_val()) {
                            var b_t = "txt" + i + "+=t;";
                            eval(b_t);
                        }
                    }
                    if ($("#cb_plate" + i + "_enable").check_val()) {
                        var b_plate = "txt" + i + "+=plate;"
                        eval(b_plate);
                    }
                    if ($("#cb_type" + i + "_enable").check_val()) {
                        var b_content = "txt" + i + "+=type;";
                        eval(b_content);
                    }
                    if ($("#cb_time" + i + "_enable").check_val()) {
                        var b_time = "txt" + i + "+=time;";
                        eval(b_time);
                    }
                    if ($("#cb_money" + i + "_enable").check_val()) {
                        var b_money = "txt" + i + "+=money;";
                        eval(b_money);
                    }
                    if ($("#cb_content" + i + "_enable").check_val()) {
                        var content = $("#cb_content" + i).val();
                        var b_content = "txt" + i + "+=content;";
                        eval(b_content);
                    }
                    if (select_deal == 4 || select_deal == 8) {
                        var color = parseInt($("#cb_color" + i).val());
                        var b_color = "color" + i + "=color_arr[color];";
                        eval(b_color);
                    }
                }
            }
            $("#txt_1").html(txt1);
            $("#txt_2").html(txt2);
            $("#txt_3").html(txt3);
            $("#txt_4").html(txt4);
            if (select_deal == 4 || select_deal == 8) {
                $("#txt_1").css('color', color1);
                $("#txt_2").css('color', color2);
                $("#txt_3").css('color', color3);
                $("#txt_4").css('color', color4);
            }
            if (select_deal == 7 || select_deal == 8 || select_deal == 9) {
                var line_num = parseInt($("#line_num").select_val());
                for (var i = 1; i < 5; i++) {
                    if (i <= line_num) {
                        $("#txt_" + i).show();
                    } else {
                        $("#txt_" + i).hide();
                    }
                }
            } else {
                for (var i = 1; i < 5; i++) {
                    $("#txt_" + i).show();
                }
            }
            $(".roll_txt").css("margin-left", "0px");
        }

        function select_change(flag, deal) {
            var str = "led_status";
            if (deal == 3 || deal == 10) {
                str = "led_status_c";
            }
            var led_status = parseInt($("#" + str).select_val());
            if (led_status != flag) {
                return;
            }
            if (deal == 1) {
                show_led_txt();
            } else if (deal == 3 || deal == 4 || deal == 8 || deal == 9 || deal == 10) {
                show_led_txt_c(deal);
            }
        }
        var sj_input_cfg = '{"body":{"busy_cfg":[{"show_color":2,"show_content":"54a15Z+656eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y+4","show_mode":1},{"show_color":2,"show_content":"","show_mode":8},{"show_color":1,"show_content":"","show_mode":16},{"show_color":1,"show_content":"5qyi6L+O5YWJ5Li0","show_mode":1}],"free_cfg":[{"show_color":2,"show_content":"54a15Z+656eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y+4","show_mode":1},{"show_color":2,"show_content":"","show_mode":2},{"show_color":1,"show_content":"5LiA6L2m5LiA5p2G","show_mode":1},{"show_color":1,"show_content":"5YeP6YCf5oWi6KGM","show_mode":1}],"led_status":1,"line_num":4,"screen_ctrl_pro_type":8,"screen_isopen":2,"use_serial_port":0,"voice_cfg":{"temporary_voice_tag":7,"temporary_voice_welcome":7,"voice_content":"","voice_mode":7,"voice_tag":4,"voice_volume":7,"voice_welcom":2}},"err_msg":"OK","state_code":200,"type":"get_led_ctrl_cfg"}'
        var sj_output_cfg = '{"body":{"busy_cfg":[{"show_color":2,"show_content":"54a15Z+656eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y+4","show_mode":1},{"show_color":2,"show_content":"","show_mode":8},{"show_color":1,"show_content":"","show_mode":16},{"show_color":1,"show_content":"56Wd5oKo5LiA6Lev6aG66aOO","show_mode":1}],"free_cfg":[{"show_color":2,"show_content":"54a15Z+656eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y+4","show_mode":1},{"show_color":2,"show_content":"","show_mode":2},{"show_color":1,"show_content":"5LiA6L2m5LiA5p2G","show_mode":1},{"show_color":1,"show_content":"5YeP6YCf5oWi6KGM","show_mode":1}],"led_status":1,"line_num":4,"screen_ctrl_pro_type":8,"screen_isopen":2,"use_serial_port":0,"voice_cfg":{"temporary_voice_tag":7,"temporary_voice_welcome":2,"voice_content":"","voice_mode":62,"voice_tag":4,"voice_volume":7,"voice_welcom":2}},"err_msg":"OK","state_code":200,"type":"get_led_ctrl_cfg"}'
        function show_deal(val, flag) {
            $("#preview_c .roll_txt").css({
                "background": "#000",
                "color": "red"
            });
            $(".sj").hide()
            var direction_str = '<option value="0">' + $.i18n.prop('across') + '</option><option value="2">' + $.i18n.prop('vertical') + '</option>'
            if (val == 10) {
                direction_str = '<option value="0">' + $.i18n.prop('across') + '</option>'
            }
            $("#direction").html(direction_str);
            $("#direction").selectmenu("refresh");
            if (val == 0) {
                $(".deal_a").show();
                $("#deal_b").hide();
                $("#deal_c").hide();
                $("#deal_d").hide();
                $(".alleyway_td").hide();
                $(".led_mac_cfg_td").hide();
                $(".led_line_num_td").hide();
                $(".direction_td").hide();
                $(".ip_td").hide();
                $(".start_mode").hide();
            } else if (val == 1 || val == 2) {
                $(".deal_a").hide();
                $("#deal_b").show();
                $("#deal_c").hide();
                $("#deal_d").hide();
                $(".led_mac_cfg_td").hide();
                $(".led_line_num_td").hide();
                $(".direction_td").hide();
                $(".ip_td").hide();
                $(".alleyway_td").show();
                $(".start_mode").show();
                $(".start_mode2").hide();
                $(".start_mode1").show();

                if (flag) {
                    clear_option();
                    if (val == old_deal) {
                        parse_data(old_data, old_type, 1);
                    }
                }
            } else if (val == 3 || val == 4 || val == 6 || val == 7 || val == 8 || val == 9 || val == 10) {
                $(".deal_a").hide();
                $("#deal_b").hide();
                $("#deal_c").show();
                $("#deal_d").hide();
                $(".alleyway_td").show();
                $(".start_mode").show();
                $(".start_mode2").hide();

                $(".start_mode1").show();
                if (val == 3 || val == 10) {
                    $("#voice_vol").hide();
                    $(".led_mac_cfg_td").hide();
                    $(".led_line_num_td").hide();
                    $(".direction_td").show();
                    $(".ip_td").hide();
                    $(".deal4").hide();
                } else if (val == 6 || val == 7 || val == 8 || val == 9) {
                    $("#voice_vol").show();
                    $(".led_mac_cfg_td").hide();
                    $(".led_line_num_td").hide();
                    $(".ip_td").hide();
                    $(".direction_td").hide();
                    $(".deal4").hide();
                    if (val == 7 || val == 8 || val == 9) {
                        $(".led_line_num_td").show();
                        if (val == 7) {
                            $(".ip_td").show();
                            $(".voice_sync_num_td").show();
                            $("#line_num option[value='3']").removeAttr("disabled");
                            $("#line_num option[value='4']").removeAttr("disabled");
                        } else if (val == 8) {
                            $(".voice_sync_num_td").show();
                            $("#line_num option[value='3']").attr("disabled", "disabled");
                            $("#line_num option[value='4']").removeAttr("disabled");
                            $(".deal4").show();
                            $(".deal4 select option[value='3']").attr("disabled", "disabled");
                            $(".deal4 select").selectmenu("refresh");
                            $(".sj").show()
                        } else if (val == 9) {
                            $(".voice_sync_num_td").hide();
                            $("#line_num option[value='3']").attr("disabled", "disabled");
                            $("#line_num option[value='4']").attr("disabled", "disabled");
                        }
                    }
                    if (val == 6) {
                        $(".direction_td").show();
                    }
                } else {
                    $("#voice_vol").show();
                    $(".led_mac_cfg_td").show();
                    $(".led_line_num_td").hide();
                    $(".direction_td").hide();
                    $(".ip_td").hide();
                    $(".deal4").show();
                    $(".deal4 select option[value='3']").removeAttr("disabled");
                    $(".deal4 select").selectmenu("refresh");
                }
                if (flag) {
                    clear_option_c(val);
                    if (val == old_deal) {
                        parse_data_c(old_data, old_type, 1);
                    }
                }
                if (val == 8 && val != old_deal) {
                    clear_option_c(val);
                    if (old_type == "input") {
                        parse_data_c(sj_input_cfg, old_type, 1);
                    } else {
                        parse_data_c(sj_output_cfg, old_type, 1);
                    }
                }
            } else if (val == 5) {
                $(".deal_a").hide();
                $("#deal_b").hide();
                $("#deal_c").hide();
                $("#deal_d").show();
                $(".alleyway_td").show();
                $(".ip_td").hide();
                $(".start_mode").show();
                $(".start_mode2").show();
                $(".start_mode1").hide();
                $(".led_mac_cfg_td").hide();
                $(".direction_td").hide();
                if (flag) {
                    $("#use_serial_port").select_val(0)
                    if (val == old_deal) {
                        parse_data_d(old_data, 1);
                    }
                }
            }
        }

        function init_channel() {
            var option_html = "";
            for (var i = 0; i < channel_num; i++) {
                var channel_name = i + 1;
                option_html += "<option value=\"" + i + "\">" + channel_name + "</option>";
            }
            $("#use_serial_port").html(option_html);
            $("#use_serial_port").selectmenu("refresh");
        }
        var old_type = "";

        function show_device_type() {
            var sp = cur_device_type;
            old_type = sp;
            var type = $.i18n.prop("entrance");
            if (sp == "output") {
                type = $.i18n.prop("exit");
                $(".out").show();
                $("#dsp_input").remove();
            } else {
                $(".out").hide();
                $("#dsp_output").remove();
            }
            $(".screen_passageway").html(type);
            init_channel();
            get_led_ctrl_cfg(sp);
            get_total_parking();
        }
        function show_tr(line_num) {
            for (var i = 1; i < 5; i++) {
                if (i <= line_num) {
                    $("#deal_c .tr_" + i).show()
                } else {
                    $("#deal_c .tr_" + i).hide()
                }
            }
        }
        var g_total_parking;

        function get_total_parking() {
            var req = {};
            req.type = "get_total_parking";

            var jsonstr = JSON.stringify(req);

            $.ajax({
                type: 'POST',
                url: "dgjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json_data = eval("(" + ajaxdata + ")");
                    if (json_data.state == 200) {
                        g_total_parking = json_data.total_parking;
                        $("#total_parking").val(g_total_parking);
                    }
                }
            });
        }
        function check_total_parking_param() {
            var total_parking = $("#total_parking").val();
            if (isNaN(total_parking) || total_parking < 0 || total_parking > 10000000) {
                show_informer_text($.i18n.prop("parking_total_hint") + " 0~10000000");
                return false;
            }
            var deal_mode = parseInt($("#deal_mode").select_val())
            if (deal_mode == 7) {
                var muticast_ip = $("#muticast_ip").val();
                if (muticast_ip != '') {
                    if (!test_ip(muticast_ip)) {
                        show_informer_text($.i18n.prop("ip_address_error"));
                        return false
                    }
                }
            }
            return true;
        }
        function set_total_parking() {
            var total_parking = $("#total_parking").val();
            if (g_total_parking == total_parking) {
                return false;
            }
            var req = {};
            req.type = "set_total_parking";
            req.total_parking = parseInt(total_parking);
            var jsonstr = JSON.stringify(req);

            $.ajax({
                type: 'POST',
                url: "dgjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        show_informer();
                        get_total_parking();
                    }
                }
            });
        }
        function voice_sync_screen_change(val) {
            if (val == 1) {
                $(".busy_tr").hide()
            } else {
                $(".busy_tr").show()
            }
        }
        var txt_scroll_timer = null;
        this.init = function () {
            $("#comm_moveup").click(cfg_table_moveup);
            $("#comm_movedown").click(cfg_table_movedown);
            $("#comm_simple_cfg").click(set_comm_simple_cfg);
            $("#comm_normal_cfg").click(set_comm_normal_cfg);
            $("#comm_all_cfg").click(set_comm_all_cfg);
            $("#comm_set_submit").click(set_serial_out);
            $("#comm_header_fmt").val("BB88");
            $("#comm_end_fmt").val("33");
            $("#comm_time_fmt").on("selectmenuchange", function (event, ui) {
                update_demotext_and_selections();
            });
            $("#comm_duetime_fmt").on("selectmenuchange", function (event, ui) {
                update_demotext_and_selections();
            });
            $("#comm_checksum_fmt").on("selectmenuchange", function (event, ui) {
                update_demotext_and_selections();
            });
            $("#comm_cfg_tbl td").click(function () {
                select_comm_cfg_table_item($(this).parent().index() - 1, true);
            });
            $(":checkbox[usedfor='comm_cfg']").click(update_demotext_and_selections);
            $("#comm_encryption_fmt").on("selectmenuchange", function (event, ui) {
                update_demotext();
            });
            $("#comm_voice_fmt").on("selectmenuchange", function (event, ui) {
                update_prefix_and_suffix();
            });
            $("#comm_remain_fmt").on("selectmenuchange", function (event, ui) {
                update_remain();
            });
            init_selectmenu("#deal_mode,#use_serial_port,#start_mode1,#start_mode2,#dsp_input,#dsp_output,#direction,#greeting,#dsp_tag,#monthly_greet,#monthly_tag", 193, 150);
            init_selectmenu("#comm_remain_fmt", 130, 150);
            init_selectmenu("#deal_c .content_tb select", 80, 100, function () {
                var type = 0;
                if ($(this).hasClass('busy_color')) {
                    type = 1;
                }
                select_change(type, 4);
            });
            $("#comm_voice_fmt").selectmenu("disable");
            $("#comm_prefix_fmt").change(set_curtype_voice);
            $("#comm_suffix_fmt").change(set_curtype_voice);
            $("#comm_inc").click(update_inc_license);
            $("#comm_voice").click(update_state);

            $("#comm_header_fmt").change(function () {
                update_demotext_and_selections();
            });
            $("#comm_end_fmt").change(function () {
                update_demotext_and_selections();
            });
            $("#deal_mode").on("selectmenuchange", function (event, ui) {
                $("#deal_c .tr").show();
                $("#voice_sync_screen").check_val(false)
                voice_sync_screen_change(0)
                var val = $(this).val();
                show_deal(val, 1);
            });

            //选择值不同时显示change_hide
            $("#dsp_input").on("selectmenuchange", function (event, ui) {
                var val = parseInt($(this).select_val());
                change_hide(val);
            });
            $("#dsp_output").on("selectmenuchange", function (event, ui) {
                var val = parseInt($(this).select_val());
                change_hide(val);
            });


            $("#led_status").on("selectmenuchange", function () {
                show_led_txt();
            })
            $("#led_status_c").on("selectmenuchange", function () {
                var deal = parseInt($("#deal_mode").select_val());
                show_led_txt_c(deal);
            })
            $("#preview").css({
                "background": "#000",
                "color": "red"
            });
            $("#preview_c").css({
                "background": "#000",
                "color": "red"
            });
            $("#deal_btn").click(function () {
                if (check_led_ctrl_cfg_param() && check_total_parking_param()) {
                    set_led_ctrl_cfg();
                    set_total_parking();
                }
            });
            $("#deal_btn_c").click(function () {
                if (check_led_ctrl_cfg_c_param() && check_total_parking_param()) {
                    set_led_ctrl_cfg_c();
                    set_total_parking();
                }
            });
            $("#deal_btn_d").click(function () {
                if (check_total_parking_param) {
                    set_led_ctrl_cfg_d();
                    set_total_parking();
                }
            });
            txt_scroll_timer = setInterval(function () {
                $(".roll_txt").each(function () {
                    var width = getTextWidth($(this).html());
                    if (width <= (140 - 10)) {
                        return;
                    }
                    var left = parseInt($(this).css("margin-left").split("px")[0]);
                    left -= 2;
                    if ((left + width) < 0) {
                        left = 140;
                    }
                    $(this).css("margin-left", left);
                });
            }, 100);
            $(".free").change(function () {
                select_change(0, 1);
            });
            $(".busy").change(function () {
                select_change(1, 1);
            });
            $("#bf_content").change(function () {
                select_change(0, 1);
            });
            $("#bb_content").change(function () {
                select_change(1, 1);
            });
            $(".free_c").change(function () {
                select_change(0, 3);
            });
            $(".busy_c").change(function () {
                select_change(1, 3);
            });
            $(".free_txt_c").change(function () {
                select_change(0, 3);
            });
            $(".busy_txt_c").change(function () {
                select_change(1, 3);
            });
            $("#goto_serial").click(function () {
                onLinkClick("htmldata/SetPlateDeviceIO.htm?linkage", function () {
                    $("#serial_li a").click();
                    $("#set_io").siblings().find("a").removeClass("active");
                    $("#set_io a").addClass("active");
                });
            });
            init_slider("voice");
            init_selectmenu("#line_num", 193, 150, function (e, o) {
                var line_num = parseInt(o.value);
                show_tr(line_num);
                var type = parseInt($("#led_status_c").select_val())
                select_change(type, 3);
            })
            $("#deal_c input.text").change(function () {
                var f_content = $(this).val();
                var f_length = 0;
                if (f_content.match(re)) {
                    f_length = f_content.match(re).length;
                }
                var f_n_length = 0;
                if (f_content.match(re_num)) {
                    f_n_length = f_content.match(re_num).length;
                }
                var text_length = f_content.length;
                var all_length = f_length * 3 + f_n_length + (text_length - f_length - f_n_length) * 3;
                if (all_length > 31) {
                    show_informer_text($.i18n.prop("content_exceed_limit"));
                }
            })
            $("#voice_sync_screen").change(function () {
                var val = $(this).check_val() ? 1 : 0
                voice_sync_screen_change(val)
            })
            get_serial_out();
            show_device_type();
        }
        this.close = function () {
            clearInterval(txt_scroll_timer);
            txt_scroll_timer = null;
        }
    }
    this.gpio = new function () {
        function parse_config_info(json) {
            var cfg;
            try {
                cfg = jQuery.parseJSON(json);
            } catch (e) {
                //show_informer_text(e.message);
                return null;
            }
            //set trigger delay
            if (cfg.state_code == 200) {
                $("#def_out_time").val(cfg.body.def_out_time);
            }
        }

        function get_def_out_time() {
            var cfg = {};
            cfg.type = "get_def_out_time";
            var jsonstr = JSON.stringify(cfg);
            $.get("vb.htm?boa_busjsonreq=" + jsonstr,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    parse_config_info(ajaxdata.split("=")[1]);
                });
        }

        function set_def_out_time() {
            var cfg = {};
            var time = parseInt($("#def_out_time").val());
            cfg.type = "set_def_out_time";
            cfg.body = {};
            cfg.body.def_out_time = time;
            var jsonstr = JSON.stringify(cfg);

            $.get("vb.htm?boa_busjsonreq=" + jsonstr, function (ajaxdata) {
                if (ajaxdata.substr(0, 2) == "OK") {
                    show_informer();
                }
                get_def_out_time();
            });
        }

        this.get_addition_gpio = function () {
            var cfg = {};
            cfg.type = "get_addition_gpio";
            var jsonstr = JSON.stringify(cfg);

            $.get("vb.htm?boa_eventjsonreq=" + jsonstr,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    ajaxdata = ajaxdata.split("=")[1];
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        json = json.body;
                        $("#addition_enable").check_val(json.enable == 1);
                        ele_change(json.enable, "disabled_ele");
                        disabled_talk_io(talk_io);
                        $("#frequency_time").val(json.frequency_time);
                        $("#delay_time").val(json.delay_stop_time);
                        var io_in = json.input_gpio;
                        var io_out = json.output_gpio;
                        if (json.enable == 1) {
                            g_gp_io = io_out;
                        } else {
                            g_gp_io = -1;
                        }

                        $("#gpio_in" + (io_in + 1)).check_val(true);
                        $("#gpio_out" + (io_out + 1)).check_val(true);
                        if (json.enable == 1) {
                            for (var i = 0; i < 6; i++) {
                                if (i == io_out) {
                                    $("#flicker_out" + (i + 1)).check_disabled(true);
                                }
                            }
                        }
                    }
                });
        }

        function set_addition_gpio() {
            var enable = $("#addition_enable").check_val() ? 1 : 0;
            var time = parseInt($("#frequency_time").val());
            var dtime = parseInt($("#delay_time").val());
            var io_in, io_out;
            if ($("#gpio_in1").check_val()) {
                io_in = 0;
            } else if ($("#gpio_in2").check_val()) {
                io_in = 1;
            } else if ($("#gpio_in3").check_val()) {
                io_in = 2;
            } else if ($("#gpio_in4").check_val()) {
                io_in = 3;
            }
            if ($("#gpio_out1").check_val()) {
                io_out = 0;
            } else if ($("#gpio_out2").check_val()) {
                io_out = 1;
            } else if ($("#gpio_out3").check_val()) {
                io_out = 2;
            } else if ($("#gpio_out4").check_val()) {
                io_out = 3;
            } else if ($("#gpio_out5").check_val()) {
                io_out = 4;
            } else if ($("#gpio_out6").check_val()) {
                io_out = 5;
            }
            var cfg = {};
            cfg.type = "set_addition_gpio";
            cfg.body = {};
            cfg.body.enable = enable;
            cfg.body.frequency_time = time;
            cfg.body.delay_stop_time = dtime;
            cfg.body.input_gpio = io_in;
            cfg.body.output_gpio = io_out;

            var jsonstr = JSON.stringify(cfg);

            $.get("vb.htm?boa_eventjsonreq=" + jsonstr, function (ajaxdata) {
                if (ajaxdata.substr(0, 2) == "OK") {
                    show_informer();
                }
                for (var i = 0; i < 6; i++) {
                    $("#flicker_out" + (i + 1)).check_enable(true);
                }
                trigger_output_tab.get_trigger_output();
                SetPlateDeviceIO.gpio.get_addition_gpio();
            });
        }
        this.get_wait_gpio = function () {
            var cfg = {};
            cfg.type = "get_wait_gpio";
            var jsonstr = JSON.stringify(cfg);

            $.get("vb.htm?boa_eventjsonreq=" + jsonstr,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    ajaxdata = ajaxdata.split("=")[1];
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        json = json.body;
                        $("#wait_GPIO_enable").check_val(json.enable == 1);
                        ele_change(json.enable, "wait_disabled_ele");
                        disabled_talk_io(talk_io);
                        $("#wait_timeout").val(json.timeout);
                        $("#delayed_opening_time").val(json.delay_time);
                        var io_in = json.input_gpio;
                        $("#wait_gpio_in" + (io_in + 1)).check_val(true);
                    }
                });
        }
        function set_wait_gpio() {
            var enable = $("#wait_GPIO_enable").check_val() ? 1 : 0;
            var time = parseInt($("#wait_timeout").val());
            var dtime = parseInt($("#delayed_opening_time").val());
            var io_in;
            if ($("#wait_gpio_in1").check_val()) {
                io_in = 0;
            } else if ($("#wait_gpio_in2").check_val()) {
                io_in = 1;
            } else if ($("#wait_gpio_in3").check_val()) {
                io_in = 2;
            } else if ($("#wait_gpio_in4").check_val()) {
                io_in = 3;
            }
            var cfg = {};
            cfg.type = "set_wait_gpio";
            cfg.body = {};
            cfg.body.enable = enable;
            cfg.body.input_gpio = io_in;
            cfg.body.delay_time = dtime;
            cfg.body.timeout = time;

            var jsonstr = JSON.stringify(cfg);

            $.get("vb.htm?boa_eventjsonreq=" + jsonstr, function (ajaxdata) {
                if (ajaxdata.substr(0, 2) == "OK") {
                    show_informer();
                }
                SetPlateDeviceIO.gpio.get_addition_gpio();
            });
        }
        this.init = function () {
            $("#submit_ioconfig_tabs2").click(function () {
                var time = parseInt($("#frequency_time").val());
                var dtime = parseInt($("#delay_time").val());
                var otime = parseInt($("#def_out_time").val());
                var wait_time = parseInt($("#wait_timeout").val());
                var wait_dtime = parseInt($("#delayed_opening_time").val());
                if (isNaN(otime) || otime < 500 || otime > 5000 || isNaN(time) || time < 0 || time > 5000 || isNaN(dtime) || dtime < 0 || dtime > 12000) {
                    show_informer_text($.i18n.prop("parameter_error"));
                    return false;
                }
                var io_out = 0;
                if ($("#gpio_out1").check_val()) {
                    io_out = 0;
                } else if ($("#gpio_out2").check_val()) {
                    io_out = 1;
                } else if ($("#gpio_out3").check_val()) {
                    io_out = 2;
                } else if ($("#gpio_out4").check_val()) {
                    io_out = 3;
                } else if ($("#gpio_out5").check_val()) {
                    io_out = 4;
                } else if ($("#gpio_out6").check_val()) {
                    io_out = 5;
                }
                if (g_lamp_io_out == io_out) {
                    show_informer_text($.i18n.prop("io_used"));
                    return false
                }
                if (g_d_type == 3 && g_m_version == 8) {
                    if (isNaN(wait_time) || wait_time < 0 || wait_time > 3600000 || isNaN(wait_dtime) || wait_dtime < 0 || wait_dtime > 10000) {
                        show_informer_text($.i18n.prop("parameter_error"));
                        return false;
                    }
                    set_wait_gpio();
                }
                set_def_out_time();
                set_addition_gpio();
            });
            $("#addition_enable").change(function () {
                var enable = $(this).check_val();
                ele_change(enable, "disabled_ele");
                disabled_talk_io(talk_io);
            });
            get_def_out_time();
            SetPlateDeviceIO.gpio.get_addition_gpio();
            if (g_d_type == 3 && g_m_version == 8) {
                $("#wait_GPIO_enable").change(function () {
                    var enable = $(this).check_val();
                    ele_change(enable, "wait_disabled_ele");
                    disabled_talk_io(talk_io);
                });
                SetPlateDeviceIO.gpio.get_wait_gpio();
            }
        }
    }

    var special_plates = new function () {
        function get_special_plates() {
            var cfg = {};
            cfg.type = "get_special_plates";
            var jsonstr = JSON.stringify(cfg);
            $.get("vb.htm?getwebspesialplates=" + jsonstr,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    ajaxdata = ajaxdata.substring(ajaxdata.indexOf("=") + 1);
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state_code == 200) {
                        jsondata = jsondata.body;
                        var arr = jsondata.plates;
                        var str = "<tr>";
                        for (var i = 1; i <= arr.length; i++) {
                            if (i == 21) {
                                //大型新能源不显示
                                continue;
                            }
                            str += "<td style='min-width:180px;'><input type='checkbox' ";
                            if (arr[i - 1].status == 1) {
                                str += " checked='checked' "
                            }
                            str += " class='plate' index='" + arr[i - 1].index + "' id='plate" + arr[i - 1].index + "'/><label style='font-weight:normal;' for='plate" + arr[i - 1].index + "'>" + $.i18n.prop(car_type_arr[arr[i - 1].index]); + "</label></td>";
                            if (i % 4 == 0 && arr.length != i) {
                                str += "</tr><tr>"
                            }
                        }
                        str += "</tr>";
                        $("#license_tb tr:gt(0)").remove();
                        $("#license_tb").append(str);
                        init_checkbox('input[type=checkbox]');
                    }
                });
        }

        function set_special_plates() {
            var cfg = {}
            cfg.type = "set_special_plates";
            cfg.body = {};
            var arr = [];
            $(".plate").each(function () {
                var json = {};
                json.index = parseInt($(this).attr("index"));
                json.status = $(this).check_val() ? 1 : 0;
                arr.push(json);
            })
            cfg.body.plates = arr;

            var jsonstr = JSON.stringify(cfg);
            $.get("vb.htm?getwebspesialplates=" + jsonstr, function (ajaxdata) {
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf("=") + 1);
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    show_informer();
                }
                get_special_plates();
            });
        }

        this.init = function () {
            $("#submit_ioconfig_tabs8").click(set_special_plates);
            get_special_plates();
        }
    }

    this.led_complensating = new function () {
        this.get_led_complensating = function () {
            var cfg = {};
            cfg.type = "get_led_complensating";
            var jsonstr = JSON.stringify(cfg);
            $.get("vb.htm?ledcomplensating=" + jsonstr,
                function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    ajaxdata = ajaxdata.substring(ajaxdata.indexOf("=") + 1);
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        $("#comp_enable").check_val(jsondata.comp_enable == 1);
                        ele_change(jsondata.comp_enable, "disabled_led");
                        disabled_talk_io(talk_io);
                        $("#ivt_time_txt").val(jsondata.ivt_time);
                        $("#dealy_time").val(jsondata.dealy_time);
                        $("#dealy_out_time").val(jsondata.dealy_out_time);
                        var io_in = jsondata.gpio_in;
                        for (var i = 0; i < io_in.length; i++) {
                            $("[vzfilter='in'][vzio=" + io_in[i] + "]").check_val(true);
                        }
                        var io_out = jsondata.gpio_out;
                        for (var j = 0; j < io_out.length; j++) {
                            $("[vzfilter='out'][vzio=" + io_out[j] + "]").check_val(true);
                        }
                    }
                });
        }

        function set_led_complensating() {
            var cfg = {}
            cfg.type = "set_led_complensating";
            var comp_enable = $("#comp_enable").check_val() ? 1 : 0;
            var ivt_time = parseInt($("#ivt_time_txt").val());
            var dealy_time = parseInt($("#dealy_time").val());
            var dealy_out_time = parseInt($("#dealy_out_time").val());

            if (isNaN(ivt_time) || ivt_time < 0 || ivt_time > 65535) {
                show_informer_text($.i18n.prop("trigger_delay_time_hint") + " 0~65535");
                return;
            }
            if (isNaN(dealy_time) || dealy_time < 0 || dealy_time > 5000) {
                show_informer_text($.i18n.prop("detonation_time_duration_hint") + "0~5000");
                return;
            }
            if (isNaN(dealy_out_time) || dealy_out_time < 0 || dealy_out_time > 65535) {
                show_informer_text($.i18n.prop("detonation_delay_time_hint") + "0-65535");
                return;
            }
            cfg.comp_enable = comp_enable;
            cfg.ivt_time = ivt_time;
            cfg.dealy_time = dealy_time;
            cfg.dealy_out_time = dealy_out_time;

            var arr = new Array();

            arr = [];
            $("[vzfilter='in']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.gpio_in = arr;

            arr = [];
            $("[vzfilter='out']").filter(function (index) {
                if ($(this).check_val()) {
                    arr.push(parseInt($(this).attr('vzio')));
                }
                return true;
            });
            cfg.gpio_out = arr;

            var jsonstr = JSON.stringify(cfg);
            $.get("vb.htm?ledcomplensating=" + jsonstr, function (ajaxdata) {
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf("=") + 1);
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    show_informer();
                }
                SetPlateDeviceIO.led_complensating.get_led_complensating();
            });
        }
        this.init = function () {
            $("#comp_enable").change(function () {
                var enable = $(this).check_val();
                ele_change(enable, "disabled_led");
                disabled_talk_io(talk_io);
            });
            SetPlateDeviceIO.led_complensating.get_led_complensating();
            $("#led_complensating_submit").click(set_led_complensating);
        }
    }
    var audio = new function () {
        var fast_interval = 0;
        var normal_interval = 500;
        var slow_interval = 900;
        var voice_str = ["请慢走", "收费5元", "停车8分钟", "ACF678", "月租车", "您好"];
        function show_device_type() {
            var t = "";
            if (cur_device_type == "unkown") {
                return;
            } else if (cur_device_type == "input") {
                t = $.i18n.prop("entrance");
                $("#audio_output").remove();
            } else if (cur_device_type == "output") {
                t = $.i18n.prop("exit");
                $("#audio_input").remove();
            }
            $("#device_type_audio").html(t);
            init_selectmenu(".audio_strategy", 300, 150, function () {
                var str = get_voice_str();
                $("#example").html(str);
            });
            $("#type_tr").css("visibility", "visible");
            get_voice_cfg();
        }

        function get_voice_cfg() {
            var req = {};
            req.type = "get_voice_cfg";

            $.ajax({
                type: "POST",
                url: "voicecfg.php",
                data: JSON.stringify(req),
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json_data;
                    try {
                        json_data = eval("(" + ajaxdata + ")");
                    } catch (e) {
                        return false;
                    }
                    var val = 0;
                    if (cur_device_type == "unkown") {
                        return false;
                    }
                    json_data = json_data.body;
                    val = json_data.voice_type;

                    $("#audio_" + cur_device_type).select_val(val);
                    $("#start_mode_in").select_val(json_data.start_mode);
                    var str = get_voice_str();
                    $("#example").html(str);
                    $("#greetings").select_val(Base64.decode(json_data.greetings, true));
                    $("#tag").select_val(Base64.decode(json_data.tag, true));
                    var voice_male = json_data.voice_male;
                    if (voice_male == 0) {
                        $("#male").check_val(true);
                    } else if (voice_male == 1) {
                        $("#famale").check_val(true);
                    }
                    var voice_interval = json_data.voice_interval;
                    if (voice_interval == slow_interval) {
                        $("#slow").check_val(true);
                    } else if (voice_interval == normal_interval) {
                        $("#normal").check_val(true);
                    } else if (voice_interval == fast_interval) {
                        $("#fast").check_val(true);
                    }
                    var arr = json_data.voice_time_inv_level;
                    var st = arr[1].start_time;
                    var et = arr[1].end_time;
                    var sts = st.split(":");
                    var ets = et.split(":");
                    var val1 = parseInt(sts[0]) * 60 + parseInt(sts[1]);
                    var val2 = parseInt(ets[0]) * 60 + parseInt(ets[1]);
                    $("#time_sec").val(val1 + ";" + val2);
                    $("#time_sec").jslider(
                        {
                            from: 0,
                            to: 1440,
                            step: 15,
                            dimension: '',
                            scale: ['00:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'],
                            limits: false,
                            calculate: function (value) {
                                var hours = Math.floor(value / 60);
                                var mins = (value - hours * 60);
                                return (hours < 10 ? "0" + hours : hours) + ":" + (mins == 0 ? "00" : mins);
                            },
                            onstatechange: function () {
                                init_select_width();
                            }
                        }
                    );
                    $(".jslider-bg").height(26);
                    $(".jslider-bg i").css({ "font-style": "normal", "font-size": "12px", "overflow": "hidden", "background": "none" }).height(26);
                    $(".jslider-bg").append("<span class='s_l_p sp'>" + $.i18n.prop('whisper_mode') + "</span>");
                    $(".jslider-bg").append("<span class='s_v_p sp'>" + $.i18n.prop('sonority_mode') + "</span>");
                    $(".jslider-bg").append("<span class='s_r_p sp'>" + $.i18n.prop('whisper_mode') + "</span>");
                    $(".jslider-bg .s_r_p").css({ "right": "0" });
                    init_select_width($("#time_sec").jslider("prc"));
                },
                dataType: "text"
            });
        }
        function init_select_width(prc) {
            var left = parseInt($(".jslider-bg>.v").css("left").split("px")[0]);
            var width = $(".jslider-bg>.v").width();
            var p_width = $(".jslider-bg").width();
            if (prc) {
                p_width = 490;
                left = p_width * parseInt(prc.split(";")[0]) / 100;
                width = p_width * parseInt(prc.split(";")[1]) / 100 - left;
                $(".jslider-value").css("margin-left", "-13.5px");
            }
            if (left <= 1) {
                $(".jslider-bg .s_l_p").hide();
            } else {
                $(".jslider-bg .s_l_p").show().width(left - 2);
            }
            if (left + width >= p_width - 1) {
                $(".jslider-bg .s_r_p").hide();
            } else {
                $(".jslider-bg .s_r_p").show().width(p_width - left - width - 2);
            }
            if (width == 0) {
                $(".jslider-bg .s_v_p").hide();
            } else {
                $(".jslider-bg .s_v_p").show().width(width - 2);
            }
        }
        function get_time(value) {
            var hours = Math.floor(value / 60);
            var mins = (value - hours * 60);
            return (hours < 10 ? "0" + hours : hours) + ":" + (mins == 0 ? "00" : mins) + ":00";
        }

        function set_voice_cfg() {
            if (cur_device_type == "unkown") {
                return false;
            }
            var strategy = parseInt($("#audio_" + cur_device_type).select_val());
            var greetings = Base64.encode($("#greetings").select_val(), true);
            var tag = Base64.encode($("#tag").select_val(), true);
            var voice_male = 0;
            if ($("#famale").check_val()) {
                voice_male = 1;
            }
            var voice_interval = slow_interval;
            if ($("#normal").check_val()) {
                voice_interval = normal_interval;
            } else if ($("#fast").check_val()) {
                voice_interval = fast_interval;
            }
            var val = $("#time_sec").val();
            var time = val.split(";");
            var time1 = get_time(time[0]);
            var time2 = get_time(time[1]);
            var arr = [];
            for (var i = 0; i < 3; i++) {
                var json = {};
                if (i == 0) {
                    json.start_time = "00:00:00";
                    json.end_time = time1;
                    json.voice_volume = 60;
                } else if (i == 1) {
                    json.start_time = time1;
                    json.end_time = time2;
                    json.voice_volume = 100;
                } else {
                    json.start_time = time2;
                    json.end_time = "24:00:00";
                    json.voice_volume = 60;
                }
                arr.push(json);
            }
            var req = {};
            req.type = "set_voice_cfg";
            req.body = {};
            req.body.voice_type = strategy;
            req.body.greetings = greetings;
            req.body.tag = tag;
            req.body.voice_male = voice_male;
            req.body.voice_interval = voice_interval;
            req.body.voice_time_inv_level = arr;
            req.body.start_mode = parseInt($("#start_mode_in").select_val());


            $.ajax({
                type: "POST",
                url: "voicecfg.php",
                data: JSON.stringify(req),
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state_code == 200) {
                        show_informer();
                    }
                },
                dataType: "text"
            });
        }
        function time_to_num(time) {
            var arr = time.split(":");
            var num = 0;
            num += parseInt(arr[0]) * 60 * 60;
            num += parseInt(arr[1]) * 60;
            num += parseInt(arr[2]);
            return num;
        }
        function preview_strategy(str) {
            var voice_male = 0;
            if ($("#famale").check_val()) {
                voice_male = 1;
            }
            if (str == "") {
                return;
            }
            var voice_interval = slow_interval;
            if ($("#normal").check_val()) {
                voice_interval = normal_interval;
            } else if ($("#fast").check_val()) {
                voice_interval = fast_interval;
            }
            $.get("vb.htm", { getdate: "", gettime: "" }, function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var response = ajaxdata.split("\n");
                var server_time = parse_ajax_data(response[1]);
                var volume = 60;
                var val = $("#time_sec").val();
                var time = val.split(";");
                var time1 = get_time(time[0]);
                var time2 = get_time(time[1]);
                if (time_to_num(time1) < time_to_num(server_time) && time_to_num(server_time) < time_to_num(time2)) {
                    volume = 100;
                }
                var cfg = {};
                cfg.type = "ps_voice_play";
                cfg.voice = Base64.encode(str, true);
                cfg.voice_interval = voice_interval;
                cfg.voice_volume = volume;
                cfg.voice_male = voice_male;

                $.ajax({
                    type: "POST",
                    url: "getvoiceinfo.php",
                    data: JSON.stringify(cfg),
                    success: function (ajaxdata) {
                        if (precheck(ajaxdata)) {
                            return false;
                        }
                    },
                    dataType: "text"
                });
            });
        }
        function get_voice_str() {
            $(".enable_td").hide();
            var val = $("#audio_" + cur_device_type).select_val();
            if (parseInt(val) == 0) {
                return;
            }
            $(".enable_td").show();
            var mask = 0x1;
            mask = mask << 6;

            val = mask | val;
            val = val.toString(2);
            val = val.substring(1);
            var arr = val.split("");
            var str = "";
            for (var i = arr.length - 1; i >= 0; i--) {
                if (parseInt(arr[i]) == 1) {
                    if (i == voice_str.length - 1) {
                        var greetings = $("#greetings").select_val();
                        str += greetings;
                    } else if (i == 0) {
                        var tag = $("#tag").select_val();
                        str += tag;
                    } else if (i == voice_str.length - 2) {
                        var plate_type = $("#plate_type").select_val();
                        str += $.i18n.prop(plate_type);
                    } else {
                        str += voice_str[i];
                    }
                }
                str += " ";
            }
            return str;
        }
        this.init = function () {
            init_selectmenu("#greetings,#tag,#plate_type", 150, 150, function () {
                var str = get_voice_str();
                $("#example").html(str);
            });
            init_selectmenu("#start_mode_in", 150, 150);
            $("#plate_type").on("selectmenuchange", function () {
                var val = $(this).val();
                $("#plate_type_txt").html($.i18n.prop(val));
            })
            $("#voice_rule_submit").click(set_voice_cfg);
            $("#strategy_audition").click(function () {
                var str = $("#example").html();
                preview_strategy(str);
            });
            show_device_type();
        }
    }
    var led = new function () {
        function light_change(val) {
            if (val == 3) {
                $(".manual_tr").show();
            } else {
                $(".manual_tr").hide();
            }
        }
        function get_led_ctrl_prop() {
            var json = {};
            json.type = "AVS_GET_LED_PROP";

            var jsonstr = JSON.stringify(json);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    jsondata = jsondata.body.led_level;
                    var levels = jsondata.types;
                    var option = "";
                    for (var i = 0; i < levels.length; i++) {
                        option += "<option value='" + levels[i].type + "'>" + Base64.decode(levels[i].content, true) + "</optioon>";
                    }
                    $(".led_level").append(option);
                    $(".led_level").selectmenu("refresh");
                    new_get_led_cfg();
                }
            });
        }

        function new_get_led_cfg() {
            var json = {};
            json.type = "AVS_GET_LED_CTRL";

            var jsonstr = JSON.stringify(json);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    if (precheck(ajaxdata)) {
                        return false;
                    }
                    var jsondata = eval("(" + ajaxdata + ")");
                    jsondata = jsondata.body;
                    var mode = jsondata.led_mode;
                    $("#led_sel").select_val(mode);
                    if (mode == 3) {
                        $(".manual_tr").show();
                    } else {
                        $(".manual_tr").hide();
                    }
                    if (jsondata.time_ctrl) {
                        var arr = jsondata.time_ctrl;
                        var level1 = arr[0].led_level;
                        var level2 = arr[1].led_level;
                        var level3 = arr[2].led_level;
                        // if (!arr[0].timectrl_enable) {
                        //     level1 = -1;
                        // }
                        // if (!arr[1].timectrl_enable) {
                        //     level2 = -1;
                        // }
                        // if (!arr[2].timectrl_enable) {
                        //     level3 = -1;
                        // }
                        $("#led_level1").select_val(level1);
                        $("#led_level2").select_val(level2);
                        $("#led_level3").select_val(level3);
                        var st = arr[1].time_begin;
                        var et = arr[1].time_end;
                        SetTimer("start_time1", "00:00");
                        SetTimer("end_time3", "00:00");
                        $(".time1").each(function () {
                            var id = $(this).attr("id");
                            SetTimer(id, st);
                        });
                        $(".time2").each(function () {
                            var id = $(this).attr("id");
                            SetTimer(id, et);
                        });
                    }
                }
            });
        }

        function new_set_led_cfg() {
            var cfg = {};
            cfg.type = "AVS_SET_LED_CTRL";
            cfg.body = {};
            var mode = parseInt($("#led_sel").select_val());
            if (mode == 3) {
                var time1 = returnTimer("start_time2");
                var time2 = returnTimer("end_time2");
                var sts = time1.split(":");
                var ets = time2.split(":");
                var val1 = parseInt(sts[0], 10) * 60 + parseInt(sts[1], 10);
                var val2 = parseInt(ets[0], 10) * 60 + parseInt(ets[1], 10);
                if (val2 < val1) {
                    show_informer_text($.i18n.prop("start_time_cannot_exceed_end_time"));
                    return;
                }
                var s_l = parseInt($("#led_level1").select_val());
                var s_v = parseInt($("#led_level2").select_val());
                var s_r = parseInt($("#led_level3").select_val());
                var arr = [];
                for (var i = 0; i < 3; i++) {
                    var json = {};
                    if (i == 0) {
                        json.time_begin = "00:00:00";
                        json.time_end = time1;
                        if (s_l != -1) {
                            json.timectrl_enable = true;
                        } else {
                            json.timectrl_enable = false;
                        }
                        json.led_level = s_l;
                    } else if (i == 1) {
                        json.time_begin = time1;
                        json.time_end = time2;
                        json.timectrl_enable = true;
                        if (s_v != -1) {
                            json.timectrl_enable = true;
                        } else {
                            json.timectrl_enable = false;
                        }
                        json.led_level = s_v;
                    } else {
                        json.time_begin = time2;
                        json.time_end = "24:00:00";
                        json.timectrl_enable = true;
                        if (s_r != -1) {
                            json.timectrl_enable = true;
                        } else {
                            json.timectrl_enable = false;
                        }
                        json.led_level = s_r;
                    }
                    json.id = i;
                    arr.push(json);
                }
                cfg.body.time_ctrl = arr;
            }
            cfg.body.led_mode = mode;
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "POST",
                url: "avsjson.php",
                data: jsonstr,
                dateType: "text",
                success: function (ajaxdata) {
                    var jsondata = eval("(" + ajaxdata + ")");
                    if (jsondata.state == 200) {
                        show_informer();
                    }
                }
            });
        }
        var vzio_arr = ['56', '40', '150', '171', '177', '173'];
        function get_flashlamp_info() {
            var cfg = {}
            cfg.type = "get_flashlamp_info"
            cfg.module = "EVS_BUS_REQUEST";
            post(cfg, function (res) {
                var body = res.body;
                var output_gpio = body.output_gpio;
                var input_gpio = body.input_gpio;
                g_lamp_io_out = output_gpio;
                g_lamp_io_in = input_gpio;
                var light_mode = body.light_mode;
                var delay_time = body.flash_info.delay_time;
                var light_time = body.flash_info.light_time;
                $("#flicker_out" + (output_gpio + 1)).check_val(true);
                var mask = 0x1;
                var bOutIo1 = input_gpio & (mask << 4);
                var bOutIo2 = input_gpio & (mask << 5);
                var bOutIo3 = input_gpio & (mask << 6);
                var bOutIo4 = input_gpio & (mask << 7);

                $("#flicker_in1").check_val(bOutIo1 > 0);
                $("#flicker_in2").check_val(bOutIo2 > 0);
                $("#flicker_in3").check_val(bOutIo3 > 0);
                $("#flicker_in4").check_val(bOutIo4 > 0);
                for (var i = 0; i < 6; i++) {
                    if (i == output_gpio && light_mode != 4) {
                        $("#gpio_out" + (i + 1)).check_disabled(true);
                    } else {
                        $("#gpio_out" + (i + 1)).check_enable(true);
                    }
                }
                for (var i = 0; i < vzio_arr.length; i++) {
                    if (i == output_gpio && light_mode != 4) {
                        $("#output_cfg input[type='checkbox'][vzio='" + vzio_arr[i] + "']").check_disabled(true);
                    } else {
                        $("#output_cfg input[type='checkbox'][vzio='" + vzio_arr[i] + "']").check_enable(true);
                    }
                }
                if (light_mode == 4) {
                    g_lamp_io_out = -1;
                    g_lamp_io_in = -1;
                }
                if (body['time_ctrl'] != undefined) {
                    var arr = body.time_ctrl;
                    var level1 = arr[0].timectrl_enable;
                    var level2 = arr[1].timectrl_enable;
                    var level3 = arr[2].timectrl_enable;
                    $("#strobe_led_level1").select_val(level1);
                    $("#strobe_led_level2").select_val(level2);
                    $("#strobe_led_level3").select_val(level3);
                    var st = arr[1].time_begin;
                    var et = arr[1].time_end;
                    SetTimer("strobe_start_time1", "00:00");
                    SetTimer("strobe_end_time3", "00:00");
                    $(".strobe_time1").each(function () {
                        var id = $(this).attr("id");
                        SetTimer(id, st);
                    });
                    $(".strobe_time2").each(function () {
                        var id = $(this).attr("id");
                        SetTimer(id, et);
                    });
                }
                $("#light_mode").select_val(light_mode);
                $("#light_delay_time").val(delay_time);
                $("#light_time").val(light_time);
                strobe_light_change(light_mode);
            })
        }
        function set_flashlamp_info() {
            var light_mode = parseInt($("#light_mode").select_val());
            var output_gpio = 0;
            if ($("#flicker_out1").check_val()) {
                output_gpio = 0;
            } else if ($("#flicker_out2").check_val()) {
                output_gpio = 1;
            } else if ($("#flicker_out3").check_val()) {
                output_gpio = 2;
            } else if ($("#flicker_out4").check_val()) {
                output_gpio = 3;
            } else if ($("#flicker_out5").check_val()) {
                output_gpio = 4;
            } else if ($("#flicker_out6").check_val()) {
                output_gpio = 5;
            }
            var bOutIo1 = $("#flicker_in1").check_val() ? 1 : 0;
            var bOutIo2 = $("#flicker_in2").check_val() ? 1 : 0;
            var bOutIo3 = $("#flicker_in3").check_val() ? 1 : 0;
            var bOutIo4 = $("#flicker_in4").check_val() ? 1 : 0;
            var input_gpio = (parseInt(bOutIo1) << 4) | (parseInt(bOutIo2) << 5) | (parseInt(bOutIo3) << 6) | (parseInt(bOutIo4) << 7)
            var repeatIo = false;
            if (g_gp_io == output_gpio) {
                repeatIo = true
            }
            if (vzio_check[output_gpio]) {
                repeatIo = true
            }
            if (repeatIo && light_mode != 4) {
                show_informer_text($.i18n.prop("io_used"));
                return false
            }

            var delay_time = $("#light_delay_time").val();
            var light_time = $("#light_time").val();
            if (isNaN(delay_time) || delay_time < 0 || delay_time > 3000 || isNaN(light_time) || light_time < 0 || light_time > 3000) {
                show_informer_text($.i18n.prop("parameter_error"));
                return false;
            }
            var cfg = {}
            cfg.type = "set_flashlamp_info";
            cfg.module = "EVS_BUS_REQUEST";
            cfg.body = {}
            cfg.body.output_gpio = output_gpio;
            cfg.body.input_gpio = input_gpio;
            cfg.body.light_mode = light_mode;
            cfg.body.flash_info = {};
            cfg.body.flash_info.delay_time = parseInt(delay_time);
            cfg.body.flash_info.light_time = parseInt(light_time);
            if (light_mode == 0 || light_mode == 1) {
                var time1 = returnTimer("strobe_start_time2");
                var time2 = returnTimer("strobe_end_time2");
                var sts = time1.split(":");
                var ets = time2.split(":");
                var val1 = parseInt(sts[0], 10) * 60 + parseInt(sts[1], 10);
                var val2 = parseInt(ets[0], 10) * 60 + parseInt(ets[1], 10);
                if (val2 < val1) {
                    show_informer_text($.i18n.prop("start_time_cannot_exceed_end_time"));
                    return;
                }
                var s_l = parseInt($("#strobe_led_level1").select_val());
                var s_v = parseInt($("#strobe_led_level2").select_val());
                var s_r = parseInt($("#strobe_led_level3").select_val());
                var arr = [];
                for (var i = 0; i < 3; i++) {
                    var json = {};
                    if (i == 0) {
                        json.time_begin = "00:00:00";
                        json.time_end = time1;
                        json.timectrl_enable = s_l;
                    } else if (i == 1) {
                        json.time_begin = time1;
                        json.time_end = time2;
                        json.timectrl_enable = s_v;
                    } else {
                        json.time_begin = time2;
                        json.time_end = "24:00:00";
                        json.timectrl_enable = s_r;
                    }
                    json.id = i;
                    arr.push(json);
                }
                cfg.body.time_ctrl = arr;
            }
            post(cfg, function () {
                show_informer();
                get_flashlamp_info();
            })
        }
        function strobe_light_change(mode) {
            var enable = mode == 4 ? 0 : 1;
            ele_change(enable, "disabled_led")
            if (mode == 0) {
                $(".strobe_time_tr").hide();
                $(".strobe_frame").show();
            } else if (mode == 1) {
                $(".strobe_time_tr").show();
                $(".strobe_frame").show();
            } else if (mode == 2) {
                $(".strobe_time_tr").hide();
                $(".strobe_frame").hide();
            } else if (mode == 3) {
                $(".strobe_time_tr").show();
                $(".strobe_frame").hide();
            }
        }
        this.init = function () {
            init_selectmenu("#led_sel", 200, 150, function (e, object) {
                light_change(parseInt(object.value));
            });
            init_selectmenu(".led_level,.strobe_level", 80, 150);
            $(".time,.strobe_time").each(function () {
                var id = $(this).attr("id");
                var flag = false;
                if (id == "start_time1" || id == "strobe_start_time1" || id == "end_time3" || id == "strobe_end_time3") {
                    flag = true;
                }
                showTimer(id, flag);
            });
            $(".time input").change(function () {
                var parent = $(this).parents(".time");
                var str = "";
                if (parent.hasClass("time1")) {
                    str = ".time1";
                } else if (parent.hasClass("time2")) {
                    str = ".time2";
                }
                if (str != '') {
                    var name = $(this).attr("name");
                    var val = $(this).val();
                    $(str + " input[name='" + name + "']").val(val);
                }
            });

            $(".time span").click(function () {
                var parent = $(this).parents(".time");
                var str = "";
                if (parent.hasClass("time1")) {
                    str = ".time1";
                } else if (parent.hasClass("time2")) {
                    str = ".time2";
                }
                if (str != "") {
                    var hh_val = $(this).parent().siblings().find("input[name='HH']").val();
                    $(str + " input[name='HH']").val(hh_val);
                    var mm_val = $(this).parent().siblings().find("input[name='MM']").val();
                    $(str + " input[name='MM']").val(mm_val);
                }
            });
            $("#led_submit").click(new_set_led_cfg);
            init_selectmenu("#light_mode", 200, 150, function (e, object) {
                strobe_light_change(parseInt(object.value));
            });
            $(".strobe_time input").change(function () {
                var parent = $(this).parents(".strobe_time");
                var str = "";
                if (parent.hasClass("strobe_time1")) {
                    str = ".strobe_time1";
                } else if (parent.hasClass("strobe_time2")) {
                    str = ".strobe_time2";
                }
                if (str != "") {
                    var name = $(this).attr("name");
                    var val = $(this).val();
                    $(str + " input[name='" + name + "']").val(val);
                }
            });

            $(".strobe_time span").click(function () {
                var parent = $(this).parents(".strobe_time");
                var str = "";
                if (parent.hasClass("strobe_time1")) {
                    str = ".strobe_time1";
                } else if (parent.hasClass("strobe_time2")) {
                    str = ".strobe_time2";
                }
                if (str != "") {
                    var hh_val = $(this).parent().siblings().find("input[name='HH']").val();
                    $(str + " input[name='HH']").val(hh_val);
                    var mm_val = $(this).parent().siblings().find("input[name='MM']").val();
                    $(str + " input[name='MM']").val(mm_val);
                }
            });
            $("#set_flashlamp_info").click(set_flashlamp_info);
            ele_change(0, 'flicker_in')
            get_led_ctrl_prop();
            get_flashlamp_info();
        }
    }
    var detection = new function () {
        function get_io_state(io_number, io_opera, io_type, io_status) {
            var cfg = {};
            cfg.type = "evs_gpio_test_ctrl";
            cfg.body = {};
            cfg.body.io_number = io_number;
            cfg.body.io_opera = io_opera;
            cfg.body.io_type = io_type;
            if (io_status) {
                cfg.body.io_status = io_status;
            }
            var jsonstr = JSON.stringify(cfg);
            $.ajax({
                type: "post",
                url: "evtjson.php",
                data: jsonstr,
                success: function (ajaxdata) {
                    var json = eval("(" + ajaxdata + ")");
                    if (json.state == 200) {
                        if (io_opera == 2) {
                            var io_status = json.body.io_status;
                            $("#detection_tb tbody tr[io_number='" + io_number + "'][io_type='" + io_type + "']").find(".state_td").html(io_status);
                            $("#detection_tb tbody tr[io_number='" + io_number + "'][io_type='" + io_type + "']").find(".io_out_select").select_val(io_status);
                        } else {
                            show_informer();
                            get_io_state(io_number, 2, io_type, io_status);
                        }
                    }
                }
            })
        }
        function init_io_state() {
            $("#detection_tb tbody tr").each(function () {
                var io_opera = 2;
                var io_number = parseInt($(this).attr("io_number"));
                var io_type = parseInt($(this).attr("io_type"));
                get_io_state(io_number, io_opera, io_type);
            })
        }
        this.init = function () {
            init_selectmenu(".io_out_select", 100, 150, function (e, object) {
                object.element.parents("tr").find(".state_td").html("");
                var io_opera = 1;
                var io_number = parseInt(object.element.parents("tr").attr("io_number"));
                var io_type = parseInt(object.element.parents("tr").attr("io_type"));
                var io_status = parseInt(object.value);
                get_io_state(io_number, io_opera, io_type, io_status);
            });
            $(".refresh_state").click(function () {
                $(this).parents("tr").find(".state_td").html("");
                var io_opera = 2;
                var io_number = parseInt($(this).parents("tr").attr("io_number"));
                var io_type = parseInt($(this).parents("tr").attr("io_type"));
                get_io_state(io_number, io_opera, io_type);
            });
            init_io_state();
        }
    }
    var talk_io = 0;
    function get_talk_para() {
        var cfg = {};
        cfg.type = "ps_get_voice_config";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                talk_io = jsondata.talk_io;
                disabled_talk_io(talk_io);
            }
        });
    }
    function disabled_talk_io(gpio_port) {
        if (gpio_port == 1) {
            $("#gpio_in1").check_disabled(true);
            $("#io-in1").check_disabled(true);
        } else if (gpio_port == 2) {
            $("#gpio_in2").check_disabled(true);
            $("#io-in2").check_disabled(true);
        } else if (gpio_port == 4) {
            $("#gpio_in3").check_disabled(true);
            $("#io-in3").check_disabled(true);
        } else if (gpio_port == 8) {
            $("#gpio_in4").check_disabled(true);
            $("#io-in4").check_disabled(true);
        }
    }
    this.init = function () {
        //建安顺有自己的语音页面
        if (g_style_time == "new" || audio_num == 0) {
            $("#audio_li").remove();
            $("#audio").remove();
        } else {
            get_talk_para();
        }
        get_boardversion_info(g_d_type, g_m_version, g_s_version);
        init_selectmenu("select:not(#led_level1,#led_level2,#led_level3,#cur_channel_1,#deal_mode,#use_serial_port,#led_sel,#start_mode1,#start_mode2,#dsp_input,#dsp_output,#greeting,#dsp_tag)", 130, 150);
        if (cur_old_obj == "dsp") {
            $("#io_tabs>ul>li:not(#dsp_li,#audio_li)").remove();
            $("#io_tabs>div:not(#dsp,#audio)").remove();
            get_device_type(function () {
                serial_out_tab.init();
                //建安顺有自己的语音页面
                if (g_style_time != "new" && audio_num != 0) {
                    audio.init();
                }
            });
        } else if (cur_old_obj == "linkage") {
            $("#dsp_li").remove();
            $("#audio_li").remove();
            $("#dsp").remove();
            $("#audio").remove();
            trigger_output_tab.init();
            SetPlateDeviceIO.gpio.init();
            special_plates.init();
            // led_complensating.init();
            uart_tab_s.init();
            led.init();
            detection.init();
        } else {
            get_device_type(function () {
                serial_out_tab.init();
                //建安顺有自己的语音页面
                if (g_style_time != "new" && audio_num != 0) {
                    audio.init();
                }
            });
            trigger_output_tab.init();
            SetPlateDeviceIO.gpio.init();
            uart_tab_s.init();
            special_plates.init();
            // led_complensating.init();
            led.init();
            detection.init();
        }
        create_tabs("#io_tabs");
    }
    this.close = function () {
        serial_out_tab.close();
    }
    close_json["SetPlateDeviceIO"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//StorgeDeviceMana
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var StorgeDeviceMana = new function () {
    var g_hd_status, DeviceNmae, formartting, IntervalId, device_timer, realserver;
    function init_para() {
        g_hd_status = {};
        DeviceNmae = {};
        formartting = {};
        IntervalId = 0;
        device_timer = null;
        var new_href = location.href;
        realserver = new_href.split('/');
        realserver = realserver[realserver.length - 2];
        realserver = realserver.split(':')[0];
    }
    function hd_format(id) {
        if (g_hd_status[id] == 3) {
            show_informer_text($.i18n.prop("Formatting"));
            return false;
        }

        var confirm_format = confirm($.i18n.prop("format_hint"));
        if (!confirm_format) return false;

        var part = DeviceNmae[id];
        var cfg = {};
        cfg.type = "set_disk_format";
        cfg.body = {};
        cfg.body.partname = part;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: 'POST',
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    get_device_info();
                    show_informer($.i18n.prop("start_formatting"));
                    return true;
                }
            }
        })

    }

    function get_device_info() {
        var cfg = {};
        cfg.type = "get_diskinfo";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: 'POST',
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");

                if (json.state != 200) {
                    return;
                }
                var tr_ids = Array();
                var dev_arr = json.body;
                if (dev_arr) {
                    for (var i = 0; i < dev_arr.length; i++) {
                        var dev_type = dev_arr[i].devtype;
                        var type = "", status = "", capacity = "";
                        if (dev_type == 0) {
                            type = $.i18n.prop("SD_card");
                        }
                        else if (dev_type == 1) {
                            type = $.i18n.prop("hard_disk");
                        }
                        var dev_parts = dev_arr[i].devparts;
                        for (var j = 0; j < dev_parts.length; j++) {
                            var name = dev_parts[j].partname.replace(/\//g, "");
                            var partname = dev_parts[j].partname;
                            var num = dev_parts[j].partstate;
                            g_hd_status[name] = num;
                            DeviceNmae[name] = partname;
                            if (num == 3) {
                                formartting[name] = true;
                                var percent = dev_parts[j].formatpercent;
                                status = $.i18n.prop("Formatting") + "(" + percent + "%)";
                            } else if (num == 5) {
                                status = $.i18n.prop("working_order");
                            } else if (num == 1) {
                                status = $.i18n.prop("unformatted");
                            } else if (num == 2) {
                                status = $.i18n.prop("not_mount");
                            } else if (num == 4) {
                                status = $.i18n.prop("deleting");
                            } else {
                                status = $.i18n.prop("disabled");
                            }
                            var partspace = dev_parts[j].partspace;
                            var used = partspace.used / 1024;
                            used = used.toFixed(2);
                            var totle = partspace.total / 1024;
                            totle = totle.toFixed(2);
                            capacity = used + "G/" + totle + "G";

                            var tr_id = "tr" + DeviceNmae[name];
                            tr_id = tr_id.replace(/\//g, "_");
                            var old_tr = $("#" + tr_id);
                            if (old_tr.length == 0) {
                                var tr = '<tr id="' + tr_id + '" class="' + tr_id + '"><td>' + type + '</td><td>' + status + '</td><td>' + capacity + '</td><td><input type="submit" order="' + name + '" id="format_hd_' + name + '" value="' + $.i18n.prop('format') + '"/>	</td></tr>';
                                $("#devicetable").append(tr);
                                $("#devicetable td").attr("align", "center");
                                $("#format_hd_" + name).button();
                                $("#format_hd_" + name).click(function () {
                                    var id = $(this).attr("order");
                                    formartting["obj_" + id] = $(this);
                                    hd_format(id);
                                });
                            }
                            else {
                                old_tr.children().eq(1).text(status);
                                old_tr.children().eq(2).text(capacity);
                            }
                            tr_ids.push(tr_id);
                        }
                    }
                }
                var all_trs = $("#devicetable tr");
                var trs_need_remove = Array();
                for (var i = 1; i < all_trs.length; i++) {
                    var found = false;
                    var id = all_trs.eq(i).attr("class");
                    for (var j = 0; j < tr_ids.length; j++) {
                        if (id == tr_ids[j]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) trs_need_remove.push(id);
                }
                for (var i = 0; i < trs_need_remove.length; i++) {
                    $("." + trs_need_remove[i]).remove();
                }
            }
        })
    }

    function clear() {
        $("#flash_state").html($.i18n.prop("clear"));
        var cfg = {};
        cfg.type = "del_disk_allpic";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: 'POST',
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    $("#flash_state").html($.i18n.prop("working_order"));
                } else {
                    $("#flash_state").html($.i18n.prop("clear_failed"));
                }
            }
        })
    }
    var init_device_timer = null;
    function init_para() {
        init_device_timer = null;
        g_hd_status = {};
        DeviceNmae = {};
        formartting = {};
        IntervalId = 0;
    }
    this.init = function () {
        init_para();
        $("#clear").click(function () {
            clear();
        });
        get_device_info();
        init_device_timer = setInterval(get_device_info, 3000);
    }
    this.close = function () {
        clearInterval(init_device_timer);
        init_device_timer = null;
    }
    close_json["StorgeDeviceMana"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Maintenance
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Maintenance = new function () {
    function check_connection(call_back) {
        $.get("vb.htm?getnetip", function (ajaxdata) {
            if (precheck(ajaxdata)) return false;
            call_back();
        });
    }

    function set_progressbar_val(jindu_num) {
        $("#progressbar").progressbar({
            value: jindu_num
        });
        $(".progress-bar").css("width", jindu_num + "%");
        $(".progress-label").html(jindu_num + "%");
    }
    var time_id = null;
    function up_stop() {
        clearInterval(time_id);
        time_id = null;
    }
    var jindu_timer = null;
    var check_restart_complete_timer = 0;
    function check_restart() {
        $.get("vb.htm?getnetip", function (ajaxdata) {
            $("#warning_text").css("color", "Green");
            $("#warning_text").html($.i18n.prop("restart_done_hint"));
            var str = "";
            var href = location.href;
            if (href.match(/userdata=pdns/)) {
                str = "?userdata=pdns";
            }
            location.href = "login.htm" + str;
            return false;
        });
    }
    function check_restart_complete() {
        if (!check_restart_complete_timer) {
            check_restart_complete_timer = setInterval(check_restart, 10000);
        }
    }
    function restart_ipnc() {
        if (confirm($.i18n.prop("restart_confirm_hint"))) {
            check_connection(function () {
                $.get("vb.htm", { ipcamrestartcmd: "" }, null);
                $("#warning_text").css("color", "Green");
                $("#warning_text").html($.i18n.prop("restart_wait_hint"));
                check_restart_complete();
            });
        }
    }



    var timer1;
    var restart_count = 1;//no wait
    function restart_time_count() {
        restart_count--;
        if (restart_count == 0) {
            restart_count = 1;
            clearInterval(timer1);
            check_restart_complete();
        }
    }
    function set_restart_timer() {
        timer1 = setInterval(restart_time_count, 1000);
    }

    function disable_other_btns() {
        $("#restart").attr("disabled", "disabled");
        $("#update").attr("disabled", "disabled");
        $("#restore_partly").attr("disabled", "disabled");
        $("#restore_all").attr("disabled", "disabled");
        $("#restart_submit").attr("disabled", "disabled");
    }

    function enable_other_btns() {
        $("#restart").removeAttr("disabled");
        $("#update").removeAttr("disabled");
        $("#restore_partly").removeAttr("disabled");
        $("#restore_all").removeAttr("disabled");
        $("#restart_submit").removeAttr("disabled");
    }
    var restore_check_restart_complete_timer = null;
    var newloc = null;
    var all_restored = false;
    function restore_check_restart() {
        if (!all_restored) {
            $.get("vb.htm?getnetip", function (ajaxdata) {
                $("#warning_text").css("color", "Green");
                $("#warning_text").html($.i18n.prop("restored_done_hint"));
                setTimeout(function () {
                    top.location.href = newloc;
                }, 5000)
                return false;
            });
        }
        else {
            $('#warning_text').html($.i18n.prop("ip_change_hint"));
            top.location.href = newloc;
        }
    }
    function restore_check_restart_complete() {
        if (!restore_check_restart_complete_timer && all_restored) {
            restore_check_restart_complete_timer = setInterval(restore_check_restart, 20000);
        } else if (!restore_check_restart_complete_timer && !all_restored) {
            restore_check_restart_complete_timer = setInterval(restore_check_restart, 10000);
        }
    }

    function to_login(ajaxdata, all) {
        if (precheck(ajaxdata)) {
            return false;
        }
        ajaxdata = ajaxdata.split("=");
        if (!ajaxdata[0].match(/OK/)) {
            return false;
        }
        all_restored = all;
        $("#warning_text").css("color", "Green");
        $("#warning_text").html($.i18n.prop("restored_wait_hint"));

        var new_href = top.location.href;
        var str = "";
        var href = top.location.href;
        if (href.match(/userdata=pdns/)) {
            str = "?userdata=pdns";
        }
        var realserver = new_href.split('/');
        realserver = realserver[realserver.length - 2];
        new_href = new_href.split(realserver);
        if (all_restored) {
            newloc = new_href[0] + "192.168.1.100/login.htm";
        }
        else {
            newloc = "login.htm" + str;
        }
        restore_check_restart_complete();
    }

    function all_to_login(ajaxdata) {
        return to_login(ajaxdata, true);
    }

    function partly_to_login(ajaxdata) {
        return to_login(ajaxdata, false);
    }

    function restore_all() {
        if (confirm($.i18n.prop("all_restored_confirm_hint"))) {
            $.get("vb.htm", { democfg: "0" }, all_to_login);
        }
    }

    function restore_partly() {
        if (confirm($.i18n.prop("restored_confirm_hint"))) {
            $.get("vb.htm", { democfg: "1" }, partly_to_login);
        }
    }
    function get_device_info() {
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
                    $("#version").html(jd.soft_ver);
                    $("#systemversion").html(jd.system_ver);
                    var alg_ver = jd.alg_ver;
                    if (g_style_time == "new") {
                        alg_ver = "JAS_" + alg_ver.split("_")[1];
                    }
                    $("#algversion").html(alg_ver);
                }
            }
        })
    }
    function get_reboot_timing() {
        var cfg = {};
        cfg.type = "get_reboot_timing";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    jsondata = jsondata.body;
                    var enable = jsondata.enable;
                    var wday = jsondata.wday;
                    var minute = jsondata.minute;
                    $("#auto_restart").check_val(enable == 1);
                    if (enable == 0) {
                        $(".restart").addClass("disabled_color");
                        $(".restart *").attr("disabled", "disabled");
                    }
                    if (wday.indexOf(",") > 0) {
                        var arr = wday.split(",");
                        for (var i = 0; i < arr.length; i++) {
                            $("#week" + arr[i]).check_val(true);
                        }
                    } else if (wday != "") {
                        $("#week" + wday).check_val(true);
                    }
                    var hour = parseInt(minute / 60);
                    if (hour < 10) {
                        hour = "0" + hour;
                    }
                    var min = minute % 60;
                    if (min < 10) {
                        min = "0" + min;
                    }
                    var t = hour + ":" + min;
                    SetTimer("restart_time", t);
                }
            }
        });
    }
    function set_reboot_timing() {
        var enable = $("#auto_restart").check_val() ? 1 : 0;
        var t = returnTimer("restart_time");
        var arr = t.split(":");
        var minute = parseInt(arr[0]) * 60 + parseInt(arr[1]);
        var wday = "";
        $("#week input").each(function () {
            if ($(this).check_val()) {
                var week = $(this).attr("week");
                if (wday != "") {
                    wday += ",";
                }
                wday += week;
            }
        });
        var cfg = {};
        cfg.type = "set_reboot_timing";
        cfg.body = {};
        cfg.body.enable = enable;
        cfg.body.wday = wday;
        cfg.body.minute = minute;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    show_informer();
                }
            }
        });
    }
    function init_para() {
        restore_check_restart_complete_timer = null;
        newloc = null;
        all_restored = false;
        is_update_timeout1 = false;
        is_update_timeout2 = false;
        is_update_timeout3 = false;
    }
    var g_device_time = 0;
    function settime() {
        g_device_time += 1000;
        var sys_date = new Date(g_device_time);
        var sd = sys_date.format("hh:mm:ss");
        $("#device_time").html(sd);
        var w = sys_date.getDay();
        var week = "";
        if (w == 0) {
            week = $.i18n.prop("Sunday");
        } else if (w == 1) {
            week = $.i18n.prop("Monday");
        } else if (w == 2) {
            week = $.i18n.prop("Tuesday");
        } else if (w == 3) {
            week = $.i18n.prop("Wednesday");
        } else if (w == 4) {
            week = $.i18n.prop("Thursday");
        } else if (w == 5) {
            week = $.i18n.prop("Friday");
        } else if (w == 6) {
            week = $.i18n.prop("Saturday");
        }
        $("#device_week").html(week);
    }
    var settime_timer = null;
    function get_server_datatime() {
        $.get("vb.htm", { getdate: "", gettime: "" }, function (ajaxdata) {
            if (precheck(ajaxdata)) {
                return false;
            }
            var response = ajaxdata.split("\n");
            var msgdate = parse_ajax_data(response[0]);
            msgdate = msgdate.split("-");
            var year = msgdate[0];
            var month = msgdate[1] - 1;
            var date = msgdate[2];
            var msgtime = parse_ajax_data(response[1]);
            msgtime = msgtime.split(":");
            var hours = msgtime[0];
            var minutes = msgtime[1];
            var seconds = msgtime[2];
            var sys_date = new Date(year, month, date, hours, minutes, seconds);
            g_device_time = sys_date.getTime();
            settime();
            if (settime_timer == null) {
                settime_timer = setInterval(settime, 1000);
            }
        });
    }
    var xhrOnProgress = function (fun) {
        xhrOnProgress.onprogress = fun; //绑定监听
        //使用闭包实现监听绑
        return function () {
            //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
            var xhr = $.ajaxSettings.xhr();
            //判断监听函数是否为函数
            if (typeof xhrOnProgress.onprogress !== 'function')
                return xhr;
            //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
            if (xhrOnProgress.onprogress && xhr.upload) {
                xhr.upload.onprogress = xhrOnProgress.onprogress;
            }
            return xhr;
        }
    }

    function Submit() {
        var fileObj = document.getElementById("file_input").files[0]; // js 获取文件对象
        var formFile = new FormData();

        formFile.append("file", fileObj); //加入文件对象

        var data = formFile;
        $.ajax({
            url: "upload.cgi",
            data: data,
            type: "Post",
            cache: false,//上传文件无需缓存
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            xhr: xhrOnProgress(function (e) {
                var percent = parseInt(e.loaded / e.total * 100);
                set_progressbar_val(percent);
            }),
            success: function (result) {
                var r = result;
                if (r == undefined || r.length == 0) {
                    $("#warning_text").css("color", "Red");
                    $("#warning_text").html($.i18n.prop("updata_failed_hint"));
                }
                else if (r.match(/All update success/)) {
                    $("#warning_text").css("color", "Green");
                    $("#warning_text").html($.i18n.prop("updata_done_hint"));
                    $.get("vb.htm", { ipcamrestartcmd: "" }, null);
                }
                else if (r.match(/All update failed/)) {
                    $("#warning_text").css("color", "Red");
                    $("#warning_text").html($.i18n.prop("updata_failed_hint"));
                }
                else {
                    $("#warning_text").css("color", "Red");
                    $("#warning_text").html($.i18n.prop("updata_failed_hint"));
                }
                enable_other_btns();
            },
            error: function () {
                $("#warning_text").css("color", "Red");
                $("#warning_text").html($.i18n.prop("updata_failed_hint"));
                enable_other_btns();
            }
        })
    }
    var loaded = true;
    function on_iframe_loaded() {
        if (loaded) {
            return;
        }
        clearInterval(jindu_timer);
        jindu_timer = null;
        loaded = true;
        var r;
        var error = false;
        try {
            r = getIFrameContent("hidden_frame");
        }
        catch (error) {
            error = true;
        }
        if (r == undefined || r.length == 0) {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("updata_failed_hint"));
        }
        else if (r.match(/All update success/)) {
            $("#warning_text").css("color", "Green");
            $("#warning_text").html($.i18n.prop("updata_done_hint"));
            $.get("vb.htm", { ipcamrestartcmd: "" }, null);
        }
        else if (r.match(/All update failed/)) {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("updata_failed_hint"));
        }
        else {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("updata_failed_hint"));
        }
    }
    //取iframe的innerHTML
    function getIFrameContent(id) {
        var hidden_fr = document.getElementById(id);
        if (document.getElementById) {
            if (hidden_fr && !window.opera) {
                if (hidden_fr.contentDocument) {
                    return hidden_fr.contentDocument.body.innerHTML;
                } else if (hidden_fr.Document) {
                    return hidden_fr.Document.body.innerHTML;
                }
            }
        }
    }
    var time_timer = null;
    this.init = function () {
        init_para();
        if (ie.isIE && ie.version <= 9) {
            $("#hidden_frame").on("load", on_iframe_loaded);
        }
        get_device_info();
        $("#restart").click(restart_ipnc);
        $("#auto_restart").change(function () {
            if ($(this).check_val()) {
                $(".restart").removeClass("disabled_color");
                $(".restart *").removeAttr("disabled", "disabled");
            } else {
                $(".restart").addClass("disabled_color");
                $(".restart *").attr("disabled", "disabled");
            }
        });
        $("#blue_bar").css("transition", "none");
        $("#restore_all").click(restore_all);
        $("#restore_partly").click(restore_partly);
        $("#update").click(function () {
            var value = $("#file_input").val();
            if (value.substring(value.length - 4) != ".bin") {
                show_informer_text($.i18n.prop("select_update_file"));
                return false;
            }
            check_connection(function () {
                disable_other_btns();
                $("#warning_text").css("color", "Red");
                $("#warning_text").html($.i18n.prop("updata_hint"));
                if (ie.isIE && ie.version <= 9) {
                    loaded = false;
                    $("#frmUpdate").submit();
                } else {
                    $("#progressbar_tr").show();
                    Submit();
                }
            });
        });
        showTimer("restart_time");
        $("#restart_submit").click(set_reboot_timing);
        get_server_datatime();
        time_timer = setInterval(function () {
            get_server_datatime();
        }, 5000);
        get_reboot_timing();
    }
    this.close = function () {
        clearInterval(jindu_timer);
        jindu_timer = null;
        clearInterval(check_restart_complete_timer);
        check_restart_complete_timer = null;
        clearInterval(restore_check_restart_complete_timer);
        restore_check_restart_complete_timer = null;
        clearInterval(time_id);
        time_id = null;
        clearInterval(time_timer);
        time_timer = null;
        clearInterval(settime_timer);
        settime_timer = null;
    }
    close_json["Maintenance"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//AddEditUsers
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var AddEditUsers = new function () {
    function get_users(ajaxdata) {
        if (precheck(ajaxdata)) {
            return false;
        }
        var json = eval("(" + ajaxdata + ")");
        if (json.state == 200) {
            var users = json.body;
            var str = "";
            for (var i = 0; i < users.length; i++) {
                $("#session_timeout").val(users[i].sign_in_timeout);
                var authority = users[i].authority;
                var auth_str = "None";
                if (authority == 0) {
                    auth_str = $.i18n.prop("administrator");
                } else if (authority == 1) {
                    auth_str = $.i18n.prop("operator");
                } else if (authority == 2) {
                    auth_str = $.i18n.prop("observer");
                }
                var auth = users[i].auth
                auth = AesCtr.decrypt(auth, '天天', 128);
                var username = auth.split(':')[0];
                if (username == "admin") {
                    str += '<tr><td>' + username + '</td><td>' + auth_str + '</td><td><a class="edit_user" auth=' + auth + '>' + $.i18n.prop("edit") + '</a></td></tr>';
                }
                else {
                    str += '<tr><td>' + username + '</td><td>' + auth_str + '</td><td><a class="edit_user" auth=' + auth + '>' + $.i18n.prop("edit") + '</a>&nbsp;|&nbsp;<a class="del_user">' + $.i18n.prop("delete") + '</a></td></tr>';
                }
            }
            if ($("#table_users tr").length > 1) {
                $("#table_users tr:gt(0)").remove();
            }
            $("#table_users").append(str);


            //for appearance
            var tablelen = $("#table_users tr").length;
            if (tablelen < 4) {
                for (var i = 0; i < 4 - tablelen; i++) {
                    var tr = '<tr><td> &nbsp;</td><td></td><td></td></tr>';
                    $("#table_users").append(tr);
                }
            }
            $("#table_users td").attr("align", "center");
            $(".edit_user").click(function () {
                $("#username").attr("readonly", "readonly");
                $("#edit_dialog").show();
                $("#username").val($(this).parent("td").siblings().first().html());
                var name = $(this).parent("td").siblings(":eq(0)").html();
                var auth = parseInt($(this).attr("auth"));
                if (name == "admin") {
                    auth = 0;
                    $("#user_type option[value='0']").removeAttr("disabled");
                    $("#user_type").selectmenu('disable');
                } else {
                    $("#user_type").selectmenu('enable');
                }

                $("#user_type").select_val(auth);
                $("#usrpwd").val("");
                $("#confirmpwd").val("");
                $("#usrpwd").focus();
                return false;
            });
            $(".del_user").click(function () {
                var username = $(this).parent("td").siblings().first().html();
                var outtext = $.cookie('outtext');
                passwd = "天天";
                var postdata = AesCtr.decrypt(outtext, passwd, 128);
                postdata = postdata.split(':');

                if (username == postdata[0]) {
                    show_informer_text($.i18n.prop("delete_login_user_tips"));
                    return;
                }
                if (confirm($.i18n.prop("confirm_delete_user") + username + "？")) {
                    set_user(username, "", "", "del");
                }
            });
        }
    }
    function on_submit() {
        var username = $("#username").val();
        if (username.length == 0) {
            show_informer_text($.i18n.prop("enter_user_name"));
        }
        else if (!username.match(/^.{4,33}$/)) {
            show_informer_text($.i18n.prop("user_name_length_tips") + ' 4~33');
        }
        else if (!username.match(/^[a-zA-Z]{1}/)) {
            show_informer_text($.i18n.prop("user_name_letter_tips"));
        }
        else if (!username.match(/^\w{1,33}$/)) {
            show_informer_text($.i18n.prop("user_name_symbol_tips"));
        }
        else {
            var pwd = $("#usrpwd").val();
            var pwd1 = $("#confirmpwd").val();
            if (pwd.length == 0) {
                show_informer_text($.i18n.prop("user_pwd_null_tips"));
            }
            else if (pwd.length > 33 || pwd1.length > 33) {
                show_informer_text($.i18n.prop("user_pwd_length_tips") + " 4~33");
            }
            else if (pwd != pwd1) {
                show_informer_text($.i18n.prop("entered_passwords_differ"));
            }
            else if (pwd.match(/[:]{1}/)) {
                show_informer_text($.i18n.prop("user_pwd_symbol_tips"));
            }
            else {
                $("#edit_dialog").hide();
                var auth = parseInt($("#user_type").select_val());
                set_user(username, pwd, auth, "add");
            }
        }
    }
    function add_user() {
        $("#username").removeAttr("readonly");
        $("#user_type").selectmenu('enable');
        $("#edit_dialog").show();
        $("#usrpwd").val("");
        $("#confirmpwd").val("");
        $("#username").val("").focus();
    }
    function set_user(name, pwd, authority, control) {
        var auth = name + ":" + pwd;
        auth = AesCtr.encrypt(auth, '天天', 128);
        var cfg = {};
        cfg.type = "ss_set_account";
        cfg.body = {};
        cfg.body.remote_id = "";
        cfg.body.auth = auth;
        cfg.body.authority = authority;
        cfg.body.control = control;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            dataType: "text",
            data: jsonstr,
            url: "systemjson.php",
            success: function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    show_informer();
                    get_user();
                }
            }
        })
    }
    function set_session_timeout() {
        var session_timeout = parseInt($("#session_timeout").val());
        if (isNaN(session_timeout) || session_timeout < 0 || session_timeout > 60) {
            show_informer_text($.i18n.prop("time_out_length_tips") + " 0~60");
            return;
        }
        var cfg = {};
        cfg.type = "ss_set_account";
        cfg.body = {};
        cfg.body.sign_in_timeout = session_timeout;
        cfg.body.control = "add";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "systemjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    show_informer();
                }
            }
        });
    }
    function get_user() {
        var cfg = {};
        cfg.type = "ss_get_accounts";
        cfg.body = {};
        cfg.body.remote_id = "";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            dataType: "text",
            data: jsonstr,
            url: "systemjson.php",
            success: function (ajaxdata) {
                get_users(ajaxdata);
            }
        })
    }
    this.init = function () {
        init_selectmenu("#user_type", 200, 150);
        $("#user_submit").click(on_submit);
        $("#user_add").click(add_user);
        $("#user_cancel").click(function () {
            $("#edit_dialog").hide();
        });
        $("#outtime_submit").click(set_session_timeout);
        get_user();
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//DeviceGroup
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var DeviceGroup = new function () {
    var cur_drag_parent = null;
    var cur_drag_id = null;
    var sel_sn_list = [];
    var device_data_json = null;
    var isSave = true;
    var MoveTest = {
        curTarget: null,
        curTmpTarget: null,
        noSel: function () {
            try {
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            } catch (e) { }
        },
        dragTree2Dom: function (treeId, treeNodes) {
            return !treeNodes[0].isParent;
        },
        prevTree: function (treeId, treeNodes, targetNode) {
            return false;
        },
        nextTree: function (treeId, treeNodes, targetNode) {
            return false;
        },
        innerTree: function (treeId, treeNodes, targetNode) {
            //return targetNode != null;
            return true;
        },
        remove: function (treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var oldparent = null;
            if (treeNode.isParent) {
                traverse_tree(treeNode);
            } else {
                if (treeNode.astType == 1) {
                    if (!confirm($.i18n.prop('delete_main_tips'))) {
                        return false
                    }
                    var parentNode = treeNode.getParentNode()
                    traverse_tree(parentNode);
                    zTree.removeNode(parentNode);
                } else {
                    del_treeNode(treeNode);
                }
            }
            $(".device_list").selectmenu("refresh");
            isSave = false;
            oldparent = treeNode.getParentNode();
            if (!oldparent) {
                return;
            }
            if (!oldparent.children || oldparent.children.length == 1) {
                zTree.removeNode(oldparent);
            }
        },
        rename: function (event, treeId, treeNode) {
            var rootname = $("#" + treeId).parents(".carport_con").attr("name");
            if (!treeNode.isParent) {
                treeNode.deviceName = get_name(treeNode, treeNode.deviceFlag, rootname);
            } else {
                rename_rf(treeNode, rootname);
            }
            isSave = false;
        },
        beforeRename: function (treeId, treeNode, newName) {
            var same_name = true;

            same_name = isSameName(newName, treeNode.tId, treeId);
            if (!same_name) {
                show_informer_text($.i18n.prop("same_name_hint"));
            }
            if (newName.length == 0) {
                show_informer_text($.i18n.prop("name_empty_hint"));
                same_name = false;
            }
            if (newName.length > 16) {
                show_informer_text($.i18n.prop("name_length_hint") + "16");
                same_name = false;
            }
            return same_name;
        },
        nodeDrop: function (event, treeId, treeNodes, targetNode) {
            if (!targetNode) {
                if (!$(event.target).hasClass("ztree")) {
                    return;
                }
                var type = "";
                if ($(event.target).hasClass("input")) {
                    type = "input";
                } else if ($(event.target).hasClass("output")) {
                    type = "output";
                }
                if (treeNodes[0].deviceType != type) {
                    var hintText = get_hintText(treeNodes[0].deviceType, type);
                    var con = confirm(hintText);
                    if (con) {
                        treeNodes[0].deviceType = type;
                    } else {
                        return false;
                    }
                }
                var rootname = $("#" + treeId).parents(".carport_con").attr("name");
                treeNodes[0].deviceName = get_name(treeNodes[0], "", rootname);
                isSave = false;
            }
            var oldTree = $.fn.zTree.getZTreeObj(cur_drag_id);
            if (cur_drag_parent) {
                if (cur_drag_parent.children.length == 1) {
                    //var rootname = $("#" + cur_drag_id).parents(".carport_con").attr("name");
                    //cur_drag_parent.children[0].deviceFlag = "";
                    //var node = oldTree.moveNode(cur_drag_parent, cur_drag_parent.children[0],"prev");
                    //oldTree.removeNode(cur_drag_parent);
                    //update_device_flag(node, node.deviceFlag, rootname);
                } else if (cur_drag_parent.children.length == 0) {
                    oldTree.removeNode(cur_drag_parent);
                }
                cur_drag_parent = null;
            }
            cur_drag_id = null;
            //return false;
        },
        nodeDrag: function (event, treeId, treeNodes) {
            cur_drag_id = treeId;
            if (treeNodes[0].getParentNode()) {
                cur_drag_parent = treeNodes[0].getParentNode();
            }
        },
        beforeDrag: function (treeId, treeNodes) {
            if (treeNodes[0].isParent) {
                return false;
            }
        },
        beforeDrop: function (treeId, treeNodes, targetNode) {
            if (targetNode) {
                var oldparent = null;
                var oldroot = null;
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                var oldTree = $.fn.zTree.getZTreeObj(cur_drag_id);

                if (treeNodes[0].getParentNode()) {
                    if (treeNodes[0].getParentNode().level == 0) {
                        if (treeNodes[0].getParentNode().children.length == 2) {
                            oldparent = treeNodes[0].getParentNode();
                        } else if (treeNodes[0].getParentNode().children.length == 1) {
                            oldroot = treeNodes[0].getParentNode();
                        }
                    }
                }

                if (!targetNode.isParent && targetNode.level == 0) {
                    if (treeNodes[0].deviceType != targetNode.deviceType) {
                        var hintText = get_hintText(treeNodes[0].deviceType, targetNode.deviceType);
                        var con = confirm(hintText);
                        if (con) {
                            treeNodes[0].deviceType = targetNode.deviceType;
                        } else {
                            return false;
                        }
                    }
                    var name = get_nosamename($.i18n.prop("assist"), treeId);
                    newNode = zTree.addNodes(null, { id: name, name: name, deviceType: targetNode.deviceType, isParent: true, open: true, icon: "style/common/img/CameraGroup.png" });
                    movenode_and_setflag(treeId, targetNode, newNode[0], newNode[0].tId);
                    if (treeId == cur_drag_id) {
                        movenode_and_setflag(treeId, treeNodes[0], newNode[0], newNode[0].tId);
                    } else {
                        movenode_and_setflag(treeId, treeNodes[0], newNode[0], newNode[0].tId, cur_drag_id);
                    }
                    if (oldroot) {
                        oldTree.removeNode(oldroot);
                    }
                    oldparent = null;
                    oldroot = null;
                    isSave = false;
                    return false;
                } else if (targetNode.isParent && targetNode.level == 0) {
                    if (targetNode.children.length == 4) {
                        show_informer_text($.i18n.prop("assist_camera_length") + "4");
                        return false;
                    }
                    var status = isSameType(treeNodes[0].deviceType, targetNode);
                    if (status) {
                        var hintText = get_hintText(treeNodes[0].deviceType, targetNode.deviceType);
                        var con = confirm(hintText);
                        if (con) {
                            treeNodes[0].deviceType = targetNode.deviceType;
                        } else {
                            return false;
                        }
                    }
                    movenode_and_setflag(treeId, treeNodes[0], targetNode, targetNode.tId, cur_drag_id);
                    var rootname = $("#" + treeId).parents(".carport_con").attr("name");
                    var childrens = targetNode.children;
                    for (var i = 0; i < childrens.length; i++) {
                        childrens[i].deviceName = get_name(childrens[i], targetNode.tId, rootname);
                    }
                    if (oldroot) {
                        oldTree.removeNode(oldroot);
                    }
                    oldparent = null;
                    oldroot = null;
                    isSave = false;
                    return false;
                } else if (!targetNode.isParent && targetNode.level == 1) {
                    return false;
                }
            }
        },
        dblClickExpand: function dblClickExpand(treeId, treeNode) {
            return treeNode.level > 0;
        },
        onRemove: function (event, treeId, treeNode) {
            var parentNode = treeNode.getParentNode();
            if (!parentNode) {
                return false;
            }
        }
    };

    function get_hintText(type, new_type) {
        if (type == "input") {
            return $.i18n.prop("device_change_hint1");
        } else {
            return $.i18n.prop("device_change_hint");
        }
    }
    var cur_node;
    function update_device_type(sn, type, value) {
        if (device_data_json["vzid"].sn == sn) {
            device_data_json["vzid"][type] = value;
        } else {
            var list = device_data_json["group_cfg"]["group_vzids"];
            for (var i = 0; i < list.length; i++) {
                if (list[i].sn == sn) {
                    list[i][type] = value;
                    break;
                }
            }
        }
    }
    function get_cn_type(type) {
        if (type == "input") {
            return $.i18n.prop("entrance");
        } else if (type == "output") {
            return $.i18n.prop("exit");
        } else {
            return $.i18n.prop("unknown");
        }
    }
    function isSameType(type, parentNode) {
        var flag = false;
        for (var i = 0; i < parentNode.children.length; i++) {
            if (parentNode.children[i].deviceType != type) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    function get_root_node(treenode) {
        if (treenode.level == 0) {
            return treenode;
        } else {
            return get_root_node(treenode.getParentNode());
        }
    }
    function movenode_and_setflag(id, treeNode, parentNode, flag, oldid) {
        var rootname = $("#" + id).parents(".carport_con").attr("name");
        var zTree = $.fn.zTree.getZTreeObj(id);
        treeNode.deviceFlag = flag;
        if (oldid) {
            var oldTree = $.fn.zTree.getZTreeObj(oldid);
            var newNode = zTree.addNodes(parentNode, treeNode);
            oldTree.removeNode(treeNode);
            treeNode = newNode[0];
        } else {
            zTree.moveNode(parentNode, treeNode, "inner");
        }
        treeNode.deviceName = get_name(treeNode, flag, rootname);
    }
    function isSameName(name, tid, treeID) {
        var zTree = $.fn.zTree.getZTreeObj(treeID);
        var nodes0 = zTree.getNodesByParam("isParent", true, null);
        for (var i = 0; i < nodes0.length; i++) {
            if (nodes0[i].tId == tid) {
                continue;
            }
            if (nodes0[i].name == name) {
                return false;
            }
        }
        return true;
    }
    function isSameTree(name) {
        var flag = true;
        $(".ztree").each(function () {
            var id = $(this).attr("id");
            if (id == name) {
                flag = false;
                return false;
            }
        });
        return flag;
    }
    function isSameCarPort(name) {
        var flag = true;
        $("#carport_container .carport_con").each(function () {
            var val = Base64.decode($(this).attr("name"), true);
            if (val == name) {
                flag = false;
                return false;
            }
        });
        return flag;
    }

    function rename_rf(treeNode, rootname) {
        if (!treeNode.children) {
            return false;
        }
        for (var i = 0; i < treeNode.children.length; i++) {
            if (!treeNode.children[i].isParent) {
                treeNode.children[i].deviceName = get_name(treeNode.children[i], treeNode.children[i].deviceFlag, rootname);
            } else {
                rename_rf(treeNode.children[i], rootname);
            }
        }
    }
    function update_device_flag(treeNode, value, rootname) {
        var flag = value;
        if (value != "") {
            flag = get_flag("encode", value);
        }
        var name = rootname + "&" + get_device_name(treeNode) + "#" + flag;
        update_device_type(treeNode.deviceSN, "name", name);
    }
    function get_name(treeNode, value, rootname) {
        var flag = value;
        if (value != "") {
            flag = get_flag("encode", value);
        }
        return rootname + "&" + get_device_name(treeNode) + "#" + flag;
    }
    function get_flag(type, value) {
        if (value == "") {
            return value;
        } else {
            if (type == "encode") {
                return Base64.encode(value, true);
            } else {
                return Base64.decode(value, true);
            }
        }
    }
    function get_device_name(treeNode) {
        if (treeNode.level == 0) {
            return Base64.encode(treeNode.name, true);
        } else {
            return get_device_name(treeNode.getParentNode()) + "&" + Base64.encode(treeNode.name, true);
        }
    }

    function traverse_tree(treeNode) {
        if (!treeNode.children) {
            return false;
        }
        for (var i = 0; i < treeNode.children.length; i++) {
            if (!treeNode.children[i].isParent) {
                del_treeNode(treeNode.children[i]);
            } else {
                traverse_tree(treeNode.children[i]);
            }
        }
    }
    function setRenameBtn(treeId, treeNode) {
        return true;
    }

    function setRemove(treeId, treeNode) {
        //if (treeNode.level == 0) {
        //    return false;
        //}
        return true;
    }
    var setting = {
        edit: {
            enable: true,
            showRemoveBtn: setRemove,
            showRenameBtn: setRenameBtn,
            drag: {
                prev: MoveTest.prevTree,
                next: MoveTest.nextTree,
                inner: MoveTest.innerTree
            }
        },
        data: {
            keep: {
                parent: true,
                leaf: false
            },
            simpleData: {
                enable: true
            },
            key: {
                title: "description"
            }
        },
        callback: {
            beforeRemove: MoveTest.remove,
            onRename: MoveTest.rename,
            beforeRename: MoveTest.beforeRename,
            onDrop: MoveTest.nodeDrop,
            onDrag: MoveTest.nodeDrag,
            beforeDrag: MoveTest.beforeDrag,
            beforeDrop: MoveTest.beforeDrop,
            onRemove: MoveTest.onRemove
        },
        view: {
            selectedMulti: false,
            //dblClickExpand: MoveTest.dblClickExpand,
            showLine: false
        }
    };

    var zNodes = [
        //{ id: 1, pId: 0, name: "车库1", isParent: true, open: true }
    ];

    function get_remain_info(plate, ip, name, time) {
        return '<tr><td>' + plate + '</td><td>' + ip + '</td><td>' + name + '</td><td>' + timeConverter(time) + '</td></tr>';
    }
    function show_remain_paltes(data) {
        $("#remain_info tr:gt(0)").remove();
        var json_data = eval(data);
        $.each(json_data, function (index, item) {
            $("#remain_info").append(get_remain_info(json_data[index].plate, json_data[index].enter_ip, json_data[index].enter_name, json_data[index].enter_time));
        });
    }

    function add_new_node(id, sn, ip, type, name, status, enable, ast_type) {
        var url = "style/common/img/s_offline.png";
        if (sn == device_data_json["vzid"].sn) {
            url = "style/common/img/s_online.png";
        }
        var zTree = $.fn.zTree.getZTreeObj(id);
        var nodes = zTree.addNodes(null, { id: ip, name: ip, icon: url, deviceSN: sn, deviceIP: ip, deviceType: type, deviceName: name, deviceStatus: status, deviceEnable: enable, deviceFlag: '', astType: ast_type, description: ip });

        zTree.selectNode(nodes[0]);
        return nodes[0];
    }
    function get_nosamename(name, id, flag) {
        var str = name;
        str += Math.ceil(Math.random() * 100);
        if (flag == 1) {
            if (isSameCarPort(str)) {
                return str;
            } else {
                return get_nosamename(name, id, flag);
            }
        } else if (flag == 2) {
            if (isSameTree(str)) {
                return str;
            } else {
                return get_nosamename(name, id, flag);
            }
        } else {
            if (isSameName(str, "", id)) {
                return str;
            } else {
                get_nosamename(name, id);
            }
        }
    }
    function updateSel(flag, status, enable, ip, name, sn, type, ast_type) {
        if (flag == "delete") {
            $(".device_list option").each(function () {
                if ($(this).val().split(":")[4] == sn) {
                    $(this).remove();
                    if ($(".device_list option").length == 0) {
                        var option = "<option value=''></option>";
                        $(".device_list").append(option);
                    }
                }
            });
            delete options_json[sn];
        } else if (flag == "insert") {
            var str = "<option value='" + status + ":" + enable + ":" + ip + ":" + name + ":" + sn + ":" + type + ":" + ast_type + "'>" + ip + "</option>";
            $(".device_list").append(str);
            options_json[sn] = { "status": status, "enable": enable, "ip": ip, "name": name, "sn": sn, "type": type, 'ast_type': ast_type };
            $(".device_list option").each(function () {
                if ($(this).val() == "") {
                    $(this).remove();
                }
            });
        }
    }
    function appendSel(status, enable, ip, name, sn, type, ast_type) {
        options += "<option value='" + status + ":" + enable + ":" + ip + ":" + name + ":" + sn + ":" + type + ":" + ast_type + "'>" + ip + "</option>";
        options_json[sn] = { "status": status, "enable": enable, "ip": ip, "name": name, "sn": sn, "type": type, 'ast_type': ast_type };
    }
    var options = "";
    var carport_arr = [];
    var carport_data = {};
    var options_json = {};
    function is_exist_carport(name) {
        var flag = false;
        for (var i = 0; i < carport_arr.length; i++) {
            if (carport_arr[i] == name) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    var num = 0;
    var complement_arr = [];
    var carport_option = [];
    function get_tree_znode(obj, flag) {
        var arr_flag = obj.name.split("#");
        var device_flag = "";
        if (arr_flag[1]) {
            device_flag = get_flag("decode", arr_flag[1]);
        }
        var arr = arr_flag[0].split("&");

        if (vzid_name != "" && arr.length == 3 && obj.sn != vzid_sn) {
            var vz_arr_flag = vzid_name.split("#");
            var vz_arr = vz_arr_flag[0].split("&");
            if (vz_arr.length == 3) {
                if (arr[0] == vz_arr[0] && arr[1] == vz_arr[1] && obj.type == vzid_type) {
                    complement_arr.push({ "ip": obj.ip_addr, "sn": obj.sn, "status": obj.connect_status, 'name': obj.name, 'ast_type': obj['ast_type'] });
                }
            }
        }
        var type = obj.type;
        var sn = obj.sn;
        var ip = obj.ip_addr;
        var name = obj.name;
        var status = obj.connect_status;
        var enable = obj.enable_group;
        var astType = obj['ast_type'];
        var main = ''
        if (astType == 1) {
            main = $.i18n.prop('main')
        }
        for (var j = 0; j < arr.length; j++) {
            if (arr[j] == "") {
                continue;
            }
            var json = {};
            json.id = Base64.decode(arr[j], true);
            json.name = Base64.decode(arr[j], true);
            json.description = Base64.decode(arr[j], true);
            if (j == 0) {
                if (!is_exist_carport(arr[j])) {
                    carport_arr.push(arr[j]);
                    carport_data[arr[j]] = {};
                    carport_data[arr[j]].input = [];
                    carport_data[arr[j]].output = [];
                    var str = '<div name="' + arr[j] + '" class="carport_con"><div class="title"><input type="text" class="carport_name" value="' + Base64.decode(arr[j], true) + '"/><span class="delete">' + $.i18n.prop("delete") + '</span></div><div class="carport_content"><div class="left_con con"><div class="passageway_con"><span>' + $.i18n.prop("entrance") + '</span><div class="tree_con"><ul class="ztree input" id="input_' + num + '"></ul></div></div><div class="add_con"><select class="device_list"></select><input type="submit" class="add" name="input" value="' + $.i18n.prop("add") + '" /></div></div><div class="right_con con"><div class="passageway_con"><span>' + $.i18n.prop("exit") + '</span><div class="tree_con"><ul class="ztree output" id="output_' + num + '"></ul></div></div><div class="add_con"><select class="device_list"></select><input type="submit" class="add" name="output" value="' + $.i18n.prop("add") + '" /></div></div></div></div>';
                    $("#carport_container").append(str);
                    $(".add").button();
                    num++;
                    var carport_json = {}
                    carport_json.value = arr[j]
                    carport_json.label = Base64.decode(arr[j], true)
                    carport_option.push(carport_json)
                    if (flag) {
                        g_carport = arr[j]
                    }
                }
                continue;
            } else if (j == 1) {
                json.pId = 0;
                json.deviceType = type;
                if (arr.length == 3) {
                    json.isParent = true;
                    json.open = true;
                    json.icon = "style/common/img/CameraGroup.png";
                } else if (arr.length == 2) {
                    json.pId = Base64.decode(arr[j - 1], true);
                    json.deviceSN = sn;
                    json.deviceIP = ip;
                    json.deviceType = type;
                    json.deviceFlag = device_flag;
                    json.deviceName = name;
                    json.deviceStatus = status;
                    json.deviceEnable = enable;
                    json.astType = astType;
                    json.description = ip + main;
                    if (status != null && status != 1 && !flag) {
                        json.icon = "style/common/img/s_offline.png";
                    } else {
                        json.icon = "style/common/img/s_online.png";
                    }
                }
            } else {
                json.pId = Base64.decode(arr[j - 1], true);
                json.deviceSN = sn;
                json.deviceIP = ip;
                json.deviceType = type;
                json.deviceFlag = device_flag;
                json.deviceName = name;
                json.deviceStatus = status;
                json.deviceEnable = enable;
                json.astType = astType;
                json.description = ip + main;
                if (status != null && status != 1 && !flag) {
                    json.icon = "style/common/img/s_offline.png";
                } else {
                    json.icon = "style/common/img/s_online.png";
                }
            }
            var flag = true;
            var nodes = carport_data[arr[0]][json.deviceType];
            for (var k = 0; k < nodes.length; k++) {
                if (JSON.stringify(nodes[k]) == JSON.stringify(json)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                nodes.push(json);
            }
        }
    }

    function get_options() {
        var option = "";
        for (var i in options_json) {
            option += "<option value='" + options_json[i].status + ":" + options_json[i].enable + ":" + options_json[i].ip + ":" + options_json[i].name + ":" + options_json[i].sn + ":" + options_json[i].type + "'>" + options_json[i].ip + "</option>";
        }
        if (option == "") {
            option = "<option value=''></option>"
        }
        return option;
    }
    var vzid_name = "";
    var vzid_sn = "";
    var vzid_ip = "";
    var vzid_type = "";
    var vzid_astType = 0;
    var g_device_data_json = "";
    var status_timer = null;
    var g_carport = "";
    var close_page = false
    function init_tree_and_tb(ajaxdata) {
        if (precheck(ajaxdata) || close_page) {
            return false;
        }
        var json_data;
        try {
            json_data = eval("(" + ajaxdata + ")");
        } catch (e) {
            return false;
        }
        if (!json_data.vzid || !json_data.group_cfg) {
            return false;
        }
        g_carport = "";
        carport_option = [{ value: '', label: $.i18n.prop('new_garage') }]
        g_device_data_json = JSON.stringify(json_data);
        var type = json_data["vzid"].type;
        vzid_name = json_data["vzid"].name;
        vzid_sn = json_data["vzid"].sn;
        vzid_ip = json_data["vzid"].ip_addr;
        vzid_type = type;
        vzid_astType = json_data["vzid"]['ast_type'];
        if (g_group_model == 1) {
            ele_change(1, 'disable_assist2')
        }
        if (vzid_astType == 1) {
            $("#main_assist").html($.i18n.prop('native_main'))
            $("#main_assist2").html($.i18n.prop('assist_camera'))
            $(".main_show").show();
            $(".assist_show").hide();
        } else if (vzid_astType == 2) {
            $("#main_assist").html($.i18n.prop('native_assist'))
            $("#main_assist2").html($.i18n.prop('main_camera'))
            $(".main_show").hide();
            $(".assist_show").show();
            $("#group_model").check_disabled(true)
            ele_change(0, 'disable_assist2')
        } else {
            $("#main_assist").html("")
            $("#main_assist2").html($.i18n.prop('assist_camera'))
            $(".main_show").show();
            $(".assist_show").hide();
        }
        var t = $.i18n.prop("unknown");
        if (type == "input") {
            t = $.i18n.prop("entrance");
        } else if (type == "output") {
            t = $.i18n.prop("exit");
        }
        $(".cur_ip").html(json_data["vzid"].ip_addr);
        $("#cur_ip").attr('name', vzid_name);
        $(".cur_type").html(t);
        device_data_json = json_data;
        if (json_data["vzid"].name == "") {
            appendSel(json_data["vzid"].connect_status, json_data["vzid"].enable_group, json_data["vzid"].ip_addr, json_data["vzid"].name, json_data["vzid"].sn, json_data["vzid"].type, json_data["vzid"]['ast_type']);
        } else {
            get_tree_znode(json_data["vzid"], 1);
        }
        var list = json_data["group_cfg"]["group_vzids"];
        for (var i = 0; i < list.length; i++) {
            if (list[i].name == "") {
                appendSel(list[i].connect_status, list[i].enable_group, list[i].ip_addr, list[i].name, list[i].sn, list[i].type, list[i]['ast_type']);
            } else {
                get_tree_znode(list[i]);
            }
        }
        for (var i in carport_data) {
            var input_tree = $("#carport_container div[name='" + i + "'] .left_con .ztree");
            var input_nodes = carport_data[i]["input"];
            $.fn.zTree.init(input_tree, setting, input_nodes);
            var output_tree = $("#carport_container div[name='" + i + "'] .right_con .ztree");
            var output_nodes = carport_data[i]["output"];
            $.fn.zTree.init(output_tree, setting, output_nodes);
        }
        if (options == "") {
            options = "<option value=''></option>";
        }
        $(".device_list").html(options);
        var str = "";
        for (var i = 0; i < complement_arr.length; i++) {
            if (vzid_astType == 2 && complement_arr[i].ast_type != 1) {
                continue
            }
            str += "<span class='device' sn='" + complement_arr[i].sn + "' ip='" + complement_arr[i].ip + "' name='" + complement_arr[i].name + "'>"
            if (complement_arr[i].status == 1) {
                str += "<span style='background:#bfedd3;'>" + complement_arr[i].ip + "</span>";
                str += "<span class='group_icon group_online'></span>"
            } else {
                str += "<span>" + complement_arr[i].ip + "</span>";
                str += "<span class='group_icon group_offline'></span>"
            }
            if (vzid_astType != 2) {
                str += "<span class='group_icon group_delete'></span>"
            }
            str += "</span>"
        }
        $(".cm_td").html('');
        if (str != "") {
            $(".cm_td").html(str);
        }
        var carport_str = ""
        for (var i = 0; i < carport_option.length; i++) {
            carport_str += "<option value='" + carport_option[i].value + "'>" + carport_option[i].label + "</option>"
        }
        $("#carport").html(carport_str);
        init_selectmenu("#carport", 200, 150);
        $("#carport").selectmenu("refresh");
        $("#carport").select_val(g_carport);
        init_selectmenu(".device_list", 200, 150);
        $(".device_list").selectmenu("refresh");
        $(".add").css("width", "100px");
        sort_carport("");
        if (!status_timer) {
            status_timer = setInterval(function () {
                if (isSave) {
                    get_connect_status();
                }
            }, 5000);
        }
        var carport_con = $(".carport_con");
        if (carport_con.length == 0) {
            $("#new_carport").click();
        }
        ele_change(g_group_switch, 'disable_group');
    }

    function get_connect_status() {
        var req = {};
        req.type = "get_group_cfg";
        $.ajax({
            type: "POST",
            url: "dgjson.php",
            data: JSON.stringify(req),
            success: function (data) {
                if (precheck(data)) return false;
                var json_data = eval("(" + data + ")");
                if (!json_data.vzid || !json_data.group_cfg) {
                    return false;
                }
                $(".ztree").each(function () {
                    var id = $(this).attr("id");
                    //var nodes = get_all_node();
                    var zTree = $.fn.zTree.getZTreeObj(id);
                    if (!zTree) {
                        return false;
                    }
                    var vzid = json_data.vzid;
                    var deviceArr = json_data.group_cfg.group_vzids;
                    if (!deviceArr) {
                        return false;
                    }
                    for (var j = 0; j < deviceArr.length; j++) {
                        var node = zTree.getNodeByParam("deviceSN", deviceArr[j].sn, null);
                        if (node) {
                            if (deviceArr[j].connect_status == 1) {
                                node.icon = "style/common/img/s_online.png";
                            } else {
                                var vzid_name = vzid.name;
                                var cur_name = deviceArr[j].name;
                                if (vzid_name == "" || cur_name == "") {
                                    node.icon = "style/common/img/s_middle.png";
                                } else {
                                    var zv_cp = vzid_name.split("&")[0];
                                    var cur_cp = cur_name.split("&")[0];
                                    if (zv_cp == cur_cp) {
                                        node.icon = "style/common/img/s_offline.png";
                                    } else {
                                        node.icon = "style/common/img/s_middle.png";
                                    }
                                }

                            }
                            zTree.updateNode(node);
                        }
                    }
                })
            },
            dataType: "text"
        });
    }
    function del_treeNode(treeNode) {
        treeNode.deviceName = "";
        updateSel("insert", treeNode.deviceStatus, treeNode.deviceEnable, treeNode.deviceIP, treeNode.deviceName, treeNode.deviceSN, treeNode.deviceType, treeNode.astType);
    }
    function get_all_node(id) {
        var zTree = $.fn.zTree.getZTreeObj(id);
        var nodeArr = [];
        var rootNodes = zTree.getNodes();
        for (var i = 0; i < rootNodes.length; i++) {
            get_all_child(rootNodes[i], nodeArr);
        }
        return nodeArr;
    }
    function get_all_child(node, arr) {
        if (node.isParent) {
            var childNodes = node.children;
            if (childNodes) {
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].isParent) {
                        arr = get_all_child(childNodes[i], arr);
                    } else {
                        arr.push(childNodes[i]);
                    }
                }
            }
        } else {
            arr.push(node);
        }
        return arr;
    }
    function get_all_node_data(id, arr, vzid_json) {
        var zTree = $.fn.zTree.getZTreeObj(id);
        var rootNodes = zTree.getNodes();
        for (var i = 0; i < rootNodes.length; i++) {
            get_all_child_data(rootNodes[i], arr, vzid_json);
        }
    }
    function get_all_child_data(node, arr, vzid_json) {
        if (node.isParent) {
            var childNodes = node.children;
            if (childNodes) {
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].isParent) {
                        get_all_child_data(childNodes[i], arr, vzid_json);
                    } else {
                        if (childNodes[i].deviceSN != device_data_json["vzid"].sn) {
                            var json = {};
                            json.connect_status = parseInt(childNodes[i].deviceStatus);
                            json.enable_group = eval(childNodes[i].deviceEnable);
                            json.ip_addr = childNodes[i].deviceIP;
                            json.name = childNodes[i].deviceName;
                            json.sn = childNodes[i].deviceSN;
                            json.type = childNodes[i].deviceType;
                            json.ast_type = childNodes[i].astType;
                            arr.push(json);
                        } else {
                            vzid_json.enable_group = eval(childNodes[i].deviceEnable);
                            vzid_json.ip_addr = childNodes[i].deviceIP;
                            vzid_json.name = childNodes[i].deviceName;
                            vzid_json.sn = childNodes[i].deviceSN;
                            vzid_json.type = childNodes[i].deviceType;
                            vzid_json.ast_type = childNodes[i].astType;
                        }
                    }
                }
            }
        } else {
            if (node.deviceSN != device_data_json["vzid"].sn) {
                var json = {};
                json.connect_status = parseInt(node.deviceStatus);
                json.enable_group = eval(node.deviceEnable);
                json.ip_addr = node.deviceIP;
                json.name = node.deviceName;
                json.sn = node.deviceSN;
                json.type = node.deviceType;
                json.ast_type = node.astType;
                arr.push(json);
            } else {
                vzid_json.enable_group = eval(node.deviceEnable);
                vzid_json.ip_addr = node.deviceIP;
                vzid_json.name = node.deviceName;
                vzid_json.sn = node.deviceSN;
                vzid_json.type = node.deviceType;
                vzid_json.ast_type = node.astType;
            }
        }
    }

    function set_device_info() {
        if (isSave) {
            return;
        }
        isSave = true;
        var req = {};
        req.type = "set_group_cfg";
        req.state = 200;
        req.group_cfg = {};
        req.vzid = {};
        var data_arr = [];
        $(".carport_con").each(function () {
            var input_id = $(this).find(".left_con").find(".ztree").attr("id");
            var output_id = $(this).find(".right_con").find(".ztree").attr("id");
            get_all_node_data(input_id, data_arr, req.vzid);
            get_all_node_data(output_id, data_arr, req.vzid);
        });
        for (var i in options_json) {
            if (options_json[i].sn != device_data_json["vzid"].sn) {
                var json = {};
                json.connect_status = parseInt(options_json[i].status);
                json.enable_group = eval(options_json[i].enable);
                json.ip_addr = options_json[i].ip;
                json.name = options_json[i].name;
                json.sn = options_json[i].sn;
                json.type = options_json[i].type;
                json.ast_type = 0;
                data_arr.push(json);
            } else {
                req.vzid.enable_group = eval(options_json[i].enable);
                req.vzid.ip_addr = options_json[i].ip;
                req.vzid.name = options_json[i].name;
                req.vzid.sn = options_json[i].sn;
                req.vzid.type = options_json[i].type;
                req.vzid.ast_type = 0;
            }
        }
        req.group_cfg.group_vzids = data_arr;
        jsonstr = JSON.stringify(req);
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                $("#carport_container").empty();
                reget_data();
            }
        });
    }
    function rename_and_delete(that, flag) {
        var val = Base64.encode(that.val(), true);
        var deleteOption = "";
        var inputID = that.parents(".carport_con").find(".left_con").find(".ztree").attr("id");
        var inputNodes = get_all_node(inputID);
        for (var i = 0; i < inputNodes.length; i++) {
            if (inputNodes[i].isParent) {
                continue;
            } else {
                if (flag == "rename") {
                    inputNodes[i].deviceName = get_name(inputNodes[i], inputNodes[i].deviceFlag, val);
                } else if (flag == "delete") {
                    inputNodes[i].deviceName = "";
                    updateSel("insert", inputNodes[i].deviceStatus, inputNodes[i].deviceEnable, inputNodes[i].deviceIP, inputNodes[i].deviceName, inputNodes[i].deviceSN, inputNodes[i].deviceType, inputNodes[i].astType);
                }
            }
        }
        var outputID = that.parents(".carport_con").find(".right_con").find(".ztree").attr("id");
        var outputNodes = get_all_node(outputID);
        for (var i = 0; i < outputNodes.length; i++) {
            if (outputNodes[i].isParent) {
                continue;
            } else {
                if (flag == "rename") {
                    outputNodes[i].deviceName = get_name(outputNodes[i], outputNodes[i].deviceFlag, val);
                } else if (flag == "delete") {
                    outputNodes[i].deviceName = "";
                    updateSel("insert", outputNodes[i].deviceStatus, outputNodes[i].deviceEnable, outputNodes[i].deviceIP, outputNodes[i].deviceName, outputNodes[i].deviceSN, outputNodes[i].deviceType, outputNodes[i].astType);
                }
            }
        }
        if (flag == "delete" && deleteOption != "") {
            $(".device_list").append(deleteOption);
            $(".device_list").selectmenu("refresh");
        }
    }
    function sort_carport(name) {
        var name_arr = [];
        var index = 0;
        $(".carport_con").each(function () {
            var name = $(this).attr("name");
            name_arr.push(Base64.decode(name, true));
        });
        name_arr.sort(function (strA, strB) {
            return strA.localeCompare(strB);
        });
        for (var i = 0; i < name_arr.length; i++) {
            if (name == name_arr[i]) {
                index = i;
            }
            $("#carport_container").append($(".carport_con[name='" + Base64.encode(name_arr[i], true) + "']"));
        }
        return index;
    }
    var g_mode = 0;
    function get_ast_mode() {
        var req = {};
        req.type = "get_ast_mode";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                g_mode = json_data.mode;
                if (g_mode == "faster") {
                    $("#fast_mode").check_val(true)
                } else if (g_mode == "aggregated") {
                    $("#delay_mode").check_val(true)
                } else if (g_mode == "direct") {
                    $("#more_mode").check_val(true)
                }
            }
        });
    }

    function set_ast_mode() {
        var mode = '';
        if ($("#fast_mode").check_val()) {
            mode = "faster"
        } else if ($("#delay_mode").check_val()) {
            mode = "aggregated"
        } else if ($("#more_mode").check_val()) {
            mode = "direct"
        }
        if (g_mode == mode) {
            return;
        }
        var req = {};
        req.type = "set_ast_mode";
        req.mode = mode;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_ast_mode();
            }
        });

    }
    var g_dealy_time = 0;
    function get_ast_dealy_time() {
        var req = {};
        req.type = "get_ast_dealy_time";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                g_dealy_time = json_data.dealy_time;
                $("#delay_txt").val(json_data.dealy_time);
            }
        });
    }

    function set_ast_dealy_time() {
        var delay_txt = parseInt($("#delay_txt").val());
        if (g_dealy_time == delay_txt) {
            return false;
        }
        var req = {};
        req.type = "set_ast_dealy_time";
        req.dealy_time = delay_txt;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_ast_dealy_time();
            }
        });
    }
    var g_match_mode = 0;
    function get_device_match_mode() {
        var req = {};
        req.type = "get_device_match_mode";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                g_match_mode = json_data.mode;
                if (json_data.mode == "fuzzy_mode") {
                    $("#fuzzy_check").check_val(true);
                } else {
                    $("#exact_check").check_val(true);
                }
            }
        });
    }

    function set_device_match_mode() {
        var match_mode = $("#exact_check").is(":checked") ? "exact_mode" : "fuzzy_mode";
        if (g_match_mode == match_mode) {
            return false;
        }
        var req = {};
        req.type = "set_device_match_mode";
        req.mode = match_mode;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_device_match_mode();
            }
        });
    }

    function set_show(ajaxdata) {
        var json_data = eval("(" + ajaxdata + ")");
        if (json_data.state == 200) {
            show_informer();
        } else {
            show_informer_text($.i18n.prop("save_failed"));
        }
    }
    var g_platefilter;
    this.get_group_shared_io = function () {
        var req = {};
        req.type = "get_group_shared_io";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                var decode = json_data.value;
                g_platefilter = decode;
                var mask = 0x1;

                var out1 = decode & mask;
                var out2 = decode & (mask << 1);
                var out3 = decode & (mask << 2);
                var out4 = decode & (mask << 3);
                var out5 = decode & (mask << 4);
                var out6 = decode & (mask << 5);
                var in1 = decode & (mask << 16);
                var in2 = decode & (mask << 17);
                var in3 = decode & (mask << 18);
                var in4 = decode & (mask << 19);

                $("#out1").check_val(out1 > 0);
                $("#out2").check_val(out2 > 0);
                $("#out3").check_val(out3 > 0);
                $("#out4").check_val(out4 > 0);
                $("#out5").check_val(out5 > 0);
                $("#out6").check_val(out6 > 0);
                $("#in1").check_val(in1 > 0);
                $("#in2").check_val(in2 > 0);
                $("#in3").check_val(in3 > 0);
                $("#in4").check_val(in4 > 0);
            }
        });
    }
    function set_group_shared_io() {
        var req = {};
        req.type = "set_group_shared_io";
        var out1 = $("#out1").check_val() ? "1" : "0";
        var out2 = $("#out2").check_val() ? "1" : "0";
        var out3 = $("#out3").check_val() ? "1" : "0";
        var out4 = $("#out4").check_val() ? "1" : "0";
        var out5 = $("#out5").check_val() ? "1" : "0";
        var out6 = $("#out6").check_val() ? "1" : "0";
        var in1 = $("#in1").check_val() ? "1" : "0";
        var in2 = $("#in2").check_val() ? "1" : "0";
        var in3 = $("#in3").check_val() ? "1" : "0";
        var in4 = $("#in4").check_val() ? "1" : "0";

        var platefilter = parseInt(out1) | (parseInt(out2) << 1) | (parseInt(out3) << 2) | (parseInt(out4) << 3) | (parseInt(out5) << 4) | (parseInt(out6) << 5) | (parseInt(in1) << 16) | (parseInt(in2) << 17) | (parseInt(in3) << 18) | (parseInt(in4) << 20);
        req.value = platefilter;
        if (g_platefilter == platefilter) {
            return false;
        }
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                DeviceGroup.get_group_shared_io();
            }
        });
    }
    function get_boardversion_info(d_type, m_version, s_version) {
        get_device_capacity();
    }
    var g_total_parking = 0;
    function get_total_parking() {
        var req = {};
        req.type = "get_total_parking";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                g_total_parking = json_data.total_parking;
                $("#total_parking").val(json_data.total_parking);
            }
        });
    }
    function reget_data() {
        show_loading('数据同步中...');
        var reget_timer = setTimeout(function () {
            options = "";
            options_json = {};
            carport_arr.splice(0, carport_arr.length);
            complement_arr.splice(0, complement_arr.length);
            var req = {};
            req.type = "get_group_cfg";
            dg_json_ajax(req, init_tree_and_tb);
            hide_loading();
            clearTimeout(reget_timer);
        }, 5000)
    }
    function set_device_info_new() {
        var new_device_data_json = JSON.stringify(device_data_json);
        if (!new_device_data_json.localeCompare(g_device_data_json)) {
            return;
        }
        var req = device_data_json;
        req.type = "set_group_cfg";
        jsonstr = JSON.stringify(req);
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                $("#carport_container").empty();
                reget_data();
            }
        });
    }
    var g_group_model = 0;
    function get_group_model(callback) {
        var req = {};
        req.type = "get_group_model";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                var enable = json_data.enable;
                g_group_model = enable;
                $("#group_model").check_val(enable == 1);
                ele_change(enable, 'disable_assist');
                ele_change(vzid_astType, 'disable_assist2')
                if (callback) {
                    callback()
                }
            }
        });
    }
    function set_group_model() {
        var enable = $("#group_model").check_val() ? 1 : 0;
        if (g_group_model == enable) {
            return;
        }
        var req = {};
        req.type = "set_group_model";
        req.enable = enable;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_group_model();
            }
        });
    }
    var g_group_switch = 0;
    function get_group_switch(callback) {
        var req = {};
        req.type = "get_group_switch";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                var enable = json_data.enable;
                g_group_switch = enable;
                $("#group_switch").check_val(enable == 1);
                if (callback) {
                    callback();
                }
            }
        });
    }
    function set_group_switch() {
        var enable = $("#group_switch").check_val() ? 1 : 0;
        if (g_group_switch == enable) {
            return;
        }
        if (!confirm($.i18n.prop('group_switch_hint'))) {
            enable = g_group_switch
            $("#group_switch").check_val(enable == 1);
            return;
        }
        ele_change(enable, 'disable_group');
        var req = {};
        req.type = "set_group_switch";
        req.enable = enable;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer($.i18n.prop('restart_wait_hint'), 30000);
            }
        });
    }
    function add_click() {
        var val = $(this).siblings("select").select_val();
        if (!val) {
            return;
        }
        var arr = val.split(":");
        var status = arr[0];
        var enable = arr[1];
        var ip = arr[2];
        var name = arr[3];
        var sn = arr[4];
        var type = arr[5];
        var t = $(this).attr("name");
        var rootname = $(this).parents(".carport_con").attr("name");
        if (type != t) {
            var hintText = get_hintText(type, t);
            var con = confirm(hintText);
            if (!con) {
                return;
            }
        }
        //update_device_type(sn, "type", t);
        var ztree_id = $(this).parents(".con").find(".ztree").attr("id");
        var new_node = add_new_node(ztree_id, sn, ip, t, name, status, enable);
        new_node.deviceName = get_name(new_node, "", rootname);
        updateSel("delete", status, enable, ip, name, sn, type);
        $(".device_list").selectmenu("refresh");
        isSave = false;
    }
    function carport_name_change() {
        var val = $(this).val();
        var oldname = $(this).parents(".carport_con").attr("name");
        if (val.length == 0) {
            show_informer_text($.i18n.prop("name_empty_hint"));
            $(this).val(Base64.decode(oldname, true));
            return false;
        }
        if (val.length > 16) {
            show_informer_text($.i18n.prop("name_length_hint") + "16");
            $(this).val(Base64.decode(oldname, true));
            return false;
        }
        var isSame = false;
        $(this).parents(".carport_con").siblings(".carport_con").find(".carport_name").each(function () {
            if ($(this).val() == val) {
                isSame = true;
                return false;
            }
        });
        if (isSame) {
            show_informer_text($.i18n.prop("same_name_hint"));
            $(this).val(Base64.decode(oldname, true));
            return false;
        }
        $(this).parents(".carport_con").attr("name", Base64.encode(val, true));
        rename_and_delete($(this), "rename");
        isSave = false;
    }
    function new_carport_click() {
        var num = $("#carport_container .carport_con").length;
        if (num == 10) {
            show_informer_text($.i18n.prop("carport_length_hint") + "10");
            return;
        }
        var name = get_nosamename($.i18n.prop("garage"), "", 1);
        var input_id = get_nosamename("input_", "", 2);
        var output_id = get_nosamename("output_", "", 2);
        var str = '<div name="' + Base64.encode(name, true) + '" class="carport_con"><div class="title"><input type="text" class="carport_name" value="' + name + '"/><span class="delete">' + $.i18n.prop("delete") + '</span></div><div class="carport_content"><div class="left_con con"><div class="passageway_con"><span>' + $.i18n.prop("entrance") + '</span><div class="tree_con"><ul class="ztree input" id="' + input_id + '"></ul></div></div><div class="add_con"><select class="device_list"></select><input type="submit" class="add" name="input" value="' + $.i18n.prop("add") + '" /></div></div><div class="right_con con"><div class="passageway_con"><span>' + $.i18n.prop("exit") + '</span><div class="tree_con"><ul class="ztree output" id="' + output_id + '"></ul></div></div><div class="add_con"><select class="device_list"></select><input type="submit" class="add" name="output" value="' + $.i18n.prop("add") + '" /></div></div></div></div>';
        $("#carport_container").append(str);
        $(".add").button().css("width", "100px");
        var op = get_options();
        $(".device_list").html(op);
        init_selectmenu(".device_list", 200, 150);
        $.fn.zTree.init($("#" + input_id), setting, []);
        $.fn.zTree.init($("#" + output_id), setting, []);
        var allheight = $("#carport_container").get(0).scrollHeight;
        var height = $("#carport_container").height();
        $("#carport_container").scrollTop(allheight - height);
    }
    function dg_submit() {
        if (vzid_astType != 2) {
            var delay_txt = parseInt($("#delay_txt").val());
            if (isNaN(delay_txt) || delay_txt < 100 || delay_txt > 5000) {
                show_informer_text($.i18n.prop("delay_txt_hint") + "100~5000");
                return false;
            }
            set_group(function () {
                set_ast_mode();
                set_ast_dealy_time();
                set_device_match_mode();
                set_group_shared_io();
                set_group_model();
            });
            // set_device_info_new();
        } else {
            set_group_model();
        }

    }
    function get_talk_para() {
        var cfg = {};
        cfg.type = "ps_get_voice_config";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                var gpio_port = jsondata.talk_io;
                if (gpio_port == 1) {
                    $("#in1").check_disabled(true);
                } else if (gpio_port == 2) {
                    $("#in2").check_disabled(true);
                } else if (gpio_port == 4) {
                    $("#in3").check_disabled(true);
                } else if (gpio_port == 8) {
                    $("#in4").check_disabled(true);
                }
            }
        });
    }
    function init_para() {
        close_page = false
        cur_drag_parent = null;
        cur_drag_id = null;
        sel_sn_list = [];
        device_data_json = null;
        isSave = true;
        options = "";
        carport_arr = [];
        carport_data = {};
        options_json = {};
        num = 0;
        complement_arr = [];
        carport_option = [];
        g_carport = "";
        vzid_name = "";
        vzid_sn = "";
        vzid_ip = "";
        vzid_type = "";
        g_device_data_json = "";
        status_timer;
        $(document).off("click", ".add");
        $(document).off("change", ".carport_name");
        $(document).off("click", ".delete");
        $(document).off("click", ".group_delete");
    }
    function getUuid() {
        return new Date().getTime() + ''
    }
    function get_vz_name(garage_name, assist_name, device_flag) {
        var name = $("#cur_ip").attr('name');
        var arr_flag = name.split("#");
        var first_name = arr_flag[0].split("&");
        var carport = $("#carport").select_val();
        var vz_name = "";
        if (carport == "") {
            vz_name = Base64.encode(garage_name, true) + "&" + Base64.encode(assist_name, true) + "&" + Base64.encode($("#cur_ip").html(), true) + "#" + device_flag;
        } else {
            if (first_name.length != 3) {
                vz_name = carport + "&" + Base64.encode(assist_name, true) + "&" + Base64.encode($("#cur_ip").html(), true) + "#" + device_flag;
            } else {
                vz_name = carport + "&" + first_name[1] + "&" + Base64.encode($("#cur_ip").html(), true) + "#" + device_flag;
            }
        }
        return vz_name
    }
    function get_assist_name(ip, garage_name, assist_name, device_flag) {
        var name = $("#cur_ip").attr('name');
        var arr_flag = name.split("#");
        var first_name = arr_flag[0].split("&");
        var carport = $("#carport").select_val();
        var new_name = "";
        if (carport == "") {
            new_name = Base64.encode(garage_name, true) + "&" + Base64.encode(assist_name, true) + "&" + Base64.encode(ip, true) + "#" + device_flag;
        } else {
            if (first_name.length != 3) {
                new_name = carport + "&" + Base64.encode(assist_name, true) + "&" + Base64.encode(ip, true) + "#" + device_flag;
            } else {
                new_name = carport + "&" + first_name[1] + "&" + Base64.encode(ip, true) + "#" + device_flag;
            }
        }
        return new_name
    }
    function group_add() {
        var devices = $(".cm_td .device");
        if (devices.length >= 3) {
            show_informer_text($.i18n.prop("assist_camera_length") + "3")
            return
        }
        var device = $("#device_list").select_val();
        if (device == '' || !device) {
            return
        }
        var device_arr = device.split(":");
        var status = device_arr[0];
        var enable = device_arr[1];
        var ip = device_arr[2];
        var name = device_arr[3];
        var sn = device_arr[4];
        var type = device_arr[5];
        if (ip == '') {
            return
        }
        if (ip == $("#cur_ip").html()) {
            show_informer_text($.i18n.prop("cannot_add_native"))
            return
        }
        var str = '';
        str += "<span class='device' status='" + status + "' enable='" + enable + "' ip='" + ip + "' type='" + type + "' sn='" + sn + "'>"
        str += "<span>" + ip + "</span>";
        str += "<span class='group_icon group_offline'></span>"
        str += "<span class='group_icon group_delete'></span>"
        str += "</span>"
        $(".cm_td").append(str);
        updateSel("delete", status, enable, ip, name, sn, type);
        $(".device_list").selectmenu("refresh");
    }
    function group_delete() {
        var device = $(this).parents('.device');
        var status = device.attr('status');
        var enable = device.attr('enable');
        var ip = device.attr('ip');
        var name = '';
        var sn = device.attr('sn');
        var type = device.attr('type');
        updateSel("insert", status, enable, ip, name, sn, type);
        $(".device_list").selectmenu("refresh");
        device.remove();
        var data = JSON.parse(g_device_data_json)
        var list = data["group_cfg"]["group_vzids"];
        for (var i = 0; i < list.length; i++) {
            if (list[i].sn == sn) {
                list[i].name = ''
                list[i].ast_type = 0
                break
            }
        }
        g_device_data_json = JSON.stringify(data)
    }
    function set_group(callback) {
        var data = JSON.parse(g_device_data_json);
        var garage_name = get_nosamename($.i18n.prop("garage"), "", 1);
        var assist_name = $.i18n.prop("assist") + Math.ceil(Math.random() * 100);
        var device_flag = Base64.encode(getUuid());
        data['vzid'].name = get_vz_name(garage_name, assist_name, device_flag);
        data['vzid'].ast_type = 1;
        var type = data['vzid'].type;
        var list = data["group_cfg"]["group_vzids"];
        $(".cm_td .device").each(function () {
            var sn = $(this).attr('sn');
            var ip = $(this).attr('ip');
            var name = get_assist_name(ip, garage_name, assist_name, device_flag)
            for (var i = 0; i < list.length; i++) {
                if (list[i].sn == sn) {
                    list[i].name = name
                    list[i].ast_type = 2
                    list[i].type = type
                    break
                }
            }
        })
        var assists = $(".cm_td .device")
        if (assists.length == 0) {
            data['vzid'].name = "";
            data['vzid'].ast_type = 0;
        }
        data.type = "set_group_cfg";
        dg_json_ajax(data, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                $("#carport_container").empty();
                reget_data();
                if (callback) {
                    callback()
                }
            }
        });
    }
    function unbind_group() {
        if (confirm($.i18n.prop('remove_device_hint'))) {
            var data = JSON.parse(g_device_data_json);
            data['vzid'].name = "";
            data['vzid'].ast_type = 0;
            data.type = "set_group_cfg";
            dg_json_ajax(data, function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    show_informer()
                    reget_data()
                }
            });
        }
    }
    this.init = function () {
        if (!is_C3) {
            $("#group_li").remove()
            $("#group").remove()
        }
        get_talk_para();
        init_para();
        create_tabs("#group_tabs");
        $("#set_device_info").click(set_device_info);
        $(document).on("click", ".add", add_click);
        $(document).on("change", ".carport_name", carport_name_change);
        $(document).on("click", ".delete", function () {
            isSave = false;
            rename_and_delete($(this), "delete");
            $(this).parents(".carport_con").remove();
        });
        $(document).on("click", ".group_delete", group_delete);
        $("#new_carport").click(new_carport_click);
        init_selectmenu("#output_result", 200, 150);
        init_selectmenu(".device_list", 200, 150);
        init_selectmenu("#carport", 200, 150);

        // $("#group_model").change(function () {
        //   var enable = $(this).check_val() ? 1 : 0;
        //   var ast = 1;
        //   if (vzid_astType == 2) {
        //     ast = 0;
        //   }
        //   if (enable == 1) {
        //     ele_change(enable, 'disable_assist');
        //     ele_change(ast, 'disable_assist2');
        //   } else {
        //     ele_change(enable, 'disable_assist');
        //   }
        // })
        $("#group_switch").change(function () {
            var enable = $(this).check_val();
            set_group_switch();
        })
        $("#skip").click(function () {
            var ip = $(".device").attr('ip');
            window.open('http://' + ip)
        })
        $(".group_add").click(group_add)
        $("#dg_submit").click(dg_submit);
        $(".unbind").click(unbind_group)
        get_boardversion_info(g_d_type, g_m_version, g_s_version);
        get_ast_mode();
        get_ast_dealy_time();
        get_device_match_mode();
        DeviceGroup.get_group_shared_io();
        get_total_parking();
        get_group_model(function () {
            get_group_switch(function () {
                var req = {};
                req.type = "get_group_cfg";
                dg_json_ajax(req, init_tree_and_tb);
            });
        });
    }
    this.close = function () {
        close_page = true
        for (var i in carport_data) {
            var input_tree = $("#carport_container div[name='" + i + "'] .left_con .ztree");
            $.fn.zTree.destroy(input_tree);
            var output_tree = $("#carport_container div[name='" + i + "'] .right_con .ztree");
            $.fn.zTree.destroy(output_tree);
        }
        clearInterval(status_timer);
        status_timer = null;
    }
    close_json["DeviceGroup"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//DeviceBind
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var DeviceBind = new function () {
    function get_devices(ajaxdata) {
        if (precheck(ajaxdata)) {
            return false;
        }
        var json = ajaxdata
        if (json.state == 200 || json.state_code == 200) {
            var devices = json.body;
            var str = "";
            for (var i = 0; i < devices.length; i++) {
                var online = devices[i].online === 1 ? '在线' : '离线'
                str += '<tr><td>' + devices[i].dev_name + '</td><td>' + devices[i].sn + '</td><td>' + online + '</td><td>' + devices[i].device_type + '</td><td>' + devices[i].ip + '</td><td><a class="remove_device">解除绑定</a></td></tr>';
            }
            if ($("#table_devices tr").length > 1) {
                $("#table_devices tr:gt(0)").remove();
            }
            $("#table_devices").append(str);


            //for appearance
            var tablelen = $("#table_devices tr").length;
            if (tablelen < 4) {
                for (var i = 0; i < 4 - tablelen; i++) {
                    var tr = '<tr><td> &nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>';
                    $("#table_devices").append(tr);
                }
            }
            $("#table_devices td").attr("align", "center");
            $(".remove_device").click(function () {
                if (confirm($.i18n.prop("remove_device_hint"))) {
                    var dev_name = $(this).parent("td").siblings(":eq(0)").html()
                    var sn = $(this).parent("td").siblings(":eq(1)").html()
                    var device_type = $(this).parent("td").siblings(":eq(3)").html()
                    var ip = $(this).parent("td").siblings(":eq(4)").html()
                    var obj = {
                        dev_name: dev_name,
                        sn: sn,
                        device_type: device_type,
                        ip: ip
                    }
                    remove_device(obj)
                }
            });
        }
    }
    function remove_device(obj) {
        var cfg = {};
        cfg.type = "del_bind_mate";
        cfg.module = "PM_WEB_REQUEST";
        cfg.body = obj
        post(cfg, function (jsondata) {
            show_informer_text($.i18n.prop("success"));
            get_device()
        })
    }
    function on_submit() {
        var checkDom = $('input[name="device_radio_group"]:checked');
        if (!checkDom.val()) {
            show_informer_text($.i18n.prop("device_bind_hint"));
            return
        }
        var dev_name = $(checkDom).parent("td").siblings(":eq(0)").html()
        var sn = $(checkDom).parent("td").siblings(":eq(1)").html()
        var device_type = $(checkDom).parent("td").siblings(":eq(2)").html()
        var ip = $(checkDom).parent("td").siblings(":eq(3)").html()
        var obj = {
            dev_name: dev_name,
            sn: sn,
            device_type: device_type,
            ip: ip
        }
        var cfg = {};
        cfg.type = "set_bind_mate";
        cfg.module = "PM_WEB_REQUEST";
        cfg.body = obj
        post(cfg, function (jsondata) {
            show_informer();
            get_device()
            $("#device_bind_dialog").hide()
        })
    }
    function add_device() {
        find_device()
        $("#device_bind_dialog").show();
    }
    function get_device() {
        var cfg = {};
        cfg.type = "get_all_mate";
        cfg.module = "PM_WEB_REQUEST";
        post(cfg, function (jsondata) {
            get_devices(jsondata)
        })
    }
    function find_device() {
        $('#find_device').html('查找中')
        var cfg = {};
        cfg.type = "search_all_mate";
        cfg.module = "PM_WEB_REQUEST";
        post(cfg, function (jsondata) {
            $('#find_device').html('查找设备')
            var str = ''
            var devices = jsondata.body || []
            var inputStr = ''
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].bindinfo) {
                    inputStr = '<input type="radio" class="device_radio" name="device_radio_group" title="已绑定" disabled/>'
                    str += '<tr style="background:#ddd"><td>' + inputStr + '</td><td>' + devices[i].dev_name + '</td><td>' + devices[i].sn + '</td><td>' + devices[i].device_type + '</td><td>' + devices[i].ip + '</td></tr>';
                } else {
                    inputStr = '<input type="radio" class="device_radio" name="device_radio_group"/>'
                    str += '<tr><td>' + inputStr + '</td><td>' + devices[i].dev_name + '</td><td>' + devices[i].sn + '</td><td>' + devices[i].device_type + '</td><td>' + devices[i].ip + '</td></tr>';
                }
            }
            if ($("#find_device_table tr").length > 1) {
                $("#find_device_table tr:gt(0)").remove();
            }
            $("#find_device_table").append(str);
            $("#find_device_table td").attr("align", "center");
        })
    }
    this.init = function () {
        $("#device_submit").click(on_submit);
        $("#device_add").click(add_device);
        $(".find_device").click(find_device);
        $("#device_cancel").click(function () {
            $("#device_bind_dialog").hide();
        });
        get_device();
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//LiveVideo
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var LiveVideo = new function () {
    this.init = function () {
        init_activex_new("#live", 0, 1, function () {
            for (var i = 0; i < g_channelnum; i++) {
                activex_play_new(i, 0);
            }
        });
    }
    this.close = function () {
        stop_video();
    }
    close_json["LiveVideo"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetPlateGateWay
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var SetPlateGateWay = new function () {
    var g_gatewaytype;
    function get_dg_gateway() {
        var req = {
            "type": "get_cdvzid"
        }
        $.ajax({
            type: "POST",
            url: "dgjson.php",
            data: JSON.stringify(req),
            success: function (data) {
                if (precheck(data)) {
                    return false;
                }
                var json_data = JSON.parse(data);
                if (json_data["state"] != 200) {
                    return false;
                }
                $("#dggateway").select_val(json_data["vzid"]["type"]);
            },
            dataType: "text"
        })
    }

    function set_dg_gateway() {
        var gatewaytype = $("#dggateway").val();
        var req = {
            "type": "enable_devicegroup",
            "vzid": {
                "type": "output"
            }
        }
        req["vzid"]["type"] = gatewaytype;
        $.ajax({
            type: "POST",
            url: "dgjson.php",
            data: JSON.stringify(req),
            success: function (data) {
                if (precheck(data)) {
                    return false;
                }
                var json_data = JSON.parse(data);
                if (json_data["state"] == 200) {
                    show_informer();
                }
            },
            dataType: "text"
        })
    }
    this.init = function () {
        init_selectmenu("#dggateway", 110, 150);
        $("#submit").click(set_dg_gateway);
        get_dg_gateway();
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetPlateAudio
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var SetPlateAudio = new function () {
    var g_broadcast_out = null;
    function get_oem01_broadcast_out() {
        $.get("vb.htm?getoem01audioout",
            function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                var decode = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                decode = decode.split(":");
                g_broadcast_out = decode;

                $("#check_broadcastip").check_val(decode[0] == 1);
                $("#entrancebroadcasthead").select_val(decode[1]);
                $("#exitbroadcasthead").select_val(decode[2]);
                $("#check_broadcast_plateid").check_val(decode[3] == 1);
                $("#check_broadcast_daysremain").check_val(decode[4] == 1);
            });
    }

    function set_oem01_broadcast_out() {
        var broadcast_out = Array();
        broadcast_out[0] = $("#check_broadcastip").check_val() ? 1 : 0;
        broadcast_out[1] = $("#entrancebroadcasthead").select_val();
        broadcast_out[2] = $("#exitbroadcasthead").select_val();
        broadcast_out[3] = $("#check_broadcast_plateid").check_val() ? 1 : 0;
        broadcast_out[4] = $("#check_broadcast_daysremain").check_val() ? 1 : 0;

        var changed = false;
        for (var i = 0; i < 5; i++) {
            if (g_broadcast_out == null || broadcast_out[i] != g_broadcast_out[i]) {
                changed = true;
                break;
            }
        }
        if (!changed) return;

        var data = broadcast_out[0];
        for (var i = 1; i < 5; i++) {
            data += ":";
            data += broadcast_out[i];
        }
        data = Base64.encode(data);

        $.get("vb.htm?oem01audioout=" + data, function (ajaxdata) {
            default_ajax_handler(ajaxdata);
            get_oem01_broadcast_out();
        });
    }

    var g_broadcast_volume;
    function get_oem01_broadcast_volume() {
        $.get("vb.htm?getoem01audiovolume",
            function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                var decode = ajaxdata.slice(ajaxdata.indexOf("=") + 1, ajaxdata.length - 1);
                g_broadcast_volume = decode;
                decode = decode.split(":");

                $("#check_time_period1_volume").check_val(decode[0] == 1);
                $("#starthour1").select_val(decode[1]);
                $("#startmin1").select_val(decode[2]);
                $("#endhour1").select_val(decode[3]);
                $("#endmin1").select_val(decode[4]);
                $("#time_period1_volume_slider").slider("value", decode[5]);
                $("#check_time_period2_volume").check_val(decode[6] == 1);
                $("#starthour2").select_val(decode[7]);
                $("#startmin2").select_val(decode[8]);
                $("#endhour2").select_val(decode[9]);
                $("#endmin2").select_val(decode[10]);
                $("#time_period2_volume_slider").slider("value", decode[11]);
                $("#other_volume_slider").slider("value", decode[12]);
            });
    }

    function set_oem01_broadcast_volume() {
        var broadcast_volume = Array();
        broadcast_volume[0] = $("#check_time_period1_volume").check_val() ? 1 : 0;
        broadcast_volume[1] = $("#starthour1").select_val();
        broadcast_volume[2] = $("#startmin1").select_val();
        broadcast_volume[3] = $("#endhour1").select_val();
        broadcast_volume[4] = $("#endmin1").select_val();
        broadcast_volume[5] = $("#time_period1_volume_slider").slider("value");
        broadcast_volume[6] = $("#check_time_period2_volume").check_val() ? 1 : 0;
        broadcast_volume[7] = $("#starthour2").select_val();
        broadcast_volume[8] = $("#startmin2").select_val();
        broadcast_volume[9] = $("#endhour2").select_val();
        broadcast_volume[10] = $("#endmin2").select_val();
        broadcast_volume[11] = $("#time_period2_volume_slider").slider("value");
        broadcast_volume[12] = $("#other_volume_slider").slider("value");

        var data = broadcast_volume[0];
        for (var i = 1; i < 13; i++) {
            data += ":";
            data += broadcast_volume[i];
        }
        if (data == g_broadcast_volume) return;
        data = Base64.encode(data);

        $.get("vb.htm?oem01audiovolume=" + data, function (ajaxdata) {
            default_ajax_handler(ajaxdata);
            get_oem01_broadcast_volume();
        });
    }

    function get_broadcast_out_temporary() {
        var cfg = {};
        cfg.protocol_type = "get_charge_voice_config_request";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    $("#entrancebroadcasthead_temporary").select_val(jsondata.entry_head_flag);
                    $("#exitbroadcasthead_temporary").select_val(jsondata.out_head_flag);
                    $("#check_broadcast_plateid_temporary").check_val(jsondata.plate_and_time_flag == 1);
                }
            },
            dataType: "text"
        });
    }

    function submit_broadcast_out_temporary() {
        var cfg = {};
        cfg.protocol_type = "set_charge_voice_config_request";
        cfg.response_state = 200;
        cfg.entry_head_flag = parseInt($("#entrancebroadcasthead_temporary").select_val());
        cfg.out_head_flag = parseInt($("#exitbroadcasthead_temporary").select_val());
        cfg.plate_and_time_flag = $("#check_broadcast_plateid_temporary").check_val() ? 1 : 0;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    show_informer();
                    get_broadcast_out_temporary();
                }
            },
            dataType: "text"
        });
    }

    function init_slider(name) {
        max = 7;
        mid = 3
        var slider_name = "#" + name + "_slider";
        var text_name = "#" + name + "_text";
        $(slider_name).slider({
            range: "min",
            value: mid,
            min: 0,
            max: max,
            change: function (event, ui) {
                $(text_name).html(ui.value);
            },
            slide: function (event, ui) {
                $(text_name).html(ui.value);
            },
            stop: function (event, ui) {
            }
        });
        $(text_name).html($(slider_name).slider("value"));
    }
    this.init = function () {
        init_selectmenu("#entrancebroadcasthead,#entrancebroadcasthead_temporary", 110, 150);
        init_selectmenu("#exitbroadcasthead,#exitbroadcasthead_temporary", 110, 150);
        init_selectmenu(".time_select", 60, 150);
        init_slider("other_volume");
        init_slider("time_period1_volume");
        init_slider("time_period2_volume");
        $("#submit_broadcast_out").click(set_oem01_broadcast_out);
        get_oem01_broadcast_out();
        $("#submit_broadcast_volume").click(set_oem01_broadcast_volume);
        get_oem01_broadcast_volume();
        $("#submit_broadcast_out_temporary").click(submit_broadcast_out_temporary);
        get_broadcast_out_temporary();
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//SetOfflineCharge
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var SetOfflineCharge = new function () {
    //获取收费规则
    function get_charge_charging_config() {
        var cfg = {};
        cfg.protocol_type = "get_charge_charging_config_request";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    var m_cfg = jsondata.model_params;
                    var s_car = m_cfg.charge_params_small;
                    var b_car = m_cfg.charge_params_big;
                    $("#id_radio").check_val(jsondata.input_tmpflag == 1);
                    $("#od_radio").check_val(jsondata.output_tmpflag == 1);
                    $("#basic_cfg_sel").select_val(jsondata.charge_model);
                    $(".charge-type").hide();
                    if (jsondata.charge_model == 1) {
                        $("#t_div").show();
                        load_time_charge(jsondata);
                    } else if (jsondata.charge_model == 2) {
                        $("#c_div").show();
                        load_count_charge(jsondata);
                    } else if (jsondata.charge_model == 3) {
                        $("#s_div").show();
                        load_section_charge(jsondata);
                    } else {
                        $("#w_div").show();
                        load_search_charge(jsondata);
                    }
                }
            },
            dataType: "text"
        });
    }
    //设置按时计费
    function set_time_charg_config() {
        var s_free_time_txt = parseInt($("#ts_free_time_txt").val());
        var s_start_time_txt = parseInt($("#ts_start_time_txt").val());
        var s_start_money_txt = parseInt($("#ts_start_money_txt").val());
        var s_cycle_time_txt = parseInt($("#ts_cycle_time_txt").val());
        var s_cycle_money_txt = parseInt($("#ts_cycle_money_txt").val());
        var s_charge_max_txt = parseInt($("#ts_charge_max_txt").val());

        var b_free_time_txt = parseInt($("#tb_free_time_txt").val());
        var b_start_time_txt = parseInt($("#tb_start_time_txt").val());
        var b_start_money_txt = parseInt($("#tb_start_money_txt").val());
        var b_cycle_time_txt = parseInt($("#tb_cycle_time_txt").val());
        var b_cycle_money_txt = parseInt($("#tb_cycle_money_txt").val());
        var b_charge_max_txt = parseInt($("#tb_charge_max_txt").val());
        var limit_time = parseInt($("#t_limit_time_txt").val());

        if ($("#ts_car_ck").check_val()) {
            if (isNaN(s_free_time_txt) || s_free_time_txt < 0 || isNaN(s_start_time_txt) || s_start_time_txt < 0 || isNaN(s_start_money_txt) || s_start_money_txt < 0 || isNaN(s_cycle_time_txt) || s_cycle_time_txt < 0 || isNaN(s_cycle_money_txt) || s_cycle_money_txt < 0 || isNaN(s_charge_max_txt) || s_charge_max_txt < 0) {
                show_informer_text("请输入正整数");
                return;
            }
            if (s_start_money_txt > s_charge_max_txt) {
                show_informer_text("封顶金额不能小于起步金额");
                return;
            }
        }
        if ($("#tb_car_ck").check_val()) {
            if (isNaN(b_free_time_txt) || b_free_time_txt < 0 || isNaN(b_start_time_txt) || b_start_time_txt < 0 || isNaN(b_start_money_txt) || b_start_money_txt < 0 || isNaN(b_cycle_time_txt) || b_cycle_time_txt < 0 || isNaN(b_cycle_money_txt) || b_cycle_money_txt < 0 || isNaN(b_charge_max_txt) || b_charge_max_txt < 0) {
                show_informer_text("请输入正整数");
                return;
            }
            if (b_start_money_txt > b_charge_max_txt) {
                show_informer_text("封顶金额不能小于起步金额");
                return;
            }
        }
        if (isNaN(limit_time) || limit_time < 0) {
            show_informer_text("请输入正整数");
            return;
        }

        var cfg = {};
        cfg.protocol_type = "set_charge_charging_config_request";
        cfg.response_state = 200;
        cfg.charge_mode = 0;
        cfg.input_tmpflag = $("#id_radio").check_val() ? 1 : 0;
        cfg.output_tmpflag = $("#od_radio").check_val() ? 1 : 0;
        cfg.charge_model = parseInt($("#basic_cfg_sel").select_val());
        cfg.model_params = {};
        cfg.model_params.charge_params_small = {};
        cfg.model_params.charge_params_small.valid_flag = $("#ts_car_ck").check_val() ? 1 : 0;
        cfg.model_params.charge_params_small.free_time = s_free_time_txt;
        cfg.model_params.charge_params_small.start_time = s_start_time_txt;
        cfg.model_params.charge_params_small.start_money = s_start_money_txt;
        cfg.model_params.charge_params_small.cycle_time = s_cycle_time_txt;
        cfg.model_params.charge_params_small.cycle_money = s_cycle_money_txt;
        cfg.model_params.charge_params_small.upper_limit = s_charge_max_txt;
        cfg.model_params.charge_params_big = {};
        cfg.model_params.charge_params_big.valid_flag = $("#tb_car_ck").check_val() ? 1 : 0;
        cfg.model_params.charge_params_big.free_time = b_free_time_txt;
        cfg.model_params.charge_params_big.start_time = b_start_time_txt;
        cfg.model_params.charge_params_big.start_money = b_start_money_txt;
        cfg.model_params.charge_params_big.cycle_time = b_cycle_time_txt;
        cfg.model_params.charge_params_big.cycle_money = b_cycle_money_txt;
        cfg.model_params.charge_params_big.upper_limit = b_charge_max_txt;
        cfg.limit_time = limit_time;
        cfg.over_model = parseInt($("#t_billing_type_sel").select_val());

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    show_informer();
                    get_charge_charging_config();
                }
            },
            dataType: "text"
        });
    }
    //设置按次计费
    function set_count_charg_config() {
        var s_free_time_txt = parseInt($("#cs_free_time_txt").val());
        var s_cycle_money_txt = parseInt($("#cs_cycle_money_txt").val());
        var s_charge_max_txt = parseInt($("#cs_charge_max_txt").val());

        var b_free_time_txt = parseInt($("#cb_free_time_txt").val());
        var b_cycle_money_txt = parseInt($("#cb_cycle_money_txt").val());
        var b_charge_max_txt = parseInt($("#cb_charge_max_txt").val());

        if ($("#cs_car_ck").check_val()) {
            if (isNaN(s_free_time_txt) || s_free_time_txt < 0 || isNaN(s_cycle_money_txt) || s_cycle_money_txt < 0 || isNaN(s_charge_max_txt) || s_charge_max_txt < 0) {
                show_informer_text("请输入正整数");
                return;
            }
        }
        if ($("#cb_car_ck").check_val()) {
            if (isNaN(b_free_time_txt) || b_free_time_txt < 0 || isNaN(b_cycle_money_txt) || b_cycle_money_txt < 0 || isNaN(b_charge_max_txt) || b_charge_max_txt < 0) {
                show_informer_text("请输入正整数");
                return;
            }
        }

        var cfg = {};
        cfg.protocol_type = "set_charge_charging_config_request";
        cfg.response_state = 200;
        cfg.charge_mode = 0;
        cfg.input_tmpflag = $("#id_radio").check_val() ? 1 : 0;
        cfg.output_tmpflag = $("#od_radio").check_val() ? 1 : 0;
        cfg.charge_model = parseInt($("#basic_cfg_sel").select_val());
        cfg.model_params = {};
        cfg.model_params.charge_params_small = {};
        cfg.model_params.charge_params_small.valid_flag = $("#cs_car_ck").check_val() ? 1 : 0;
        cfg.model_params.charge_params_small.free_time = s_free_time_txt;
        cfg.model_params.charge_params_small.begin_time = returnTimer("cs_s_timer");
        cfg.model_params.charge_params_small.end_time = returnTimer("cs_e_timer");
        cfg.model_params.charge_params_small.cycle_money = s_cycle_money_txt;
        cfg.model_params.charge_params_small.upper_limit = s_charge_max_txt;
        cfg.model_params.charge_params_big = {};
        cfg.model_params.charge_params_big.valid_flag = $("#cb_car_ck").check_val() ? 1 : 0;
        cfg.model_params.charge_params_big.free_time = b_free_time_txt;
        cfg.model_params.charge_params_big.begin_time = returnTimer("cb_s_timer");
        cfg.model_params.charge_params_big.end_time = returnTimer("cb_e_timer");
        cfg.model_params.charge_params_big.cycle_money = b_cycle_money_txt;
        cfg.model_params.charge_params_big.upper_limit = b_charge_max_txt;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    show_informer();
                    get_charge_charging_config();
                }
            },
            dataType: "text"
        });
    }
    //设置分段计费
    function set_section_charg_config() {
        var flag = false;
        var s_car_arr = [];
        var b_car_arr = [];
        $(".small_car_tr").each(function (i) {
            var ss_car_ck = $(this).find(".ss_car_ck").check_val();
            var s_free_time_txt = parseInt($(this).find(".ss_free_time_txt").val());
            var s_start_time_txt = parseInt($(this).find(".ss_start_time_txt").val());
            var s_start_money_txt = parseInt($(this).find(".ss_start_money_txt").val());
            var s_cycle_time_txt = parseInt($(this).find(".ss_cycle_time_txt").val());
            var s_cycle_money_txt = parseInt($(this).find(".ss_cycle_money_txt").val());
            var s_charge_max_txt = parseInt($(this).find(".ss_charge_max_txt").val());

            if (ss_car_ck) {
                if (isNaN(s_free_time_txt) || s_free_time_txt < 0 || isNaN(s_start_time_txt) || s_start_time_txt < 0 || isNaN(s_start_money_txt) || s_start_money_txt < 0 || isNaN(s_cycle_time_txt) || s_cycle_time_txt < 0 || isNaN(s_cycle_money_txt) || s_cycle_money_txt < 0 || isNaN(s_charge_max_txt) || s_charge_max_txt < 0) {
                    show_informer_text("请输入正整数");
                    flag = true;
                    return false;
                }
                if (s_start_money_txt > s_charge_max_txt) {
                    show_informer_text("封顶金额不能小于起步金额");
                    flag = true;
                    return false;
                }
            }
            var s_time = returnTimer("s_s_timer" + i);
            var e_time = returnTimer("s_e_timer" + i);
            var json = {};
            json.begin_time = s_time;
            json.end_time = e_time;
            json.valid_flag = ss_car_ck ? 1 : 0;
            json.free_time = s_free_time_txt;
            json.start_time = s_start_time_txt;
            json.start_money = s_start_money_txt;
            json.cycle_time = s_cycle_time_txt;
            json.cycle_money = s_cycle_money_txt;
            json.upper_limit = s_charge_max_txt;
            s_car_arr.push(json);
        });
        if (flag) {
            return;
        }
        $(".big_car_tr").each(function (i) {
            var sb_car_ck = $(this).find(".sb_car_ck").check_val();
            var b_free_time_txt = parseInt($(this).find(".sb_free_time_txt").val());
            var b_start_time_txt = parseInt($(this).find(".sb_start_time_txt").val());
            var b_start_money_txt = parseInt($(this).find(".sb_start_money_txt").val());
            var b_cycle_time_txt = parseInt($(this).find(".sb_cycle_time_txt").val());
            var b_cycle_money_txt = parseInt($(this).find(".sb_cycle_money_txt").val());
            var b_charge_max_txt = parseInt($(this).find(".sb_charge_max_txt").val());
            if (sb_car_ck) {
                if (isNaN(b_free_time_txt) || b_free_time_txt < 0 || isNaN(b_start_time_txt) || b_start_time_txt < 0 || isNaN(b_start_money_txt) || b_start_money_txt < 0 || isNaN(b_cycle_time_txt) || b_cycle_time_txt < 0 || isNaN(b_cycle_money_txt) || b_cycle_money_txt < 0 || isNaN(b_charge_max_txt) || b_charge_max_txt < 0) {
                    show_informer_text("请输入正整数");
                    flag = true;
                    return false;
                }
                if (b_start_money_txt > b_charge_max_txt) {
                    show_informer_text("封顶金额不能小于起步金额");
                    flag = true;
                    return false;
                }
            }
            var s_time = returnTimer("b_s_timer" + i);
            var e_time = returnTimer("b_e_timer" + i);
            var json = {};
            json.begin_time = s_time;
            json.end_time = e_time;
            json.valid_flag = sb_car_ck ? 1 : 0;
            json.free_time = b_free_time_txt;
            json.start_time = b_start_time_txt;
            json.start_money = b_start_money_txt;
            json.cycle_time = b_cycle_time_txt;
            json.cycle_money = b_cycle_money_txt;
            json.upper_limit = b_charge_max_txt;
            b_car_arr.push(json);
        });
        if (flag) {
            return;
        }
        var limit_time = parseInt($("#s_limit_time_txt").val());
        if (isNaN(limit_time) || limit_time < 0) {
            show_informer_text("请输入正整数");
            return;
        }

        if (check_time_cross2(s_car_arr)) {
            show_informer_text("时间段不能交叉或重复");
            return;
        }
        if (check_time_cross2(b_car_arr)) {
            show_informer_text("时间段不能交叉或重复");
            return;
        }

        var cfg = {};
        cfg.protocol_type = "set_charge_charging_config_request";
        cfg.response_state = 200;
        cfg.charge_mode = 0;
        cfg.input_tmpflag = $("#id_radio").check_val() ? 1 : 0;
        cfg.output_tmpflag = $("#od_radio").check_val() ? 1 : 0;
        cfg.charge_model = parseInt($("#basic_cfg_sel").select_val());
        cfg.model_params = {};
        cfg.model_params.charge_params_small = s_car_arr;
        cfg.model_params.charge_params_big = b_car_arr;
        cfg.limit_time = limit_time;
        cfg.over_model = parseInt($("#s_billing_type_sel").select_val());

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    show_informer();
                    get_charge_charging_config();
                }
            },
            dataType: "text"
        });
    }
    //设置查表计费
    function set_search_charge() {
        var ft = parseInt($("#w_free_time_txt").val());
        var am = parseInt($("#w_all_money_txt").val());
        if (isNaN(am) || am < 0 || isNaN(ft) || ft < 0) {
            show_informer_text("金额和免费分钟数为正整数");
            return;
        }
        var time_model = 0;
        if ($("#w_hour_ck").check_val()) {
            time_model = 1;
        }
        var arr = [];
        $("#w_data_tb tr .edit").each(function () {
            var index = parseInt($(this).attr("index"));
            arr[index] = parseFloat($(this).html());
        });
        var flag = false;
        for (var i = 0; i < arr.length; i++) {
            if (i != 0 && arr[i] < arr[i - 1]) {
                flag = true;
                show_informer_text("后一小时金额不能小于前一小时金额");
                break;
            }
        }
        if (flag) {
            return false;
        }
        var cfg = {};
        cfg.protocol_type = "set_charge_charging_config_request";
        cfg.response_state = 200;
        cfg.charge_mode = 0;
        cfg.input_tmpflag = $("#id_radio").check_val() ? 1 : 0;
        cfg.output_tmpflag = $("#od_radio").check_val() ? 1 : 0;
        cfg.charge_model = parseInt($("#basic_cfg_sel").select_val());
        cfg.model_params = {};
        cfg.model_params.free_time = ft;
        cfg.model_params.upper_limit = am;
        cfg.model_params.time_model = time_model;
        cfg.model_params.params_detail = arr;

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    show_informer();
                    get_charge_charging_config();
                }
            },
            dataType: "text"
        });
    }

    //加载按时计费
    function load_time_charge(jsondata) {
        var m_cfg = jsondata.model_params;
        var s_car = m_cfg.charge_params_small;
        var b_car = m_cfg.charge_params_big;

        $("#ts_car_ck").check_val(s_car.valid_flag == 1);
        $("#ts_free_time_txt").val(s_car.free_time);
        $("#ts_start_time_txt").val(s_car.start_time);
        $("#ts_start_money_txt").val(s_car.start_money);
        $("#ts_cycle_time_txt").val(s_car.cycle_time);
        $("#ts_cycle_money_txt").val(s_car.cycle_money);
        $("#ts_charge_max_txt").val(s_car.upper_limit);

        $("#tb_car_ck").check_val(b_car.valid_flag == 1);
        $("#tb_free_time_txt").val(b_car.free_time);
        $("#tb_start_time_txt").val(b_car.start_time);
        $("#tb_start_money_txt").val(b_car.start_money);
        $("#tb_cycle_time_txt").val(b_car.cycle_time);
        $("#tb_cycle_money_txt").val(b_car.cycle_money);
        $("#tb_charge_max_txt").val(b_car.upper_limit);

        $("#t_limit_time_txt").val(jsondata.limit_time);
        $("#t_billing_type_sel").select_val(jsondata.over_model);
    }
    //加载分段计费
    function load_section_charge(jsondata) {
        var m_cfg = jsondata.model_params;
        var s_car = m_cfg.charge_params_small;
        var b_car = m_cfg.charge_params_big;
        $(".small_car_tr").each(function (i) {
            SetTimer("s_s_timer" + i, s_car[i].begin_time);
            SetTimer("s_e_timer" + i, s_car[i].end_time);
            $(this).find(".ss_car_ck").check_val(s_car[i].valid_flag == 1);
            $(this).find(".ss_free_time_txt").val(s_car[i].free_time);
            $(this).find(".ss_start_time_txt").val(s_car[i].start_time);
            $(this).find(".ss_start_money_txt").val(s_car[i].start_money);
            $(this).find(".ss_cycle_time_txt").val(s_car[i].cycle_time);
            $(this).find(".ss_cycle_money_txt").val(s_car[i].cycle_money);
            $(this).find(".ss_charge_max_txt").val(s_car[i].upper_limit);
        });
        $(".big_car_tr").each(function (i) {
            SetTimer("b_s_timer" + i, b_car[i].begin_time);
            SetTimer("b_e_timer" + i, b_car[i].end_time);
            $(this).find(".sb_car_ck").check_val(b_car[i].valid_flag == 1);
            $(this).find(".sb_free_time_txt").val(b_car[i].free_time);
            $(this).find(".sb_start_time_txt").val(b_car[i].start_time);
            $(this).find(".sb_start_money_txt").val(b_car[i].start_money);
            $(this).find(".sb_cycle_time_txt").val(b_car[i].cycle_time);
            $(this).find(".sb_cycle_money_txt").val(b_car[i].cycle_money);
            $(this).find(".sb_charge_max_txt").val(b_car[i].upper_limit);
        });
        $("#s_limit_time_txt").val(jsondata.limit_time);
        $("#s_billing_type_sel").select_val(jsondata.over_model);
    }
    //加载按次计费
    function load_count_charge(jsondata) {
        var m_cfg = jsondata.model_params;
        var s_car = m_cfg.charge_params_small;
        var b_car = m_cfg.charge_params_big;

        $("#cs_car_ck").check_val(s_car.valid_flag == 1);
        $("#cs_free_time_txt").val(s_car.free_time);
        SetTimer("cs_s_timer", s_car.begin_time);
        SetTimer("cs_e_timer", s_car.end_time);
        $("#cs_cycle_money_txt").val(s_car.cycle_money);
        $("#cs_charge_max_txt").val(s_car.upper_limit);

        $("#cb_car_ck").check_val(b_car.valid_flag == 1);
        $("#cb_free_time_txt").val(b_car.free_time);
        SetTimer("cb_s_timer", b_car.begin_time);
        SetTimer("cb_e_timer", b_car.end_time);
        $("#cb_cycle_money_txt").val(b_car.cycle_money);
        $("#cb_charge_max_txt").val(b_car.upper_limit);
    }
    var old_detail = null;
    var old_time_model;
    //加载查表计费
    function load_search_charge(jsondata) {
        var params = jsondata.model_params;
        old_time_model = params.time_model;
        if (old_time_model == 0) {
            $("#w_half_hour_ck").check_val(true);
            load_half_hour_data();
        } else {
            $("#w_hour_ck").check_val(true);
            load_hour_data();
        }
        $("#w_all_money_txt").val(params.upper_limit);
        $("#w_free_time_txt").val(params.free_time);
        old_detail = params.params_detail;
        load_model_data(old_detail, old_time_model);
    }

    function load_model_data(detail, model) {
        var length = detail.length;
        if (model == 0 && length == 48 || model == 1 && length == 24) {
            $(".edit").each(function () {
                var index = parseInt($(this).attr("index"));
                $(this).html(detail[index]);
            });
        } else if (model == 0 && length == 24) {
            $(".edit").each(function () {
                var index = parseInt($(this).attr("index"));
                $(this).html(detail[parseInt(index / 2)]);
            });
        } else if (model == 1 && length == 48) {
            $(".edit").each(function () {
                var index = parseInt($(this).attr("index"));
                $(this).html(detail[index * 2 + 1]);
            });
        }

    }

    function load_half_hour_data() {
        var str = "";
        for (var i = 0; i < 6; i++) {
            str += "<tr>";
            for (var j = 0; j < 8; j++) {
                str += "<td style='color:red;'>" + ((i + 1) / 2 + (j * 3)) + "</td><td class='edit' index='" + (i + j * 6) + "'>0</td>";
            }
            str += "</tr>";
        }
        $("#w_data_tb tr:gt(0)").remove();
        $("#w_data_tb").append(str);
    }

    function load_hour_data() {
        var str = "";
        for (var i = 0; i < 3; i++) {
            str += "<tr>";
            for (var j = 0; j < 8; j++) {
                str += "<td style='color:red;'>" + ((i + 1) + (j * 3)) + "</td><td class='edit' index='" + (i + j * 3) + "'>0</td>";
            }
            str += "</tr>";
        }
        $("#w_data_tb tr:gt(0)").remove();
        $("#w_data_tb").append(str);
    }

    //获取屏显参数
    function get_charge_display_config() {
        var cfg = {};
        cfg.protocol_type = "get_charge_display_config_request";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    $("#show_time_flag_ck").check_val(jsondata.show_time_flag == 1);
                    $("#show_ad_flag_ck").check_val(jsondata.show_ad_flag == 1);
                    $("#ad_content").val(jsondata.ad_content);
                }
            },
            dataType: "text"
        });
    }
    //设置屏显参数
    function set_charge_display_config() {
        var entry_type = 0;
        if ($("#output_radio").check_val()) {
            entry_type = 1;
        }
        var cfg = {};
        cfg.protocol_type = "set_charge_display_config_request";
        cfg.response_state = 200;
        cfg.show_time_flag = $("#show_time_flag_ck").check_val() ? 1 : 0;
        cfg.show_ad_flag = $("#show_ad_flag_ck").check_val() ? 1 : 0;
        cfg.ad_content = $("#ad_content").val();


        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "getopensdkrequest.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                if ("OK" != ajaxdata.slice(0, 2)) return false;
                ajaxdata = ajaxdata.substring(ajaxdata.indexOf(" ") + 1);
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.response_state == 200) {
                    show_informer();
                    get_charge_display_config();
                }
            },
            dataType: "text"
        });
    }

    function check_time_cross2(arr) {
        var all_time = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].valid_flag == 1) {
                var bt = arr[i].begin_time;
                var et = arr[i].end_time;
                bt = parseInt(bt.split(":")[0]) * 60 + parseInt(bt.split(":")[1]);
                et = parseInt(et.split(":")[0]) * 60 + parseInt(et.split(":")[1]);
                var h = 24 * 60;
                if (et < bt) {
                    var json = {};
                    json.bt = bt;
                    json.et = h;
                    all_time.push(json);
                    var json1 = {};
                    json1.bt = 0;
                    json1.et = et;
                    all_time.push(json1);
                } else {
                    var json = {};
                    json.bt = bt;
                    json.et = et;
                    all_time.push(json);
                }
            }
        }
        var flag = false;
        for (var m = 0; m < all_time.length; m++) {
            for (var n = 0; n < all_time.length; n++) {
                if (m != n) {
                    if (all_time[n].bt > all_time[m].bt && all_time[n].bt < all_time[m].et || all_time[n].et > all_time[m].bt && all_time[n].et < all_time[m].et) {
                        flag = true;
                        break;
                    }
                    if (all_time[n].bt == all_time[m].bt && all_time[n].et == all_time[m].et) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag) {
                break;
            }
        }
        if (flag) {
            return true;
        }
        return false;
    }
    this.init = function () {
        var old_val = 0;
        $("input:text:not(.custom)").width(70);
        init_selectmenu("select:not(#basic_cfg_sel)", 110, 150);
        init_selectmenu("#basic_cfg_sel", 110, 150, function (e, object) {
            var val = object.value;
            $(".charge-type").hide();
            if (val == 1) {
                $("#t_div").show();
            } else if (val == 2) {
                $("#c_div").show();
            } else if (val == 3) {
                $("#s_div").show();
            } else {
                $("#w_div").show();
            }
        });
        $("#t_submit_charge_btn").click(set_time_charg_config);
        $("#c_submit_charge_btn").click(set_count_charg_config);
        $("#s_submit_charge_btn").click(set_section_charg_config);
        $("#w_submit_charge_btn").click(set_search_charge);
        $("#submit_display_btn").click(set_charge_display_config);
        $(".time").each(function () {
            var id = $(this).attr("id");
            showTimer(id);
        });
        $("input[name='unit']").change(function () {
            if ($("#w_half_hour_ck").check_val()) {
                load_half_hour_data();
                if (old_detail) {
                    load_model_data(old_detail, 0);
                }
            } else {
                load_hour_data();
                if (old_detail) {
                    load_model_data(old_detail, 1);
                }
            }
        });
        $(document).on("click", "#w_data_tb tr .edit", function () {
            var length = $(this).find("input").length;
            if (length != 0) {
                return false;
            }
            var str = "<input class='edit_txt text' type='text' style='width:40px;' value='" + $(this).html() + "'/>";
            $(this).css("padding", "0");
            $(this).html(str);
            $(".edit_txt").focus(function () {
                old_val = $(this).val();
            }).select();
        });
        $(document).on("blur", ".edit_txt", function () {
            var index = parseInt($(this).parent().attr("index"));
            var value = $(this).val();
            if (isNaN(value)) {
                show_informer_text("金额为数字");
                $(this).parent().html(old_val);
                return;
            }
            var pre_index = index - 1;
            if (pre_index >= 0) {
                var pre_val = parseFloat($("#w_data_tb tr .edit[index='" + pre_index + "']").html());
                if (value < pre_val) {
                    show_informer_text("后一小时金额不能小于前一小时金额");
                    $(this).parent().html(old_val);
                    return;
                }
            }

            $(this).parent().html(value);
        });

        load_half_hour_data();
        get_charge_charging_config();
        get_charge_display_config();
    }
    this.close = function () {
        $(document).off("click", "#w_data_tb tr .edit");
        $(document).off("blur", ".edit_txt");
    }
    close_json['SetOfflineCharge'] = this.close
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//LocalConfig
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var LocalConfig = new function () {
    this.init = function () {
        init_activex_new("#live", 6, 1, function () { });
    }
    this.close = function () {
        stop_video();
    }
    close_json["LocalConfig"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//UploadLogo
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var UploadLogo = new function () {
    var loaded = true;
    function init_para() {
        loaded = true;
    }
    function delete_logo() {
        $.get("vb.htm?paratest=removelogofile",
            function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                ajaxdata = ajaxdata.split(" ")[0];
                if (ajaxdata == "OK") {
                    $("#warning_text").css("color", "Green");
                    $("#warning_text").html($.i18n.prop("deleted"));
                } else {
                    $("#warning_text").css("color", "red");
                    $("#warning_text").html($.i18n.prop("delete_failed"));
                }
            });
    }
    function disable_other_btns() {
        $("#update").attr("disabled", "disabled");
    }

    function enable_other_btns() {
        $("#update").removeAttr("disabled");
    }
    function on_iframe_loaded() {
        if (loaded) {
            return;
        }
        enable_other_btns();
        loaded = true;
        var r;
        var error = false;
        try {
            r = getIFrameContent("hidden_frame");
        }
        catch (error) {
            error = true;
        }
        $(".loading").hide();
        if (error || r == undefined || r.length == 0) {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("upload_failed_hint"));
        }
        else if (r.match(/All upload success/)) {
            $("#warning_text").css("color", "Green");
            $("#warning_text").html($.i18n.prop("uploaded_success"));
        }
        else {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("uploaded_failed"));
        }
    }
    //取iframe的innerHTML
    function getIFrameContent(id) {
        var hidden_fr = document.getElementById(id);
        if (document.getElementById) {
            if (hidden_fr && !window.opera) {
                if (hidden_fr.contentDocument) {
                    return hidden_fr.contentDocument.body.innerHTML;
                } else if (hidden_fr.Document) {
                    return hidden_fr.Document.body.innerHTML;
                }
            }
        }
    }
    this.init = function () {
        init_para();
        //ie8 will not send request when file input is hidden!
        $("#file_input_btn").hide();
        if (g_style_time == "old" || g_style_time == "hrzx" || (ie.isIE && (ie.version <= 10 || (ie.emulatedVersion != null && ie.emulatedVersion <= 10)))) {
            $("#file_name").hide();
            $("#file_input").show();
        }
        $("#file_input_btn").click(function () {
            $("#file_input").click();
            var path = $("#file_input").val().split('\\').pop();
            $("#file_name").html(path);
        });
        $("#hidden_frame").on("load", on_iframe_loaded);
        $("#frmUpdate").submit(function () {
            loaded = false;
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("upload_wait_hint"));
            flag = true;
        });
        $("#file_input").change(function () {
            if (!ie.isIE || ie.isIE && ie.version >= 10) {
                var file = this.files[0];
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    $("#preview").attr("src", this.result).show();
                }
            }
        });
        $("#update").click(function () {
            var value = $("#file_input").val();
            var file = document.getElementById("file_input");
            if (file.files[0].size.toFixed(1) > 2 * 1024 * 1024) {
                show_informer_text($.i18n.prop("upload_size_hint") + " 2M");
                return false;
            }
            if (value == "") {
                show_informer_text($.i18n.prop("upload_error_hint"));
                return false;
            }
            value = value.substring(value.lastIndexOf(".") + 1);
            if (value != "png" && value != "jpg" && value != "bmp") {
                show_informer_text($.i18n.prop("upload_logo_suffix"));
                return false;
            }
            disable_other_btns();
            $("#frmUpdate").submit();
        });
        $("#delete").click(delete_logo);
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Log
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Log = new function () {
    var all_page = 0;
    var cur_page = 1;
    var page_size = 100;
    var export_arr = [];
    var old_start_time = "";
    var old_end_time = "";
    var old_min_id = 0;
    var old_max_id = 0;
    var old_end_id = 0;
    var end_id_arr = [];
    var bus = 0, opr = 0, sys = 0, dev = 0, sort = 1;
    var searching = false;
    function search_log(is_first, export_flag, end_id) {
        $("#log_tb_lodding").show();
        $("#log_tb_lodding_txt").html($.i18n.prop("loading"));
        var cfg = {};
        cfg.type = "log_search";
        cfg.module = "BUS_WEB_REQUEST";
        var mask = (bus << 1) | (sys << 2) | (dev << 3) | (opr << 4);

        cfg.body = {};
        cfg.body.type_mask = mask;
        cfg.body.start_time = {};
        cfg.body.start_time.sec = old_start_time;
        cfg.body.start_time.usec = 0;
        cfg.body.end_time = {};
        cfg.body.end_time.sec = old_end_time;
        cfg.body.end_time.usec = 0;
        cfg.body.limit = page_size;
        cfg.body.qnode = {};
        cfg.body.qnode.qtype = sort;
        cfg.body.qnode.is_first = is_first;
        cfg.body.qnode.max_id = old_max_id;
        cfg.body.qnode.min_id = old_min_id;
        cfg.body.qnode.start_id = end_id;
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "logsearch.php",
            data: jsonstr,
            success: function (ajaxdata) {
                var jsondata = eval("(" + ajaxdata + ")");
                if (jsondata.state == 200) {
                    var records = [];
                    try {
                        var json = jsondata.body;
                        records = json.logs;
                        old_end_id = json.qnode.last_id;
                        if (is_first) {
                            old_min_id = json.qnode.min_id;
                            old_max_id = json.qnode.max_id;
                        }
                        for (var i = 0; i < records.length; i++) {
                            export_arr.push(records[i]);
                        }
                    } catch (e) { }
                    if (export_flag == 1) {
                        if (old_end_id == 0) {
                            export_log();
                            searching = false;
                        } else {
                            search_log(0, export_flag, old_end_id);
                        }
                    } else {
                        if (old_end_id == 0) {
                            searching = false;
                            all_page = Math.ceil(export_arr.length / page_size);
                            if (all_page == 0) {
                                cur_page = 0;
                            }
                            $("#all_page").html(all_page);
                            $("#cur_page").html(cur_page);
                            $("#total").html(export_arr.length);
                            $("#log_tb_lodding").hide();
                            if (export_arr.length == 0) {
                                show_informer_text($.i18n.prop("no_data"));
                                $("#log_container").html("");
                                return;
                            }
                            show_data();
                        } else {
                            search_log(0, export_flag, old_end_id);
                        }
                    }
                }
            }
        });
    }
    function export_log() {
        if (export_arr.length == 0) {
            export_all = false;
            show_informer_text($.i18n.prop("no_data"));
            $("#log_tb_lodding").hide();
            return;
        }
        var ax = GetAX("ax");
        if (!ax) {
            export_all = false;
            show_informer_text($.i18n.prop("no_ax"));
            $("#log_tb_lodding").hide();
            return;
        }
        var req = {};
        req.logs = export_arr;
        var encoded = $.toJSON(req);
        ax.QueryCmd("PlateLogExport", encoded, "1", function (response_data) {
            $("#log_tb_lodding").hide();
            var arr = response_data.split("\\");
            response_data = arr.join("/")
            var json = eval("(" + response_data + ")");
            if (json.state == 200) {
                show_informer($.i18n.prop("exported_to") + json.path);
            } else {
                show_informer_text($.i18n.prop("export_failure"));
            }
            export_all = false;
        });
    }
    function show_data() {
        var show_end_id = cur_page * page_size;
        if (show_end_id > export_arr.length) {
            show_end_id = export_arr.length;
        }
        var start_show_id = (cur_page - 1) * page_size;
        var str = "<table>";
        for (var i = start_show_id; i < show_end_id; i++) {
            var type = "";
            var data = export_arr[i].data;
            if (export_arr[i].type == 1) {
                type = $.i18n.prop("debug_log");
            } else if (export_arr[i].type == 2) {
                type = $.i18n.prop("business_log");
            } else if (export_arr[i].type == 4) {
                type = $.i18n.prop("system_log");
                data = $.i18n.prop(data.substring(0, 4));
            } else if (export_arr[i].type == 8) {
                type = $.i18n.prop("device_log");
                data = $.i18n.prop(data.substring(0, 4));
            } else if (export_arr[i].type == 16) {
                type = $.i18n.prop("operation_log");
                data = $.i18n.prop(data.substring(0, 4));
            }
            str += "<tr><td style='width:200px;'>" + export_arr[i].time + "</td><td style='width:130px;'>" + type + "</td><td style='width:650px;word-break:break-all;'>" + data + "</td></tr>";
        }
        str += "</table>"
        $("#log_container").html(str);
    }
    function search_log_click(is_first, flag) {
        if (searching) {
            show_informer_text($.i18n.prop('loading'));
            return;
        }
        cur_page = 1;
        old_min_id = 0;
        old_max_id = 0;
        export_arr = [];
        var start_time = $("#start_time").val();
        var end_time = $("#end_time").val();
        bus = $("#bus").check_val() ? 1 : 0;
        opr = $("#opr").check_val() ? 1 : 0;
        sys = $("#sys").check_val() ? 1 : 0;
        dev = $("#dev").check_val() ? 1 : 0;
        sort = parseInt($("#sort").select_val());
        if (start_time == "") {
            show_informer_text($.i18n.prop("begin_time_empty"));
            return;
        }
        if (end_time == "") {
            show_informer_text($.i18n.prop("end_time_empty"));
            return;
        }
        var s_t = new Date(start_time.replace(/-/g, "/")).getTime();
        var e_t = new Date(end_time.replace(/-/g, "/")).getTime();
        if (e_t < s_t) {
            show_informer_text($.i18n.prop("start_time_cannot_exceed_end_time"));
            return;
        }
        searched = true;
        old_start_time = s_t / 1000;
        old_end_time = e_t / 1000;
        if (is_first) {
            end_id_arr = [];
        }
        if (!flag) {
            end_id_arr[cur_page - 1] = 0;
        }
        searching = true;
        search_log(is_first, flag, 0);
    }
    function pre_page() {
        if (!searched) {
            return;
        }
        if (cur_page <= 1) {
            show_informer_text($.i18n.prop("its_first_page"));
            return;
        }
        cur_page -= 1;
        $("#cur_page").html(cur_page);
        show_data();
    }
    function next_page() {
        if (!searched) {
            return;
        }
        if (cur_page >= Math.ceil(export_arr.length / page_size)) {
            show_informer_text($.i18n.prop("its_last_page"));
            return;
        }
        cur_page += 1;
        $("#cur_page").html(cur_page);
        show_data();
    }
    function first_page() {
        if (!searched) {
            return;
        }
        cur_page = 1;
        $("#cur_page").html(cur_page);
        show_data();
    }
    function last_page() {
        if (!searched) {
            return;
        }
        cur_page = all_page;
        $("#cur_page").html(cur_page);
        show_data();
    }
    function clear() {
        searched = false;
        old_plate = "";
        $("#log_container").html("");
        cur_page = 1;
    }
    var export_all = false;
    function init_para() {
        export_arr = []
        cur_page = 1;
        export_all = false;
        old_start_time = "";
        old_end_time = "";
        old_min_id = 0;
        old_max_id = 0;
        all_page = 0;
        end_id_arr = [];
        old_end_id = 0;
        bus = 0;
        opr = 0;
        sys = 0;
        dev = 0;
    }
    function init_time() {
        var data = new Date();
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = data.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var s_t = year + "-" + month + "-" + day + " 00:00:00";
        var e_t = year + "-" + month + "-" + day + " 23:59:59";
        $("#start_time").val(s_t);
        $("#end_time").val(e_t);
    }
    this.init = function () {
        init_selectmenu("#sort", 100, 150);
        init_activex_new("#live", 7, 1, function () { });
        init_para();
        init_time();
        $("#search_log").click(function () {
            search_log_click(1, 0);
        });
        $("#export_log").click(function () {
            if (!ie.isIE) {
                show_informer_text($.i18n.prop("use_Internet_explorer"));
                return;
            }
            if (export_all) {
                show_informer_text($.i18n.prop("derived"));
                return false;
            }
            export_all = true;
            if (export_arr.lenght == 0) {
                search_log_click(1, 1);
            } else {
                export_log();
            }
        });
        $("#pre_page").click(pre_page);
        $("#next_page").click(next_page);
        $("#first_page").click(first_page);
        $("#last_page").click(last_page);
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Debug
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Debug = new function () {
    function get_debug_cfg() {
        var cfg = {};
        cfg.type = "get_debug_cfg";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "debugcfg.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    json = json.body;
                    var cpu_per = json.cpu_per;
                    var mem_mkb = json.mem_mkb;
                    var mem_skb = json.mem_skb;
                    $("#cpu_per").val(cpu_per);
                    $("#mem_kb").val(mem_mkb);
                    $("#mem_skb").val(mem_skb);
                    var log_cfg = json.log_cfg;
                    for (var i in log_cfg) {
                        $("#" + i + "_level").select_val(log_cfg[i]);
                    }
                }
            }
        })
    }
    function set_debug_cfg() {
        var cpu_per = parseInt($("#cpu_per").val());
        var mem_mkb = parseInt($("#mem_mkb").val());
        var mem_skb = parseInt($("#mem_skb").val());
        var cfg = {};
        cfg.type = "set_debug_cfg";
        cfg.body = {};
        cfg.body.cpu_per = cpu_per;
        cfg.body.mem_mkb = mem_mkb;
        cfg.body.mem_skb = mem_skb;
        var json = {};
        $("#debug_tb select").each(function () {
            var id = $(this).attr("id");
            id = id.split("_level")[0];
            var level = parseInt($(this).select_val());
            json[id] = level;
        });
        cfg.body.log_cfg = json;
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "debugcfg.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    show_informer();
                }
            }
        })
    }
    this.init = function () {
        init_selectmenu("select", 100, 150);
        $("#debug_btn").click(set_debug_cfg);
        $("#default_btn").click(function () {
            $("#debug_tb select").select_val(5);
        });
        get_debug_cfg();
    }
}
var g_device_sync = 0;
var SetSync = new function () {
    this.get_sync = function () {
        var cfg = {};
        cfg.type = "get_sync_status";

        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: 'POST',
            url: "bbjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    var body = json.body;
                    g_device_sync = body.enable;
                    $("#sync_enable").check_val(g_device_sync == 1);
                }
            }
        });
    }
    function set_sync() {
        var enable = $("#sync_enable").check_val() ? 1 : 0;
        var cfg = {};
        cfg.type = "set_sync_mode";
        cfg.body = {};
        cfg.body.enable = enable;

        var jsonstr = JSON.stringify(cfg);

        $.ajax({
            type: 'POST',
            url: "bbjson.php",
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state_code == 200) {
                    show_informer();
                }
            }
        });
    }
    this.init = function () {
        $("#sync_enable").change(set_sync);
        SetSync.get_sync();
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Storge_Antuo
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Storge_Antuo = new function () {
    var g_hd_status, g_format_type, formartting, device_timer;
    var td_height = 30;
    var td_width = 30;
    function time_period(container, input, del, clear) {
        var down = false;
        var click = false;
        var change_width = false;
        var click_position = 0;
        var poor = 2;
        var con_info = {
            width: container.width(),
            height: container.height(),
            left: container.offset().left,
            top: container.offset().top
        }
        var old_info = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            left: 0,
            top: 0
        };
        var obj = {
            c_obj: null
        };
        var cur_info = {
            x: 0,
            y: 0
        }

        container.mousedown(function (event) {
            con_info = {
                width: container.width(),
                height: container.height(),
                left: container.offset().left,
                top: container.offset().top
            }
            var e = event.target;
            old_info.x = event.pageX - con_info.left;
            old_info.y = event.pageY - con_info.top;
            if (obj.c_obj) {
                obj.c_obj.attr("class", "blur_obj chunk");
            }
            if (e.id != container.attr("id")) {
                var p = $(e).position();
                var w = $(e).width();
                obj.c_obj = $(e);
                obj.c_obj.attr("class", "focus_obj chunk");
                old_info.width = obj.c_obj.width();
                old_info.left = obj.c_obj.position().left;

                calculate_cur(obj.c_obj);
                if (old_info.x >= p.left && old_info.x <= p.left + poor) {
                    change_width = true;
                    click_position = 0;
                } else if (old_info.x >= (p.left + w - poor) && old_info.x <= (p.left + w)) {
                    change_width = true;
                    click_position = 1;
                } else {
                    click = true;
                }
            } else {
                var top = Math.floor(old_info.y / td_height) * td_height + 2;
                var row = Math.floor(old_info.y / td_height) + 1;
                var length = container.find("div[row='" + row + "']").length;
                if (length >= 8) {
                    return false;
                }
                var f = false;
                container.find("div[row='" + row + "']").each(function () {
                    var l = $(this).position().left;
                    var w = $(this).width();
                    if (old_info.x > l && old_info.x < (l + w)) {
                        f = true;
                        return false;
                    }
                });
                if (f) {
                    return false;
                }
                var o = document.createElement("div");
                $(o).attr("name", old_info.x + "" + old_info.y).attr("class", "focus_obj chunk");
                container.get(0).appendChild(o);
                obj.c_obj = $(o);
                obj.c_obj.css({ "top": top }).attr("row", Math.floor(old_info.y / td_height) + 1);
                obj.c_obj.css({ "left": old_info.x, "width": 2 });
                old_info.width = obj.c_obj.width();
                old_info.left = obj.c_obj.position().left;
                down = true;
            }
            return false;
        })
        $(document).mousemove(function (event) {
            if (!down && !click && !change_width) {
                return false;
            }
            cur_info.x = event.pageX - con_info.left;
            cur_info.y = event.pageY - con_info.top;
            if (cur_info.y < 0) {
                cur_info.y = 0;
            }
            if (cur_info.y > con_info.height) {
                cur_info.y = con_info.height;
            }
            if (cur_info.x < 0) {
                cur_info.x = 0;
            }
            if (cur_info.x > con_info.width) {
                cur_info.x = con_info.width;
            }
            var gap_x = cur_info.x - old_info.x;
            var width, left, dis;
            if (down) {
                var row = obj.c_obj.attr("row");
                if (gap_x > 0) {
                    width = gap_x;
                    left = old_info.x;
                    obj.c_obj.siblings("div[row='" + row + "']").each(function () {
                        var l = $(this).position().left;
                        if (l > old_info.left && (left + width) > l) {
                            width = l - old_info.left;
                        }
                    });
                    obj.c_obj.css({ "width": width });
                } else {
                    width = -gap_x;
                    left = cur_info.x;
                    obj.c_obj.siblings("div[row='" + row + "']").each(function () {
                        var l = $(this).position().left;
                        var w = $(this).width();
                        if (l < old_info.left && (l + w) > left) {
                            left = l + w;
                            width = old_info.width + (old_info.left - left);
                        }
                    });
                    obj.c_obj.css({ "left": left, "width": width });
                }
                calculate_cur(obj.c_obj);
            } else if (click) {
                width = obj.c_obj.width();
                var row = obj.c_obj.attr("row");
                if (gap_x < 0) {
                    dis = -gap_x;
                    left = old_info.left - dis;
                    obj.c_obj.siblings("div[row='" + row + "']").each(function () {
                        var l = $(this).position().left;
                        var w = $(this).width();
                        if (l < old_info.left && (l + w) > left) {
                            left = l + w;
                        }
                    });
                } else {
                    dis = gap_x;
                    left = old_info.left + dis;
                    obj.c_obj.siblings("div[row='" + row + "']").each(function () {
                        var l = $(this).position().left;
                        if (l > old_info.left && (left + width) > l) {
                            left = l - width;
                        }
                    });
                }
                if ((left + width) > con_info.width) {
                    left = con_info.width - width;
                }
                if (left < 0) {
                    left = 0;
                }
                obj.c_obj.css("left", left);
                calculate_cur(obj.c_obj);
            } else if (change_width) {
                if (click_position == 0) {
                    left = old_info.left + gap_x;
                    width = old_info.width - gap_x;
                    var row = obj.c_obj.attr("row");
                    obj.c_obj.siblings("div[row='" + row + "']").each(function () {
                        var l = $(this).position().left;
                        var w = $(this).width();
                        if (l < left && (l + w) > left) {
                            left = l + w;
                            width = old_info.width - (left - old_info.left);
                        }
                    });
                    var poor_value = cur_info.x - old_info.left;
                    if (left < 0) {
                        left = 0;
                        width = old_info.width + old_info.left;
                    }
                    if (left > old_info.width + old_info.left) {
                        left = old_info.width + old_info.left - 1;
                        width = 1;
                    }
                    obj.c_obj.css({ "width": width, "left": left });
                } else {
                    width = old_info.width + gap_x;
                    left = old_info.left;
                    var row = obj.c_obj.attr("row");
                    obj.c_obj.siblings("div[row='" + row + "']").each(function () {
                        var l = $(this).position().left;
                        if (l > left && (left + width) > l) {
                            width = l - left;
                        }
                    });
                    if (width < 0) {
                        width = 1;
                    }
                    if (width > con_info.width - old_info.left) {
                        width = con_info.width - old_info.left;
                    }
                    obj.c_obj.css({ "width": width });
                }
                calculate_cur(obj.c_obj);
            }
            return false;
        });
        $(document).mouseup(function () {
            if (down) {
                down = false;
                draw = false;
            }
            if (obj.c_obj) {
                if (obj.c_obj.width() <= 1) {
                    obj.c_obj.remove();
                    obj.c_obj = null;
                    calculate_cur(obj.c_obj);
                }
            }
            click = false;
            change_width = false;
        });
        $("#container div").die("mousemove");
        $("#container div").live("mousemove", function (event) {
            var e = event.target;
            var x = event.pageX - con_info.left;
            var y = event.pageY - con_info.top;
            var p = $(e).position();
            var w = $(e).width();
            if (old_info.x >= p.left && x <= p.left + poor) {
                $(e).css("cursor", "w-resize");
            } else if (x >= (p.left + w - poor) && x <= (p.left + w)) {
                $(e).css("cursor", "w-resize");
            } else {
                $(e).css("cursor", "move");
            }
        })
        $("#container div").die("mouseleave");
        $("#container div").live("mouseleave", function (event) {
            var e = event.target;
            $(e).css("cursor", "default");
        })
        $("#draw_tb .img_td").hover(function () {
            $(this).css("background", "url('../style/common/copy.png?" + version.web + "') no-repeat");
        }, function () {
            $(this).css("background", "");
        })
        var check_week = 0;
        $("#draw_tb .img_td").click(function (e) {
            check_week = parseInt($(this).attr("num"));
            $(".week_checkbox").removeAttr("disabled").check_val(false);
            $("#week" + check_week).attr("disabled", "disabled").check_val(true);
            var x = e.pageX + 20;
            var y = e.pageY;
            $("#float_div").css({ "top": y, "left": x, "display": "block" });
            $("#copy_all").check_val(false);
        })
        $("#submit_copy").click(function () {
            $(".week_checkbox").each(function () {
                var val = $(this).check_val();
                var id = $(this).attr("id");
                var num = parseInt(id.split("week")[1]);
                if (val) {
                    if (num != check_week) {
                        $("#container div[row='" + num + "']").remove();
                        $("#container div[row='" + check_week + "']").each(function () {
                            var new_div = $(this).clone();
                            new_div.css("top", (num - 1) * td_height + 2).attr("class", "blur_obj chunk").attr("row", num);
                            $("#container").append(new_div);
                        })
                    }
                }
            })
            $("#float_div").hide();
        });
        $("#cancel_copy").click(function () {
            $("#float_div").hide();
        });
        $("#copy_all").click(function () {
            $(".week_checkbox").not($(".week_checkbox[disabled='disabled']")).check_val($(this).check_val());
        });
        del.click(function () {
            if (obj.c_obj) {
                obj.c_obj.remove();
                calculate_cur(obj.c_obj);
            }
        });
        clear.click(function () {
            $(".chunk").each(function () {
                $(this).remove();
            });
            obj.c_obj = null;
            calculate_cur(obj.c_obj);
        });
        function calculate_cur(o) {
            input.val("");
            var str = "";
            var start = "";
            var end = "";
            if (o) {
                var top = o.position().top;
                var left = o.position().left;
                var width = o.width();
                str += get_week(top);
                start = get_hour(left) + ":" + get_min(left) + ":00";
                end = get_hour(left + width) + ":" + get_min(left + width) + ":00";
                if (start != "") {
                    str = str + " " + start + " " + $.i18n.prop("to") + " " + end;
                }
            }
            input.val(str);
        }
    }
    function get_week(top) {
        if (top < td_height) {
            return $.i18n.prop("Mon");
        } else if (top < (td_height * 2)) {
            return $.i18n.prop("Tue");
        } else if (top < (td_height * 3)) {
            return $.i18n.prop("Wed");
        } else if (top < (td_height * 4)) {
            return $.i18n.prop("Thu");
        } else if (top < (td_height * 5)) {
            return $.i18n.prop("Fri");
        } else if (top < (td_height * 6)) {
            return $.i18n.prop("Sat");
        } else if (top < (td_height * 7)) {
            return $.i18n.prop("Sun");
        }
    }
    function get_hour(left) {
        var hour = Math.floor(left / td_width);
        if (hour < 10) {
            hour = "0" + hour;
        } else {
            hour = "" + hour;
        }
        return hour;
    }
    function get_left(hour, min) {
        return (hour * td_width) + (min / 60 * td_width);
    }
    function get_width(left, hour, min) {
        return (hour * td_width) + (min / 60 * td_width) - left;
    }
    function get_min(left) {
        var min = Math.ceil((left % td_width) * 60 / td_width);
        if (min < 10) {
            min = "0" + min;
        } else {
            min = "" + min;
        }
        return min;
    }
    function init_para() {
        g_hd_status = {};
        g_format_type = '';
        formartting = {};
        device_timer = null;
        if (is_C3A) {
            $(".c3a_hide").remove()
        }
    }
    function format_flash() {
        var cfg = {};
        cfg.type = "STORE_FORMAT_FLASH_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        post(cfg, function (ajaxdata) {
            show_informer($.i18n.prop('Formatting'));
        }, function () {
            show_informer_text($.i18n.prop('Formatting_failure'));
        });
    }
    function format() {
        var pic_pro = parseInt($("#pic_pro").val());
        if (isNaN(pic_pro) || pic_pro < 10 || pic_pro > 90) {
            show_informer_text($.i18n.prop("pictures_used") + " 10~90");
            return;
        }
        var cfg = {};
        cfg.type = "STORE_FORMAT_SD_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        cfg.body = {};
        cfg.body.cmd = 1;
        cfg.body.pic_size = parseInt(pic_pro);
        cfg.body.db_custom_count = 0;
        cfg.body.dev_infos = g_hd_status[g_format_type]['dev_infos'];
        post(cfg, function (ajaxdata) {
            show_informer($.i18n.prop('Formatting'));
        }, function () {
            show_informer_text($.i18n.prop('Formatting_failure'));
        });
    }
    function hd_format(type) {
        if (g_hd_status[type]['state'] == 2) {
            show_informer_text($.i18n.prop("Formatting"));
            return false;
        }

        var confirm_format = confirm($.i18n.prop("format_hint"));
        if (!confirm_format) return false;
        g_format_type = type;
        if (type == 'sd') {
            $("#outerdiv").show();
        } else {
            format_flash();
        }
    }
    function get_use_str(num1, num2) {
        var used = parseInt(num1) / 1024 / 1024 / 1024;
        used = used.toFixed(2);
        var totle = parseInt(num2) / 1024 / 1024 / 1024;
        totle = totle.toFixed(2);
        return used + "G/" + totle + "G";
    }
    function get_use_m(num1, num2) {
        var used = parseInt(num1) / 1024 / 1024;
        used = used.toFixed(2);
        var totle = parseInt(num2) / 1024 / 1024;
        totle = totle.toFixed(2);
        return used + "M/" + totle + "M";
    }
    function get_device_info() {
        var cfg = {};
        cfg.type = "STORE_STAT_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        post(cfg, function (jsondata) {
            var type = "SD", status = "", capacity = "", pic_capacity = "", video_capacity = "";
            var body = jsondata.body;
            var disk_infos = body.disk_infos;
            var vzfs = body.vzfs;

            var str = '';
            for (var i = 0; i < vzfs.length; i++) {
                var state = vzfs[i].state;
                var type = vzfs[i].type;
                var dev_infos = vzfs[i].dev_infos;
                g_hd_status[type] = {};
                g_hd_status[type]['state'] = state;
                g_hd_status[type]['dev_infos'] = dev_infos;
                type = type.toUpperCase()
                if (state == 1) {
                    status = $.i18n.prop('unformatted');
                } else if (state == 2) {
                    var fmt_seconds = vzfs[i].fmt_seconds;
                    status = $.i18n.prop("format") + "(" + fmt_seconds + "%)";
                } else if (state == 0) {
                    status = $.i18n.prop('working_order');
                }
                if (vzfs[i].size > 1024 * 1024 * 1024) {
                    capacity = get_use_str(vzfs[i].used, vzfs[i].size);
                    pic_capacity = get_use_str(vzfs[i].pic_used, vzfs[i].pic_size);
                    video_capacity = get_use_str(vzfs[i].rec_used, vzfs[i].rec_size);
                } else {
                    capacity = get_use_m(vzfs[i].used, vzfs[i].size);
                    pic_capacity = get_use_m(vzfs[i].pic_used, vzfs[i].pic_size);
                    video_capacity = get_use_m(vzfs[i].rec_used, vzfs[i].rec_size);
                }

                str += '<tr type="' + vzfs[i].type + '"><td>' + type + '</td><td>' + status + '</td><td>' + capacity + '</td><td>' + pic_capacity + '</td><td>' + video_capacity + '</td><td><input type="submit" class="format_hd" value="' + $.i18n.prop('format') + '"/>	</td></tr>';
            }
            $("#devicetable tbody").html(str);
            $("#devicetable tbody td").attr("align", "center");
            $(".format_hd").button();
            $(".format_hd").click(function () {
                var type = $(this).parents('tr').attr('type');
                hd_format(type);
            });
        }, function () {
            $("#devicetable tbody").html("");
        });
    }
    function init_device() {
        var tr = $("#devicetable thead tr");
        if (tr.length == 0) {
            var tr = "<tr class=\"ui-widget-header\"><th width=\"100px\">" + $.i18n.prop("equipment") + "</th><th width=\"100px\">" + $.i18n.prop("status") + "</th><th width=\"150px\">" + $.i18n.prop("used_total_all") + "</th><th width=\"150px\">" + $.i18n.prop("used_total_pic") + "</th><th width=\"150px\">" + $.i18n.prop("used_total_video") + "</th><th width=\"100px\"></th></tr>";
            $("#devicetable thead").append(tr);
        }
        get_device_info();
    }
    var g_record_param = null;
    function get_record_param() {
        var cfg = {};
        cfg.type = "STORE_GET_RECORD_PARA_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        post(cfg, function (jsondata) {
            g_record_param = jsondata.body.channel[0];
            var record_param = g_record_param.record_param;
            var times = record_param.time;
            var enable = g_record_param.mode;
            $("#recode_time_enable").check_val(enable == 1);
            for (var i = 0; i < times.length; i++) {
                var row = i;
                if (i == 0) {
                    row = 7;
                }
                if (times[i].period) {
                    for (var j = 0; j < times[i].period.length; j++) {
                        var top = (row - 1) * td_height + 2;
                        var left = get_left(times[i].period[j].start_hour, times[i].period[j].start_minute);
                        var width = get_width(left, times[i].period[j].end_hour, times[i].period[j].end_minute);
                        var o = document.createElement("div");
                        $(o).attr("class", "blur_obj chunk");
                        $(o).css({ "top": top }).attr("row", row);
                        $(o).css({ "left": left, "width": width });
                        if (width >= 1) {
                            $("#container").get(0).appendChild(o);
                        }
                    }
                }
            }
            var rec_type;
            if (g_record_param['rec_type']) {
                rec_type = g_record_param.rec_type;
            } else {
                rec_type = 2
            }
            $("#rec_type").select_val(rec_type)
        })
    }
    function set_record_param() {
        var enable = $("#recode_time_enable").check_val() ? 1 : 0;
        var cfg = {};
        cfg.type = "STORE_SET_RECORD_PARA_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        cfg.body = {};
        cfg.body.channel = [];
        g_record_param.mode = enable;
        g_record_param.record_param.time = [];
        for (var i = 0; i < 7; i++) {
            var j = {};
            j.period = [];
            var row = i;
            if (i == 0) {
                row = 7;
            }
            var id = 0;
            $("#container div[row='" + row + "']").each(function () {
                var left = $(this).position().left;
                var width = $(this).width();
                var json = {};
                json.id = id;
                json.start_hour = parseInt(get_hour(left));
                json.start_minute = parseInt(get_min(left));
                var end_hour = parseInt(get_hour(left + width));
                var end_min = parseInt(get_min(left + width));
                var min = parseInt(end_hour) * 60 + parseInt(end_min);
                if (min >= 1440) {
                    end_hour = 23;
                    end_min = 59;
                }
                json.end_hour = end_hour;
                json.end_minute = end_min;
                j.period.push(json);
                id++;
            })
            j.count = j.period.length;
            j.id = i;
            g_record_param.record_param.time.push(j);
        }
        var rec_type = parseInt($("#rec_type").select_val());
        g_record_param.rec_type = rec_type;
        cfg.body.channel.push(g_record_param);
        post(cfg, function () {
            show_informer();
        });
    }
    this.init = function () {
        init_para();
        init_device();
        device_timer = setInterval(init_device, 3000);
        $("#draw_tb").mousemove(function () {
            return false;
        });
        time_period($("#container"), $("#txt"), $("#delete_time"), $("#clear_time"));
        if (!is_C3A) {
            get_record_param();
        }
        $("#set_recode_time").click(set_record_param);  //确定按钮
        $("#format_submit").click(function () {
            format();
            $("#outerdiv").hide();
        });
        $("#format_cancel").click(function () {
            $("#outerdiv").hide();
        });
        $("#pic_pro").change(function () {
            var val = $(this).val();
            if (isNaN(val) || val < 10 || val > 90) {
                val = 40;
                $(this).val(val);
            }
            var val1 = 100 - val;
            $("#video_pro").val(val1);
        });
        $("#video_pro").change(function () {
            var val = $(this).val();
            if (isNaN(val) || val < 10 || val > 90) {
                val = 40;
                $(this).val(val);
            }
            var val1 = 100 - val;
            $("#pic_pro").val(val1);
        });
        init_selectmenu("#rec_type", 200, 150)
    }
    this.close = function () {
        clearInterval(device_timer);
        device_timer = null;
    }
    close_json["Storge_Antuo"] = this.close;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//videorecord
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var VideoRecord = new function () {
    var video_timer;
    function get_authority() {
        var cfg = {};
        cfg.type = "get_user_auth";
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            url: "getauth.php",
            type: "POST",
            data: jsonstr,
            timeout: 5000,
            success: function (ajaxdata) { }
        })
    }
    this.init = function () {
        video_timer = setInterval(function () { get_authority(); }, 10000);
        init_activex_new("#live", 9, 1, function () { });
    }
    this.close = function () {
        clearInterval(video_timer);
        video_timer = null;
        stop_video("ax");
    }
    close_json["VideoRecord"] = this.close;
}
var BusinessRecord = new function () {
    var realserver = null, cur_page = 0, all_page = 0, num = 0, page_size = 100, searched = false;
    function init_para() {
        searched = false;
        g_cfg_table_cur_index = -1;
        cur_page = 0;
        all_page = 0;
        num = 0;
        var new_href = location.href;
        realserver = new_href.split('/');
        realserver = realserver[realserver.length - 2];
        realserver = realserver.split(':')[0];
    }
    function showbigimg(outerdiv, innerdiv, bigimg, smallimg, src) {
        $(bigimg).hide();
        $(smallimg).hide();
        var windowW = $(window).width();
        var windowH = $(window).height();

        var w, h;
        var realWidth = windowW;
        var realHeight = realWidth * 9 / 16;
        if (realHeight > windowH) {
            realWidth = windowH * 16 / 9;
            realHeight = windowH;
        }
        if (realWidth > windowW - 200) {
            realWidth = windowW - 200;
            w = (windowW - realWidth) / 2;
        }
        else {
            w = (windowW - realWidth) / 2;
        }
        if (realHeight > windowH) {
            realHeight = windowH;
            h = 0;
        }
        else {
            h = (windowH - realHeight) / 2;
        }
        var b_load = false;
        $(bigimg).attr("src", src).load(function () {
            if (!b_load) {
                $(bigimg).show();
                b_load = true;
                var natural = getNatural($(bigimg).get(0));
                var width = natural.width > realWidth ? realWidth : natural.width;
                var height = natural.height > realHeight ? realHeight : natural.height;
                $(bigimg).css({ "width": width, "height": height, "margin-top": (realHeight - height) / 2, "margin-left": (realWidth - width) / 2 });
            }
        });
        $(bigimg).css({ "width": realWidth, "height": realHeight, "margin-top": 0, "margin-left": 0 });
        $(innerdiv).css({ "top": h, "left": w });
        $(outerdiv).fadeIn("fast");
    }
    function get_data(update_page_num) {
        var type = parseInt($("#incident").select_val());
        var start_time = $("#start_time").val();
        var end_time = $("#end_time").val();
        if (start_time == "") {
            show_informer_text($.i18n.prop("begin_time_empty"));
            return;
        }
        if (end_time == "") {
            show_informer_text($.i18n.prop("end_time_empty"));
            return;
        }
        var s_t = new Date(start_time.replace(/-/g, "/")).getTime();
        var e_t = new Date(end_time.replace(/-/g, "/")).getTime();
        if (s_t > e_t) {
            show_informer_text($.i18n.prop("start_time_cannot_exceed_end_time"));
            return;
        }
        if (cur_page == 0) {
            cur_page = 1;
        }
        var g_plate = $.trim($("#plate").val());
        $("#search_pic_tb .disabled_btn").attr("disabled", "disabled").css("color", "gray");
        var cfg = {};
        cfg.type = "STORE_SEARCH_IMG_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        cfg.body = {};
        cfg.body.page_size = page_size;
        cfg.body.page_num = cur_page;
        var condition = {};
        condition.plate = g_plate;
        condition.start_time = start_time;
        condition.end_time = end_time;
        condition.trigger = type;
        cfg.body.condition = condition;
        post(cfg, function (jsondata) {
            $("#search_pic_tb .disabled_btn").removeAttr("disabled").css("color", "#fff");
            var json = jsondata.body;
            var total = json.pics_total;
            var rows = null;
            if (total != 0) {
                rows = json.rows;
            } else {
                $("#rec_tb").html("");
                show_informer($.i18n.prop("no_data"))
                return
            }
            if (update_page_num) {
                all_page = Math.ceil(total / page_size);
                if (all_page == 0) {
                    cur_page = 0;
                } else {
                    cur_page = 1;
                }
                $("#total").html(total);
                $("#all_page").html(all_page);
                $("#cur_page").html(cur_page);
            }
            if (rows) {
                num = 0;
                var str = "";
                for (var i = 0; i < rows.length; i++) {
                    num++;
                    var event_type = "";
                    if (rows[i].trigger == 2) {
                        event_type = $.i18n.prop("ouch_hair");
                    } else if (rows[i].trigger == 4) {
                        event_type = $.i18n.prop("manually_capture");
                    } else if (rows[i].trigger == 8) {
                        event_type = $.i18n.prop("virtual_coil");
                    } else if (rows[i].trigger == 1) {
                        event_type = $.i18n.prop("stable_recognition");
                    }
                    var plate_type = rows[i].plate;
                    var time = new Date(rows[i].recg_time * 1000);
                    time = time.format("YYYY-MM-DD hh:mm:ss");
                    str += "<tr src='" + rows[i].id + "'><td style='width:100px;'><input type='checkbox'/></td><td style='width:100px;'>" + num + "</td><td style='width:350px;'>" + time + "</td><td style='width:250px;'>" + plate_type + "</td><td style='width:240px;'>" + event_type + "</td></tr>";
                }
                $("#rec_tb").html(str);
                $("#result_container")[0].scrollTop = 0;
            } else {
                $("#rec_tb").html("");
            }
        }, function () {
            $("#search_pic_tb .disabled_btn").removeAttr("disabled").css("color", "#fff");
        })
    }
    function search() {
        searched = true;
        num = 0;
        cur_page = 1;
        $("#all_cancel").check_val(true);
        $("#total").html("0");
        $("#all_page").html("0");
        $("#cur_page").html("0");
        get_data(true);
    }
    function pre_page() {
        if (!searched) {
            return;
        }
        if (cur_page <= 1) {
            show_informer_text($.i18n.prop("its_first_page"));
            return;
        }
        $("#all_cancel").check_val(true);
        cur_page -= 1;
        $("#cur_page").html(cur_page);
        get_data();
    }
    function next_page() {
        if (!searched) {
            return;
        }
        if (cur_page >= all_page) {
            show_informer_text($.i18n.prop("its_last_page"));
            return;
        }
        $("#all_cancel").check_val(true);
        cur_page += 1;
        $("#cur_page").html(cur_page);
        get_data();
    }
    function first_page() {
        if (!searched) {
            return;
        }
        num = 0;
        $("#all_cancel").check_val(true);
        cur_page = 1;
        $("#cur_page").html(cur_page);
        get_data();
    }
    function last_page() {
        if (!searched) {
            return;
        }
        $("#all_cancel").check_val(true);
        cur_page = all_page;
        $("#cur_page").html(cur_page);
        get_data();
    }
    function goto_page() {
        if (!searched) {
            return;
        }
        var goto_page = parseInt($("#page").val());
        if (all_page == 0) {
            show_informer_text($.i18n.prop("no_data"));
            return;
        }
        if (isNaN(goto_page) || goto_page < 1 || goto_page > all_page) {
            show_informer_text($.i18n.prop("page_error"));
            return;
        }
        $("#all_cancel").check_val(true);
        cur_page = goto_page;
        $("#cur_page").html(cur_page);
        get_data();
    }
    function clear() {
        $("#rec_tb").html("");
        all_page = 0;
        cur_page = 0;
        total = 0;
        $("#total").html(total);
        $("#all_page").html(all_page);
        $("#cur_page").html(cur_page);
    }
    function radio_change() {
        if ($("#all_select").check_val()) {
            $("#rec_tb input[type='checkbox']").attr("checked", "checked");
        } else {
            $("#rec_tb input[type='checkbox']").removeAttr("checked");
        }
    }
    function default_img() {
        $(this).attr("src", "../js/FileTree/images/black.jpg");
    }
    function get_file() {
        var check_arr = [];
        $("#rec_tb input[type='checkbox']").each(function () {
            if ($(this).prop('checked')) {
                var name = $(this).parents("tr").attr("src");
                var json = {};
                json.id = 1;
                json.imgName = Base64.encode(name, true);
                check_arr.push(json);
            }
        });
        if (check_arr.length == 0) {
            show_informer_text($.i18n.prop("select_download_img"));
            return;
        }
        var ax = GetAX("ax");
        if (!ax) {
            show_informer_text($.i18n.prop("no_ax"));
            return;
        }
        update_download_state("stop");
        $("#download_status").html("");
        var req = {};
        req.img_ids = check_arr;
        var jsonstr = JSON.stringify(req);
        ax.QueryCmd("PlateImgDownload", jsonstr, "1", function (response_data) {
            if (response_data == "OK") {
                get_download_status();
            } else {
                update_download_state("download");
            }
        });
    }
    function update_download_state(state) {
        if (state == "download") {
            $("#download").attr("state", "download").val($.i18n.prop('download'));
        } else if (state == "stop") {
            $("#download").attr("state", "stop").val($.i18n.prop('stop'));
        }
    }
    var status_timer = null;
    function get_download_status() {
        var ax = GetAX("ax");
        if (!ax) return;
        status_timer = setInterval(function () {
            ax.QueryCmd("QueryAllDownloadStatus", "", "1", function (data) {
                var json = JSON.parse(data);
                var finished = json.finished;
                var total_count = json.total_count;
                var success_count = json.success_count;
                var failed_count = json.failed_count;
                $("#download_status").html("总数 " + total_count + " , 成功 " + success_count + " , 失败 " + failed_count);
                if (finished) {
                    clearInterval(status_timer);
                    update_download_state("download");
                }
            });
        }, 1000);
    }
    function init_time() {
        var data = new Date();
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = data.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var now = new Date();
        var s_t = year + "-" + month + "-" + day + " 00:00:00";
        var e_t = now.format("YYYY-MM-DD hh:mmm:sss");
        $("#start_time").change(clear).val(s_t);
        $("#end_time").change(clear).val(e_t);
    }
    var g_cfg_table_cur_index = -1;

    function select_comm_cfg_table_item(index) {
        if (index < 0) return false;
        var tr_item = $("#rec_tb tr");
        if (tr_item.eq(index).length == 0) return false;
        if (g_cfg_table_cur_index != -1 && g_cfg_table_cur_index < tr_item.length) {
            tr_item.eq(g_cfg_table_cur_index).removeClass("ui-state-active");
        }
        tr_item.eq(index).addClass("ui-state-active");
        g_cfg_table_cur_index = index;
    }
    function get_img(id) {
        var cfg = {}
        cfg.type = "STORE_READ_IMG_REQUEST";
        cfg.module = "STORE_BUSINESS_REQUEST";
        cfg.body = {}
        cfg.body.id = id;
        post(cfg, function (res) {
            var src = res.body.image_path + '?' + new Date().getTime();
            showbigimg("#outerdiv", "#innerdiv", "#bigimg", "#smallimg", src);
        })
    }
    this.init = function () {
        init_activex_new("#live", 303, 0);
        init_selectmenu("#incident", 220, 150);
        init_para();
        init_time();
        $("#download").click(get_file);
        $("#search").click(search);
        $("#pre_page").click(pre_page);
        $("#next_page").click(next_page);
        $("#first_page").click(first_page);
        $("#last_page").click(last_page);
        $("#goto_page").click(goto_page);
        $("input[name='select']").click(radio_change);
        $("#picture_img").error(default_img);
        $(document).on("dblclick", "#rec_tb tr", function () {
            var id = $(this).attr("src");
            get_img(id);
        })
        $(document).on("click", "#rec_tb tr", function () {
            select_comm_cfg_table_item($(this).index(), true);
        });
        $("#cha").click(function () {
            $("#outerdiv").fadeOut("fast");
        });
        $("#left_arrows").click(function () {
            if (g_cfg_table_cur_index > 0) {
                select_comm_cfg_table_item(g_cfg_table_cur_index - 1);
                var tr = $("#rec_tb tr").eq(g_cfg_table_cur_index);
                var id = tr.attr("src");
                get_img(id);
            } else {
                show_informer_text($.i18n.prop("no_more"));
            }
        });
        $("#right_arrows").click(function () {
            var length = $("#rec_tb tr").length - 1;
            if (g_cfg_table_cur_index < length) {
                select_comm_cfg_table_item(g_cfg_table_cur_index + 1);
                var tr = $("#rec_tb tr").eq(g_cfg_table_cur_index);
                var id = tr.attr("src");
                get_img(id);
            } else {
                show_informer_text($.i18n.prop("no_more"));
            }
        });
    }
    this.close = function () {
        $(document).off("dblclick", "#rec_tb tr");
        $(document).off("click", "#rec_tb tr");
    }
    close_json['BusinessRecord'] = this.close
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Config
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Config = new function () {
    var opera_type = 0;
    function check_connection(call_back) {
        $.get("vb.htm?getnetip", function (ajaxdata) {
            if (precheck(ajaxdata)) return false;
            call_back();
        });
    }
    function set_progressbar_val(jindu_num) {
        $("#progressbar").progressbar({
            value: jindu_num
        });
        $(".progress-bar").css("width", jindu_num + "%");
        $(".progress-label").html(jindu_num + "%");
    }
    var xhrOnProgress = function (fun) {
        xhrOnProgress.onprogress = fun; //绑定监听
        //使用闭包实现监听绑
        return function () {
            //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
            var xhr = $.ajaxSettings.xhr();
            //判断监听函数是否为函数
            if (typeof xhrOnProgress.onprogress !== 'function')
                return xhr;
            //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
            if (xhrOnProgress.onprogress && xhr.upload) {
                xhr.upload.onprogress = xhrOnProgress.onprogress;
            }
            return xhr;
        }
    }

    function Submit() {
        var fileObj = document.getElementById("file_input").files[0]; // js 获取文件对象
        var formFile = new FormData();

        formFile.append("file", fileObj); //加入文件对象

        var data = formFile;
        $.ajax({
            url: "configrestore.cgi",
            data: data,
            type: "Post",
            cache: false,//上传文件无需缓存
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            xhr: xhrOnProgress(function (e) {
                var percent = parseInt(e.loaded / e.total * 100);
                set_progressbar_val(percent);
            }),
            success: function (result) {
                var r = result;
                if (r == undefined || r.length == 0) {
                    $("#warning_text").css("color", "Red");
                    $("#warning_text").html($.i18n.prop("import_failed_hint"));
                }
                else if (r.match(/All upload success/)) {
                    $("#warning_text").css("color", "Green");
                    $("#warning_text").html($.i18n.prop("import_done_hint"));
                    $.get("vb.htm", { ipcamrestartcmd: "" }, null);
                }
                else if (r.match(/All upload failed/)) {
                    $("#warning_text").css("color", "Red");
                    $("#warning_text").html($.i18n.prop("import_failed_hint"));
                }
                else {
                    $("#warning_text").css("color", "Red");
                    $("#warning_text").html($.i18n.prop("import_failed_hint"));
                }
            },
            error: function () {
                $("#warning_text").css("color", "Red");
                $("#warning_text").html($.i18n.prop("import_failed_hint"));
            }
        })
    }
    var loaded = true;
    function on_iframe_loaded() {
        if (loaded) {
            return;
        }
        loaded = true;
        var r;
        try {
            r = getIFrameContent("hidden_frame");
        }
        catch (e) {
        }
        if (r == undefined || r.length == 0) {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("import_failed_hint"));
        }
        else if (r.match(/All upload success/)) {
            $("#warning_text").css("color", "Green");
            $("#warning_text").html($.i18n.prop("import_done_hint"));
            $.get("vb.htm", { ipcamrestartcmd: "" }, null);
        }
        else if (r.match(/All upload failed/)) {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("import_failed_hint"));
        }
        else {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("import_failed_hint"));
        }
    }
    //取iframe的innerHTML
    function getIFrameContent(id) {
        var hidden_fr = document.getElementById(id);
        if (document.getElementById) {
            if (hidden_fr && !window.opera) {
                if (hidden_fr.contentDocument) {
                    return hidden_fr.contentDocument.body.innerHTML;
                } else if (hidden_fr.Document) {
                    return hidden_fr.Document.body.innerHTML;
                }
            }
        }
    }
    function export_config() {
        var general = $("#general_param").check_val() ? 1 : 0;
        var system = $("#system_param").check_val() ? 1 : 0;
        var security = $("#security_param").check_val() ? 1 : 0;
        if (!general && !system && !security) {
            show_informer_text($.i18n.prop("no_select_parameter"));
            return false;
        }

        var cfg = {};
        cfg.type = "config_backup";
        cfg.body = {};
        cfg.body.general = general;
        cfg.body.system = system;
        cfg.body.security = security;
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: 'configbackup.php',
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    var data = json.body.data
                    location.href = Base64.decode(data, true);
                }
            },
            dataType: "text"
        });
    }
    function import_config() {
        check_connection(function () {
            $("#warning_text").css("color", "Red");
            $("#warning_text").html($.i18n.prop("import_hint"));
            if (ie.isIE && ie.version <= 9) {
                loaded = false;
                $("#frmUpdate").submit();
            } else {
                $("#progressbar_tr").show();
                Submit();
            }
        });
    }
    function show_identification(type) {
        opera_type = type;
        $("#username").val('');
        $("#usrpwd").val('');
        $('#identificationModal').modal("show");
    }
    function identification() {
        $('#identificationModal').modal("hide");
        var username = $("#username").val();
        if (username != "admin") {
            show_informer_text($.i18n.prop('identification'))
            return
        }
        if (username.length == 0) {
            alert($.i18n.prop("enter_user_name"));
            return
        }
        if (!username.match(/^.{4,33}$/)) {
            alert($.i18n.prop("user_name_length_tips") + " 4~33");
            return
        }
        var pwd = $("#usrpwd").val();
        if (pwd.length == 0) {
            alert($.i18n.prop("user_pwd_null_tips"));
            return
        }
        if (pwd.length > 33) {
            alert($.i18n.prop("user_pwd_length_tips") + "4~33");
            return
        }
        if (pwd.match(/[:]{1}/)) {
            alert($.i18n.prop("user_pwd_symbol_tips"));
            return
        }
        var postdata = username + ":" + pwd;
        passwd = "天天";
        var outtext = AesCtr.encrypt(postdata, passwd, 128);
        $.ajax({
            type: 'POST',
            url: "login.php",
            data: outtext,
            success: function (ajaxdata) {
                if (ajaxdata == "OK") {
                    if (opera_type == 0) {
                        import_config()
                    } else {
                        export_config()
                    }
                }
                else {
                    show_informer_text($.i18n.prop('identity_failed'))
                }
            },
            error: function (error) {
                show_informer_text($.i18n.prop('identity_failed'))
            }
        });
    }
    function get_module_app_cfg() {
        var cfg = {};
        cfg.type = "get_module_app_cfg";
        cfg.module = "MODULE_CONFIG_INFO";
        post(cfg, function (res) {
            var arr = res.body.app
            var str = "<tr>";
            for (var i = 1; i <= arr.length; i++) {
                str += "<td style='min-width:180px;'><input type='checkbox' ";
                if (arr[i - 1].enable == 1) {
                    str += " checked='checked' "
                }
                str += " class='app' app_name='" + arr[i - 1].name + "' id='app_" + arr[i - 1].name + "'/><label style='font-weight:normal;' for='app_" + arr[i - 1].name + "'>" + Base64.decode(arr[i - 1].alias, true) + "（" + arr[i - 1].rss + "MB）</label></td>";
                if (i % 4 == 0 && arr.length != i) {
                    str += "</tr><tr>"
                }
            }
            str += "</tr>";
            $("#module_tb").html(str);
            init_checkbox('input[type=checkbox]');
        })
    }

    function set_module_app_cfg() {
        var cfg = {}
        cfg.type = "set_module_app_cfg";
        cfg.module = "MODULE_CONFIG_INFO";
        cfg.body = {};
        var arr = [];
        $(".app").each(function () {
            var json = {};
            json.name = $(this).attr("app_name");
            json.enable = $(this).check_val() ? 1 : 0;
            arr.push(json);
        })
        cfg.body.app = arr;
        post(cfg, function () {
            show_informer();
        })
    }
    function default_module() {
        var cfg = {}
        cfg.type = "reset_module_app_cfg";
        cfg.module = "MODULE_CONFIG_INFO";
        post(cfg, function () {
            show_informer();
            get_module_app_cfg();
        })
    }
    this.init = function () {
        if (ie.isIE && ie.version <= 9) {
            $("#hidden_frame").on("load", on_iframe_loaded);
        }
        $("#import").click(function () {
            var value = $("#file_input").val();
            if (value.substring(value.length - 4) != ".cfg") {
                show_informer_text($.i18n.prop("parameter_file_error"));
                return false;
            }
            show_identification(0);
        });
        $("#export").click(function () {
            show_identification(1);
        });
        $("#identification_submit").click(identification);
        $("#identification_cancel").click(function () {
            $('#identificationModal').modal("hide");
        });
        $("#submit_module").click(function () {
            if (confirm($.i18n.prop('module_submit_hint'))) {
                set_module_app_cfg()
                $.get("vb.htm", { ipcamrestartcmd: "" }, null);
                $("#warning_text").css("color", "Green");
                $("#warning_text").html($.i18n.prop("restart_wait_hint"));
            } else {
                set_module_app_cfg()
            }
        });
        $("#default_module").click(default_module);
        get_module_app_cfg();
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Recog
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Recog = new function () {
    var loaded = true;
    function init_para() {
        loaded = true;
    }
    function disable_other_btns() {
        $("#update").attr("disabled", "disabled");
    }

    function enable_other_btns() {
        $("#update").removeAttr("disabled");
    }
    function on_iframe_loaded() {
        if (loaded) {
            return;
        }
        enable_other_btns();
        loaded = true;
        var r;
        var error = false;
        try {
            r = getIFrameContent("hidden_frame");
        }
        catch (error) {
            error = true;
        }
        $(".loading").hide();
        if (error || r == undefined || r.length == 0) {
            show_informer_text($.i18n.prop("upload_failed_hint"));
        }
        else if (r.match(/All upload success/)) {
            show_informer($.i18n.prop("uploaded_success"));
            start_rec();
        }
        else {
            show_informer_text($.i18n.prop("uploaded_failed"));
        }
    }
    //取iframe的innerHTML
    function getIFrameContent(id) {
        var hidden_fr = document.getElementById(id);
        if (document.getElementById) {
            if (hidden_fr && !window.opera) {
                if (hidden_fr.contentDocument) {
                    return hidden_fr.contentDocument.body.innerHTML;
                } else if (hidden_fr.Document) {
                    return hidden_fr.Document.body.innerHTML;
                }
            }
        }
    }
    var result_timer = null;
    var g_MD5info = '';
    function start_get_result() {
        result_timer = setInterval(function () {
            get_result();
        }, 2000);
    }
    function get_result() {
        var cfg = {}
        cfg.type = "ivs_get_result_again";
        cfg.body = {};
        cfg.body.MD5info = g_MD5info;
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: 'ivs_result_again.php',
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    prase_data(json);
                    clearInterval(result_timer);
                } else if (json.state == 401) {
                    show_informer_text($.i18n.prop("no_data"));
                    clearInterval(result_timer);
                }
            },
            dataType: "text"
        });
    }
    function start_rec() {
        var cfg = {}
        cfg.type = 'ivs_start_process_again'
        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: 'ivs_result_again.php',
            data: jsonstr,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    g_MD5info = json.body.MD5info;
                    start_get_result()
                }
            },
            dataType: "text"
        });
    }
    var canvas_width = 405;
    var canvas_height = 315;
    function prase_data(json) {
        var pr = json.body.PlateResult;
        var plate = pr.license
        var plate_type = $.i18n.prop(car_type_arr[pr.nType])
        var plate_color = $.i18n.prop(car_color_arr[pr.color])
        var loc = {}
        loc.left = pr.plate_left;
        loc.right = pr.plate_right;
        loc.top = pr.plate_top;
        loc.bottom = pr.plate_bottom;
        var src = $("#preview").attr('src');
        $("#result").attr('src', src).show();
        var img = new Image();
        img.src = src;
        img.onload = function () {
            var image_width = this.width;
            var image_height = this.height;
            loc.top = parseInt(canvas_height * loc.top / image_height);
            loc.bottom = parseInt(canvas_height * loc.bottom / image_height);
            loc.left = parseInt(canvas_width * loc.left / image_width);
            loc.right = parseInt(canvas_width * loc.right / image_width);
            var c = document.getElementById('canvas');
            const context = c.getContext('2d');
            context.clearRect(0, 0, canvas_width, canvas_height);
            context.strokeStyle = '#ff0000';
            context.strokeRect(loc.left, loc.top, (loc.right - loc.left), (loc.bottom - loc.top));
            context.fillStyle = '#ff0000';
            context.font = 'bold 12px Arial';
            context.fillText('[' + plate + '] ' + plate_type + ' ' + plate_color, 10, canvas_height - 20);
        }
    }
    this.init = function () {
        init_para();
        $("#hidden_frame").on("load", on_iframe_loaded);
        $("#frmUpdate").submit(function () {
            loaded = false;
            flag = true;
        });
        $("#file_input").change(function () {
            if (!ie.isIE || ie.isIE && ie.version >= 10) {
                var file = this.files[0];
                var size = file.size.toFixed(1)
                if (size > 2 * 1024 * 1024) {
                    show_informer_text($.i18n.prop("upload_recog_suffix"));
                    $("#file_input").val("");
                    return
                }
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    var src = this.result
                    var img = new Image()
                    img.src = src
                    img.onload = function () {
                        var width = this.width
                        var height = this.height
                        if (width > 2304 || height > 1296 || width < 640 || height < 480) {
                            show_informer_text($.i18n.prop("upload_recog_suffix"));
                            $("#file_input").val("");
                            return
                        }
                        $("#preview").attr("src", src).show();
                    }
                }
            }
        });
        $("#recog").click(function () {
            var value = $("#file_input").val();
            if (value == "") {
                show_informer_text($.i18n.prop("upload_error_hint"));
                return false;
            }
            value = value.substring(value.lastIndexOf(".") + 1);
            value = value.toUpperCase();
            if (value != "JPG" && value != "JPEG") {
                show_informer_text($.i18n.prop("upload_recog_suffix"));
                return false;
            }
            disable_other_btns();
            $("#frmUpdate").submit();
        });
    }
    this.close = function () {
        clearInterval(result_timer);
        result_timer = null;
    }
    close_json['Recog'] = this.close
}
var Linkage = new function () {
    var g_mode = 0;
    function get_ast_mode() {
        var req = {};
        req.type = "get_ast_mode";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                g_mode = json_data.mode;
                if (g_mode == "faster") {
                    $("#fast_mode").check_val(true)
                } else if (g_mode == "aggregated") {
                    $("#delay_mode").check_val(true)
                } else if (g_mode == "direct") {
                    $("#more_mode").check_val(true)
                }
            }
        });
    }

    function set_ast_mode() {
        var mode = '';
        if ($("#fast_mode").check_val()) {
            mode = "faster"
        } else if ($("#delay_mode").check_val()) {
            mode = "aggregated"
        } else if ($("#more_mode").check_val()) {
            mode = "direct"
        }
        if (g_mode == mode) {
            return;
        }
        var req = {};
        req.type = "set_ast_mode";
        req.mode = mode;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_ast_mode();
            }
        });

    }
    var g_dealy_time = 0;
    function get_ast_dealy_time() {
        var req = {};
        req.type = "get_ast_dealy_time";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                g_dealy_time = json_data.dealy_time;
                $("#delay_txt").val(json_data.dealy_time);
            }
        });
    }

    function set_ast_dealy_time() {
        var delay_txt = parseInt($("#delay_txt").val());
        if (g_dealy_time == delay_txt) {
            return false;
        }
        var req = {};
        req.type = "set_ast_dealy_time";
        req.dealy_time = delay_txt;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_ast_dealy_time();
            }
        });
    }
    var g_match_mode = 0;
    function get_device_match_mode() {
        var req = {};
        req.type = "get_device_match_mode";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                g_match_mode = json_data.mode;
                if (json_data.mode == "fuzzy_mode") {
                    $("#fuzzy_check").check_val(true);
                } else {
                    $("#exact_check").check_val(true);
                }
            }
        });
    }

    function set_device_match_mode() {
        var match_mode = $("#exact_check").is(":checked") ? "exact_mode" : "fuzzy_mode";
        if (g_match_mode == match_mode) {
            return false;
        }
        var req = {};
        req.type = "set_device_match_mode";
        req.mode = match_mode;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_device_match_mode();
            }
        });
    }
    var g_platefilter;
    function get_group_shared_io() {
        var req = {};
        req.type = "get_group_shared_io";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                var decode = json_data.value;
                g_platefilter = decode;
                var mask = 0x1;

                var out1 = decode & mask;
                var out2 = decode & (mask << 1);
                var out3 = decode & (mask << 2);
                var out4 = decode & (mask << 3);
                var out5 = decode & (mask << 4);
                var out6 = decode & (mask << 5);
                var in1 = decode & (mask << 16);
                var in2 = decode & (mask << 17);
                var in3 = decode & (mask << 18);
                var in4 = decode & (mask << 19);

                $("#out1").check_val(out1 > 0);
                $("#out2").check_val(out2 > 0);
                $("#out3").check_val(out3 > 0);
                $("#out4").check_val(out4 > 0);
                $("#out5").check_val(out5 > 0);
                $("#out6").check_val(out6 > 0);
                $("#in1").check_val(in1 > 0);
                $("#in2").check_val(in2 > 0);
                $("#in3").check_val(in3 > 0);
                $("#in4").check_val(in4 > 0);
            }
        });
    }
    function set_group_shared_io() {
        var req = {};
        req.type = "set_group_shared_io";
        var out1 = $("#out1").check_val() ? "1" : "0";
        var out2 = $("#out2").check_val() ? "1" : "0";
        var out3 = $("#out3").check_val() ? "1" : "0";
        var out4 = $("#out4").check_val() ? "1" : "0";
        var out5 = $("#out5").check_val() ? "1" : "0";
        var out6 = $("#out6").check_val() ? "1" : "0";
        var in1 = $("#in1").check_val() ? "1" : "0";
        var in2 = $("#in2").check_val() ? "1" : "0";
        var in3 = $("#in3").check_val() ? "1" : "0";
        var in4 = $("#in4").check_val() ? "1" : "0";

        var platefilter = parseInt(out1) | (parseInt(out2) << 1) | (parseInt(out3) << 2) | (parseInt(out4) << 3) | (parseInt(out5) << 4) | (parseInt(out6) << 5) | (parseInt(in1) << 16) | (parseInt(in2) << 17) | (parseInt(in3) << 18) | (parseInt(in4) << 20);
        req.value = platefilter;
        if (g_platefilter == platefilter) {
            return false;
        }
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                DeviceGroup.get_group_shared_io();
            }
        });
    }
    var g_group_model = 0;
    function get_group_model(callback) {
        var req = {};
        req.type = "get_group_model";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                var enable = json_data.enable;
                g_group_model = enable;
                $("#group_model").check_val(enable == 1);
                ele_change(enable, 'disable_assist');
                ele_change(vzid_astType, 'disable_assist2')
                if (callback) {
                    callback()
                }
            }
        });
    }
    function set_group_model() {
        var enable = $("#group_model").check_val() ? 1 : 0;
        if (g_group_model == enable) {
            return;
        }
        var req = {};
        req.type = "set_group_model";
        req.enable = enable;
        dg_json_ajax(req, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer();
                get_bind_info();
            }
        });
    }
    function set_group(callback) {
        var data = JSON.parse(g_device_data_json);
        var garage_name = get_nosamename($.i18n.prop("garage"), "", 1);
        var assist_name = $.i18n.prop("assist") + parseInt(new Date().getTime() / 1000);
        var device_flag = Base64.encode(new Date().getTime() + '');
        data['vzid'].name = get_vz_name(garage_name, assist_name, device_flag);
        data['vzid'].ast_type = 1;
        var type = data['vzid'].type;
        var list = data["group_cfg"]["group_vzids"];
        $(".cm_td .device").each(function () {
            var device_type = $(this).attr('device_type')
            if (device_type == 'R3') {
                var sn = $(this).attr('sn');
                var ip = $(this).attr('ip');
                var name = get_assist_name(ip, garage_name, assist_name, device_flag)
                for (var i = 0; i < list.length; i++) {
                    if (list[i].sn == sn) {
                        list[i].name = name
                        list[i].ast_type = 2
                        list[i].type = type
                        break
                    }
                }
            }
        })
        var assists = $(".cm_td .device[device_type='R3']")
        if (assists.length == 0) {
            data['vzid'].name = "";
            data['vzid'].ast_type = 0;
        }
        data.type = "set_group_cfg";
        dg_json_ajax(data, function (ajaxdata) {
            var json = eval("(" + ajaxdata + ")");
            if (json.state == 200) {
                show_informer($.i18n.prop("save_success"), 5000);
                reget_data()
                if (callback) {
                    callback()
                }
            }
        });
    }
    function dg_submit() {
        var enable = $("#group_model").check_val() ? 1 : 0;
        if (g_group_model != enable && g_group_switch == 0) {
            if (confirm('修改联动模式设备将重启，是否继续？')) {
                all_submit()
            }
        } else {
            all_submit()
        }
    }
    function all_submit() {
        if (vzid_astType != 2) {
            var delay_txt = parseInt($("#delay_txt").val());
            if (isNaN(delay_txt) || delay_txt < 100 || delay_txt > 5000) {
                show_informer_text($.i18n.prop("delay_txt_hint") + "100~5000");
                return false;
            }
            // set_group(function () {
            set_ast_mode();
            set_ast_dealy_time();
            set_device_match_mode();
            set_group_shared_io();
            set_group_model();
            // });
        } else {
            set_group_model();
        }
    }
    function get_talk_para() {
        var cfg = {};
        cfg.type = "ps_get_voice_config";

        var jsonstr = JSON.stringify(cfg);
        $.ajax({
            type: "POST",
            url: "avsjson.php",
            data: jsonstr,
            dateType: "text",
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var jsondata = eval("(" + ajaxdata + ")");
                var gpio_port = jsondata.talk_io;
                if (gpio_port == 1) {
                    $("#in1").check_disabled(true);
                } else if (gpio_port == 2) {
                    $("#in2").check_disabled(true);
                } else if (gpio_port == 4) {
                    $("#in3").check_disabled(true);
                } else if (gpio_port == 8) {
                    $("#in4").check_disabled(true);
                }
            }
        });
    }
    var vzid_name = "";
    var vzid_sn = "";
    var vzid_ip = "";
    var vzid_type = "";
    var vzid_astType = 0;
    var g_device_data_json = "";
    var g_carport = "";
    var close_page = false
    function init_tree_and_tb(ajaxdata) {
        if (precheck(ajaxdata) || close_page) {
            return false;
        }
        var json_data;
        try {
            json_data = eval("(" + ajaxdata + ")");
        } catch (e) {
            return false;
        }
        if (!json_data.vzid || !json_data.group_cfg) {
            return false;
        }
        g_carport = "";
        carport_option = [{ value: '', label: $.i18n.prop('new_garage') }]
        g_device_data_json = JSON.stringify(json_data);
        var type = json_data["vzid"].type;
        vzid_name = json_data["vzid"].name;
        vzid_sn = json_data["vzid"].sn;
        vzid_ip = json_data["vzid"].ip_addr;
        vzid_type = type;
        device_info[0].device_type = 'R3'
        device_info[0].sn = vzid_sn
        device_info[0].ip = vzid_ip
        var container = $('.device_con[index=0]')
        container.find('.device').show()
        container.find('.add_con').hide()
        if (ie.isIE) {
            get_user(0, function (user_info) {
                get_port(0, function (http_port) {
                    device_info[0].player = 'ax0'
                    init_activex_new("#live0", 510, 0, function () {
                    }, user_info, vzid_sn, vzid_ip, http_port);
                })
            })
        } else {
            device_info[0].player = new VideoPlayer()
            device_info[0].player.get_video_src("flvVideo0", "video0", 1, vzid_ip, '', 'R3')
            get_rule(0)
        }
        vzid_astType = json_data["vzid"]['ast_type'];
        if (g_group_model == 1) {
            ele_change(1, 'disable_assist2')
        }
        if (vzid_astType == 1) {
            $("#main_assist").html($.i18n.prop('native_main'))
            $("#main_assist2").html($.i18n.prop('assist_camera'))
            $(".main_show").show();
            $(".assist_show").hide();
            $("#group_model").check_enable(true)
            $("#group_model").check_enable(true)
        } else if (vzid_astType == 2) {
            $("#main_assist").html($.i18n.prop('native_assist'))
            $("#main_assist2").html($.i18n.prop('main_camera'))
            $(".main_show").hide();
            $(".assist_show").show();
            $("#group_model").check_disabled(true)
            ele_change(0, 'disable_assist2')
        } else {
            $("#main_assist").html("")
            $("#main_assist2").html($.i18n.prop('assist_camera'))
            $(".main_show").show();
            $(".assist_show").hide();
            $("#group_model").check_enable(true)
            $("#group_model").check_enable(true)
        }
        var t = $.i18n.prop("unknown");
        if (type == "input") {
            t = $.i18n.prop("entrance");
        } else if (type == "output") {
            t = $.i18n.prop("exit");
        }
        $(".device_con[index=0] .cur_ip").html(json_data["vzid"].ip_addr);
        $(".device_con[index=0]").attr('sn', json_data["vzid"].sn).attr('device_type', 'R3');
        $("#cur_ip").html(json_data["vzid"].ip_addr);
        $("#cur_ip").attr('name', vzid_name);
        $(".cur_type").html(t);

        var list = json_data["group_cfg"]["group_vzids"];
        for (var i = 0; i < list.length; i++) {
            if (list[i].name != "") {
                get_tree_znode(list[i]);
            }
        }
        add_cm(complement_arr)
        init_device_con()
    }
    function unbind_group(callback) {
        if (confirm($.i18n.prop('remove_device_hint'))) {
            var data = JSON.parse(g_device_data_json);
            data['vzid'].name = "";
            data['vzid'].ast_type = 0;
            data.type = "set_group_cfg";
            dg_json_ajax(data, function (ajaxdata) {
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    show_informer($.i18n.prop("save_success"), 5000);
                    reget_data()
                    if (callback) {
                        callback()
                    }
                }
            });
        }
    }
    function init_device_con() {
        $(".cm_td .device").each(function () {
            var sn = $(this).attr('sn')
            var device_type = $(this).attr('device_type')
            var ip = $(this).attr('ip')
            var name = $(this).attr('name')
            var index = $(this).index() + 1
            var container = $('.device_con[index=' + index + ']')
            container.find('.device').show()
            container.find('.add_con').hide()
            container.attr('sn', sn).attr('device_type', device_type).attr('ip', ip)
            device_info[index].device_type = device_type
            device_info[index].sn = sn
            device_info[index].ip = ip
            var dev_name = '车牌相机'
            var content_title = '车牌抓取图像'
            if (device_type == 'RG') {
                dev_name = '监控相机'
                content_title = '事件类型'
            }
            $('.device_con[index=' + index + ']').find('.dev_name').html(dev_name + '(' + name + ')')
            $('.device_con[index=' + index + ']').find('.cur_ip').html(ip)
            $('.device_con[index=' + index + ']').find('.content_title').html(content_title)
            if (device_type == 'R3') {
                $('.device_con[index=' + index + ']').find('.trigger_btn').show()
            } else {
                $('.device_con[index=' + index + ']').find('.trigger_btn').hide()
            }
            if (ie.isIE) {
                get_user(index, function (user_info) {
                    get_port(index, function (http_port) {
                        var ip = device_info[index].ip
                        device_info[index].player = 'ax' + index
                        init_activex_new("#live" + index, 510, 0, function () {
                        }, user_info, sn, ip, http_port);
                    })
                })
            } else {
                device_info[index].player = new VideoPlayer()
                device_info[index].player.get_video_src("flvVideo" + index, "video" + index, 1, ip, sn, device_type)
                get_rule(index)
            }
        })
        get_rec_result_flag = true
        get_r3_result()
    }
    function get_cm(item) {
        var device_type = item.device_type
        if (!device_type) {
            device_type = 'R3'
        }
        var str = '';
        str += "<span class='device' device_type='" + device_type + "' sn='" + item.sn + "' ip='" + item.ip + "' name='" + item.dev_name + "'>"
        if (item.status == 1) {
            str += "<span style='color:green;'>" + item.ip + "</span>";
            str += "<span class='link'></span>"
        } else {
            str += "<span style='color:#ccc;'>" + item.ip + "</span>";
            str += "<span class='link'></span>"
        }
        if (vzid_astType != 2) {
            str += "<span class='group_icon group_delete'></span>"
        }
        str += "</span>"
        return str
    }
    function add_cm(arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            if (vzid_astType == 2 && arr[i].ast_type != 1) {
                continue
            }
            str += get_cm(arr[i])
        }
        $(".cm_td").append(str);
        $(".mm_td").append(str);
    }
    var complement_arr = [];
    function get_tree_znode(obj) {
        var arr_flag = obj.name.split("#");
        var arr = arr_flag[0].split("&");

        if (vzid_name != "" && arr.length == 3 && obj.sn != vzid_sn) {
            var vz_arr_flag = vzid_name.split("#");
            var vz_arr = vz_arr_flag[0].split("&");
            if (vz_arr.length == 3) {
                if (arr[0] == vz_arr[0] && arr[1] == vz_arr[1] && obj.type == vzid_type) {
                    complement_arr.push({ "ip": obj.ip_addr, "sn": obj.sn, "status": obj.connect_status, 'name': obj.name, 'ast_type': obj['ast_type'], 'dev_name': Base64.decode(obj['dev_name'], true) });
                }
            }
        }
    }
    function group_add() {
        if (g_group_model == 0) {
            return;
        }
        var devices = $(".cm_td .device");
        if (devices.length >= 3) {
            show_informer_text($.i18n.prop("assist_camera_length") + "3")
            return
        }
        add_device()
    }
    function remove_device(obj) {
        var cfg = {};
        cfg.type = "del_bind_mate";
        cfg.module = "PM_WEB_REQUEST";
        cfg.body = obj
        post(cfg, function (jsondata) {
            show_informer($.i18n.prop("success"), 5000);
            reget_data()
        }, function () {
            reget_data()
        })
    }
    function bind_rg(obj) {
        var cfg = {};
        cfg.type = "set_bind_mate";
        cfg.module = "PM_WEB_REQUEST";
        cfg.body = obj
        post(cfg, function (jsondata) {
            show_informer($.i18n.prop("save_success"), 5000);
            reget_data()
        }, function () {
            show_informer('添加失败');
        })
    }
    function on_submit() {
        var checkDom = $('input[name="device_radio_group"]:checked');
        if (!checkDom.val()) {
            show_informer_text($.i18n.prop("device_bind_hint"));
            return
        }
        var dev_name = $(checkDom).parent("td").siblings(":eq(0)").html()
        var sn = $(checkDom).parent("td").siblings(":eq(1)").html()
        var device_type = $(checkDom).parents("tr").attr("device_type")
        var ip = $(checkDom).parent("td").siblings(":eq(3)").html()

        if (device_type == 'RG') {
            var obj = {
                dev_name: dev_name,
                sn: sn,
                device_type: device_type,
                ip: ip
            }
            $(".cm_td").append(get_cm(obj))
            bind_rg(obj)
        } else {
            var obj = {
                dev_name: dev_name,
                sn: sn,
                device_type: device_type,
                ip: ip,
                status: 0
            }
            $(".cm_td").append(get_cm(obj))
            set_group()
        }
        $("#device_bind_dialog").hide()
    }
    function add_device() {
        find_device()
        $("#device_bind_dialog").show();
    }
    function get_device(callback) {
        var cfg = {};
        cfg.type = "get_all_mate";
        cfg.module = "PM_WEB_REQUEST";
        post(cfg, function (res) {
            var arr = res.body
            for (var i = 0; i < arr.length; i++) {
                arr[i].status = arr[i].online
            }
            add_cm(arr)
            if (callback) {
                callback()
            }
        })
    }
    function find_device() {
        $('#find_device').html('查找中')
        var cfg = {};
        cfg.type = "get_group_cfg";
        cfg.module = "PM_WEB_REQUEST";
        post(cfg, function (jsondata) {
            $('#find_device').html('查找设备')
            var str = ''
            var devices = jsondata.group_cfg.group_vzids || []
            var inputStr = ''
            devices.sort(function (a, b) {
                return a.ast_type - b.ast_type
            })
            for (var i = 0; i < devices.length; i++) {
                var device_type = devices[i].device_type ? '监控相机' : '车牌相机'
                var type = devices[i].device_type ? 'RG' : 'R3'
                var dev_name = devices[i].dev_name ? devices[i].dev_name : ''
                if (devices[i].ast_type != 0) {
                    inputStr = '<input type="radio" class="device_radio" name="device_radio_group" disabled/>'
                    str += '<tr device_type="' + type + '" style="background:#ddd;" title="已绑定"><td>' + inputStr + '</td><td>' + dev_name + '</td><td>' + devices[i].sn + '</td><td>' + device_type + '</td><td>' + devices[i].ip_addr + '</td></tr>';
                } else {
                    inputStr = '<input type="radio" class="device_radio" name="device_radio_group"/>'
                    str += '<tr device_type="' + type + '"  ><td>' + inputStr + '</td><td>' + dev_name + '</td><td>' + devices[i].sn + '</td><td>' + device_type + '</td><td>' + devices[i].ip_addr + '</td></tr>';
                }
            }
            if ($("#find_device_table tr").length > 1) {
                $("#find_device_table tr:gt(0)").remove();
            }
            $("#find_device_table").append(str);
            $("#find_device_table td").attr("align", "center");
        })
    }
    function get_nosamename(name) {
        var str = name;
        str += parseInt(new Date().getTime() / 1000)
        return str;
    }
    function get_vz_name(garage_name, assist_name, device_flag) {
        var vz_name = Base64.encode(garage_name, true) + "&" + Base64.encode(assist_name, true) + "&" + Base64.encode($("#cur_ip").html(), true) + "#" + device_flag;
        return vz_name
    }
    function get_assist_name(ip, garage_name, assist_name, device_flag) {
        var new_name = Base64.encode(garage_name, true) + "&" + Base64.encode(assist_name, true) + "&" + Base64.encode(ip, true) + "#" + device_flag;
        return new_name
    }
    function init_data() {
        close_page = false
        get_rec_result_flag = true
        complement_arr = []
        device_info = [
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' }
        ]
        init_selectmenu("#car_pass_direction", 170, 150)
    }
    function get_bind_data() {
        $(".cm_td").html('');
        get_device(function () {
            var req = {};
            req.type = "get_group_cfg";
            dg_json_ajax(req, init_tree_and_tb);
        })
    }
    function group_delete(that) {
        var device = $(that).parents('.device');
        var sn = device.attr('sn');
        device.remove();
        var data = JSON.parse(g_device_data_json)
        var list = data["group_cfg"]["group_vzids"];
        for (var i = 0; i < list.length; i++) {
            if (list[i].sn == sn) {
                list[i].name = ''
                list[i].ast_type = 0
                break
            }
        }
        g_device_data_json = JSON.stringify(data)
        set_group()
    }
    function unbind_device() {
        var device = $(this).parents('.device');
        var ip = device.attr('ip')
        if (confirm('确认解绑' + ip + '吗？')) {
            var device_type = device.attr('device_type')
            if (device_type == 'R3') {
                group_delete(this)
            } else {
                var obj = {
                    dev_name: device.attr('name'),
                    sn: device.attr('sn'),
                    device_type: device.attr('device_type'),
                    ip: device.attr('ip')
                }
                remove_device(obj)
            }
        }
    }
    function prase_r3_data(json, index) {
        var pr = json.body.PlateResult;
        var sn = json.body.sn
        //加载大图片
        var src = "snapshot/last_ivs_result.jpg?" + new Date().getTime();
        $(".device_con[index=" + index + "] .small_img_path_div").html($('<img class="small_img_path" />'))
        if ((pr.nType == 0 || pr.nType == 31) && pr.color == 0) {
            $(".device_con[index=" + index + "] .small_img_path").attr("src", "js/FileTree/images/black.jpg");
        } else {
            if (sn == g_device_sn) {
                $(".device_con[index=" + index + "] .small_img_path").attr("src", src);
            } else {
                if (pr['img_content'] && pr['img_content'] != '') {
                    $(".device_con[index=" + index + "] .small_img_path").attr("src", "data:image/jpg;base64," + pr['img_content']);
                } else {
                    $(".device_con[index=" + index + "] .small_img_path").attr("src", "js/FileTree/images/black.jpg");
                }
            }
        }

        //加载车牌图片
        var p_t = pr.plate_top;
        var p_b = pr.plate_bottom;
        var p_l = pr.plate_left;
        var p_r = pr.plate_right;
        var load_plate = false;
        var plate_height = p_b - p_t;
        var plate_width = p_r - p_l;
        if (sn != g_device_sn) {
            p_t -= pr.car_head_top
            p_l -= pr.car_head_left
        }
        $(".device_con[index=" + index + "] .small_img_path").load(function () {
            if (!load_plate) {
                $(".device_con[index=" + index + "] .small_img_path").unbind("load");
                load_plate = true;
                var naturalWidth = getNatural($(".device_con[index=" + index + "] .small_img_path").get(0)).width;
                var naturalHeight = getNatural($(".device_con[index=" + index + "] .small_img_path").get(0)).height;
                var con_width = $(".device_con[index=" + index + "] .small_img_path_div").width();
                var con_height = $(".device_con[index=" + index + "] .small_img_path_div").height();
                if (sn != g_device_sn) {
                    naturalWidth = pr.car_head_right - pr.car_head_left
                    naturalHeight = pr.car_head_bottom - pr.car_head_top
                }
                var cur_width = naturalWidth * con_width / plate_width;
                var cur_height = naturalHeight * con_height / plate_height;
                var cur_top = 0 - cur_height * p_t / naturalHeight;
                var cur_left = 0 - cur_width * p_l / naturalWidth;
                $(".device_con[index=" + index + "] .small_img_path").css({
                    "width": cur_width,
                    "height": cur_height,
                    "margin-top": cur_top,
                    "margin-left": cur_left
                });
            }
        });

        //加载模拟车牌
        var license = pr.license;
        license = license.split("");
        var font_size = (148 / license.length) * 1.5;
        if (font_size > 30) {
            font_size = 30;
        }
        var num = 0;
        for (var i = 0; i < license.length; i++) {
            if (license[i] == "W" || license[i] == "M") {
                num++;
            }
        }
        font_size -= num;
        var span_str = "<span style='color:#000;font-size:" + font_size + "px;'>" + pr.license + "</span>";
        $(".device_con[index=" + index + "] .simulate_inner").html(span_str);
    }
    function prase_rg_data(json, index) {
        var result = json.body.LanectrlResult
        var pr = result.results[0];
        var type_result = get_envent_type(pr.event_type)
        var event_type_str = type_result.event_type

        var event_font_size = (148 / event_type_str.length) * 1.5;
        if (event_font_size > 30) {
            event_font_size = 30;
        }
        var event_str = "<span style='color:#000;font-size:" + event_font_size + "px;'>" + event_type_str + "</span>";
        $(".device_con[index=" + index + "] .small_img_path_div").html(event_str);

        var plate = ''
        if (!pr['plate_result']) {
            return
        }
        plate = Base64.decode(pr['plate_result']['license'], true)
        var font_size = (148 / plate.length) * 1.5;
        if (font_size > 30) {
            font_size = 30;
        }
        var num = 0;
        for (var i = 0; i < plate.length; i++) {
            if (plate[i] == "W" || plate[i] == "M") {
                num++;
            }
        }
        font_size -= num;
        var span_str = "<span style='color:#000;font-size:" + font_size + "px;'>" + plate + "</span>";
        $(".device_con[index=" + index + "] .simulate_inner").html(span_str);
    }
    var device_info = [
        { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
        { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
        { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
        { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' }
    ]
    var cur_id = -1
    function get_r3_result() {
        if (!get_rec_result_flag) {
            return;
        }
        var time1 = new Date().getTime();
        var cfg = {}
        cfg.result_id = cur_id
        var data = JSON.stringify(cfg)
        $.ajax({
            type: 'GET',
            url: "ivs_result.php",
            timeout: 5000,
            data: data,
            success: function (ajaxdata) {
                if (precheck(ajaxdata)) {
                    return false;
                }
                var time2 = new Date().getTime();
                var time = time2 - time1;
                if (time > 500) {
                    get_r3_result();
                } else {
                    var t = setTimeout(function () {
                        get_r3_result();
                        clearTimeout(t);
                    }, 500 - time);
                }
                var json = eval("(" + ajaxdata + ")");
                if (json.state == 200) {
                    if (!json['body']) {
                        return
                    }
                    if (!json['body']['sn']) {
                        return
                    }
                    var sn = json.body.sn
                    var result_id = json.body.result_id
                    var index = parseInt($(".device_con[sn='" + sn + "']").attr('index'))
                    if (json.body['PlateResult']) {
                        if (result_id <= cur_id) {
                            return;
                        }
                        if (cur_id == -1 && result_id != 1) {
                            cur_id = result_id
                            return
                        }
                        cur_id = result_id;
                        prase_r3_data(json, index);
                    } else if (json.body['LanectrlResult']) {
                        if (result_id <= cur_id) {
                            return;
                        }
                        if (cur_id == -1 && result_id != 1) {
                            cur_id = result_id
                            return
                        }
                        cur_id = result_id;
                        prase_rg_data(json, index);
                    }

                }
            },
            error: function () {
                var time2 = new Date().getTime();
                var time = time2 - time1;
                if (time > 500) {
                    get_r3_result();
                } else {
                    var t = setTimeout(function () {
                        get_r3_result();
                        clearTimeout(t);
                    }, 500 - time);
                }
            }
        });
    }
    function trigger_click() {
        var msg = {
            "module": "ALG_REQUEST_MESSAGE",
            "type": "AVS_TRIGGER",
            "body": {
                "trigger_result": 1,
                "trigger_type": 4
            }
        }
        var parent = $(this).parents('.device_con')
        var device_type = parent.attr('device_type')
        var sn = parent.attr('sn')
        if (vzid_sn == sn) {
            post(msg, function () { })
        } else {
            agent_tcp_proto(device_type, sn, msg)
        }
    }
    function set_rule_to_AX(index) {
        var ax = GetAX('ax' + index)
        if (!ax) return
        var json = {}
        json.rule = device_info[index].rule
        var jsonstr = JSON.stringify(json)
        ax.QueryCmd('SetRule', jsonstr, '1', function (response_data) { })
    }
    //添加小点
    function add_circle(index) {
        var rules = device_info[index].rule
        $("#canvas_container" + index + " .coil").remove()
        for (var line = 0; line < rules.length; line++) {
            var coil_area = rules[line].rule_area;
            var coil_enable = rules[line].rule_enable;
            if (coil_area.points.length > 0 && coil_enable && coil_area.point_num > 0) {
                for (var i = 0; i < coil_area.points.length; i++) {
                    // 线上的锚点
                    var circle_str = '';
                    circle_str += "<div class='circle coil' rule_id='" + rules[line].rule_id + "' index='" + i + "'></div>";
                    $("#canvas_container" + index).append(circle_str);
                }
            }
        }
    }
    var radius = 3;
    //绘制
    function draw_area(id, index) {
        var rules = device_info[index].rule
        clearCanvas(index);
        //绘制线框
        for (var line = 0; line < rules.length; line++) {
            var coil_area = rules[line].rule_area;
            var coil_enable = rules[line].rule_enable;
            var cv_width = parseInt($("#myCanvas" + index).attr("width"));
            var cv_height = parseInt($("#myCanvas" + index).attr("height"));
            var c = document.getElementById('myCanvas' + index);
            var ctx = c.getContext('2d');
            ctx.lineWidth = '1';
            if (id || id == 0) { //传了线条id就说明正在操作该线条
                if (rules[line].rule_id == id) {
                    ctx.strokeStyle = '#15a4fa';
                    ctx.fillStyle = '#15a4fa';
                } else {
                    ctx.strokeStyle = '#f45739';
                    ctx.fillStyle = '#f45739';
                }
            } else {
                ctx.strokeStyle = '#f45739';
                ctx.fillStyle = '#f45739';
            }
            ctx.font = 'bold 14px Arial';
            if (coil_area.points.length > 0 && coil_enable && coil_area.point_num > 0) {
                ctx.beginPath();
                for (var i = 0; i < coil_area.points.length; i++) {
                    var x = get_ivs_s2i(coil_area.points[i].x, cv_width);
                    var y = get_ivs_s2i(coil_area.points[i].y, cv_height);
                    if (i == 0) {
                        var text = Base64.decode(rules[line].rule_name, true)
                        var n_y = y - 5
                        if (n_y < 20) {
                            n_y = y + 15
                        }
                        ctx.fillText(text, x, n_y);
                    }
                    // 线上的锚点
                    $("#canvas_container" + index + " .coil[rule_id='" + rules[line].rule_id + "'][index='" + i + "']").css({
                        "left": x - radius,
                        "top": y - radius
                    });
                    // 线框绘制
                    ctx.lineTo(x, y);
                    if (i == coil_area.points.length - 1) {
                        var lastX = get_ivs_s2i(coil_area.points[0].x, cv_width)
                        var lastY = get_ivs_s2i(coil_area.points[0].y, cv_height)
                        ctx.lineTo(lastX, lastY)
                    }
                }
                ctx.stroke();
                if (rules[line].rule_type == 2) {
                    ctx.fillStyle = 'rgba(255,255,255,0.3)';
                    ctx.fill();
                }
                //绘制绊线AB
                if (rules[line].rule_type == 4) {
                    var p1 = rules[line].rule_area.points[0]
                    var p2 = rules[line].rule_area.points[1]
                    var x1 = get_ivs_s2i(p1.x, cv_width)
                    var y1 = get_ivs_s2i(p1.y, cv_height)
                    var x2 = get_ivs_s2i(p2.x, cv_width)
                    var y2 = get_ivs_s2i(p2.y, cv_height)
                    var arrowLength = 32
                    var DX = x1 - x2;
                    var DY = y1 - y2;

                    var dbLineLen = DX * DX + DY * DY;
                    var LineLen = Math.sqrt(dbLineLen);

                    var DXRateArrowLine = parseInt(DX * arrowLength / LineLen + 0.5);
                    var DYRateArrowLine = parseInt(DY * arrowLength / LineLen + 0.5);
                    var CenX = (x1 + x2) >> 1;
                    var CenY = (y1 + y2) >> 1;
                    var headX, headY;

                    headX = CenX + DYRateArrowLine;
                    headY = CenY - DXRateArrowLine;
                    if (headX < 0) {
                        headX = 0
                    }
                    if (headY < 10) {
                        headY = 10
                    }
                    if (headX > cv_width - 10) {
                        headX = cv_width - 10
                    }
                    if (headY > cv_height) {
                        headY = cv_height
                    }
                    ctx.fillText('A', headX, headY)
                    headX = CenX - DYRateArrowLine;
                    headY = CenY + DXRateArrowLine;
                    if (headX < 0) {
                        headX = 0
                    }
                    if (headY < 10) {
                        headY = 10
                    }
                    if (headX > cv_width - 10) {
                        headX = cv_width - 10
                    }
                    if (headY > cv_height) {
                        headY = cv_height
                    }
                    ctx.fillText('B', headX, headY)
                }
            }
            if (coil_enable) {
                $("#canvas_container" + index + " .coil[rule_id='" + rules[line].rule_id + "']").show();
            } else {
                $("#canvas_container" + index + " .coil[rule_id='" + rules[line].rule_id + "']").hide();
            }
        }
    }
    //清除canvas
    function clearCanvas(index) {
        var c = document.getElementById('myCanvas' + index);
        var ctx = c.getContext('2d');
        var width = $("#myCanvas" + index).attr("width");
        var height = $("#myCanvas" + index).attr("height");
        ctx.clearRect(0, 0, width, height);
    }
    function get_rule(index) {
        // var device_type = device_info[index].device_type
        // if (device_type == 'R3') {
        //   get_r3_rules(index)
        // } else {
        get_rules(index)
        // }
    }
    function get_r3_rules(index) {
        var device_type = device_info[index].device_type
        var sn = device_info[index].sn
        var cfg = {}
        cfg.module = 'ALG_REQUEST_MESSAGE'
        cfg.type = 'get_alg_prm'
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 0
        cfg.body.type = 'rule_area_prm'
        if (vzid_sn == sn) {
            post(cfg, function (ajaxdata) {
                var body = ajaxdata.body;
                var rule = body.param.rule_area_prm;
                device_info[index].rule = [rule]
                if (ie.isIE) {
                    set_rule_to_AX(index);
                } else {
                    add_circle(index)
                    draw_area(-1, index)
                }
            })
        } else {
            agent_tcp_proto(device_type, sn, cfg, function (ajaxdata) {
                var body = ajaxdata.body;
                var rule = body.param.rule_area_prm;
                device_info[index].rule = rule
                if (ie.isIE) {
                    set_rule_to_AX(index);
                } else {
                    add_circle(index)
                    draw_area(-1, index)
                }
            })
        }
    }
    function get_rules(index) {
        var device_type = device_info[index].device_type
        var sn = device_info[index].sn
        var cfg = {}
        if (device_type == 'R3') {
            cfg.module = 'ALG_REQUEST_MESSAGE'
        } else {
            cfg.module = 'ALGMAN_REQUEST_MESSAGE'
        }
        cfg.type = 'get_rules'
        cfg.chnlid = 0
        cfg.body = {}
        cfg.body.ids = []
        if (vzid_sn == sn) {
            post(cfg, function (ajaxdata) {
                var body = ajaxdata.body;
                var rule = body.rule;
                device_info[index].rule = rule
                if (ie.isIE) {
                    set_rule_to_AX(index);
                } else {
                    add_circle(index)
                    draw_area(-1, index)
                }
            })
        } else {
            agent_tcp_proto(device_type, sn, cfg, function (ajaxdata) {
                var body = ajaxdata.body;
                var rule = body.rule;
                device_info[index].rule = rule
                if (ie.isIE) {
                    set_rule_to_AX(index);
                } else {
                    add_circle(index)
                    draw_area(-1, index)
                }
            })
        }

    }
    function get_user(index, callback) {
        var device_type = device_info[index].device_type
        var sn = device_info[index].sn
        var cfg = {}
        cfg.module = 'SS_BUS_REQUEST'
        cfg.type = 'ss_get_accounts'
        if (vzid_sn == sn) {
            post(cfg, function (ajaxdata) {
                var users = ajaxdata.body;
                for (var i = 0; i < users.length; i++) {
                    var username = ''
                    var auth = ''
                    if (device_type == 'R3') {
                        auth = users[i].auth
                        auth = AesCtr.decrypt(auth, '天天', 128);
                        username = auth.split(':')[0];
                    } else {
                        auth = users[i].username + ':' + users[i].password
                        username = users[i].username
                    }
                    if (username == "admin") {
                        callback(auth)
                        break
                    }
                }
            })
        } else {
            agent_tcp_proto(device_type, sn, cfg, function (ajaxdata) {
                var users = ajaxdata.body;
                for (var i = 0; i < users.length; i++) {
                    var username = ''
                    var auth = ''
                    if (device_type == 'R3') {
                        auth = users[i].auth
                        auth = AesCtr.decrypt(auth, '天天', 128);
                        username = auth.split(':')[0];
                    } else {
                        auth = users[i].username + ':' + users[i].password
                        username = users[i].username
                    }
                    if (username == "admin") {
                        callback(auth)
                        break
                    }
                }
            })
        }
    }
    function get_port(index, callback) {
        var device_type = device_info[index].device_type
        var sn = device_info[index].sn
        var cfg = {}
        cfg.module = 'SS_BUS_REQUEST'
        cfg.type = 'get_net_and_port'
        if (vzid_sn == sn) {
            post(cfg, function (res) {
                var http_port = res.http_port;
                callback(http_port)
            })
        } else {
            agent_tcp_proto(device_type, sn, cfg, function (res) {
                var http_port = res.http_port;
                callback(http_port)
            })
        }
    }
    function set_rule(index) {
        if (ie.isIE) {
            var ax = GetAX('ax' + index)
            if (!ax) return
            ax.QueryCmd('GetRule', '', '1', function (response_data) {
                var json = eval("(" + response_data + ")");
                device_info[index].rule = json.rule;
                var rule = device_info[index].rule
                set_rules(index, rule)
            })
        } else {
            var rule = device_info[index].rule
            set_rules(index, rule)
        }
    }
    function set_r3_rules(index) {
        var device_type = device_info[index].device_type
        var sn = device_info[index].sn
        var rule = device_info[index].rule
        var cfg = {}
        cfg.module = 'ALG_REQUEST_MESSAGE'
        cfg.type = 'set_alg_prm'
        cfg.body = {}
        cfg.body.alg_chn = 0
        cfg.body.rule_chn = 65535
        cfg.body.rule_area_prm = rule
        if (vzid_sn == sn) {
            post(cfg, function (ajaxdata) {
                show_informer()
            })
        } else {
            agent_tcp_proto(device_type, sn, cfg, function (ajaxdata) {
                show_informer()
            })
        }
    }
    function set_rules(index, rule) {
        var device_type = device_info[index].device_type
        var sn = device_info[index].sn
        var cfg = {}
        if (device_type == 'R3') {
            cfg.module = 'ALG_REQUEST_MESSAGE'
        } else {
            cfg.module = 'ALGMAN_REQUEST_MESSAGE'
        }
        cfg.type = 'set_rules'
        cfg.chnlid = 0
        cfg.body = {}
        cfg.body.rule = rule;
        cfg.body.display_rule = 1;
        if (vzid_sn == sn) {
            post(cfg, function (ajaxdata) {
                show_informer()
            })
        } else {
            agent_tcp_proto(device_type, sn, cfg, function (ajaxdata) {
                show_informer()
            })
        }
    }
    var circle_down = false;
    var downobj = null;
    var area_down = false;
    var old_position = null
    //点到直线的距离
    function Point2LineDist(pt, ptLineStart, ptLineEnd) {
        var rcLine = {};

        rcLine.left = ptLineStart.x;
        rcLine.top = ptLineStart.y;
        rcLine.right = ptLineEnd.x;
        rcLine.bottom = ptLineEnd.y;

        var dxap = pt.x - rcLine.left;			// Vector AP
        var dyap = pt.y - rcLine.top;
        var dxab = rcLine.right - rcLine.left;	// Vector AB
        var dyab = rcLine.bottom - rcLine.top;

        var ab2 = dxab * dxab + dyab * dyab; // Magnitude of AB

        var t; // This will hold the parameter for the Point of projection of P on AB
        if (ab2 <= 2) {
            t = 0;   // A and B coincide
        }
        else {
            t = (dxap * dxab + dyap * dyab) / ab2;
        }

        // Above equation maps to (AP dot normalized(AB)) / magnitude(AP dot normalized(AB))
        if (t < 0) {
            t = 0;   // Projection is beyond A so nearest point is A
        }
        else {
            if (t > 1) t = 1; // Projection is beyond B so nearest point is B
        }

        var xf = rcLine.left + t * dxab; // Projection point on Seg AB
        var yf = rcLine.top + t * dyab; //

        var dxfp = pt.x - xf;
        var dyfp = pt.y - yf;

        var nDist;
        nDist = Math.sqrt(dxfp * dxfp + dyfp * dyfp);

        return nDist;
    }
    //点在多边形内点到线最短距离
    function DistanceFromPoint(pt, m_vecPoints) {
        var nMinDis = 100000;
        var nDis = 0;
        var nSize = m_vecPoints.length;
        if (nSize < 2) {
            return nMinDis;
        }

        var ptStart, ptEnd;
        ptStart = m_vecPoints[0];
        ptEnd = ptStart;

        for (var i = 1; i < nSize; i++) {
            ptEnd = m_vecPoints[i];

            // 计算点到多边形一条边的距离
            nDis = Point2LineDist(pt, ptStart, ptEnd);
            nMinDis = Math.min(nMinDis, nDis);

            ptStart = ptEnd;
        }

        return nMinDis;
    }
    //点在直线上
    function inline(line_a, line_b, p) {
        return getLength(line_a, line_b) == getLength(line_a, p) + getLength(line_b, p);
    }
    //获取两点的距离
    function getLength(a, b) {
        var disx = parseInt(a.x) - parseInt(b.x);
        var disy = parseInt(a.y) - parseInt(b.y);
        var num = (disx * disx) + (disy * disy); //平方和
        return parseInt(Math.sqrt(num));
    }
    // 双击添加锚点
    function canvas_dblclick(event) {
        var device_index = parseInt($(event.target).parents('.device_con').attr('index'))
        cur_device_type = $(event.target).parents('.device_con').attr('cur_device_type')
        cur_sn = $(event.target).parents('.device_con').attr('sn')
        cur_device_index = device_index
        var g_rules = device_info[device_index].rule
        var flag = false;
        var e = event || window.event;
        var cv_width = parseInt($("#myCanvas" + device_index).attr("width"));
        var cv_height = parseInt($("#myCanvas" + device_index).attr("height"));
        var p_l = $(this).parents(".video_outer").offset().left;
        var p_t = $(this).parents(".video_outer").offset().top;
        var x = e.pageX - p_l;
        var y = e.pageY - p_t;
        x = get_ivs_i2s(x, cv_width)
        y = get_ivs_i2s(y, cv_height)
        var p = {
            "x": x,
            "y": y
        };
        var click_area = {
            area: [],
            point: {},
            pre_point_index: null
        }
        for (var line = 0; line < g_rules.length; line++) {
            var area_point = g_rules[line].rule_area.points;
            for (var i = 0; i < area_point.length - 1; i++) {
                var s = {
                    "x": area_point[i].x,
                    "y": area_point[i].y
                };
                var e = {
                    "x": area_point[i + 1].x,
                    "y": area_point[i + 1].y
                };
                var n_s = {
                    "x": area_point[i].x - 1,
                    "y": area_point[i].y - 1
                };
                var n_e = {
                    "x": area_point[i + 1].x - 1,
                    "y": area_point[i + 1].y - 1
                };
                var p_s = {
                    "x": area_point[i].x + 1,
                    "y": area_point[i].y + 1
                };
                var p_e = {
                    "x": area_point[i + 1].x + 1,
                    "y": area_point[i + 1].y + 1
                };
                if (inline(s, e, p) || inline(n_s, n_e, p) || inline(p_s, p_e, p)) {
                    flag = true;
                    click_area.pre_point_index = i + 1
                    click_area.area = g_rules[line]
                    click_area.point = p
                    break;
                }
                if (i == 0) {
                    var e = {
                        "x": area_point[area_point.length - 1].x,
                        "y": area_point[area_point.length - 1].y
                    };
                    var n_e = {
                        "x": area_point[area_point.length - 1].x - 1,
                        "y": area_point[area_point.length - 1].y - 1
                    };
                    var p_e = {
                        "x": area_point[area_point.length - 1].x + 1,
                        "y": area_point[area_point.length - 1].y + 1
                    };
                    if (inline(s, e, p) || inline(n_s, n_e, p) || inline(p_s, p_e, p)) {
                        flag = true;
                        click_area.pre_point_index = area_point.length
                        click_area.area = g_rules[line]
                        click_area.point = p
                        break;
                    }
                }
            }
        }
        if (flag) {
            // 默认最多8个点
            if (click_area.area.rule_area.points.length >= 8) {
                return
            }
            if (click_area.area.rule_type == 4 || click_area.area.rule_type == 8) {
                return
            }
            if (Base64.decode(click_area.area.rule_name,true) == '虚拟线圈') {
                return
            }
            // 在指定点后面添加新点
            $(".rule[rule_id='" + click_area.area.rule_id + "']").click()
            var circle_str = "<div class='circle coil' rule_id='" + click_area.area.rule_id + "' index='" + click_area.pre_point_index + "'></div>";
            $("#canvas_container" + device_index + " .coil[rule_id='" + click_area.area.rule_id + "']").each(function () {
                var cur_index = parseInt($(this).attr("index"));
                if (cur_index >= click_area.pre_point_index) {
                    $(this).attr("index", (cur_index + 1));
                }
            });
            $("#canvas_container" + device_index).append(circle_str);
            click_area.area.rule_area.points.splice(click_area.pre_point_index, 0, click_area.point)
            click_area.area.rule_area.point_num = click_area.area.rule_area.points.length
            draw_area(click_area.area.rule_id, device_index);
        } else {
            fullScreen($(event.target).parents('.device_con').find('.video_outer').get(0))
        }
    }
    // 删除锚点
    function circle_dblclick(event) {
        var device_index = parseInt($(event.target).parents('.device_con').attr('index'))
        cur_device_type = $(event.target).parents('.device_con').attr('cur_device_type')
        cur_sn = $(event.target).parents('.device_con').attr('sn')
        cur_device_index = device_index
        var g_rules = device_info[cur_device_index].rule
        var cv_width = parseInt($("#myCanvas" + device_index).attr("width"));
        var cv_height = parseInt($("#myCanvas" + device_index).attr("height"));
        var rule_id = parseInt($(this).attr('rule_id'))
        var index = parseInt($(this).attr('index'))
        var x = parseInt($(this).css('left')) + 3
        var y = parseInt($(this).css('top')) + 3
        x = get_ivs_i2s(x, cv_width)
        y = get_ivs_i2s(y, cv_height)
        var rule_area = null
        for (var line = 0; line < g_rules.length; line++) {
            if (g_rules[line].rule_id == rule_id) {
                rule_area = g_rules[line].rule_area;
            }
        }
        $(".rule[rule_id='" + rule_id + "']").click()
        // 默认至少有四个点
        if (rule_area.points.length <= 4) {
            return
        }
        $("#canvas_container" + device_index + " .coil[rule_id='" + rule_id + "'][index='" + index + "']").remove()
        $("#canvas_container" + device_index + " .coil[rule_id='" + rule_id + "']").each(function () {
            var cur_index = parseInt($(this).attr("index"));
            if (cur_index >= index) {
                $(this).attr("index", (cur_index - 1));
            }
        });
        rule_area.points.splice(index, 1);
        rule_area.point_num = rule_area.points.length
        draw_area(rule_id, device_index);
        return false;
    }
    //松开鼠标事件
    function mouseup() {
        if (circle_down) {
            circle_down = false;
        }
        if (area_down) {
            area_down = false;
        }
    }
    var cur_device_index = 0
    var cur_device_type = 'R3'
    var cur_sn = ''
    var curRuleType = 1
    // 移动鼠标事件
    function mousemove(event) {
        var device_index = parseInt($(event.target).parents('.device_con').attr('index'))
        cur_device_type = $(event.target).parents('.device_con').attr('cur_device_type')
        cur_sn = $(event.target).parents('.device_con').attr('sn')
        cur_device_index = device_index
        var g_rules = device_info[cur_device_index].rule
        if (!circle_down && !area_down) {
            // canvas_click(event)
            return;
        } else {
            var e = event || window.event;
            var cv_width = parseInt($("#myCanvas" + cur_device_index).attr("width"));
            var cv_height = parseInt($("#myCanvas" + cur_device_index).attr("height"));
            var p_l = $(".device_con[index=" + cur_device_index + "] .video_outer").offset().left;
            var p_t = $(".device_con[index=" + cur_device_index + "] .video_outer").offset().top;
            var x = e.pageX - p_l;
            var y = e.pageY - p_t;
            // 圆点拖拽
            if (circle_down) {
                var parent = downobj.parent();

                if (x > parent.width()) {
                    x = parent.width();
                }
                if (x < 0) {
                    x = 0;
                }
                if (y > parent.height()) {
                    y = parent.height();
                }
                if (y < 0) {
                    y = 0;
                }
                x = get_ivs_i2s(x, cv_width)
                y = get_ivs_i2s(y, cv_height)

                if (!downobj) {
                    return;
                }
                var index = downobj.attr("index");
                var rule_id = downobj.attr("rule_id");
                for (var line = 0; line < g_rules.length; line++) {
                    if (rule_id == g_rules[line].rule_id) {
                        var coil_area = g_rules[line].rule_area;
                        for (var i = 0; i < coil_area.points.length; i++) {
                            if (index == i) {
                                coil_area.points[i].x = x
                                coil_area.points[i].y = y
                            }
                        }
                    }
                }
                // $(".rule[rule_id='" + id + "']").click()
                draw_area(rule_id, cur_device_index);
            }
            // 区域拖拽
            if (area_down) {
                x = get_ivs_i2s(x, cv_width)
                y = get_ivs_i2s(y, cv_height)
                var p = {
                    "x": x,
                    "y": y
                }
                var diff_x = x - old_position.x;
                var diff_y = y - old_position.y;
                old_position = p
                // 判断是否拖出容器
                cv_height = get_ivs_i2s(cv_height, cv_height)
                cv_width = get_ivs_i2s(cv_width, cv_width)
                var flag = false;
                for (var i = 0; i < curPoints.length; i++) {
                    var n_x = curPoints[i].x + diff_x;
                    var n_y = curPoints[i].y + diff_y;
                    if (n_x > cv_width) {
                        flag = true;
                        break;
                    }
                    if (n_x < 0) {
                        flag = true;
                        break;
                    }
                    if (n_y > cv_height) {
                        flag = true;
                        break;
                    }
                    if (n_y < 0) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    return;
                }
                // if (result) {
                for (var i = 0; i < curPoints.length; i++) {
                    curPoints[i].x = curPoints[i].x + diff_x
                    curPoints[i].y = curPoints[i].y + diff_y
                }
                area_down = true;
                // $(".rule[rule_id='" + curId + "']").click()
                draw_area(curId, cur_device_index)
                return;
                // }
            }
        }
    }
    //点击圆点事件
    function circle_mousedown() {
        if (downobj) {
            downobj = null;
        }
        circle_down = true;
        downobj = $(this);
    }
    // 单击区域事件
    function canvas_click(event, down) {
        var device_index = parseInt($(event.target).parents('.device_con').attr('index'))
        cur_device_type = $(event.target).parents('.device_con').attr('device_type')
        cur_sn = $(event.target).parents('.device_con').attr('sn')
        cur_device_index = device_index
        var g_rules = device_info[cur_device_index].rule
        var e = event || window.event;
        var cv_width = parseInt($("#myCanvas" + cur_device_index).attr("width"));
        var cv_height = parseInt($("#myCanvas" + cur_device_index).attr("height"));
        var p_l = $(".device_con[index=" + cur_device_index + "] .video_outer").offset().left;
        var p_t = $(".device_con[index=" + cur_device_index + "] .video_outer").offset().top;
        var x = e.pageX - p_l;
        var y = e.pageY - p_t;
        x = get_ivs_i2s(x, cv_width)
        y = get_ivs_i2s(y, cv_height)
        var p = {
            "x": x,
            "y": y
        }
        old_position = {
            "x": x,
            "y": y
        };
        var points = []
        var result = false
        for (var line = 0; line < g_rules.length; line++) {
            var coil_area = g_rules[line].rule_area;
            // 筛选出鼠标点击的点在矩形内的矩形
            // if ((rayCasting(p, coil_area.points) || g_rules[line].rule_type == 4) && g_rules[line].rule_enable == 1) {
            if (g_rules[line].rule_enable == 1) {
                result = true
                var obj = {
                    point: coil_area.points,
                    id: g_rules[line].rule_id,
                    type: g_rules[line].rule_type,
                    area: 0,
                }
                points.push(obj)
            }
        }
        if (result) {
            // 循环获取点到每个矩形的最短距离
            for (var i = 0; i < points.length; i++) {
                points[i].area = DistanceFromPoint(p, points[i].point)
            }
            // 判断距离最小的矩形
            var newPoints = points[0]
            for (var i = 0; i < points.length; i++) {
                if (i == points.length - 1) {//最后一个值
                    newPoints = newPoints.area < points[i].area ? newPoints : points[i]
                } else {
                    newPoints = newPoints.area < points[i + 1].area ? newPoints : points[i + 1]
                }
            }
            curPoints = newPoints.point
            curId = newPoints.id
            if (down) {
                area_down = true
            }
            curRuleType = newPoints.type
            com_rule_click(curId, curRuleType, cur_device_type)
            draw_area(curId, cur_device_index)
        }
        return
    }
    function com_rule_click(curId, curRuleType, cur_device_type) {
        if (curRuleType == 2) {
            $(".cfg_hint").show()
            $(".cfg_div").hide()
        } else {
            $(".cfg_div").show()
            $(".cfg_hint").hide()
        }
        if (cur_device_type == 'R3') {
            $(".r3").show()
            $(".rg").hide()
        } else {
            $(".rg").show()
            $(".r3").hide()
            rule_click(curId, curRuleType)
        }
    }
    function resize() {
        var canvas = $("#myCanvas" + cur_device_index)
        var width = $("#live" + cur_device_index).width()
        var height = $("#live" + cur_device_index).height()
        canvas.attr('width', width).attr('height', height)
        draw_area(-1, cur_device_index)
    }
    // 事件初始化
    function eventInit() {
        $(document).on("dblclick", ".circle", circle_dblclick);
        $(document).on("mousedown", ".circle", circle_mousedown);
        $(document).on("mouseup", mouseup);
        $(".video_outer").on("mousemove", mousemove);
        $(".myCanvas").mousedown(function (e) {
            canvas_click(e, true)
        });
        $(".myCanvas").dblclick(canvas_dblclick);
        $(window).on("resize", resize);
    }
    function eventClose() {
        $(document).off("dblclick", ".circle");
        $(document).off("mousedown", ".circle");
        $(document).off("mouseup", mouseup);
        $(".video_outer").off("mousemove", mousemove);
        $(window).off("resize", resize);
    }
    function get_module() {
        return 'ALG_TRSPD_SET_ALG_PARM';
    }
    var g_alg_chn = 0;
    var curRuleId = 0;
    var car_motion_enable_default = null;
    var car_stay_time_min = null;
    var car_stay_time_max = null;
    var car_stay_time_default = null;
    var car_alarm_interval_min = null;
    var car_alarm_interval_max = null;
    var car_alarm_interval_default = null;
    var car_pass_event_enable_default = null
    var car_retrace_event_enable_default = null
    var car_stay_event_enable_default = null
    function get_car_motion_prop(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prop";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = g_alg_chn;
        cfg.body.rule_chn = curRuleId;
        cfg.body.alg_prop_type = "car_motion_prm";
        cfg.body.alg_type = "lane_control";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.prop.car_motion_prm;
            car_motion_enable_default = jsondata.is_open['default'];

            var car_pass_event = jsondata.car_pass_event;
            car_pass_event_enable_default = car_pass_event.is_open['default'];

            var car_retrace_event = jsondata.car_retrace_event;
            car_retrace_event_enable_default = car_retrace_event.is_open['default'];

            var car_stay_event = jsondata.car_stay_event;
            car_stay_event_enable_default = car_stay_event.is_open['default'];

            var stay_time = car_stay_event.stay_time.time;
            car_stay_time_min = stay_time.min
            car_stay_time_max = stay_time.max
            car_stay_time_default = stay_time['default'];

            var alarm_interval_time = car_stay_event.alarm_interval.time;
            car_alarm_interval_min = alarm_interval_time.min
            car_alarm_interval_max = alarm_interval_time.max
            car_alarm_interval_default = alarm_interval_time['default'];

            get_car_motion_prm(appname);
        })
    }
    function get_car_motion_prm(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.alg_prm_type = "car_motion_prm";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.param;
            var car_motion_prm = jsondata.car_motion_prm;
            var enable = car_motion_prm.is_open
            $("#" + appname + "_enable").check_val(enable == 1);
            var car_pass_event_enable = car_motion_prm.car_pass_event.is_open
            var car_retrace_event_enable = car_motion_prm.car_retrace_event.is_open
            var car_stay_event = car_motion_prm.car_stay_event
            var car_stay_event_enable = car_stay_event.is_open
            var car_stay_time = car_stay_event.stay_time.time
            var car_alarm_interval = car_stay_event.alarm_interval.time
            $("#car_stay_time").val(car_stay_time);
            $("#car_alarm_interval").val(car_alarm_interval);
            $("#car_pass_event_enable").check_val(car_pass_event_enable == 1);
            $("#car_retrace_event_enable").check_val(car_retrace_event_enable == 1);
            $("#car_stay_event_enable").check_val(car_stay_event_enable == 1);
            ele_change(car_stay_event_enable, 'time_threshold')
            display_change(enable, appname + "_content", appname);
        })
    }
    function set_car_motion_prm(opera, enable) {
        if (opera == 1) {
            var car_stay_time = $("#car_stay_time").val();
            if (isNaN(car_stay_time) || car_stay_time < car_stay_time_min || car_stay_time > car_stay_time_max) {
                show_informer_text($.i18n.prop('car_stay_time_range') + " " + car_stay_time_min + "~" + car_stay_time_max);
                return
            }
            var car_alarm_interval = $("#car_alarm_interval").val();
            if (isNaN(car_alarm_interval) || car_alarm_interval < car_alarm_interval_min || car_alarm_interval > car_alarm_interval_max) {
                show_informer_text($.i18n.prop('alarm_interval_range') + " " + car_alarm_interval_min + "~" + car_alarm_interval_max);
                return
            }
        }
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var car_motion_prm = {}
        if (opera == 0) {
            car_motion_prm.is_open = enable;
            cfg.body.param.car_motion_prm = car_motion_prm;
        } else if (opera == 1) {
            car_motion_prm.is_open = 1;
            car_motion_prm.car_pass_event = {}
            car_motion_prm.car_pass_event.is_open = $("#car_pass_event_enable").check_val() ? 1 : 0
            car_motion_prm.car_retrace_event = {}
            car_motion_prm.car_retrace_event.is_open = $("#car_retrace_event_enable").check_val() ? 1 : 0
            car_motion_prm.car_stay_event = {}
            car_motion_prm.car_stay_event.is_open = $("#car_stay_event_enable").check_val() ? 1 : 0
            car_motion_prm.car_stay_event.stay_time = {}
            car_motion_prm.car_stay_event.stay_time.enable = 1
            car_motion_prm.car_stay_event.stay_time.time = parseInt(car_stay_time)
            car_motion_prm.car_stay_event.alarm_interval = {}
            car_motion_prm.car_stay_event.alarm_interval.time = parseInt(car_alarm_interval)
            cfg.body.param.car_motion_prm = car_motion_prm;
        }
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            if (opera == 1) {
                get_car_motion_prm("car_motion");
            }
        })
    }
    function car_motion_back_default() {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var car_motion_prm = {}
        car_motion_prm.is_open = car_motion_enable_default;
        car_motion_prm.car_pass_event = {}
        car_motion_prm.car_pass_event.is_open = car_pass_event_enable_default
        car_motion_prm.car_retrace_event = {}
        car_motion_prm.car_retrace_event.is_open = car_retrace_event_enable_default
        car_motion_prm.car_stay_event = {}
        car_motion_prm.car_stay_event.is_open = car_stay_event_enable_default
        car_motion_prm.car_stay_event.stay_time = {}
        car_motion_prm.car_stay_event.stay_time.enable = 1
        car_motion_prm.car_stay_event.stay_time.time = car_stay_time_default
        car_motion_prm.car_stay_event.alarm_interval = {}
        car_motion_prm.car_stay_event.alarm_interval.time = car_alarm_interval_default
        cfg.body.param.car_motion_prm = car_motion_prm;
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            get_car_motion_prm("car_motion");
        })
    }
    var person_motion_enable_default = null;
    var person_stay_time_min = null;
    var person_stay_time_max = null;
    var person_stay_time_default = null;
    var person_stay_event_enable_default = null;
    var person_alarm_interval_min = null;
    var person_alarm_interval_max = null;
    var person_alarm_interval_default = null;
    function get_person_motion_prop(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prop";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = g_alg_chn;
        cfg.body.rule_chn = curRuleId;
        cfg.body.alg_prop_type = "person_motion_prm";
        cfg.body.alg_type = "lane_control";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.prop.person_motion_prm;
            person_motion_enable_default = jsondata.is_open['default'];

            var person_stay_event = jsondata.person_stay_event
            person_stay_event_enable_default = person_stay_event.is_open['default'];

            var person_stay_time = person_stay_event.stay_time.time;
            person_stay_time_min = person_stay_time.min
            person_stay_time_max = person_stay_time.max
            person_stay_time_default = person_stay_time['default'];

            var alarm_interval_time = person_stay_event.alarm_interval.time;
            person_alarm_interval_min = alarm_interval_time.min
            person_alarm_interval_max = alarm_interval_time.max
            person_alarm_interval_default = alarm_interval_time['default'];

            get_person_motion_prm(appname);
        })
    }
    function get_person_motion_prm(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.alg_prm_type = "person_motion_prm";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.param;
            var person_motion_prm = jsondata.person_motion_prm;
            var enable = person_motion_prm.is_open
            $("#" + appname + "_enable").check_val(enable == 1);
            var person_stay_event = person_motion_prm.person_stay_event
            var person_stay_event_enable = person_stay_event.is_open
            var stay_time = person_stay_event.stay_time.time
            var person_alarm_interval = person_stay_event.alarm_interval.time
            $("#person_stay_time").val(stay_time);
            $("#person_alarm_interval").val(person_alarm_interval);
            $("#person_stay_event_enable").check_val(person_stay_event_enable == 1);
            ele_change(person_stay_event_enable, 'time_threshold')
            display_change(enable, appname + "_content", appname);
        })
    }
    function set_person_motion_prm(opera, enable) {
        if (opera == 1) {
            var person_stay_time = $("#person_stay_time").val();
            if (isNaN(person_stay_time) || person_stay_time < person_stay_time_min || person_stay_time > person_stay_time_max) {
                show_informer_text($.i18n.prop('person_stay_time_range') + " " + person_stay_time_min + "~" + person_stay_time_max);
                return
            }
            var person_alarm_interval = $("#person_alarm_interval").val();
            if (isNaN(person_alarm_interval) || person_alarm_interval < person_alarm_interval_min || person_alarm_interval > person_alarm_interval_max) {
                show_informer_text($.i18n.prop('person_stay_time_range') + " " + person_alarm_interval_min + "~" + person_alarm_interval_max);
                return
            }
        }
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var person_motion_prm = {}
        if (opera == 0) {
            person_motion_prm.is_open = enable;
            cfg.body.param.person_motion_prm = person_motion_prm;
        } else if (opera == 1) {
            person_motion_prm.is_open = 1;
            person_motion_prm.person_stay_event = {}
            person_motion_prm.person_stay_event.is_open = $("#person_stay_event_enable").check_val() ? 1 : 0
            person_motion_prm.person_stay_event.stay_time = {}
            person_motion_prm.person_stay_event.stay_time.enable = 1
            person_motion_prm.person_stay_event.stay_time.time = parseInt(person_stay_time)
            person_motion_prm.person_stay_event.alarm_interval = {}
            person_motion_prm.person_stay_event.alarm_interval.time = parseInt(person_alarm_interval)
            cfg.body.param.person_motion_prm = person_motion_prm;
        }
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            if (opera == 1) {
                get_person_motion_prm("person_motion");
            }
        })
    }
    function person_motion_back_default() {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var person_motion_prm = {}
        person_motion_prm.is_open = person_motion_enable_default;
        person_motion_prm.person_stay_event = {}
        person_motion_prm.person_stay_event.is_open = person_stay_event_enable_default
        person_motion_prm.person_stay_event.stay_time = {}
        person_motion_prm.person_stay_event.stay_time.enable = 1
        person_motion_prm.person_stay_event.stay_time.time = person_stay_time_default
        person_motion_prm.person_stay_event.alarm_interval = {}
        person_motion_prm.person_stay_event.alarm_interval.time = person_alarm_interval_default

        cfg.body.param.person_motion_prm = person_motion_prm;
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            get_person_motion_prm("person_motion");
        })
    }
    var flag_motion_enable_default = null;
    var flag_error_time_min = null;
    var flag_error_time_max = null;
    var flag_error_time_default = null;
    var flag_appear_event_enable_default = null;
    var flag_disappear_event_enable_default = null;
    var flag_error_event_enable_default = null;
    var flag_alarm_interval_min = null;
    var flag_alarm_interval_max = null;
    var flag_alarm_interval_default = null;
    function get_flag_motion_prop(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prop";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = g_alg_chn;
        cfg.body.rule_chn = curRuleId;
        cfg.body.alg_prop_type = "flag_motion_prm";
        cfg.body.alg_type = "lane_control";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.prop.flag_motion_prm;
            flag_motion_enable_default = jsondata.is_open['default'];

            var flag_appear_event = jsondata.flag_appear_event
            flag_appear_event_enable_default = flag_appear_event.is_open['default'];

            var flag_disappear_event = jsondata.flag_disappear_event
            flag_disappear_event_enable_default = flag_disappear_event.is_open['default'];

            var flag_error_event = jsondata.flag_error_event
            flag_error_event_enable_default = flag_error_event.is_open['default'];

            var flag_error_time = flag_error_event.flag_error_time.time;
            flag_error_time_min = flag_error_time.min
            flag_error_time_max = flag_error_time.max
            flag_error_time_default = flag_error_time['default'];

            var alarm_interval_time = flag_error_event.flag_error_time.alarm_interval;
            flag_alarm_interval_min = alarm_interval_time.min
            flag_alarm_interval_max = alarm_interval_time.max
            flag_alarm_interval_default = alarm_interval_time['default'];

            get_flag_motion_prm(appname);
        })
    }
    function flag_motion_current_state() {
        $("#flag_state").hide()
        $("#state_loading").show()
        var cfg = {};
        cfg.type = "request_alg";
        cfg.module = 'ALG_REQUEST_MESSAGE';
        cfg.body = {}
        cfg.body.req_type = 'flag_motion_current_state';
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (res) {
            var state = res.body.reply.flag_state
            if (state == 1) {
                $("#flag_state").html('框内检测到标志').css('color', 'green')
            } else {
                $("#flag_state").html('框内未检测到标志').css('color', 'red')
            }
            setTimeout(function () {
                $("#flag_state").show()
                $("#state_loading").hide()
            }, 500)
        })
    }
    function get_flag_motion_prm(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.alg_prm_type = "flag_motion_prm";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.param;
            var flag_motion_prm = jsondata.flag_motion_prm;
            var enable = flag_motion_prm.is_open
            $("#" + appname + "_enable").check_val(enable == 1);
            if (enable == 1) {
                flag_motion_current_state()
            } else {
                $("#flag_state").hide()
                $("#state_loading").hide()
            }
            var flag_appear_event_enable = flag_motion_prm.flag_appear_event.is_open
            $("#flag_appear_event_enable").check_val(flag_appear_event_enable == 1)

            var flag_disappear_event_enable = flag_motion_prm.flag_disappear_event.is_open
            $("#flag_disappear_event_enable").check_val(flag_disappear_event_enable == 1)

            var flag_error_event = flag_motion_prm.flag_error_event
            var flag_error_event_enable = flag_error_event.is_open
            $("#flag_error_event_enable").check_val(flag_error_event_enable == 1)

            var flag_error_time = flag_error_event.flag_error_time;
            var flag_error_time_val = flag_error_time.time;
            var flag_alarm_interval = flag_error_time.alarm_interval;
            $("#flag_error_time").val(flag_error_time_val);
            $("#flag_alarm_interval").val(flag_alarm_interval);
            ele_change(flag_error_event_enable, 'time_threshold')
            display_change(enable, appname + "_content", appname);
        })
    }
    function set_flag_motion_prm(opera, enable) {
        if (opera == 1) {
            var flag_error_time = $("#flag_error_time").val();
            if (isNaN(flag_error_time) || flag_error_time < flag_error_time_min || flag_error_time > flag_error_time_max) {
                show_informer_text("时间阈值范围 " + flag_error_time_min + "~" + flag_error_time_max);
                return
            }
            var flag_alarm_interval = $("#flag_alarm_interval").val();
            if (isNaN(flag_alarm_interval) || flag_alarm_interval < flag_alarm_interval_min || flag_alarm_interval > flag_alarm_interval_max) {
                show_informer_text("时间阈值范围 " + flag_alarm_interval_min + "~" + flag_alarm_interval_max);
                return
            }
        } else {
            $("#flag_state").hide()
            $("#state_loading").hide()
        }
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var flag_motion_prm = {}
        if (opera == 0) {
            flag_motion_prm.is_open = enable;
            cfg.body.param.flag_motion_prm = flag_motion_prm;
        } else if (opera == 1) {
            flag_motion_prm.is_open = 1;
            flag_motion_prm.flag_appear_event = {}
            flag_motion_prm.flag_appear_event.is_open = $("#flag_appear_event_enable").check_val() ? 1 : 0

            flag_motion_prm.flag_disappear_event = {}
            flag_motion_prm.flag_disappear_event.is_open = $("#flag_disappear_event_enable").check_val() ? 1 : 0

            flag_motion_prm.flag_error_event = {}
            flag_motion_prm.flag_error_event.is_open = $("#flag_error_event_enable").check_val() ? 1 : 0
            flag_motion_prm.flag_error_event.flag_error_time = {}
            flag_motion_prm.flag_error_event.flag_error_time.enable = 1
            flag_motion_prm.flag_error_event.flag_error_time.time = parseInt(flag_error_time)
            flag_motion_prm.flag_error_event.flag_error_time.alarm_interval = parseInt(flag_alarm_interval)
            cfg.body.param.flag_motion_prm = flag_motion_prm;
        }
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            if (opera == 1) {
                get_flag_motion_prm("flag_motion");
            }
        })
    }
    function flag_motion_back_default() {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var flag_motion_prm = {}
        flag_motion_prm.is_open = flag_motion_enable_default;
        flag_motion_prm.flag_appear_event = {}
        flag_motion_prm.flag_appear_event.is_open = flag_appear_event_enable_default

        flag_motion_prm.flag_disappear_event = {}
        flag_motion_prm.flag_disappear_event.is_open = flag_disappear_event_enable_default

        flag_motion_prm.flag_error_event = {}
        flag_motion_prm.flag_error_event.is_open = flag_error_event_enable_default
        flag_motion_prm.flag_error_event.flag_error_time = {}
        flag_motion_prm.flag_error_event.flag_error_time.enable = 1
        flag_motion_prm.flag_error_event.flag_error_time.time = flag_error_time_default
        flag_motion_prm.flag_error_event.flag_error_time.alarm_interval = flag_alarm_interval_default

        cfg.body.param.flag_motion_prm = flag_motion_prm;
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            get_flag_motion_prm("flag_motion");
        })
    }
    var nonv_motion_enable_default = null;
    var nonv_stay_time_min = null;
    var nonv_stay_time_max = null;
    var nonv_stay_time_default = null;
    var nonv_stay_event_enable_default = null
    var nonv_alarm_interval_min = null;
    var nonv_alarm_interval_max = null;
    var nonv_alarm_interval_default = null;
    function get_nonv_motion_prop(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prop";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = g_alg_chn;
        cfg.body.rule_chn = curRuleId;
        cfg.body.alg_prop_type = "nonv_motion_prm";
        cfg.body.alg_type = "lane_control";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.prop.nonv_motion_prm;
            nonv_motion_enable_default = jsondata.is_open['default'];

            var nonv_stay_event = jsondata.nonv_stay_event;
            nonv_stay_event_enable_default = nonv_stay_event.is_open['default'];
            var nonv_stay_time = nonv_stay_event.stay_time.time
            nonv_stay_time_min = nonv_stay_time.min
            nonv_stay_time_max = nonv_stay_time.max
            nonv_stay_time_default = nonv_stay_time['default'];

            var alarm_interval_time = nonv_stay_event.alarm_interval.time;
            nonv_alarm_interval_min = alarm_interval_time.min
            nonv_alarm_interval_max = alarm_interval_time.max
            nonv_alarm_interval_default = alarm_interval_time['default'];

            get_nonv_motion_prm(appname);
        })
    }
    function get_nonv_motion_prm(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.alg_prm_type = "nonv_motion_prm";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            jsondata = jsondata.body.param;
            var nonv_motion_prm = jsondata.nonv_motion_prm;
            var enable = nonv_motion_prm.is_open
            $("#" + appname + "_enable").check_val(enable == 1);
            var nonv_stay_event = nonv_motion_prm.nonv_stay_event;
            var nonv_stay_event_enable = nonv_stay_event.is_open
            var nonv_stay_time = nonv_stay_event.stay_time.time;
            var nonv_alarm_interval = nonv_stay_event.alarm_interval.time;
            $("#nonv_stay_time").val(nonv_stay_time);
            $("#nonv_alarm_interval").val(nonv_alarm_interval);
            $("#nonv_stay_event_enable").check_val(nonv_stay_event_enable == 1);
            ele_change(nonv_stay_event_enable, 'time_threshold')
            display_change(enable, appname + "_content", appname);
        })
    }
    function set_nonv_motion_prm(opera, enable) {
        if (opera == 1) {
            var nonv_stay_time = $("#nonv_stay_time").val();
            if (isNaN(nonv_stay_time) || nonv_stay_time < nonv_stay_time_min || nonv_stay_time > nonv_stay_time_max) {
                show_informer_text("时间阈值范围 " + nonv_stay_time_min + "~" + nonv_stay_time_max);
                return
            }
            var nonv_alarm_interval = $("#nonv_alarm_interval").val();
            if (isNaN(nonv_alarm_interval) || nonv_alarm_interval < nonv_alarm_interval_min || nonv_alarm_interval > nonv_alarm_interval_max) {
                show_informer_text("时间阈值范围 " + nonv_alarm_interval_min + "~" + nonv_alarm_interval_max);
                return
            }
        }
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var nonv_motion_prm = {}
        if (opera == 0) {
            nonv_motion_prm.is_open = enable;
            cfg.body.param.nonv_motion_prm = nonv_motion_prm;
        } else if (opera == 1) {
            nonv_motion_prm.is_open = 1;
            nonv_motion_prm.nonv_stay_event = {}
            nonv_motion_prm.nonv_stay_event.is_open = $("#nonv_stay_event_enable").check_val() ? 1 : 0
            nonv_motion_prm.nonv_stay_event.stay_time = {}
            nonv_motion_prm.nonv_stay_event.stay_time.enable = 1
            nonv_motion_prm.nonv_stay_event.stay_time.time = parseInt(nonv_stay_time)
            nonv_motion_prm.nonv_stay_event.alarm_interval = {}
            nonv_motion_prm.nonv_stay_event.alarm_interval.time = parseInt(nonv_alarm_interval)
            cfg.body.param.nonv_motion_prm = nonv_motion_prm;
        }
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            if (opera == 1) {
                get_nonv_motion_prm("nonv_motion");
            }
        })
    }
    function nonv_motion_back_default() {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var nonv_motion_prm = {}
        nonv_motion_prm.is_open = nonv_motion_enable_default;
        nonv_motion_prm.nonv_stay_event = {}
        nonv_motion_prm.nonv_stay_event.is_open = nonv_stay_event_enable_default
        nonv_motion_prm.nonv_stay_event.stay_time = {}
        nonv_motion_prm.nonv_stay_event.stay_time.enable = 1
        nonv_motion_prm.nonv_stay_event.stay_time.time = nonv_stay_time_default
        nonv_motion_prm.nonv_stay_event.alarm_interval = {}
        nonv_motion_prm.nonv_stay_event.alarm_interval.time = nonv_alarm_interval_default
        cfg.body.param.nonv_motion_prm = nonv_motion_prm;
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            get_nonv_motion_prm("nonv_motion");
        })
    }
    function get_car_pass(appname) {
        var req_method = get_module();
        var cfg = {};
        cfg.type = "get_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = g_alg_chn;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.alg_prm_type = "cross_line_pass_prm";
        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (ajaxdata) {
            var json = ajaxdata.body.param.cross_line_pass_prm;
            var direction = json.direction
            $("#car_pass_direction").select_val(direction);
            display_change(1, appname + "_content", appname);
        })
    }
    function set_car_pass(opera, enable) {
        var direction = parseInt($("#car_pass_direction").select_val());
        var req_method = get_module();
        var cfg = {};
        cfg.type = "set_alg_prm";
        cfg.module = req_method;
        cfg.body = {}
        cfg.body.alg_chn = 0;
        cfg.body.rule_chn = curRuleId;
        cfg.body.rule_enable = 1;
        cfg.body.param = {}
        var json = {}
        if (opera == 0) {
            json.is_open = enable;
            cfg.body.param.cross_line_pass_prm = json;
        } else if (opera == 1) {
            json.is_open = 1;
            json.direction = direction;
            cfg.body.param.cross_line_pass_prm = json
        }

        agent_tcp_proto(cur_device_type, cur_sn, cfg, function (jsondata) {
            show_informer();
            if (opera == 1) {
                get_car_pass();
            }
        })
    }
    var alg_arr = [
        { rule_type: 1, alg: ['car_motion', 'person_motion', 'nonv_motion'] },
        { rule_type: 2, alg: [] },
        { rule_type: 4, alg: ['car_pass'] },
        { rule_type: 8, alg: ['flag_motion'] }
    ]
    function rule_click(id, rule_type) {
        curRuleId = id
        $("#alg_tabs > div").hide();
        $("#alg_tabs > ul > li").hide();
        for (var i = 0; i < alg_arr.length; i++) {
            if (rule_type == alg_arr[i].rule_type) {
                for (var j = 0; j < alg_arr[i].alg.length; j++) {
                    $("#alg_tabs ." + alg_arr[i].alg[j] + "_tab").show();
                }
            }
        }
        $("#alg_tabs").tabs("refresh");
        $("#alg_tabs .ui-corner-top").each(function (index) {
            if ($(this).css('display') != 'none' && !$(this).hasClass('ui-state-disabled')) {
                $("#alg_tabs").tabs({ "active": index });
                $("#alg_tabs li:eq(" + index + ")").click();
                $("#alg_tabs").show();
                return false
            }
        });
    }
    function get_prop_prm(appname) {
        if (appname == "car_motion") {
            get_car_motion_prop(appname);
        } else if (appname == "person_motion") {
            get_person_motion_prop(appname);
        } else if (appname == "car_pass") {
            get_car_pass(appname);
        } else if (appname == "nonv_motion") {
            get_nonv_motion_prop(appname);
        } else if (appname == "flag_motion") {
            get_flag_motion_prop(appname);
        }
    }
    function display_change(enable, ele, appname) {
        if (enable == 1) {
            ele_change(1, ele)
            $('.rule[rule_id="' + curRuleId + '"] .alg_icon.' + appname).addClass('enable');
            $('#alg_tabs .alg_icon.' + appname).addClass('enable');
        } else {
            ele_change(0, ele)
            $('.rule[rule_id="' + curRuleId + '"] .alg_icon.' + appname).removeClass('enable');
            $('#alg_tabs .alg_icon.' + appname).removeClass('enable');
        }
    }
    function set_switchalg(enable, appname) {
        disable_alg_param(appname, 0, enable);
        if (enable == 1 && curRuleType != 2) {
            get_prop_prm(appname);
        }
    }
    function disable_alg_param(appname, opera, enable) {
        if (appname == "car_motion") {
            set_car_motion_prm(opera, enable);
        } else if (appname == "person_motion") {
            set_person_motion_prm(opera, enable);
        } else if (appname == "car_pass") {
            set_car_pass(opera, enable);
        } else if (appname == "nonv_motion") {
            set_nonv_motion_prm(opera, enable);
        } else if (appname == "flag_motion") {
            set_flag_motion_prm(opera, enable);
        }
        display_change(enable, appname + "_content", appname);
    }
    function close_video() {
        for (var i = 0; i < device_info.length; i++) {
            if (device_info[i].player) {
                if (ie.isIE) {
                    stop_video(device_info[i].player)
                    $("#" + device_info[i].player).remove()
                } else {
                    device_info[i].player.stop_video()
                }
            }
        }
    }
    function get_bind_info() {
        cur_id = -1
        complement_arr = []
        device_info = [
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' },
            { player: null, result_id: -1, result: null, rule: null, sn: '', device_type: '', ip: '' }
        ]
        $(".device_con").hide()
        $(".cm_td").html('')
        get_group_model(function () {
            var enable = $("#group_model").check_val();
            if (enable) {
                $(".device_con .device").hide()
                $(".device_con .add_con").show()
                get_bind_data()
            }
        });
    }
    function add_ax_listerner() {
        for (var i = 0; i < 4; i++) {
            var str = '<script id="linkage_ax_listerner' + i + '" language="javascript" for="ax' + i + '" event="OnMessageInfo(cmd_json)">try {var json = eval("(" + cmd_json + ")");if (json.type == "login_status") {if (json.state == 1) {console.log("ax login success");Linkage.ax_msg("init_param",' + i + ');}} else if (json.type == "select_rule" || json.type == "edit_rule") {Linkage.ax_msg(json.type, ' + i + ', json.rule_id, json.rule_type);}} catch (e) { }</script>'
            if ($("#linkage_ax_listerner" + i).length == 0) {
                $('head').append(str)
            }
        }
    }
    this.ax_msg = function (type, index, id, rule_type) {
        console.log('ax_msg', type, index, id, rule_type)
        if (type == 'select_rule') {
            var device_type = device_info[index].device_type
            var sn = device_info[index].sn
            cur_device_type = device_type
            cur_sn = sn
            com_rule_click(id, rule_type, device_type)
        } else if (type == 'init_param') {
            activex_play_new(0, 1, function () {
                get_rule(index)
            }, 'ax' + index);
        }
    }
    function reget_data() {
        show_loading('数据同步中...');
        get_rec_result_flag = false
        close_video()
        $(".device_con .device").hide()
        $(".device_con .add_con").show()
        $(".small_img_path_div").html('')
        $(".simulate_inner").html('')
        var reget_timer = setTimeout(function () {
            get_bind_info()
            hide_loading();
            clearTimeout(reget_timer);
        }, 5000)
    }
    function link() {
        var ip = $(this).parents('.device').attr('ip')
        window.open('http://' + ip)
    }
    var g_group_switch = 0;
    function get_group_switch(callback) {
        var req = {};
        req.type = "get_group_switch";
        dg_json_ajax(req, function (ajaxdata) {
            var json_data = eval("(" + ajaxdata + ")");
            if (json_data.state == 200) {
                var enable = json_data.enable;
                g_group_switch = enable;
                if (callback) {
                    callback();
                }
            }
        });
    }
    var get_rec_result_flag = true
    this.init = function () {
        if (ie.isIE) {
            add_ax_listerner()
        }
        get_device_capacity()
        init_data()
        $(".group_add").click(group_add)
        $(".add_img_con").click(group_add)
        $("#dg_submit").click(dg_submit);
        $(".find_device").click(find_device);
        $("#device_submit").click(on_submit);
        $("#device_cancel").click(function () {
            $("#device_bind_dialog").hide();
        });
        $(".trigger_btn").click(trigger_click);
        $(".set_rule").click(function () {
            var index = parseInt($(this).parents('.device_con').attr('index'))
            set_rule(index)
        });
        $(document).on("click", ".group_delete", unbind_device);
        $(document).on("click", ".link", link);
        create_tabs("#alg_tabs");
        $("#alg_tabs > ul > li").click(function () {
            var curAppName = $(this).attr('appname');
            $("#parameter > div").hide();
            $("#parameter > div[appname='" + curAppName + "']").show();
            $("." + curAppName + "_tab .tabs_container").append($("#parameter"));
            get_prop_prm(curAppName);
        })
        $("#nonv_motion_submit").click(function () {
            var nonv_stay_time = $("#nonv_stay_time").val();
            if (isNaN(nonv_stay_time) || nonv_stay_time < nonv_stay_time_min || nonv_stay_time > nonv_stay_time_max) {
                show_informer_text("时间阈值范围 " + nonv_stay_time_min + "~" + nonv_stay_time_max);
                return
            }
            set_nonv_motion_prm(1, 1);
        });
        $("#flag_motion_submit").click(function () {
            var flag_error_time = $("#flag_error_time").val();
            if (isNaN(flag_error_time) || flag_error_time < flag_error_time_min || flag_error_time > flag_error_time_max) {
                show_informer_text("时间阈值范围 " + flag_error_time_min + "~" + flag_error_time_max);
                return
            }
            set_flag_motion_prm(1, 1);
        });
        $("#car_motion_submit").click(function () {
            var car_stay_time = $("#car_stay_time").val();
            if (isNaN(car_stay_time) || car_stay_time < car_stay_time_min || car_stay_time > car_stay_time_max) {
                show_informer_text($.i18n.prop('car_stay_time_range') + " " + car_stay_time_min + "~" + car_stay_time_max);
                return
            }
            set_car_motion_prm(1, 1);
        });
        $("#person_motion_submit").click(function () {
            var person_stay_time = $("#person_stay_time").val();
            if (isNaN(person_stay_time) || person_stay_time < person_stay_time_min || person_stay_time > person_stay_time_max) {
                show_informer_text($.i18n.prop('person_stay_time_range') + " " + person_stay_time_min + "~" + person_stay_time_max);
                return
            }
            set_person_motion_prm(1, 1);
        });
        $("#car_pass_submit").click(function () {
            set_car_pass(1, 1);
        });
        $(".enable_container input[type='checkbox']").change(function () {
            var enable = $(this).check_val() ? 1 : 0;
            var appname = $(this).attr('appname');
            set_switchalg(enable, appname);
        })
        $(".unbind").click(unbind_group)
        get_talk_para()
        get_ast_mode();
        get_ast_dealy_time();
        get_device_match_mode();
        get_group_shared_io();
        eventInit()
        get_group_switch(function () {
            get_bind_info()
        })
    }
    this.close = function () {
        close_page = true
        get_rec_result_flag = false
        $(document).off("click", ".group_delete");
        $(document).off("click", ".link");
        eventClose()
        close_video()
    }
    close_json['Linkage'] = this.close
}
