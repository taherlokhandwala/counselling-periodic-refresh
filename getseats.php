<?php
    header("Content-Type:application/json");
    $seats = file_get_contents('./seats.json');
    usleep(100); //Kept very small because server is responding fast.Increase to see exponetial fallback in action.
    echo $seats;
?>