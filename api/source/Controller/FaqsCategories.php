<?php
namespace source\Controller;

use Source\Controller\Api;
use Source\Models\FaqCategorie;

class FaqsCategories extends Api
{
    public function listAll(): void
    {
        $faq = new FaqCategorie();
        $categories = $faq->listAll();

        $this->call(
            200,
            "success",
            "Lista de categorias de FAQ",
            "success"
        )->back($categories);
    }
    public function listById(array $data): void
    {
        if (!filter_var($data["faq_categorieId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "O id é obrigatorio e deve ser um numero inteiro",
                "error"
            )->back();
            return;
        }
        $faq = new FaqCategorie();
        $categories = $faq->listById($data["faq_categorieId"]);
        if (!$categories) {
            $this->call(
                404,
                "not_found",
                "Categoria não achada",
                "error"
            )->back();
            return;
        }
        $this->call(
            200,
            "succes",
            "Produto encontrado pelo id",
            "success"
        )->back($categories);
    }
    public function create(array $data): void
    {
        if (!isset($data["name"]) || empty($data["name"])) {
            $this->call(
                400,
                "bad_request",
                "O campo name é obrigatorio",
                "error"
            )->back();
            return;
        }
        $faq = new FaqCategorie();
        $create = $faq->create($data["name"]);

        if (!$create) {
            $this->call(
                500,
                "error",
                "Não foi possível cadastrar a categoria",
                "internal_server_error"
            )->back(null);
            return;
        }

        $this->call(
            201,
            "success",
            "Categoria de FAQ criada com sucesso",
            "created"
        )->back($create);
    }
}