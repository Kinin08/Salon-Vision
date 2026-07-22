<?php

namespace Source\Controller\Services;

use Source\Controller\Api;
use Source\Models\Service\Service;
use Source\Core\JWTToken;

class Services extends Api
{
    public function listAll(): void
    {
        $service = new Service();

        $this->call(
            200,
            "success",
            "Lista de service",
            "success"
        )->back($service->selectAll());
    }

    public function listById(array $data): void
    {

        if (!isset($data["serviceId"]) || empty($data["serviceId"]) || !filter_var($data["serviceId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do service é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }
        $service = new Service();
        if (!$service->selectById($data["serviceId"])) {
            $this->call(
                404,
                "not_found",
                "service não encontrado",
                "error"
            )->back(null);
            return;
        }

        $response = [
            "id" => $service->getId(),
            "name" => $service->getName(),
            "description" => $service->getDescription(),
            "durationMinutes" => $service->getDurationMinutes(),
            "active" => $service->getActive()
        ];

        $this->call(200, "success", "service encontrado", "success")->back($response);

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
            !isset($data['name']) || empty($data['name']) ||
            !isset($data['description']) || empty($data['description']) ||
            !isset($data['price']) || empty($data['price']) ||
            !isset($data['durationMinutes']) || empty($data['durationMinutes'])
        ) {
            $this->call(
                400,
                "bad_request",
                "Preencha tudo.",
                "error"
            )->back();
            return;
        }

        $service = new Service(
            null,
            $data['name'],
            $data['description'],
            $data['price'],
            $data['durationMinutes']
        );
        if (!$service->insert()) {
            $this->call(500, "internal_server_error", $service->getErrorMessage(), "error")->back();
            return;
        }


        $response = [
            "id" => $service->getId(),
            "name" => $service->getName(),
            "description" => $service->getDescription(),
            "price" => $service->getPrice(),
            "durationMinutes" => $service->getDurationMinutes()
        ];

        $this->call(201, "success", "service inserido com sucesso", "created")->back($response);
    }
    public function update(array $data): void
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
            !isset($data["serviceId"]) ||
            !filter_var($data["serviceId"], FILTER_VALIDATE_INT)
        ) {
            $this->call(400, "bad_request", "ID inválido", "error")->back();
            return;
        }

        $service = new Service();

        if (!$service->selectById($data["serviceId"])) {
            $this->call(404, "not_found", "Service não encontrado", "error")->back();
            return;
        }

        $serviceAtual = new Service();

        if (!$serviceAtual->selectById($data["serviceId"])) {
            $this->call(
                400,
                "bad_request",
                "Erro a achar faq atual.",
                "error"
            )->back();
            return;
        }

        $service = new Service(
            null,
            $data['name'] ?? $serviceAtual->getName(),
            $data['description'] ?? $serviceAtual->getDescription(),
            $data['price'] ?? $serviceAtual->getPrice(),
            $data['durationMinutes'] ?? $serviceAtual->getDurationMinutes()
        );
        
        if (!$service->updateById($data["serviceId"])) {
            $this->call(500, "internal_server_error", $service->getErrorMessage(), "error")->back();
            return;
        }

        $updated = new Service();

        if (!$updated->selectById($data["serviceId"])) {
            $this->call(500, "error", "Erro ao recuperar service atualizado", "error")->back();
            return;
        }

        $response = [
            "id" => $updated->getId(),
            "name" => $updated->getName(),
            "description" => $updated->getDescription(),
            "price" => $updated->getPrice(),
            "durationMinutes" => $updated->getDurationMinutes()
        ];

        $this->call(200, "success", "Service atualizado com sucesso", "success")->back($response);
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


        if (!filter_var($data["serviceId"], FILTER_VALIDATE_INT)) {
            $this->call(400, "error", "ID do service é obrigatório e deve ser um número inteiro", "bad_request")->back();
            return;
        }
        $service = new Service();

        if (!$service->selectById($data["serviceId"])) {
            $this->call(404, "error", "service não existe", "not_found")->back();
            return;
        }
        if (!$service->softDeleteById($data["serviceId"])) {
            $this->call(
                400,
                "error",
                "O service não pode ser cancelado",
                "bad_request"
            )->back();
            return;
        }

        $this->call(200, "success", "service removido com sucesso", "success")->back(null);
    }
}