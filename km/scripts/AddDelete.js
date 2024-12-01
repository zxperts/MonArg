/* The above code is creating a table with the following columns: 
Name, Department, Phone, and Actions.
The Actions column has two buttons: Edit and Delete. 
The Edit button allows the user to edit the row
and the Delete button allows the user to delete the row. 
The user can also add a new row by clicking
the Add New button. */
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    // Append table with add row form on add new button click
    $(".add-new").click(function(){
        $(this).attr("disabled", "disabled");
        var index = $("table tbody tr:last-child").index();
        var row = '<tr>' +
        '<td><input type="text" class="form-control" name="name" id="name"></td>' +
        '<td><input type="text" class="form-control" name="department" id="department"></td>' +
        '<td><input type="text" class="form-control" name="phone" id="phone"></td>' +
        '<td>' + actions + '</td>' +
        '</tr>';
        $("table").append(row);		
        $("table tbody tr").eq(index + 1).find(".add, .editOld").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
    // Add row on add button click
    $(document).on("click", ".add", function(){
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();
        if(!empty){
            input.each(function(){
                $(this).parent("td").html($(this).val());
            });			
            $(this).parents("tr").find(".add, .editOld").toggle();
            $(".add-new").removeAttr("disabled");
        }
        updateCookie();		
    });
    // Edit row on edit button click
    $(document).on("click", ".editOld", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        });		
        $(this).parents("tr").find(".add, .editOld").toggle();
        $(".add-new").attr("disabled", "disabled");
        // updateCookie();	
    });
    
    
});
