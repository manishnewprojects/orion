<!DOCTYPE html>

<html lang="en">

 
<head>

<?php
//Config Vars
include dirname(__FILE__)."/../config.php";
?>

<?php include INCL_HEADER; ?>


</head>

<!-- Primary Page Layout -->

 <script type="text/javascript"> var place = GetURLParameter('place');</script>
 <body onload="initMap_places(place)">

<?php include INCL_NAVIGATION; ?>

 
 
<div id="map_canvas" class="container" style="width: 100%; height: 90%">
    <div id="map_places" style="width: 100%; height: 90%"></div>
</div>

 
    
<?php include INCL_FOOTER; ?>

<?php include INCL_END; ?>


</body>
</html>