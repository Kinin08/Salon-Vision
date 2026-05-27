<?php

namespace source\Models\Product;

use Source\Core\Connect;
use Source\COre\Model;

class Product extends Model
{
    private ?int $id;
    private ?int $categoryId;
    private ?string $name;
    private ?float $price;
    private ?int $active;

    public function __construct(?int $id = null, ?int $categoryId = null, ?string $name = null, ?float $price = null, ?int $active = 1)
    {
        $this->id = $id;
        $this->categoryId = $categoryId;
        $this->name = $name;
        $this->price = $price;
        $this->active = $active;

        $this->table = 'products';
        $this->primaryKey = 'id';
        $this->fillable = ['categoryId', 'name', 'price', 'active'];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }

    public function setCategoryId(int $categoryId): void
    {
        $this->categoryId = $categoryId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): void
    {
        $this->price = $price;
    }
    public function getActive(): ?int
    {
        return $this->active;
    }

    public function setActive(int $active): void
    {
        $this->active = $active;
    }

    public function listAll(): array
    {
        $query = "SELECT products.id, products.name, products.price, 
	                     products_categories.name as 'category_name' 
                  FROM products
                  JOIN products_categories ON products.category_id = products_categories.id";
        $stmt = Connect::getInstance()->query($query);
        return $stmt->fetchAll();
    }

    public function productById(int $id): object|bool
    {
        $query = "SELECT * FROM products WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        return false;
    }
    public function create(): bool
    {
        $query = "INSERT INTO products VALUES(NULL, :category_id, :name, :price)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->execute();

        if ($stmt->rowCount() === 1) {
            $this->id = Connect::getInstance()->lastInsertId();
            return true;
        }

        return false;
    }
    public function softDelete(int $id): bool
    {
        $query = "UPDATE products SET active = 0 WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
    public function update(): bool
    {
        $query = "UPDATE products 
              SET category_id = :category_id, name = :name, price = :price 
              WHERE id = :id";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }
}