# Test Cases – Agri Transport

## Authentication

| ID | Test Case | Expected Result |
|---|---|---|
| TC01 | Login with valid credentials | User should be redirected to the dashboard |
| TC02 | Login with invalid password | Appropriate error message should be displayed |
| TC03 | Login with empty email | Validation message should be displayed |
| TC04 | Login with empty password | Validation message should be displayed |

## Farmer Module

| ID | Test Case | Expected Result |
|---|---|---|
| TC05 | Add product with valid details | Product should be added successfully |
| TC06 | Add product with missing required fields | Validation message should be displayed |
| TC07 | View existing products | Available products should be displayed |

## Buyer Module

| ID | Test Case | Expected Result |
|---|---|---|
| TC08 | Browse available products | Products should be displayed |
| TC09 | Place an order for a valid product | Order should be created successfully |
| TC10 | View order status | Correct order status should be displayed |

## Delivery Module

| ID | Test Case | Expected Result |
|---|---|---|
| TC11 | View available delivery requests | Available requests should be displayed |
| TC12 | Accept a delivery request | Request should be assigned successfully |
| TC13 | Update delivery status | Updated status should be reflected |

## Authorization

| ID | Test Case | Expected Result |
|---|---|---|
| TC14 | Farmer accesses buyer functionality | Access should be restricted |
| TC15 | Buyer accesses farmer functionality | Access should be restricted |
