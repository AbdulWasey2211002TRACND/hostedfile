var StoreId = "";
var TransactionTypeId = "";
var TransactionReferenceNumber = "";
var TransactionAmount = "";
var CustomerName = "";
var CustomerEmailAddress = "";
var CustomerMobileNumber = "";
var CustomerCNIC = "";

var CardNumber = "";
var CVV = "";
var ExpiryMonth = "";
var ExpiryYear = "";
var RequestHash = "";

var HostedCheckoutKey1 = "SRZEr0QU4NQueJ5O";
var HostedCheckoutKey2 = "3016026885362971";

var EncKey1 = "";
var EncKey2 = "";
var Key1 = "";
var Key2 = "";

$(document).ready(function () {
    
    //$('body').append($('<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>'));
    
    $("#dvSuccess").css("display","none");
    $("#dvFailed").css("display","none");
    
    $("#InitiateTrans").click(function () {
        
        if(EncKey1 == '' || EncKey2 == '') {
            $("#dvSuccess").css("display","none");
            $("#dvFailed").css("display","block");
            $("#failedMsg").text("Transaction could not be initiated. Please try again.");
            //console.log("Transaction could not be initiated. Please try again.");
            return;
        }
        
        CardNumber = $("#CardNumber").val();
        CVV = $("#CVV").val();
        ExpiryMonth = $("#ExpiryMonth").val();
        ExpiryYear = $("#ExpiryYear").val();
        
        CustomerName = $("#CustomerName").val();
        CustomerCNIC = $("#CustomerCNIC").val()
        CustomerEmailAddress = $("#CustomerEmailAddress").val();
        CustomerMobileNumber = $("#CustomerMobileNumber").val();
                
        if(CardNumber.length != 16) {
            $("#errorlbl").text("Invalid Card Number");
            $("#CardNumber").focus();
            $("#CardNumber").val('');
            return;
        }
        else
        {
            $("#errorlbl").text('');
        }
        
        if(CVV.length != 3) {
            $("#errorlbl").text("Invalid CVV");
            $("#CVV").focus();
            $("#CVV").val('');
            return;
        }
        else
        {
            $("#errorlbl").text('');
        }
                
        if (emailIsValid(CustomerEmailAddress)) {
            $("#errorlbl").text('');
        }
        else {
            $("#errorlbl").text("Invalid Email Address");
            $("#CustomerEmailAddress").focus();
            $("#CustomerEmailAddress").val('');
           return;
        }
        
        if (MobileNoIsValid(CustomerMobileNumber)) {
            $("#errorlbl").text('');
        }
        else {
            $("#errorlbl").text("Invalid Mobile Number. Valid Format: +923331234567");
            $("#CustomerMobileNumber").focus();
            $("#CustomerMobileNumber").val('');
           return;
        }

        // Validate CNIC format
        if (!cnicIsValid(CustomerCNIC)) {
            $('#errorlbl').text('Please enter a valid CNIC in the format XXXXXXXXXXXXX (13 digits)');
            $("#CustomerCNIC").focus();
            return;
        }
        else {
            $("#errorlbl").text('');
        }

        $("#InitiateTrans").attr("disabled","disabled");
        
        // CNIC validation with screening service
        $.ajax({
            url: 'https://uatfoodapp.bankalfalah.com/auth/bafl-screening/', // Replace with the actual screening service URL
            type: 'POST',
            data: { cnic: CustomerCNIC, name: CustomerName },
            success: function(response) {
                if (response.status === 'success') {
                    InitiateTransaction();
                } else {
                    $("#dvFailed").css("display","block");
                    $("#failedMsg").text(response.message);
                    $("#TransactionForm").css("display","none")
                    failedCallback();
                }
            },
            error: function() {
                $("#dvFailed").css("display","block");
                $("#failedMsg").text('An error occured.');
                $("#InitiateTrans").removeAttr('disabled', 'disabled');
            }
        });
    });
    
    //ALLOW NUMERIC SPACE ONLY
    $('.allow_numeric').on('keyup', function (evt) {
        var self = $(this);
        //self.val(self.val().replace(/[^\d].+/, ""));
        //if ((evt.which < 48 || evt.which > 57)) {

        if ((evt.which != 9) && (evt.which != 8) && (evt.which != 39) && (evt.which != 107) && (evt.which != 37) && (evt.which < 48 || evt.which > 57) && (evt.which < 96 || evt.which > 105)) {
            evt.preventDefault();
        }
    });

    $('.allow_numeric').on('keydown', function (evt) {
        var self = $(this);
        //self.val(self.val().replace(/[^\d].+/, ""));
        if ((evt.which != 9) && (evt.which != 8) && (evt.which != 39) && (evt.which != 107) && (evt.which != 37) && (evt.which < 48 || evt.which > 57) && (evt.which < 96 || evt.which > 105) ) {
            evt.preventDefault();
        }
    });
    
    //ALLOW ALPHABET SPACE ONLY
    $('.allow_alphabet').on('keyup', function (evt) {
        var self = $(this);
        //self.val(self.val().replace(/[^\d].+/, ""));
        //if ((evt.which < 48 || evt.which > 57)) {

        if ((evt.which != 9) && (evt.which != 8) && (evt.which != 20) && (evt.which != 32) && (evt.which != 37) && (evt.which != 39) && (evt.which < 65 || evt.which > 90)) {
            evt.preventDefault();
        }
    });

    $('.allow_alphabet').on('keydown', function (evt) {
        var self = $(this);
        //self.val(self.val().replace(/[^\d].+/, ""));
        //if ((evt.which < 48 || evt.which > 57)) {

        if ((evt.which != 9) && (evt.which != 8) && (evt.which != 20) && (evt.which != 32) && (evt.which != 37) && (evt.which != 39) && (evt.which < 65 || evt.which > 90)) {
            evt.preventDefault();
        }
    });
});

function cnicIsValid(CustomerCNIC) {
    var filter = /^\d{5}\d{7}\d{1}$/;
    return filter.test(CustomerCNIC)

}

function emailIsValid(email) {

    // var filter = /[A-Za-z0-9]+@[a-z]+\.[a-z]+/;
    // var filter = /[A-Za-z0-9]+@[a-z]+\.[a-z]+/;
    //var filter = /[A-Za-z0-9._]+@[a-z]+\\.[a-z.]{1,6}/;
    var filter = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return filter.test(email);
}



function MobileNoIsValid(mobileNo) {

                            var filter = /^\+[1-9]{1}[0-9]{3,14}$/;
    //var filter = /^\+[1-9]{1}[0-9]{3,14}$/;
                            return filter.test(mobileNo);
            }


function InitializeValues(storid, transtypeid, transrefno, transamount, secrectkey) {
    
    StoreId = storid;
    SecrectKey = secrectkey;
    TransactionTypeId = transtypeid;
    TransactionReferenceNumber = transrefno;
    TransactionAmount = transamount;
    
    if(StoreId == '') {
        $("#dvFailed").css("display","block");
        $("#failedMsg").text("Store Id not provided");
        // console.log("Store Id not provided");
        return;
    }
    
    
    $.ajax({
        type: 'POST',
        url: 'https://merchants.bankalfalah.com/APGHostedCheckout/HostedCheckout/FetchKeys',
        data: { StoreId: StoreId, SecrectKey: SecrectKey },
        success: function (data) {
            
            if(data.success == "true")
            {
                var objK = data.Keys.split("|");
                
                EncKey1 = objK[0];
                EncKey2 = objK[1];
                $("#InitiateTrans").css("display","block");
            }
            else
            {
                $("#dvFailed").css("display","block");
                $("#failedMsg").text(data.ErrorMessage);
                $("#InitiateTrans").css("display","none");
            }
        },
        error: function (error) {
            $("#dvFailed").css("display","block");
            $("#failedMsg").text("An error occurred");
            //alert("An error occurred");
            
        }
    });
}

function InitiateTransaction()
{
    CardNumber = $("#CardNumber").val();
    CVV = $("#CVV").val();
    ExpiryMonth = $("#ExpiryMonth").val();
    ExpiryYear = $("#ExpiryYear").val();
 
    CustomerName = $("#CustomerName").val();
    CustomerEmailAddress = $("#CustomerEmailAddress").val();
    CustomerMobileNumber = $("#CustomerMobileNumber").val();
    
    $("#dvSuccess").css("display","none");		
    $("#dvFailed").css("display","none");
    
    GenerateRequestHash();
    
    var myData = {
        TransRequestHash: RequestHash,
        StoreId: StoreId,
        TransactionTypeId: TransactionTypeId,
        TransactionReferenceNumber : TransactionReferenceNumber,
        TransactionAmount : TransactionAmount,
        CustomerName : CustomerName,
        CustomerEmailAddress : CustomerEmailAddress,
        CustomerMobileNumber : CustomerMobileNumber,
        CardNumber : CardNumber,
        CVV: CVV,
        ExpiryMonth: ExpiryMonth,
        ExpiryYear: ExpiryYear,
        __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()
    }

    $("#TransactionForm").css("display","none");
    $("#dvLoader").css("display","block");

    $.ajax({
        type: 'POST',
        url: 'https://merchants.bankalfalah.com/APGHostedCheckout/HostedCheckout/InitiateHC',
        //url: '@Url.Action("HS","Sandbox")',
        //contentType: "application/json; charset=utf-8",
        contentType: "application/x-www-form-urlencoded",
        //jsonpCallback: 'RenderData',
        //jsonp: 'callback',
        //data: JSON.stringify(myData),
        data: myData,
        dataType: "json",
        beforeSend: function () {
            // uiBlock();
        },
        success: function (r) {
            $("#dvLoader").css("display","none");										
            if(r.success == "true")
            {
                if(r.Is3DS == "Y" && r.HTMLUrl.length > 0)
                {
                    $("#dv3DS").load(r.HTMLUrl);
                    //$("#dv3DS").attr('data', r.HTMLUrl);
                    //$("#TransIframe").attr("src", r.HTMLUrl);
                    $("#dv3DSIFrame").css("display","block");	

                }
                else {
                    $("#dvSuccess").css("display","block");
                    $("#successMsg").text(r.SuccessMessage);
                    successCallback();
                }

            }
            else
            {
                $("#dv3DSIFrame").css("display","none");
                $("#dvFailed").css("display","block");
                $("#failedMsg").text(r.ErrorMessage);
                failedCallback();
            }
        },
        error: function (error) {
            $("#dvFailed").css("display","block");
            $("#failedMsg").text("An error occurred");
            failedCallback();
            
        },
        complete: function(data) {
            $("#InitiateTrans").removeAttr('disabled', 'disabled');
        }
    });
}

function GenerateRequestHash() {

    var mapString = '';

    $("#TransactionForm :input").each(function () {
        if ($(this).attr('id') != '') {
            mapString += $(this).attr('id') + '=' + $(this).val() + '&';
        }
    });
    
    var key = CryptoJS.enc.Utf8.parse(HostedCheckoutKey1);
    var iv = CryptoJS.enc.Utf8.parse(HostedCheckoutKey2);
    
    RequestHash = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(mapString.substr(0, mapString.length - 1)), CryptoJS.enc.Utf8.parse(CryptoJS.AES.decrypt(EncKey1, key,
                  {
                      keySize: 128 / 8,
                      iv: iv,
                      mode: CryptoJS.mode.CBC,
                      padding: CryptoJS.pad.Pkcs7
                  }).toString(CryptoJS.enc.Utf8)),
    {
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(CryptoJS.AES.decrypt(EncKey2, key,
                  {
                      keySize: 128 / 8,
                      iv: iv,
                      mode: CryptoJS.mode.CBC,
                      padding: CryptoJS.pad.Pkcs7
                  }).toString(CryptoJS.enc.Utf8)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
    
}

var base64 = "";

// The listener that retrieves the data from the iframe
function iFrameListener(event) {
    if (event.isTrusted) {
        // $("#base64").val(event.data);


        if (event.data != null && event.data != "") {
            base64 = event.data;
            
            var myData = {
                StoreId: StoreId,
                TransactionTypeId: TransactionTypeId,
                TransactionReferenceNumber : TransactionReferenceNumber,
                TransactionAmount : TransactionAmount,
                CustomerName : CustomerName,
                CustomerEmailAddress : CustomerEmailAddress,
                CustomerMobileNumber : CustomerMobileNumber,
                CardNumber : CardNumber,
                CVV: CVV,
                ExpiryMonth: ExpiryMonth,
                ExpiryYear: ExpiryYear,
                MPGSTokenBase64: base64,
                __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()
            }

            $.ajax({
                type: "POST",
                //cache: false,
                url: 'https://merchants.bankalfalah.com/APGHostedCheckout/HostedCheckout/ProcessHC',
                data: myData,
                //data: "{'base64':'" + (event.data) + "', '__RequestVerificationToken': '" + $("[name = '__RequestVerificationToken']").val() + "'}",
                // data: { base64: (event.data), __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()},
                ////contentType: "application/json; charset=utf-8",
               //global: false,
                async: false,
                dataType: "json",
                success: function (r) {
                    event.data = "";
                    $("#dv3DS").css("display","none");
                    
                    if (r.success == "true" && r.SuccessMessage.length > 0) {
                        $("#dvSuccess").css("display","block");
                        $("#successMsg").text(r.SuccessMessage);
                        successCallback();	
                    }
                    else if (r.success == "true")
                    {
                    }
                    else {
                        $("#dvFailed").css("display","block");
                        $("#failedMsg").text(r.ErrorMessage);
                        failedCallback();
                    }
                    //$body.removeClass("loading");
                },
                error: function (err) {
                    $("#dvFailed").css("display","block");
                    $("#failedMsg").text(err);
                    failedCallback();
                }
            });

        }
    }
}

addEventListener('message', iFrameListener, false);