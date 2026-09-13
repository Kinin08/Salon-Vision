<?php

namespace Source\Controller\ServicesEmployees;

use Source\Controller\Api;
use Source\Models\ServiceEmployee\ServiceEmployee;
use Source\Models\Service\Service;
use Source\Models\User\User;

class ServicesEmployees extends Api
{
    public function listByService(array $data): void
    {
        if (
            !isset($data["serviceId"]) ||
            !filter_var($data["serviceId"], FILTER_VALIDATE_INT)
        ) {
            $this->call(
                400,
                "bad_request",
                "serviceId é obrigatório",
                "error"
            )->back();

            return;
        }

        $serEm = new ServiceEmployee();

        $employees = $serEm->listByService(
            (int) $data["serviceId"]
        );

        $this->call(
            200,
            "success",
            "Funcionários do serviço",
            "success"
        )->back($employees);
    }
    public function listAll(): void
    {
        $serEm = new ServiceEmployee();

        $this->call(
            200,
            "success",
            "Lista de serviços e funcionários",
            "success"
        )->back(
                $serEm->selectAll([
                    "active = 1"
                ])
            );
    }

    public function listById(array $data): void
    {
        if (
            !isset($data["serviceEmployeeId"]) ||
            empty($data["serviceEmployeeId"]) ||
            !filter_var($data["serviceEmployeeId"], FILTER_VALIDATE_INT)
        ) {
            $this->call(
                400,
                "bad_request",
                "ID do ServiceEmployee é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);

            return;
        }

        $serEm = new ServiceEmployee();

        if (
            !$serEm->selectById($data["serviceEmployeeId"]) ||
            $serEm->getActive() != 1
        ) {
            $this->call(
                404,
                "not_found",
                "ServiceEmployee não encontrado",
                "error"
            )->back(null);

            return;
        }

        $response = [
            "id" => $serEm->getId(),
            "serviceId" => $serEm->getServiceId(),
            "employeeId" => $serEm->getEmployeeId()
        ];

        $this->call(
            200,
            "success",
            "ServiceEmployee encontrado",
            "success"
        )->back($response);
    }

    public function create(array $data): void
    {
        if (!$this->validate($data)) {
            $this->call(
                400,
                "bad_request",
                "Os campos serviceId e employeeId são obrigatórios",
                "error"
            )->back();

            return;
        }
        $service = new Service();

        if (!$service->selectById($data["serviceId"])) {
            $this->call(
                404,
                "not_found",
                "O serviceId informado não existe",
                "error"
            )->back();

            return;
        }

        $employee = new User();

        if (!$employee->selectById($data["employeeId"])) {
            $this->call(
                404,
                "not_found",
                "O employeeId informado não existe",
                "error"
            )->back();

            return;
        }

        if ($employee->getUserTypeId() != 5) {
            $this->call(
                400,
                "bad_request",
                "O usuário informado não é um funcionário",
                "error"
            )->back();

            return;
        }

        $serEm = new ServiceEmployee();

        $exists = $serEm->selectAll([
            "service_id = {$data["serviceId"]}",
            "employee_id = {$data["employeeId"]}"
        ]);

        if (!empty($exists)) {
            $this->call(
                400,
                "bad_request",
                "Este funcionário já está vinculado a este serviço",
                "error"
            )->back();

            return;
        }

        $serEm = new ServiceEmployee(
            null,
            $data["serviceId"],
            $data["employeeId"],
            1
        );

        if (!$serEm->insert()) {
            $this->call(
                500,
                "internal_server_error",
                $serEm->getErrorMessage(),
                "error"
            )->back();

            return;
        }

        $this->call(
            201,
            "success",
            "Funcionário vinculado ao serviço com sucesso",
            "success"
        )->back([
                    "id" => $serEm->getId(),
                    "serviceId" => $serEm->getServiceId(),
                    "employeeId" => $serEm->getEmployeeId()
                ]);
    }

    public function update(array $data): void
    {
        if (
            !isset($data["serviceEmployeeId"]) ||
            !filter_var($data["serviceEmployeeId"], FILTER_VALIDATE_INT)
        ) {
            $this->call(
                400,
                "bad_request",
                "ID do ServiceEmployee é obrigatório e deve ser um número inteiro",
                "error"
            )->back();

            return;
        }

        if (
            empty($data["serviceId"]) &&
            empty($data["employeeId"])
        ) {
            $this->call(
                400,
                "bad_request",
                "Os campos serviceId e employeeId são obrigatórios",
                "error"
            )->back();

            return;
        }

        $serEm = new ServiceEmployee();

        if (!$serEm->selectById($data["serviceEmployeeId"])) {
            $this->call(
                404,
                "not_found",
                "ServiceEmployee não encontrado",
                "error"
            )->back();

            return;
        }
        if (!empty($data["serviceId"])) {
            $serEm->setServiceId((int) $data["serviceId"]);
        }

        if (!empty($data["employeeId"])) {
            $serEm->setEmployeeId((int) $data["employeeId"]);
        }

        if (!$serEm->updateById($data["serviceEmployeeId"])) {
            $this->call(
                500,
                "internal_server_error",
                $serEm->getErrorMessage(),
                "error"
            )->back();

            return;
        }

        $this->call(
            200,
            "success",
            "ServiceEmployee atualizado com sucesso",
            "success"
        )->back([
                    "id" => $serEm->getId(),
                    "serviceId" => $serEm->getServiceId(),
                    "employeeId" => $serEm->getEmployeeId()
                ]);
    }

    public function softDelete(array $data): void
    {
        $id = $data["serviceEmployeeId"] ?? null;

        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do ServiceEmployee é obrigatório e deve ser um número inteiro",
                "error"
            )->back();

            return;
        }

        $serEm = new ServiceEmployee();

        if (!$serEm->softDeleteById($id)) {
            $this->call(
                404,
                "not_found",
                "ServiceEmployee não encontrado",
                "error"
            )->back();

            return;
        }

        $this->call(
            200,
            "success",
            "ServiceEmployee removido com sucesso",
            "success"
        )->back(null);
    }

    public function validate(array $data): bool
    {
        if (
            !isset($data["serviceId"]) ||
            !isset($data["employeeId"]) ||
            empty($data["serviceId"]) ||
            empty($data["employeeId"]) ||
            !filter_var($data["serviceId"], FILTER_VALIDATE_INT) ||
            !filter_var($data["employeeId"], FILTER_VALIDATE_INT)
        ) {
            return false;
        }

        return true;
    }
}
