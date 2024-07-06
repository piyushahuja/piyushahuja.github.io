---
layout: post-normal
title: Python Asyncio
date:   2021-05-27 09:00:11
tag: 
categories: pl
excerpt: 
permalink: /asyncio
comments: false

---


**Cheatsheets** 

* [Dan's](https://cheat.readthedocs.io/en/latest/python/asyncio.html)
* [A Complete Walkthrough](https://realpython.com/async-io-python/)
* [I don't understand asyncio](https://lucumr.pocoo.org/2016/10/30/i-dont-understand-asyncio/)

# Some Useful Abstractions

**Coroutines**: Generalization of a subroutine: these are functions which can be paused during execution, and values can be yielded out or passed into them when they are paused or resumed. Calling a coroutine does not execute it, but returns a couroutine object (which we can use later). This is useful a coroutine can be suspended during the execution so that it waits for external processing (some routine in I/O) and returns from the point at which it had stopped when the external processing was done.

**A couroutine is a generalization of a subroutine to include routines that can be paused (when it yields values) and resumed later (when accept values)**. This generalization helps us in **implementing cooperative multitasking** ([as opposed to](https://stackoverflow.com/questions/46074841/why-coroutines-cannot-be-used-with-run-in-executor) blocking code or preemptive multitasking like the threading model): e.g. in the case of a network operation, it helps to pause and do some other stuff while we are waiting for a response. **Coroutine has little to do with writing async code in a linear way or avoiding callback hell.**

**Not every function executed asynchronously is a coroutine**. A couroutine is specific model of asynchronous implementation (cooperative multitasking implemented by awaitables). A function can also be executed asynchronously by threads (shared memory) or processes (independent memory spaces but containing one or more threads), which implement pre-emptive multitasking, implemented using callables. 


**Futures:** It is like a promise. A future is an object that represents something uncompleted. It makes it easy for code in one place to indicate when the work is done, and optionally what the result was, and for code elsewhere that was interested in it to find out about it. It allows us to avoid callback hell. ``ensure_future` returns a Future object to which we can add a callback to using `add_done_callback `

**A future/promise is a placeholder/container which allows us to  writing async code in a linear way and avoid callback hell.** While waiting for a network I/O, a coroutine function can return a container(promise) which will fill with the value when the operation is complete. This container can be acted upon on when its filled in: and we can attach such methods on the placeholder.  [Difference between coroutine and futue](https://stackoverflow.com/questions/34753401/difference-between-coroutine-and-future-task-in-python-3-5)

**Couroutine Object**: A couroutine object subclasses a future. To execute a coroutine object, either:
* use it in an expression with await in front of it, or
* schedule it with `ensure_future()` or `create_task()`.

**Task:** A Task is a way to arrange for a coroutine to be executed by an event loop, while also providing the caller a way to find out what the result was.  This is a subclass of asyncio that is used to encapsulate and manage coroutines in a parallel mode. Event loops use cooperative scheduling: an event loop only runs one task at a time. Other tasks may run in parallel if other event loops are running in different threads. A task is automatically scheduled for execution when it is created. There are two ways to do this, which seem equivalent as far as I can tell:future = )
* `loop.create_task(coroutine)`
* ``asyncio.ensure_future(coroutine[, loop=loop]) `

**Event Loop**: All async coroutines can only run inside an event loop. Event loop is an object that manages cooperative multitasking. Event loops run (1) asynchronous tasks and callbacks, (2) perform network IO operations, and  (3) run subprocesses.  The Asyncio module allows a single event loop per process.


---

# Top Level Asyncio API

`asyncio.run()`: Application developers should typically use this (as opposed to referring directly to the loop object). This function runs the passed coroutine, taking care of managing the asyncio event loop and finalizing asynchronous generators. This function always creates a new event loop and closes it at the end. It should be used as a main entry point for asyncio programs, and should ideally only be called once.

`asyncio.gather()`: Returns a Future instance, allowing high level grouping of tasks

`asyncio.wait()`: Supports waiting to be stopped after the first task is done, or after a specified timeout, allowing lower level precision of operations:
asyncio.

`asyncio.create_task(coro)`. when using `ensure_future`, exceptions will not crash the system and might go unnoticed. 

If you have something that could either be a coroutine or a Future (the latter includes a Task because that's a subclass of Future), and you want to be able to call a method on it that is only defined on Future (probably about the only useful example being `cancel()`). When it is already a Future (or Task) this does nothing; when it is a coroutine it wraps it in a Task. `ensure_future()` The only time when you should be calling `ensure_future()` is when you are providing an API (like most of asyncio's own APIs) that accepts either a coroutine or a Future and you need to do something to it that requires you to have a Future. [Link](https://stackoverflow.com/questions/36342899/asyncio-ensure-future-vs-baseeventloop-create-task-vs-simple-coroutine)


`asyncio.Task.all_tasks()`

* [wait() vs gather()](https://stackoverflow.com/questions/42231161/asyncio-gather-vs-asyncio-wait/42246632)
* [In exception handling](https://stackoverflow.com/questions/30361824/asynchronous-exception-handling-in-python)

----

# Loop API

**Loop Object APIs for Handling Futures**

`loop.run_until_complete(future)` Run until the future (an instance of Future) has completed.  if the loop isn’t already running and you just want to run the loop for this one thing, you can now. f you want to compute some finite work using coroutines and then stop, use loop.run_until_complete(<future or coroutine>).

`loop.run_until_complete(future)` If the argument is a coroutine object it is implicitly scheduled to run as a asyncio.Task.
Return the Future’s result or raise its exception.


`loop.run_forever()` Run the event loop until `stop()` is called. If you want a long-running loop that keeps responding to events until it’s told to stop, use loop.run_forever().
If `stop()` is called before `run_forever()` is called, the loop will poll the I/O selector once with a timeout of zero, run all callbacks scheduled in response to I/O events (and those that were already scheduled), and then exit.
If stop() is called while `run_forever()` is running, the loop will run the current batch of callbacks and then exit. Note that new callbacks scheduled by callbacks will not run in this case; instead, they will run the next time `run_forever()` or `run_until_complete()` is called.


`loop.create_future()`
Create an asyncio.Future object attached to the event loop. This is the preferred way to create Futures in asyncio. This lets third-party event loops provide alternative implementations of the Future object (with better performance or instrumentation).
 
`loop.create_task(coro)`
Schedule the execution of a Coroutines. Return a Task object.  If you know that you have a coroutine and you want it to be scheduled, the correct API to use is create_task(). Third-party event loops can use their own subclass of Task for interoperability. In this case, the result type is a subclass of Task.  

If you know that you have a coroutine and you want it to be scheduled, the correct API to use is `loop.create_task()`. The only time when you should be calling `ensure_future()` is when you are providing an API (like most of asyncio's own APIs) that accepts either a coroutine or a Future and you need to do something to it that requires you to have a Future.

**Event Loop APIs for Networking**

`loop.create_server(protocol_factory, host=None, port=None, *, family=socket.AF_UNSPEC, flags=socket.AI_PASSIVE, sock=None, backlog=100, ssl=None, reuse_address=None, reuse_port=None, ssl_handshake_timeout=None, start_serving=True)`
Create a TCP server (socket type SOCK_STREAM) listening on port of the host address.
Returns a Server object.

**Event Loop APIs  for Executing code in thread or process pools**

awaitable `loop.run_in_executor(executor, func, *args)`
Arrange for func to be called in the specified executor.
The executor argument should be an concurrent.futures.Executor instance. The default executor is used if executor is None.

[Event Loop APIs for Running Subprocesses](https://docs.python.org/3/library/asyncio-eventloop.html#running-subprocesses)

----

# Use Cases

* [webcrawler](https://medium.com/python-pandemonium/asyncio-coroutine-patterns-beyond-await-a6121486656f)
* Q: I am opening a file which has 100,000 URL's. I need to send an HTTP request to each URL and print the status code. 
> A: Threads are absolutely not the answer here. They will provide both process and kernel bottlenecks, as well as throughput limits that are not acceptable if the overall goal is "the fastest way".

----

[Graceful shutdown](https://stackoverflow.com/questions/39857796/use-asyncio-update-some-data-timely-and-present-via-aiohttp)

Stopping aiohttp web server by just closing all connections is not always satisfactory. The problem is: if application supports websockets or data streaming it most likely has open connections at server shutdown time.

The library has no knowledge how to close them gracefully but developer can help by registering `Application.on_shutdown` signal handler and call the signal on web server closing.

Developer should keep a list of opened connections (Application is a good candidate).

The following websocket snippet shows an example for websocket handler:

```
from aiohttp import web
import weakref

app = web.Application()
app['websockets'] = weakref.WeakSet()

async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    request.app['websockets'].add(ws)
    try:
        async for msg in ws:
            ...
    finally:
        request.app['websockets'].discard(ws)

    return ws
```

Signal handler may look like:

```
from aiohttp import WSCloseCode

async def on_shutdown(app):
    for ws in set(app['websockets']):
        await ws.close(code=WSCloseCode.GOING_AWAY,
                       message='Server shutdown')

app.on_shutdown.append(on_shutdown)
```

Both run_app() and AppRunner.cleanup() call shutdown signal handlers.


you’ll want your service to gracefully shutdown if it receives a POSIX signal of some sort, e.g. clean up open database connections, stop consuming messages, finish responding to current requests while not accepting new requests, etc. So, if we happen to restart an instance of our own service, we should clean up the “mess” we’ve made before exiting out.  We’ve been catching the commonly-known KeyboardInterrupt exception like many other tutorials and libraries. But there are many common signals that a service should expect and handled. A few typical ones are (descriptions from man signal):
`SIGHUP` - Hangup detected on controlling terminal or death of controlling process
`SIGQUIT` - Quit from keyboard (via `^\`)
`SIGTERM` - Termination signal
`SIGINT` - Interrupt program

There’s also SIGKILL (i.e. the familiar `kill -9`) and `SIGSTOP`, although the standard is that they can’t be caught, blocked, or ignored.
Currently, if we quit our service via `^\` or send a signal via something like `pkill -TERM -f <script path>`, our service doesn’t get a chance to clean up:

Graceful Shutdown

```python
 try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.close()
        loop.run_until_complete(srv.wait_closed())
        loop.run_until_complete(app.shutdown())
        loop.run_until_complete(handler.finish_connections(60.0))
        loop.run_until_complete(app.cleanup())
    loop.close()


def main():
    loop = asyncio.get_event_loop()
    # May want to catch other signals too
    signals = (signal.SIGHUP, signal.SIGTERM, signal.SIGINT)
    for s in signals:
        loop.add_signal_handler(
            s, lambda s=s: asyncio.create_task(shutdown(s, loop)))
    queue = asyncio.Queue()

    try:
        loop.create_task(publish(queue))
        loop.create_task(consume(queue))
        loop.run_forever()
    finally:
        loop.close()
        logging.info("Successfully shutdown the Mayhem service.")  async def shutdown(signal, loop):
    """Cleanup tasks tied to the service's shutdown."""
    logging.info(f"Received exit signal {signal.name}...")
    logging.info("Closing database connections")
    logging.info("Nacking outstanding messages")
    tasks = [t for t in asyncio.all_tasks() if t is not
             asyncio.current_task()]

    [task.cancel() for task in tasks]

    logging.info(f"Cancelling {len(tasks)} outstanding tasks")
    await asyncio.gather(*tasks)
    logging.info(f"Flushing metrics")
    loop.stop()


async def shutdown(signal, loop):
    """Cleanup tasks tied to the service's shutdown."""
    logging.info(f"Received exit signal {signal.name}...")
    logging.info("Closing database connections")
    logging.info("Nacking outstanding messages")
    tasks = [t for t in asyncio.all_tasks() if t is not
             asyncio.current_task()]

    [task.cancel() for task in tasks]

    logging.info(f"Cancelling {len(tasks)} outstanding tasks")
    await asyncio.gather(*tasks, return_exceptions=True)
    logging.info(f"Flushing metrics")
    loop.stop()
```

**How to run periodic background jobs**


 
AIOHTTP native application startup: 

Run both in the same event loop : Wrap the job in a coroutine and resume it after every hour on the same thread. If any request comes, suspend the job.  Sometimes there’s a need to perform some asynchronous operations just after application start-up. Even more, in some sophisticated systems there could be a need to run some background tasks in the event loop along with the application’s request handler. Such as listening to message queue or other network message/event sources (e.g. ZeroMQ, Redis Pub/Sub, AMQP, etc.) to react to received messages within the application. 

For example, the background task could listen to ZeroMQ on zmq.SUB socket, process and forward retrieved messages to clients connected via WebSocket that are stored somewhere in the application (e.g. in the `application['websockets']` list). 

To run such short and long running background tasks aiohttp provides an ability to register `Application.on_startup` signal handler(s) that will run along with the application’s request handler.  For example there’s a need to run one quick task and two long running tasks that will live till the application is alive. The appropriate background tasks could be registered as an `Application.on_startup` signal handlers as shown in the example below: 

```python
async def listen_to_redis(app):
    try:
        sub = await aioredis.create_redis(('localhost', 6379))
        ch, *_ = await sub.subscribe('news')
        async for msg in ch.iter(encoding='utf-8'):
            # Forward message to all connected websockets:
            for ws in app['websockets']:
                ws.send_str('{}: {}'.format(ch.name, msg))
    except asyncio.CancelledError:
        pass
    finally:
        await sub.unsubscribe(ch.name)
        await sub.quit()


async def start_background_tasks(app):
    app['redis_listener'] = asyncio.create_task(listen_to_redis(app))


async def cleanup_background_tasks(app):
    app['redis_listener'].cancel()
    await app['redis_listener']


app = web.Application()
app.on_startup.append(start_background_tasks)
app.on_cleanup.append(cleanup_background_tasks)
web.run_app(app)
```

The task `listen_to_redis()` will run forever. To shut it down correctly `Application.on_cleanup` signal handler may be used to send a cancellation to it


**Method: Create_task**

````
import asyncio

async def periodic():
    while True:
        print('periodic')
        await asyncio.sleep(1)

def stop():
    task.cancel()

loop = asyncio.get_event_loop()
loop.call_later(5, stop)
task = loop.create_task(periodic())

try:
    loop.run_until_complete(task)
except asyncio.CancelledError:
    pass
````

**Method: Ensure_future Have a task and a main server in the same event loop (Check: Would this work?)**

```python
async def data_updater(app):
    while True:
        await asyncio.sleep(3)
        app["userfeed"] = [x for x in range(random.randint(1, 20))] 
async def init(loop, port=8000):
    app = web.Application(loop=loop)
    app.router.add_route('GET', '/', web_handle)
    handler = app.make_handler()
    srv = await loop.create_server(
        handler, '127.0.0.1', port=port)
    return srv, app, handler

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    srv, app, handler = loop.run_until_complete(init(loop, 8000))
    app['userfeed'] = []
    asyncio.ensure_future(data_updater(app))
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.close()
        loop.run_until_complete(srv.wait_closed())
        loop.run_until_complete(app.shutdown())
        loop.run_until_complete(handler.finish_connections(60.0))
        loop.run_until_complete(app.cleanup())
    loop.close()
```


**Method: Spawn a new thread (Thread 2) and run the task in it.** 
The new task can run a blocking task as it won’t affect the event loop in  the main thread, or it can create its own event loop. “`The AbstractEventLoop.run_in_executor()` method can be used with a thread pool executor to execute a callback in different thread to not block the thread of the event loop.”. Spawn a new thread. Run an event loop on that thread. Wrap the job in a coroutine which runs forever (after every hour).

In this example, the separate thread runs an infinite loop.   
```python
from concurrent.futures import ThreadPoolExecutor

main_event_loop = asyncio.get_event_loop()
executor = ThreadPoolExecutor(max_workers=1)
main_event_loop.run_in_executor(executor, utils.run_blocking_tasks, update_cluster)
```

Example For Multithreading

```python
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=5)
futures = [
        loop.run_in_executor(executor, run, asyncio.sleep, 1, x)
        for x in range(10)]
```


**Method: Spawn a new background thread using  `threading.Timer`**


```
t = threading.Timer(time, function)
t.start()
t.daemon = true

threading.Thread

t = threading.Event()
t.wait(time)
```


**schedule module or Apscheduler module or Celery**


