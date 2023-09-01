
var symbol_dict = {
    "transmission_rate" : "β",
    "birth_rate" : "μ",
    "death_rate" : "λ",
    "vaccinated" : "V",
    "not_vaccinated" : "NV",
    "sigma_sv" : "σsv",
    "sigma_av" : "σav",
    "sigma_snv" : "σsnv",
    "sigma_anv" : "σanv",
    "alpha_s" : "αs",
    "alpha_as" : "αas",
    "gamma_s" : "γs",
    "gamma_as" : "γas",
    "omega" : "ω"
}

var graph_top_1 = null;
var graph_top_2 = null;
var graph_top_3 = null;
var graph_top_4 = null;
var graph_top_5 = null;
var graph_top_6 = null;

var graph_bottom_1 = null;
var graph_bottom_2 = null;
var graph_bottom_3 = null;

var div_with_one_graph = `
    <div id="chart-carousel-1" class="carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div class="carousel-inner graph-outer">
            <div class="carousel-item graph-item active">
                <canvas id="graph-top-1" class="graph-item chart"></canvas>
            </div>
        </div>

        <!-- Left and right controls -->
        <a class="carousel-control-prev" href="#chart-carousel-1" data-slide="prev">
            <span class="carousel-control-prev-icon bg-dark"></span>
        </a>
        <a class="carousel-control-next" href="#chart-carousel-1" data-slide="next">
            <span class="carousel-control-next-icon bg-dark"></span>
        </a>
    </div> <!-- Carousel -->
`
var div_with_five_graphs = `
    <div id="chart-carousel-1" class="carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div class="carousel-inner graph-outer">
            <div class="carousel-item graph-item active">
                <canvas id="graph-top-1" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-2" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-3" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-4" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-5" class="graph-item chart"></canvas>
            </div>
        </div>

        <!-- Left and right controls -->
        <a class="carousel-control-prev" href="#chart-carousel-1" data-slide="prev">
            <span class="carousel-control-prev-icon bg-dark"></span>
        </a>
        <a class="carousel-control-next" href="#chart-carousel-1" data-slide="next">
            <span class="carousel-control-next-icon bg-dark"></span>
        </a>
    </div> <!-- Carousel -->
`

var div_with_six_graphs = `

    <div id="chart-carousel-1" class="carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div id="graph-outer-top" class="carousel-inner graph-outer">
            <div class="carousel-item graph-item active">
                <canvas id="graph-top-1" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-2" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-3" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-4" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-5" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-6" class="graph-item chart"></canvas>
            </div>
        </div>

        <!-- Left and right controls -->
        <a class="carousel-control-prev" href="#chart-carousel-1" data-slide="prev">
            <span class="carousel-control-prev-icon bg-dark"></span>
        </a>
        <a class="carousel-control-next" href="#chart-carousel-1" data-slide="next">
            <span class="carousel-control-next-icon bg-dark"></span>
        </a>
    </div> <!-- Carousel -->
`;

function Model(cur_s, cur_ev, cur_env, cur_is, cur_ias, cur_r,
    beta, birth_rate, death_rate, vaccinated, not_vaccinated, sigma_sv, sigma_av, sigma_snv, 
    sigma_anv, alpha_s, alpha_as, gamma_s, gamma_as, omega) {

    var del_s, del_ev, del_env, del_is, del_ias, del_r;

    del_s = birth_rate + (omega * cur_r) - (death_rate * cur_s) - (vaccinated * beta * cur_is * cur_s) - (not_vaccinated * beta * cur_is * cur_s);
    del_ev = (vaccinated * beta * cur_is * cur_s) - ((death_rate + sigma_sv + sigma_av) * cur_ev);
    del_env = (not_vaccinated * beta * cur_is * cur_s) - ((death_rate + sigma_snv + sigma_anv) * cur_env);
    del_is = (sigma_sv * cur_ev) + (sigma_snv * cur_env) - ((death_rate + alpha_s + gamma_s) * cur_is);
    del_ias = (sigma_av * cur_ev) + (sigma_anv * cur_env) - ((death_rate + alpha_as + gamma_as) * cur_ias);
    del_r = (gamma_s * cur_is) + (gamma_as * cur_ias) - ((death_rate + omega) * cur_r);

    return [del_s, del_ev, del_env, del_is, del_ias, del_r];
}

function calculateSEIR(data, initS, initEv, initEnv, initIs, initIas, initR, max_time=200, dt=1.0) {

    beta = data["transmission_rate"];
    birth_rate = data["birth_rate"];
    death_rate = data["death_rate"];
    vaccinated = data["vaccinated"];
    not_vaccinated = data["not_vaccinated"];
    sigma_sv = data["sigma_sv"];
    sigma_av = data["sigma_av"];
    sigma_snv = data["sigma_snv"];
    sigma_anv = data["sigma_anv"];
    alpha_s = data["alpha_s"];
    alpha_as = data["alpha_as"];
    gamma_s = data["gamma_s"];
    gamma_as = data["gamma_as"];
    omega = data["omega"];

    cur_s = initS;
    cur_ev = initEv;
    cur_env = initEnv;
    cur_is = initIs;
    cur_ias = initIas;
    cur_r = initR;

    init_pop = cur_s + cur_ev + cur_env + cur_is + cur_ias + cur_r;

    all_s = [cur_s];
    all_ev = [cur_ev];
    all_env = [cur_env];
    all_is = [cur_is];
    all_ias = [cur_ias];
    all_r = [cur_r]
    time = [0];

    var del_s, del_ev, del_env, del_is, del_ias, del_r;

    // Run for max_time iterations and calculate S, I, P, T and A for each time
    for(t=0; t<max_time; t+=dt) {
        [del_s, del_ev, del_env, del_is, del_ias, del_r] = Model(cur_s, cur_ev, cur_env, cur_is, cur_ias, cur_r, 
            beta, birth_rate, death_rate, vaccinated, not_vaccinated, sigma_sv, sigma_av, sigma_snv, 
            sigma_anv, alpha_s, alpha_as, gamma_s, gamma_as, omega);

        cur_s = cur_s + del_s;
        cur_ev = cur_ev + del_ev;
        cur_env = cur_env + del_env;
        cur_is = cur_is + del_is;
        cur_ias = cur_ias + del_ias;
        cur_r = cur_r + del_r;

        total_pop = (cur_s + cur_ev + cur_env + cur_is + cur_ias + cur_r);

        all_s.push(cur_s/total_pop);
        all_ev.push(cur_ev/total_pop);
        all_env.push(cur_env/total_pop);
        all_is.push(cur_is/total_pop);
        all_ias.push(cur_ias/total_pop);
        all_r.push(cur_r/total_pop);
        
        time.push(t);
    }

    return [time, all_s, all_ev, all_env, all_is, all_ias, all_r];
}

function calculateAttactor(data, cur_s1, cur_ev1, cur_env1, cur_is1, cur_ias1, cur_r1, 
                                cur_s2, cur_ev2, cur_env2, cur_is2, cur_ias2, cur_r2,
                                cur_s3, cur_ev3, cur_env3, cur_is3, cur_ias3, cur_r3, 
                                max_time=10000, dt=1.0) {

    data["max_time"] = max_time * dt;

    var time, all_s1, all_s2, all_s3, all_ev1, all_ev2, all_ev3, all_env1, all_env2, all_env3, 
        all_is1, all_is2, all_is3, all_ias1, all_ias2, all_ias3, all_r1, all_r2, all_r3;

    [time, all_s1, all_ev1, all_env1, all_is1, all_ias1, all_r1] = calculateSEIR(data, cur_s1, cur_ev1, cur_env1, cur_is1, cur_ias1, cur_r1, max_time=max_time, dt=dt);
    [time, all_s2, all_ev2, all_env2, all_is2, all_ias2, all_r2] = calculateSEIR(data, cur_s2, cur_ev2, cur_env2, cur_is2, cur_ias2, cur_r2, max_time=max_time, dt=dt);
    [time, all_s3, all_ev3, all_env3, all_is3, all_ias3, all_r3] = calculateSEIR(data, cur_s3, cur_ev3, cur_env3, cur_is3, cur_ias3, cur_r3, max_time=max_time, dt=dt);

    return [time, all_s1, all_ev1, all_env1, all_is1, all_ias1, all_r1, 
                  all_s2, all_ev2, all_env2, all_is2, all_ias2, all_r2,
                  all_s3, all_ev3, all_env3, all_is3, all_ias3, all_r3];
}

function drawSEIR(graph_element, graph, time, s, ev, env, is, ias, r, title_addn="") {

    // Destroy previous canvas
    if(graph)
        graph.destroy();

    var radius = 0;
    var borderWidth = 2;
    var new_graph = new Chart(graph_element, {
        type: "line",
        data: {
            labels : time,
            datasets : [{
                data : s,
                backgroundColor : "red",
                borderColor : "red",
                fill : false,
                label : "susceptible",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : ev,
                backgroundColor : "green",
                borderColor : "green",
                fill : false,
                label : "exposed - vaccinated",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : env,
                backgroundColor : "blue",
                borderColor : "blue",
                fill : false,
                label : "exposed - not vaccinated",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : is,
                backgroundColor : "black",
                borderColor : "black",
                fill : false,
                label : "infected - symptomatic",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : ias,
                backgroundColor : "orange",
                borderColor : "orange",
                fill : false,
                label : "infected - asymptomatic",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : r,
                backgroundColor : "yellow",
                borderColor : "yellow",
                fill : false,
                label : "recovered",
                borderWidth: borderWidth,
                pointRadius: radius
            },
        ]},
        options : {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'proportion of population'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'population vs time ' + title_addn
                }
            },
            animation: {
                duration: 0
            }
        }
    });

    return new_graph;
}

function drawVariation(graph_element, graph, time, data1, data2, data3, y_label, legend_labels=[1,2,3]) {
    // Destroy previous canvas
    if(graph)
        graph.destroy();

    radius = 0;
    borderWidth = 2;

    // Plot the graph with separate line for each parameter value
    new_graph = new Chart(graph_element, {
        type: 'line',
        data: {
            labels : time,
            datasets: [
                {
                    label: legend_labels[0],
                    data: data1,
                    showLine: true,
                    fill: false,
                    backgroundColor : "brown",
                    borderColor: 'brown',
                    borderWidth: borderWidth  ,
                    pointRadius: radius
                },
                {
                    label: legend_labels[1],
                    data: data2,
                    showLine: true,
                    fill: false,
                    backgroundColor : "violet",
                    borderColor: 'violet',
                    borderWidth: borderWidth,
                    pointRadius: radius
                },
                {
                    label: legend_labels[2],
                    data: data3,
                    showLine: true,
                    fill: false,
                    backgroundColor : "cyan",
                    borderColor: 'cyan',
                    borderWidth: borderWidth,
                    pointRadius: radius
                }
            ]
        },
        options : {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'proportion of ' + y_label + ' population'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: y_label + " vs time"
                }
            },
            animation: {
                duration: 0
            }
        }
    });

    return new_graph;
}

function drawAttractor(graph_element, graph, time, s1, s2, s3, other_class1, other_class2, other_class3, y_label) {
    // Destroy previous canvas
    if(graph)
        graph.destroy();

    // Store in separate array for different start point
    data1 = [];
    data2 = [];
    data3 = [];
    for (idx=0; idx<s1.length; idx++) {
        data1.push({x: s1[idx], y: other_class1[idx]})
        data2.push({x: s2[idx], y: other_class2[idx]})
        data3.push({x: s3[idx], y: other_class3[idx]})
    }

    pointRadius = 0;
    borderWidth = 2;

    initial_point = [data1[0], data2[0], data3[0]];
    final_point = [data1[data1.length-1], data2[data2.length-1], data3[data3.length-1]];


    // Plot the graph
    new_graph = new Chart(graph_element, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'initial values 1',
                    data: data1,
                    showLine: true,
                    fill: false,
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: borderWidth,
                    pointRadius: pointRadius
                },
                {
                    label: 'initial values 2',
                    data: data2,
                    showLine: true,
                    fill: false,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: borderWidth,
                    pointRadius: pointRadius
                },
                {
                    label: 'initial values 3',
                    data: data3,
                    showLine: true,
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'green',
                    borderWidth: borderWidth,
                    pointRadius: pointRadius
                },
                {
                    label: 'initial point',
                    data: initial_point,
                    showLine: false,
                    fill: true,
                    backgroundColor: 'orange',
                    borderColor: 'orange',
                    borderWidth: borderWidth,
                    pointRadius: pointRadius+5
                },
                {
                    label: 'final point',
                    data: final_point,
                    showLine: false,
                    fill: true,
                    backgroundColor: 'black',
                    borderColor: 'black',
                    borderWidth: borderWidth,
                    pointRadius: pointRadius+5
                }
            ]
        },
        options : {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'proportion of ' + y_label + ' population'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'proportion of susceptible population'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'susceptible vs ' + y_label
                },
                autocolors: false,
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: data1[5].y,
                            yMax: data1[6].y,
                            xMin: data1[5].x,
                            xMax: data1[6].x,
                            borderColor: 'red',
                            borderWidth: 1,
                            width: 1,
                            arrowHeads: {
                                end : {
                                    fill: true,
                                    display: true
                                }
                            }
                        },
                        line2: {
                            type: 'line',
                            yMin: data2[6].y,
                            yMax: data2[7].y,
                            xMin: data2[6].x,
                            xMax: data2[7].x,
                            borderColor: 'blue',
                            borderWidth: 1,
                            width: 1,
                            arrowHeads: {
                                end : {
                                    fill: true,
                                    display: true
                                }
                            }
                        },
                        line3: {
                            type: 'line',
                            yMin: data3[7].y,
                            yMax: data3[8].y,
                            xMin: data3[7].x,
                            xMax: data3[8].x,
                            borderColor: 'green',
                            borderWidth: 1,
                            width: 1,
                            arrowHeads: {
                                end : {
                                    fill: true,
                                    display: true
                                }
                            }
                        }
                    }
                }
            },
            animation: {
                duration: 0
            },
            legend: {
                display : false,
            }
        }
    });

    return new_graph;
}


function generateGraph() {

    data = {
        transmission_rate : parseFloat(document.getElementById("transmission_rate").value),
        birth_rate : parseFloat(document.getElementById("birth_rate").value),
        death_rate : parseFloat(document.getElementById("death_rate").value),
        vaccinated : parseFloat(document.getElementById("vaccinated").value),
        not_vaccinated : parseFloat(document.getElementById("not_vaccinated").value),
        sigma_sv : parseFloat(document.getElementById("sigma_sv").value),
        sigma_av : parseFloat(document.getElementById("sigma_av").value),
        sigma_snv : parseFloat(document.getElementById("sigma_snv").value),
        sigma_anv : parseFloat(document.getElementById("sigma_anv").value),
        alpha_s : parseFloat(document.getElementById("alpha_s").value),
        alpha_as : parseFloat(document.getElementById("alpha_as").value),
        gamma_s : parseFloat(document.getElementById("gamma_s").value),
        gamma_as : parseFloat(document.getElementById("gamma_as").value),
        omega : parseFloat(document.getElementById("omega").value)
    }

    max_time = parseInt(document.getElementById("max_time").value)

    var comment = "";
    var option = document.getElementById("varying_parameter");

    if(option.value=="no_variation") {

        document.getElementById('graph-top').innerHTML = "";
        var div = document.createElement('div');
        div.innerHTML = div_with_one_graph;
        document.getElementById('graph-top').appendChild(div);

        initS = parseFloat(document.getElementById("susceptible").value);
        initEv = parseFloat(document.getElementById("exposed-vaccinated").value);
        initEnv = parseFloat(document.getElementById("exposed-not-vaccinated").value);
        initIs = parseFloat(document.getElementById("infected-symptomatic").value);
        initIas = parseFloat(document.getElementById("infected-asymptomatic").value);
        initR = parseFloat(document.getElementById("recovered").value);

        [time, s, ev, env, is, ias, r] = calculateSEIR(data, initS, initEv, initEnv, initIs, initIas, initR, max_time=max_time);
        graph_element = document.getElementById("graph-top-1");
        graph_top_1 = drawSEIR(graph_element, graph_top_1, time, s, ev, env, is, ias, r);

        deleteGraphs = [graph_top_2, graph_top_3, graph_top_4, graph_top_5, graph_top_6];
        for(i=0; i<deleteGraphs.length; i++) {
            if(deleteGraphs[i])
                deleteGraphs[i].destroy();
        }

        document.getElementById("graph-top").style.display = "block";
        document.getElementById("graph-bottom").style.display = "none";

        comment = "The graph shows the variation of class values with time.";


    }

    else if(option.value=="attractor_plot") {

        document.getElementById('graph-top').innerHTML = "";
        var div = document.createElement('div');
        div.innerHTML = div_with_five_graphs;
        document.getElementById('graph-top').appendChild(div);

        initS1 = parseFloat(document.getElementById("susceptible").value);
        initS2 = parseFloat(document.getElementById("add-input-1").value);
        initS3 = parseFloat(document.getElementById("add-input-2").value);

        initEv1 = parseFloat(document.getElementById("exposed-vaccinated").value);
        initEv2 = parseFloat(document.getElementById("add-input-3").value);
        initEv3 = parseFloat(document.getElementById("add-input-4").value);

        initEnv1 = parseFloat(document.getElementById("exposed-not-vaccinated").value);
        initEnv2 = parseFloat(document.getElementById("add-input-5").value);
        initEnv3 = parseFloat(document.getElementById("add-input-6").value);

        initIs1 = parseFloat(document.getElementById("infected-symptomatic").value);
        initIs2 = parseFloat(document.getElementById("add-input-7").value);
        initIs3 = parseFloat(document.getElementById("add-input-8").value);

        initIas1 = parseFloat(document.getElementById("infected-asymptomatic").value);
        initIas2 = parseFloat(document.getElementById("add-input-9").value);
        initIas3 = parseFloat(document.getElementById("add-input-10").value);

        initR1 = parseFloat(document.getElementById("recovered").value);
        initR2 = parseFloat(document.getElementById("add-input-11").value);
        initR3 = parseFloat(document.getElementById("add-input-12").value);

        [time, all_s1, all_ev1, all_env1, all_is1, all_ias1, all_r1, 
               all_s2, all_ev2, all_env2, all_is2, all_ias2, all_r2,
               all_s3, all_ev3, all_env3, all_is3, all_ias3, all_r3] = calculateAttactor(data,initS1, initEv1, initEnv1, initIs1, initIas1, initR1,
                                                                                initS2, initEv2, initEnv2, initIs2, initIas2, initR2,
                                                                                initS3, initEv3, initEnv3, initIs3, initIas3, initR3,
                                                                                max_time=max_time);

        if(graph_top_6)
            graph_top_6.destroy();

        // Draw Attractor only
        graph_element = document.getElementById("graph-top-1");
        graph_top_1 = drawAttractor(graph_element, graph_top_1, time, all_s1, all_s2, all_s3, all_ev1, all_ev2, all_ev3, "Exposed - vaccinated");

        graph_element = document.getElementById("graph-top-2");
        graph_top_2 = drawAttractor(graph_element, graph_top_2, time, all_s1, all_s2, all_s3, all_env1, all_env2, all_env3, "Exposed - not vaccinated");

        graph_element = document.getElementById("graph-top-3");
        graph_top_3 = drawAttractor(graph_element, graph_top_3, time, all_s1, all_s2, all_s3, all_is1, all_is2, all_is3, "Infected - symptomatic");

        graph_element = document.getElementById("graph-top-4");
        graph_top_4 = drawAttractor(graph_element, graph_top_4, time, all_s1, all_s2, all_s3, all_ias1, all_ias2, all_ias3, "Infected - asymptomatic");

        graph_element = document.getElementById("graph-top-5");
        graph_top_5 = drawAttractor(graph_element, graph_top_5, time, all_s1, all_s2, all_s3, all_r1, all_r2, all_r3, "Recovered");

        document.getElementById("graph-top").style.display = "block";
        document.getElementById("graph-bottom").style.display = "none";

        document.getElementById("graph-outer-bottom").style.height = "350px";
        document.getElementById("graph-outer-top").style.height = "350px";


        comment = "The graph shows the variation of each class with susceptiple population. The values converge to a single equilibrium point from different inital values. Hence it is a attractor plot.";
    }

    else {

        document.getElementById('graph-top').innerHTML = "";
        var div = document.createElement('div');
        div.innerHTML = div_with_six_graphs;
        document.getElementById('graph-top').appendChild(div);

        initS = parseFloat(document.getElementById("susceptible").value);
        initEv = parseFloat(document.getElementById("exposed-vaccinated").value);
        initEnv = parseFloat(document.getElementById("exposed-not-vaccinated").value);
        initIs = parseFloat(document.getElementById("infected-symptomatic").value);
        initIas = parseFloat(document.getElementById("infected-asymptomatic").value);
        initR = parseFloat(document.getElementById("recovered").value);


        var varying_parameter =  document.getElementById("varying_parameter").value;
        var option1 = document.getElementById("option1").value;
        var option2 = document.getElementById("option2").value;
        var option3 = document.getElementById("option3").value;

        console.log(option1, option2, option3);
        console.log(varying_parameter)
        data[varying_parameter] = parseFloat(option1);
        [time, s1, ev1, env1, is1, ias1, r1] = calculateSEIR(data,initS, initEv, initEnv, initIs, initIas, initR, max_time=max_time);
        console.log(data);
        data[varying_parameter] = parseFloat(option2);
        [time, s2, ev2, env2, is2, ias2, r2] = calculateSEIR(data,initS, initEv, initEnv, initIs, initIas, initR, max_time=max_time);
        console.log(data);

        data[varying_parameter] = parseFloat(option3);
        [time, s3, ev3, env3, is3, ias3, r3] = calculateSEIR(data,initS, initEv, initEnv, initIs, initIas, initR, max_time=max_time);
        console.log(data);

        legend_labels = [
            symbol_dict[varying_parameter] + "=" + String(option1),
            symbol_dict[varying_parameter] + "=" + String(option2),
            symbol_dict[varying_parameter] + "=" + String(option3)
        ];

        console.log(s1);
        console.log(s2);
        console.log(s3);

        graph_element = document.getElementById("graph-top-1");
        graph_top_1 = drawVariation(graph_element, graph_top_1, time, s1, s2, s3, "susceptible", legend_labels);

        graph_element = document.getElementById("graph-top-2");
        graph_top_2 = drawVariation(graph_element, graph_top_2, time, ev1, ev2, ev3, "exposed - vaccinated", legend_labels);

        graph_element = document.getElementById("graph-top-3");
        graph_top_3 = drawVariation(graph_element, graph_top_3, time, env1, env2, env3, "exposed - not vaccinated", legend_labels);

        graph_element = document.getElementById("graph-top-4");
        graph_top_4 = drawVariation(graph_element, graph_top_4, time, is1, is2, is3, "infected - symptomatic", legend_labels);

        graph_element = document.getElementById("graph-top-5");
        graph_top_5 = drawVariation(graph_element, graph_top_5, time, ias1, ias2, ias3, "infected - asymptomatic", legend_labels);

        graph_element = document.getElementById("graph-top-6");
        graph_top_6 = drawVariation(graph_element, graph_top_6, time, r1, r2, r3, "recovered", legend_labels);

        graph_element = document.getElementById("graph-bottom-1");
        graph_bottom_1 = drawSEIR(graph_element, graph_bottom_1, time, s1, ev1, env1, is1, ias1, r1, legend_labels[0]);

        graph_element = document.getElementById("graph-bottom-2");
        graph_bottom_2 = drawSEIR(graph_element, graph_bottom_2, time, s2, ev2, env2, is2, ias2, r2, legend_labels[1]);

        graph_element = document.getElementById("graph-bottom-3");
        graph_bottom_3 = drawSEIR(graph_element, graph_bottom_3, time, s3, ev3, env3, is3, ias3, r3, legend_labels[2]);

        document.getElementById("graph-top").style.display = "block";
        document.getElementById("graph-bottom").style.display = "block";

        document.getElementById("graph-outer-top").style.height = "250px";
        document.getElementById("graph-outer-bottom").style.height = "250px";

        comment = "The graph on the top shows the variation of each class values for different parameter values. The second graph shows the variation of class values for each parameter value.";
    }

    document.getElementById("comment").innerHTML = comment;
    document.getElementById("comment-section").style.display = "block";
}
