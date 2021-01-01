<a name="top"></a>
# TaskBoard API v1.0.0

TaskBoard application API endpoints documentation

 - [Teams](#Teams)
   - [Create team](#Create-team)
   - [Delete team](#Delete-team)
   - [Get single team](#Get-single-team)
   - [List board teams](#List-board-teams)
   - [List team members](#List-team-members)
   - [List teams](#List-teams)
   - [Replace board team members](#Replace-board-team-members)
   - [Replace team members](#Replace-team-members)

___


# <a name='Teams'></a> Teams

## <a name='Create-team'></a> Create team
[Back to top](#top)

<p>Creates new team with no member. Returns created team.</p>

```
POST /api/teams
```

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>Name of the team.</p> |
| identifier | `String` | <p>Unique identifier.</p> |
| color | `String` | <p>Name of the team color.</p> |

## <a name='Delete-team'></a> Delete team
[Back to top](#top)

<p>Deletes specified team from board with all its members.</p>

```
DELETE /api/teams/:identifier
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of team</p> |

## <a name='Get-single-team'></a> Get single team
[Back to top](#top)

<p>Returns single team by given identifier.</p>

```
GET /api/teams/:identifier
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of team</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
{
       "_id":"512f916cb2f221c27541534b",
       "name":"Test Team",
       "identifier":"test-team",
       "color":"white",
}
```

## <a name='List-board-teams'></a> List board teams
[Back to top](#top)

<p>Returns all teams that are on specified board.</p>

```
GET /api/boards/:identifier/teams
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board.</p> |

## <a name='List-team-members'></a> List team members
[Back to top](#top)

<p>Returns members for given team</p>

```
GET /api/teams/:identifier/members
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the team</p> |

## <a name='List-teams'></a> List teams
[Back to top](#top)

<p>Returns paginate of all teams from database for given parameters.</p>

```
GET /api/teams
```

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | **optional** <p>Limit of returned records.</p>_Default value: 10_<br> |
| offset | `Number` | **optional** <p>Actual page of viewed records.</p>_Default value: 0_<br> |
| search | `String` | **optional** <p>Searches teams names, colors and identifiers.</p> |
| sort | `String` | **optional** <p>Sort by name, identifier or color.</p> |

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
       "name":"Test Team",
       "identifier":"test-team",
       "color":"white",
    }
 ],
 "limit":25,
 "offset":0,
 "count":1
}
```

## <a name='Replace-board-team-members'></a> Replace board team members
[Back to top](#top)

<p>Replaces members of the actual board.</p>

```
PUT /api/boards/:boardIdentifier/teams/:teamIdentifier/members
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board.</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| members | `Array` | <p>Collection of member ids that should be in team</p> |

## <a name='Replace-team-members'></a> Replace team members
[Back to top](#top)

<p>Returns members for given team</p>

```
PUT /api/teams/:identifier/members
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the team.</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| body | `Array` | <p>Collection of user ids that should be in team.</p> |
