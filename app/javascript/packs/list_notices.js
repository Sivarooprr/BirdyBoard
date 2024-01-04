require('./jquery.dataTables.min')
require('./dataTables.bootstrap4.min')
$(document).ready(function() {
    //update the html content before reload
    $('#uTableCard').html('<div class="table-responsive"><table id="notice_table" class="table table-bordered table-sm" width="100%" cellspacing="0"></table></div>');
    var nListingTable = $('#notice_table').DataTable({
        ajax: 'api/get_notice_listing',
        columns: [
            {title: 'Content', data: 'content'},
            {title: 'Published', data: 'published'},
            {title: 'Published At', data: 'published_at'},
            {title: 'Public', data: 'is_public'},
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
            {
                targets: [0],
                mRender: function ( data, type, full ) {
                    return $("<div/>").html(data).text();
                }
            },
            { searchable: false, targets: [1,2,3,4,5,-1] },
            {
                targets: [0],
                createdCell: function (td, cellData, rowData, row, col) {
                    if (cellData) {
                        $(td).addClass("notice_content");
                    }
                }
            },
            {
                targets: [2,4,5],
                createdCell: function (td, cellData, rowData, row, col) {
                    if (cellData) {
                        $(td).addClass("time_string");
                    }
                }
            },
            {
                targets: [1,3],
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
                    $(td).css('text-align','center');
                    var htmlC = '<a id="noticeEdit" class="btn btn-sm btn-outline-dark" title="Edit"><i class="fas fa-edit" style="color: green"></i></a>';
                    htmlC += `&nbsp;<button id="noticeDelete" class="btn btn-sm btn-outline-dark" title="Delete" onclick="deleteUser(${rowData.id})"><i class="fas fa-trash" style="color: red"></i></button>`;
                    $(td).html(htmlC);
                    $(td).children('#noticeEdit').attr('id','noticeEdit' + rowData.id);
                    $(td).children('#noticeEdit' + rowData.id).attr("href",`/admin/notice/${rowData.id}`);
                }
            }
        ]
    });
    nListingTable.on('draw', function () {
        $('.time_string').each(function() {
            this.textContent = moment(this.textContent).format('DD-MM-YYYY hh:mm A');
        });
    });
});

window.deleteUser = function(nId) {
    var dec = confirm(`Are you sure to delete the record?`);
    if (dec) {
        $("#notice_table :button").attr("disabled", "true");
        $.ajaxSetup({
            headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
        });
        $.ajax({
            type: "DELETE",
            cache: false,
            url: `api/notice/${nId}`
        }).done(function (result) {
            $('#notice_table').DataTable().ajax.reload();
        }).fail(function (xhr, result, status) {
            alert('GetPermissions ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
            $("#notice_table :button").removeAttr("disabled");
        });
    }
}