<?php

namespace Source\Support;

class Upload
{
    private const MAX_IMAGE_SIZE = 5242880; // 5 MB
    private const PUBLIC_DIRECTORY = '/views/assets/_common/uploads/';

    private static ?string $error = null;

    /**
     * Recebe, valida e armazena uma imagem.
     * Retorna o caminho público relativo ou false em caso de erro.
     */
    public static function image(array $file): string|false
    {
        self::$error = null;

        if (!isset($file['error'], $file['tmp_name'], $file['size'])) {
            self::$error = 'Arquivo não recebido.';
            return false;
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            self::$error = match ($file['error']) {
                UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'A imagem excede o limite permitido.',
                UPLOAD_ERR_NO_FILE => 'Nenhuma imagem foi enviada.',
                default => 'Falha ao receber a imagem.'
            };
            return false;
        }

        if (!is_uploaded_file($file['tmp_name'])) {
            self::$error = 'Upload inválido.';
            return false;
        }

        if ($file['size'] < 1 || $file['size'] > self::MAX_IMAGE_SIZE) {
            self::$error = 'A imagem deve ter até 5 MB.';
            return false;
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp'
        ];

        if (!isset($extensions[$mime]) || @getimagesize($file['tmp_name']) === false) {
            self::$error = 'Formato inválido. Envie JPG, PNG ou WEBP.';
            return false;
        }

        $projectRoot = dirname(__DIR__, 3);
        $directory = $projectRoot . self::PUBLIC_DIRECTORY;

        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            self::$error = 'Não foi possível criar a pasta de imagens.';
            return false;
        }

        $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
        $destination = $directory . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            self::$error = 'Não foi possível salvar a imagem.';
            return false;
        }

        return self::PUBLIC_DIRECTORY . $filename;
    }

    public static function error(): ?string
    {
        return self::$error;
    }

    /**
     * Remove somente arquivos dentro da pasta de uploads gerenciada pela aplicação.
     */
    public static function remove(?string $relativePath): bool
    {
        if (!$relativePath) {
            return false;
        }

        // Aceita também URLs absolutas antigas, desde que pertençam ao próprio projeto.
        if (filter_var($relativePath, FILTER_VALIDATE_URL)) {
            $base = rtrim(CONF_URL_BASE, '/');
            if (!str_starts_with($relativePath, $base . '/')) {
                return false;
            }
            $relativePath = parse_url($relativePath, PHP_URL_PATH) ?: '';
            $basePath = rtrim(parse_url($base, PHP_URL_PATH) ?: '', '/');
            if ($basePath !== '' && str_starts_with($relativePath, $basePath . '/')) {
                $relativePath = substr($relativePath, strlen($basePath));
            }
        }

        if (!str_starts_with($relativePath, self::PUBLIC_DIRECTORY)) {
            return false;
        }

        $filename = basename($relativePath);
        if ($filename === '' || $filename === '.' || $filename === '..') {
            return false;
        }

        $target = dirname(__DIR__, 3) . self::PUBLIC_DIRECTORY . $filename;

        return !is_file($target) || @unlink($target);
    }

    public static function publicUrl(?string $relativePath): ?string
    {
        if (!$relativePath) {
            return null;
        }

        $base = defined('CONF_URL_PUBLIC') ? CONF_URL_PUBLIC : CONF_URL_BASE;

        return rtrim($base, '/') . '/' . ltrim($relativePath, '/');
    }
}
