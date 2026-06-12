<?php

namespace Source\Controller\Users;

use Source\Controller\Api;
use Source\Models\User\User;
use Source\Core\JWTToken;

class Users extends Api
{
    public function listAll(): void
    {
        $user = new User();

        $this->call(
            200,
            "success",
            "Lista de FAQs",
            "success"
        )->back($user->selectAll());
    }
    public function register(array $data): void
    {
        var_dump($data);
        if (!isset($data['password']) || empty($data['password'])) {
            $this->call(
                400,
                "bad_request",
                "A senha é obrigatória.",
                "error"
            )->back();
            return;
        }

        if (!$this->validateNameEmail($data)) {
            $this->call(
                400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
                "error"
            )->back();
            return;
        }
        if (strlen($data["password"]) < 6 || strlen($data["password"]) > 20) {
            $this->call(
                400,
                "error",
                "Senha deve ter entre 6 e 20 caracter",
                "error"
            )->back();
            return;
        }

        $user = new User(
            null,
            $data['name'],
            $data['email'],
            $data['password'],
            $data['telephone'] ?? null,
            $data['photo'] ?? null,
            4
        );

        if (!$user->insert()) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail()
        ];

        $this->call(201, "success", "Usuário inserido com sucesso", "created")->back($response);
    }
    public function registerAdmin(array $data): void
    {
        if (!isset($data['password']) || empty($data['password'])) {
            $this->call(
                400,
                "bad_request",
                "A senha é obrigatória.",
                "error"
            )->back();
            return;
        }

        if (!$this->validateNameEmail($data)) {
            $this->call(
                400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
                "error"
            )->back();
            return;
        }
        if (strlen($data["password"]) < 6 || strlen($data["password"]) > 20) {
            $this->call(
                400,
                "error",
                "Senha deve ter entre 6 e 20 caracter",
                "error"
            )->back();
            return;
        }
        $user = new User(
            null,
            $data['name'],
            $data['email'],
            $data['password'],
            $data['telephone'] ?? null,
            $data['photo'] ?? null,
            3
        );

        if (!$user->insert()) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail()
        ];

        $this->call(
            201,
            "success",
            "Administrador inserido com sucesso",
            "created"
        )->back($response);
    }
    public function registerEmployee(array $data): void
    {
        if (!isset($data['password']) || empty($data['password'])) {
            $this->call(
                400,
                "bad_request",
                "A senha é obrigatória.",
                "error"
            )->back();
            return;
        }

        if (!$this->validateNameEmail($data)) {
            $this->call(
                400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
                "error"
            )->back();
            return;
        }
        if (strlen($data["password"]) < 6 || strlen($data["password"]) > 20) {
            $this->call(
                400,
                "error",
                "Senha deve ter entre 6 e 20 caracter",
                "error"
            )->back();
            return;
        }
        $user = new User(
            null,
            $data['name'],
            $data['email'],
            $data['password'],
            $data['telephone'] ?? null,
            $data['photo'] ?? null,
            5
        );

        if (!$user->insert()) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail()
        ];

        $this->call(
            201,
            "success",
            "Funcionario inserido com sucesso",
            "created"
        )->back($response);
    }
    public function login(array $data): void
    {
        if (
            !isset($data['email'], $data['password']) ||
            empty($data['email']) || empty($data['password']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(
                400,
                "bad_request",
                "E-mail e senha são obrigatórios. O e-mail deve ser válido.",
                "error"
            )->back();
            return;
        }

        $user = new User();
        if (!$user->login($data['email'], $data['password'])) {
            $this->call(
                401,
                "unauthorized",
                $user->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "photo" => $user->getPhoto(),
            "userType" => $user->getUserTypeName(),
            "token" => $user->getToken(),
        ];

        $this->call(
            200,
            "success",
            "Usuário logado com sucesso",
            "success"
        )->back($response);
    }
    public function loginAdmin(array $data): void
    {
        if (
            !isset($data['email'], $data['password']) ||
            empty($data['email']) || empty($data['password']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(
                400,
                "bad_request",
                "E-mail e senha são obrigatórios. O e-mail deve ser válido.",
                "error"
            )->back();
            return;
        }

        $user = new User();
        if (!$user->login($data['email'], $data['password'], 3)) {
            $this->call(
                401,
                "unauthorized",
                $user->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "photo" => $user->getPhoto(),
            "token" => $user->getToken(),
        ];

        $this->call(
            200,
            "success",
            "Usuário logado com sucesso",
            "success"
        )->back($response);
    }
    public function loginEmployee(array $data): void
    {
        if (
            !isset($data['email'], $data['password']) ||
            empty($data['email']) || empty($data['password']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(
                400,
                "bad_request",
                "E-mail e senha são obrigatórios. O e-mail deve ser válido.",
                "error"
            )->back();
            return;
        }

        $user = new User();
        if (!$user->login($data['email'], $data['password'])) {
            $this->call(
                401,
                "unauthorized",
                $user->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "photo" => $user->getPhoto(),
            "userType" => $user->getUserTypeName(),
            "token" => $user->getToken(),
        ];

        $this->call(
            200,
            "success",
            "Usuário logado com sucesso",
            "success"
        )->back($response);
    }
    public function update(array $data): void
    {
        $userId = $this->authToken(4);
        if (!$userId) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não está autenticado (sem token ou token inválido).",
                "error"
            )->back();
            return;
        }

        if (empty($data["name"]) || empty($data["email"])) {
            $this->call(
                400,
                "bad_request",
                "Os campos name e email são obrigatórios",
                "error"
            )->back();
            return;
        }

        $checkUser = new User();
        if (!$checkUser->selectById($userId)) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado",
                "error"
            )->back();
            return;
        }

        $user = new User(
            $userId,
            $data["name"],
            $data["email"],
            $data["password"] ?? null,
            $data["telephone"] ?? null,
            $data["photo"] ?? null,
            4
        );

        if (!$user->updateById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $userUpdated = new User();
        if (!$userUpdated->selectById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                "Erro ao recuperar usuário atualizado",
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $userUpdated->getId(),
            "name" => $userUpdated->getName(),
            "email" => $userUpdated->getEmail(),
            "telephone" => $userUpdated->getTelephone(),
            "photo" => $userUpdated->getPhoto(),
            "userTypeId" => $userUpdated->getUserTypeId(),
            "active" => $userUpdated->getActive()
        ];

        $this->call(200, "success", "Usuário atualizado com sucesso", "success")->back($response);
    }
    public function updateAdmin(array $data): void
    {
        if (!$this->authToken(1)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não está autenticado (sem token ou token inválido).",
                "error"
            )->back();
            return;
        }

        if (!$this->validateNameEmail($data)) {
            $this->call(
                400,
                "bad_request",
                "Nome e email são obrigatórios e devem ser válidos.",
                "error"
            )->back();
            return;
        }

        $tokenData = $this->getTokenData();
        $adminId = $tokenData->id ?? null;

        if (!$adminId) {
            $this->call(
                401,
                "unauthorized",
                "Token inválido: não foi possível identificar o usuário.",
                "error"
            )->back();
            return;
        }

        $user = new User();

        if (!$user->selectById($adminId)) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado.",
                "error"
            )->back();
            return;
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (!$user->updateById($adminId)) {
            $this->call(
                500,
                "update_error",
                $user->getErrorMessage() ?? "Erro ao atualizar usuário.",
                "error"
            )->back();
            return;
        }

        $this->call(
            200,
            "success",
            "Usuário atualizado com sucesso",
            "success"
        )->back();
    }
    private function validateNameEmail(array $data): bool
    {
        if (
            !isset($data["name"], $data["email"]) ||
            empty($data["name"]) || empty($data["email"]) ||
            !filter_var($data["email"], FILTER_VALIDATE_EMAIL)
        ) {
            return false;
        }
        return true;
    }
}