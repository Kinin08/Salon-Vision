<?php

namespace Source\Controller\Faqs;

use Source\Controller\Api;
use Source\Models\Faq\Faq;
use Source\Models\Faq\FaqCategorie;

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
    public function selectFaq(array $data): void
    {
        $faq = new Faq();

        $this->call(
            200,
            "success",
            "Lista de FAQs",
            "success"
        )->back($faq->selectFaq());
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
            "faqsCategoryId" => $faq->getFaqsCategoryId(),
            "question" => $faq->getQuestion(),
            "answer" => $faq->getAnswer(),
            "createdAt" => $faq->getCreatedAt()
        ];

        $this->call(200, "success", "FAQ encontrado", "success")->back($response);

    }
    public function create(array $data)
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
            !isset($data['faqsCategoryId']) || empty($data['faqsCategoryId']) ||
            !isset($data['question']) || empty($data['question']) ||
            !isset($data['answer']) || empty($data['answer'])
        ) {
            $this->call(
                400,
                "bad_request",
                "Preencha tudo.",
                "error"
            )->back();
            return;
        }

        $faq = new Faq(
            null,
            $data['faqsCategoryId'],
            $data['question'],
            $data['answer'],
            1
        );
        if (!$faq->insert()) {
            $this->call(500, "internal_server_error", $faq->getErrorMessage(), "error")->back();
            return;
        }


        $response = [
            "id" => $faq->getId(),
            "faqsCategoryId" => $faq->getFaqsCategoryId(),
            "question" => $faq->getQuestion(),
            "answer" => $faq->getAnswer()
        ];

        $this->call(201, "success", "faq inserido com sucesso", "created")->back($response);
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
        if (!filter_var($data["faq_id"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do FAQ é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }

        if (
            empty($data["faqsCategoryId"]) ||
            empty($data["question"]) ||
            empty($data["answer"])
        ) {
            $this->call(
                400,
                "bad_request",
                "Os campos faqsCategoryId, question e answer são obrigatórios",
                "error"
            )->back();
            return;
        }
        $faqAtual = new Faq();
        if (!$faqAtual->selectById($data["faq_id"])) {
            $this->call(
                400,
                "bad_request",
                "Erro a achar faq atual.",
                "error"
            )->back();
            return;
        }
        $faqAtualizado = new Faq(
            null,
            $data["faqsCategoryId"] ?? $faqAtual->getFaqsCategoryId(),
            $data["question"] ?? $faqAtual->getQuestion(),
            $data["answer"] ?? $faqAtual->getAnswer()
        );

        if (!$faqAtualizado->updateById($data["faq_id"])) {
            $this->call(
                500,
                "internal_server_error",
                $faqAtualizado->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        if (!$faqAtualizado->selectById($data["faq_id"])) {
            $this->call(
                500,
                "internal_server_error",
                "Erro ao recuperar FAQ atualizado",
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $faqAtualizado->getId(),
            "faqsCategoryId" => $faqAtualizado->getFaqsCategoryId(),
            "question" => $faqAtualizado->getQuestion(),
            "answer" => $faqAtualizado->getAnswer(),
            "active" => $faqAtualizado->getActive()
        ];

        $this->call(
            200,
            "success",
            "FAQ atualizado com sucesso",
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
        if (!filter_var($data["faq_id"], FILTER_VALIDATE_INT)) {
            $this->call(400, "error", "ID do FAQ é obrigatório e deve ser um número inteiro", "bad_request")->back();
            return;
        }

        $faq = new Faq();

        if (!$faq->softDeleteById($data["faq_id"])) {
            $this->call(404, "error", "FAQ não encontrado", "not_found")->back();
            return;
        }

        $this->call(200, "success", "FAQ removido com sucesso", "success")->back(null);
    }
}