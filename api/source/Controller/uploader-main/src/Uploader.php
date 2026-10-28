<?php

namespace Controller\Uploader;

/*
 * Class Uploader
 * @author Fábio Santos <fabiosantos@ifsul.edu.br>
 * @package SorFabioSantos\Uploader
 * @version 1.0.9
 */
class Uploader
{
    private $message = '';

    // Raiz do projeto (Salon-Vision), 5 níveis acima de src/
    private const PROJECT_ROOT = '/../../../../..';

    public function __construct()
    {
        // IMAGE_DIR vem do Config.php: /views/assets/_common/uploads/
        $this->createDirectory(__DIR__ . self::PROJECT_ROOT . IMAGE_DIR);
        $this->createDirectory(__DIR__ . '/../../../../..' . FILE_DIR);
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    private function createDirectory($dir)
    {
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }

    private function formatSize($bytes)
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        }
        return number_format($bytes / 1024, 2) . ' KB';
    }

    public function Image($file): bool|string
    {
        if ($file['size'] > IMAGE_MAX_SIZE || $file['size'] < IMAGE_MIN_SIZE) {
            $this->message = IMAGE_SIZE_ERROR_MESSAGE;
            return false;
        }

        // Valida o tipo real do arquivo (não confia no $file['type'] do cliente)
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        $extensoes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
        ];

        if (!in_array($mime, ALLOWED_IMAGE_TYPES, true) || !isset($extensoes[$mime])) {
            $this->message = IMAGE_TYPE_ERROR_MESSAGE;
            return false;
        }

        $imageName = bin2hex(random_bytes(16)) . '.' . $extensoes[$mime];
        $target = __DIR__ . self::PROJECT_ROOT . IMAGE_DIR . $imageName;

        if (!move_uploaded_file($file['tmp_name'], $target)) {
            $this->message = IMAGE_MOVE_ERROR_MESSAGE;
            return false;
        }

        // Caminho público relativo à raiz do projeto
        return IMAGE_DIR . $imageName;
    }

    public function File($file): bool|string
    {
        if ($file['size'] > FILE_MAX_SIZE || $file['size'] < FILE_MIN_SIZE) {
            $this->message = FILE_SIZE_ERROR_MESSAGE;
            return false;
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!in_array($mime, ALLOWED_FILE_TYPES, true)) {
            $this->message = FILE_TYPE_ERROR_MESSAGE;
            return false;
        }

        $fileName = bin2hex(random_bytes(16)) . '.pdf';
        $target = '/../../../..' . FILE_DIR . '/' . $fileName;

        if (!move_uploaded_file($file['tmp_name'], __DIR__ . $target)) {
            $this->message = FILE_MOVE_ERROR_MESSAGE;
            return false;
        }

        return FILE_DIR . '/' . $fileName;
    }
}