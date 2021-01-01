<a name="top"></a>
# TaskBoard API v1.0.0

TaskBoard application API endpoints documentation

 - [Boards](#Boards)
   - [Create new board](#Create-new-board)
   - [Delete board](#Delete-board)
   - [Get single board](#Get-single-board)
   - [List boards](#List-boards)
   - [Update parts of board](#Update-parts-of-board)

___


# <a name='Boards'></a> Boards

## <a name='Create-new-board'></a> Create new board
[Back to top](#top)

<p>Creates new board and returns it.</p>

```
POST /api/boards
```

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>Title of the board</p> |
| identifier | `String` | <p>Unique identifier</p> |
| credentials | `String` | <p>Credentials id to external application</p> |
| assignment | `String` | <p>Types of assignment (projects, issues)</p> |
| intervals | `String` | <p>Interval size (month, days, weeks)</p> |
| priorities | `String` | <p>How many priorities use on board</p> |
| teams | `array` | <p>List of team ids that can be used on board.</p> |

## <a name='Delete-board'></a> Delete board
[Back to top](#top)

<p>Deletes existing board and returns it.</p>

```
DELETE /api/boards/:identifier
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

## <a name='Get-single-board'></a> Get single board
[Back to top](#top)

<p>Returns single board with given identifier.</p>

```
GET /api/boards/:identifier
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

## <a name='List-boards'></a> List boards
[Back to top](#top)

<p>Returns all boards for logged user from database.</p>

```
GET /api/boards
```

### Parameters - `query`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | **optional** <p>Limit of returned records.</p>_Default value: 25_<br> |
| offset | `Number` | **optional** <p>Actual page of viewed records.</p>_Default value: 0_<br> |
| search | `String` | **optional** <p>Searches boards identifiers and names.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| limit | `Number` | <p>Number of returned records.</p> |
| offset | `Number` | <p>Page of returned records.</p> |
| data | `array` | <p>List of boards.</p> |
| count | `Number` | <p>Count of all records for given parameters.</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
{
"data":[
  {
    "_id":"2b54d9a0b64c3bba192ae5bb",
    "name":"Week issues",
    "identifier":"week-issues-table",
    "priorities":4,
    "credentials":{
      "_id":"512f916cb2f221c27541534b",
      "type":"redmine"
     },
     "intervals":"weeks",
     "assignment":"issues",
     "owner":"d9d19011a8230a3a566d9da1"
  }
],
"count":1,
"limit":25,
"offset":0
}
```

## <a name='Update-parts-of-board'></a> Update parts of board
[Back to top](#top)

<p>Updates existing board and returns it.</p>

```
PATCH /api/boards/:identifier
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| identifier | `String` | <p>Identifier of the board</p> |

### Parameters - `body`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | **optional** <p>Title of the board</p> |
| identifier | `String` | **optional** <p>Unique identifier</p> |
| priorities | `String` | **optional** <p>How many priorities use on board</p> |
| teams | `array` | **optional** <p>List of team ids that can be used on board</p> |
