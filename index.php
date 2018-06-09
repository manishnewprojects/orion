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

<body>

 
<?php include 'php_includes/navbar.php'; ?>


 
    <div id="map"></div>
    
   <script> getLocation(); </script>

   

    

<?php include 'php_includes/footer.php'; ?>


<?php include 'php_includes/end_js.php'; ?>

</body>
</html>