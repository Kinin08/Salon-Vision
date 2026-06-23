<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
// timezone para São Paulo América
date_default_timezone_set('America/Sao_Paulo');

ob_start();

require  __DIR__ . "/vendor/autoload.php";

// os headers abaixo são necessários para permitir o acesso à API por clientes externos ao domínio
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Credentials: true'); // Permitir credenciais

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use CoffeeCode\Router\Router;

$route = new Router(url("api"),":");

$route->namespace("Source\Controller");

$route->group("/products");
$route->get("/list", "Products\\Products:productsList");
$route->get("/list/{productId}", "Products\\Products:productById");
$route->post("/", "Products\\Products:create");
$route->put("/{product_id}", "Products\\Products:update");
$route->delete("/{product_id}", "Products\\Products:softDelete");
$route->group(null);

$route->group("/products_categories");
$route->get("/list/{categoryId}", "Products\\ProductsCategories:categoryFindById");
$route->get("/list", "Products\\ProductsCategories:productsCategoryList");
$route->post("/", "Products\\ProductsCategories:create");
$route->group(null);

$route->group("/faqsCategories");
$route->get("/list", "Faqs\\FaqsCategories:listAll");
$route->get("/list/{faqCategorieId}", "Faqs\\FaqsCategories:listById");
$route->post("/", "Faqs\\FaqsCategories:create");
$route->put("/{faqCategorieId}", "Faqs\\FaqsCategories:update");
$route->delete("/{faqCategorieId}", "Faqs\\FaqsCategories:softDelete");
$route->group(null);

$route->group("/faqs");
$route->get("/list", "Faqs\\Faqs:listAll");
$route->get("/listFaq", "Faqs\\Faqs:selectFaq");
$route->get("/list/{faq_id}", "Faqs\\Faqs:listById");
$route->post("/create", "Faqs\\Faqs:create");
$route->put("/{faq_id}", "Faqs\\Faqs:update");
$route->delete("/{faq_id}", "Faqs\\Faqs:softDelete");
$route->group(null);

$route->group("/users");
$route->get("/profile", "Users\\Users:profile");
$route->get("/list", "Users\\Users:listAll");
$route->get("/employee", "Users\\Users:listEmployee");
$route->get("/cliente", "Users\\Users:listCliente");
$route->get("/admin", "Users\\Users:listAdmin");
$route->post("/register", "Users\\Users:register");
$route->post("/login", "Users\\Users:login");
$route->post("/login/admin", "Users\\Users:loginAdmin");
$route->post("/login/employee", "Users\\Users:loginEmployee");
$route->put("/update", "Users\\Users:update");
$route->put("/update/admin/{user_id}", "Users\\Users:updateAdmin");
$route->put("/update/employee/{user_id}", "Users\\Users:updateEmployee");
$route->put("/roleFunc/{user_id}", "Users\\Users:roleFunc");
$route->put("/roleCliente/{user_id}", "Users\\Users:roleCliente");
$route->put("/roleAdmin/{user_id}", "Users\\Users:roleAdmin");
$route->delete("/delete/{user_id}", "Users\\Users:softDelete");
$route->group(null);

$route->group("/appointments");
$route->get("/my", "Appointments\\Appointments:history");
$route->get("/history", "Appointments\\Appointments:history");
$route->get("/listAll", "Appointments\\Appointments:listAll");
$route->get("/list/{appointmentId}", "Appointments\\Appointments:listById");
$route->post("/create", "Appointments\\Appointments:create");
$route->put("/update/{appointmentId}", "Appointments\\Appointments:update");
$route->delete("/delete/{appointmentId}", "Appointments\\Appointments:softDelete");
$route->group(null);

$route->group("/services");
$route->get("/list", "Services\\Services:listAll");
$route->get("/list/{serviceId}", "Services\\Services:listById");
$route->post("/create", "Services\\Services:create");
$route->put("/update/{serviceId}", "Services\\Services:update");
$route->delete("/delete/{serviceId}", "Services\\Services:softDelete");
$route->group(null);

// Fim - Exercícios - Desafios

$route->dispatch();

/** ERROR REDIRECT */
if ($route->error()) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(404);

    echo json_encode([
        "code" => 404,
        "type" => "error",
        "status" => "not_found",
        "message" => "O recurso solicitado não existe."
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

ob_end_flush();