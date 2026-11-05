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

        $filters = ["active = 1"];

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
        $this->listByRole(4);
    }

    public function listEmployee(): void
    {
        $this->listByRole(5);
    }

    public function listAdmin(): void
    {
        $this->listByRole(3);
    }

    public function listById(array $data): void
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
            "Usuário encontrado com sucesso.",
            "success"
        )->back($response);
    }
    public function Me(): void
    {
        $userId = $this->authToken();

        if (!$userId) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();

            return;
        }

        $user = new User();

        $userData = $user->findById($userId);

        if (!$userData) {
            $this->call(
                404,
                "not_found",
                "Usuário não encontrado",
                "error"
            )->back();

            return;
        }

        $this->call(
            200,
            "success",
            "Usuário encontrado com sucesso.",
            "success"
        )->back($userData);
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
                "Senha deve ter entre 6 e 20 caracteres.",
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
            "Usuário administrador inserido com sucesso",
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
        if (!$user->login($data['email'], $data['password'])) {
            $this->call(
                401,
                "unauthorized",
                $user->getErrorMessage(),
                "error"
            )->back();
            return;
        }
        if ($user->getUserTypeId() !== 3) {
            $this->call(
                403,
                "forbidden",
                "Este usuário não é um administrador.",
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
        if ($user->getUserTypeId() !== 5) {
            $this->call(
                403,
                "forbidden",
                "Este usuário não é um administrador.",
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

        if (
            empty($data["name"]) ||
            empty($data["email"]) ||
            !filter_var($data["email"], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(
                400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
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

        $currentPassword = $data["currentPassword"] ?? null;
        $newPassword = $data["password"] ?? null;

        if ($newPassword !== null && !empty($newPassword)) {
            if (empty($currentPassword)) {
                $this->call(
                    400,
                    "bad_request",
                    "Digite sua senha atual.",
                    "error"
                )->back();
                return;
            }

            if (!$user->verifyPassword($userId, $currentPassword)) {
                $this->call(
                    400,
                    "invalid_password",
                    "A senha atual está incorreta.",
                    "error"
                )->back();
                return;
            }

            $user->setPassword(
                password_hash($newPassword, PASSWORD_DEFAULT)
            );
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (isset($data["telephone"])) {
            $user->setTelephone($data["telephone"]);
        }

        if (isset($data["photo"])) {
            $user->setPhoto($data["photo"]);
        }
        $telephone = $data["telephone"] ?? null;

        if ($telephone !== null && !preg_match('/^\d{10,11}$/', $telephone)) {
            $this->call(
                400,
                "bad_request",
                "O telefone deve conter apenas números e ter 10 ou 11 dígitos.",
                "error"
            )->back();
            return;
        }

        if (!$user->updateById($userId)) {
            $errorMessage = $user->getErrorMessage();

            if (
                str_contains($errorMessage, "Duplicate entry") &&
                str_contains($errorMessage, "users.email")
            ) {

                $this->call(
                    400,
                    "email_already_exists",
                    "Este e-mail já está cadastrado.",
                    "error"
                )->back();

                return;
            }

            $this->call(
                500,
                "internal_server_error",
                "Não foi possível atualizar o usuário.",
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

        if (
            empty($data["name"]) ||
            empty($data["email"]) ||
            !filter_var($data["email"], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(
                400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
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

        $currentPassword = $data["currentPassword"] ?? null;
        $newPassword = $data["password"] ?? null;

        if ($newPassword !== null && !empty($newPassword)) {
            if (empty($currentPassword)) {
                $this->call(
                    400,
                    "bad_request",
                    "Digite sua senha atual.",
                    "error"
                )->back();
                return;
            }

            if (!$user->verifyPassword($userId, $currentPassword)) {
                $this->call(
                    400,
                    "invalid_password",
                    "A senha atual está incorreta.",
                    "error"
                )->back();
                return;
            }

            $user->setPassword(
                password_hash($newPassword, PASSWORD_DEFAULT)
            );
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (isset($data["telephone"])) {
            $user->setTelephone($data["telephone"]);
        }

        if (isset($data["photo"])) {
            $user->setPhoto($data["photo"]);
        }
        $telephone = $data["telephone"] ?? null;

        if ($telephone !== null && !preg_match('/^\d{10,11}$/', $telephone)) {
            $this->call(
                400,
                "bad_request",
                "O telefone deve conter apenas números e ter 10 ou 11 dígitos.",
                "error"
            )->back();
            return;
        }

        if (!$user->updateById($userId)) {
            $errorMessage = $user->getErrorMessage();

            if (
                str_contains($errorMessage, "Duplicate entry") &&
                str_contains($errorMessage, "users.email")
            ) {

                $this->call(
                    400,
                    "email_already_exists",
                    "Este e-mail já está cadastrado.",
                    "error"
                )->back();

                return;
            }

            $this->call(
                500,
                "internal_server_error",
                "Não foi possível atualizar o usuário.",
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

        if (
            empty($data["name"]) ||
            empty($data["email"]) ||
            !filter_var($data["email"], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(
                400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
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

        $currentPassword = $data["currentPassword"] ?? null;
        $newPassword = $data["password"] ?? null;

        if ($newPassword !== null && !empty($newPassword)) {
            if (empty($currentPassword)) {
                $this->call(
                    400,
                    "bad_request",
                    "Digite sua senha atual.",
                    "error"
                )->back();
                return;
            }

            if (!$user->verifyPassword($userId, $currentPassword)) {
                $this->call(
                    400,
                    "invalid_password",
                    "A senha atual está incorreta.",
                    "error"
                )->back();
                return;
            }

            $user->setPassword(
                password_hash($newPassword, PASSWORD_DEFAULT)
            );
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (isset($data["telephone"])) {
            $user->setTelephone($data["telephone"]);
        }

        if (isset($data["photo"])) {
            $user->setPhoto($data["photo"]);
        }
        $telephone = $data["telephone"] ?? null;

        if ($telephone !== null && !preg_match('/^\d{10,11}$/', $telephone)) {
            $this->call(
                400,
                "bad_request",
                "O telefone deve conter apenas números e ter 10 ou 11 dígitos.",
                "error"
            )->back();
            return;
        }

        if (!$user->updateById($userId)) {
            $errorMessage = $user->getErrorMessage();

            if (
                str_contains($errorMessage, "Duplicate entry") &&
                str_contains($errorMessage, "users.email")
            ) {

                $this->call(
                    400,
                    "email_already_exists",
                    "Este e-mail já está cadastrado.",
                    "error"
                )->back();

                return;
            }

            $this->call(
                500,
                "internal_server_error",
                "Não foi possível atualizar o usuário.",
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
        $adminId = $this->authToken(3);

        if (!$adminId) {
            $this->call(401, "unauthorized", "Usuário não está autenticado.", "error")->back();
            return;
        }

        $userId = (int) ($data["userId"] ?? 0);

        if (!$userId) {
            $this->call(400, "bad_request", "Informe o usuário.", "error")->back();
            return;
        }

        // Admin não pode alterar a própria role
        if ($userId === $adminId) {
            $this->call(403, "forbidden", "Você não pode alterar a sua própria role.", "error")->back();
            return;
        }

        $roleMap = [
            "admin" => 3,
            "cliente" => 4,
            "employee" => 5,
        ];

        // aceita "role" ou "roleId", em texto ou número
        $rawRole = $data["role"] ?? $data["roleId"] ?? null;

        if ($rawRole === null || $rawRole === "") {
            $this->call(400, "bad_request", "Informe a role.", "error")->back();
            return;
        }

        $roleId = is_numeric($rawRole)
            ? (int) $rawRole
            : ($roleMap[strtolower((string) $rawRole)] ?? 0);

        if (!in_array($roleId, [3, 4, 5], true)) {
            $this->call(400, "bad_request", "Role inválida.", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        if (!$user->updateRole($userId, $roleId)) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Role atualizada com sucesso.", "success")->back();
    }
    public function checkPassword(array $data): void
    {
        $userId = $this->authToken();

        if (!$userId) {
            $this->call(401, "unauthorized", "Usuário não está autenticado.", "error")->back();
            return;
        }

        $password = $data["password"] ?? "";

        if (empty($password)) {
            $this->call(400, "bad_request", "Informe a senha para verificação.", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        if (!$user->verifyPassword($userId, $password)) {
            $this->call(400, "invalid_password", "Senha incorreta.", "error")->back();
            return;
        }

        $this->call(200, "success", "Senha verificada com sucesso.", "success")->back();
    }
    public function softDelete(array $data): void
    {
        $authId = $this->authToken();

        if (!$authId) {
            $this->call(401, "unauthorized", "Usuário não está autenticado.", "error")->back();
            return;
        }

        $targetId = (int) ($data["userId"] ?? 0);

        if (!$targetId) {
            $this->call(400, "bad_request", "Informe o usuário.", "error")->back();
            return;
        }

        $auth = new User();

        if (!$auth->selectById($authId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        // Qualquer usuário exclui a própria conta; só admin (tipo 3) exclui a de outros
        if ($targetId !== $authId && $auth->getUserTypeId() !== 3) {
            $this->call(403, "forbidden", "Você não tem permissão para remover este usuário.", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->selectById($targetId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        if (!$user->softDeleteById($targetId)) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Usuário removido com sucesso.", "success")->back();
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