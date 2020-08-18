<?php

namespace app\fm;

use Exception;

include 'Entry.php';

/**
 * File manager
 * @property array $allowedFiles
 * @property string $root
 * @property string $path
 */
class FM
{
    
    private $allowedFiles;
    
    private $root;
    
    private $path = '/';
    
    public function __construct(string $root = ".", array $allowedFiles = ['png', 'jpg'])
    {
        if (!is_dir($root)) {
            throw new Exception("$root должен быть директорией");
        }
        $this->root = realpath($root);
        $this->allowedFiles = $allowedFiles;
    }
    
    /**
     * Get current path
     *
     * @return string
     */
    public function pwd()
    {
        return $this->path;
    }
    
    /**
     * List files
     *
     * @return array
     */
    public function ls()
    {
        if (!is_dir($this->getFullPath())) {
            throw new Exception($this->getFullPath($this->path) . ' не является директорией');
        }
        $directory = dir($this->getFullPath());
        $entries = [];
        while (($entry = $directory->read()) !== false) {
            if ($this->skip($entry)) {
                continue;
            }
            $entries[] = new Entry($entry, is_dir($this->getFullPath($entry)));
        }
        $directory->close();
        return $entries;
    }
    
    /**
     * Change directory
     *
     * @param string $path
     * @return void
     */
    public function cd($path)
    {
        $this->path = $this->getNewPath($path);
    }
    
    /**
     * Show full real path
     *
     * @param string $path
     * @return string
     */
    public function getFullPath($path = null)
    {
        return realpath($this->root . DIRECTORY_SEPARATOR . $this->path . DIRECTORY_SEPARATOR . $path);
    }
    
    private function getNewPath($path)
    {
        $newFullPath = $this->getFullPath($path);
        if (!file_exists($newFullPath)) {
            throw new Exception($newFullPath . ' не существует');
        } elseif (!is_dir($newFullPath)) {
            throw new Exception($newFullPath . ' не является директорией');
        }
        $rootLength = mb_strlen($this->root);
        if (
            $rootLength > mb_strlen($newFullPath) ||
            mb_substr($newFullPath, 0, $rootLength) !== $this->root
        ) {
            throw new Exception('Неверно указан путь ' . $path);
        }
        return DIRECTORY_SEPARATOR . $path;
    }
    
    /**
     * Skip not allowed files
     *
     * @param string $entry
     * @return bool
     */
    private function skip($path)
    {
        if ($path === '.') {
            return true;
        }
        $fullPath = $this->getFullPath($path);
        $pathParts = pathinfo($fullPath);
        if ($path === '..' && $this->getFullPath() === $this->root) {
            return true;
        }
        if (
            is_dir($fullPath) === false
            && !in_array($pathParts['extension'], $this->allowedFiles)
        ) {
            return true;
        }
        return false;
    }
}
