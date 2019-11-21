// Code for gas form

$(document).ready(function(){


    // Function to trigger nightsaver section of electricity/combined form
    (function () {
        var nsSelect = $('#ns-select');
        nightSaverSelect();
        nsSelect.change(function(){
            nightSaverSelect();
        });
    }());

    // Function to trigger type tariff section of combined form
    (function () {
        var tarTypeSelect = $('#tar-type-select');
        if (tarTypeSelect.find(':selected').val() === '1') {
            changeType();
        }
        tarTypeSelect.change(function() {
            changeType();
        });
    }());

    elecGasListen();


    if ($('#gas-supplier-radio').find('input[type=radio]').is(':checked')) {
        AjaxEnergy('gas');
    }
    if ($('#elec-supplier-radio').find('input[type=radio]').is(':checked')) {
        AjaxEnergy('elec');
    }
    if ($('#gas-usage-radio').find('input[type=radio]').is(':checked')){
        FillUsage('gas');
    }
    if ($('#elec-usage-radio').find('input[type=radio]').is(':checked')){
        FillUsage('elec');
    }

    $('#gas-pay-select').change(function() {
        AjaxEnergy('gas');
    });
    $('#gas-online-select').change(function() {
        AjaxEnergy('gas');
    });
    $('#elec-pay-select').change(function() {
        AjaxEnergy('elec');
    });
    $('#elec-online-select').change(function() {
        AjaxEnergy('elec');
    });
    $('#gas-usage-radio input[type=radio]').click(function(){
        FillUsage('gas');
    });
    $('#elec-usage-radio input[type=radio]').click(function(){
        FillUsage('elec');
    });
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
});

// Function to async get gas form fields
function AjaxEnergy(formName){
    var supplier = $('#' + formName + '-supplier-radio input[type=radio]:checked').val();
    var payment = $('#' + formName + '-pay-select option:selected').val();
    var paperless = $('#' + formName + '-online-select option:selected').val();
    $.ajax({
    url : '/dataquery/',
    type : 'GET',
    data : {
        'form_name': formName,
        'supplier': supplier,
        'payment': payment,
        'paperless': paperless,
    },
    success : function(response){
        $('#' + formName + '-tar-select').empty();
        var toAppend = '';
        if (response.length === 0) {
            toAppend +='<option>No tariff found. Please check your details.</option>'
        }
        else {
            $.each(response,function(i,o){
            toAppend += '<option value='+o.tariff_id+'>'+o.tariff_name+'</option>'
         })}
        $('#' + formName + '-tar-select').append(toAppend)
    }});
}

function FillUsage(fuel){
    el = $(('#' + fuel + '-usage-el'));
    el.empty();
    var usage = $('#'+fuel+'-usage-radio input[type=radio]:checked').val();
    var toAppend = '';
    if (usage==='iku'){
        var input_name = "volume_"+fuel;
        toAppend += '<label hidden>Usage per year</label><div class="row mx-0"><span class="mt-2">I use </span><input type="number" name=';
        toAppend += input_name;
        toAppend += ' min="1" max="100000" class="form-control mx-2 col-md-2"><span class="mt-2">kWH a year</span></div>'
    }
    else if (usage==='iks'){
        var input_name1 = "current_spending_"+fuel;
        var input_name2 = "current_period_"+fuel;
        toAppend += '<div class="row mx-0"><span class="mt-2">I spend €</span><input type="number" step="0.01" name=';
        toAppend += input_name1;
        toAppend += ' class="form-control mr-2 col-md-2">';
        toAppend += '<select name=';
        toAppend += input_name2;
        toAppend += ' class="form-control col-md-2"><option value="peryear">per year</option><option value="permonth">per month</option></select></div>'
    }
    else {
        var input_name = "current_household_"+fuel;
        toAppend += '<div class="row mx-0"><span class="mt-2">Estimate my usage based on a</span>';
        toAppend += '<select name=';
        toAppend += input_name;
        toAppend += ' class="form-control col-md-2 mx-2"><option value="1">1 bed</option><option value="2">2 bed</option><option value="3+">3+ bed</option></select>';
        toAppend += '<span class="mt-2">home</span></div>'
    }
    el.append(toAppend);
}

function changeType(){
    el = $('#fuel-type');
    var type = $('#tar-type-select').find(':selected').val();
    $.ajax({
        type: 'GET',
        url: '/dataquery-fuel/',
        data: {
            'type': type,
        },
        success: function(data) {
                el.fadeOut(250, function(){
                el.empty().html(data).fadeIn();
                combiListen();
                elecGasListen();
                });
        }
        })
    }

function combiListen(){
    var combi_supplier = $('#combined-supplier-radio');

    if (combi_supplier.find('input[type=radio]').is(':checked')) {
        AjaxEnergy('combined');
    }
    combi_supplier.find('input[type=radio]').click(function(){
        AjaxEnergy('combined');
    });
    $('#combined-online-select').change(function() {
        AjaxEnergy('combined');
    });
    $('#combined-pay-select').change(function() {
        AjaxEnergy('combined');
    });
    var nsSelect = $('#ns-select');
    nightSaverSelect();
    nsSelect.change(function(){
        nightSaverSelect();
    });
}

function elecGasListen(){
    $('#gas-supplier-radio input[type=radio]').click(function(){
        AjaxEnergy('gas');
    });
    $('#elec-supplier-radio input[type=radio]').click(function(){
        AjaxEnergy('elec');
    });
}

function nightSaverSelect(){
    var nsSelect = $('#ns-select');
    $('#nightsaver').empty();
    if (nsSelect.find(':selected').val() === '1') {
        var toAppend = '';
        toAppend += '<p><label class="form-header">What percentage of your usage is during NightSaver hours?</label>'
        toAppend += '<input type="number" name="nightsaver_percentage" class="form-control pt-3 col-md-2 col-sm-6"></p>';
        $('#nightsaver').append(toAppend);
    }
}
