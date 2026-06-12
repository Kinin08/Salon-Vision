<?php

namespace Source\Models\Appointment\Appointment;

use Source\Core\Model;

class Appointment extends Model
{
    private ?int $id = null;
    private ?int $clientId = null;
    private ?int $employeesId = null;
    private ?int $serviceId = null;
    private ?string $dateTime = null;
    private ?int $rating = null;
    private ?string $comment = null;
    private ?string $status = null;
    private ?string $observation = null;
    private ?string $createdIn = null;

    public function __construct(?int $id = null, ?int $clientId = null, ?int $employeesId=null, ?int $serviceId = null, ?string $dataTime)
    {
        $this->table = 'appointments';
        $this->primaryKey = 'id';

        $this->fillable = [
            'clientId',
            'employeesId',
            'serviceId',
            'dateTime',
            'rating',
            'comment',
            'status',
            'observation',
            'createdIn'
        ];
    }

    // GETTERS / SETTERS

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

    public function getEmployeesId(): ?int
    {
        return $this->employeesId;
    }
    public function setEmployeesId(?int $employeesId): void
    {
        $this->employeesId = $employeesId;
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

    public function getStatus(): ?string
    {
        return $this->status;
    }
    public function setStatus(?string $status): void
    {
        $this->status = $status;
    }

    public function getObservation(): ?string
    {
        return $this->observation;
    }
    public function setObservation(?string $observation): void
    {
        $this->observation = $observation;
    }

    public function getCreatedIn(): ?string
    {
        return $this->createdIn;
    }
    public function setCreatedIn(?string $createdIn): void
    {
        $this->createdIn = $createdIn;
    }
}