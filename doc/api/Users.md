<a name="top"></a>
# TaskBoard API v1.0.0

TaskBoard application API endpoints documentation

 - [Users](#Users)
   - [Create user](#Create-user)
   - [Get single user](#Get-single-user)
   - [List users](#List-users)
   - [Update user](#Update-user)

___


# <a name='Users'></a> Users

## <a name='Create-user'></a> Create user
[Back to top](#top)

<p>Creates new user in database. Requires admin role</p>

```
POST /api/users
```

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `String` | <p>User's email.</p> |
| name | `String` | <p>User's full name.</p> |
| role | `String` | <p>User's role.</p> |
| photo | `String` | **optional** <p>Url to user's photo.</p> |

## <a name='Get-single-user'></a> Get single user
[Back to top](#top)

<p>Returns paginate of all users from database for given parameters. Requires admin role.</p>

```
GET /api/users/:id
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Id of user.</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
{
   "_id":"512f916cb2f221c27541534b",
   "name":"Martin Novák",
   "email":"novak@example.org",
   "photo": null,
   "role":"user",
}
```

## <a name='List-users'></a> List users
[Back to top](#top)

<p>Returns paginate of all users from database for given parameters. Requires moderator od admin role.</p>

```
GET /api/users
```

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | **optional** <p>Limit of returned records.</p>_Default value: 10_<br> |
| offset | `Number` | **optional** <p>Actual page of viewed records.</p>_Default value: 0_<br> |
| search | `String` | **optional** <p>Searches users names, emails and roles.</p> |
| sort | `String` | **optional** <p>Sort by name, email or role.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | <p>Number of returned records.</p> |
| offset | `Number` | <p>Page of returned records.</p> |
| data | `array` | <p>List of teams.</p> |
| count | `Number` | <p>Count of all records for given parameters.</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
{
   "data":[
   {
         "_id":"512f916cb2f221c27541534b",
         "name":"Martin Novák",
         "email":"novak@example.org",
         "photo": null,
         "role":"user",
      }
   ],
   "limit":25,
   "offset":0,
   "count":1
}
```

## <a name='Update-user'></a> Update user
[Back to top](#top)

<p>Update parts of user and return new representation of user. Requires admin role.</p>

```
PATCH /api/users/:id
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Id of user.</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `String` | **optional** <p>User's email.</p> |
| name | `String` | **optional** <p>User's full name.</p> |
| role | `String` | **optional** <p>User's role.</p> |
| photo | `String` | **optional** <p>Url to user's photo.</p> |
