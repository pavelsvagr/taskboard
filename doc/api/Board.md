<a name="top"></a>
# TaskBoard API v1.0.0

TaskBoard application API endpoints documentation

 - [Board](#Board)
   - [Create new members.](#Create-new-members.)
   - [Create or copy items](#Create-or-copy-items)
   - [Delete items](#Delete-items)
   - [Delete member](#Delete-member)
   - [Delete settings](#Delete-settings)
   - [Get items](#Get-items)
   - [Get settings](#Get-settings)
   - [List members](#List-members)
   - [List possible tasks](#List-possible-tasks)
   - [Replace item](#Replace-item)
   - [Replace members](#Replace-members)
   - [Replaces settings](#Replaces-settings)
   - [Update member](#Update-member)

___


# <a name='Board'></a> Board

## <a name='Create-new-members.'></a> Create new members.
[Back to top](#top)

<p>Create new members from users ids to given board and returns new members.</p>

```
POST /api/boards/:identifier/members
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| body | `array` | <p>Array of user ids.</p> |

## <a name='Create-or-copy-items'></a> Create or copy items
[Back to top](#top)

<p>Creates new item or copies existing items from one interval to another.  If sourceFrom, sourceTo and shift are given, endpoint do copying. If they are not given, app tries to create new item from given body. Returns new board item or array of copied items.</p>

```
POST /api/boards/:identifier/items
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| sourceFrom | `String` | **optional** <p>Date in ISO8601 format</p> |
| sourceTo | `String` | **optional** <p>Date in ISO8601 format</p> |
| shift | `Number` | **optional** <p>How many days will be shifted (negative number for pasting backwards)</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| member | `String` | **optional** <p>Member id</p> |
| date | `String` | **optional** <p>Date in ISO8601 format</p> |
| assignments | `array` | **optional** <p>Array of task objects.</p> |

## <a name='Delete-items'></a> Delete items
[Back to top](#top)

<p>Deletes all items of board in interval given by parameters dateFrom and dateTo.</p>

```
DELETE /api/boards/:identifier/items?dateFrom=:dateFrom&amp;dateTo=:dateTo
```

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| dateFrom | `String` | **optional** <p>Date in ISO8601 format</p> |
| dateTo | `String` | **optional** <p>Date in ISO8601 format</p> |

## <a name='Delete-member'></a> Delete member
[Back to top](#top)

<p>Delete user from board and return its deleted member object.</p>

```
DELETE /api/boards/:identifier/members/:id
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |
| id | `String` | <p>Id of board member</p> |

## <a name='Delete-settings'></a> Delete settings
[Back to top](#top)

<p>Deletes existing board settings for given date and returns them.</p>

```
DELETE /api/boards/:identifier/settings/:date
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |
| date | `String` | <p>Date in ISO8601 format</p> |

## <a name='Get-items'></a> Get items
[Back to top](#top)

<p>Returns existing items in given interval.</p>

```
GET /api/boards/:identifier/items?from=:from&amp;to=:to
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| from | `String` | <p>Date in ISO8601 format</p> |
| to | `String` | <p>Date in ISO8601 format</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
[
{
   "_id":"5fef22ff22f88b0c1022fc47",
   "board":"2b54d9a0b64c3bba192ae5bb",
   "date":"2020-12-28T00:00:00.000Z",
   "member":"45b5efa9c0324f2d3e8d7de5",
   "assignments":[
      {
         "_id":"5fef22ff22f88b0c1022fc48",
         "id":"54371",
         "title":"UI design",
         "url":"https://redmine.example.org/issues/1",
         "type":"issues",
         "priority":1,
      },
   ],
}
]
```

## <a name='Get-settings'></a> Get settings
[Back to top](#top)

<p>Returns existing settings for given date.</p>

```
GET /api/boards/:identifier/settings/:date
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |
| date | `String` | <p>Date in ISO8601 format</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
{
   "_id":"5fef20c1fbebda588c2ceb81",
   "board":"2b54d9a0b64c3bba192ae5bb",
   "date":"2020-12-28T00:00:00.000Z",
   "priorities":2,
   "deactivated":[],
}
```

## <a name='List-members'></a> List members
[Back to top](#top)

<p>Returns all members of given board.</p>

```
GET /api/boards/:identifier/members
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

## <a name='List-possible-tasks'></a> List possible tasks
[Back to top](#top)

<p>Returns all tasks (projects or issues) that can be assigned to board members.</p>

```
GET /api/boards/:identifier/assignments
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | **optional** <p>Limit of returned records.</p>_Default value: 25_<br> |
| offset | `Number` | **optional** <p>Actual page of viewed records.</p>_Default value: 0_<br> |
| search | `String` | **optional** <p>Searches issues or project titles.</p> |

## <a name='Replace-item'></a> Replace item
[Back to top](#top)

<p>Replaces specific board item with given values</p>

```
PUT /api/boards/:identifier/items/:id
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |
| id | `String` | <p>Id of the board item</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| member | `String` | <p>Member id</p> |
| date | `String` | <p>Date in ISO8601 format</p> |
| assignments | `array` | <p>Array of task objects.</p> |

## <a name='Replace-members'></a> Replace members
[Back to top](#top)

<p>Replaces all members and returns them.</p>

```
PUT /api/boards/:identifier/members
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| body | `array` | <p>Array of member objects.</p> |

## <a name='Replaces-settings'></a> Replaces settings
[Back to top](#top)

<p>Replaces settings for given date and returns them.</p>

```
PUT /api/boards/:identifier/settings/:date
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |
| date | `String` | <p>Date in ISO8601 format</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| priorities | `String` | <p>Actual priorities on board for given date</p> |
| deactivated | `array` | <p>List of deactivated users (id strings)</p> |

## <a name='Update-member'></a> Update member
[Back to top](#top)

<p>Updates member of the board and returns its new interpretation.</p>

```
PATCH /api/boards/:identifier/members/:id
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |
| id | `String` | <p>Id of board member</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| nickname | `String` | **optional** <p>Nickname of member on board</p> |
| role | `String` | **optional** <p>New role of the member (need owner access)</p> |
