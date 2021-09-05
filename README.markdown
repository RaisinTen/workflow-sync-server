Workflow sync server

```
Request       | Status
-             | -
POST task 1   | Running task 1
POST task 2   | Running task 1
DELETE task 1 | Running task 2
POST task 3   | Running task 2
DELETE task 2 | Running task 3
DELETE task 3 | -
-             | -
```
