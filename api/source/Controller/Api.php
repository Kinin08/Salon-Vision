<?php

namespace Source\Controller;

use Source\Models\User\User;
use Source\Core\JWTToken;

class Api
{

    protected int $userAuthId = 0;

    public function authToken(int $typeId): bool
    {
        $header = getallheaders();

        $token = $header["token"]
            ?? $header['Authorization']
            ?? $header['authorization']
            ?? null;

        if (!$token) {
            return false;
        }

        if (str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }

        $jwt = new JWTToken();
        $jwtToken = $jwt->decode($token);

        if (!$jwtToken) {
            return false;
        }

        $user = new User();

        // aqui você usa o ID (não email)
        if (!$user->permissionVerify($jwtToken->data->id, $typeId)) {
            return false;
        }

        // guarda o ID para uso depois no controller
        $this->userAuthId = $jwtToken->data->id;

        return true;
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