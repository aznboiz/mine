function displayProfiles(profiles) {
	member = profiles.values[0];	
	
	$("#loadingModal").modal('show');

	//Grab Linkedin Skills, compare with database jobs using php
	if(member.positions.values) {
		var sizeOfPositions = member.positions.values.length;
	} else{
		var sizeOfPostitions = 0;
	}
	if(member.skills.values) {
		var sizeOfSkills = member.skills.values.length;
	} else{
		var sizeOfSkills = 0;
	}
	if(member.educations.values) {
		var sizeOfEducation = member.educations.values.length;
	} else{
		var sizeOfEducation = 0;
	}
	var checkImg = "http://representuw.com/MineJobs/assets/img/icons/glyphicons_206_ok_2.png";
	var uncheckImg = "http://representuw.com/MineJobs/assets/img/icons/glyphicons_207_remove_2.png";
	
	//Populate left sidebar
	$("#leftMenu").html("");
	$("#leftMenu").append('<div style="margin-left:auto; margin-right: auto; width:25%;"><img src="' + member.pictureUrl + '" alt="Smiley face" height="80" width="80"></div>');
	$("#leftMenu").append('<li class="nav-header colorBlack">Experience</li>');
	for(i=0;i<sizeOfPositions;i++) {
	 $("#leftMenu").append('<li id="experience_' + i +'" class="leftMenuTextOrange clearLeft expClass" name="' + member.positions.values[i].company.name + '">' + '<span id="expIcon_' + i +'" class="leftIcons" data-checked="true"><img src="' + checkImg + '" height="10px" width="13px">&nbsp;</span>' + member.positions.values[i].company.name +' (' + member.positions.values[i].company.industry +')</li>');
	}
	$("#leftMenu").append('<li class="nav-header colorBlack">Skills</li>');
	for(i=0;i<sizeOfSkills;i++) {
	 $("#leftMenu").append('<li id="skills_' + i +'" class="leftMenuTextOrange clearLeft skillsClass" name="' + member.skills.values[i].skill.name +'">' + '<span id="skillsIcon_' + i +'" class="leftIcons" data-checked="true"><img src="' + checkImg + '" height="10px" width="13px">&nbsp;</span>' + member.skills.values[i].skill.name + ' [' + '<span class="sliderValue" id="sliderVal_' + i +'"></span>' + '/5]<div class="hideSlider skillSlider" id="slider_' + i +'">&nbsp;&nbsp;&nbsp;&nbsp;<input type="range" class="sliderClass" id="sliderInput_' + i + '"min="1" max="5" value="3"></div></li>');
	 var sliderNum = $("#sliderInput_"+i).attr("value");
	 $("#sliderVal_"+i).html(sliderNum);
	}	
	$("#leftMenu").append('<li class="nav-header colorBlack">Education</li>');
	for(i=0;i<sizeOfEducation;i++) {
	 $("#leftMenu").append('<li id="degree_' + i + '" class="leftMenuTextOrange clearLeft">' + member.educations.values[i].degree + '</li>');
	 //$("#leftMenu").append('<li id="field_' + i + '" class="leftMenuTextOrange clearLeft">&nbsp;&nbsp;&nbsp;' + member.educations.values[i].fieldOfStudy + '</li>');
	 $("#leftMenu").append('<li id="school_' + i + '" class="leftMenuTextOrange clearLeft">&nbsp&nbsp;&nbsp;' + member.educations.values[i].schoolName + '</li>');
	}
	$("#leftMenu").append('</ul>');
	$("#leftMenu").append('<div><button id="refineButton" class="btn btn-inverse refineBtn" type="button" onclick="refineSearch()">Refine</button><br><br></div>');
	$("#refineButton").data('profile',profiles.values);
	$("leftMenu").append('</div>')
	var skillsJson = JSON.stringify(member.skills.values);
	var memberJson = JSON.stringify(profiles.values);
	
	
 	
	
	var comp = "";
	var title = "";
	var desc = "";
	var rank = "";
	
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "http://representuw.com/MineJobs/service/jobs.php",
		//url: "http://localhost/mine/service/jobs.php",
		data: {"member": memberJson}
	}).success(function(data) {
		$("#mainContainer").html("");
		$("#mainContainer").append('<div class="hero-unit heroColor"><h1>Welcome <span id="firstName">' + member.firstName +'</span> <span id="lastName">' + member.lastName + '</span></h1><p>MineJobs has created a list of jobs available for you that you might find interesting!</p></div>');
		
		var k=0;
		
		var numOfJobs = Math.floor((data.length/3));
		
		if(numOfJobs == 0) {
			$("#mainContainer").append('<div class="noMatch">No Matches Found. Help us help you, please update your Linkedin Profile <a href="http://www.linkedin.com/profile/edit?trk=hb_tab_pro_top" target="_blank"><u>here</u></a>!');
			$("#mainContainer").append('</div>');
		} else {
			while (k<numOfJobs) {
				for(i=0;i<(numOfJobs/3);i++) { 	//# of rows			
					$("#mainContainer").append('<div id="row_' + i +'" class="row-fluid rowMargin">');
					for(j=0;j<3;j++) { //# of cols
						comp = data[k].employer;
						title = data[k].jobTitle;
						rank = data[k].rank;
						fullDesc = data[k].desc;
						desc = fullDesc;
						if (desc.length > 250) {
							var strippedDesc = jQuery(desc).text();
							var desc = strippedDesc.substring(0,250)+"...";
						} 
						
						$("#row_" + i).append('<div id="job_' + i + '_' + j +'" class="span4 jobBgImg">');
						$("#job_" + i + "_" + j).append('<h2>' + comp + /*' <span class="rank">(' + rank + '%)</span>*/'</h2>');
						$("#job_" + i + "_" + j).append('<h5>' + title + '</h5>');
						$("#job_" + i + "_" + j).append('<p>' + desc + '</p>');
						$("#job_" + i + "_" + j).append('<p><a id="btn_' + i + '_' + j +'" class="btn viewDetails" name="' + comp + '" data-title="' + title + '" role="button" data-toggle="modal">View details &raquo;</a></p>');
						$("#row_" + i).append('</div>');
						$("#btn_" + i + "_" + j).data('test',fullDesc);
						$("#btn_" + i + "_" + j).data('matches',data[k].matches);
						k++;
					}
					$("#mainContainer").append('</div>');
				}
			}
		}
		
		$("#loadingModal").modal('hide'); 
		
		changePage("#welcome", "#homepage");
		eventTrigger();			
	});

}