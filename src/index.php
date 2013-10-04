<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>mineJobs - Jobs that are mine!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="../assets/css/bootstrap.css" rel="stylesheet">
	<link href="../assets/css/mineJobs.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
		background-color: #000000;
		background-image:url('http://representuw.com/MineJobs/assets/img/Chalkboard.jpg');
		background-size: 100%;
      }
      .sidebar-nav {
        padding: 9px 0;
      }
    </style>
    <link href="../assets/css/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
                    <link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">
                                   <link rel="shortcut icon" href="../assets/ico/favicon.png">
  </head>

  <body>
  
	<div id="welcome" class="show <!-- Change to show on launch for homescreen -->">
		<div class="container-narrow">

		  <div class="masthead textCenter">
			<h3 class="muted">mineJobs - Jobs that are mine!</h3>
		  </div>

		  <hr>

		  <div class="jumbotron textCenter">
			<h1>Let us work for You!</h1>
			<p class="lead reduceWidth">Have you ever wanted a tailored job search made for you? Log in to Linkedin today and let us find jobs that will interest you.</p>
			<script type="IN/Login"></script>
		  </div>

		  <hr>

		  <div class="footer">
			<p>&copy; mineJobs 2013</p>
		  </div>

		</div> <!-- /container -->	
	</div> <!--welcome-->

	<div id="homepage" class="hide <!-- Change to hide on launch for homescreen -->">
		<div class="navbar navbar-inverse navbar-fixed-top">
		  <div class="navbar-inner">
			<div class="container-fluid navbarColor">
			  <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			  </a>
			  <a class="brand" href="#">mineJobs</a>
			  <div class="nav-collapse collapse">
				<p class="navbar-text pull-right">
				  <button onClick="IN.User.logout(changePage('#homepage', '#welcome'));">Sign Out</button>
				</p>
				<ul class="nav">
				  <!--<li><a href="#about">About</a></li>
				  <li><a href="#contact">FAQs</a></li>-->
				</ul>
			  </div><!--/.nav-collapse -->
			</div>
		  </div>
		</div>

		<div class="container-fluid">
		  <div class="row-fluid">
			<div class="span3 leftMenu"> <!-- added fixed left sidebar -->
			  <div class="well sidebar-nav sidebarColor">
				<ul id="leftMenu" class="nav nav-list">
				</ul>
			  </div><!--/.well -->
			</div><!--/span-->
			<div id="mainContainer" class="span9 mainCon"> <!-- to make the fixed left sidebar work -->
			</div><!--/span-->
		  </div><!--/row-->

		</div><!--/.fluid-container-->
		<footer class="footerPlacement">
			<p>&copy; mineJobs 2013</p>
		</footer>
	</div> <!--homepage-->
 
	<!-- Modal -->
	<div id="myModal" class="modal fade modalColor" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	</div>
	
	<div id="loadingModal" class="modal fade loadingMod">
		<img class="loadingImg" src="../assets/img/loading.gif">
	</div>

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="../assets/js/jquery.js"></script>
    <script src="../assets/js/bootstrap-transition.js"></script>
    <script src="../assets/js/bootstrap-alert.js"></script>
    <script src="../assets/js/bootstrap-modal.js"></script>
    <script src="../assets/js/bootstrap-dropdown.js"></script>
    <script src="../assets/js/bootstrap-scrollspy.js"></script>
    <script src="../assets/js/bootstrap-tab.js"></script>
    <script src="../assets/js/bootstrap-tooltip.js"></script>
    <script src="../assets/js/bootstrap-popover.js"></script>
    <script src="../assets/js/bootstrap-button.js"></script>
    <script src="../assets/js/bootstrap-collapse.js"></script>
    <script src="../assets/js/bootstrap-carousel.js"></script>
    <script src="../assets/js/bootstrap-typeahead.js"></script>
	<script src="../assets/js/events.js"></script>
	<script src="../assets/js/createModal.js"></script>
	<script src="../assets/js/displayProfile.js"></script>
	
	<!-- Linkedin Login -->
	<script type="text/javascript" src="http://platform.linkedin.com/in.js">
	  <!--api_key: 8y5h8iu6v2cx-->
	  api_key: ugu6bykal5zs
	  onLoad: onLinkedInLoad
	  authorize: true
	  scope: r_fullprofile
	</script>
	
	<!-- Linkedin Authentication Script -->
	<script type="text/javascript">
	  // 2. Runs when the JavaScript framework is loaded
	  function onLinkedInLoad() {
		IN.Event.on(IN, "auth", onLinkedInAuth);
	  }

	  // 2. Runs when the viewer has authenticated
	  function onLinkedInAuth() {
		IN.API.Profile("me").fields(["firstName","lastName","headline","summary","location","educations","skills","id","industry","pictureUrl","specialties","positions","interests","languages","certifications"]).result(displayProfiles);
	  }
	</script>
	
	<!-- Linkedin Framework -->
	<script type="text/javascript" src="http://platform.linkedin.com/userspace.js"></script>
	<script type="text/javascript" src="http://platform.linkedin.com/framework.js"></script>
  
  </body>
</html>
