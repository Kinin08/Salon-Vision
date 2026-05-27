<?php

namespace source\Controller\Faqs;

use Source\Controller\Api;
use Source\Models\Faq\Faq;

class Faqs extends Api
{
    public function listAll(): void
    {
        $faq = new Faq();

        $this->call(
            200,
            "success",
            "Lista de FAQs",
            "success"
        )->back($faq->selectAll());
    }
    public function listById(array $data): void
    {

        if (!isset($data["faq_id"]) || empty($data["faq_id"]) || !filter_var($data["faq_id"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do FAQ é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }

        $faq = new Faq();
        if (!$faq->selectById($data["faq_id"])) {
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
            "faqCategoryId" => $faq->getFaqCategoryId(),
            "question" => $faq->getQuestion(),
            "answer" => $faq->getAnswer()
        ];

        $this->call(200, "success", "FAQ encontrado", "success")->back($response);

    }
    public function create(array $data): void
    {
        if (!$this->validate($data)) {
            $this->call(
                400,
                "bad_request",
                "Os campos faqsCategoryId, question e answer são obrigatórios",
                "error"
            )->back();
            return;
        }

        $faq = new Faq(
            null,
            $data["faqsCategoryId"],
            $data["question"],
            $data["answer"],
            1
        );

        if (!$faq->insert()) {
            $this->call(
                500,
                "internal_server_error",
                $faq->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $faq->getId(),
            "faqsCategoryId" => $faq->getFaqsCategoryId(),
            "question" => $faq->getQuestion(),
            "answer" => $faq->getAnswer()
        ];

        $this->call(201, "success", "FAQ inserido com sucesso", "success")->back($response);
    }
    public function update(array $data): void
    {
        if (!filter_var($data["faq_id"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do FAQ é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }

        $body = json_decode(file_get_contents("php://input"), true);

        if (!$body) {
            $this->call(
                400,
                "bad_request",
                "JSON inválido ou ausente",
                "error"
            )->back();
            return;
        }

        if (
            empty($body["faqs_category_id"]) ||
            empty($body["question"]) ||
            empty($body["answer"])
        ) {
            $this->call(
                400,
                "bad_request",
                "Os campos faqs_category_id, question e answer são obrigatórios",
                "error"
            )->back();
            return;
        }

        $faq = new Faq(
            null,
            $body["faqs_category_id"],
            $body["question"],
            $body["answer"]
        );

        if (!$faq->updateById($data["faq_id"])) {
            $this->call(
                500,
                "internal_server_error",
                $faq->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $faq->getId(),
            "faqs_category_id" => $faq->getFaqsCategoryId(),
            "question" => $faq->getQuestion(),
            "answer" => $faq->getAnswer(),
            "active" => $faq->getActive()
        ];

        $this->call(200, "success", "FAQ atualizado com sucesso", "success")->back($response);
    }

    public function softDelete(array $data): void
    {
        $id = $data["faq_id"] ?? null;

        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->call(400, "error", "ID do FAQ é obrigatório e deve ser um número inteiro", "bad_request")->back();
            return;
        }

        $faq = new Faq();

        if (!$faq->softDeleteById($id)) {
            $this->call(404, "error", "FAQ não encontrado", "not_found")->back();
            return;
        }

        $this->call(200, "success", "FAQ removido com sucesso", "success")->back(null);
    }
    public function validate(array $data): bool
    {
        if (
            !isset($data["faqsCategoryId"]) || !isset($data["question"]) || !isset($data["answer"]) ||
            empty($data["faqsCategoryId"]) || empty($data["question"]) || empty($data["answer"])
        ) {
            return false;
        }
        return true;
    }
}