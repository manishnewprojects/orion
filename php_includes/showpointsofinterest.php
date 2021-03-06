<?php
//Config Vars
include dirname(__FILE__)."/../config.php";

// Database details
include DIR_BASE."/php_includes/secretInfo.php";
$db_password = PASSWORD;  //defined in secretInfo.php
$db_server   = SERVERNAME;
$db_username = USERNAME;
$db_name     = DBNAME;


// Get parameters from URL
$center_lat = $_GET["lat"];
$center_lng = $_GET["lng"];
$radius = $_GET["radius"];
// Start XML file, create parent node
$dom = new DOMDocument("1.0");
$node = $dom->createElement("markers");
$parnode = $dom->appendChild($node);
// Opens a connection to a mysqli server


// Connect to database
  $db_connection = mysqli_connect($db_server, $db_username, $db_password, $db_name);

  if (mysqli_connect_errno()){
    $result  = 'error';
    $message = 'Failed to connect to database: ' . mysqli_connect_error();
    exit();
   }



// Search the rows in the markers table
$query = sprintf("SELECT id, name, address, lat, lng, ( 3959 * acos( cos( radians('%s') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('%s') ) + sin( radians('%s') ) * sin( radians( lat ) ) ) ) AS distance FROM markers HAVING distance < '%s' ORDER BY distance LIMIT 0 , 20",
  mysqli_real_escape_string($db_connection,$center_lat),
  mysqli_real_escape_string($db_connection,$center_lng),
  mysqli_real_escape_string($db_connection,$center_lat),
  mysqli_real_escape_string($db_connection,$radius));


 //error_log(print_r($query, TRUE), 3, '/Users/newprojects/CodeDirectories/orion/logs/lantern_guides_php_errors.log');

$result = mysqli_query($db_connection,$query);
$result = mysqli_query($db_connection,$query);
if (!$result) {
  die("Invalid query: " . mysqli_error());
}
header("Content-type: text/xml");
// Iterate through the rows, adding XML nodes for each
while ($row = @mysqli_fetch_assoc($result)){
  $node = $dom->createElement("marker");
  $newnode = $parnode->appendChild($node);
  $newnode->setAttribute("id", $row['id']);
  $newnode->setAttribute("name", $row['name']);
  $newnode->setAttribute("address", $row['address']);
  $newnode->setAttribute("lat", $row['lat']);
  $newnode->setAttribute("lng", $row['lng']);
  $newnode->setAttribute("distance", $row['distance']);
}
echo $dom->saveXML();
?>