window.noticeAction = function (action,notice_id) {
    if(action == 'comment'){
        window.cHtml = $("#notice_comments_" + notice_id).html();
        $("#notice_comments_" + notice_id).html(`<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>`);
        postComment(notice_id,cHtml);
    } else {
        const cHtml = $("#notice_likes_" + notice_id).html();
        $("#notice_likes_" + notice_id).html(`<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>`);
        $.ajaxSetup({
            headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
        });
        $.ajax({
            type: "POST",
            cache: false,
            url: `api/notice/perform_action/${notice_id}`,
            data: {
                n_action: action
            }
        }).done(function (result) {
            if(action == 'like'){
                $("#notice_likes_" + notice_id).html(`<button type="button" class="btn btn-outline btn-sm" onclick="noticeAction('unlike',${notice_id})"><i class="fas fa-heart" style="color: red"></i>&nbsp;&nbsp;${result.total_likes}</button>`);
            }
            if(action == 'unlike'){
                $("#notice_likes_" + notice_id).html(`<button type="button" class="btn btn-outline btn-sm" onclick="noticeAction('like',${notice_id})"><i class="far fa-heart" style="color: red"></i>&nbsp;&nbsp;${result.total_likes}</button>`);
            }
            $('#liked_records').html(`<i class="fas fa-heart" style="color: coral"></i>&nbsp;&nbsp;<a href="/?filter=liked">Liked Records</a> - ${result.liked_records}`);
        }).fail(function (xhr, result, status) {
            alert('GetPermissions ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
            $("#notice_likes_" + notice_id).html(cHtml);
        });
    }
}

function postComment(notice_id,cHtml) {
    $('#commentCloseBtn').attr("onclick",`commentAction('close',${notice_id})`);
    $('#commentCloseBtn1').attr("onclick",`commentAction('close',${notice_id})`);
    $('#commentInput').val('');
    $('#commentPostButton').attr("onclick",`commentAction('post',${notice_id})`);
    $('#addCommentBody').html();
    window.$('#addComment').modal();
}

window.commentAction = function (action,notice_id) {
    if (action == 'close') {
        $("#notice_comments_" + notice_id).html(window.cHtml);
    } else {
        var cmnt = $('#commentInput').val();
        if (cmnt != ''){
            window.$('#addComment').modal('hide');
            $.ajaxSetup({
                headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
            });
            $.ajax({
                type: "POST",
                cache: false,
                url: `api/notice/perform_action/${notice_id}`,
                data: {
                    n_action: 'comment_create',
                    comment_text: cmnt
                }
            }).done(function (result) {
                $("#notice_comments_" + notice_id).html(`<button type="button" class="btn btn-outline btn-sm" onclick="noticeAction('comment',${notice_id})"><i class="fas fa-comment" style="color: purple"></i>&nbsp;&nbsp;${result.total_comments}</button>`);
                $("#commented_records").html(`<i class="fas fa-comment" style="color: purple"></i>&nbsp;&nbsp;<a href="/?filter=commented">Commented Records</a> - ${result.commented_notices}`);
            }).fail(function (xhr, result, status) {
                alert('GetPermissions ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
                $("#notice_comments_" + notice_id).html(window.cHtml);
            });
        }
    }
}