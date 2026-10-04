<?php

namespace Source\Models\Service;

use PDO;
use Source\Core\Connect;
use Source\Core\Model;
use Source\Core\JWTToken;

class Service extends Model
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description = null;
    private ?float $price = null;
    private ?int $durationMinutes = null;
    private ?int $active = null;

    public function __construct(?int $id = null, ?string $name = null, ?string $description = null, ?float $price = null, ?int $durationMinutes = null, ?int $active = 1)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->price = $price;
        $this->durationMinutes = $durationMinutes;
        $this->active = $active;

        $this->table = 'services';
        $this->primaryKey = 'id';

        $this->fillable = [
            'name',
            'description',
            'price',
            'durationMinutes',
            'active'
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

    public function getName(): ?string
    {
        return $this->name;
    }
    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }
    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }
    public function setPrice(?float $price): void
    {
        $this->price = $price;
    }
    public function getDurationMinutes(): ?int
    {
        return $this->durationMinutes;
    }
    public function setDurationMinutes(?int $durationMinutes): void
    {
        $this->durationMinutes = $durationMinutes;
    }
    public function getActive(): ?int
    {
        return $this->active;
    }
    public function setActive(?int $active): void
    {
        $this->active = $active;
    }

    public function servicesByAppointmentCount(?int $serviceId = null): array
    {
        $query = "
        SELECT
            s.id AS service_id,
            s.name AS service_name,
            COUNT(a.id) AS total_appointments
        FROM services s
        INNER JOIN appointments a
            ON a.service_id = s.id
        WHERE a.status = 'completed'
        AND a.active = 1
    ";

        if ($serviceId !== null) {
            $query .= " AND s.id = :serviceId";
        }

        $query .= "
        GROUP BY s.id, s.name
        ORDER BY total_appointments DESC
    ";

        $stmt = Connect::getInstance()->prepare($query);

        if ($serviceId !== null) {
            $stmt->bindValue(
                ':serviceId',
                $serviceId,
                PDO::PARAM_INT
            );
        }

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function porcentageOfServices(): array
    {
        $query = "
        SELECT
            s.id AS service_id,
            s.name AS service_name,
            COUNT(a.id) AS total_appointments,
            (
                COUNT(a.id) * 100.0 /
                (
                    SELECT COUNT(*)
                    FROM appointments
                    WHERE status = 'completed'
                    AND active = 1
                )
            ) AS percentage
        FROM services s
        INNER JOIN appointments a
            ON a.service_id = s.id
        WHERE a.status = 'completed'
        AND a.active = 1
        GROUP BY s.id, s.name
        ORDER BY percentage DESC
    ";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}