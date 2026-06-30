<?php
namespace source\Controller\Faqs;

use Source\Controller\Api;
use Source\Models\Faq\FaqCategorie;

class FaqsCategories extends Api
{
    public function listAll(): void
    {
        $faq = new FaqCategorie();

        $this->call(
            200,
            "success",
            "Lista de FAQs Categories",
            "success"
        )->back($faq->selectAll());
    }
    public function listById(array $data): void
    {

        if (!isset($data["faqCategorieId"]) || empty($data["faqCategorieId"]) || !filter_var($data["faqCategorieId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do FAQ Category é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }
        $faq = new FaqCategorie();
        if (!$faq->selectById($data["faqCategorieId"])) {
            $this->call(
                404,
                "not_found",
                "FAQ não encontrado",
                "error"
            )->back(null);
            return;
        }

        $response = [
            "id" => $faq->getId(),
            "name" => $faq->getName(),
            "active" => $faq->getActive()
        ];

        $this->call(200, "success", "FAQ Category encontrado", "success")->back($response);

    }
    public function create(array $data)
    {
        if (!$this->authToken(3)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }
        if (
            !isset($data['name']) || empty($data['name'])
        ) {
            $this->call(
                400,
                "bad_request",
                "Preencha tudo.",
                "error"
            )->back();
            return;
        }

        $faq = new FaqCategorie(
            null,
            $data['name'],
            1
        );
        if (!$faq->insert()) {
            $this->call(500, "internal_server_error", $faq->getErrorMessage(), "error")->back();
            return;
        }


        $response = [
            "id" => $faq->getId(),
            "name" => $faq->getName()
        ];

        $this->call(201, "success", "FAQ Category inserido com sucesso", "created")->back($response);
    }
    public function update(array $data): void
    {
        if (!$this->authToken(4)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        if (
            !isset($data["faqCategorieId"]) ||
            !filter_var($data["faqCategorieId"], FILTER_VALIDATE_INT)
        ) {
            $this->call(
                400,
                "bad_request",
                "ID do FAQ é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }

        if (
            !isset($data["name"]) ||
            empty(trim($data["name"]))
        ) {
            $this->call(
                400,
                "bad_request",
                "O campo name é obrigatório",
                "error"
            )->back();
            return;
        }

        $faqCategoryAtual = new FaqCategorie();

        if (!$faqCategoryAtual->selectById($data["faqCategorieId"])) {
            $this->call(
                404,
                "not_found",
                "FAQ Category não encontrada",
                "error"
            )->back();
            return;
        }

        $faqAtualizado = new FaqCategorie(
            null,
            $data["name"] ?? $faqCategoryAtual->getName()
        );

        if (!$faqAtualizado->updateById($data["faqCategorieId"])) {
            $this->call(
                500,
                "internal_server_error",
                $faqAtualizado->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $faqAtualizado->selectById($data["faqCategorieId"]);

        $response = [
            "id" => $faqAtualizado->getId(),
            "name" => $faqAtualizado->getName(),
            "active" => $faqAtualizado->getActive()
        ];

        $this->call(
            200,
            "success",
            "FAQ Category atualizado com sucesso",
            "success"
        )->back($response);
    }
    public function softDelete(array $data): void
    {
        if (!$this->authToken(3)) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }
        if (
            !isset($data["faqCategorieId"]) ||
            !filter_var($data["faqCategorieId"], FILTER_VALIDATE_INT)
        ) {
            $this->call(
                400,
                "error",
                "ID do FAQ Category é obrigatório e deve ser um número inteiro",
                "bad_request"
            )->back();
            return;
        }

        $faq = new FaqCategorie();

        if (!$faq->selectById($data["faqCategorieId"])) {
            $this->call(
                404,
                "error",
                "FAQ Category não encontrado",
                "not_found"
            )->back();
            return;
        }

        if ($faq->getActive() === 0) {
            $this->call(
                409,
                "error",
                "FAQ Category já está removido",
                "conflict"
            )->back();
            return;
        }

        if (!$faq->softDeleteById($data["faqCategorieId"])) {
            $this->call(
                500,
                "error",
                $faq->getErrorMessage(),
                "internal_server_error"
            )->back();
            return;
        }

        $this->call(
            200,
            "success",
            "FAQ Category removido com sucesso",
            "success"
        )->back(null);
    }
}