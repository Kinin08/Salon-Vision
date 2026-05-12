<?php

namespace source\Controller;

use Source\Controller\Api;
use Source\Models\Product;

class Products extends Api
{
    public function productsList (): void
    {
        $products = new Product();
        $this->call(200,"success","Lista de Produtos","success")->back($products->listAll());
    }
    public function produuctById(array $data): void
    {
        var_dump($data["idProduct"]);
        $product = new Product();
        var_dump($product->findById($data["idProduct"]));
    }
}