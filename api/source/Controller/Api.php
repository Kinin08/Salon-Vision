<?php

namespace Source\Controller;

use Source\Models\User\User;
use Source\Core\JWTToken;

class Api
{
    public function authToken(?int $typeId = null): ?int
    {
        $headers = getallheaders();

        $authorization = $headers['Authorization'] ?? null;

        if (!$authorization) {
            return null;
        }

        $token = str_replace('Bearer ', '', $authorization);

        if (!$token) {
            return null;
        }

        $jwt = new JWTToken();

        $jwtToken = $jwt->decode($token);

        if (!$jwtToken) {
            return null;
        }

        $userId = (int) $jwtToken->data->id;

        if (!$userId) {
            return null;
        }

        if ($typeId !== null) {
            $user = new User();

            if (
                !$user->permissionVerify(
                    $userId,
                    $typeId
                )
            ) {
                return null;
            }
        }

        return (int) $jwtToken->data->id;
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