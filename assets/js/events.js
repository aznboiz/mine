function eventTrigger() {
	// $('.span4').mouseover(function() {	
		// var idJob = $(this).attr("id");
		
		// $('#skills_1').addClass("highlight");
		// $('#skills_4').addClass("highlight");
		// $('#skills_7').addClass("highlight");
		// $('#experience_1').addClass("highlight");
	// }).mouseout(function() {
		// $('#skills_1').removeClass("highlight");
		// $('#skills_4').removeClass("highlight");
		// $('#skills_7').removeClass("highlight");
		// $('#experience_1').removeClass("highlight");
	// });
	
	$(".viewDetails").click(function() {
		createModal(this);
	});
	
	$('.leftIcons').toggle(function() {
		$(this).html('<img src="http://representuw.com/MineJobs/assets/img/icons/glyphicons_207_remove_2.png" height="10px" width="13px">&nbsp;');
		$(this).attr('data-checked','false');
		$(this).parent().addClass('leftMenuTextGrey');
		$(this).parent().removeClass('leftMenuTextOrange');
	}, function() {
		$(this).html('<img src="http://representuw.com/MineJobs/assets/img/icons/glyphicons_206_ok_2.png" height="10px" width="13px">&nbsp;');
		$(this).attr('data-checked','true');
		$(this).parent().addClass('leftMenuTextOrange');
		$(this).parent().removeClass('leftMenuTextGrey');
	});
	
	$(".skillsClass").mouseover(function() {
		var idWord = $(this).attr("id");
		var idNum = idWord.split('_')[1];
		$('#slider_'+idNum).addClass('showSlider');
		$('#slider_'+idNum).removeClass('hideSlider');
	}).mouseout(function() {
		var idWord = $(this).attr("id");
		var idNum = idWord.split('_')[1];
		$('#slider_'+idNum).addClass('hideSlider');
		$('#slider_'+idNum).removeClass('showSlider');
	});	
	
	$('.sliderClass').change(function() {
		var idWord = $(this).attr("id");
		var idNum = idWord.split('_')[1];
		$('#sliderVal_'+idNum).html($(this).attr("value"));
	});
}

function changePage(oldPage, newPage) {
	$(oldPage).removeClass("show");
	$(oldPage).addClass("hide");
	$(newPage).addClass("show");
	$(newPage).removeClass("hide");
}

function refineSearch() {
	$("#loadingModal").modal('show');
	var member = $("#refineButton").data("profile");
	var memberJson = JSON.stringify(member);
	
	var refineSkills = [];
	var skillCount = $('.skillsClass').length;
	for(i=0;i<skillCount;i++) {
		var obj = {
			skill: $("#skills_"+i).attr("name"),
			val: $("#sliderInput_"+i).attr("value"),
			check: $("#skillsIcon_"+i).attr("data-checked"),
		};
		refineSkills.push(obj);
	}
	
	var refineExp = [];
	var expCount = $('.expClass').length;
	for(i=0;i<expCount;i++) {
		var obj = {
			exp: $("#experience_"+i).attr("name"),
			check: $("#expIcon_"+i).attr("data-checked"),
		};
		refineExp.push(obj);
	}
	
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "http://representuw.com/MineJobs/service/refine.php",
		data: {"member": memberJson, "refineSkills": refineSkills, "refineExp": refineExp}
	}).success(function(data) {
		$("#mainContainer").html("");
		$("#mainContainer").append('<div class="hero-unit heroColor"><h1>Welcome <span id="firstName">' + member[0].firstName +'</span> <span id="lastName">' + member[0].lastName + '</span></h1><p>MineJobs has created a list of jobs available for you that you might find interesting!</p></div>');
		
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
		eventTrigger();	
	});
}

