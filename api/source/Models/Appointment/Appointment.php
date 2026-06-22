<?php

namespace Source\Models\Appointment;

use PDO;
use Source\Core\Connect;
use Source\Core\Model;
use Source\Core\JWTToken;

class Appointment extends Model
{
    private ?int $id = null;
    private ?int $clientId = null;
    private ?int $employeeId = null;
    private ?int $serviceId = null;
    private ?string $dateTime = null;
    private ?int $rating = null;
    private ?string $comment = null;
    private ?int $active = null;
    private ?string $status = null;
    private ?string $createdIn = null;

    public function __construct(?int $id = null, ?int $clientId = null, ?int $employeeId = null, ?int $serviceId = null, ?string $dateTime = null, ?int $rating = null, ?string $comment = null, ?int $active = 1, ?string $status = null)
    {
        $this->id = $id;
        $this->clientId = $clientId;
        $this->employeeId = $employeeId;
        $this->serviceId = $serviceId;
        $this->dateTime = $dateTime;
        $this->rating = $rating;
        $this->comment = $comment;
        $this->active = $active;
        $this->status = $status ?? "scheduled";

        $this->table = 'appointments';
        $this->primaryKey = 'id';

        $this->fillable = [
            'clientId',
            'employeeId',
            'serviceId',
            'dateTime',
            'rating',
            'comment',
            'active',
            'status',
            'createdIn'
        ];
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getClientId(): ?int
    {
        return $this->clientId;
    }
    public function setClientId(?int $clientId): void
    {
        $this->clientId = $clientId;
    }

    public function getEmployeeId(): ?int
    {
        return $this->employeeId;
    }
    public function setEmployeeId(?int $employeeId): void
    {
        $this->employeeId = $employeeId;
    }

    public function getServiceId(): ?int
    {
        return $this->serviceId;
    }
    public function setServiceId(?int $serviceId): void
    {
        $this->serviceId = $serviceId;
    }

    public function getDateTime(): ?string
    {
        return $this->dateTime;
    }
    public function setDateTime(?string $dateTime): void
    {
        $this->dateTime = $dateTime;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }
    public function setRating(?int $rating): void
    {
        $this->rating = $rating;
    }
    public function getComment(): ?string
    {
        return $this->comment;
    }
    public function setComment(?string $comment): void
    {
        $this->comment = $comment;
    }
    public function getActive(): ?int
    {
        return $this->active;
    }
    public function setActive(?int $active): void
    {
        $this->active = $active;
    }
    public function getStatus(): ?string
    {
        return $this->status;
    }
    public function setStatus(?string $status): void
    {
        $this->status = $status ?? 'scheduled';
    }
    public function getCreatedIn(): ?string
    {
        return $this->createdIn;
    }
    public function setCreatedIn(?string $createdIn): void
    {
        $this->createdIn = $createdIn;
    }
public function listAll(): array
{
    $query = "
        SELECT
            a.id,
            a.date_time,
            a.status,
            a.rating,
            s.name AS service,
            e.name AS employee,
            c.name AS client
        FROM appointments a
        INNER JOIN services s ON s.id = a.service_id
        INNER JOIN users    e ON e.id = a.employee_id
        INNER JOIN users    c ON c.id = a.client_id
        ORDER BY a.date_time DESC
    ";

    $stmt = Connect::getInstance()->prepare($query);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
    public function historic(int $clientId): array
    {
        $query = "
    SELECT
        a.id,
        a.date_time,
        a.rating,
        a.status,
        s.name AS service,
        s.price,
        u.name AS employee
    FROM appointments a
    INNER JOIN services s
        ON s.id = a.service_id
    INNER JOIN users u
        ON u.id = a.employee_id
    WHERE a.client_id = :clientId
    ORDER BY a.date_time DESC
";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindValue(":clientId", $clientId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function findById(int $id): ?array
    {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
    public function softDeleteById(int $id): bool
    {
        $query = "
            UPDATE {$this->table}
            SET
                status = 'canceled',
                active = 0
            WHERE id = :id
            AND active = 1
            AND (
                status = 'scheduled'
                OR status = 'confirmed'
                )
        ";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
}