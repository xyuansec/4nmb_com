var currentpage = 0;

$(document).ready(function () {
    if ($(window).width() > 1199 && localStorage.getItem("nav_resize") === "true") {
        switchnav();
    }
    $(".gifs").gifplayer({
        label: '&#x25b7;'
    });
    $("#gototop").hide();
    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            $("#gototop").fadeIn("slow");
        } else {
            $("#gototop").hide();
        }
    });
    $("#gototop").click(function () {
        $("html,body").animate({scrollTop: 0});
    });
    $(".thread-list img").click(function () {
        if ($(this).attr("class").indexOf("gifs") == -1) {
            if ($(this).attr("data-big") === undefined || $(this).attr("data-big") === "false") {
                let tempsrc = $(this).attr("src");
                $(this).attr("src", tempsrc.split(".")[0] + "_source." + tempsrc.split(".")[1]);
                $(this).css("cursor", "zoom-out");
                $(this).addClass("maxwidth");
                $(this).attr("data-big", "true");
            } else {
                let tempsrc = $(this).attr("src");
                $(this).attr("src", tempsrc.replace("_source", ""));
                $(this).css("cursor", "zoom-in");
                $(this).removeClass("maxwidth");
                $(this).attr("data-big", "false");
            }
        }
    });
    $(".feelings-body ul li").click(function (e) {
        let textarea_feel = $(".textarea-feel");
        var str = $(textarea_feel).val();
        str += $(e.target).html();
        $(textarea_feel).val(str);
    });
    $(".fastcomment").keypress(function (e) {
        if (e.which === 13) {
            fastcomment($(this).attr("data-id"), $(this).val())
        }
    });
});

function fastcomment(id, content) {
    if (content.length < 5 || content.length > 5000) {
        alertmsg("确保内容至少6个字符！");
        return false;
    }

    var formData = new FormData();
    formData.append("content", content);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/fastcomment/" + id,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"))
        },
        success: function (result) {
            if (result["code"] === 0) {
                alertmsg(result["msg"])
            } else {
                alertmsg("回复成功！")
                window.location.reload()
            }
        },
        error: function () {
        }
    });
}

function switchnav() {
    let nav_collapse = $(".navbar-collapse");
    let content_box = $("#content-box");
    let navbar_vertical = $(".navbar-vertical");
    if ($(nav_collapse).hasClass("resize")) {
        localStorage.setItem("nav_resize", false);
        $(nav_collapse).removeClass("resize");
        if ($(window).width() <= 1199) {
            $(nav_collapse).removeClass("navicon-show");
        } else {
            $(nav_collapse).removeClass("navicon-hide");
            $(".pr-lg-2.mb-3.col-lg-8").css("z-index", "0");
        }
        $(content_box).addClass("content");
        $(navbar_vertical).css("z-index", "1026")
    } else {
        localStorage.setItem("nav_resize", true);
        $(nav_collapse).addClass("resize");
        if ($(window).width() <= 1199) {
            $(nav_collapse).addClass("navicon-show");
        } else {
            $(nav_collapse).addClass("navicon-hide");
            $(".pr-lg-2.mb-3.col-lg-8").css("z-index", "1027");
        }
        $(content_box).removeClass("content");
        $(navbar_vertical).css("z-index", "1026")
    }
}

function tologin() {
    $(".publish").hide();
    $(".comment").hide();
    $(".register").hide();
    $(".login").css("display", "block");
}

function toregister() {
    $(".publish").hide();
    $(".login").hide();
    $(".register").css("display", "block");
}

function login() {
    let login_submit = $(".login-submit");
    let error_msg = $(".error_msg");
    $(login_submit).text("等待中...");
    $(error_msg).text("");

    var name = $(".login-name").val();
    var passwd = $(".login-passwd").val();

    if (name.length < 5 || name.length > 15 || passwd.length < 5 || passwd.length > 15) {
        $(error_msg).text("（应在6到15字符之间！）");
        $(login_submit).text("提交!");
        return false;
    }

    var formData = new FormData();
    formData.append("name", name);
    formData.append("passwd", passwd);

    $(login_submit).attr('disabled', true);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/login/",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"))
        },
        success: function (result) {
            if (result["code"] === 0) {
                $(".error_msg").text("（" + result["msg"] + "）")
            } else {
                $(".login-submit").text("成功!");
                $(".error_msg").text("");
                window.location.reload()
            }
            $(".login-submit").text("提交!");
        },
        error: function () {
        }
    });
}

function publish() {
    let publish_submit = $(".publish-submit");
    let error_msg = $(".error_msg");
    $(publish_submit).text("等待中...");
    $(error_msg).text("");

    var content = $(".publish-content").val();
    var image = $(".publish-image")[0].files[0];
    var category = $(".publish-category").val();
    var rewardnb = $(".publish-rewardnb").val();

    if (content.length < 5 || content.length > 5000) {
        $(error_msg).text("（确保内容至少6个字符！）");
        $(publish_submit).text("发射!");
        return false;
    }

    var formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);
    formData.append("category", category);
    formData.append("rewardnb", rewardnb);

    $(publish_submit).attr('disabled', true);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/publish/",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"))
        },
        success: function (result) {
            if (result["code"] === 0) {
                $(".error_msg").text("（" + result["msg"] + "）")
            } else {
                window.location.reload()
            }
            $(".publish-submit").text("发射!");
        },
        error: function () {
        }
    });
}

function comment() {
    let comment_submit = $(".comment-submit");
    let error_msg = $(".error_msg");
    $(comment_submit).text("等待中...");
    $(error_msg).text("");

    var content = $(".comment-content").val();
    var parentid = $("#comment-parentid").val();
    var image = $(".comment-image")[0].files[0];
    var threadid = $(comment_submit).attr("data-thread");

    if (content.length < 5 || content.length > 5000) {
        $(error_msg).text("（确保内容至少6个字符！）");
        $(comment_submit).text("回复!");
        return false;
    }

    var formData = new FormData();
    formData.append("content", content);
    formData.append("parentid", parentid);
    formData.append("image", image);

    $(comment_submit).attr('disabled', true);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/comment/" + threadid,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"))
        },
        success: function (result) {
            if (result["code"] === 0) {
                $(".error_msg").text("（" + result["msg"] + "）")
            } else {
                window.location.reload()
            }
            $(".comment-submit").text("回复!");
        },
        error: function () {
        }
    });
}

function alertmsg(content) {
    $("#message .modal-body").text(content);
    $("#message").modal();
}

function good(e) {
    var id = $(e).attr("data-id");
    var type = $(e).attr("data-type");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/good/" + type + "/" + id,
        success: function (result) {
            if (result["code"] === 0) {
                alertmsg(result["msg"]);
            } else {
                let likenumb = $(e).find(".likenumb").text();
                $(e).find(".likenumb").text((parseInt(likenumb) + 1) + "");
            }
            $(".comment-submit").text("发射!");
        },
        error: function () {
        }
    });
}

function reply(e) {
    let obj = $(".comment");
    let comment_content = $(".comment-content");
    $(obj).removeClass("resize");
    $(obj).find(".card-footer").show();
    $(obj).find(".card-body").show();
    let nickname = $(e).attr("data-author");
    let commid = $(e).attr("data-commid");
    $(comment_content).attr("placeholder", "@" + nickname + " ");
    $("#comment-parentid").val(commid);
}

function signpoint() {
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/signpoint/",
        success: function (result) {
            alertmsg(result["msg"]);
        },
        error: function () {
        }
    });
}

function register() {
    let register_submit = $(".register-submit");
    let error_msg = $(".error_msg");
    $(register_submit).text("等待中...");
    $(error_msg).text("");

    var name = $(".register-name").val();
    var email = $(".register-email").val();
    var passwd = $(".register-passwd").val();

    if (name.length < 5 || name.length > 15 || passwd.length < 5 || passwd.length > 15) {
        $(error_msg).text("（数据填写错误！）");
        $(register_submit).text("提交!");
        return false;
    }

    var formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("passwd", passwd);

    $(register_submit).attr('disabled', true);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/register/",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"))
        },
        success: function (result) {
            if (result["code"] === 0) {
                $(".error_msg").text("（" + result["msg"] + "）")
            } else {
                $(".register-submit").text("成功!");
                $(".error_msg").text("");
                window.location.reload()
            }
            $(register_submit).text("提交!");
        },
        error: function () {
        }
    });
}

function setgodcomment(e) {
    if (confirm("是否确认盖上神评论？")) {
        let threadid = $(e).attr("data-threadid");
        let commentid = $(e).attr("data-commentid");
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/setgodcomment/" + threadid + "/" + commentid,
            success: function (result) {
                window.location.reload()
            },
            error: function () {
            }
        });
    }
}

function setrecvemail(e) {
    let recvflag = $("#email-isrecv").attr("data-recvflag");
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/setrecvemail/" + recvflag,
        success: function (result) {
            window.location.reload()
        },
        error: function () {
        }
    });
}

function setlocation() {
    let locatflag = $("#locat-isopen").attr("data-locatflag");
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/setlocation/" + locatflag,
        success: function (result) {
            window.location.reload()
        },
        error: function () {
        }
    });
}

function resizepublish(e) {
    let obj = $(".card-box");
    if ($(obj).hasClass("resize")) {
        $(obj).removeClass("resize");
        $(obj).find(".card-footer").show();
        $(obj).find(".card-body").show();
    } else {
        $(obj).addClass("resize");
        $(obj).find(".card-footer").hide();
        $(obj).find(".card-body").hide();
    }
}

function setzuijiacomment(e) {
    if (confirm("是否确认为最佳答案？")) {
        let threadid = $(e).attr("data-threadid");
        let commentid = $(e).attr("data-commentid");
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/setzuijiacom/" + threadid + "/" + commentid,
            success: function (result) {
                window.location.reload()
            },
            error: function () {
            }
        });
    }
}

function feelingswitch() {
    let feeling_body = $(".feelings-body");
    if ($(feeling_body).hasClass("resize")) {
        $(feeling_body).removeClass("resize");
        $(feeling_body).hide();
    } else {
        $(feeling_body).addClass("resize");
        $(feeling_body).show();
    }
}

function update() {
    let update_submit = $(".update-submit");
    let error_msg = $(".error_msg");
    $(update_submit).text("等待中...");
    $(error_msg).text("");

    var content = $(".update-content").val();
    var image = $(".update-image")[0].files[0];
    var threadid = $(update_submit).attr("data-threadid");

    if (content.length < 5 || content.length > 5000) {
        $(error_msg).text("（确保内容至少6个字符！）");
        $(update_submit).text("提交!");
        return false;
    }

    var formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);
    formData.append("threadid", threadid);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/update/",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"))
        },
        success: function (result) {
            if (result["code"] === 0) {
                $(".error_msg").text("（" + result["msg"] + "）")
            } else {
                window.location.reload()
            }
            $(".update-submit").text("提交!");
        },
        error: function () {
        }
    });
}

function toupdate() {
    $(".comment").hide();
    $(".update").show();
}

function generacode(e) {
    let threadid = $(e).attr("data-threadid")
    if (threadid !== undefined) {
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/generacode/" + threadid,
            success: function (result) {
                if (result["code"] === 0) {
                    alertmsg(result["msg"])
                } else {
                    $("#message .modal-body").html("<img src='" + result["msg"] + "' style='width:100%;height:100%' />");
                    $("#message").modal();
                }
            },
            error: function () {
            }
        });
    }
}

function updateprofile() {
    let profile_submit = $(".profile-submit");
    let error_msg = $(".error_msg");
    $(profile_submit).text("等待中...");
    $(error_msg).text("");

    var name = $("#profile-name").val();
    var email = $("#profile-email").val();
    var avator = $("#profile-avator")[0].files[0];
    var mysite = $("#profile-mysite").val();
    var passwd = $("#profile-passwd").val();
    var whatdoth = $("#profile-whatdoth").val();

    var formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avator", avator);
    formData.append("mysite", mysite);
    formData.append("passwd", passwd);
    formData.append("whatdoth", whatdoth);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/uprofile/",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"))
        },
        success: function (result) {
            if (result["code"] === 0) {
                $(".error_msg").text("（" + result["msg"] + "）")
            } else {
                window.location.reload()
            }
            $(".profile-submit").text("更新资料!");
        },
        error: function () {
        }
    });
}

function shareqq(e) {
    var config = {
        url: $(e).attr("data-url"),
        summary: $(e).attr("data-content"),
        pics: $(e).attr("data-pic")
    };
    var config_encode = [];
    for (var i in config) {
        config_encode.push(i + '=' + encodeURIComponent(config[i] || ''));
    }
    var target_url = "https://connect.qq.com/widget/shareqq/index.html?" + config_encode.join('&');
    window.open(target_url, 'qq');
}

function setniminswh() {
    let niminflag = $("#niminswh-isopen").attr("data-niminflag");
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/setniminswh/" + niminflag,
        success: function (result) {
            window.location.reload()
        },
        error: function () {
        }
    });
}

function sendactive() {
    var sendactive = $("#sendactive");
    sendactive.unbind('click');
    sendactive.text("发送中...");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/active",
        success: function (result) {
            alertmsg(result["msg"]);
            sendactive.text("发送完毕！")
        },
        error: function () {
        }
    });
}

function videosearch() {
    var content = $("#videosearchcontent").val()
    if (content.length === 0) {
        alertmsg("不能为空");
        return
    }
    location.href = "/cinema/search/?content=" + content;
}