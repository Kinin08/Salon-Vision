<?php

namespace source\Controller;

use Source\Controller\Api;
use Source\Models\Faq;

class Faqs extends Api
{
    public function listAll(): void
    {
        $faq = new Faq();
        $questions = $faq->listAll();
        $this->call(
            200,
            "success",
            "Lista de FAQs",
            "success"
        )->back($questions);
    }
    public function listById(array $data): void
    {
        if(!filter_var($data["faq_id"], FILTER_VALIDATE_INT)){
            $this->call(
                400,
                "bad_request",
                "Id invalido",
                "error"
            )->back();
            return;
        }
        $faq = new Faq();
        $question = $faq->listById($data["faq_id"]);

        if(!$question){
            $this->call(
                404,
                "not_found",
                "Produto nao encontrado",
                "error"
            )->back();
            return;
        }
        $this->call(
            200,
            "success",
            "Produto encontrado pelo id",
            "success"
        )->back($question);
    }
}