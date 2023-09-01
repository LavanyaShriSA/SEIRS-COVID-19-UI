
var lower_limit = {
    "transmission_rate" : 0,
    "birth_rate" : 0,      // Rate of new borns infected with HIV
    "death_rate" : 0,    // Fraction of new borns infected with HIV who dies immediately after birth
    "vaccinated" : 0,          // Rate of movement from Aids to Treated class
    "not_vaccinated" : 0,      // Sexual contact rate in Infected class
    "sigma_sv" : 0,      // Sexual contact rate in Treated class
    "sigma_av" : 0,     // Fraction of (δ) joining Pre-Aids class
    "sigma_snv" : 0,     // Fraction of (δ) joining Treated class
    "sigma_anv" : 0,          // Rate of movement from Treated class to Aids class
    "alpha_s" : 0,      // Rate of movement from Pre-Aids class
    "alpha_as" : 0,         // Average number of sexual partners per unit time in Infected class
    "gamma_s" : 0,         // Average number of sexual partners per unit time in Treated class
    "gamma_as" : 0,          // Fraction of (γ) joining Treated class
    "omega" : 0,         // Birth rate
    "max_time" : 1,
}

var upper_limit = {
    "transmission_rate" : 1,
    "birth_rate" : 1,
    "death_rate" : 1,
    "vaccinated" : 1,
    "not_vaccinated" : 1,
    "sigma_sv" : 1,
    "sigma_av" : 1,
    "sigma_snv" : 1,
    "sigma_anv" : 1,
    "alpha_s" : 1 ,
    "alpha_as" : 1,
    "gamma_s" : 1,
    "gamma_as" : 1,
    "omega" : 1,
    "max_time" : 1000000
}



function updateInput(max_length) {
    validate();
    var option = document.getElementById("varying_parameter");

    if(option.value == "attractor_plot") {
        for(var i=1; i <= max_length; i++) {
            document.getElementById("add-input-" + i).style.display = "inline";
            if(i%2==1)
                document.getElementById("add-input-" + i).classList.add("border-attractor-blue");
            else
                document.getElementById("add-input-" + i).classList.add("border-attractor-green");
        }
        document.getElementById("susceptible").classList.add("border-attractor-red");
        document.getElementById("exposed-vaccinated").classList.add("border-attractor-red");
        document.getElementById("exposed-not-vaccinated").classList.add("border-attractor-red");
        document.getElementById("infected-symptomatic").classList.add("border-attractor-red");
        document.getElementById("infected-asymptomatic").classList.add("border-attractor-red");
        document.getElementById("recovered").classList.add("border-attractor-red");

        document.getElementById("options-input").style.display = "none";
        document.getElementById("max_time").value = "10000";
    }

    else if(option.value == "no_variation") {
        for(var i=1; i <= max_length; i++) {
            document.getElementById("add-input-" + i).style.display = "none";
        }
        document.getElementById("susceptible").classList.remove("border-attractor-red");
        document.getElementById("exposed-vaccinated").classList.remove("border-attractor-red");
        document.getElementById("exposed-not-vaccinated").classList.remove("border-attractor-red");
        document.getElementById("infected-symptomatic").classList.remove("border-attractor-red");
        document.getElementById("infected-asymptomatic").classList.remove("border-attractor-red");
        document.getElementById("recovered").classList.remove("border-attractor-red");
        
        document.getElementById("options-input").style.display = "none";
        document.getElementById("max_time").value = "500";
    }

    else{
        for(var i=1; i <= max_length; i++) {
            document.getElementById("add-input-" + i).style.display = "none";
        }
        document.getElementById("susceptible").classList.remove("border-attractor-red");
        document.getElementById("exposed-vaccinated").classList.remove("border-attractor-red");
        document.getElementById("exposed-not-vaccinated").classList.remove("border-attractor-red");
        document.getElementById("infected-symptomatic").classList.remove("border-attractor-red");
        document.getElementById("infected-asymptomatic").classList.remove("border-attractor-red");
        document.getElementById("recovered").classList.remove("border-attractor-red");

        document.getElementById("options-input").style.display = "inline";
        document.getElementById("max_time").value = "500";
    }
}

function validateParameter() {

    document.getElementById("option1-message").classList.add("hide");
    document.getElementById("option1").classList.remove("text-red");

    document.getElementById("option2-message").classList.add("hide");
    document.getElementById("option2").classList.remove("text-red");

    document.getElementById("option3-message").classList.add("hide");
    document.getElementById("option3").classList.remove("text-red");

    document.getElementById("generate-button").disabled = false;

    option1 = parseFloat(document.getElementById("option1").value);
    option2 = parseFloat(document.getElementById("option2").value);
    option3 = parseFloat(document.getElementById("option3").value);

    var parameter = document.getElementById("varying_parameter").value;

    if(parameter != "attractor_plot" && parameter != "no_variation") {
        if(option1 < lower_limit[parameter] || option1 > upper_limit[parameter]) {
            var option1_element = document.getElementById("option1-message");
            option1_element.innerHTML = "Parameter value should be between " + String(lower_limit[parameter]) + " and " + String(upper_limit[parameter]);
            option1_element.classList.remove("hide");
            document.getElementById("option1").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }

        if(option2 < lower_limit[parameter] || option2 > upper_limit[parameter]) {
            var option2_element = document.getElementById("option2-message");
            option2_element.innerHTML = "Parameter value should be between " + String(lower_limit[parameter]) + " and " + String(upper_limit[parameter]);
            option2_element.classList.remove("hide");
            document.getElementById("option2").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }

        if(option3 < lower_limit[parameter] || option3 > upper_limit[parameter]) {
            var option3_element = document.getElementById("option3-message");
            option3_element.innerHTML = "Parameter value should be between " + String(lower_limit[parameter]) + " and " + String(upper_limit[parameter]);
            option3_element.classList.remove("hide");
            document.getElementById("option3").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }
    }
}

function validate() {

    document.getElementById("total-message").classList.add("hide");
    document.getElementById("susceptible-message").classList.add("hide");
    document.getElementById("exposed-vaccinated-message").classList.add("hide");
    document.getElementById("exposed-not-vaccinated-message").classList.add("hide");
    document.getElementById("infected-symptomatic-message").classList.add("hide");
    document.getElementById("infected-asymptomatic-message").classList.add("hide");
    document.getElementById("recovered-message").classList.add("hide");

    document.getElementById("susceptible").classList.remove("text-red");
    document.getElementById("exposed-vaccinated").classList.remove("text-red");
    document.getElementById("exposed-not-vaccinated").classList.remove("text-red");
    document.getElementById("infected-symptomatic").classList.remove("text-red");
    document.getElementById("infected-asymptomatic").classList.remove("text-red");
    document.getElementById("recovered").classList.remove("text-red");

    document.getElementById("generate-button").disabled = false;


    initS = parseFloat(document.getElementById("susceptible").value);
    if(initS > 1 || initS < 0) {
        document.getElementById("susceptible-message").classList.remove("hide");
        document.getElementById("susceptible").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initEv = parseFloat(document.getElementById("exposed-vaccinated").value);
    if(initEv > 1 || initEv < 0) {
        document.getElementById("exposed-vaccinated-message").classList.remove("hide");
        document.getElementById("exposed-vaccinated").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initEnv = parseFloat(document.getElementById("exposed-not-vaccinated").value);
    if(initEnv > 1 || initEnv < 0) {
        document.getElementById("exposed-not-vaccinated-message").classList.remove("hide");
        document.getElementById("exposed-not-vaccinated").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initIs = parseFloat(document.getElementById("infected-symptomatic").value);
    if(initIs > 1 || initIs < 0) {
        document.getElementById("infected-symptomatic-message").classList.remove("hide");
        document.getElementById("infected-symptomatic").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initIas = parseFloat(document.getElementById("infected-asymptomatic").value);
    if(initIas > 1 || initIas < 0) {
        document.getElementById("infected-asymptomatic-message").classList.remove("hide");
        document.getElementById("infected-asymptomatic").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }

    initR = parseFloat(document.getElementById("recovered").value);
    if(initIas > 1 || initIas < 0) {
        document.getElementById("recovered-message").classList.remove("hide");
        document.getElementById("recovered").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    var total_pop = initS + initEv + initEnv + initIs + initIas;
    total_pop = total_pop.toFixed(5);
    
    if (parseFloat(total_pop) != 1) {
        document.getElementById("total-message").classList.remove("hide");
        document.getElementById("susceptible").classList.add("text-red");
        document.getElementById("exposed-vaccinated").classList.add("text-red");
        document.getElementById("exposed-not-vaccinated").classList.add("text-red");
        document.getElementById("infected-symptomatic").classList.add("text-red");
        document.getElementById("infected-asymptomatic").classList.add("text-red");
        document.getElementById("recovered").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }

    var option = document.getElementById("varying_parameter");
    var value;

    if(option.value == "attractor_plot") {

        allAddnInputs = [];
        for(var i=1; i <= 12; i++) {
            value = parseFloat(document.getElementById("add-input-" + i).value);
            allAddnInputs.push(value);
            document.getElementById("add-input-" + i).classList.remove("text-red");

            if(value > 1 || value < 0) {
                if(i==1 || i==2){
                    document.getElementById("susceptible-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==3 || i==4){
                    document.getElementById("exposed-vaccinated-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==5 || i==6){
                    document.getElementById("exposed-not-vaccinated-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==7 || i==8){
                    document.getElementById("infected-symptomatic-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==9 || i==10){
                    document.getElementById("infected-asymptomatic-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==11 || i==12){
                    document.getElementById("recovered-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }
            }
        }

        if (allAddnInputs[0] + allAddnInputs[2] + allAddnInputs[4] + allAddnInputs[6] + allAddnInputs[8] + allAddnInputs[10] != 1) {
            document.getElementById("total-message").classList.remove("hide");
            document.getElementById("add-input-" + "1").classList.add("text-red");
            document.getElementById("add-input-" + "3").classList.add("text-red");
            document.getElementById("add-input-" + "5").classList.add("text-red");
            document.getElementById("add-input-" + "7").classList.add("text-red");
            document.getElementById("add-input-" + "9").classList.add("text-red");
            document.getElementById("add-input-" + "11").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }

        if (allAddnInputs[1] + allAddnInputs[3] + allAddnInputs[5] + allAddnInputs[7] + allAddnInputs[9] + allAddnInputs[11] != 1) {
            document.getElementById("total-message").classList.remove("hide");
            document.getElementById("add-input-" + "2").classList.add("text-red");
            document.getElementById("add-input-" + "4").classList.add("text-red");
            document.getElementById("add-input-" + "6").classList.add("text-red");
            document.getElementById("add-input-" + "8").classList.add("text-red");
            document.getElementById("add-input-" + "10").classList.add("text-red");
            document.getElementById("add-input-" + "12").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }
    }
}


var teamMembers = false;
function displayTeam() {

    if(!teamMembers) {
        document.getElementById("team").classList.remove("hide");
        document.getElementById("team-names").classList.add("team");
        teamMembers = true;
    }
    else {
        document.getElementById("team").classList.add("hide");
        document.getElementById("team-names").classList.remove("team");
        teamMembers = false;
    }
}
