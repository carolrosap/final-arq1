specialChar = ["0", "00"];
//vetores de caracteres das operaçoes
operationChar = ['.', "*", "-", "+", "=", "/", "DEL"];
newChar = ['AND', 'OR', '^', '√', 'fib']

$(document).ready(function() {
    var opScreen = $("#display");
    var resScreen = $("#results p");
    var resAssembly = $("#assembly");

    function ordena(simbol, a_ops) {
        console.log(simbol);
        pos = a_ops['pos'];
        op = a_ops['op'];
        num = a_ops['num'];
        ordenado = new Array();
        posicao = ordenado['pos'] = new Array();
        operacao = ordenado['op'] = new Array();
        numero = ordenado['num'] = new Array();
        for (j = 0; j < simbol.length; j++) {
            //console.log(simbol[j]);
            i = 0;
            if (op.includes(simbol[j])) {
                while (i < op.length) {
                    console.log("aqiu entrea");
                    if (op[i] == simbol[j]) {
                        posicao.push(pos[i]);
                        operacao.push(op[i]);
                        numero.push(num[i]);

                    }
                    i++;
                }
            }
        }
        //console.log(ordenado);
        //console.log(a_ops);
        return ordenado;

    }



    function ordem_mat(a_ops, tipo) {
        //console.log(a_ops);
        ordenado = new Array();
        if (tipo == 1) {
            ordenado = ordena(["*", "/", "+", "-"], a_ops);
        } else if (tipo == 2) {
            ordenado = ordena(["^", "√", "AND", "OR", "fib"], a_ops);
        }
        //console.log(a_ops);
        return ordenado;
    }

    function create_assembly(currentValue, op) {
        //op = 1 caracteres simples
        //op = 2 caracteres complexos(new)
        //op = 3 notação polonesa reversa
        //calculo em assembly
        assembly = resAssembly.val();
        data = ".data\nresult: .word 0x0\n";
        txt = ".text \n main: \nla $t8, result\n";
        syscall = "";
        lw = "";
        calculo = ""
        finaliza = "sw $t9,0($t8)\nla $a0,0($t9)\nli $v0, \nsyscall";
        //ativar textarea
        if (op == 1) {
            n_regs = 1;
            n_ops = 0
            a_ops = new Array();
            posicao = a_ops['pos'] = new Array();
            operacao = a_ops['op'] = new Array();
            numero = a_ops['num'] = new Array();
            num = currentValue;
            //numero.push(num);
            //contar operacoes e registradores
            for (i = 0; i < currentValue.length; i++) {
                for (j = 0; j < operationChar.length; j++) {
                    if (currentValue[i] === operationChar[j]) {
                        n_regs++;
                        n_ops++;
                        posicao.push(i);
                        operacao.push(operationChar[j]);
                        num = num.replace(operationChar[j], "#");
                        //numero.push(num);

                    }
                }

            }
            num = num.split("#");
            for (i = 0; i < num.length; i++) {
                numero.push(num[i]);
            }
            console.log(a_ops);
            a_ops = ordem_mat(a_ops, 1);
            //console.log("ordenado");

            //monta registradores
            for (i = 0; i < n_regs; i++) {
                //montar data
                data = data + "n" + i + ": .word 0x0\n";
                //console.log(data);
                //montar txt
                txt = txt + "la $t" + i + ", n" + i + "\n";
                //montar syscall
                syscall = syscall + "li $v0, 5\nsyscall\nsw	$v0, 0($t" + i + ")\n";
                //montar lw
                lw = lw + "lw  $s" + i + ", 0($t" + i + ")\n";
            }
            //montar calculo
            //for (i = 0; i < currentValue.length; i++) {
            for (j = 0; j < n_ops; j++) {
                switch (operacao[j]) {
                    case '+':
                        op = 'add';
                        break;
                    case '-':
                        op = 'sub';
                        break;
                    case '/':
                        op = 'div';
                        break;
                    case '*':
                        op = 'mul';
                        break;
                    default:
                        op = ""
                        console.log("error");
                }
                //if (i == posicao[j]) {
                if (j == 0) {
                    if (pos[j] > pos[j + 1]) {

                    }
                    calculo = calculo + op + " $t9, $s" + j + ", $s" + (j + 1) + "\n";
                } else {
                    calculo = calculo + op + " $t9, $t9, $s" + (j + 1) + "\n";
                }

                //}
                //console.log(calculo);

            }
            //}

        } else if (op == 2) {

        }
        total = data + txt + syscall + lw + calculo + finaliza;
        resAssembly.val(total);

    }

    function calc(currentValue) {
        sep = currentValue.split("");
        noNew = true;
        mist = false;
        var pos = new Array();
        n_regs = 1;
        n_ops = 0
        a_ops = new Array();
        posicao = a_ops['pos'] = new Array();
        operacao = a_ops['op'] = new Array();
        //console.log("oi");
        for (i = 0; i < currentValue.length; i++) {
            for (j = 0; j < newChar.length; j++) {
                if (currentValue[i] === newChar[j]) {
                    noNew = false;
                    n_ops++;
                    posicao.push(i);
                    operacao.push(newChar[j]);
                    //console.log(a_ops);
                }
            }
        }
        if (noNew) {
            resScreen.text(eval(currentValue));
            create_assembly(currentValue, 1);
        } else {
            for (i = 0; i < currentValue.length; i++) {
                for (j = 0; j < n_ops; j++) {
                    pos = posicao[j];
                    /*if (i == pos) {
                            if (operacao[j] == )



                            //calculo = currentValue;

                                pos = posicao[j];

                            switch (operacao[j]) {
                                case '^':
                                    op = 'sub';
                                    break;
                                case '√':


                                    numero = currentValue[pos + 1];
                                    break;

                                case 'AND':
                                    op = 'div';
                                    break;
                                case 'OR':
                                    op = 'mult';
                                    break;
                                case 'fib':

                                default:
                                    console.log("error");

                            }
                    }*/

                }

            }


            //console.log("entrou");




            /*for (i = 0; i < currentValue.length; i++) {
                if ()
                    j = pos[i];
                if (sep[j] == "^") {
                    //operacao = sep.split("^");
                    total = Math.pow(sep[0], sep[2]);
                    console.log(total);
                }
            }*/


            //create_assembly(currentValue, 2);
        }
        /*if (operationChar.includes(currentValue) && !newChar.includes(currentValue)) {
            resScreen.text(eval(currentValue));
        } else if (newChar.includes(currentValue)) {
            sep = currentValue.split(newChar)
            console.log("aqui")
        }*/
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
    opScreen.keyup(function(event) {
        currentValue = opScreen.val();
        if (currentValue.includes("=")) {
            rep = opScreen.val().replace("=", "");
            opScreen.val(rep);
            if (currentValue.length > 1) {
                calc(rep);
            }
        }
    });
    opScreen.keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            if (currentValue.length > 1) {
                calc(currentValue);
            }

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
            opScreen.val("");
            resAssembly.val("");
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