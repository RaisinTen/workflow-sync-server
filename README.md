# workflow sync server

1. When a `POST` request is made with an `ID` and a `groupID`, both the `res` object and the ID is pushed into queues in the group.
2. The first `res` object of a group is shifted out and answered and the group waits for a delete request with the same `ID`.
3. When a `DELETE` request with the `ID` waited for in the `group` is sent, it means that the workflow run of `ID` is over and so `ID` too is shifted out.
4. Now it is safe to allow the workflow with the topmost `ID` to run. So, the `res` object at the front of the queue of the group is shifted out and answered and the group waits for a `DELETE` request with the topmost `ID`.
