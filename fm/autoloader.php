<?php

spl_autoload_register(function ($className) {
    $path = strtr($className, ['app' => 'src']) . '.php';
    require $path;
});
