# API Documentation

## Overview
This document outlines the structure, endpoints, and usage of the API, designed for managing purchases, stock, and other related operations. Each endpoint includes a description, method, required parameters, and example responses.

---

## Authentication
No authentication is currently implemented. All endpoints are publicly accessible.

---

## Endpoints

### 1. Materials (`/materiais.php`)
#### Add Material
- **Method:** POST
- **Description:** Adds a new material.
- **Request Body:**
  ```json
  {
    "nome": "Material Name",
    "quantidade": 100
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Material added successfully."
  }
  ```

#### List Materials
- **Method:** GET
- **Description:** Retrieves a list of all materials with their quantities.
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      { "id": 1, "nome": "Material 1", "quantidade": 100 },
      { "id": 2, "nome": "Material 2", "quantidade": 200 }
    ]
  }
  ```

#### Update Material
- **Method:** PUT
- **Description:** Updates a material's name or quantity.
- **Request Body:**
  ```json
  {
    "id": 1,
    "nome": "Updated Name",
    "quantidade": 150
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Material updated successfully."
  }
  ```

---

### 2. Purchases (`/compras.php`)
#### Add Purchase
- **Method:** POST
- **Description:** Adds a new purchase and updates stock.
- **Request Body:**
  ```json
  {
    "material_id": 1,
    "quantidade": 50,
    "valor": 200.00
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Purchase registered and stock updated successfully."
  }
  ```

#### List Purchases
- **Method:** GET
- **Description:** Retrieves a list of all purchases.
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      { "id": 1, "material": "Material 1", "quantidade": 50, "valor": 200.00, "data": "2023-01-01 12:00:00" }
    ]
  }
  ```

#### Delete Purchase
- **Method:** DELETE
- **Description:** Deletes a purchase, updates stock, and logs the exclusion.
- **Request Body:**
  ```json
  {
    "id": 1,
    "motivo": "Correction",
    "usuario_logado": "admin"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Purchase deleted and stock updated."
  }
  ```

---

### 3. Stock (`/estoque.php`)
#### Add Stock Entry
- **Method:** POST
- **Description:** Adds stock for a material.
- **Request Body:**
  ```json
  {
    "material_id": 1,
    "quantidade": 50
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Stock updated successfully."
  }
  ```

#### List Stock
- **Method:** GET
- **Description:** Retrieves stock information for all materials or a specific material.
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      { "id": 1, "nome": "Material 1", "quantidade": 150 }
    ]
  }
  ```

---

### 4. Exclusions (`/exclusoes.php`)
#### Add Exclusion
- **Method:** POST
- **Description:** Logs an exclusion for purchases or financial outputs.
- **Request Body:**
  ```json
  {
    "tipo": "compras",
    "referencia": 1,
    "motivo": "Correction",
    "usuario_logado": "admin"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Exclusion logged successfully."
  }
  ```

#### List Exclusions
- **Method:** GET
- **Description:** Retrieves all logged exclusions.
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      { "tipo": "compras", "referencia": 1, "motivo": "Correction", "valor": 200.00, "usuario_logado": "admin", "data": "2023-01-01 12:00:00" }
    ]
  }
  ```

---

### 5. Reports (`/relatorios.php`)
#### Purchases Report
- **Method:** GET
- **Query Parameter:** `?tipo=compras`
- **Description:** Provides total quantities and values of purchases.
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "total_quantidade": 100,
      "total_valor": 500.00
    }
  }
  ```

#### Financial Outputs Report
- **Method:** GET
- **Query Parameter:** `?tipo=saidas`
- **Description:** Provides total values of financial outputs.
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "total_valor": 300.00
    }
  }
  ```

#### Stock Report
- **Method:** GET
- **Query Parameter:** `?tipo=estoque`
- **Description:** Provides a summary of stock levels.
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      { "nome": "Material 1", "quantidade_total": 150 }
    ]
  }
  ```

---

## Notes
- All endpoints return JSON responses.
- Ensure proper data validation on the client-side before sending requests.
- CORS is enabled, but restrict to specific origins for production.

