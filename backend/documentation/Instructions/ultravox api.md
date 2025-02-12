markdown
# API Documentation

This document describes the API endpoints and their functionalities for Ultravox API.

**Authentication:**

Most endpoints require an API key for authentication. You can obtain an API key from your Ultravox account dashboard.  Pass your API key in the `X-API-Key` header for authenticated requests.

---

## API Keys

### `GET /api/api_keys`
Returns all API keys

**Description:**
Returns all API keys associated with your account.  This endpoint supports pagination for handling large lists of API keys.

**Parameters:**

| Name     | Type   | Required | Description                  |
|----------|--------|----------|------------------------------|
| `cursor`   | string | No       | The pagination cursor value to fetch the next page of results.  Obtained from the `next_cursor` field in the previous response. |
| `pageSize` | integer| No       | Number of results to return per page.  Defaults to 10, maximum is 100. |

**Responses:**

| Status Code | Description                                   |
|-------------|-----------------------------------------------|
| `200`         | Successful response with a list of API keys.  The response body will contain an array of API key objects and pagination metadata. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/api_keys?pageSize=20&cursor=NEXT_PAGE_CURSOR" \
  -H "X-API-Key: yereoureouer"


---

## Accounts

### `GET /api/accounts/me`
Returns account details for a single account

**Description:**
Returns detailed information about the account associated with the API key used for authentication.

**Parameters:**

| Name        | Type   | Required | Description |
|-------------|--------|----------|-------------|
| `X-API-Key` | string | Yes      | Your Ultravox API key for authentication. |

**Responses:**

| Status Code | Description                             |
|-------------|-----------------------------------------|
| `200`         | Successful response with account details. The response body will contain an account object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/accounts/me" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/accounts`
List Accounts

**Description:**
List Accounts.  This endpoint is likely for administrative purposes and may require elevated privileges. It returns a list of all accounts within the Ultravox platform.

**Parameters:**

*No parameters*

**Responses:**

| Status Code | Description                                 |
|-------------|---------------------------------------------|
| `200`         | Successful response with a list of accounts. The response body will contain an array of account objects. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/accounts" \
  -H "X-API-Key: yereoureouer"


---

## API Keys (Legacy Endpoint - Consider using `/api/api_keys`)

### `GET /api/apikeys`
List API Keys

**Description:**
List API Keys. This is a legacy endpoint for retrieving API keys. It is recommended to use the `/api/api_keys` endpoint instead for potentially enhanced features and pagination support.

**Parameters:**

*No parameters*

**Responses:**

| Status Code | Description                                 |
|-------------|---------------------------------------------|
| `200`         | Successful response with a list of API keys. The response body will contain an array of API key objects. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/apikeys" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/apikeys`
Create API key

**Description:**
Create API key.  Generates a new API key for your Ultravox account.  The newly created API key will be returned in the response.

**Parameters:**

*No parameters* (Request body may be empty or accept optional configurations for the API key, refer to specific documentation if needed)

**Responses:**

| Status Code | Description                     |
|-------------|---------------------------------|
| `201`         | API key created successfully. The response body will contain the newly created API key object. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/apikeys" \
  -H "X-API-Key: yereoureouer"


---

### `PUT /api/apikeys/{id}`
Replace API Key

**Description:**
Replace API Key. Replaces an existing API key entirely with the data provided in the request body.  This operation requires you to provide all the attributes of the API key you wish to update.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the API key to replace.  Specified as part of the URL path: `/api/apikeys/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `200`         | API key replaced successfully. The response body will contain the updated API key object. |

**Example Request:**

bash
curl -X PUT \
  "https://api.ultravox.ai/api/apikeys/API_KEY_ID_TO_REPLACE" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the complete API key object in JSON format for replacement


---

### `PATCH /api/apikeys/{id}`
Update API key

**Description:**
Update API key.  Partially modifies an existing API key.  You only need to include the attributes you want to change in the request body.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the API key to update. Specified as part of the URL path: `/api/apikeys/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `200`         | API key updated successfully. The response body will contain the updated API key object. |

**Example Request:**

bash
curl -X PATCH \
  "https://api.ultravox.ai/api/apikeys/API_KEY_ID_TO_UPDATE" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the attributes you want to update in JSON format


---

### `DELETE /api/apikeys/{id}`
Delete API Key

**Description:**
Delete API Key.  Revokes and deletes an API key, rendering it unusable for future API requests.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the API key to delete. Specified as part of the URL path: `/api/apikeys/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `204`         | API key deleted successfully. No content is returned in the response body. |

**Example Request:**

bash
curl -X DELETE \
  "https://api.ultravox.ai/api/apikeys/API_KEY_ID_TO_DELETE" \
  -H "X-API-Key: yereoureouer"


---

## Calls

### `GET /api/calls`
List Calls

**Description:**
List Calls. Retrieves a list of calls initiated or managed by your account. Supports pagination.

**Parameters:**

*No parameters* (Likely supports pagination parameters like `cursor` and `pageSize` similar to `/api/api_keys`, refer to full documentation)

**Responses:**

| Status Code | Description                             |
|-------------|-----------------------------------------|
| `200`         | Successful response with a list of calls. The response body will contain an array of call objects and potentially pagination metadata. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/calls/{id}`
Get Call

**Description:**
Get Call. Fetches detailed information about a specific call given its ID.

**Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| `id`   | string | Yes      | ID of the call to retrieve. Specified as part of the URL path: `/api/calls/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `200`         | Successful response with call details. The response body will contain a call object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/calls`
Create Call

**Description:**
Create Call. Initiates a new call using the parameters provided in the request body. This is the primary endpoint to start voice interactions.

**Parameters:**

*No parameters specified in the input data.* (Request body parameters are required to define call settings, participants, etc. Consult detailed Ultravox API documentation for call creation parameters.)

**Responses:**

| Status Code | Description                  |
|-------------|------------------------------|
| `201`         | Call created successfully. The response body will contain details of the newly created call, including its ID. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/calls" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the necessary call creation parameters in JSON format


---

### `GET /api/calls/{id}/messages`
List Call Messages

**Description:**
List Call Messages. Retrieves the message history associated with a specific call.

**Parameters:**

| Name   | Type   | Required | Description                                  |
|--------|--------|----------|----------------------------------------------|
| `id`   | string | Yes      | ID of the call to retrieve messages for. Specified as part of the URL path: `/api/calls/{id}/messages` |

**Responses:**

| Status Code | Description                            |
|-------------|----------------------------------------|
| `200`         | Successful response with call messages. The response body will contain an array of message objects related to the call. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID_TO_RETRIEVE/messages" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/calls/{id}/tools`
List Call Tools

**Description:**
List Call Tools.  Lists the tools that were active or available during a specific call. Tools could represent functionalities like speech recognition, text-to-speech, or custom integrations.

**Parameters:**

| Name   | Type   | Required | Description                               |
|--------|--------|----------|-------------------------------------------|
| `id`   | string | Yes      | ID of the call to retrieve tools for. Specified as part of the URL path: `/api/calls/{id}/tools` |

**Responses:**

| Status Code | Description                          |
|-------------|--------------------------------------|
| `200`         | Successful response with call tools. The response body will contain an array of tool objects used in the call. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID_TO_RETRIEVE/tools" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/calls/{id}/recording`
Get Call Recording

**Description:**
Get Call Recording.  Provides access to the recording of a call, if recording was enabled and successfully captured.

**Parameters:**

| Name   | Type   | Required | Description                                   |
|--------|--------|----------|-----------------------------------------------|
| `id`   | string | Yes      | ID of the call to retrieve recording for. Specified as part of the URL path: `/api/calls/{id}/recording` |

**Responses:**

| Status Code | Description                            |
|-------------|----------------------------------------|
| `200`         | Successful response with call recording. The response body will likely contain a URL or data stream to access the call recording. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID_TO_RETRIEVE/recording" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/calls/{id}/stages`
List Call Stages

**Description:**
List Call Stages.  Retrieves the different stages or phases that a call progressed through. Stages can represent different parts of a conversation flow or processing steps.

**Parameters:**

| Name   | Type   | Required | Description                                 |
|--------|--------|----------|---------------------------------------------|
| `id`   | string | Yes      | ID of the call to retrieve stages for. Specified as part of the URL path: `/api/calls/{id}/stages` |

**Responses:**

| Status Code | Description                          |
|-------------|--------------------------------------|
| `200`         | Successful response with call stages. The response body will contain an array of stage objects within the call. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID_TO_RETRIEVE/stages" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/calls/{callId}/stages/{stageId}`
Get Call Stage

**Description:**
Get Call Stage. Fetches detailed information about a specific stage within a specific call.

**Parameters:**

| Name      | Type   | Required | Description                       |
|-----------|--------|----------|-----------------------------------|
| `callId`  | string | Yes      | ID of the call. Specified as part of the URL path: `/api/calls/{callId}/stages/{stageId}`                    |
| `stageId` | string | Yes      | ID of the stage to retrieve. Specified as part of the URL path: `/api/calls/{callId}/stages/{stageId}` |

**Responses:**

| Status Code | Description                                  |
|-------------|----------------------------------------------|
| `200`         | Successful response with call stage details. The response body will contain a stage object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID/stages/STAGE_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/calls/{callId}/stages/{stageId}/messages`
List Call Stage Messages

**Description:**
List Call Stage Messages. Retrieves messages that were exchanged specifically during a particular stage of a call.

**Parameters:**

| Name      | Type   | Required | Description                                       |
|-----------|--------|----------|---------------------------------------------------|
| `callId`  | string | Yes      | ID of the call. Specified as part of the URL path: `/api/calls/{callId}/stages/{stageId}/messages`                                    |
| `stageId` | string | Yes      | ID of the stage to retrieve messages for. Specified as part of the URL path: `/api/calls/{callId}/stages/{stageId}/messages` |

**Responses:**

| Status Code | Description                             |
|-------------|-----------------------------------------|
| `200`         | Successful response with stage messages. The response body will contain an array of message objects for the specified stage. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID/stages/STAGE_ID_TO_RETRIEVE/messages" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/calls/{callId}/stages/{stageId}/tools`
List Call Stage Tools

**Description:**
List Call Stage Tools.  Lists the tools that were active or relevant during a specific stage of a call.

**Parameters:**

| Name      | Type   | Required | Description                                    |
|-----------|--------|----------|------------------------------------------------|
| `callId`  | string | Yes      | ID of the call. Specified as part of the URL path: `/api/calls/{callId}/stages/{stageId}/tools`                                 |
| `stageId` | string | Yes      | ID of the stage to retrieve tools for. Specified as part of the URL path: `/api/calls/{callId}/stages/{stageId}/tools` |

**Responses:**

| Status Code | Description                           |
|-------------|---------------------------------------|
| `200`         | Successful response with stage tools. The response body will contain an array of tool objects relevant to the specified stage. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/calls/CALL_ID/stages/STAGE_ID_TO_RETRIEVE/tools" \
  -H "X-API-Key: yereoureouer"


---

## Corpora

### `GET /api/corpora`
List Corpora

**Description:**
List Corpora. Returns a list of corpora (knowledge bases) associated with your account.

**Parameters:**

*No parameters* (Likely supports pagination parameters, refer to full documentation)

**Responses:**

| Status Code | Description                               |
|-------------|-------------------------------------------|
| `200`         | Successful response with a list of corpora. The response body will contain an array of corpus objects and potentially pagination metadata. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/corpora" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/corpora`
Create Corpus

**Description:**
Create Corpus.  Creates a new corpus. A corpus serves as a repository of data that can be used to enhance call interactions or provide context.

**Parameters:**

*No parameters specified in the input data.* (Request body parameters are required to define corpus details, such as name and configuration. Consult detailed Ultravox API documentation for corpus creation parameters.)

**Responses:**

| Status Code | Description                    |
|-------------|--------------------------------|
| `201`         | Corpus created successfully. The response body will contain details of the newly created corpus, including its ID. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/corpora" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the necessary corpus creation parameters in JSON format


---

### `GET /api/corpora/{id}`
Get Corpus

**Description:**
Get Corpus. Retrieves detailed information about a specific corpus given its ID.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the corpus to retrieve. Specified as part of the URL path: `/api/corpora/{id}` |

**Responses:**

| Status Code | Description                       |
|-------------|-----------------------------------|
| `200`         | Successful response with corpus details. The response body will contain a corpus object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

### `PATCH /api/corpora/{id}`
Update Corpus

**Description:**
Update Corpus. Partially modifies an existing corpus. You only need to provide the attributes you want to change in the request body.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the corpus to update. Specified as part of the URL path: `/api/corpora/{id}` |

**Responses:**

| Status Code | Description                      |
|-------------|----------------------------------|
| `200`         | Corpus updated successfully. The response body will contain the updated corpus object. |

**Example Request:**

bash
curl -X PATCH \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID_TO_UPDATE" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the attributes you want to update in JSON format


---

### `DELETE /api/corpora/{id}`
Delete Corpus

**Description:**
Delete Corpus. Deletes a corpus and all associated data. This is a permanent operation.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the corpus to delete. Specified as part of the URL path: `/api/corpora/{id}` |

**Responses:**

| Status Code | Description                      |
|-------------|----------------------------------|
| `204`         | Corpus deleted successfully. No content is returned in the response body. |

**Example Request:**

bash
curl -X DELETE \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID_TO_DELETE" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/corpora/{id}/query`
Query Corpus

**Description:**
Query Corpus. Executes a search or query against a specific corpus to retrieve relevant information. The query details are provided in the request body.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the corpus to query. Specified as part of the URL path: `/api/corpora/{id}/query` |

**Responses:**

| Status Code | Description                          |
|-------------|--------------------------------------|
| `200`         | Successful response with query results. The response body will contain the results of the corpus query. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID_TO_QUERY/query" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the query parameters in JSON format


---

### `GET /api/corpora/{id}/sources`
List Corpus Sources

**Description:**
List Corpus Sources. Retrieves a list of sources associated with a specific corpus. Sources represent the origins of data within the corpus.

**Parameters:**

| Name   | Type   | Required | Description                                    |
|--------|--------|----------|------------------------------------------------|
| `id`   | string | Yes      | ID of the corpus to retrieve sources for. Specified as part of the URL path: `/api/corpora/{id}/sources` |

**Responses:**

| Status Code | Description                          |
|-------------|--------------------------------------|
| `200`         | Successful response with corpus sources. The response body will contain an array of source objects associated with the corpus. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID_TO_RETRIEVE/sources" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/corpora/{id}/sources`
Create Corpus Source

**Description:**
Create Corpus Source.  Adds a new source to a corpus. This allows you to ingest data from different origins into your corpus.

**Parameters:**

| Name   | Type   | Required | Description                                      |
|--------|--------|----------|---------------------------------------------------|
| `id`   | string | Yes      | ID of the corpus to create source for. Specified as part of the URL path: `/api/corpora/{id}/sources` |

**Responses:**

| Status Code | Description                           |
|-------------|---------------------------------------|
| `201`         | Corpus source created successfully. The response body will contain details of the newly created source object. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID_TO_ADD_SOURCE/sources" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the necessary corpus source creation parameters in JSON format


---

### `GET /api/corpora/{id}/sources/{sourceId}`
Get Corpus Source

**Description:**
Get Corpus Source. Retrieves detailed information about a specific source within a specific corpus.

**Parameters:**

| Name       | Type   | Required | Description                       |
|------------|--------|----------|-----------------------------------|
| `id`       | string | Yes      | ID of the corpus. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}`                    |
| `sourceId` | string | Yes      | ID of the source to retrieve. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}` |

**Responses:**

| Status Code | Description                                 |
|-------------|---------------------------------------------|
| `200`         | Successful response with corpus source details. The response body will contain a source object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID/sources/SOURCE_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

### `PATCH /api/corpora/{id}/sources/{sourceId}`
Update Corpus Source

**Description:**
Update Corpus Source. Partially modifies an existing source within a specific corpus.

**Parameters:**

| Name       | Type   | Required | Description                       |
|------------|--------|----------|-----------------------------------|
| `id`       | string | Yes      | ID of the corpus. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}`                    |
| `sourceId` | string | Yes      | ID of the source to update. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}` |

**Responses:**

| Status Code | Description                           |
|-------------|---------------------------------------|
| `200`         | Corpus source updated successfully. The response body will contain the updated source object. |

**Example Request:**

bash
curl -X PATCH \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID/sources/SOURCE_ID_TO_UPDATE" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the attributes you want to update for the corpus source in JSON format


---

### `DELETE /api/corpora/{id}/sources/{sourceId}`
Delete Corpus Source

**Description:**
Delete Corpus Source. Removes a specific source from a corpus. Data from this source might be removed from the corpus as well.

**Parameters:**

| Name       | Type   | Required | Description                       |
|------------|--------|----------|-----------------------------------|
| `id`       | string | Yes      | ID of the corpus. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}`                    |
| `sourceId` | string | Yes      | ID of the source to delete. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}` |

**Responses:**

| Status Code | Description                           |
|-------------|---------------------------------------|
| `204`         | Corpus source deleted successfully. No content is returned in the response body. |

**Example Request:**

bash
curl -X DELETE \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID/sources/SOURCE_ID_TO_DELETE" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/corpora/{id}/sources/{sourceId}/documents`
List Corpus Source Documents

**Description:**
List Corpus Source Documents.  Retrieves a list of documents associated with a specific source within a corpus. Documents represent individual pieces of data within a source.

**Parameters:**

| Name       | Type   | Required | Description                                        |
|------------|--------|----------|----------------------------------------------------|
| `id`       | string | Yes      | ID of the corpus. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}/documents`                                    |
| `sourceId` | string | Yes      | ID of the source to retrieve documents for. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}/documents` |

**Responses:**

| Status Code | Description                             |
|-------------|-----------------------------------------|
| `200`         | Successful response with source documents. The response body will contain an array of document objects. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID/sources/SOURCE_ID_TO_RETRIEVE/documents" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/corpora/{id}/sources/{sourceId}/documents/{documentId}`
Get Corpus Source Document

**Description:**
Get Corpus Source Document. Retrieves detailed information about a specific document within a specific source within a corpus.

**Parameters:**

| Name         | Type   | Required | Description                            |
|--------------|--------|----------|----------------------------------------|
| `id`         | string | Yes      | ID of the corpus. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}/documents/{documentId}`                        |
| `sourceId`   | string | Yes      | ID of the source. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}/documents/{documentId}`                          |
| `documentId` | string | Yes      | ID of the document to retrieve. Specified as part of the URL path: `/api/corpora/{id}/sources/{sourceId}/documents/{documentId}` |

**Responses:**

| Status Code | Description                                   |
|-------------|-----------------------------------------------|
| `200`         | Successful response with source document details. The response body will contain a document object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/corpora/CORPUS_ID/sources/SOURCE_ID/documents/DOCUMENT_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

## Tools

### `GET /api/tools`
List Tools

**Description:**
List Tools. Returns a list of available tools that can be used within the Ultravox platform, such as for call processing or data analysis.

**Parameters:**

*No parameters*

**Responses:**

| Status Code | Description                             |
|-------------|-----------------------------------------|
| `200`         | Successful response with a list of tools. The response body will contain an array of tool objects. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/tools" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/tools/{id}`
Get Tool

**Description:**
Get Tool. Retrieves detailed information about a specific tool given its ID.

**Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| `id`   | string | Yes      | ID of the tool to retrieve. Specified as part of the URL path: `/api/tools/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `200`         | Successful response with tool details. The response body will contain a tool object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/tools/TOOL_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/tools`
Create Tool

**Description:**
Create Tool.  Registers a new tool within the Ultravox platform. Tools can extend the functionality of calls and other features.

**Parameters:**

*No parameters specified in the input data.* (Request body parameters are required to define tool configuration and capabilities. Consult detailed Ultravox API documentation for tool creation parameters.)

**Responses:**

| Status Code | Description                   |
|-------------|-------------------------------|
| `201`         | Tool created successfully. The response body will contain details of the newly created tool, including its ID. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/tools" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the necessary tool creation parameters in JSON format


---

### `PUT /api/tools/{id}`
Update Tool

**Description:**
Update Tool. Replaces an existing tool entirely with the data provided in the request body.

**Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| `id`   | string | Yes      | ID of the tool to update. Specified as part of the URL path: `/api/tools/{id}` |

**Responses:**

| Status Code | Description                      |
|-------------|----------------------------------|
| `200`         | Tool updated successfully. The response body will contain the updated tool object. |

**Example Request:**

bash
curl -X PUT \
  "https://api.ultravox.ai/api/tools/TOOL_ID_TO_UPDATE" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the complete tool object in JSON format for replacement


---

### `DELETE /api/tools/{id}`
Delete Tool

**Description:**
Delete Tool. Unregisters and removes a tool from the Ultravox platform.

**Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| `id`   | string | Yes      | ID of the tool to delete. Specified as part of the URL path: `/api/tools/{id}` |

**Responses:**

| Status Code | Description                      |
|-------------|----------------------------------|
| `204`         | Tool deleted successfully. No content is returned in the response body. |

**Example Request:**

bash
curl -X DELETE \
  "https://api.ultravox.ai/api/tools/TOOL_ID_TO_DELETE" \
  -H "X-API-Key: yereoureouer"


---

## Voices

### `GET /api/voices`
List Voices

**Description:**
List Voices. Returns a list of available voices that can be used for text-to-speech functionalities within Ultravox.

**Parameters:**

*No parameters*

**Responses:**

| Status Code | Description                             |
|-------------|-----------------------------------------|
| `200`         | Successful response with a list of voices. The response body will contain an array of voice objects. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/voices" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/voices/{id}`
Get Voice

**Description:**
Get Voice. Retrieves detailed information about a specific voice given its ID.

**Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| `id`   | string | Yes      | ID of the voice to retrieve. Specified as part of the URL path: `/api/voices/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `200`         | Successful response with voice details. The response body will contain a voice object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/voices/VOICE_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/voices`
Create (Clone) Voice

**Description:**
Create (Clone) Voice.  Creates a new voice. This might involve cloning an existing voice or creating a completely new custom voice profile.

**Parameters:**

*No parameters specified in the input data.* (Request body parameters are required to define voice characteristics or cloning source. Consult detailed Ultravox API documentation for voice creation parameters.)

**Responses:**

| Status Code | Description                    |
|-------------|--------------------------------|
| `201`         | Voice created successfully. The response body will contain details of the newly created voice, including its ID. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/voices" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the necessary voice creation parameters in JSON format


---

### `DELETE /api/voices/{id}`
Delete Voice

**Description:**
Delete Voice. Removes a voice profile from the Ultravox platform.

**Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| `id`   | string | Yes      | ID of the voice to delete. Specified as part of the URL path: `/api/voices/{id}` |

**Responses:**

| Status Code | Description                      |
|-------------|----------------------------------|
| `204`         | Voice deleted successfully. No content is returned in the response body. |

**Example Request:**

bash
curl -X DELETE \
  "https://api.ultravox.ai/api/voices/VOICE_ID_TO_DELETE" \
  -H "X-API-Key: yereoureouer"


---

## Webhooks

### `GET /api/webhooks`
List Webhooks

**Description:**
List Webhooks. Returns a list of webhooks configured for your Ultravox account. Webhooks are used to receive real-time event notifications.

**Parameters:**

*No parameters*

**Responses:**

| Status Code | Description                               |
|-------------|-------------------------------------------|
| `200`         | Successful response with a list of webhooks. The response body will contain an array of webhook objects. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/webhooks" \
  -H "X-API-Key: yereoureouer"


---

### `GET /api/webhooks/{id}`
Get Webhook

**Description:**
Get Webhook. Retrieves detailed information about a specific webhook given its ID.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the webhook to retrieve. Specified as part of the URL path: `/api/webhooks/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `200`         | Successful response with webhook details. The response body will contain a webhook object. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/webhooks/WEBHOOK_ID_TO_RETRIEVE" \
  -H "X-API-Key: yereoureouer"


---

### `POST /api/webhooks`
Create Webhook

**Description:**
Create Webhook.  Registers a new webhook endpoint to receive event notifications from Ultravox.

**Parameters:**

*No parameters specified in the input data.* (Request body parameters are required to define webhook URL, event types to subscribe to, etc. Consult detailed Ultravox API documentation for webhook creation parameters.)

**Responses:**

| Status Code | Description                     |
|-------------|---------------------------------|
| `201`         | Webhook created successfully. The response body will contain details of the newly created webhook, including its ID. |

**Example Request:**

bash
curl -X POST \
  "https://api.ultravox.ai/api/webhooks" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the necessary webhook creation parameters in JSON format


---

### `PUT /api/webhooks/{id}`
Replace Webhook

**Description:**
Replace Webhook. Replaces an existing webhook entirely with the data provided in the request body.

**Parameters:**

| Name   | Type   | Required | Description                       |
|--------|--------|----------|-----------------------------------|
| `id`   | string | Yes      | ID of the webhook to replace. Specified as part of the URL path: `/api/webhooks/{id}` |

**Responses:**

| Status Code | Description                        |
|-------------|------------------------------------|
| `200`         | Webhook replaced successfully. The response body will contain the updated webhook object. |

**Example Request:**

bash
curl -X PUT \
  "https://api.ultravox.ai/api/webhooks/WEBHOOK_ID_TO_REPLACE" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the complete webhook object in JSON format for replacement


---

### `PATCH /api/webhooks/{id}`
Update Webhook

**Description:**
Update Webhook. Partially modifies an existing webhook. You only need to provide the attributes you want to change in the request body.

**Parameters:**

| Name   | Type   | Required | Description                       |
|--------|--------|----------|-----------------------------------|
| `id`   | string | Yes      | ID of the webhook to update. Specified as part of the URL path: `/api/webhooks/{id}` |

**Responses:**

| Status Code | Description                      |
|-------------|----------------------------------|
| `200`         | Webhook updated successfully. The response body will contain the updated webhook object. |

**Example Request:**

bash
curl -X PATCH \
  "https://api.ultravox.ai/api/webhooks/WEBHOOK_ID_TO_UPDATE" \
  -H "X-API-Key: yereoureouer" \
  -H "Content-Type: application/json" \
  -d '{}' # Replace {} with the attributes you want to update for the webhook in JSON format


---

### `DELETE /api/webhooks/{id}`
Delete Webhook

**Description:**
Delete Webhook. Unregisters and removes a webhook, stopping event notifications to the associated endpoint.

**Parameters:**

| Name   | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| `id`   | string | Yes      | ID of the webhook to delete. Specified as part of the URL path: `/api/webhooks/{id}` |

**Responses:**

| Status Code | Description                      |
|-------------|----------------------------------|
| `204`         | Webhook deleted successfully. No content is returned in the response body. |

**Example Request:**

bash
curl -X DELETE \
  "https://api.ultravox.ai/api/webhooks/WEBHOOK_ID_TO_DELETE" \
  -H "X-API-Key: yereoureouer"


---

## Models

### `GET /api/models`
List Models

**Description:**
List Models. Returns a list of available models used by Ultravox, potentially for voice processing, language understanding, or other AI functionalities.

**Parameters:**

*No parameters*

**Responses:**

| Status Code | Description                             |
|-------------|-----------------------------------------|
| `200`         | Successful response with a list of models. The response body will contain an array of model objects. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/models" \
  -H "X-API-Key: yereoureouer"


---

## OpenAPI

### `GET /api/openapi`
Get OpenAPI Schema

**Description:**
Get OpenAPI Schema. Retrieves the OpenAPI schema definition for the Ultravox API itself. This schema can be used for generating client libraries, documentation, or for integration with API development tools.

**Parameters:**

*No parameters*

**Responses:**

| Status Code | Description                               |
|-------------|-------------------------------------------|
| `200`         | Successful response with OpenAPI schema. The response body will contain the OpenAPI schema in JSON or YAML format. |

**Example Request:**

bash
curl -X GET \
  "https://api.ultravox.ai/api/openapi"
```