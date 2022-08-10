ACTION_UPLOAD_URL_DEV = "http://datalogi.brogard:5050/upload";
ACTION_UPLOAD_URL_PRD = "http://datalogi.brogard:5050/upload";

ACTION_IMAGE_FILES_URL_DEV = "http://datalogi.brogard:5050/image/files";
ACTION_IMAGE_FILES_URL_PRD = "http://datalogi.brogard:5050/image/files";


$(document).ready(function() {
    
    //get image files
    $.get(ACTION_IMAGE_FILES_URL_DEV, function(data, status) {
        var img;
        console.log(status);
        
        // content
        img = "";
        data.content.forEach(function(f) {
            img += `<td><img src="${f}"></td>`;
        });
        
        content = `<tr>${img}</tr>`;
        
        // style
        img = "";
        data.style.forEach(function(f) {
            img += `<td><img src="${f}"></td>`;
        });
        
        style = `<tr>${img}</tr>`;
    
        // render
        img = "";
        data.render.forEach(function(f) {
            img += `<td><img src="${f}"></td>`;
        });
        
        render = `<tr>${img}</tr>`;
    
        console.log(content);
        console.log(style);
        console.log(render);
        
        $("tbody").append(content);
        $("tbody").append(style);
        $("tbody").append(render);

    });
    
    
    
    // upload files
    $("#artem--upload-modal").click(function() {
        $.FileDialog({
            title: "Select image(s) to upload",
            drag_message: "Drop image file(s) your here",
            dropheight: 250,
            cancel_button: "Cancel",
            multiple: true
        }).on("files.bs.filedialog", function(ev) {
            var files = ev.files;

            files.forEach(function(f) {
                var formData = new FormData();
                formData.append('file', f);
                
                // make AJAX call to Flask endpoint POST to upload image
                $.ajax({
                    type: "POST",
                    enctype: "multipart/form-data",
                    url: ACTION_UPLOAD_URL_DEV,
                    data: formData,
                    processData: false,
                    contentType: false,
                    cache: false,
                    timeout: 600000,
                    success: function(data) {
                        console.log("data: "+data);
                        if (data.status === 500) {
                            console.log("Message : ", data.message);
                        } else {
                            console.log("ajax success");
                        }
                    },
                    error: function(e) {
                        console.log("ajax ERROR : ", e);
                    }
                });
            });
            
        }).on("cancel.bs.filedialog", function() {
            console.log("modal closed/cancel");
        });
    });


});