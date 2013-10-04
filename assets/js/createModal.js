function createModal(_this) {

	var name = _this.name;
	var matches = $("#"+_this.id).data("matches");
	var title = $("#"+_this.id).attr("data-title");
	//var desc = $("#"+_this.id).attr("data-desc");
	var desc = $("#"+_this.id).data("test");
	var matches = $("#"+_this.id).data("matches");

	$("#myModal").html(" ");
	$("#myModal").append('<div class="modal-header"><button type="button" class="close" style="color:#FFFFFF;" data-dismiss="modal" aria-hidden="true">x</button><h3 id="myModalLabel">' + name + " - " + title + '</h3></div>');
	$("#myModal").append('<div class="modal-body modalFont"><p>' + desc + '</p></div>');
	$("#myModal").append('<div class="modalKeywords"><ul id="modalList" class="modalList"></ul></div>');
	$("#modalList").append('<li class="nav-header colorBlack">Keywords</li>');
	for(i=0;i<matches.length;i++) {
		$("#modalList").append('<li>' + matches[i] + '</li>');
	}
	$("#myModal").append('<div class="modal-footer modalFooterColor"><button class="btn" data-dismiss="modal" aria-hidden="true">Close</button></div>');		
	
	$("#myModal").modal('show');  
}