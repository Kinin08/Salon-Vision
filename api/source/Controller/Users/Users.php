<?php

namespace Source\Controller\Users;

use Source\Controller\Api;
use Source\Models\User\User;
use Source\Core\JWTToken;

class Users extends Api
{
    private ?array $bodyCache = null;

    private function mergeBody(array $data): array
    {
        if ($this->bodyCache === null) {
            $this->bodyCache = json_decode(file_get_contents("php://input"), true) ?? [];
        }
        return array_merge($this->bodyCache, $data);
    }

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

    public function listEmployees(): void
    {
        $user = new User();
        $this->call(200, "success", "Lista de funcionários", "success")
            ->back($user->listEmployees());
    }

    public function listAll(): void
    {
        $user = new User();
        $this->call(200, "success", "Lista de usuários", "success")
            ->back($user->selectAll());
    }

    public function profile(): void
    {
        $userId = $this->authToken(0); // 0 = aceita qualquer tipo

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
        $data = $this->mergeBody($data);

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
    public function uploadPhoto(): void
    {
        $userId = $this->authToken(0);

        if (!$userId) {
            $this->call(401, "unauthorized", "Não autenticado.", "error")->back();
            return;
        }

        if (empty($_FILES['photo'])) {
            $this->call(400, "bad_request", "Nenhuma foto enviada.", "error")->back();
            return;
        }

        $file = $_FILES['photo'];
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        $maxSize = 2 * 1024 * 1024; // 2MB

        if (!in_array($file['type'], $allowed)) {
            $this->call(400, "bad_request", "Formato inválido. Use JPG, PNG ou WEBP.", "error")->back();
            return;
        }

        if ($file['size'] > $maxSize) {
            $this->call(400, "bad_request", "Foto muito grande. Máximo 2MB.", "error")->back();
            return;
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = "user_{$userId}_" . time() . ".{$ext}";
        $dir = __DIR__ . "/../../../../views/assets/public/uploads/";
        $path = $dir . $filename; // fica: .../uploads/user_1_123456.jpg

        if (!is_dir($dir))
            mkdir($dir, 0755, true);

        if (!move_uploaded_file($file['tmp_name'], $path)) {
            $this->call(500, "internal_server_error", "Erro ao salvar foto.", "error")->back();
            return;
        }

        $photoUrl = "/Salon-Vision/views/assets/public/uploads/" . $filename;

        // apaga foto antiga se existir
        $user = new User();
        $old = $user->findById($userId);
        if (!empty($old['photo'])) {
            $oldPath = __DIR__ . "/../../../public" . parse_url($old['photo'], PHP_URL_PATH);
            if (file_exists($oldPath))
                unlink($oldPath);
        }

        // salva no banco
        $u = new User($userId, null, null, null, null, $photoUrl, null);
        $u->updatePhotoById($userId, $photoUrl);

        $this->call(200, "success", "Foto atualizada.", "success")->back([
            "photo" => $photoUrl
        ]);
    }

    // ── Cadastro de staff (admin / funcionário) — requer token de admin ───────
    //
    //  Unifica registerAdmin + registerEmployee.
    //  Espera o campo "role" no body: "admin" | "employee"
    //  Exemplo: { "role": "employee", "name": "...", "email": "...", "password": "..." }

    public function registerStaff(array $data): void
    {
        if (!$this->authToken(3)) {
            $this->call(401, "unauthorized", "Acesso restrito a administradores.", "error")->back();
            return;
        }

        $data = $this->mergeBody($data);

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

        $roleMap = [
            "admin" => 3,
            "employee" => 5,
        ];

        $role = $data['role'] ?? null;
        $userTypeId = $roleMap[$role] ?? null;

        if (!$userTypeId) {
            $this->call(400, "bad_request", "Campo 'role' inválido. Use 'admin' ou 'employee'.", "error")->back();
            return;
        }

        $user = new User(
            null,
            $data['name'],
            $data['email'],
            $data['password'],
            $data['telephone'] ?? null,
            $data['photo'] ?? null,
            $userTypeId
        );

        if (!$user->insert()) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $label = $role === "admin" ? "Administrador" : "Funcionário";

        $this->call(201, "success", "$label criado com sucesso", "created")->back([
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail(),
            "role" => $role,
        ]);
    }
    public function login(array $data): void
    {
        $data = $this->mergeBody($data);

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

    public function update(array $data): void
    {
        $data = $this->mergeBody($data);

        $userId = $this->authToken(4);
        if (!$userId) {
            $this->call(401, "unauthorized", "Usuário não autenticado.", "error")->back();
            return;
        }

        if (empty($data["name"]) || empty($data["email"])) {
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
        $data = $this->mergeBody($data);

        if (!$this->authToken(3)) {
            $this->call(401, "unauthorized", "Acesso restrito a administradores.", "error")->back();
            return;
        }

        if (!$this->validateNameEmail($data)) {
            $this->call(400, "bad_request", "Nome e e-mail são obrigatórios e devem ser válidos.", "error")->back();
            return;
        }

        $tokenData = $this->getToken();
        $adminId = $tokenData->id ?? null;

        if (!$adminId) {
            $this->call(401, "unauthorized", "Token inválido.", "error")->back();
            return;
        }

        $user = new User();
        if (!$user->selectById($adminId)) {
            $this->call(404, "not_found", "Usuário não encontrado.", "error")->back();
            return;
        }

        $user->setName($data["name"]);
        $user->setEmail($data["email"]);

        if (!$user->updateById($adminId)) {
            $this->call(500, "update_error", $user->getErrorMessage() ?? "Erro ao atualizar.", "error")->back();
            return;
        }

        $this->call(200, "success", "Administrador atualizado com sucesso", "success")->back();
    }
}