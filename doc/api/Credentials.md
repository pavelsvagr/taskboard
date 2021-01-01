<a name="top"></a>
# TaskBoard API v1.0.0

TaskBoard application API endpoints documentation

 - [Credentials](#Credentials)
   - [Create new credentials.](#Create-new-credentials.)
   - [Get single credentials](#Get-single-credentials)
   - [List credentials](#List-credentials)
   - [Updates credentials.](#Updates-credentials.)

___


# <a name='Credentials'></a> Credentials

## <a name='Create-new-credentials.'></a> Create new credentials.
[Back to top](#top)

<p>Creates new credentials and returns them.</p>

```
POST /api/credentials
```

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>Credentials name</p> |
| type | `String` | <p>Type of credentials (redmine)</p> |
| url | `String` | <p>Root URL access point for external API</p> |
| apiKey | `String` | <p>apiKey for external API</p> |

## <a name='Get-single-credentials'></a> Get single credentials
[Back to top](#top)

<p>Returns single credentials.</p>

```
GET /api/credentials/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Id pf requested credentials</p> |

## <a name='List-credentials'></a> List credentials
[Back to top](#top)

<p>Returns paginate of all credentials from database for given parameters. Requires mod or admin role.</p>

```
GET /api/credentials
```

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | **optional** <p>Limit of returned records.</p>_Default value: 25_<br> |
| offset | `Number` | **optional** <p>Actual page of viewed records.</p>_Default value: 0_<br> |
| search | `String` | **optional** <p>Searches credentials names and types.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | <p>Number of returned records.</p> |
| offset | `Number` | <p>Page of returned records.</p> |
| data | `array` | <p>List of credentials.</p> |
| count | `Number` | <p>Count of all records for given parameters.</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
{
"data":[
 {
       "_id":"512f916cb2f221c27541534b",
       "name":"Redmine test",
       "url":"https://redmine.example.org",
       "type":"redmine",
    }
 ],
 "limit":25,
 "offset":0,
 "count":1
}
```

## <a name='Updates-credentials.'></a> Updates credentials.
[Back to top](#top)

<p>Deletes existing credentials and returns deleted representation</p>

```
DELETE /api/credentials/:id
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Credentials id</p> |
