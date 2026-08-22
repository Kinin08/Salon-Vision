<?php

namespace Source\Controller\Users;

use Source\Controller\Api;
use Source\Models\User\User;
use Source\Core\JWTToken;

class Users extends Api
{
    private function listByRole(?int $roleId = null): void
    {
        $user = new User();

        $filters = [];

        if ($roleId !== null) {
            $filters[] = "user_type_id = {$roleId}";
        }

        $this->call(
            200,
            "success",
            "Lista de usuários",
            "success"
        )->back($user->selectAll($filters));
    }

    public function listAll(): void
    {
        $this->listByRole();
    }

    public function listClient(): void
    {
        $this->listByRole(3);
    }

    public function listEmployee(): void
    {
        $this->listByRole(5);
    }

    public function listAdmin(): void
    {
        $this->listByRole(4);
    }

    public function register(array $data): void
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
        if (!$user->login($data['email'], $data['password'], 5)) {
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

        $user = new User();

        // Busca o usuário
        if (!$user->selectById($userId)) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado",
                "error"
            )->back();

            return;
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (isset($data["password"]) && !empty($data["password"])) {
            $user->setPassword($data["password"]);
        }

        if (isset($data["telephone"])) {
            $user->setTelephone($data["telephone"]);
        }

        if (isset($data["photo"])) {
            $user->setPhoto($data["photo"]);
        }

        if (!$user->updateById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();

            return;
        }

        if (!$user->selectById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                "Erro ao recuperar usuário atualizado",
                "error"
            )->back();

            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail(),
            "telephone" => $user->getTelephone(),
            "photo" => $user->getPhoto(),
            "userTypeId" => $user->getUserTypeId(),
            "active" => $user->getActive()
        ];

        $this->call(
            200,
            "success",
            "Usuário atualizado com sucesso",
            "success"
        )->back($response);
    }
    public function updateAdmin(array $data): void
    {
        $userId = $this->authToken(3);

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

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado",
                "error"
            )->back();

            return;
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (isset($data["password"]) && !empty($data["password"])) {
            $user->setPassword($data["password"]);
        }

        if (isset($data["telephone"])) {
            $user->setTelephone($data["telephone"]);
        }

        if (isset($data["photo"])) {
            $user->setPhoto($data["photo"]);
        }

        if (!$user->updateById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();

            return;
        }

        if (!$user->selectById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                "Erro ao recuperar usuário atualizado",
                "error"
            )->back();

            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail(),
            "telephone" => $user->getTelephone(),
            "photo" => $user->getPhoto(),
            "userTypeId" => $user->getUserTypeId(),
            "active" => $user->getActive()
        ];

        $this->call(
            200,
            "success",
            "Usuário atualizado com sucesso",
            "success"
        )->back($response);
    }
    public function updateEmployee(array $data): void
    {
        $userId = $this->authToken(5);

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

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado",
                "error"
            )->back();

            return;
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (isset($data["password"]) && !empty($data["password"])) {
            $user->setPassword($data["password"]);
        }

        if (isset($data["telephone"])) {
            $user->setTelephone($data["telephone"]);
        }

        if (isset($data["photo"])) {
            $user->setPhoto($data["photo"]);
        }

        if (!$user->updateById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();

            return;
        }

        if (!$user->selectById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                "Erro ao recuperar usuário atualizado",
                "error"
            )->back();

            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail(),
            "telephone" => $user->getTelephone(),
            "photo" => $user->getPhoto(),
            "userTypeId" => $user->getUserTypeId(),
            "active" => $user->getActive()
        ];

        $this->call(
            200,
            "success",
            "Usuário atualizado com sucesso",
            "success"
        )->back($response);
    }
    public function updateRole(array $data): void
    {
        $userId = (int) ($data["userId"] ?? 0);

        if (!$userId) {
            $this->call(
                400,
                "bad_request",
                "Informe o usuário.",
                "error"
            )->back();

            return;
        }

        $adminId = $this->authToken(3);

        if (!$adminId) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não está autenticado.",
                "error"
            )->back();

            return;
        }

        if (!isset($data["roleId"])) {
            $this->call(
                400,
                "bad_request",
                "Informe a role.",
                "error"
            )->back();

            return;
        }

        $roleId = (int) $data["roleId"];

        // Ajuste os IDs válidos conforme suas roles reais
        $validRoles = [3, 4, 5];

        if (!in_array($roleId, $validRoles, true)) {
            $this->call(
                400,
                "bad_request",
                "Role inválida.",
                "error"
            )->back();

            return;
        }

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado.",
                "error"
            )->back();

            return;
        }

        if (!$user->updateRole($userId, $roleId)) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();

            return;
        }

        $this->call(
            200,
            "success",
            "Role atualizada com sucesso.",
            "success"
        )->back();
    }
    public function softDelete(array $data): void
    {
        $userId = (int) ($data["userId"] ?? 0);

        if (!$userId) {
            $this->call(
                400,
                "bad_request",
                "Informe o usuário.",
                "error"
            )->back();

            return;
        }

        $adminId = $this->authToken(3);

        if (!$adminId) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não está autenticado.",
                "error"
            )->back();

            return;
        }

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado.",
                "error"
            )->back();

            return;
        }

        if (!$user->softDeleteById($userId)) {
            $this->call(
                500,
                "internal_server_error",
                $user->getErrorMessage(),
                "error"
            )->back();

            return;
        }

        $this->call(
            200,
            "success",
            "Usuário removido com sucesso.",
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