# Company Employee API Documentation

## Endpoints

### Create Employee
- **URL**: `/api/company-employees`
- **Method**: `POST`
- **Request Body Example**:
```json
{
	"company_id": 1,
	"employee_id": "EMP001",
	"lang_id": 1,
	"currency_id": 1,
	"department": 1,
	"designation": 1,
	"qualification": "B.Tech",
	"work_exp": "5 years",
	"name": "John",
	"surname": "Doe",
	"father_name": "Michael Doe",
	"mother_name": "Sarah Doe",
	"contact_no": "+1234567890",
	"emergency_contact_no": "+1987654321",
	"email": "john.doe@example.com",
	"dob": "1990-01-01",
	"marital_status": "Single",
	"date_of_joining": "2023-01-01",
	"local_address": "123 Local St",
	"permanent_address": "456 Permanent Ave",
	"note": "Experienced developer",
	"image": "profile.jpg",
	"password": "securepassword123",
	"gender": "Male",
	"account_title": "John Doe",
	"bank_account_no": "1234567890",
	"bank_name": "Example Bank",
	"ifsc_code": "EXBK0001234",
	"bank_branch": "Main Branch",
	"payscale": "Level 3",
	"basic_salary": 50000,
	"epf_no": "EPF123456",
	"contract_type": "Full-time",
	"shift": "Day",
	"location": "New York",
	"facebook": "facebook.com/johndoe",
	"twitter": "twitter.com/johndoe",
	"linkedin": "linkedin.com/in/johndoe",
	"instagram": "instagram.com/johndoe",
	"resume": "resume.pdf",
	"joining_letter": "joining_letter.pdf",
	"resignation_letter": "",
	"other_document_name": "Certificate",
	"other_document_file": "certificate.pdf",
	"user_id": 1,
	"verification_code": "VC123456",
	"zoom_api_key": "zoom_key_123",
	"zoom_api_secret": "zoom_secret_123"
}
```
- **Response**: 
```json
{
	"message": "Employee created successfully",
	"data": {
		"id": 1
	}
}
```

### Get All Employees
- **URL**: `/api/company-employees`
- **Method**: `GET`
- **Query Parameters**:
  - company_id (optional)
  - department (optional)
  - designation (optional)
  - is_active (optional)
- **Response**:
```json
{
	"data": [
		{
			"id": "integer",
			"company_id": "integer",
			"name": "string",
			"email": "string"
		}
	]
}
```

### Get Employees by Company ID
- **URL**: `/api/company-employees/company/:companyId`
- **Method**: `GET`
- **Response**:
```json
{
	"data": [
		{
			"id": "integer",
			"name": "string",
			"email": "string"
		}
	]
}
```

### Get Employee by ID
- **URL**: `/api/company-employees/:id`
- **Method**: `GET`
- **Response**:
```json
{
	"data": {
		"id": "integer",
		"name": "string",
		"email": "string"
	}
}
```

### Update Employee
- **URL**: `/api/company-employees/:id`
- **Method**: `PUT`
- **Request Body**: Any employee fields that need to be updated
- **Response**:
```json
{
	"message": "Employee updated successfully"
}
```

### Delete Employee
- **URL**: `/api/company-employees/:id`
- **Method**: `DELETE`
- **Response**:
```json
{
	"message": "Employee deleted successfully"
}
```

### Employee Login
- **URL**: `/api/company-employees/login`
- **Method**: `POST`
- **Request Body**:
```json
{
	"email": "string",
	"password": "string"
}
```
- **Response**:
```json
{
	"message": "Login successful",
	"data": {
		"token": "string",
		"employee": {
			"id": "integer",
			"name": "string",
			"email": "string"
		}
	}
}
```




