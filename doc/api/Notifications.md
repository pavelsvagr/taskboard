<a name="top"></a>
# TaskBoard API v1.0.0

TaskBoard application API endpoints documentation

 - [Notifications](#Notifications)
   - [Delete notification](#Delete-notification)
   - [List notifications](#List-notifications)
   - [Number of unread notifications](#Number-of-unread-notifications)
   - [SSE notification stream](#SSE-notification-stream)

___


# <a name='Notifications'></a> Notifications

## <a name='Delete-notification'></a> Delete notification
[Back to top](#top)

<p>Deletes existing notification and returns its representation</p>

```
DELETE /api/notifications/:id
```

### Parameters - `url`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `String` | <p>Notification id</p> |

## <a name='List-notifications'></a> List notifications
[Back to top](#top)

<p>Returns paginated notifications for logged user</p>

```
GET /api/notifications
```

## <a name='Number-of-unread-notifications'></a> Number of unread notifications
[Back to top](#top)

<p>Returns number of actual unread notifications in application for logged user</p>

```
GET /api/notifications/unread/count
```

### Success response example

#### Success response example - `Success-Response:`

```json
{
  "count": 2,
}
```

## <a name='SSE-notification-stream'></a> SSE notification stream
[Back to top](#top)

<p>Opens SSE stream for actual browser window.</p>

```
GET /api/notifications/stream
```
