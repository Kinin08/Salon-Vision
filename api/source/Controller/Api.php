<?php

namespace Source\Controller;

use Source\Models\User\User;
use Source\Core\JWTToken;

class Api
{
    protected $userAuthId = 0;
    public function authToken(int $typeId = 0): int|false
    {
        $header = getallheaders();
        $token = $header["token"] ?? $header['Authorization'] ?? $header['authorization'] ?? null;

        if (!$token)
            return false;

        if (str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }

        $jwt = new JWTToken();
        $jwtToken = $jwt->decode($token);

        if (!$jwtToken)
            return false;

        $id = $jwtToken->data->id;

        if ($typeId !== 0) {
            $user = new User();
            if (!$user->permissionVerify($id, $typeId))
                return false; // verifica por ID
        }

        $this->userAuthId = $id;
        return $id;
    }

    protected function call(int $code, ?string $status = null, ?string $message = null, ?string $type = null): Api
    {
        http_response_code($code);
        if (!empty($status)) {
            $this->response = [
                "code" => $code,
                "type" => $type,
                "status" => $status,
                "message" => (!empty($message) ? $message : null)
            ];
        }
        return $this;
    }

    protected function back(object|array $data = null): Api
    {
        header('Content-Type: application/json');
        if ($data) {
            $this->response["data"] = $data;
        }
        echo json_encode($this->response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $this;
    }

}