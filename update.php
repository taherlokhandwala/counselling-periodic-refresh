<?php 
    extract($_GET);
    $json = file_get_contents("./seats.json");
    $seats = json_decode($json,true);
    $seats["$branch"] -= 1;
    $fp = fopen('seats.json', 'w');
    fwrite($fp, json_encode($seats));
    fclose($fp);
    echo "Updated";
?>