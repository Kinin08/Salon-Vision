<?php

namespace source\Models;

use Source\Core\Connect;

class Product
{
    private ?int $id;
    private ?int $categoryId;
    private ?string $name;
    private ?float $price;

    public function __construct(?int $id = null, ?int $categoryId = null, ?string $name = null, ?float $price = null)
    {
        $this->id = $id;
        $this->categoryId = $categoryId;
        $this->name = $name;
        $this->price = $price;
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

    public function listAll (): array
    {
        $query = "SELECT products.id, products.name, products.price, 
	                     products_categories.name as 'category_name' 
                  FROM products
                  JOIN products_categories ON products.category_id = products_categories.id";
        $stmt = Connect::getInstance()->query($query);
        return $stmt->fetchAll();
    }

    public function productById (int $id): object | bool
    {
        $query = "SELECT * FROM products WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return $stmt->fetch();
        }
        return false;
    }
    public function insert(): bool
    {
        $query = "INSERT INTO products VALUES(NULL, :categoryId, :name, :price)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":categoryId", $this->categoryId);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);

        $stmt->execute();

        if($stmt->rowCount() == 1){
            $this->id = Connect::getInstance()->lastInsertId();
            return true;
        }
        return false;
    }
    
public function update(array $data): void
{
    if (
        empty($data["productId"]) ||
        empty($data["name"]) ||
        empty($data["price"]) ||
        empty($data["categoryId"])
    ) {
        $this->call(400, "bad_request", "Campos obrigatórios faltando", "error")->back();
        return;
    }

    $product = new Product();

    // carregar dados novos no objeto
    $product->setCategoryId($data["categoryId"]);
    $product->setName($data["name"]);
    $product->setPrice($data["price"]);

    // atualizar
    $updated = $product->update($data["productId"]);

    if (!$updated) {
        $this->call(500, "server_error", "Erro ao atualizar produto", "error")->back();
        return;
    }

    // montar resposta
    $response = [
        "id" => $data["productId"],
        "categoryId" => $product->getCategoryId(),
        "name" => $product->getName(),
        "price" => $product->getPrice()
    ];

    $this->call(200, "ok", "Produto atualizado com sucesso", "success")->back($response);
}
}