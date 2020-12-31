## API

### Boards

#### Creating project

Create a new project from Redmine and try to load users

`POST /api/projects`

**Parameters**

- _title_ (required): name of the object
- _timeIntervals_ : settings for timeline (weeks [default], days, months)
- _redmine_ (required): object with redmine attributes:
  - _url_ (required): url to redmine app
  - _indetifier_ (required): identifier of redmine project
  - _apiKey_ (required): api key to access redmine API
  - _importUsers_ : tries to access users from project and import them

**Example**

```http request
POST /api/projects
```

```json
{
  "name": "Test project",
  "timeInterval": "weeks",
  "redmine": {
    "url": "https://redmine.ack.ee",
    "identifier": "testovaci-projekt-svagr",
    "apiKey": "3f8b8fb8672f4ebf0253f1f794bc7ef735adb8f2",
    "importUsers": true
  }
}
```

**Response:**

- 201 - Success, sucessfully created
- 422 - Project was not created due to validation failures

#### Showing a project

Shows detail of the project, user must be logged in.

`POST /api/projects/{id}`

**Parameters**

- _id_ (required): id of the project

**Example**

```http request
GET /api/projects/1
```

**Response:**

Json with project object example:

```json
{
  "id": 1,
  "title": "Test project",
  "time-intervalTest": "weeks",
  "redmine": {
    "url": "https://redmine.ack.ee",
    "identifier": "testovaci-projekt-svagr",
    "project": {
      "id": 1269,
      "name": "Testovaci projekt Svagr",
      "status": 1,
      "created_on": "2019-10-21T13:31:36Z",
      "updated_on": "2019-10-21T13:31:36Z"
    }
  }
}
```

#### Showing project issues

`GET /api/projects/{id}/issues`

**Parameters**

- _id_ (required): id of the project

**Optional filters**

- _assign-state_: assign state of the issues. (assigned, not assigned)
- _priority_: priority of the issue. (priority)
