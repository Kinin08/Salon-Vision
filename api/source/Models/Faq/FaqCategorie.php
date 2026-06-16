<?php

namespace source\Models\Faq;

use PDO;
use Source\Core\Connect;
use Source\Core\Model;

class FaqCategorie extends Model
{
    private ?int $id;
    private ?string $name;
    private ?int $active;

    public function __construct(?int $id = null, ?string $name = null, ?int $active = 1)
    {
        $this->id = $id;
        $this->name = $name;
        $this->active = $active;

        $this->table = 'faqs_categories'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['name', 'active']; // camelCase
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }
    public function getActive(): ?int
    {
        return $this->active;
    }
    public function setActive(int $active): void
    {
        $this->active = $active;
    }
}