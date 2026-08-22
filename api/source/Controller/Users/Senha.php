<?php

namespace Source\Controller\Users;

use Source\Controller\Api;

class Senha extends Api
{

    public function generatePasswordHash(): void
    {

        $senha = "123456";

        $hash = password_hash($senha, PASSWORD_DEFAULT);

        echo $hash;
    }
}