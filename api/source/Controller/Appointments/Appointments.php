<?php

namespace Source\Controller\Appointments;

use Source\Controller\Api;
use Source\Models\Appointment\Appointment;
use Source\Models\User\User;
use Source\Core\JWTToken;

class Appointments extends Api
{
    private ?array $bodyCache = null;

    private function mergeBody(array $data): array
    {
        if ($this->bodyCache === null) {
            $this->bodyCache = json_decode(file_get_contents("php://input"), true) ?? [];
        }
        return array_merge($this->bodyCache, $data);
    }
    public function history(): void
    {
        $userId = $this->authToken(4);

        if (!$userId) {
            $this->call(
                401,
                "unauthorized",
                "Usuário não autenticado",
                "error"
            )->back();
            return;
        }

        $appointment = new Appointment();

        $this->call(
            200,
            "success",
            "Histórico encontrado",
            "success"
        )->back(
                $appointment->historic($userId)
            );
    }
    public function listAll(): void
    {
        $appointment = new Appointment();

        $this->call(
            200,
            "success",
            "Lista de FAQs",
            "success"
        )->back($appointment->selectAll());
    }

    public function listById(array $data): void
    {

        if (!isset($data["appointmentId"]) || empty($data["appointmentId"]) || !filter_var($data["appointmentId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do appointment é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }
        $appointment = new Appointment();
        if (!$appointment->selectById($data["appointmentId"])) {
            $this->call(
                404,
                "not_found",
                "FAQ não encontrado",
                "error"
            )->back(null);
            return;
        }

        $response = [
            "id" => $appointment->getId(),
            "clientId" => $appointment->getClientId(),
            "employeeId" => $appointment->getEmployeeId(),
            "serviceId" => $appointment->getServiceId(),
            "dateTime" => $appointment->getDateTime(),
            "rating" => $appointment->getRating(),
            "comment" => $appointment->getComment(),
            "status" => $appointment->getStatus(),
        ];

        $this->call(200, "success", "appointment encontrado", "success")->back($response);

    }
    public function create(array $data)
    {
        $data = $this->mergeBody($data);

        if (
            !isset($data['clientId']) || empty($data['clientId']) ||
            !isset($data['employeeId']) || empty($data['employeeId']) ||
            !isset($data['serviceId']) || empty($data['serviceId']) ||
            !isset($data['dateTime']) || empty($data['dateTime'])
        ) {
            $this->call(
                400,
                "bad_request",
                "Preencha tudo.",
                "error"
            )->back();
            return;
        }

        $client = new User();

        if (
            !$client->selectById($data['clientId']) ||
            $client->getUserTypeId() != 4
        ) {
            $this->call(
                400,
                "bad_request",
                "Cliente inválido.",
                "error"
            )->back();
            return;
        }

        $employee = new User();

        if (
            !$employee->selectById($data['employeeId']) ||
            $employee->getUserTypeId() != 5
        ) {
            $this->call(
                400,
                "bad_request",
                "Funcionário inválido.",
                "error"
            )->back();
            return;
        }

        $dateTime = $data['dateTime'] ?? null;
        if (!\DateTime::createFromFormat('Y-m-d H:i:s', $dateTime)) {
            $this->call(
                400,
                "bad_request",
                "Formato inválido. Use YYYY-MM-DD HH:MM:SS.",
                "error"
            )->back();
            return;
        }
        if (!$dateTime) {
            $this->call(
                400,
                "bad_request",
                "Data e hora são obrigatórias.",
                "error"
            )->back();
            return;
        }

        if (strtotime($dateTime) < time()) {
            $this->call(
                400,
                "bad_request",
                "A data do agendamento deve ser maior que a data atual.",
                "error"
            )->back();
            return;
        }
        $appointment = new Appointment(
            null,
            $data['clientId'],
            $data['employeeId'],
            $data['serviceId'],
            $data['dateTime'],
            $data['rating'] ?? 1,
            $data['comment'] ?? null,
        );

        $exists = $appointment->selectAll([
            "employee_id = {$data['employeeId']}",
            "date_time = '{$data['dateTime']}'"
        ]);

        if (!empty($exists)) {
            $this->call(
                400,
                "bad_request",
                "Já existe um agendamento para este funcionário neste horário.",
                "error"
            )->back();
            return;
        }
        if (!$appointment->insert()) {
            $this->call(500, "internal_server_error", $appointment->getErrorMessage(), "error")->back();
            return;
        }

        $response = [
            "id" => $appointment->getId(),
            "clientId" => $appointment->getClientId(),
            "employeeId" => $appointment->getEmployeeId(),
            "serviceId" => $appointment->getServiceId(),
            "dateTime" => $appointment->getDateTime(),
            "comment" => $appointment->getComment(),
            "status" => $appointment->getStatus(),
        ];

        $this->call(201, "success", "appointment inserido com sucesso", "created")->back($response);
    }
    public function update(array $data): void
    {
        $data = $this->mergeBody($data);

        if (
            !isset($data["appointmentId"]) ||
            !filter_var($data["appointmentId"], FILTER_VALIDATE_INT)
        ) {
            $this->call(
                400,
                "bad_request",
                "ID do appointment é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }
        $appointmentAtual = new Appointment();

        if (!$appointmentAtual->selectById($data["appointmentId"])) {
            $this->call(
                404,
                "not_found",
                "Agendamento não encontrado",
                "error"
            )->back();
            return;
        }
        if (isset($data['dateTime'])) {

            if (
                !\DateTime::createFromFormat(
                    'Y-m-d H:i:s',
                    $data['dateTime']
                )
            ) {
                $this->call(
                    400,
                    "bad_request",
                    "Formato inválido. Use YYYY-MM-DD HH:MM:SS.",
                    "error"
                )->back();
                return;
            }

            if (strtotime($data['dateTime']) < time()) {
                $this->call(
                    400,
                    "bad_request",
                    "A data do agendamento deve ser maior que a data atual.",
                    "error"
                )->back();
                return;
            }
        }

        $clientId = $data['clientId'] ?? $appointmentAtual->getClientId();
        $employeeId = $data['employeeId'] ?? $appointmentAtual->getEmployeeId();
        $client = new User();

        if (
            !$client->selectById($clientId) ||
            $client->getUserTypeId() != 4
        ) {
            $this->call(
                400,
                "bad_request",
                "Cliente inválido.",
                "error"
            )->back();
            return;
        }

        $employee = new User();

        if (
            !$employee->selectById($employeeId) ||
            $employee->getUserTypeId() != 5
        ) {
            $this->call(
                400,
                "bad_request",
                "Funcionário inválido.",
                "error"
            )->back();
            return;
        }
        $statusPermitidos = [
            'scheduled',
            'confirmed',
            'in_progress',
            'completed',
            'canceled'
        ];

        if (
            isset($data['status']) &&
            !in_array($data['status'], $statusPermitidos, true)
        ) {
            $this->call(
                400,
                "bad_request",
                "Status inválido.",
                "error"
            )->back();
            return;
        }

        $appointment = new Appointment(
            null,
            $clientId,
            $employeeId,
            $data['serviceId'] ?? $appointmentAtual->getServiceId(),
            $data['dateTime'] ?? $appointmentAtual->getDateTime(),
            $data['rating'] ?? $appointmentAtual->getRating(),
            $data['comment'] ?? $appointmentAtual->getComment(),
            $appointmentAtual->getActive(),
            $data['status'] ?? $appointmentAtual->getStatus()
        );

        if (!$appointment->updateById($data["appointmentId"])) {
            $this->call(
                500,
                "internal_server_error",
                $appointment->getErrorMessage(),
                "error"
            )->back();
            return;
        }

        $appointmentAtualizado = new appointment();

        if (!$appointmentAtualizado->selectById($data["appointmentId"])) {
            $this->call(
                500,
                "internal_server_error",
                "Erro ao recuperar appointment atualizado",
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $appointmentAtualizado->getId(),
            "clientId" => $appointmentAtualizado->getClientId(),
            "employeeId" => $appointmentAtualizado->getEmployeeId(),
            "serviceId" => $appointmentAtualizado->getServiceId(),
            "dateTime" => $appointmentAtualizado->getDateTime(),
            "rating" => $appointmentAtualizado->getRating(),
            "comment" => $appointmentAtualizado->getComment(),
            "status" => $appointmentAtualizado->getStatus()
        ];

        $this->call(
            200,
            "success",
            "appointment atualizado com sucesso",
            "success"
        )->back($response);
    }
    public function softDelete(array $data): void
    {
        $data = $this->mergeBody($data);

        if (!filter_var($data["appointmentId"], FILTER_VALIDATE_INT)) {
            $this->call(400, "error", "ID do appointment é obrigatório e deve ser um número inteiro", "bad_request")->back();
            return;
        }

        $appointmentId = $data["appointmentId"];

        $appointment = new Appointment();
        $atual = $appointment->findById($appointmentId);

        if (!$atual) {
            $this->call(404, "error", "Appointment não existe", "not_found")->back();
            return;
        }

        if ($atual['status'] === 'canceled') {
            $this->call(400, "error", "O appointment já foi cancelado", "bad_request")->back();
            return;
        }

        if (!$appointment->softDeleteById($appointmentId)) {
            $this->call(400, "error", "O appointment não pode ser cancelado", "bad_request")->back();
            return;
        }

        $this->call(200, "success", "appointment removido com sucesso", "success")->back(null);
    }
}