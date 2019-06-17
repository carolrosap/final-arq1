specialChar = ["0", "00"];
operationChar = ['.', "DEL", "*", "-", "+", "=", "/"];

$(document).ready(function() {
    var opScreen = $("#display");
    var resScreen = $("#results p");
    var resAssembly = $("#assembly");

    function calc(currentValue) {
        resScreen.text(eval(currentValue));

        //calculo em assembly
        assembly = resAssembly.val();
        data = ".data";

        txt = ".text \n main: \n";

        //ativar textarea
        resAssembly.val(txt);



    }
    $("#numbers .button").click(function() {
        keyVal = $(this).children("p").text(); // Gets the key value
        currentValue = opScreen.val();
        console.log(currentValue);

        if (currentValue === "0") {
            if (!specialChar.includes(keyVal) && !operationChar.includes(keyVal)) {
                opScreen.val(keyVal);
            }
        } else {
            if (currentValue.length <= 10) {
                if (keyVal === "." && currentValue.includes(".")) {
                    opScreen.val(currentValue);
                } else {
                    opScreen.val(currentValue + keyVal);
                }
            }
        }
    });
    opScreen.keyup(function() {
        currentValue = opScreen.val();
        if (currentValue.includes("=")) {
            rep = opScreen.val().replace("=", "");
            opScreen.val(rep);
            calc(rep);
        }
    });

    $("#operators .button").click(function() {
        currentValue = opScreen.val();
        keyVal = $(this).children("p").text();


        if (keyVal === "=") {
            console.log(currentValue);
            calc(currentValue);
            //resScreen.text(eval(currentValue));

        } else if (keyVal === "DEL") {
            resScreen.text("0");
            opScreen.val("0");
        } else {
            if (currentValue.length <= 10) {
                var lastDigit = currentValue.substring(currentValue.length - 1);
                if (!operationChar.includes(lastDigit)) {
                    opScreen.val(currentValue + keyVal);
                } else {
                    opScreen.val(currentValue);
                }
            }
        }
    });
});