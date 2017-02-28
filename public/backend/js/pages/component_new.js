/**
 * Created by hung on 26/02/17.
 */
'use strict';
var clicked          = false;
var step             = 2;
var formGroupAppend  = $('#form-list-group');
var groupstep        = JSON.parse(sessionStorage.getItem('groupsteps') || "[]");
var newPicture       = sessionStorage.getItem('new_picture');

var buttonAddStep = function ()
{
    $('.button_add_step').click(function (e)
    {
        e.preventDefault();
        if(clicked)
        {
            alert('The system is processing... Please wait');
            return '';
        }
        // Check group ton tai thi step nhay vao day
        step  = ($('.form-group-step').length > 0) ? $('.form-group-step').length + 1 : step;

        clicked = true;
        $.ajax({
            url : BASE_URL + '/new/step',
            type : 'POST',
            dataType : 'json',
            data : { step : step }
        }).success(function (response)
        {
            if (response.code && response.message == 'success')
            {
                formGroupAppend.append(response.groupstep);
                if (typeof(Storage) !== "undefined")
                {
                    // Có thể sử dụng localStorage/sessionStorage.
                    groupstep[response.s] =
                    {
                        id    : response.s,
                        value : '',
                    };
                    storeGroupStep();
                }
                else
                {
                    // Trình duyệt không hỗ trợ Local storage.
                    alert('Rất tiếc, trình duyệt của bạn không hỗ trợ local storage...');
                }
            }
        }).error(function (e)
        {
            alert("Something went wrong . We couldn't add. Please try reload your browser");
        }).always(function ()
        {
            step ++;
            clicked = false;
        });
    });
}

var htmlGroupStep = function ($step, $value)
{
    var html  = '<div class="form-group form-group-step" data-id="' + $step + '" id="step-' + $step + '">';
            html += '<div class="control-label-header">';
            html += '<label class="label label-warning label-step label-step-' + $step + '">' + $step + '</label>';
            if($step != 1)
                html += '<label class="label label-warning label-action label-delete" title="Xóa bước ' + $step + '"><i class="fa fa-trash-o"></i></label>';
            html += '</div>';
            html += '<div class="form-control-content">';
                html += '<textarea class="form-control form-control-auto" name="" placeholder="Mô tả cách làm từng bước ..." id="form-control-' + $step + '" cols="30" rows="3">' + $value + '</textarea>';
            html += '</div>';
        html += '</div>';
    return html;
}

// Add mot group Step cho su kien input add
var addGroupStep = function ()
{
    $(document).on('input', '.form-control-auto', function ()
    {
        var value       = $(this).val();
        var stepId      = $(this).closest('.form-group-step').attr('data-id');
        // var stepHtml    = htmlGroupStep(stepId, value);
        // Kiem tra su ton tai cua group nay co trong sesionStorage
        if (groupstep && stepId)
        {
            $.each(groupstep, function (k, v)
            {
                // Cap nhat lai store do tai day
                if (stepId == k)
                {
                    groupstep[k] = {id : stepId, value : value};
                    storeGroupStep();
                }
            });
            return ;
        }
    });
}

var getGroupStepBefore = function ()
{
    groupstep[1] = { id      : 1, value   : ''};
    storeGroupStep();
}

// Xoa di mot groupStep
var removeGroupStep = function ()
{
    $(document).on('click', '.label-delete', function () {
        if (confirm('Bạn có chắc chắn muốn xóa'))
        {
            var formGroupStep   = $(this).closest('.form-group-step');
            var formGroupId     = formGroupStep.attr('data-id');
            // Xoa o sessionStorage va Browser
            for(var i =1; i< groupstep.length; i++)
            {
                if(groupstep[i].id == formGroupId)
                {
                    groupstep.splice(i, 1);
                    formGroupStep.remove();
                }
            }
            resetGroupStep();
        }
    });
}

// Reset lai thông tin tất cả
var resetGroupStep = function ()
{
    var resetGroupstep = [];
    var html = '';
    $.each(groupstep, function (index, item)
    {
        if(item)
        {
            resetGroupstep[index] =
            {
                id      : index,
                value   : item.value
            };
            html += htmlGroupStep(index, item.value);
        }
    });
    groupstep = resetGroupstep;
    storeGroupStep();
    formGroupAppend.html(html);
}

// Luu thong tin mot groupStep
var storeGroupStep = function ()
{
    sessionStorage.setItem('groupsteps', JSON.stringify(groupstep));
}

// Khi load trinh duyet lai thi show thong tin da save
var loadDataForm = function ()
{
    // Chua co thi add default tam mot group
    if (groupstep.length === 0) getGroupStepBefore();


    // Show ra hinh anh cho file avatar
    if (newPicture)
    {
        $('.recipe_image_default').hide();
        $('.recipe_show_image').show().removeClass('hide');
        $('#recipe_show_image').attr('src', newPicture);
        $('#new_picture').val(newPicture);
    }
    // co roi thi in ra thui
    if (groupstep)
    {
        var html     = '';
        $.each(groupstep, function (i, item)
        {
            if (item) html += htmlGroupStep(item.id, item.value);
        });
        formGroupAppend.html(html);
    }
}

var uploadFile = function (event)
{
    var files   = event.target.files;
    var path    = $('#recipe_show_image').attr('src');
    var data    = new FormData();
    $.each(files, function(key, value)
    {
        data.append(key, value);
    });
    data.append('src', path);
    if (files.length >0)
    {
        $.ajax({
           url: BASE_URL + '/new/upload-file',
           type: 'POST',
           data: data,
           dataType: 'json',
           processData: false,
           contentType: false,
           success: function(response)
           {
               if(response.status == 1)
               {
                   $('.recipe_image_default').hide();
                   $('.recipe_show_image').show().removeClass('hide');
                   $('#recipe_show_image').attr('src', response.msg);
                   $('#new_picture').val(response.msg);
                   sessionStorage.setItem('new_picture', response.msg);

               }
           },
           error: function(jqXHR, textStatus, errorThrown)
           {
               console.log('ERRORS: ' + textStatus);
           }
        });
    }
}

var deleteImageAvatar = function ()
{
    $('.button_delete').click(function () {
        var path = $('#recipe_show_image').attr('src');
        $.ajax({
            url: BASE_URL + '/new/upload-file',
            type: 'POST',
            data: {
                src     : path,
                action  : 'delete'
            },
            dataType: 'json',
            success: function(response)
            {
                if(response.status == 1)
                {
                    $('.recipe_image_default').show();
                    $('.recipe_show_image').hide();
                    $('#new_picture').val('');
                    sessionStorage.removeItem('new_picture');
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log('ERRORS: ' + textStatus);
            }
        });
    })
}

$(document).ready(function () {
    buttonAddStep();
    loadDataForm();
    addGroupStep();
    removeGroupStep();
    deleteImageAvatar();
    $('#new_picture_face').change(uploadFile);
});

