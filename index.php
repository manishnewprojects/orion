<!-- Copyright (C) 2018, LanternTavels.com -->

<!DOCTYPE html>

<html lang="en">
 
<head>

<?php include 'php_includes/header.php'; ?>


<style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
         height: 75%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
         
      }
</style>

 

</head>


<!-- Primary Page Layout -->


 
<?php include 'php_includes/navbar.php'; ?>

<body>

    <!-- WORKS
    <div id="map"></div>
   <script> getLocation(); </script>
   -->
 <body style="margin:0px; padding:0px;" onload="initMap()">
  
    <div>
         <label for="raddressInput">Search location:</label>
         <input type="text" id="addressInput" size="15"/>
        <label for="radiusSelect">Radius:</label>
        <select id="radiusSelect" label="Radius">
          <option value="50" selected>50 kms</option>
          <option value="30">30 kms</option>
          <option value="20">20 kms</option>
          <option value="10">10 kms</option>
        </select>

        <input type="button" id="searchButton" value="Search"/>
    </div>
    <div><select id="locationSelect" style="width: 10%; visibility: hidden"></select></div>
    <div id="map" style="width: 100%; height: 90%"></div>
    

<?php include 'php_includes/footer.php'; ?>


<?php include 'php_includes/end_js.php'; ?>

</body>
</html>