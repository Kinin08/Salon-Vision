<?php

namespace source\Controller;

use Source\Controller\Api;
use Source\Models\ProductCategory;

class ProductsCategories extends Api
{
    public function productsCategoryList (): void
    {
        $categories = new ProductCategory();
        $this->call(200,"success","Lista de Categorias de Produtos","success")->back($categories->listAll());
    }
    
    public function categoryFindById(array $data): void
    {
        if(!filter_var($data["categoryId"], FILTER_VALIDATE_INT)){
           $this->call(
            400,
            "bad_request",
            "ID da categoria do produto é obrigatório e deve ser um número inteiro",
            "error"
           )->back();
           return;
        }
        $category = new ProductCategory();
        $category = $category->categoryFindById($data["categoryId"]);
        if(!$category){
            $this->call(
                404,
                "not_found",
                "Categoria não encontrado",
                "error"
            )->back();
            return;
        }

        $this->call(200,"success","Categoria encontrada","success")->back($category);
    }
}