<?php

namespace Source\Models\ServiceEmployee;

use PDO;
use Source\Core\Connect;
use Source\Core\Model;
class ServiceEmployee extends Model
{
    private ?int $id;
    private ?int $serviceId;
    private ?int $employeeId;
    private ?int $active;

    public function __construct(?int $id = null, ?int $serviceId = null, ?int $employeeId = null, ?int $active = null)
    {
        $this->id = $id;
        $this->serviceId = $serviceId;
        $this->employeeId = $employeeId;
        $this->active = $active;

        $this->table = 'service_employees'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['serviceId', 'employeeId', 'active']; // camelCase
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getServiceId(): ?int
    {
        return $this->serviceId;
    }

    public function setServiceId(int $serviceId): void
    {
        $this->serviceId = $serviceId;
    }

    public function getEmployeeId(): ?int
    {
        return $this->employeeId;
    }

    public function setEmployeeId(int $employeeId): void
    {
        $this->employeeId = $employeeId;
    }
    public function getActive(): ?int
    {
        return $this->active;
    }
    public function setActive(int $active): void
    {
        $this->active = $active;
    }
    public function listByService(int $serviceId): array
    {
        $query = "
        SELECT
            se.id,
            se.service_id,
            se.employee_id,
            u.name AS employee_name,
            s.name AS service_name
        FROM service_employees se
        INNER JOIN services s
            ON se.service_id = s.id
        INNER JOIN users u
            ON se.employee_id = u.id
        WHERE se.service_id = {$serviceId}
          AND se.active = 1
    ";

        $stmt = Connect::getInstance()->query($query);

        return $stmt->fetchAll();
    }

    public function listByEmployee(int $employeeId): array
    {
        $query = "
        SELECT
            se.id,
            se.service_id,
            se.employee_id,
            u.name AS employee_name,
            s.name AS service_name
        FROM service_employees se
        INNER JOIN services s
            ON se.service_id = s.id
        INNER JOIN users u
            ON se.employee_id = u.id
        WHERE se.employee_id = {$employeeId}
          AND se.active = 1
    ";

        $stmt = Connect::getInstance()->query($query);

        return $stmt->fetchAll();
    }
    public function listEmployeeAppointments(int $employeeId, string $period = 'week'): array
{
    $where = match ($period) {
        'month' => "YEARWEEK(a.date_time, 1) IS NOT NULL
                    AND MONTH(a.date_time) = MONTH(CURDATE())
                    AND YEAR(a.date_time) = YEAR(CURDATE())",
        default => "YEARWEEK(a.date_time, 1) = YEARWEEK(CURDATE(), 1)",
    };

    $query = "
        SELECT
            a.id,
            a.date_time,
            a.status,
            c.name  AS client_name,
            c.photo AS client_photo,
            s.name  AS service_name
        FROM appointments a
        INNER JOIN service_employees se ON a.service_employee_id = se.id
        INNER JOIN services s           ON se.service_id = s.id
        INNER JOIN users c              ON a.client_id = c.id
        WHERE se.employee_id = :employeeId
          AND {$where}
        ORDER BY a.date_time ASC
    ";

    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindValue(':employeeId', $employeeId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}
}