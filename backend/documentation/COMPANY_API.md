# Company API Documentation

This API provides endpoints to manage company information and authentication.

## Available Fields

### Required Fields
- `username` (string, unique): Company's unique username
- `password` (string): Company's password
- `company_name` (string): Official name of the company

### Optional Fields
#### Basic Information
- `trading_name` (string): Business trading name
- `registration_number` (string, unique): Company registration number
- `tax_number` (string): Tax identification number
- `industry` (string): Company's industry sector
- `founded_date` (date): Company foundation date
- `company_type` (string): Type of company (e.g., LLC, Corporation)

#### Contact Information
- `email` (string): Primary email address
- `phone` (string): Primary phone number
- `fax` (string): Fax number
- `website` (string): Company website URL

#### Social Media
- `social_media_linkedin` (string): LinkedIn profile URL
- `social_media_twitter` (string): Twitter profile URL
- `social_media_facebook` (string): Facebook profile URL

#### Address Information
- `street_address` (string): Physical street address
- `building_name` (string): Building name
- `floor_number` (string): Floor number
- `city` (string): City
- `state` (string): State/Province
- `country` (string): Country
- `postal_code` (string): Postal/ZIP code

#### Mailing Address
- `mailing_address` (string): Mailing address if different from physical
- `mailing_city` (string): Mailing city
- `mailing_state` (string): Mailing state
- `mailing_country` (string): Mailing country
- `mailing_postal_code` (string): Mailing postal code

#### Contact Persons
- `contact_person_name` (string): Primary contact name
- `contact_person_position` (string): Primary contact position
- `contact_person_email` (string): Primary contact email
- `contact_person_phone` (string): Primary contact phone
- `contact_person_mobile` (string): Primary contact mobile
- `secondary_contact_name` (string): Secondary contact name
- `secondary_contact_position` (string): Secondary contact position
- `secondary_contact_email` (string): Secondary contact email
- `secondary_contact_phone` (string): Secondary contact phone

#### Business Details
- `employee_count` (integer): Number of employees
- `annual_revenue` (decimal): Annual revenue
- `company_description` (text): Company description
- `business_hours` (string): Operating hours
- `year_end_date` (date): Financial year end date

#### Banking Information
- `bank_name` (string): Bank name
- `bank_account_name` (string): Bank account name
- `bank_account_number` (string): Bank account number
- `bank_swift_code` (string): Bank SWIFT code

#### Additional Information
- `logo_url` (string): Company logo URL
- `parent_company_name` (string): Parent company name
- `subsidiary_companies` (text): List of subsidiary companies
- `operation_countries` (json): Countries of operation
- `languages_spoken` (json): Languages used in business
- `certifications` (text): Company certifications
- `licenses` (text): Company licenses

#### Status and Compliance
- `status` (string): Company status (default: 'active')
- `listing_status` (string): Public/Private status
- `credit_rating` (string): Credit rating
- `compliance_status` (string): Compliance status
- `last_audit_date` (date): Last audit date
- `license_renewal_date` (date): License renewal date

#### Insurance Information
- `insurance_renewal_date` (date): Insurance renewal date
- `insurance_provider` (string): Insurance provider name
- `insurance_policy_number` (string): Insurance policy number
- `insurance_expiry_date` (date): Insurance expiry date

#### Security and Verification
- `is_verified` (boolean): Verification status
- `verification_date` (date): Date of verification
- `two_factor_enabled` (boolean): 2FA status
- `two_factor_secret` (string): 2FA secret key
- `backup_codes` (json): 2FA backup codes

#### System Fields
- `created_at` (timestamp): Record creation date
- `updated_at` (timestamp): Last update date
- `created_by` (string): Creator identifier
- `updated_by` (string): Last updater identifier

## Field Constraints and Validation

### Unique Constraints
- `username`: Must be unique across all companies
- `registration_number`: Must be unique if provided

### Field Length Constraints
- `username`: Maximum 100 characters
- `company_name`: Maximum 255 characters
- `trading_name`: Maximum 255 characters
- `registration_number`: Maximum 100 characters
- `tax_number`: Maximum 100 characters
- `industry`: Maximum 100 characters
- `company_type`: Maximum 50 characters
- `email`: Maximum 255 characters
- `phone`: Maximum 50 characters
- `fax`: Maximum 50 characters
- `website`: Maximum 255 characters
- `social_media_*`: Maximum 255 characters each
- `building_name`: Maximum 100 characters
- `floor_number`: Maximum 20 characters
- `postal_code`: Maximum 20 characters
- `contact_person_position`: Maximum 100 characters
- `bank_swift_code`: Maximum 20 characters

### Default Values
- `status`: Defaults to 'active'
- `is_verified`: Defaults to false
- `two_factor_enabled`: Defaults to false
- `created_at`: Automatically set to current timestamp
- `updated_at`: Automatically updated on record modification

### Data Types
- `employee_count`: Integer
- `annual_revenue`: Decimal with 2 decimal places
- `founded_date`: Date format (YYYY-MM-DD)
- `year_end_date`: Date format (YYYY-MM-DD)
- `operation_countries`: JSON array
- `languages_spoken`: JSON array
- `backup_codes`: JSON array

## Test Payloads

### 1. Create Company
#### Minimal Payload
```json
{
	"username": "testcompany",
	"password": "Test@123",
	"company_name": "Test Company Ltd",
	"industry": "Technology"
}
```

#### Complete Payload
```json
{
	"username": "testcompany",
	"password": "Test@123",
	"company_name": "Test Company Ltd",
	"trading_name": "TCL",
	"industry": "Technology",
	"email": "contact@testcompany.com",
	"phone": "+1234567890",
	"website": "https://testcompany.com",
	"company_type": "LLC",
	"registration_number": "REG123456",
	"tax_number": "TAX123456",
	"founded_date": "2024-01-01",
	"contact_person_name": "John Doe",
	"contact_person_email": "john@testcompany.com",
	"contact_person_phone": "+1234567891",
	"contact_person_position": "CEO",
	"contact_person_mobile": "+1234567892",
	"street_address": "123 Business Street",
	"building_name": "Tech Tower",
	"floor_number": "15",
	"city": "Tech City",
	"state": "Tech State",
	"country": "Tech Country",
	"postal_code": "12345",
	"mailing_address": "PO Box 12345",
	"mailing_city": "Tech City",
	"mailing_state": "Tech State",
	"mailing_country": "Tech Country",
	"mailing_postal_code": "12345",
	"employee_count": 100,
	"annual_revenue": 1000000.00,
	"company_description": "Leading technology company",
	"business_hours": "9:00 AM - 6:00 PM",
	"bank_name": "Tech Bank",
	"bank_account_name": "Test Company Ltd",
	"bank_account_number": "1234567890",
	"bank_swift_code": "TECHBANK123",
	"logo_url": "https://testcompany.com/logo.png",
	"social_media_linkedin": "https://linkedin.com/company/testcompany",
	"social_media_twitter": "https://twitter.com/testcompany",
	"social_media_facebook": "https://facebook.com/testcompany",
	"status": "active",
	"listing_status": "private",
	"credit_rating": "A+",
	"compliance_status": "compliant",
	"is_verified": false
}
```

### 2. Update Company
#### Basic Update
```json
{
	"company_name": "Test Company Ltd Updated",
	"industry": "Software",
	"email": "newcontact@testcompany.com",
	"status": "active"
}
```

#### Full Update
```json
{
	"company_name": "Test Company Ltd Updated",
	"trading_name": "TCLU",
	"industry": "Software",
	"email": "newcontact@testcompany.com",
	"phone": "+1234567899",
	"website": "https://testcompany-updated.com",
	"contact_person_name": "Jane Doe",
	"contact_person_position": "CTO",
	"contact_person_email": "jane@testcompany.com",
	"contact_person_phone": "+1234567892",
	"employee_count": 150,
	"annual_revenue": 1500000.00,
	"company_description": "Leading software development company",
	"business_hours": "8:00 AM - 5:00 PM",
	"status": "active",
	"listing_status": "public",
	"credit_rating": "AA",
	"compliance_status": "compliant"
}
```

### 3. Password Management
#### Request Password Reset
```json
{
	"username": "testcompany"
}
```

#### Reset Password
```json
{
	"username": "testcompany",
	"newPassword": "NewTest@123"
}
```

### 4. Filtering Examples
#### By Status
```
GET /api/companies?status=active
```

#### By Industry
```
GET /api/companies?industry=Technology
```

#### Combined Filters
```
GET /api/companies?status=active&industry=Technology
```

## Authentication and Security

### Password Requirements
- Passwords must be provided in the request body
- Passwords are stored securely in the database
- No password length or complexity requirements are currently enforced in the API

### Two-Factor Authentication (2FA)
- Can be enabled per company account
- When enabled, additional authentication step is required
- Backup codes are provided for account recovery
- 2FA secret is stored securely

### Account Security
- Companies can request password resets
- Password reset instructions are sent to the registered company email
- Account verification is available but not mandatory
- Account status can be set to inactive to temporarily disable access

### API Security
- All endpoints require valid authentication
- Rate limiting and request throttling are not currently implemented
- Sensitive fields like password are never returned in API responses
- Session management is handled through standard authentication tokens

## Filtering and Querying

### Available Filters
- `status`: Filter companies by their status (e.g., active, inactive)
- `industry`: Filter companies by their industry type

### Filter Usage
Companies can be filtered using query parameters in the GET request:
```http
GET /api/companies?status=active
GET /api/companies?industry=Technology
GET /api/companies?status=active&industry=Technology
```

### Pagination
Currently, pagination is not implemented. All results are returned in a single response.

### Response Format
Filtered responses maintain the same structure as non-filtered responses:
```json
{
	"data": [
		{
			"id": 1,
			"company_name": "Example Company",
			"status": "active",
			"industry": "Technology"
			// ... other company fields
		}
	]
}
```

## API Endpoints



### 1. Company Login
- **URL**: `/api/companies/login`
- **Method**: `POST`
- **Request Body**:
	```json
	{
		"username": "company_username",
		"password": "company_password"
	}
	```
- **Success Response**:
	- **Code**: 200
	- **Content**:
		```json
		{
			"message": "Login successful",
			"data": {
				"token": "jwt_token_string",
				"company": {
					"id": 1,
					"username": "company_username",
					"company_name": "Test Company Ltd",
					"trading_name": "TCL",
					"industry": "Technology",
					"email": "contact@testcompany.com",
					"phone": "+1234567890",
					"website": "https://testcompany.com",
					"company_type": "LLC",
					"registration_number": "REG123456",
					"tax_number": "TAX123456",
					"founded_date": "2024-01-01",
					"contact_person_name": "John Doe",
					"contact_person_email": "john@testcompany.com",
					"contact_person_phone": "+1234567891",
					"contact_person_position": "CEO",
					"contact_person_mobile": "+1234567892",
					"street_address": "123 Business Street",
					"building_name": "Tech Tower",
					"floor_number": "15",
					"city": "Tech City",
					"state": "Tech State",
					"country": "Tech Country",
					"postal_code": "12345",
					"status": "active",
					"is_verified": false,
					"created_at": "2024-01-01T00:00:00.000Z",
					"updated_at": "2024-01-01T00:00:00.000Z"
					// ... all other company fields except sensitive data
				}
			}
		}
		```
- **Notes**:
	- Response includes all company fields except sensitive data (password, two_factor_secret, backup_codes)
	- Fields are returned based on what was provided during company creation
- **Error Responses**:
	- **Code**: 401
		- **Content**: 
			```json
			{
				"message": "Invalid credentials"
			}
			```
	- **Code**: 500
		- **Content**: 
			```json
			{
				"error": "Login failed",
				"details": "Error message"
			}
			```




### 2. Create Company
- **URL**: `/api/companies`
- **Method**: `POST`
- **Request Body**: Company data (see Test Payloads section for examples)
- **Required Fields**: username, password, company_name
- **Success Response**:
	- **Code**: 201
	- **Content**:
		```json
		{
			"message": "Company created successfully",
			"data": {
				"id": 1,
				"created_at": "2024-01-01T00:00:00.000Z"
			}
		}
		```
- **Error Response**:
	- **Code**: 500
	- **Content**: 
		```json
		{
			"error": "Failed to create company",
			"details": "Error message"
		}
		```

### 3. Get All Companies
- **URL**: `/api/companies`
- **Method**: `GET`
- **Query Parameters**:
	- status: Filter by company status
	- industry: Filter by industry type
- **Success Response**:
	- **Code**: 200
	- **Content**:
		```json
		{
			"data": [
				{
					"id": 1,
					"username": "testcompany",
					"company_name": "Test Company Ltd",
					"industry": "Technology",
					"created_at": "2024-01-01T00:00:00.000Z",
					"updated_at": "2024-01-01T00:00:00.000Z"
				}
			]
		}
		```
- **Error Response**:
	- **Code**: 500
	- **Content**: 
		```json
		{
			"error": "Failed to fetch companies",
			"details": "Error message"
		}
		```

### 4. Get Single Company
- **URL**: `/api/companies/:id`
- **Method**: `GET`
- **Success Response**:
	- **Code**: 200
	- **Content**:
		```json
		{
			"data": {
				"id": 1,
				"username": "testcompany",
				"company_name": "Test Company Ltd",
				"created_at": "2024-01-01T00:00:00.000Z",
				"updated_at": "2024-01-01T00:00:00.000Z"
			}
		}
		```
- **Error Responses**:
	- **Code**: 404
		- **Content**: 
			```json
			{
				"message": "Company not found",
				"details": "No company found with ID: 1"
			}
			```
	- **Code**: 500
		- **Content**: 
			```json
			{
				"error": "Failed to fetch company",
				"details": "Error message"
			}
			```

### 5. Update Company
- **URL**: `/api/companies/:id`
- **Method**: `PUT`
- **Request Body**: Updated company data (see Test Payloads section for examples)
- **Note**: updated_at is automatically set to current timestamp
- **Success Response**:
	- **Code**: 200
	- **Content**: 
		```json
		{
			"message": "Company updated successfully",
			"data": {
				"updated_at": "2024-01-01T00:00:00.000Z"
			}
		}
		```
- **Error Response**:
	- **Code**: 500
	- **Content**: 
		```json
		{
			"error": "Failed to update company",
			"details": "Error message"
		}
		```

### 6. Delete Company
- **URL**: `/api/companies/:id`
- **Method**: `DELETE`
- **Success Response**:
	- **Code**: 200
	- **Content**: 
		```json
		{
			"message": "Company deleted successfully"
		}
		```
- **Error Response**:
	- **Code**: 500
	- **Content**: 
		```json
		{
			"error": "Failed to delete company",
			"details": "Error message"
		}
		```

### 7. Request Password Reset
- **URL**: `/api/companies/reset-password-request`
- **Method**: `POST`
- **Request Body**:
	```json
	{
		"username": "company_username"
	}
	```
- **Success Response**:
	- **Code**: 200
	- **Content**: 
		```json
		{
			"message": "Password reset instructions sent to company email"
		}
		```
- **Error Responses**:
	- **Code**: 404
		- **Content**: 
			```json
			{
				"message": "Company not found",
				"details": "No company found with username: company_username"
			}
			```
	- **Code**: 500
		- **Content**: 
			```json
			{
				"error": "Failed to process password reset request",
				"details": "Error message"
			}
			```

### 8. Reset Password
- **URL**: `/api/companies/reset-password`
- **Method**: `POST`
- **Request Body**:
	```json
	{
		"username": "company_username",
		"newPassword": "new_password"
	}
	```
- **Success Response**:
	- **Code**: 200
	- **Content**: 
		```json
		{
			"message": "Password reset successful",
			"data": {
				"updated_at": "2024-01-01T00:00:00.000Z"
			}
		}
		```
- **Error Responses**:
	- **Code**: 404
		- **Content**: 
			```json
			{
				"message": "Company not found",
				"details": "No company found with username: company_username"
			}
			```
	- **Code**: 500
		- **Content**: 
			```json
			{
				"error": "Failed to reset password",
				"details": "Error message"
			}
			```
