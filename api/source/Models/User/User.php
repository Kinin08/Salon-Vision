<?php

namespace Source\Models\User;

use PDO;
use Source\Core\Connect;
use Source\Core\Model;
use Source\Core\JWTToken;

class User extends Model
{
    private ?int $id;
    private ?string $name;
    private ?string $email;
    private ?string $password;
    private ?string $telephone;
    private ?string $photo;
    private ?int $userTypeId;
    private ?string $registrationDate;
    private ?int $active = 1;

    private ?string $userTypeName = null;

    private ?string $token = null;

    public function __construct(?int $id = null, ?string $name = null, ?string $email = null, ?string $password = null, ?string $telephone = null, ?string $photo = null, ?int $userTypeId = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->telephone = $telephone;
        $this->photo = $photo;
        $this->userTypeId = $userTypeId;

        $this->table = 'users'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = [
            'name',
            'email',
            'password',
            'telephone',
            'photo',
            'userTypeId',
            'active'
        ]; // camelCase
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }
    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): void
    {
        $this->telephone = $telephone;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): void
    {
        $this->password = $password;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): void
    {
        $this->photo = $photo;
    }
    public function getUserTypeId(): ?int
    {
        return $this->userTypeId;
    }
    public function getRegistrationDate(): ?string
    {
        return $this->registrationDate;
    }
    public function setRegistrationDate(?string $registrationDate): void
    {
        $this->registrationDate = $registrationDate;
    }
    public function getActive(): ?int
    {
        return $this->active;
    }

    public function setActive(?int $active): void
    {
        $this->active = $active;
    }

    public function setUserTypeId(?int $userTypeId): void
    {
        $this->userTypeId = $userTypeId;
    }
    public function getUserTypeName(): ?string
    {
        return $this->userTypeName;
    }

    public function setUserTypeName(?string $userTypeName): void
    {
        $this->userTypeName = $userTypeName;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }
    public function findById(int $id): ?array
    {
        $query = "
        SELECT id, name, email, telephone, photo, user_type_id, active, registration_date
        FROM users
        WHERE id = :id
        LIMIT 1
    ";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindValue(":id", $id);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
    public function insert(): bool
    {
        $query = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $this->errorMessage = "Email já cadastrado";
            return false;
        }
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

        if (!parent::insert()) {
            $this->errorMessage = "Algo deu errado";
            return false;
        }
        return true;
    }

    public function login(string $email, string $password, int $typeId = 4): bool
    {
        $query = "SELECT
            u.*,
            ut.name AS user_type
          FROM users u
          INNER JOIN users_types ut
            ON ut.id = u.user_type_id
          WHERE u.email = :email
            AND u.user_type_id = :userTypeId";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":userTypeId", $typeId);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            $this->errorMessage = "Email não cadastrado";
            return false;
        }
        $user = $stmt->fetch();
        if (!password_verify($password, $user->password)) {
            $this->errorMessage = "Senha incorreta";
            return false;
        }
        $this->userTypeName = $user->user_type;
        $this->id = $user->id;
        $this->name = $user->name;
        $this->email = $user->email;
        $this->telephone = $user->telephone;
        $this->photo = $user->photo;
        $this->userTypeId = $user->user_type_id;
        $jwt = new JWTToken();
        // definir quais informações irão par o payload do token
        $this->token = $jwt->encode([
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email
        ]);
        return true;
    }
    public function updatePhotoById(int $id, string $photo): bool
    {
        $query = "UPDATE {$this->table} SET photo = :photo WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":photo", $photo);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    // Em User.php — troca o permissionVerify
    public function permissionVerify(int $userId, int $typeId): bool
    {
        $query = "SELECT id FROM {$this->table} 
              WHERE id = :id 
              AND user_type_id = :userTypeId 
              AND active = 1";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $userId);
        $stmt->bindParam(":userTypeId", $typeId);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
    public function listEmployees(): array
    {
        $query = "
        SELECT
        *
        FROM users
        WHERE user_type_id = 5
        AND active = 1
    ";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function listCliente(): array
    {
        $query = "
        SELECT
        *
        FROM users
        WHERE user_type_id = 4
        AND active = 1
    ";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }
    /**
     * Verifica se o email já existe em outro usuário
     * @param int $excludeId ID do usuário a ser excluído da verificação
     * @return bool
     */
    public function isEmailDuplicate(int $excludeId = null): bool
    {
        $query = "SELECT id FROM {$this->table} WHERE email = :email";

        if ($excludeId !== null) {
            $query .= " AND id != :excludeId";
        }

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(':email', $this->email);

        if ($excludeId !== null) {
            $stmt->bindParam(':excludeId', $excludeId);
        }

        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
}