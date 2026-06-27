<?php

namespace Source\Controller\Users;

use Source\Controller\Api;
use Source\Models\User\User;
use Source\Core\JWTToken;

class Users extends Api
{
    private function validateNameEmail(array $data): bool
    {
        return isset($data["name"], $data["email"])
            && !empty($data["name"])
            && !empty($data["email"])
            && filter_var($data["email"], FILTER_VALIDATE_EMAIL);
    }

    private function validatePassword(array $data, int $min = 6, int $max = 20): bool
    {
        $len = strlen($data["password"] ?? "");
        return $len >= $min && $len <= $max;
    }

    public function listEmployee(): void
    {
        if (!$this->authToken(3)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        $user = new User();
        $this->call(200, "success", "Lista de Funcionários", "success")
            ->back($user->listEmployee());
    }
    public function listCliente(): void
    {
        if (!$this->authToken(3)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        $user = new User();
        $this->call(200, "success", "Lista de Clientes", "success")
            ->back($user->listCliente());
    }
    public function listAdmin(): void
    {
        if (!$this->authToken(3)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        $user = new User();
        $this->call(200, "success", "Lista de Admins", "success")
            ->back($user->listAdmin());
    }

    public function listAll(): void
    {
        $user = new User();
        $this->call(200, "success", "Lista de usuários", "success")
            ->back($user->selectAll());
    }

    public function profile(): void
    {
        $userId = $this->authToken(0);

        if (!$userId) {
            $this->call(401, "unauthorized", "Usuário não autenticado", "error")->back();
            return;
        }

        $user = new User();
        $this->call(200, "success", "Perfil encontrado", "success")
            ->back($user->findById($userId));
    }
    public function register(array $data): void
    {

        if (!$this->validateNameEmail($data)) {
            $this->call(400, "bad_request", "Nome e e-mail são obrigatórios. O e-mail deve ser válido.", "error")->back();
            return;
        }

        if (empty($data['password'])) {
            $this->call(400, "bad_request", "A senha é obrigatória.", "error")->back();
            return;
        }

        if (!$this->validatePassword($data)) {
            $this->call(400, "bad_request", "A senha deve ter entre 6 e 20 caracteres.", "error")->back();
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

        $this->call(201, "success", "Usuário criado com sucesso", "created")->back([
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail(),
        ]);
    }
    public function registerAdmin(array $data): void
    {
        if (!$this->validateNameEmail($data)) {
            $this->call(400, "bad_request", "Nome e e-mail são obrigatórios. O e-mail deve ser válido.", "error")->back();
            return;
        }

        if (empty($data['password'])) {
            $this->call(400, "bad_request", "A senha é obrigatória.", "error")->back();
            return;
        }

        if (!$this->validatePassword($data)) {
            $this->call(400, "bad_request", "A senha deve ter entre 6 e 20 caracteres.", "error")->back();
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
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(201, "success", "Usuário criado com sucesso", "created")->back([
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail(),
        ]);
    }
    public function registerEmployee(array $data): void
    {
        if (!$this->validateNameEmail($data)) {
            $this->call(400, "bad_request", "Nome e e-mail são obrigatórios. O e-mail deve ser válido.", "error")->back();
            return;
        }

        if (empty($data['password'])) {
            $this->call(400, "bad_request", "A senha é obrigatória.", "error")->back();
            return;
        }

        if (!$this->validatePassword($data)) {
            $this->call(400, "bad_request", "A senha deve ter entre 6 e 20 caracteres.", "error")->back();
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
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(201, "success", "Usuário criado com sucesso", "created")->back([
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail(),
        ]);
    }
    public function login(array $data): void
    {

        if (
            empty($data['email']) || empty($data['password']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(400, "bad_request", "E-mail e senha são obrigatórios. O e-mail deve ser válido.", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->login($data['email'], $data['password'])) {
            $this->call(401, "unauthorized", $user->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Login realizado com sucesso", "success")->back([
            "id" => $user->getId(),
            "name" => $user->getName(),
            "photo" => $user->getPhoto(),
            "userType" => $user->getUserTypeName(),
            "token" => $user->getToken(),
        ]);
    }
    public function loginAdmin(array $data): void
    {
        if (
            empty($data['email']) || empty($data['password']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(400, "bad_request", "E-mail e senha são obrigatórios. O e-mail deve ser válido.", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->login($data['email'], $data['password'], 3)) {
            $this->call(401, "unauthorized", $user->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Login realizado com sucesso", "success")->back([
            "id" => $user->getId(),
            "name" => $user->getName(),
            "photo" => $user->getPhoto(),
            "userType" => $user->getUserTypeName(),
            "token" => $user->getToken(),
        ]);
    }
    public function loginEmployee(array $data): void
    {

        if (
            empty($data['email']) || empty($data['password']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
        ) {
            $this->call(400, "bad_request", "E-mail e senha são obrigatórios. O e-mail deve ser válido.", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->login($data['email'], $data['password'], 5)) {
            $this->call(401, "unauthorized", $user->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Login realizado com sucesso", "success")->back([
            "id" => $user->getId(),
            "name" => $user->getName(),
            "photo" => $user->getPhoto(),
            "userType" => $user->getUserTypeName(),
            "token" => $user->getToken(),
        ]);
    }


    public function update(array $data): void
    {
        if (!$this->authToken(4)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        $userId = $this->userAuthId;

        if (!$this->validateNameEmail($data)) {
            $this->call(400, "bad_request", "Os campos name e email são obrigatórios.", "error")->back();
            return;
        }

        $checkUser = new User();
        if (!$checkUser->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
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
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $userUpdated = new User();
        $userUpdated->selectById($userId);

        $this->call(200, "success", "Usuário atualizado com sucesso", "success")->back([
            "id" => $userUpdated->getId(),
            "name" => $userUpdated->getName(),
            "email" => $userUpdated->getEmail(),
            "telephone" => $userUpdated->getTelephone(),
            "photo" => $userUpdated->getPhoto(),
            "userTypeId" => $userUpdated->getUserTypeId(),
            "active" => $userUpdated->getActive(),
        ]);
    }
    public function updateAdmin(array $data): void
    {
        if (!$this->authToken(3)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        $userId = $this->userAuthId;

        if (!$this->validateNameEmail($data)) {
            $this->call(400, "bad_request", "Os campos name e email são obrigatórios.", "error")->back();
            return;
        }

        $checkUser = new User();
        if (!$checkUser->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        $user = new User(
            $userId,
            $data["name"],
            $data["email"],
            $data["password"] ?? null,
            $data["telephone"] ?? null,
            $data["photo"] ?? null,
            3
        );

        if (!$user->updateById($userId)) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $userUpdated = new User();
        $userUpdated->selectById($userId);

        $this->call(200, "success", "Usuário atualizado com sucesso", "success")->back([
            "id" => $userUpdated->getId(),
            "name" => $userUpdated->getName(),
            "email" => $userUpdated->getEmail(),
            "telephone" => $userUpdated->getTelephone(),
            "photo" => $userUpdated->getPhoto(),
            "userTypeId" => $userUpdated->getUserTypeId(),
            "active" => $userUpdated->getActive(),
        ]);
    }
    public function updateEmployee(array $data): void
    {
        if (!$this->authToken(5)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        $userId = $this->userAuthId;

        if (!$this->validateNameEmail($data)) {
            $this->call(400, "bad_request", "Os campos name e email são obrigatórios.", "error")->back();
            return;
        }

        $checkUser = new User();
        if (!$checkUser->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        $user = new User(
            $userId,
            $data["name"],
            $data["email"],
            $data["password"] ?? null,
            $data["telephone"] ?? null,
            $data["photo"] ?? null,
            5
        );

        if (!$user->updateById($userId)) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $userUpdated = new User();
        $userUpdated->selectById($userId);

        $this->call(200, "success", "Usuário atualizado com sucesso", "success")->back([
            "id" => $userUpdated->getId(),
            "name" => $userUpdated->getName(),
            "email" => $userUpdated->getEmail(),
            "telephone" => $userUpdated->getTelephone(),
            "photo" => $userUpdated->getPhoto(),
            "userTypeId" => $userUpdated->getUserTypeId(),
            "active" => $userUpdated->getActive(),
        ]);
    }
    public function softDelete(array $data): void
    {
        $userId = $data["user_id"] ?? null;

        if (!filter_var($userId, FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "error",
                "ID do usuário é obrigatório",
                "bad_request"
            )->back();
            return;
        }

        $user = new User();

        if (!$user->findById($userId)) {
            $this->call(
                404,
                "error",
                "Usuário não encontrado",
                "not_found"
            )->back();
            return;
        }

        if (!$user->softDelete($userId)) {
            $this->call(
                400,
                "error",
                "Não foi possível remover o usuário",
                "bad_request"
            )->back();
            return;
        }

        $this->call(
            200,
            "success",
            "Usuário removido com sucesso",
            "success"
        )->back();
    }
    public function roleFunc(array $data): void
    {
        $adminId = $this->authToken(3);

        if (!$adminId) {
            $this->call(401, "unauthorized", "Sem permissão.", "error")->back();
            return;
        }

        $userId = $data['user_id'] ?? null;

        if (!$userId) {
            $this->call(400, "bad_request", "ID inválido", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        $ok = $user->updateRole($userId, 5);
        var_dump(getallheaders());
        exit;
        if (!$ok) {
            $this->call(500, "error", "Falha ao atualizar role.", "error")->back();
            return;
        }

        $this->call(200, "success", "Role atualizada com sucesso")->back();
    }
    public function roleCliente(array $data): void
    {
        $adminId = $this->authToken(3);

        if (!$adminId) {
            $this->call(401, "unauthorized", "Sem permissão.", "error")->back();
            return;
        }

        $userId = $data['user_id'] ?? null;

        if (!$userId) {
            $this->call(400, "bad_request", "ID inválido", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        $ok = $user->updateRole($userId, 4);

        if (!$ok) {
            $this->call(500, "error", "Falha ao atualizar role.", "error")->back();
            return;
        }

        $this->call(200, "success", "Role atualizada com sucesso")->back();
    }
    public function roleAdmin(array $data): void
    {
        $adminId = $this->authToken(3);

        if (!$adminId) {
            $this->call(401, "unauthorized", "Sem permissão.", "error")->back();
            return;
        }

        $userId = $data['user_id'] ?? null;

        if (!$userId) {
            $this->call(400, "bad_request", "ID inválido", "error")->back();
            return;
        }

        $user = new User();

        if (!$user->selectById($userId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        $ok = $user->updateRole($userId, 3);

        if (!$ok) {
            $this->call(500, "error", "Falha ao atualizar role.", "error")->back();
            return;
        }

        $this->call(200, "success", "Role atualizada com sucesso")->back();
    }
}