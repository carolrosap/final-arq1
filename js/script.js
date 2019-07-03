specialChar = ["0", "00"];
//vetores de caracteres das operaçoes
operationChar = ['.', "*", "-", "+", "=", "/", "DEL"];
newChar = ['A', 'O', '^', '√', 'fib'];
logicalChar = ['A', 'O'];

function equal(vet1, vet2) {
    if (vet1.length != vet1.length) {
        return false;
    } else {
        for (i = 0; i < vet1.length; i++) {
            if (vet1[i] != vet2[i]) {
                return false;
            }
        }
    }
    return true;
}

function isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num) && !isNaN(num);
}

function fibonacci(num) {
    if (num < 2) {
        return num;
    } else {
        return parseInt(fibonacci(num - 1) + fibonacci(num - 2));
    }

}

function fatorial(num) {
    if (num < 1) {
        return 1;
    } else {
        return parseInt(num * fatorial(num - 1));
    }
}

function rem_endspaces(currentValue) {
    last_ind = currentValue.length - 1;
    lastDigit = currentValue.substring(last_ind);
    lastDigit = currentValue.substring(last_ind);
    if (lastDigit === " ") {
        currentValue = currentValue.slice(0, -1);
        return rem_endspaces(currentValue);
    } else {
        return currentValue;
    }

}
$(document).ready(function() {
    var opScreen = $("#display");
    var resScreen = $("#results p");
    var resAssembly = $("#assembly");


    function notacao_polonesa(expressao) {
        var result = [];
        expressao = expressao.split(" ");
        n_regs = 0;
        n_ops = 0;
        t9 = false;
        c3 = 0;
        data = ".data\nresult: .word 0x0\n";
        txt = ".text \n main: \n";
        li = "la $a1, result\n";
        finaliza = "sw $t9,0($a1)\nla $a0, 0($t9)\nli $v0, 1\nsyscall\n";
        calculo = "";
        fa = n3 = false;


        for (var i = 0; i < expressao.length; i++) {
            exp = expressao[i];
            //console.log(expressao);
            if (isNumeric(exp)) {
                result.push(exp);
                li += "li $s" + n_regs + "," + exp + "\n";
                n_regs++;
                c3++;
            } else {
                console.log(c3);
                if (c3 == 3) {
                    n3 = true;
                }
                var a = parseInt(result.pop());
                if (exp != "f" && exp !== "F" && exp !== "s" && exp !== "S") {
                    var b = parseInt(result.pop());
                    op = tipo_operacao(exp);
                    if (n_ops >= 1 && !isNumeric(expressao[i - 2])) {
                        t9 = true;
                    }
                    if (i < (expressao.length - 3)) {
                        if (!t9) {
                            calculo = calculo + op + " $a" + n_ops + ",$s" + (n_regs - 2) + ",$s" + (n_regs - 1) + "\n";
                            //console.log("aqui");
                            //console.log(calculo);
                            //console.log(n_regs);
                        } else {
                            calculo += op + " $t9,$a" + (n_ops - 1) + ",$s" + (n_regs - 1) + "\n";
                            fa = true;
                        }

                    } else if ((i > (expressao.length - 3)) && expressao.length > 3) {
                        calculo += op + " $t9,$t9" + ",$s" + (n_regs - 1) + "\n";
                    } else if ((i > (expressao.length - 3)) && expressao.length <= 3) {
                        calculo += op + " $t9,$s0" + ",$s1\n";
                    } else {
                        u = 0;
                        while (u < n_ops) {
                            if (n3) {

                                if (t9) {
                                    calculo += op + " $t9,$t9" + ",$s0 \n";
                                    u++;
                                } else if (!t9 && u < 1) {
                                    calculo += op + " $t9,$s0" + ",$a0\n";
                                    u += 1;
                                    t9 = true;
                                }
                            } else {
                                if (t9) {
                                    if (fa) {
                                        calculo += op + " $t9,$t9" + ",$a" + (u + 1) + "\n";
                                        u += 2;
                                    } else {
                                        calculo += op + " $t9,$t9" + ",$a" + u + "\n";
                                        u++;
                                    }

                                } else if (!t9 && u <= 1) {
                                    calculo += op + " $t9,$a0" + ",$a1\n";
                                    u += 2;
                                    t9 = true;
                                }
                            }

                        }

                    }
                    n_ops++;
                    c3 = 0;
                }
                if (exp === "+") {
                    result.push(a + b);
                } else if (exp === "-") {
                    result.push(b - a);
                } else if (exp === "*" || exp === "x" || exp === "X") {
                    result.push(a * b);
                } else if (exp === "/") {
                    result.push(b / a);
                } else if (exp === "^" || exp === "p" || exp === "P") {
                    result.push(Math.pow(b, a));
                } else if (exp === "s" || exp === "S") {
                    result.push(Math.sqrt(a));
                } else if (exp === "f") {
                    result.push(fibonacci(a));
                } else if (exp === "F") {
                    result.push(fatorial(a));
                }
            }
            //console.log(result);
        }
        if (result.length > 1) {
            console.log("erro notacao");
            resScreen.text("ERRO");
        } else {
            resScreen.text(result.pop());
            //assembly_notacao(expressao);
            total = data + txt + li + calculo + finaliza;
            resAssembly.val(total);
            console.log(result.pop());
        }
    }

    function tipo_operacao(simbolo) {
        switch (simbolo.toString()) {
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
            case 'x':
                op = 'mul';
                break;
            case 'X':
                op = 'mul';
                break;
            case 'A':
                op = 'and';
                break;
            case 'O':
                op = 'or';
                break;
            default:
                op = ""
                console.log("error");
        }
        return op;
    }

    function ordena(simbol, a_ops, tipo = '') {
        //console.log(a_ops);
        pos = a_ops['pos'];
        op = a_ops['op'];
        num = a_ops['num'];
        c = a_ops['cont'];
        ordenado = new Array();
        posicao = ordenado['pos'] = new Array();
        operacao = ordenado['op'] = new Array();
        cont = ordenado['cont'] = new Array();
        n = new Array();
        for (j = 0; j < simbol.length; j++) {
            i = 0;
            if (op.includes(simbol[j])) {
                while (i < op.length) {
                    if (op[i] == simbol[j]) {
                        posicao.push(pos[i]);
                        operacao.push(op[i]);
                        cont.push(c[i]);
                        if (tipo == 2) {
                            n.push(num[i]);
                        }
                    }
                    i++;
                }
            }
        }
        if (tipo == 2) {
            ordenado['num'] = n;
        } else {
            ordenado['num'] = a_ops['num'];
        }
        console.log(ordenado);
        return ordenado;
    }

    function ordem_mat(a_ops, tipo) {
        ordenado = new Array();
        if (tipo == 1) {
            ordenado = ordena(["*", "/", "+", "-"], a_ops);
        } else if (tipo == 2) {
            ordenado = ordena(["^", "√", "A", "O", "fib"], a_ops, 2);
        }
        return ordenado;
    }

    function create_assembly(currentValue, op) {
        //console.log(currentValue)
        //op = operacoes simples e lógicas
        //op = 2 caracteres complexos(new)
        //calculo em assembly
        data = ".data\nresult: .word 0x0\n";
        txt = ".text \n main: \nla $t8, result\n";
        syscall = "";
        lw = "";
        calculo = "";
        finaliza = "sw $t9,0($t8)\nla $a0,0($t9)\nli $v0,1 \nsyscall";
        //ativar textarea
        if (op == 1) {
            logical = false;
            n_regs = 1;
            n_ops = 0
            a_ops = new Array();
            posicao = a_ops['pos'] = new Array();
            operacao = a_ops['op'] = new Array();
            numero = a_ops['num'] = new Array();
            cont = a_ops['cont'] = new Array();
            num = currentValue;
            //contar operacoes e registradores
            for (i = 0; i < currentValue.length; i++) {
                for (j = 0; j < operationChar.length; j++) {
                    if (currentValue[i] === operationChar[j]) {
                        cont.push(n_ops);
                        n_regs++;
                        n_ops++;
                        operacao.push(operationChar[j]);
                        num = num.replace(operationChar[j], "#");
                    }

                }
                for (j = 0; j < logicalChar.length; j++) {
                    if (currentValue[i] === logicalChar[j]) {
                        cont.push(n_ops);
                        n_regs++;
                        n_ops++;
                        operacao.push(logicalChar[j]);
                        num = num.replace(logicalChar[j], "#");
                        logical = true;
                    }

                }
                posicao.push(i);
            }
            num = num.split("#");
            for (i = 0; i < num.length; i++) {
                numero.push(num[i]);
            }
            if (!logical) {
                a_ops = ordem_mat(a_ops, 1);
                //repetido
                posicao = a_ops['pos'];
                operacao = a_ops['op'];
                numero = a_ops['num'];
                cont = a_ops['cont'];
                pos_ord = posicao.slice().sort();
            } else {
                pos_ord = posicao.slice();
            }
            console.log(logical);
            console.log(a_ops);
            //monta registradores
            for (i = 0; i < n_regs; i++) {
                //montar data
                data = data + "n" + i + ": .word 0x0\n";
                //montar txt
                txt = txt + "la $t" + i + ", n" + i + "\n";
                //montar syscall
                syscall = syscall + "li $v0, 5\nsyscall\nsw	$v0, 0($t" + i + ")\n";
                //montar lw
                lw = lw + "lw  $s" + i + ", 0($t" + i + ")\n";
            }
            //montar calculo
            for (j = 0; j < n_ops; j++) {
                op = tipo_operacao(operacao[j]);
                if (j == 0) {
                    calculo = calculo + op + " $t9, $s" + cont[j] + ", $s" + (cont[j] + 1) + "\n";
                } else {
                    if (equal(posicao, pos_ord)) {
                        calculo = calculo + op + " $t9, $t9, $s" + (cont[j] + 1) + "\n";
                    } else {
                        calculo = calculo + op + " $t9, $t9, $s" + (cont[j]) + "\n";
                    }

                }
            }

        } else if (op == 2) {

        }
        total = data + txt + syscall + lw + calculo + finaliza;
        resAssembly.val(total);

    }

    function calc(currentValue) {
        noNew = true;
        mist = false;
        n_regs = 1;
        n_ops = 0
        a_ops = new Array();
        posicao = a_ops['pos'] = new Array();
        operacao = a_ops['op'] = new Array();
        cont = a_ops['cont'] = new Array();
        n = new Array();
        if (currentValue.includes("AND")) {
            currentValue.replace("AND", "A");
        }
        if (currentValue.includes("OR")) {
            currentValue.replace("OR", "O");
        }

        for (i = 0; i < currentValue.length; i++) {
            for (j = 0; j < newChar.length; j++) {
                //console.log(newChar[j]);
                if (currentValue[i] === newChar[j]) {
                    noNew = false;
                    num = "";
                    cont.push(n_ops);
                    n_ops++;
                    operacao.push(newChar[j]);
                    posicao.push(i);
                    if (currentValue[i] == "√") {
                        u = i + 1;
                        num = currentValue[i];
                        while (u < currentValue.length && (!newChar.includes(currentValue[u]) && !operationChar.includes(currentValue[u]))) {
                            num = num + '' + currentValue[u];
                            u++;
                        }
                    } else {
                        u = i - 1;
                        for (j = 0; j < posicao.length; j++) {
                            if (posicao[j] == i) {
                                if (j > 0) {
                                    u = posicao[j - 1] + 1;
                                } else {
                                    u = 0;
                                }
                                while (u < i && (!newChar.includes(currentValue[u]) && !operationChar.includes(currentValue[u]))) {
                                    num = num + '' + currentValue[u];
                                    u++;
                                }
                            }

                        }
                        num = num + currentValue[i];
                        u = i + 1;
                        while (u < currentValue.length && (!newChar.includes(currentValue[u]) && !operationChar.includes(currentValue[u]))) {
                            num = num + '' + currentValue[u];
                            u++;
                        }
                    }
                    n.push(num);

                }
            }

        }
        console.log(noNew);
        a_ops['num'] = n;
        if (noNew) {
            resScreen.text(eval(currentValue));
            create_assembly(currentValue, 1);
        } else {
            a_ops = ordem_mat(a_ops, 2);
            //repetido
            posicao = a_ops['pos'];
            operacao = a_ops['op'];
            numero = a_ops['num'];
            for (i = 0; i < currentValue.length; i++) {
                for (j = 0; j < n_ops; j++) {
                    console.log(n_ops);
                    pos = posicao[j];
                    if (operacao[j] == currentValue[i]) {
                        if (operacao[j] == "^") {
                            n = numero[j].split("^");
                            result = Math.pow(n[0], n[1]);
                            res = currentValue.replace(numero[j], result);
                        } else if (operacao[j] == "√") {
                            n = numero[j].replace("√", "");
                            result = Math.sqrt(n);
                            //volta = true;
                            if (!isNaN(currentValue[pos - 1])) {
                                res = currentValue.replace(numero[j], "*" + result);
                            } else {
                                res = currentValue.replace(numero[j], result);
                            }
                        } else if (operacao[j] == "A") {
                            n = numero[j].split("AND");
                            if (n[0] == n[1]) {
                                result = n[0];
                            } else {
                                result = 0;
                            }
                            res = currentValue.replace(numero[j], result);
                            create_assembly(numero[j].replace("AND", "A"), 1);

                        } else if (operacao[j] == "O") {
                            n = numero[j].split("OR");
                            if (n[0] == n[1]) {
                                result = n[0];
                            } else {
                                result = parseInt(n[0]) + parseInt(n[1]);
                            }
                            res = currentValue.replace(numero[j], result);
                            create_assembly(numero[j].replace("OR", "O"), 1);

                        } else {
                            res = "";
                            console.log("erro calculo");
                        }

                    }
                }

            }
            if (isNaN(res)) {
                calc(res)
            } else {
                resScreen.text(eval(res));
            }

        }
    }
    $("#numbers .button").click(function() {
        keyVal = $(this).children("p").text();
        currentValue = opScreen.val();
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
                if ($('#i_np').val() == 0) {
                    calc(currentValue);
                } else {
                    currentValue = rem_endspaces(currentValue);
                    notacao_polonesa(currentValue);
                }

            }

        }
    });

    $("#operators .button").click(function() {
        currentValue = opScreen.val();
        keyVal = $(this).children("p").text();
        if (keyVal === "=") {
            console.log(currentValue);
            if ($('#i_np').val() == 0) {
                calc(currentValue);
            } else {
                currentValue = rem_endspaces(currentValue);
                notacao_polonesa(currentValue);
            }

        } else if (keyVal === "DEL") {
            resScreen.text("0");
            opScreen.val("");
            resAssembly.val("");
        } else if (keyVal === "NP") {
            i_np = $('#i_np').val();
            if (i_np == 0) {
                i_np = $('#i_np').val(1);
                $("#np").addClass("brown");
            } else {
                i_np = $('#i_np').val(0);
                $("#np").removeClass("brown");
            }
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
})