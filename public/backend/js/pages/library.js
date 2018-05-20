/**
 * Created by hung on 31/01/17.
 * Thu vien js cho bo admin  ho tro cac ham su dung
 * Active multiple menu tab . vao block_sidebar bo comment
 * {{--onclick="return false;"--}}
 * {{--target="_blank"--}}
 * Va bo comment o ham clickMenuSidebar()
 */

var hei = $(window).height();

// Tính số frameHeight
function calcHeightFrame(id) {
    var divHeight = hei - 70;
    $("#" + id).height(divHeight);
}


// Chọn tab menu trong admin

function selectTab(id) {
    $(".tabs_menu_child").removeClass('tabs_menu_select active');
    $(".tabs_content_child").removeClass('tabs_content_select active');

    $("#tabs_menu_" + id).addClass('tabs_menu_select active');
    $("#tabs_content_" + id).addClass('tabs_content_select active');
}

// click tab menu
function clickMenuSidebar() {
    $('.tab').click(function () {
        var obj = $(this);
        var frame_id = obj.attr('id');
        var idtab_menu = "tabs_menu_" + frame_id;
        var idtab_content = "tabs_content_" + frame_id;
        var frame_reload = "idframe_" + frame_id;
        var source = obj.attr('href');
        var title = '<span class="icon-refresh tab-icon" ' +
            'onclick="reload_iframe(\'' + frame_reload + '\')" ' +
            'title="Reload Tab"></span>&nbsp;&nbsp;' + obj.attr("rel");

        $(".tabs_menu_child").removeClass('tabs_menu_select active');
        $(".tabs_content_child").removeClass('tabs_content_select');

        if ($("#" + idtab_content).html() != null) {
            $("#" + idtab_menu).addClass('active tabs_menu_select');
            $("#" + idtab_content).addClass('tabs_content_select');
            reload_iframe(frame_reload);
        } else {
            var closeMenu = '<span class="ui-tabs-close ui-icon ui-icon-close ui-state-hover tab-icon tab-close" data-li="' + idtab_menu + '" ' +
                'onclick="closeTabMenu(\'' + frame_id + '\')" title="Close Tab"><i class="icon-close"></i></span>';
            var htmlMenu = '<li id="' + idtab_menu + '" class="active tabs_menu_child tabs_menu_select">' +
                '<a class="select_tab" href="javascript:;" onClick="selectTab(\'' + frame_id + '\');">' + title + closeMenu + '</a>' +
                '</li>';

            var htmlContent = '<div id="' + idtab_content + '" ' +
                'class="active tabs_content_child tabs_content_select">' +
                '<iframe id="' + frame_reload + '" src="' + source + '" ' +
                'frameborder="0" width="100%" ' + 'onLoad="calcHeightFrame(\'idframe_' + frame_id + '\');"></iframe>' +
                '</div>';

            $("#tabs_menu").append(htmlMenu);
            $("#tabs_content").append(htmlContent);
        }

        return false;
    });
}

// Đóng tab menu
function closeTabMenu(id) {
    var idtab_menu = 'tabs_menu_' + id;
    var idtab_content = 'tabs_content_' + id;

    if (confirm('You are sure close this tab')) {
        $('#' + idtab_menu).remove();
        $('#' + idtab_content).remove();
    }
    return false;
}

// reload lại iframe đang hoạt động
function reload_iframe(id) {
    document.getElementById(id).src = document.getElementById(id).src;
}


// Tong hop cac ham ho tro in danh sach
function setCheckAllTable() {
    $('#check_all_table').change(function () {
        var check_all = $(this).attr('data-set');
        var check_all_checked = $(this).is(":checked");

        $(check_all).each(function () {
            check_all_checked
                ? ($(this).prop("checked", true))
                : ($(this).prop("checked", false));
        })
    });
}

function getAllValueCheckedTable() {
    var selected_value = [];
    $("#dataTableList .check-one:checked").each(function () {
        selected_value.push($(this).val());
    });

    return selected_value;
}

function hoverTrContentTable() {
    $('#tableContent tr').hover(function () {
        $(this).attr('bgcolor', '#CEEED9');
    }, function () {
        $(this).attr('bgcolor', '');
    });
}

/**
 * Cap nhat thong tin checked
 *
 */
var $click_flag = false;
function updateCheck(target) {
    var href = target.getAttribute('href');
    var field = target.getAttribute('field');
    var record_id = target.getAttribute('record_id');
    var srcAfter = target.getAttribute('data-img');
    var srcBefore = target.firstChild.getAttribute('src');

    if ($click_flag) {
        alert('The system is processing ...');
        return '';
    }
    $click_flag = true;

    $.ajax({
        type: 'POST',
        url: href,
        data: {
            field: field,
            record_id: record_id
        },
        dataType: 'json'
    }).done(function (response) {
        if (response.status == 1 || response.status == 'success') {
            target.firstChild.setAttribute('src', srcAfter);
            target.setAttribute('data-img', srcBefore);
        }
    })
        .fail(function (e) {
            alert('The wrong is went ...');
        })
        .always(function () {
            $click_flag = false;
        });
    return '';

}

/**
 * Ham thuc hien chuc nang nhanh cua table
 * Từ hàm này trở xuống chuyên xử lý ajax
 */
function executeFormTable() {
    $click_flag = false;
    $('.execute_form').click(function () {
        $action = $(this).attr('data-action');
        // Do something
        if ($click_flag) {
            alert('The system is processing ...');
            return '';
        }

        switch ($action) {
            case 'deleteAll':
                var $valueCheckedArr = getAllValueCheckedTable();
                if ($valueCheckedArr.length < 1) {
                    alert('Vui lòng chọn một bản ghi.');
                    return false;
                }
                var isConfirm = confirm('Bạn có chắc chắn muốn xóa tạm thời');
                if (!isConfirm) return;

                var $href = $('#hrefDeleteAll').val();
                // Send ajax
                $click_flag = true;
                $.ajax({
                    type: 'POST',
                    url: $href,
                    dataType: 'json',
                    data: {
                        id: $valueCheckedArr,
                        action: 'deleteAll'
                    },
                })
                    .done(function (response) {
                        if (response.status == 1 || response.status == 'success') {
                            for ($i = 0, $total = $valueCheckedArr.length; $i < $total; $i++) {
                                $('#tr_' + $valueCheckedArr[$i]).hide('slow').remove();
                                // location.reload();
                            }
                        }
                    })
                    .fail(function (e) {
                        alert('The wrong is went ...');
                    })
                    .always(function () {
                        $click_flag = false;
                    });


                break;
        }
        return false;
    })
}

// Scrolltop
var scrollTop = function () {
    $(window).scroll(function () {
        var height = $(window).scrollTop();
        if (height > 200) {
            $('.scroll-top').removeClass('hidden');
        } else {
            $('.scroll-top').addClass('hidden');
        }
    });
    $('.button-scroll-top').click(function () {
        $("html, body").animate({scrollTop: 0}, "slow");
        return false;
    });
}

// Sửa nhanh thông tin
function EditQuickXtable($url, $selector) {
    $($selector).editable({
        type: 'text',
        url: $url,
        placement: 'top',
        params: function (params) {
            var $field = $(this).attr("field");
            var $record_id = $(this).attr("record_id");
            var data = {};
            data['field'] = $field;
            data['record_id'] = $record_id;
            data['value'] = params.value;
            return data;
        },
        send: 'always'
    });
}

function initIntergratePlugin() {

    $('#select2').selectpicker({
        noneSelectedText: '',
        liveSearch: true,
        maxOptions: 8,
        multipleSeparator: ' | '
    });

    $(".colorpicker").asColorPicker();
    // $('#dataTableList').DataTable({
    //     'order'    : [[0, 'desc']],
    //     bFilter    : false,
    //     bInfo      : false,
    //     paging     : false,
    //     searching  : false
    // });
}


// Upload file priview default
// var UploadFile = function () {
//
//     var handleChangeInputFile = function () {
//         $('input[type=file]').change(function (e) {
//             var value = e.target.value;
//         })
//     }
//
//
//     return {
//         init: function () {
//             handleChangeInputFile();
//         }
//     }
// }();

$(document).ready(function () {
    setCheckAllTable();
    executeFormTable();
    hoverTrContentTable();
    initIntergratePlugin();
    scrollTop();
    clickMenuSidebar();
    // UploadFile.init();
});