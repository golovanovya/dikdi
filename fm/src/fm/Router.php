<?php

namespace app\fm;

class Router
{
    protected static $instance;
    protected static $path;

    /**
     * Returns an instance of this Singleton
     * @return Router
     */
    public static function getInstance(string $path = '')
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        self::$path = $path;
        
        return self::$instance;
    }

    private function __construct()
    {
    }

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }
    
    /**
     * Undocumented function
     *
     * @param string $route
     * @return void
     */
    public static function to($route)
    {
        if (empty(self::$path)) {
            return $route;
        }
        return self::$path . '/' . $route;
    }
    
    /**
     * Undocumented function
     *
     * @return void
     */
    public static function getPath()
    {
        return self::$path;
    }
}
