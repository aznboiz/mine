function pullJobs(profiles) {
	member = profiles.values[0];	
	
	$("#loadingModal").modal('show');  
	
	//Populate left sidebar
	$("#leftMenu").html("");
	$("#leftMenu").append('<li class="nav-header">Experience</li>');
	for(i=0;i<member.positions.values.length;i++) {
	 $("#leftMenu").append('<li id="experience_' + i +'" class="leftMenuText">' + member.positions.values[i].company.name +' (' + member.positions.values[i].company.industry +')</li>');
	}
	$("#leftMenu").append('<li class="nav-header">Skills</li>');
	for(i=0;i<member.skills.values.length;i++) {
	 $("#leftMenu").append('<li id="skills_' + i +'" class="leftMenuText">' + member.skills.values[i].skill.name + '</li>');
	}	
	$("#leftMenu").append('<li class="nav-header">Education</li>');
	for(i=0;i<member.educations.values.length;i++) {
	 $("#leftMenu").append('<li id="degree_' + i + '" class="leftMenuText">' + member.educations.values[i].degree + '</li>');
	 //$("#leftMenu").append('<li id="field_' + i + '" class="leftMenuText">&nbsp;&nbsp;&nbsp;' + member.educations.values[i].fieldOfStudy + '</li>');
	 $("#leftMenu").append('<li id="school_' + i + '" class="leftMenuText">&nbsp&nbsp;&nbsp;' + member.educations.values[i].schoolName + '</li>');
	}
	
	var comp = "";
	var title = "";
	var desc = "";
	var rank = "";
	
	$.ajax({
		dataType: "json",
		url: "http://representuw.com/MineJobs/service/jobs.php"
		//url: "http://localhost/mine/service/jobs.php"
		//url: "http://minejobs.3eeweb.com/service/jobs.php"
	}).success(function(data) {
		$("#mainContainer").html("");
		$("#mainContainer").append('<div class="hero-unit"><h1>Welcome <span id="firstName">' + member.firstName +'</span> <span id="lastName">' + member.lastName + '</span></h1><p>MineJobs has created a list of jobs available for you that you might find intriguing!</p></div>');
	
		var k=0;
		
		while (k<12) {
			for(i=0;i<4;i++) { 	//# of rows			
				$("#mainContainer").append('<div id="row_' + i +'" class="row-fluid">');
				for(j=0;j<3;j++) { //# of cols
					comp = data[k].employer;
					title = data[k].jobTitle;
					rank = data[k].rank;
					fullDesc = data[k].desc;
					desc = fullDesc;
					if (desc.length > 250) {
						var desc = desc.substring(0,250)+"...";
					} 
				
					$("#row_" + i).append('<div id="job_' + i + '_' + j +'" class="span4">');
					$("#job_" + i + "_" + j).append('<h2>' + comp + ' <span class="rank">(' + rank + '%)</span></h2>');
					$("#job_" + i + "_" + j).append('<h5>' + title + '</h5>');
					$("#job_" + i + "_" + j).append('<p>' + desc + '</p>');
					$("#job_" + i + "_" + j).append('<p><a id="btn_' + i + '_' + j +'" class="btn viewDetails" name="' + comp + '" data-title="' + title + '" data-desc="' + fullDesc + '" role="button" data-toggle="modal">View details &raquo;</a></p>');
					$("#row_" + i).append('</div>');
					k++;
				}
				$("#mainContainer").append('</div>');
			}
		}
		
		$("#loadingModal").modal('hide'); 
		
		changePage("#welcome", "#homepage");
		eventTrigger();			
	});

}