// Var definitions
	
	var roc_value=[];
	var roc_time=[];
	var roc_norm_timestamps=[];
	var roc_norm_value=[];
	
	var start_time=0;
	var display_now_time=0;
	var auto_update=true;
	
	var corrected_weight = 0;
	var pat_age = 0;
	
	var k_a = new Array(8640).fill(0);
	var C_e = new Array(8640).fill(0);
	var C_p = new Array(8640).fill(0);
	var tof = new Array(8640).fill(0);
	tof[0]=100;
	
	var X_1 = 0;
	var X_2 = 0;
	var X_3 = 0;

	var last_X_1 = 0;
	var last_X_2 = 0;
	var last_X_3 = 0;
	//#######################################################################################################################
	//Init
	
	//Start Modal
	$(window).on('load',function() {
		set_modal_text('Hinweis','Die implementierten pharmakokinetischen und pharmakodynamischen Modelle basieren auf Arbeiten von Saldien et al. und Wierda et al., es handelt sich hierbei um eine Anwendung für Ausbildung und Lehre und nicht um ein klinisches Decision Support System!');
    clear_chart_plot();
    
    update_time_display();
    toggle_calc_start_time();
    $('#myModal').modal('show');
    //$('#myModal').modal('hide');
	});
	
	//Update resize
	$(window).on('resize',function() {
    if(document.getElementById("d_list").length > 0){
		extract_plot_data();
	}
	});
	
	//set start times
	init_times();
	
	//start update-interval
	setInterval(timer_update_plot, 60000);
	
	//#######################################################################################################################
	// Input functions
	function timer_update_plot()
	{
		//console.log("update");
		if(auto_update==true){
			update_time_display();
			if(document.getElementById("d_list").length > 0){
				extract_plot_data();
			}
		}
	}
	
	
	function set_modal_text(t_header, t_body)
	{
		document.getElementById("modal_title").innerHTML = t_header;
		document.getElementById("modal_body").innerHTML = t_body;
	}
	
	function init_times()
	{
		today = new Date();
		display_now_time = Math.round(today.valueOf() / 10000);
		start_time = Math.round(today.valueOf() / 10000);
	}
	
	function set_now_time(){
		var date = new Date();
		//var currentDate = date.toISOString().substring(0,10);
		//var currentTime = date.toISOString().substring(11,16);
		var t_hours="";
		var t_minutes="";
		if (date.getHours()>=10){
			t_hours = String(date.getHours());
		}
		else{
			t_hours = "0" + String(date.getHours());
		}
		if (date.getMinutes()>=10){
			t_minutes = String(date.getMinutes());
		}
		else{
			t_minutes = "0" + String(date.getMinutes());
		}
		var time = t_hours + ":" + t_minutes;
		//console.log(time);
		document.getElementById('d_time').value = time;
	}
	
	function show_ce_info()
	{
		set_modal_text('Effektkompartiment-Konzentration','Je nach betrachteter Studie ist die Effect Site Concentration von Rocuronium in den meisten Fällen, wenn die Intubationsbedingungen als gut beschrieben werden, &geq;3µg/ml. <br>Außerdem entspricht %T1 > 0.25 laut Moriyama et al. in etwa 1.56 ± 0.35 μg/ml.');
		$('#myModal').modal('show');
	}
	
	function update_time_display()
	{
		//c_start_time
		var date = new Date();
		//var currentDate = date.toISOString().substring(0,10);
		//var currentTime = date.toISOString().substring(11,16);
		var t_hours="";
		var t_minutes="";
		if (date.getHours()>=10){
			t_hours = String(date.getHours());
		}
		else{
			t_hours = "0" + String(date.getHours());
		}
		if (date.getMinutes()>=10){
			t_minutes = String(date.getMinutes());
		}
		else{
			t_minutes = "0" + String(date.getMinutes());
		}
		var time = t_hours + ":" + t_minutes;
		//console.log(time);
		document.getElementById("c_start_time").innerHTML = time;
		
		
		today = new Date();
		//console.log(Math.round(today.valueOf()/10000));
		
		display_now_time = Math.round(today.valueOf() / 10000);
	}
	
	function toggle_calc_start_time()
	{
		//console.log(document.getElementById("c_start_1").checked);
		if(document.getElementById("c_start_1").checked == true){
			document.getElementById("c_time_display").style.display = "block";
			auto_update=true; 
			update_time_display();
		}
		else{
			document.getElementById("c_time_display").style.display = "none"; 
			auto_update=false; 
		}
		
		//update plot
		if(document.getElementById("d_list").length > 0){
			extract_plot_data();
		}
	}
	
	function add_roc_value() {
		var r_dose = parseInt(document.getElementById("d_dose").value);
		var r_time = document.getElementById("d_time").value;		
		if((r_dose > 0)&&(r_dose < 200)&&(r_time!="")){
			// reset colors
			document.getElementById("d_dose").style.backgroundColor = '#fff';
			document.getElementById("d_time").style.backgroundColor = '#fff';
			//process
			var x = document.getElementById("d_list");
			var option = document.createElement("option");
			option.value = document.getElementById('d_time').value;
			option.text = "Rocuronium " + String(r_dose) + "mg (" + String(document.getElementById('d_time').value) + ")";
			x.add(option);
			roc_value.push(r_dose);
			// CAVE: Mitternachtsüberschreitung!!!
			today = new Date();
			const time_array = r_time.split(":");
			var baseline_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(time_array[0]), parseInt(time_array[1]), 0);
			roc_time.push(Math.round(baseline_date.valueOf()/10000));
			
			data_list_changed();
		}
		else{
			if ((r_dose <= 0)||(r_dose >= 200)||(r_dose==null)||isNaN(r_dose)){
				document.getElementById("d_dose").style.backgroundColor = '#fcaeae';
			}
			else{
				document.getElementById("d_dose").style.backgroundColor = '#fff';
			}
			if ((r_time=="")||(r_time.length!=5)){
				document.getElementById("d_time").style.backgroundColor = '#fcaeae';
			}
			else{
				document.getElementById("d_time").style.backgroundColor = '#fff';
			}
		}
	}
	
	function remove_item_from_d_list() {
		var x = document.getElementById("d_list"); 
		var s_i = x.selectedIndex;
		//console.log(s_i);
		if (s_i > -1){
			roc_value.splice(s_i, 1);
			roc_time.splice(s_i, 1);
			x.remove(s_i);
			//console.log(roc_value);
			//console.log(roc_time);
			
			data_list_changed();
		}
	}
	
	function enter_patient(){
		var p_weight = parseInt(document.getElementById("p_weight").value);
		var p_height = parseInt(document.getElementById("p_height").value);
		var p_age = parseInt(document.getElementById("p_age").value);
		var p_gender = parseInt(document.getElementById("p_gender").value);
		//console.log(p_weight);
		
		if ((p_weight >= 40) && (p_weight <= 160) && (p_height >= 140) && (p_height <= 220) && (p_age >= 15) && (p_age <= 110)){
			// reset color
			document.getElementById("p_weight").style.backgroundColor = '#fff';
			document.getElementById("p_height").style.backgroundColor = '#fff';
			document.getElementById("p_age").style.backgroundColor = '#fff';
			//
			document.getElementById("input_patient").style.display = "none"; 
			document.getElementById("info_patient").style.display = "block"; 
			document.getElementById("input_data").style.display = "block"; 
			
			//set corrected_weight
			corrected_weight = calculate_corrected_weight(p_weight, p_height);
			pat_age = p_age;
			
			var geschlecht = "(w)"
			if (p_gender == 2){
				geschlecht = "(m)"
			}
			document.getElementById("info_patient_txt").innerHTML = "Gewicht: " + String(p_weight) + "kg, Größe: " + String(p_height) + "cm, Alter: " + String(p_age) + ", " + geschlecht ;
		}
		else{
			if ((p_weight < 40)||(p_weight > 160)||(p_weight==null)||isNaN(p_weight)){
				document.getElementById("p_weight").style.backgroundColor = '#fcaeae';
			}
			else{
				document.getElementById("p_weight").style.backgroundColor = '#fff';
			}
			if ((p_height < 140)||(p_height > 220)||(p_height==null)||isNaN(p_height)){
				document.getElementById("p_height").style.backgroundColor = '#fcaeae';
			}
			else{
				document.getElementById("p_height").style.backgroundColor = '#fff';
			}
			if ((p_age <= 15)||(p_age >= 100)||(p_age==null)||isNaN(p_age)){
				document.getElementById("p_age").style.backgroundColor = '#fcaeae';
			}
			else{
				document.getElementById("p_age").style.backgroundColor = '#fff';
			}
		}
	}
	
	//adjust body weight
	function calculate_corrected_weight(weight, height)
	{
		var ret_val = weight;
		//correct if bmi > 26
		if((weight/((height/100)*(height/100))) > 25){
			ret_val = Math.round(((height/100)*(height/100)) * 25);
		}
		return ret_val;
	}
	
	
	//#######################################################################################################################
	function data_list_changed(){
		if(document.getElementById("d_list").length > 0){
		
			var min_time = Math.min(...roc_time);
			var max_time = Math.max(...roc_time);
			
			start_time = min_time;
			
			//console.log(min_time);
			//console.log(max_time);
			roc_norm_timestamps = [];
			roc_norm_value = [];
			k_a.fill(0);
		
			for (let i = 0; i < roc_time.length; i++) {
				roc_norm_timestamps.push(roc_time[i]-min_time);
				roc_norm_value.push(roc_value[i]);
			} 
		
			//console.log("####");
			//console.log(roc_norm_timestamps);
			//console.log(roc_norm_value);
			//console.log("----------------");
			
			sort_arrays();
			
			//console.log(roc_norm_timestamps);
			//console.log(roc_norm_value);
		
			for (let j = 0; j < roc_norm_timestamps.length; j++) {
				k_a[roc_norm_timestamps[j]] = k_a[roc_norm_timestamps[j]] + roc_norm_value[j]
			} 
			
			calc_model();
			//console.log(k_a);
			//console.log(C_e);
			extract_plot_data();
			//console.log(k_a);
		}
		else{
			clear_chart_plot();
		}
	}
	
	// sort arrays
	function sort_arrays()
	{
		var i = 0;
		while (i <= (roc_time.length-2)){
			if(roc_norm_timestamps[i] > roc_norm_timestamps[i + 1]){
				var a = roc_norm_timestamps[i + 1];
				roc_norm_timestamps[i + 1] = roc_norm_timestamps[i];
				roc_norm_timestamps[i] = a;
				
				var b = roc_norm_value[i + 1];
				roc_norm_value[i + 1] = roc_norm_value[i];
				roc_norm_value[i] = b;
				
				i = 0;
			}
			else{
				i++;
			}
		}
	}
	
	// function for predicted effect
	function effect_function(c_e, c_shift)
	{
		var ret_val = Math.round(((Math.pow(((c_e+c_shift+75)/180),4)) / (1010 + Math.pow(((c_e+c_shift+75)/180),4)))*100);
		
		ret_val = 100 - ret_val;
		
		if(ret_val < 0){
			ret_val = 0;
		}
		if(ret_val > 100){
			ret_val = 100;
		}
		return ret_val;
	}
	
	// calculate age-dependent shift
	function shift_effect_function(age)
	{
		var ret_val = 0;
		if (age<=15){
			ret_val = -100;
		}
		else if(age>=65){
			ret_val = 100;
		}
		else{
			ret_val = ((-0.08)*age*age) + (10.09*age) - 234;
		}
		
		//console.log(ret_val);
		return ret_val;
	}
	
	//model step
	function model_timestep(t_n, weight)
	{
		const V1 = weight * 35.6;
		const V2 = weight * 72;
		const V3 = weight * 122;
		
		const k_12 = 0.209 / 6;
		const k_21 = 0.163 / 6;
		const k_13 = 0.05 / 6;
		const k_31 = 0.015 / 6;
		const k_10 = 0.1260 / 6;
		const k_eo = 0.168 / 6;
		
		last_X_1 = X_1;
		last_X_2 = X_2;
		last_X_3 = X_3;
		
		X_1 = last_X_1 + k_a[t_n - 1] + (last_X_3 * k_31) + (last_X_2 * k_21) - (last_X_1 * k_13) - (last_X_1 * k_12) - (last_X_1 * k_10);
		
		X_2 = last_X_2 + (last_X_1 * k_12) - (last_X_2 * k_21);
		
		X_3 = last_X_3 + (last_X_1 * k_13) - (last_X_3 * k_31);
		
		var C_1_temp = (X_1*1000) / V1;
		
		//small value cutoff
		if (C_1_temp<= 0.01)
		{
			C_1_temp = 0;
		}
		C_p[t_n] = C_1_temp;
		
		//small value cutoff
		C_e[t_n] = (C_e[t_n-1] +((C_1_temp - C_e[t_n-1]) * k_eo));
		if (C_e[t_n]<= 0.01)
		{
			C_e[t_n] = 0;
		}
		
		tof[t_n] = effect_function(C_e[t_n]*1000, shift_effect_function(pat_age));
	}
	
	//model calculate
	function calc_model()
	{
		for (let i = 1; i < k_a.length; i++) {
			model_timestep(i, corrected_weight);
		} 
	}
	
	function extract_plot_data()
	{
		var a = new Array(121).fill(0);
		var b = new Array(121).fill(0);
		var c = new Array(121).fill(100);
		
		if(auto_update==false){
			for (let i = 0; i < 121; i++) {
				a[i] = C_e [i * 6];
				b[i] = C_p [i * 6];
				c[i] = tof [i * 6];
			} 
			
		}
		//Auto-Update Startzeit setzen
		else{
			var shift_dataframe = display_now_time - start_time
			//console.log(shift_dataframe);
			

			//  24-h Überschreitung abfangen > CAVE: falscher Plot!!!
			if(shift_dataframe>=8640-121){
				shift_dataframe=8640-121-1;
				document.getElementById("c_start_time").innerHTML = document.getElementById("c_start_time").innerHTML + " Achtung: 24h überschritten! Zeitpunkte sind nicht mehr aktuell!";
			}
			shift_dataframe=Math.round(shift_dataframe/6);
			
			for (let i = 0; i < 121; i++) {
				
				if(i + shift_dataframe >= 0){
					a[i] = C_e [(i + shift_dataframe) * 6];
					b[i] = C_p [(i + shift_dataframe) * 6];
					c[i] = tof [(i + shift_dataframe) * 6];
				}
			
			}
		}
		
		//console.log(a);
		//console.log(b);
		//console.log(c);
		
		plot_chart(a, b ,c);
	}
