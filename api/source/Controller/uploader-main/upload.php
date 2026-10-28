<?php

use Controller\Uploader\Uploader;

// Nunca imprimir erros do PHP em HTML: sempre responder JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

set_error_handler(function ($no, $msg, $arquivo, $linha) {
    throw new ErrorException($msg, 0, $no, $arquivo, $linha);
});

set_exception_handler(function ($e) {
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro interno: ' . $e->getMessage()]);
});

register_shutdown_function(function () {
    $erro = error_get_last();
    if ($erro && in_array($erro['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
        }
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro fatal: ' . $erro['message']]);
    }
});

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

function responder(int $status, array $dados): void
{
    http_response_code($status);
    echo json_encode($dados);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, ['success' => false, 'error' => 'Método não permitido.']);
}

if (!isset($_FILES['arquivo'])) {
    responder(400, ['success' => false, 'error' => 'Nenhuma imagem foi enviada.']);
}

if ($_FILES['arquivo']['error'] !== UPLOAD_ERR_OK) {
    responder(400, ['success' => false, 'error' => 'Erro ao receber a imagem.']);
}

require_once __DIR__ . '/src/Config.php';
require_once __DIR__ . '/src/Uploader.php';

$uploader = new Uploader();
$caminho = $uploader->Image($_FILES['arquivo']);

if ($caminho === false) {
    responder(400, ['success' => false, 'error' => $uploader->getMessage()]);
}

// Monta a URL completa a partir da raiz do projeto (Salon-Vision),
// 5 níveis acima de upload.php: uploader-main > Controller > source > Api > Salon-Vision
$esquema = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base = rtrim(dirname($_SERVER['SCRIPT_NAME'], 5), '/\\');
$url = $esquema . '://' . $_SERVER['HTTP_HOST'] . $base . $caminho;

responder(200, [
    'success' => true,
    'message' => 'Upload realizado com sucesso.',
    'path' => $caminho,
    'url' => $url
]);