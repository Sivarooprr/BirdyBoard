require('./jquery.dataTables.min')
require('./dataTables.bootstrap4.min')
$(document).ready(function() {
    //update the html content before reload
    $('#uTableCard').html('<div class="table-responsive"><table id="user_table" class="table table-bordered table-sm" width="100%" cellspacing="0"></table></div>');
    var uListingTable = $('#user_table').DataTable({
        ajax: 'api/get_user_listing',
        columns: [
            {title: 'First Name', data: 'first_name'},
            {title: 'Last Name', data: 'last_name'},
            {title: 'Email', data: 'email'},
            {title: 'Admin', data: 'is_admin'},
            {title: 'Verified', data: 'is_verified'},
            {title: 'Department', data: 'department'},
            {title: 'Semester', data: 'semester'},
            {title: 'Created At', data: 'created_at'},
            {title: 'Updated At', data: 'updated_at'},
            {title: 'Actions'}
        ],
        serverSide: true,
        processing: true,
        // scrollX: true,
        bAutoWidth: false,
        bDestroy: true,
        language: {
            loadingRecords: '&nbsp;',
            processing: 'Loading...',
            emptyTable: 'No data available',
            // lengthMenu: "_MENU_", //show only drop down for records per page
            // search: "_INPUT_",
            // searchPlaceholder: "Search..."
        },
        columnDefs: [
            { searchable: false, targets: [3,4,7,8,9,-1] },
            {
                targets: [7,8],
                createdCell: function (td, cellData, rowData, row, col) {
                    if (cellData) {
                        $(td).addClass("time_string");
                    }
                }
            },
            {
                targets: [3,4],
                createdCell: function (td,cellData,rowData,row,col) {
                    $(td).css('text-align','center');
                    if(cellData == true){
                        $(td).html('<i class="fas fa-check-circle" style="color: green"></i>');
                    } else {
                        $(td).html('<i class="fas fa-times-circle" style="color: red"></i>');
                    }
                }
            },
            {
                targets: [-1],
                data: null,
                orderable: false,
                createdCell: function (td, cellData, rowData, row, col) {
                    if(rowData.is_verified == true) {
                        $(td).html('<button id="userDisable" class="btn btn-sm btn-outline-dark"><i class="fas fa-times" style="color: red"></i>&nbsp;Disable</button>');
                        $(td).children('#userDisable').attr('id','userDisable' + rowData.id);
                        $(td).children('#userDisable' + rowData.id).attr("onclick",`userAction('disable',${rowData.id})`);
                    } else {
                        $(td).html('<button id="userEnable" class="btn btn-sm btn-outline-dark"><i class="fas fa-check" style="color: green"></i>&nbsp;Enable</button>');
                        $(td).children('#userEnable').attr('id','userEnable' + rowData.id);
                        $(td).children('#userEnable' + rowData.id).attr("onclick",`userAction('enable',${rowData.id})`);
                    }
                }
            }
        ]
    });
    uListingTable.on('draw', function () {
        $('.time_string').each(function() {
            this.textContent = moment(this.textContent).format('DD-MM-YYYY hh:mm A');
        });
    });
});

window.userAction = function(act,uId) {
    var action = act == 'enable' ? 'Enable' : 'Disable';
    var dec = confirm(`${action} user?`);
    if (dec) {
        $("#user_table :button").attr("disabled", "true");
        $.ajaxSetup({
            headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
        });
        $.ajax({
            type: "POST",
            cache: false,
            url: 'api/update_user',
            data: {
                'act': act,
                'uId': uId
            }
        }).done(function (result) {
            $('#user_table').DataTable().ajax.reload();
        }).fail(function (xhr, result, status) {
            alert('GetPermissions ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
            $("#user_table :button").removeAttr("disabled");
        });
    }
}