<?php

use app\fm\FM;
use app\fm\Router;

chdir(__DIR__);

include '../autoloader.php';

try {
    $fm = new FM('../storage');
    $router = Router::getInstance($_GET['r'] ?? '');

    $fm->cd(router::getPath());

    echo $fm->pwd() . '<br>' . PHP_EOL;

    foreach ($fm->ls() as &$entry) {
        if ($entry->isDir()) {
            echo '<a href="?r=' . $router::to($entry->getFileName()) . '">' . $entry->getFileName() . '</a><br>' . PHP_EOL;
        } else {
            echo $entry->getFileName() . '<br>' . PHP_EOL;
        }
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
