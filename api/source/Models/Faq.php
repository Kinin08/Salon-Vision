<?php

namespace source\Models;

use Source\Core\Connect;
class Faq
{
    private ?int $id;
    private ?int $faqs_category_id;
    private ?string $question;
    private ?string $answer;

    public function __construct(?int $id = null, ?int $faqs_category_id = null, ?string $question = null, ?float $answer = null)
    {
        $this->id = $id;
        $this->faqs_category_id = $faqs_category_id;
        $this->question = $question;
        $this->answer = $answer;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getFaqs_category_id(): int
    {
        return $this->faqs_category_id;
    }

    public function setFaqs_category_id(int $faqs_category_id): void
    {
        $this->faqs_category_id = $faqs_category_id;
    }

    public function getQuestion(): string
    {
        return $this->question;
    }

    public function setQuestion(string $question): void
    {
        $this->question = $question;
    }

    public function getAnswer(): string
    {
        return $this->answer;
    }

    public function setAnswer(string $answer): void
    {
        $this->answer = $answer;
    }

    public function listAll(): array
    {
        $query = "SELECT f.id, f.question, f.answer,
        c.name AS category_name
        FROM faqs AS f
        JOIN faqs_categories AS c
        ON c.id = f.faqs_category_id
        ORDER BY c.name, f.id";
        $stmt = Connect::getInstance()->query($query);
        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll();
        }
        return [];
    }
    public function listById(int $id): object | bool
    {
        $query = "SELECT * FROM faqs WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        return false;
    }
}