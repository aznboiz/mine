<?php include "simple_html_dom.php"; ?>
<?php

//Get keywords from DB

	// mysql hostname
	$db_host = "localhost";

	// database name
	$db_name = "nutonu_MineJobs";

	// database user name
	$db_user = "nutonu_sisun";

	// database password
	$db_pass = "admin101";
	
mysql_connect($db_host, $db_user, $db_pass) or die(mysql_error());
mysql_select_db($db_name) or die(mysql_error());
$keywordsDB = mysql_query("SELECT * FROM keywords") or die(mysql_error()); 

//Grab keyword dictionary
$keywords = array();
for($i=0;$i<940;$i++) {
	$keywords[$i] = mysql_result($keywordsDB, $i);
	$keywords[$i] = strtolower($keywords[$i]);
}

//Clean json
//Full member profile
$json = preg_replace('/[^(\x20-\x7F)]*/','', $_POST['member']);
$json = strtr($json, "~", "1");
$json = stripslashes($json);
$member = json_decode($json);

//Refined Skills
$jsonSkills = $_POST['refineSkills'];

//Refined Experience
$jsonExp = $_POST['refineExp'];

//Get mataches
$matchedKeywords = array();

//Parse summary
if(array_key_exists('summary',$member[0])) {
	for($i=0;$i<sizeof($keywords);$i++) {
		if (preg_match_all("/\b$keywords[$i]\b/i", $member[0]->summary, $matches)){												//Summary
			$count = count($matches[0]);
			foreach ($matches as $val) {
				$matchedKeywords[count($matchedKeywords)] = array(
					"keyword" => strtolower($val[0]),
					"section" => "Summary",
					"frequency" => intval($count),
					"value" => 3,
				);
			}
		}
	}
}

//Parse skills
if(array_key_exists('skills',$member[0])) {
	foreach($member[0]->skills->values as $value) {
		foreach($jsonSkills as $jsonVal) {
			if($value->skill->name == $jsonVal[skill] && $jsonVal[check] == "true") {
				for($i=0;$i<sizeof($keywords);$i++) {
					if (preg_match_all("/\b$keywords[$i]\b/i", $value->skill->name, $matches)){												//Skills
						$count = count($matches[0]);
						foreach ($matches as $val) {
							$matchedKeywords[count($matchedKeywords)] = array(
							"keyword" => strtolower($val[0]),
							"section" => "Company",
							"frequency" => intval($count),
							"value" => intval($jsonVal[val]),
							);
						}
					}
				}
			}
		}
	}
}

//Parse experience
if(array_key_exists('positions',$member[0])) {
	$memberPositions = $member[0]->positions->values;
	foreach($memberPositions as $value) {
		foreach($jsonExp as $jsonVal) {
			if($value->company->name == $jsonVal[exp] && $jsonVal[check] == "true") {
				if(array_key_exists('company',$value)) {
					for($i=0;$i<sizeof($keywords);$i++) {
						if (preg_match_all("/\b$keywords[$i]\b/i", $value->company->name, $matches)){								//Company
							$count = count($matches[0]);
							foreach ($matches as $val) {
								$matchedKeywords[count($matchedKeywords)] = array(
									"keyword" => strtolower($val[0]),
									"section" => "Company",
									"frequency" => intval($count),
									"value" => 3,
								);
							}
						}
					}
				}
				if(array_key_exists('title',$value)) {																			//PositionTitle
					for($i=0;$i<sizeof($keywords);$i++) {
						if (preg_match_all("/\b$keywords[$i]\b/i", $value->title, $matches)){
							$count = count($matches[0]);
							foreach ($matches as $val) {
								$matchedKeywords[count($matchedKeywords)] = array(
									"keyword" => strtolower($val[0]),
									"section" => "PositionTitle",
									"frequency" => intval($count),
									"value" => 3,
								);
							}
						}
					}
				}
				if(array_key_exists('summary',$value)) {																		//PositionExperience			
					for($i=0;$i<sizeof($keywords);$i++) {
						if (preg_match_all("/\b$keywords[$i]\b/i", $value->summary, $matches)){
							$count = count($matches[0]);
							foreach ($matches as $val) {
								$matchedKeywords[count($matchedKeywords)] = array(
									"keyword" => strtolower($val[0]),
									"section" => "PositionExperience",
									"frequency" => intval($count),
									"value" => 3,
								);
							}
						}
					}
				}				
			}
		}
	}
}

$words = array();
foreach($matchedKeywords as $key){
	array_push($words,$key[keyword]);
}
$matches = "'". implode("', '", $words) ."'";

$matched = array();
$match_query = mysql_query("SELECT id, keyword, SUM(count) AS frequency FROM keyword_postings WHERE keyword IN ($matches) GROUP BY id, keyword") or die(mysql_error());

while($info = mysql_fetch_assoc($match_query)) {
	$matched[$info[id]][score] = $matched[$info[id]][score] + $info[frequency]*0.1+1;
	if (!(in_array($info[keyword], $matched[$info[id]][words]))) {
		$matched[$info[id]][words][count($matched[$info[id]][words])] = $info[keyword];
	}
	$matched[$info[id]][id] = $info[id];
	
	foreach($matchedKeywords as $linked){
		if ($info[keyword] == $linked[keyword]){
			
			$loc = 1;
			if ($linked[section] = "Summary") { $loc = 1.1; }
			if ($linked[section] = "Skills") { $loc = 1.5; }
			if ($linked[section] = "Company") { $loc = 1; }
			if ($linked[section] = "PositionTitle") { $loc = 2; }
			if ($linked[section] = "PositionExperience") { $loc = 1; }
		
			$score = $linked[value] * ($linked[frequency]*0.1+1) * $loc; 
			$matched[$info[id]][score] = $matched[$info[id]][score] + $score;
		}
	}
}

$count = count($matched);
for ($i=0;$i<$count-1;$i++){
	for($j=0;$j<$count-$i;$j++){
		if($matched[$j + 1][score] < $matched[$j][score]) {
			$tmp = $matched[$j + 1];
			$matched[$j + 1] = $matched[$j];
			$matched[$j] = $tmp;
		}
	}
}
$matched = array_reverse($matched);

$top_matches = array();
$count = 0;
foreach($matched as $key){
	if ($key[words] != NULL){
		$top_matches[count($top_matches)] = $key;
	}
}

$new_list = array();
if (count($top_matches) > 90){
	for($i=0;$i<90;$i++){
		$new_list[count($new_list)] = $top_matches[$i];
	}
	$top_matches = $new_list;
}
//echo var_dump($top_matches);

//OLD ALGO--------------------------------------------------------------------------------------------------------------------------------------------------------
/*
$words = array();
foreach($matchedKeywords as $key){
	array_push($words,$key[keyword]);
}

$matches = "'". implode("', '", $words) ."'";
$match_query = mysql_query("SELECT id, COUNT(id) as score FROM keyword_postings WHERE keyword IN ($matches) GROUP BY id ORDER BY score DESC LIMIT 50") or die(mysql_error());

$top_matches = array(); //Get top 50 job IDs
while($info = mysql_fetch_assoc($match_query)) {
	array_push($top_matches,$info[id]);
}
*/
//------------------------------------------------------------------------------------------------------------------------------------------------------------------

$arr = array();
$arr2 = array();
foreach ($top_matches as $top){
	$jobDetails = mysql_query("SELECT * FROM full_postings WHERE id = $top[id]") or die(mysql_error());
	while ($row = mysql_fetch_assoc($jobDetails)) {
	
		$row[name] = str_replace(chr(149), '-', $row[name]);
		$row[title] = str_replace(chr(149), '-', $row[title]);
		$row[location] = str_replace(chr(149), '-', $row[location]);
		$row[id] = str_replace(chr(149), '-', $row[id]);
		$row[skills] = str_replace(chr(149), '-', $row[skills]);
		
		for($j=0;$j<sizeof($top[words]);$j++) {
			$arr2[$top[id]][count($arr2[$top[id]])] = $top[words][$j];
		}
		
		$arr[count($arr)] = array(
			"employer" => $row[name],
			"jobTitle" => $row[title],
			"location" => $row[location],
			"jobID" => $row[id],
			"desc" => $row[description],
			"skills" => $row[skills],	
			"rank" => $top[score],
			"matches"=> $arr2[$top[id]],
		);
	}
}
echo json_encode($arr);
?>