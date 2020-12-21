# workflow sync server

`POST`: When a `POST` request is made with an `ID` and a `groupID`, a `res` is sent with the status of the queried `workflow ID`. If the `ID` does not already exist, it is queued. Then `update` is called.

`DELETE`: When a `DELETE` request is made with an `ID` and a `groupID`, a `res` is sent with the status of the queried `ID`. If the `ID` matches the `runningID`, it is completed and `runningID` is set to `null`. Then `update` is called.

`update`: If there are `ID`s to process and no `workflow` is running, the topmost `workflow ID` is dequeued and is assigned to `runningID`.

# Usage

To register a workflow:
```console
curl -X POST -H "Content-Type: application/json" --data "{\"ID\": <id>}" https://workflow-sync-server.herokuapp.com/
```

At the end of the workflow:
```console
curl -X DELETE -H "Content-Type: application/json" --data "{\"ID\": <id>}" https://workflow-sync-server.herokuapp.com/
```
