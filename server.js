const http = require('http');

const taskList = [];

function onDelete(task, response) {
  const newTaskList = taskList.filter(eachTask => eachTask !== task);

  if (newTaskList.length === taskList.length) {
    response.statusCode = 404; // Not Found
    response.end(JSON.stringify({
      error: 'task not found'
    }));
    return;
  }

  response.statusCode = 410; // Gone
  response.end(JSON.stringify({
    reply: 'task removed'
  }));
}

function onGet(task, response) {
  const currentTask = taskList[0];

  if (currentTask !== task) {
    response.statusCode = 425; // Too Early
    response.end(JSON.stringify({
      error: 'task is yet to execute'
    }));
    return;
  }

  response.statusCode = 200; // OK
  response.end(JSON.stringify({
    reply: 'task is currently in execution'
  }));
}

function onPost(task, response) {
  if (taskList.findIndex(eachTask => eachTask === task) !== -1) {
    response.statusCode = 302; // Found
    response.end(JSON.stringify({
      error: 'task already exists'
    }));
    return;
  }

  const newTaskList = taskList.push(task);

  response.statusCode = 201; // Created
  response.end(JSON.stringify({
    reply: 'task added'
  }));
}

function onUnimplemented(task, response) {
  response.statusCode = 501; // Not Implemented
  response.end(JSON.stringify({
    error: 'not implemented'
  }));
}

function parseRequest(request) {
  const requestUrl = new URL(request.url, `https://${request.headers.host}`);
  const taskId = requestUrl.searchParams.get('taskId');
  return taskId;
}

function onRequest(request, response) {
  response.setHeader('Content-Type', 'application/json');

  const taskId = parseRequest(request);
  if (!taskId) {
    response.statusCode = 400; // Bad Request
    response.end(JSON.stringify({
      error: 'taskId must be passed'
    }));
    return;
  }

  const handler = {
    DELETE: onDelete,
    GET: onGet,
    POST: onPost,
  }[request.method] || onUnimplemented;

  handler(taskId, response);
}

const server = http.createServer();
server.on('request', onRequest);
server.listen(process.env.PORT || 8080);
