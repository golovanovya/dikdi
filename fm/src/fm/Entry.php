<?php

namespace app\fm;

/**
 * File entry
 */
class Entry
{
    private $fileName;
    private $isDir;
    
    public function __construct($fileName, $isDir)
    {
        $this->fileName = $fileName;
        $this->isDir = $isDir;
    }

    public function getFileName()
    {
        return $this->fileName;
    }

    public function isDir()
    {
        return $this->isDir;
    }
}
